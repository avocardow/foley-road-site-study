import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import data from "./site-data.json";
import concepts from "./concepts/index.js";

const canvas = document.querySelector("#model");
const loading = document.querySelector("#loading");
const error = document.querySelector("#error");
const scaleLine = document.querySelector("#scale-line");
const scaleLabel = document.querySelector("#scale-label");
const northNeedle = document.querySelector("#north-needle");
const scene = new THREE.Scene();
scene.background = new THREE.Color("#151c1a");

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

const camera = new THREE.PerspectiveCamera(38, 1, 1, 3000);
camera.up.set(0, 1, 0);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 18;
controls.maxDistance = 430;
controls.maxPolarAngle = Math.PI * 0.48;

scene.add(new THREE.HemisphereLight(0xe3ead6, 0x272b28, 2.1));
const sun = new THREE.DirectionalLight(0xffebc8, 3.1);
sun.position.set(-70, 110, -55);
scene.add(sun);
const fill = new THREE.DirectionalLight(0xb1c9a2, 1.2);
fill.position.set(70, 45, 90);
scene.add(fill);

const terrainGroup = new THREE.Group();
const contoursGroup = new THREE.Group();
const clearingGroup = new THREE.Group();
const treesGroup = new THREE.Group();
const padGroup = new THREE.Group();
const roadGroup = new THREE.Group();
const easementGroup = new THREE.Group();
const aerialGroup = new THREE.Group();
const boundaryGroup = new THREE.Group();
scene.add(terrainGroup, contoursGroup, clearingGroup, treesGroup, padGroup, roadGroup, easementGroup, aerialGroup, boundaryGroup);

function makeTerrain(data) {
  const position = new Float32Array(data.points.length * 3);
  const colors = new Float32Array(data.points.length * 3);
  const low = data.elevationRangeM[0];
  const high = data.elevationRangeM[1];
  const lowColor = new THREE.Color("#526755");
  const midColor = new THREE.Color("#879777");
  const highColor = new THREE.Color("#c1c89c");
  data.points.forEach(([x, y, z], i) => {
    position.set([x, y, z], i * 3);
    const t = (y - low) / Math.max(high - low, 1);
    const color = t < 0.55 ? lowColor.clone().lerp(midColor, t / 0.55) : midColor.clone().lerp(highColor, (t - 0.55) / 0.45);
    colors.set([color.r, color.g, color.b], i * 3);
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setIndex(data.faces.flat());
  geometry.computeVertexNormals();
  const surface = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.96, metalness: 0, side: THREE.DoubleSide }));
  terrainGroup.add(surface);

  const baseY = low - 2.4;
  const wallPositions = [];
  data.boundary.forEach(([x1, y1, z1], i) => {
    const [x2, y2, z2] = data.boundary[(i + 1) % data.boundary.length];
    wallPositions.push(x1,y1,z1, x2,y2,z2, x1,baseY,z1, x2,y2,z2, x2,baseY,z2, x1,baseY,z1);
  });
  const walls = new THREE.BufferGeometry();
  walls.setAttribute("position", new THREE.Float32BufferAttribute(wallPositions, 3));
  walls.computeVertexNormals();
  terrainGroup.add(new THREE.Mesh(walls, new THREE.MeshStandardMaterial({ color: "#47483e", roughness: 1, side: THREE.DoubleSide })));

  const bottomGeometry = new THREE.BufferGeometry();
  bottomGeometry.setAttribute("position", new THREE.Float32BufferAttribute(data.boundary.flatMap(([x, y, z]) => [x, baseY, z]), 3));
  bottomGeometry.setIndex([0, 1, 2]);
  bottomGeometry.computeVertexNormals();
  terrainGroup.add(new THREE.Mesh(bottomGeometry, new THREE.MeshStandardMaterial({ color: "#373a34", roughness: 1, side: THREE.DoubleSide })));
  return geometry;
}

function makeParcelBoundary(data, sampleHeight) {
  const points = [];
  data.boundary.forEach(([ax, , az], index) => {
    const [bx, , bz] = data.boundary[(index + 1) % data.boundary.length];
    const steps = Math.ceil(Math.hypot(bx - ax, bz - az));
    for (let step = 0; step < steps; step++) {
      const t = step / steps;
      const x = ax + (bx - ax) * t, z = az + (bz - az) * t;
      points.push(new THREE.Vector3(x, sampleHeight(x, z) + 0.42, z));
    }
  });
  const curve = new THREE.CatmullRomCurve3(points, true, "catmullrom", 0);
  const geometry = new THREE.TubeGeometry(curve, points.length, 0.22, 6, true);
  const outline = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: "#59d9cc", toneMapped: false, depthTest: false, depthWrite: false }));
  outline.renderOrder = 20;
  boundaryGroup.add(outline);
  const markerGeometry = new THREE.SphereGeometry(0.48, 12, 8);
  const markerMaterial = new THREE.MeshBasicMaterial({ color: "#59d9cc", toneMapped: false, depthTest: false, depthWrite: false });
  data.boundary.forEach(([x, , z]) => {
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    marker.position.set(x, sampleHeight(x, z) + 0.42, z);
    marker.renderOrder = 20;
    boundaryGroup.add(marker);
  });
}

function makeContours(data) {
  const lines = [];
  const min = Math.ceil(data.elevationRangeM[0]);
  const max = Math.floor(data.elevationRangeM[1]);
  for (let level = min; level <= max; level++) {
    for (const face of data.faces) {
      const vertices = face.map((index) => data.points[index]);
      const hits = [];
      for (let edge = 0; edge < 3; edge++) {
        const a = vertices[edge];
        const b = vertices[(edge + 1) % 3];
        if ((a[1] < level && b[1] >= level) || (b[1] < level && a[1] >= level)) {
          const t = (level - a[1]) / (b[1] - a[1]);
          hits.push([a[0] + (b[0] - a[0]) * t, level + 0.09, a[2] + (b[2] - a[2]) * t]);
        }
      }
      if (hits.length === 2) lines.push(...hits[0], ...hits[1]);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(lines, 3));
  contoursGroup.add(new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({ color: "#edf0d7", transparent: true, opacity: 0.42 })));
}

