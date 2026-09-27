import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const canvas = document.querySelector("#model");
const loading = document.querySelector("#loading");
const error = document.querySelector("#error");
const scene = new THREE.Scene();
scene.background = new THREE.Color("#151c1a");

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 1200);
camera.up.set(0, 1, 0);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 65;
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
scene.add(terrainGroup, contoursGroup, clearingGroup, treesGroup);

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
  surface.castShadow = true;
  surface.receiveShadow = true;
  terrainGroup.add(surface);

  const boundary = data.boundary.map(([x, y, z]) => new THREE.Vector3(x, y + 0.12, z));
  const outline = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(boundary), new THREE.LineBasicMaterial({ color: "#f2d18f", linewidth: 2 }));
  terrainGroup.add(outline);

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
  const step = 1.5;
  const startX = Math.floor(bounds.minX / step) * step;
  const startZ = Math.floor(bounds.minZ / step) * step;
  for (let x = startX; x < bounds.maxX; x += step) for (let z = startZ; z < bounds.maxZ; z += step) {
    let cell = polygon;
    cell = clip(cell, 0, x, true); cell = clip(cell, 0, x + step, false);
    cell = clip(cell, 1, z, true); cell = clip(cell, 1, z + step, false);
    if (cell.length < 3) continue;
    const heights = cell.map(([px, pz]) => sampleHeight(px, pz));
    if (heights.some((height) => height === null)) continue;
    const vertices = cell.map(([px, pz], i) => [px, heights[i] + 0.12, pz]);
    for (let i = 1; i < vertices.length - 1; i++) positions.push(...vertices[0], ...vertices[i], ...vertices[i + 1]);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  clearingGroup.add(new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: "#a9a274", transparent: true, opacity: 0.62, roughness: 1, side: THREE.DoubleSide, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1 })));
  const outline = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(polygon.map(([x, z]) => new THREE.Vector3(x, (sampleHeight(x, z) ?? 0) + 0.2, z))), new THREE.LineDashedMaterial({ color: "#f3d39c", dashSize: 2.1, gapSize: 1.1, transparent: true, opacity: 0.95 }));
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

function makeTrees(data) {
  // Tree positions are illustrative: densely fill the lot around the mapped clearing,
  // with a tighter band at the clearing edge to make the tree line easy to read.
  let seed = 353650;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const bounds = data.boundary.reduce((b, [x, , z]) => ({
    minX: Math.min(b.minX, x), maxX: Math.max(b.maxX, x),
    minZ: Math.min(b.minZ, z), maxZ: Math.max(b.maxZ, z),
  }), { minX: Infinity, maxX: -Infinity, minZ: Infinity, maxZ: -Infinity });
  const trees = [];
  let attempts = 0;
  while (trees.length < 360 && attempts < 9000) {
    attempts++;
    const x = bounds.minX + random() * (bounds.maxX - bounds.minX);
    const z = bounds.minZ + random() * (bounds.maxZ - bounds.minZ);
    if (!insidePolygon(x, z, data.boundary)) continue;
    const clearingEdge = Math.min(...data.clearedArea.map(([ax, , az], i) => {
      const [bx, , bz] = data.clearedArea[(i + 1) % data.clearedArea.length];
      const dx = bx - ax, dz = bz - az;
      const t = THREE.MathUtils.clamp(((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz), 0, 1);
      return Math.hypot(x - (ax + t * dx), z - (az + t * dz));
    }));
    if (insidePolygon(x, z, data.clearedArea) || clearingEdge < 3.2) continue;
    const nearest = data.points.reduce((best, point) => {
      const distance = (point[0] - x) ** 2 + (point[2] - z) ** 2;
      return !best || distance < best.distance ? { point, distance } : best;
    }, null).point;
    const height = nearest[1];
    trees.push({ x, z, y: height, tone: random() });
  }

  const trunkGeometry = new THREE.CylinderGeometry(0.24, 0.38, 8, 5);
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
    scale.set(1, 1, 1);
    matrix.compose(position, rotation, scale);
    trunks.setMatrixAt(index, matrix);
    const radius = 2.4 + random() * 1.3;
    position.set(tree.x, tree.y + height + 1.5 + random() * 0.7, tree.z);
    scale.set(radius, 3.0 + random() * 1.5, radius * (0.82 + random() * 0.3));
    matrix.compose(position, rotation, scale);
    crowns.setMatrixAt(index, matrix);
    color.set(palette[Math.floor(tree.tone * palette.length)]);
    crowns.setColorAt(index, color);
  });
  trunks.instanceMatrix.needsUpdate = true;
  crowns.instanceMatrix.needsUpdate = true;
  treesGroup.add(trunks, crowns);
}

function toggle(buttonId, group) {
  const button = document.getElementById(buttonId);
  button.addEventListener("click", () => {
    group.visible = !group.visible;
    button.setAttribute("aria-pressed", String(group.visible));
    button.lastElementChild.textContent = group.visible ? "✓" : "";
  });
}

function fit() {
  const { width, height } = canvas.getBoundingClientRect();
  renderer.setSize(width, height, false);
  camera.aspect = width / Math.max(height, 1);
  camera.updateProjectionMatrix();
}

try {
  const response = await fetch("./site-data.json");
  if (!response.ok) throw new Error(`Could not load site data (${response.status})`);
  const data = await response.json();
  const sampleHeight = terrainSampler(data);
  makeTerrain(data);
  makeContours(data);
  makeClearing(data, sampleHeight);
  makeTrees(data);
  toggle("terrain-toggle", terrainGroup);
  toggle("contour-toggle", contoursGroup);
  toggle("clearing-toggle", clearingGroup);
  toggle("trees-toggle", treesGroup);
  document.getElementById("elevation-range").innerHTML = `${data.elevationRangeM[0]}–${data.elevationRangeM[1]} <span class="stat-unit">m</span>`;
  controls.target.set(0, (data.elevationRangeM[0] + data.elevationRangeM[1]) / 2, 0);
  camera.position.set(93, 120, 165);
  controls.update();
  controls.saveState();
  document.getElementById("reset").addEventListener("click", () => controls.reset());
  fit();
  window.addEventListener("resize", fit);
  loading.hidden = true;
  renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
  });
} catch (cause) {
  loading.hidden = true;
  error.hidden = false;
  error.textContent = `The site model did not load. ${cause.message}`;
  console.error(cause);
}