function terrainSampler(data) {
  const cellSize = 5;
  const buckets = new Map();
  const key = (x, z) => `${Math.floor(x / cellSize)},${Math.floor(z / cellSize)}`;
  data.faces.forEach((face) => {
    const vertices = face.map((index) => data.points[index]);
    const minX = Math.floor(Math.min(...vertices.map((v) => v[0])) / cellSize);
    const maxX = Math.floor(Math.max(...vertices.map((v) => v[0])) / cellSize);
    const minZ = Math.floor(Math.min(...vertices.map((v) => v[2])) / cellSize);
    const maxZ = Math.floor(Math.max(...vertices.map((v) => v[2])) / cellSize);
    for (let x = minX; x <= maxX; x++) for (let z = minZ; z <= maxZ; z++) {
      const bucketKey = `${x},${z}`;
      if (!buckets.has(bucketKey)) buckets.set(bucketKey, []);
      buckets.get(bucketKey).push(vertices);
    }
  });
  const cache = new Map();
  return (x, z) => {
    const cacheKey = `${x.toFixed(3)},${z.toFixed(3)}`;
    if (cache.has(cacheKey)) return cache.get(cacheKey);
    for (const [a, b, c] of buckets.get(key(x, z)) ?? []) {
      const v0x = b[0] - a[0], v0z = b[2] - a[2];
      const v1x = c[0] - a[0], v1z = c[2] - a[2];
      const v2x = x - a[0], v2z = z - a[2];
      const denominator = v0x * v1z - v1x * v0z;
      const u = (v2x * v1z - v1x * v2z) / denominator;
      const v = (v0x * v2z - v2x * v0z) / denominator;
      if (u >= -1e-5 && v >= -1e-5 && u + v <= 1.00001) {
        const y = a[1] + u * (b[1] - a[1]) + v * (c[1] - a[1]);
        cache.set(cacheKey, y);
        return y;
      }
    }
    return data.points.reduce((nearest, point) => {
      const distance = (point[0] - x) ** 2 + (point[2] - z) ** 2;
      return !nearest || distance < nearest.distance ? { point, distance } : nearest;
    }, null).point[1];
  };
}

// Ground around the lot comes from a 2 m DEM grid. The skirt that carries the draped
// photos is built as rings offset from the lot boundary, so it joins the lot terrain exactly.
function makeGround(data, sampleHeight) {
  const corners = data.boundary;
  const { spacingM, columns, rows, originX, originZ, heightsCm } = data.ground;
  const bytes = Uint8Array.from(atob(heightsCm), (char) => char.charCodeAt(0));
  const heights = new Int16Array(bytes.buffer);
  const demHeight = (x, z) => {
    const column = THREE.MathUtils.clamp((x - originX) / spacingM, 0, columns - 1.001);
    const row = THREE.MathUtils.clamp((z - originZ) / spacingM, 0, rows - 1.001);
    const c = Math.floor(column), r = Math.floor(row), fc = column - c, fr = row - r;
    const at = (rr, cc) => heights[rr * columns + cc] / 100;
    return (at(r, c) * (1 - fc) + at(r, c + 1) * fc) * (1 - fr) + (at(r + 1, c) * (1 - fc) + at(r + 1, c + 1) * fc) * fr;
  };
  const height = (x, z) => insidePolygon(x, z, corners) ? sampleHeight(x, z) : demHeight(x, z);

  const orientation = Math.sign(corners.reduce((sum, [x, , z], i) => {
    const [nextX, , nextZ] = corners[(i + 1) % corners.length];
    return sum + x * nextZ - nextX * z;
  }, 0));
  const edges = corners.map((a, index) => {
    const b = corners[(index + 1) % corners.length];
    const dx = b[0] - a[0], dz = b[2] - a[2];
    const lengthSquared = dx * dx + dz * dz, length = Math.sqrt(lengthSquared);
    // Terrain vertices that lie on this edge, ordered from a to b.
    const profile = data.points
      .map((point) => ({ point, t: ((point[0] - a[0]) * dx + (point[2] - a[2]) * dz) / lengthSquared, offset: Math.abs((point[0] - a[0]) * dz - (point[2] - a[2]) * dx) / length }))
      .filter(({ t, offset }) => offset < 2e-3 && t > -1e-4 && t < 1 + 1e-4)
      .sort((p, q) => p.t - q.t);
    return { outward: [orientation * dz / length, -orientation * dx / length], profile };
  });
  const base = [];
  edges.forEach((edge, index) => {
    edge.profile.forEach(({ point }) => base.push({ point, direction: edge.outward }));
    const next = edges[(index + 1) % edges.length].outward;
    const start = Math.atan2(edge.outward[1], edge.outward[0]);
    const turn = Math.atan2(edge.outward[0] * next[1] - edge.outward[1] * next[0], edge.outward[0] * next[0] + edge.outward[1] * next[1]);
    const cornerPoint = edge.profile.at(-1).point;
    for (let step = 1; step < 36; step++) {
      const angle = start + turn * step / 36;
      base.push({ point: cornerPoint, direction: [Math.cos(angle), Math.sin(angle)] });
    }
  });
  const skirt = (reach) => {
    const offsets = [0];
    while (offsets.at(-1) < reach) {
      const last = offsets.at(-1);
      offsets.push(last + (last < 20 ? 1 : last < 60 ? 2 : last < 160 ? 4 : 8));
    }
    const positions = [];
    offsets.forEach((offset, ring) => {
      for (const { point: [x, y, z], direction: [dx, dz] } of base) {
        const px = x + dx * offset, pz = z + dz * offset;
        positions.push(px, ring === 0 ? y : demHeight(px, pz), pz);
      }
    });
    const indices = [];
    for (let ring = 0; ring < offsets.length - 1; ring++) for (let i = 0; i < base.length; i++) {
      const a = ring * base.length + i, b = ring * base.length + (i + 1) % base.length;
      indices.push(a, b, b + base.length, a, b + base.length, a + base.length);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    return geometry;
  };
  return { height, skirt };
}

// Fill a polygon as a mesh that follows the ground, cut into small cells.
function drapePolygon(polygon, heightAt, lift, step = 1.5) {
  const bounds = polygon.reduce((b, [x, z]) => ({ minX: Math.min(b.minX, x), maxX: Math.max(b.maxX, x), minZ: Math.min(b.minZ, z), maxZ: Math.max(b.maxZ, z) }), { minX: Infinity, maxX: -Infinity, minZ: Infinity, maxZ: -Infinity });
  const clip = (points, axis, limit, greater) => {
    const result = [];
    for (let i = 0; i < points.length; i++) {
      const current = points[i], previous = points[(i + points.length - 1) % points.length];
      const inside = (point) => greater ? point[axis] >= limit : point[axis] <= limit;
      if (inside(current) !== inside(previous)) {
        const t = (limit - previous[axis]) / (current[axis] - previous[axis]);
        result.push([previous[0] + t * (current[0] - previous[0]), previous[1] + t * (current[1] - previous[1])]);
      }
      if (inside(current)) result.push(current);
    }
    return result;
  };
  const positions = [];
  const startX = Math.floor(bounds.minX / step) * step;
  const startZ = Math.floor(bounds.minZ / step) * step;
  for (let x = startX; x < bounds.maxX; x += step) for (let z = startZ; z < bounds.maxZ; z += step) {
    let cell = polygon;
    cell = clip(cell, 0, x, true); cell = clip(cell, 0, x + step, false);
    cell = clip(cell, 1, z, true); cell = clip(cell, 1, z + step, false);
    if (cell.length < 3) continue;
    const vertices = cell.map(([px, pz]) => [px, heightAt(px, pz) + lift, pz]);
    for (let i = 1; i < vertices.length - 1; i++) positions.push(...vertices[0], ...vertices[i], ...vertices[i + 1]);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  return geometry;
}

// Outline points that follow the ground, subdivided so lines do not cut through slopes.
function drapeOutline(polygon, heightAt, lift) {
  const points = [];
  polygon.forEach(([ax, az], i) => {
    const [bx, bz] = polygon[(i + 1) % polygon.length];
    const steps = Math.max(1, Math.ceil(Math.hypot(bx - ax, bz - az)));
    for (let k = 0; k < steps; k++) {
      const x = ax + (bx - ax) * k / steps, z = az + (bz - az) * k / steps;
      points.push(new THREE.Vector3(x, heightAt(x, z) + lift, z));
    }
  });
  return new THREE.BufferGeometry().setFromPoints(points);
}

function makeClearing(data, sampleHeight) {
  let polygon = data.clearedArea.map(([x, , z]) => [x, z]);
  const parcel = data.boundary.map(([x, , z]) => [x, z]);
  const orientation = Math.sign(parcel.reduce((sum, [x, z], i) => {
    const [nextX, nextZ] = parcel[(i + 1) % parcel.length];
    return sum + x * nextZ - nextX * z;
  }, 0));
  for (let i = 0; i < parcel.length; i++) {
    const a = parcel[i], b = parcel[(i + 1) % parcel.length];
    const side = ([x, z]) => orientation * ((b[0] - a[0]) * (z - a[1]) - (b[1] - a[1]) * (x - a[0]));
    const clipped = [];
    for (let j = 0; j < polygon.length; j++) {
      const current = polygon[j], previous = polygon[(j + polygon.length - 1) % polygon.length];
      const currentSide = side(current), previousSide = side(previous);
      if ((currentSide >= 0) !== (previousSide >= 0)) {
        const t = previousSide / (previousSide - currentSide);
        clipped.push([previous[0] + t * (current[0] - previous[0]), previous[1] + t * (current[1] - previous[1])]);
      }
      if (currentSide >= 0) clipped.push(current);
    }
    polygon = clipped;
  }
  clearingGroup.add(new THREE.Mesh(drapePolygon(polygon, sampleHeight, 0.12), new THREE.MeshStandardMaterial({ color: "#a9a274", transparent: true, opacity: 0.62, roughness: 1, side: THREE.DoubleSide, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1 })));
  const outline = new THREE.LineLoop(drapeOutline(polygon, sampleHeight, 0.2), new THREE.LineDashedMaterial({ color: "#f3d39c", dashSize: 2.1, gapSize: 1.1, transparent: true, opacity: 0.95 }));
  outline.computeLineDistances();
  clearingGroup.add(outline);
}

function insidePolygon(x, z, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, , zi] = polygon[i];
    const [xj, , zj] = polygon[j];
    if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) inside = !inside;
  }
  return inside;
}

function makeTrees(data, sampleHeight) {
  // Individual trees are illustrative. The photo shows unbroken canopy apart from the
  // traced clearing, so trees line the clearing edge and the lot edges, then an even
  // jittered fill closes the canopy. Crowns stop at the clearing edge.
  let seed = 353650;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const bounds = data.boundary.reduce((b, [x, , z]) => ({
    minX: Math.min(b.minX, x), maxX: Math.max(b.maxX, x),
    minZ: Math.min(b.minZ, z), maxZ: Math.max(b.maxZ, z),
  }), { minX: Infinity, maxX: -Infinity, minZ: Infinity, maxZ: -Infinity });
  const clearing = data.clearedArea;
  const clearingDistance = (x, z) => Math.min(...clearing.map(([ax, , az], i) => {
    const [bx, , bz] = clearing[(i + 1) % clearing.length];
    const dx = bx - ax, dz = bz - az;
    const t = THREE.MathUtils.clamp(((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz), 0, 1);
    return Math.hypot(x - (ax + t * dx), z - (az + t * dz));
  }));
  const trees = [];
  const crown = () => {
    const radius = 2.4 + random() * 1.3;
    const depth = radius * (0.82 + random() * 0.3);
    return { radius, depth, reach: Math.max(radius, depth) };
  };
  const addTree = (x, z, { radius, depth, reach } = crown()) => {
    if (!insidePolygon(x, z, data.boundary) || insidePolygon(x, z, clearing) || insidePolygon(x, z, data.pad)) return;
    if (clearingDistance(x, z) < reach * 0.95) return;
    if (trees.some((tree) => Math.hypot(tree.x - x, tree.z - z) < 2.2)) return;
    trees.push({ x, z, y: sampleHeight(x, z), radius, depth, tone: random() });
  };

  // Walk a closed outline, adding a tree every `spacing` metres at a chosen offset from it.
  const lineOutline = (outline, spacing, offsetFor) => {
    const orientation = Math.sign(outline.reduce((sum, [x, , z], i) => {
      const [nextX, , nextZ] = outline[(i + 1) % outline.length];
      return sum + x * nextZ - nextX * z;
    }, 0));
    let untilNext = 0;
    outline.forEach(([ax, , az], i) => {
      const [bx, , bz] = outline[(i + 1) % outline.length];
      const dx = bx - ax, dz = bz - az, length = Math.hypot(dx, dz);
      const outwardX = orientation * dz / length, outwardZ = -orientation * dx / length;
      let along = untilNext;
      for (; along < length; along += spacing) {
        const size = crown();
        const offset = offsetFor(size);
        addTree(ax + dx * along / length + outwardX * offset, az + dz * along / length + outwardZ * offset, size);
      }
      untilNext = along - length;
    });
  };
  lineOutline(clearing, 3.2, (size) => size.reach);
  lineOutline(data.boundary, 3.4, () => -1.2 - random() * 0.8);
  const spacing = 4.2;
  for (let x = bounds.minX; x <= bounds.maxX; x += spacing) for (let z = bounds.minZ; z <= bounds.maxZ; z += spacing) {
    addTree(x + (random() - 0.5) * 2.6, z + (random() - 0.5) * 2.6);
  }

  const trunkGeometry = new THREE.CylinderGeometry(0.24, 0.38, 1, 5);
  const trunkMaterial = new THREE.MeshStandardMaterial({ color: "#554537", roughness: 1 });
  const trunks = new THREE.InstancedMesh(trunkGeometry, trunkMaterial, trees.length);
  const crownGeometry = new THREE.IcosahedronGeometry(1, 1);
  const crownMaterial = new THREE.MeshStandardMaterial({ roughness: 1, flatShading: true });
  const crowns = new THREE.InstancedMesh(crownGeometry, crownMaterial, trees.length);
  const palette = ["#314b35", "#3d5b3e", "#496645", "#58704b", "#40563a"];
  const matrix = new THREE.Matrix4();
  const position = new THREE.Vector3();
  const rotation = new THREE.Quaternion();
  const scale = new THREE.Vector3();
  const color = new THREE.Color();
  trees.forEach((tree, index) => {
    const height = 7.2 + random() * 2.4;
    position.set(tree.x, tree.y + height / 2, tree.z);
    scale.set(1, height, 1);
    matrix.compose(position, rotation, scale);
    trunks.setMatrixAt(index, matrix);
    position.set(tree.x, tree.y + height + 1.5 + random() * 0.7, tree.z);
    scale.set(tree.radius, 3.0 + random() * 1.5, tree.depth);
    matrix.compose(position, rotation, scale);
    crowns.setMatrixAt(index, matrix);
    color.set(palette[Math.floor(tree.tone * palette.length)]);
    crowns.setColorAt(index, color);
  });
  trunks.instanceMatrix.needsUpdate = true;
  crowns.instanceMatrix.needsUpdate = true;
  treesGroup.add(trunks, crowns);
}

function makePad(data, sampleHeight) {
  const corners = data.pad;
  const columns = 6, rows = 6;
  const positions = [];
  const pointAt = (u, v) => {
    const x = (1 - v) * ((1 - u) * corners[0][0] + u * corners[1][0]) + v * ((1 - u) * corners[3][0] + u * corners[2][0]);
    const z = (1 - v) * ((1 - u) * corners[0][2] + u * corners[1][2]) + v * ((1 - u) * corners[3][2] + u * corners[2][2]);
    return [x, sampleHeight(x, z) + 0.18, z];
  };
  for (let row = 0; row < rows; row++) for (let column = 0; column < columns; column++) {
    const u0 = column / columns, u1 = (column + 1) / columns;
    const v0 = row / rows, v1 = (row + 1) / rows;
    const a = pointAt(u0, v0), b = pointAt(u1, v0), c = pointAt(u1, v1), d = pointAt(u0, v1);
    positions.push(...a, ...b, ...c, ...a, ...c, ...d);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  padGroup.add(new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: "#aeb0ac", roughness: 0.94, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -1 })));
}

// Roads follow the carriageway edges traced from the parcel aerial and sit on the DEM.
function makeRoadContext(data, groundHeight) {
  // Subdivided across the width too, so wide carriageways follow camber and cross-fall.
  const strip = (inner, outer, material, lift) => {
    const positions = [], indices = [];
    const across = Math.max(1, Math.ceil(Math.hypot(outer[0][0] - inner[0][0], outer[0][1] - inner[0][1]) / 1.5));
    inner.forEach(([x, z], i) => {
      const [ox, oz] = outer[i];
      for (let k = 0; k <= across; k++) {
        const px = x + (ox - x) * k / across, pz = z + (oz - z) * k / across;
        positions.push(px, groundHeight(px, pz) + lift, pz);
      }
      if (i === 0) return;
      for (let k = 0; k < across; k++) {
        const a = (i - 1) * (across + 1) + k, b = i * (across + 1) + k;
        indices.push(a, a + 1, b + 1, a, b + 1, b);
      }
    });
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    roadGroup.add(new THREE.Mesh(geometry, material));
  };
  const surface = { roughness: 0.98, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 };
  const asphalt = new THREE.MeshStandardMaterial({ color: "#454a48", ...surface });
  const verge = new THREE.MeshStandardMaterial({ color: "#a89878", ...surface });
  for (const road of data.roads) {
    strip(road.nearEdge, road.farEdge, asphalt, 0.25);
    if (road.farVerge) strip(road.farEdge, road.farVerge.outerEdge, verge, 0.2);
  }

  // Short access from the Foley Road carriageway to the pad at the road boundary.
  const foley = data.roads.find((road) => road.name === "Foley Road");
  const padCenter = data.pad.reduce((center, [x, , z]) => [center[0] + x / data.pad.length, center[1] + z / data.pad.length], [0, 0]);
  const distance = ([x, z]) => Math.hypot(x - padCenter[0], z - padCenter[1]);
  const entry = foley.nearEdge.reduce((nearest, point) => distance(point) < distance(nearest) ? point : nearest);
  const dx = padCenter[0] - entry[0], dz = padCenter[1] - entry[1], length = Math.hypot(dx, dz);
  const nx = -dz / length * 1.55, nz = dx / length * 1.55;
  const lane = [[entry[0] + nx, entry[1] + nz], [padCenter[0] + nx, padCenter[1] + nz], [padCenter[0] - nx, padCenter[1] - nz], [entry[0] - nx, entry[1] - nz]];
  padGroup.add(new THREE.Mesh(drapePolygon(lane, groundHeight, 0.16, 0.75), new THREE.MeshStandardMaterial({ color: "#898c87", roughness: 0.95, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -1 })));
}

// Registered easements from the cadastre, lettered as on the survey plan.
function makeEasements(data, groundHeight) {
  const fill = new THREE.MeshBasicMaterial({ color: "#f08a3c", transparent: true, opacity: 0.38, side: THREE.DoubleSide, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 });
  const line = new THREE.LineBasicMaterial({ color: "#ffb070" });
  for (const easement of data.easements) {
    easementGroup.add(new THREE.Mesh(drapePolygon(easement.polygon, groundHeight, 0.25, 0.5), fill));
    easementGroup.add(new THREE.LineLoop(drapeOutline(easement.polygon, groundHeight, 0.3), line));
    const label = document.createElement("canvas");
    label.width = label.height = 64;
    const context = label.getContext("2d");
    context.fillStyle = "#f08a3c";
    context.beginPath();
    context.arc(32, 32, 28, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#1b1712";
    context.font = "700 36px sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(easement.label, 32, 34);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(label), depthTest: false }));
    const [cx, cz] = easement.polygon.reduce((sum, [x, z]) => [sum[0] + x / easement.polygon.length, sum[1] + z / easement.polygon.length], [0, 0]);
    sprite.position.set(cx, groundHeight(cx, cz) + 6, cz);
    sprite.scale.set(4, 4, 1);
    sprite.renderOrder = 21;
    easementGroup.add(sprite);
  }
}

// Council constraint overlays and design-scale slope, painted into textures draped on the lot.
function makeConstraints(data, terrainGeometry, groundHeight) {
  const { grid, masks, slopeClasses, stream } = data.constraints;
  const scale = 4, count = grid.columns * grid.rows;
  const decode = (text) => Uint8Array.from(atob(text), (char) => char.charCodeAt(0));
  const position = terrainGeometry.getAttribute("position");
  const uvs = new Float32Array(position.count * 2);
  const x0 = grid.originX - grid.cellM / 2, z0 = grid.originZ - grid.cellM / 2;
  for (let i = 0; i < position.count; i++) {
    uvs[i * 2] = (position.getX(i) - x0) / (grid.columns * grid.cellM);
    uvs[i * 2 + 1] = (position.getZ(i) - z0) / (grid.rows * grid.cellM);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", position);
  geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(terrainGeometry.getIndex());

  const layer = (paint) => {
    const canvas = document.createElement("canvas");
    canvas.width = grid.columns * scale;
    canvas.height = grid.rows * scale;
    paint(canvas.getContext("2d"));
    const texture = new THREE.CanvasTexture(canvas);
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, toneMapped: false, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 }));
    mesh.renderOrder = 5;
    const group = new THREE.Group();
    group.add(mesh);
    scene.add(group);
    return group;
  };
  const cell = (context, i) => context.fillRect((i % grid.columns) * scale, Math.floor(i / grid.columns) * scale, scale, scale);
  const paintMask = (bits, fill, { hatch, edge } = {}) => (context) => {
    const on = (i) => i >= 0 && i < count && bits[i >> 3] & (1 << (i & 7));
    context.fillStyle = fill;
    for (let i = 0; i < count; i++) if (on(i)) cell(context, i);
    if (hatch) {
      context.globalCompositeOperation = "source-atop";
      context.strokeStyle = hatch;
      context.lineWidth = 3;
      for (let d = -context.canvas.height; d < context.canvas.width; d += 12) {
        context.beginPath();
        context.moveTo(d, 0);
        context.lineTo(d + context.canvas.height, context.canvas.height);
        context.stroke();
      }
      context.globalCompositeOperation = "source-over";
    }
    if (edge) {
      context.fillStyle = edge;
      for (let i = 0; i < count; i++) {
        const column = i % grid.columns;
        const outside = (column > 0 && !on(i - 1)) || (column < grid.columns - 1 && !on(i + 1)) || !on(i - grid.columns) || !on(i + grid.columns);
        if (on(i) && outside) cell(context, i);
      }
    }
  };

  const groups = {
    buildingZone: layer(paintMask(decode(masks.buildingZone), "rgba(120, 225, 140, 0.26)", { edge: "rgba(140, 240, 160, 0.95)" })),
    setbacks: layer(paintMask(decode(masks.setbacks), "rgba(15, 20, 18, 0.38)", { hatch: "rgba(255, 255, 255, 0.7)" })),
    overlandFlow: layer(paintMask(decode(masks.overlandFlow), "rgba(70, 140, 245, 0.38)", { edge: "rgba(130, 185, 255, 0.9)" })),
    floodBuffer: layer(paintMask(decode(masks.floodBuffer), "rgba(90, 120, 225, 0.12)", { hatch: "rgba(140, 170, 255, 0.55)" })),
    landslide: layer((context) => {
      paintMask(decode(masks.landslideModerate), "rgba(240, 175, 70, 0.26)")(context);
      paintMask(decode(masks.landslideHigh), "rgba(230, 75, 55, 0.42)", { edge: "rgba(255, 110, 90, 0.9)" })(context);
    }),
    bushfire: layer(paintMask(decode(masks.bushfireBuffer), "rgba(255, 125, 45, 0.3)", { edge: "rgba(255, 150, 80, 0.9)" })),
    slope: layer((context) => {
      const classes = decode(slopeClasses);
      const colors = [null, "rgba(80, 190, 110, 0.6)", "rgba(180, 215, 100, 0.6)", "rgba(240, 210, 90, 0.6)", "rgba(240, 150, 75, 0.6)", "rgba(225, 85, 70, 0.6)"];
      for (let i = 0; i < count; i++) if (classes[i]) { context.fillStyle = colors[classes[i]]; cell(context, i); }
    }),
  };

  // The mapped stream is drawn with the overland flow layer, where it crosses the lot.
  const points = [];
  stream.forEach(([ax, az], i) => {
    if (i === stream.length - 1) return;
    const [bx, bz] = stream[i + 1];
    const steps = Math.max(1, Math.ceil(Math.hypot(bx - ax, bz - az)));
    for (let k = 0; k <= steps; k++) {
      const x = ax + (bx - ax) * k / steps, z = az + (bz - az) * k / steps;
      if (insidePolygon(x, z, data.boundary)) points.push(new THREE.Vector3(x, groundHeight(x, z) + 0.4, z));
    }
  });
  groups.overlandFlow.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: "#6fb4ff" })));
  return groups;
}

const photoWidth = 1384, photoHeight = 952, photoCropY = 15;

function applyProjective(matrix, x, y) {
  const point = new THREE.Vector3(x, y, 1).applyMatrix3(matrix);
  return [point.x / point.z, point.y / point.z];
}

// Pixel-to-site transform fixed by three corresponding points.
function affineFromPairs(pixels, sites) {
  const rows = (points) => new THREE.Matrix3().set(...points.map(([x]) => x), ...points.map(([, y]) => y), 1, 1, 1);
  return rows(sites).multiply(rows(pixels).invert());
}

// Photos are draped onto the terrain and the surrounding ground, so they line up with
// the model from any viewpoint rather than floating above it.
function makeAerialPhoto({ file, toSite, terrainGeometry, ground, buttonId }) {
  const toPixel = toSite.clone().invert();
  const footprint = [[0, photoCropY], [photoWidth, photoCropY], [photoWidth, photoHeight - photoCropY], [0, photoHeight - photoCropY]].map(([u, v]) => applyProjective(toSite, u, v));
  const reach = Math.max(...footprint.map(([x, z]) => Math.hypot(x, z)));
  const texture = new THREE.TextureLoader().load(file);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, toneMapped: false, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -2 });
  const minV = (photoCropY / photoHeight).toFixed(6), maxV = (1 - photoCropY / photoHeight).toFixed(6);
  material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace("#include <map_fragment>", `if (vMapUv.x < 0.0 || vMapUv.x > 1.0 || vMapUv.y < ${minV} || vMapUv.y > ${maxV}) discard;\n#include <map_fragment>`);
  };
  const drape = (source) => {
    const geometry = new THREE.BufferGeometry();
    const position = source.getAttribute("position");
    const uvs = new Float32Array(position.count * 2);
    for (let i = 0; i < position.count; i++) {
      const [u, v] = applyProjective(toPixel, position.getX(i), position.getZ(i));
      uvs[i * 2] = u / photoWidth;
      uvs[i * 2 + 1] = 1 - v / photoHeight;
    }
    geometry.setAttribute("position", position);
    geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    geometry.setIndex(source.getIndex());
    const mesh = new THREE.Mesh(geometry, material);
    mesh.renderOrder = buttonId === "aerial-closeup-toggle" ? 1 : 2;
    return mesh;
  };
  const group = new THREE.Group();
  group.visible = false;
  group.add(drape(terrainGeometry), drape(ground.skirt(reach)));
  aerialGroup.add(group);
  return { group, buttonId, material };
}

function toggle(buttonId, group) {
  const button = document.getElementById(buttonId);
  group.visible = button.getAttribute("aria-pressed") === "true";
  button.addEventListener("click", () => {
    group.visible = !group.visible;
    button.setAttribute("aria-pressed", String(group.visible));
  });
}

const niceLengths = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000];
const screenRight = new THREE.Vector3();
const screenUp = new THREE.Vector3();
const screenBack = new THREE.Vector3();

// Perspective scale varies with depth, so the bar measures ground at the orbit target.
function updateOverlays() {
  const height = canvas.clientHeight;
  const distance = camera.position.distanceTo(controls.target);
  const pixelsPerMetre = height / (2 * distance * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
  const metres = niceLengths.find((length) => length * pixelsPerMetre >= 45) ?? niceLengths.at(-1);
  scaleLine.style.width = `${Math.round(metres * pixelsPerMetre)}px`;
  scaleLabel.textContent = `≈ ${metres} m`;

  // North is world -Z. Compare it with the screen axes flattened onto the ground, so the
  // needle shows compass heading rather than a foreshortened ground direction.
  camera.matrixWorld.extractBasis(screenRight, screenUp, screenBack);
  const angle = Math.atan2(-screenRight.z, -screenUp.z / Math.hypot(screenUp.x, screenUp.z));
  northNeedle.style.transform = `rotate(${angle}rad)`;
}

function fit() {
  const { width, height } = canvas.getBoundingClientRect();
  renderer.setSize(width, height, false);
  camera.aspect = width / Math.max(height, 1);
  camera.updateProjectionMatrix();
}

try {
  const sampleHeight = terrainSampler(data);
  const ground = makeGround(data, sampleHeight);
  const terrainGeometry = makeTerrain(data);
  makeParcelBoundary(data, sampleHeight);
  makeContours(data);
  makeClearing(data, sampleHeight);
  makeTrees(data, sampleHeight);
  makePad(data, sampleHeight);
  makeRoadContext(data, ground.height);
  makeEasements(data, ground.height);
  const constraints = makeConstraints(data, terrainGeometry, ground.height);
  const parcelPoints = data.boundary.map(([x, , z]) => [x, z]);
  const photos = [
    makeAerialPhoto({ file: "./aerial-reference-close.jpg", toSite: affineFromPairs([[308, 416], [523, 648], [1039, 400]], parcelPoints), terrainGeometry, ground, buttonId: "aerial-closeup-toggle" }),
    // Wide-to-detail homography fitted to shared features around the parcel and roads,
    // composed with the detail image's cadastral-corner transform.
    makeAerialPhoto({ file: "./aerial-reference-area.jpg", toSite: new THREE.Matrix3().set(-0.220430864656, 0.268799193112, -42.600149699886, -0.263561787439, -0.207578209753, 351.969402402826, -0.000025487548, 0.000110981898, 1), terrainGeometry, ground, buttonId: "aerial-area-toggle" }),
  ];
  toggle("terrain-toggle", terrainGroup);
  toggle("contour-toggle", contoursGroup);
  toggle("clearing-toggle", clearingGroup);
  toggle("trees-toggle", treesGroup);
  toggle("pad-toggle", padGroup);
  toggle("road-toggle", roadGroup);
  toggle("easement-toggle", easementGroup);
  toggle("boundary-toggle", boundaryGroup);
  // Concepts: each category switches independently from the bottom bar, one option at a time
  // (or none) over the unchanged existing site, without moving the camera. The selection lives in
  // the URL (?fence=fence-neighbour&house=...) so a combination can be shared or reloaded.
  const categories = concepts.filter((category) => category.options.length);
  const conceptContext = { THREE, data, groundHeight: ground.height, drapePolygon };
  const conceptGroups = new Map(categories.flatMap((category) => category.options.map((option) => {
    const group = option.build(conceptContext);
    group.visible = false;
    scene.add(group);
    return [option.id, group];
  })));
  const conceptBar = document.getElementById("concept-bar");
  const viewpointBar = document.getElementById("viewpoints");
  const params = new URLSearchParams(location.search);
  const selection = new Map(categories.map((category) => [category.id, category.options.some((option) => option.id === params.get(category.id)) ? params.get(category.id) : null]));
  let activeCategory = categories[0]?.id;
  const render = () => {
    conceptGroups.forEach((group) => { group.visible = false; });
    selection.forEach((id) => { if (id) conceptGroups.get(id).visible = true; });
    const url = new URL(location.href);
    selection.forEach((id, category) => id ? url.searchParams.set(category, id) : url.searchParams.delete(category));
    history.replaceState(null, "", url);
    conceptBar.querySelectorAll(".bar-row").forEach((row) => {
      const category = categories.find((candidate) => candidate.id === row.dataset.category);
      const index = category.options.findIndex((option) => option.id === selection.get(category.id));
      const option = category.options[index];
      row.classList.toggle("active", category.id === activeCategory);
      row.querySelector(".bar-value").innerHTML = option ? `${option.title}${option.recommended ? " <em>suggested</em>" : ""}` : "None";
      row.querySelector(".bar-count").textContent = `${index + 1}/${category.options.length}`;
    });
    // Step-inside buttons on the model for any selected concept that has eye-level views.
    const views = categories.flatMap((category) => {
      const option = category.options.find((candidate) => candidate.id === selection.get(category.id));
      return option?.viewpoints ? option.viewpoints(data) : [];
    });
    viewpointBar.hidden = !views.length;
    viewpointBar.innerHTML = views.length ? `<span>Step inside</span>${views.map((view, index) => `<button class="view" data-index="${index}">${view.label}</button>`).join("")}` : "";
    viewpointBar.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => stepInside(views[Number(button.dataset.index)])));
  };
  // Eye-level view inside a concept: a wide lens, a near clipping plane, and orbiting around a point
  // just ahead, so dragging looks around. Reset and Top view restore the site camera.
  // Site-scale markers (boundary line, easement labels) draw through walls, so hide them inside.
  const siteMarkers = [boundaryGroup, easementGroup];
  let hiddenMarkers = null;
  const stepInside = ({ position, target }) => {
    if (!hiddenMarkers) {
      hiddenMarkers = siteMarkers.map((group) => group.visible);
      siteMarkers.forEach((group) => { group.visible = false; });
    }
    const eye = new THREE.Vector3(...position), ahead = new THREE.Vector3(...target).sub(eye).setLength(0.4);
    camera.fov = 70;
    camera.near = 0.05;
    camera.updateProjectionMatrix();
    camera.up.set(0, 1, 0);
    controls.minDistance = 0.01;
    controls.maxPolarAngle = Math.PI * 0.95;
    controls.enableRotate = true;
    controls.target.copy(eye).add(ahead);
    camera.position.copy(eye);
    controls.update();
  };
  const leaveInside = () => {
    if (hiddenMarkers) siteMarkers.forEach((group, index) => { group.visible = hiddenMarkers[index]; });
    hiddenMarkers = null;
    camera.fov = 38;
    camera.near = 1;
    camera.updateProjectionMatrix();
    controls.minDistance = 18;
  };
  // Each category cycles None → option 1 → … → last → None.
  const step = (categoryId, direction) => {
    const category = categories.find((candidate) => candidate.id === categoryId);
    const ids = [null, ...category.options.map((option) => option.id)];
    const index = ids.indexOf(selection.get(categoryId));
    selection.set(categoryId, ids[(index + direction + ids.length) % ids.length]);
    activeCategory = categoryId;
    render();
  };
  categories.forEach((category) => {
    const row = document.createElement("div");
    row.className = "bar-row";
    row.dataset.category = category.id;
    row.innerHTML = `<button class="bar-arrow" aria-label="Previous ${category.label.toLowerCase()} concept">‹</button><span class="bar-label"><span class="bar-category">${category.label} <span class="bar-count"></span></span><span class="bar-value"></span></span><button class="bar-arrow" aria-label="Next ${category.label.toLowerCase()} concept">›</button>`;
    const [previous, next] = row.querySelectorAll("button");
    previous.addEventListener("click", () => step(category.id, -1));
    next.addEventListener("click", () => step(category.id, 1));
    conceptBar.append(row);
  });
  conceptBar.hidden = !categories.length;
  // ← → cycle the active category; ↑ ↓ choose which category the keys drive.
  window.addEventListener("keydown", (event) => {
    if (!activeCategory || event.target.closest("input, textarea, [contenteditable]") || event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      step(activeCategory, event.key === "ArrowLeft" ? -1 : 1);
    } else if ((event.key === "ArrowUp" || event.key === "ArrowDown") && categories.length > 1) {
      event.preventDefault();
      const index = categories.findIndex((category) => category.id === activeCategory);
      activeCategory = categories[(index + (event.key === "ArrowUp" ? -1 : 1) + categories.length) % categories.length].id;
      render();
    }
  });
  render();
  toggle("zone-toggle", constraints.buildingZone);
  toggle("setback-toggle", constraints.setbacks);
  toggle("slope-toggle", constraints.slope);
  toggle("flow-toggle", constraints.overlandFlow);
  toggle("flood-toggle", constraints.floodBuffer);
  toggle("landslide-toggle", constraints.landslide);
  toggle("bushfire-toggle", constraints.bushfire);
  document.getElementById("elevation-range").innerHTML = `${data.elevationRangeM[0].toFixed(1)}–${data.elevationRangeM[1].toFixed(1)} <span class="unit">m</span>`;
  fit();
  const homeTarget = new THREE.Vector3(0, (data.elevationRangeM[0] + data.elevationRangeM[1]) / 2, 0);
  const homeOffset = new THREE.Vector3(93, 120, 165).sub(homeTarget);
  // Pull back on portrait screens so the whole parcel stays in frame.
  const goHome = () => {
    leaveInside();
    camera.up.set(0, 1, 0);
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.enableRotate = true;
    controls.target.copy(homeTarget);
    camera.position.copy(homeTarget).addScaledVector(homeOffset, Math.max(1, 0.95 / camera.aspect));
    controls.update();
  };
  goHome();
  // Each photo stays in the same map coordinates. With both enabled, the wide image
  // blends over the detail image so any remaining registration error is visible.
  photos.forEach((photo) => {
    document.getElementById(photo.buttonId).addEventListener("click", () => {
      photo.group.visible = !photo.group.visible;
      const button = document.getElementById(photo.buttonId);
      button.setAttribute("aria-pressed", String(photo.group.visible));
      const visiblePhotos = photos.filter((candidate) => candidate.group.visible);
      photos.forEach((candidate) => { candidate.material.opacity = 1; });
      if (visiblePhotos.length > 1) visiblePhotos.at(-1).material.opacity = 0.5;
    });
  });
  const xs = parcelPoints.map(([x]) => x), zs = parcelPoints.map(([, z]) => z);
  const parcelCenter = [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...zs) + Math.max(...zs)) / 2];
  const parcelSpan = [Math.max(...xs) - Math.min(...xs), Math.max(...zs) - Math.min(...zs)];
  // North-up plan view. A tiny southward offset keeps OrbitControls' azimuth defined.
  const goTop = () => {
    leaveInside();
    const distance = Math.max(parcelSpan[1], parcelSpan[0] / camera.aspect) * 1.3 / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
    controls.target.set(parcelCenter[0], homeTarget.y, parcelCenter[1]);
    camera.up.set(0, 0, -1);
    controls.maxPolarAngle = 0.0001;
    controls.enableRotate = false;
    camera.position.set(parcelCenter[0], homeTarget.y + distance, parcelCenter[1] + distance * 1e-3);
    controls.update();
  };
  document.getElementById("reset").addEventListener("click", goHome);
  document.getElementById("top-view").addEventListener("click", goTop);
  window.addEventListener("resize", fit);
  loading.hidden = true;
  renderer.setAnimationLoop(() => {
    controls.update();
    updateOverlays();
    renderer.render(scene, camera);
  });
} catch (cause) {
  loading.hidden = true;
  error.hidden = false;
  error.textContent = `The site model did not load. ${cause.message}`;
  console.error(cause);
}
