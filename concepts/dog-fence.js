// Concept 1: a dog-proof fence around the house site and yard.
// Outlines are in site metres (see site-data.json frame). Every option keeps the Foley Road side
// 4.5 m inside the boundary so the gate has a 7 m holding bay from the carriageway edge (2.5 m verge).
// Figures were measured against the LiDAR terrain and council overlays in site-data.json.

import { siteFrame } from "./building.js";

const FENCE_HEIGHT = 1.8;
const GATE_WIDTH = 4;
const CAR = { length: 4.9, width: 1.9, height: 1.5 };

const shared = [
  "Gate and bay: the gate sits 4.5 m inside the boundary, 7 m from the Foley Road edge. A large car or ute (about 5.3 m) waits fully off the road while it opens; leaving, the car stops in the bay while the gate closes behind it, then pulls out. Use a sliding gate running inside the fence, or leaves that swing inward (downhill), never out over the bay. Automate with auto-close and a safety beam.",
  "The gate sits where the Homes driveway crosses the fence line, on the straight run from the existing entrance. The bay falls about 20% from the road to the gate, the natural slope. Where the fence meets the siblings' building, the building's front wall closes that stretch.",
  "1.5–1.8 m high contains a Labrador. For the small dogs, keep mesh gaps under 50 mm near the ground and no gap under the gate. Use a koala-safe design: nothing for koalas to climb on the outside, or a smooth band.",
  "Where the fence crosses drainage easement A or the overland flow path, use open mesh so water passes, and get council consent for the easement crossing.",
  "Lines through the forest need hand-dug posts between trunks and no clearing; tree positions in the model are illustrative, so walk the line on site.",
];

const options = [
  {
    id: "fence-clearing",
    title: "1A · Clearing fit",
    subtitle: "Four sides hugging the clearing",
    polygon: [[-13.48, 12.3], [0.85, -6], [23.12, 9.34], [17.61, 27.85]],
    stats: ["644 m² enclosed", "104 m of fence; corners 79–108°", "Whole clearing plus a 1.5 m margin", "Crosses easement A twice; 58 m in overland flow"],
    notes: [
      "The cheapest way to enclose all the open ground. The fence runs about 1.5 m outside the clearing edge, under the crown edge and short of most trunks, on gentle ground (25.5–31.4 m; 44% of the line nearly level).",
      "A 190 m² house footprint would leave roughly 450 m² for the dogs.",
    ],
  },
  {
    id: "fence-neighbour",
    title: "1B · Clearing and west forest",
    subtitle: "Out to the neighbour boundary",
    recommended: true,
    polygon: [[-39.88, -0.9], [-36.32, -24.27], [27.8, 7.79], [17.74, 27.91]],
    stats: ["1,531 m² enclosed", "182 m of fence, 4 sides", "26 m on the neighbour boundary (cost-shareable)", "Whole clearing plus the western forest"],
    notes: [
      "Extends the clearing fit west to the neighbour boundary: about 1,300 m² for the dogs around a 190 m² house, for 78 m more fence, part of it shareable as a dividing fence.",
      "The west end climbs to 35.5 m; 14% of the line is steeper than 25%. Crosses easement A twice.",
    ],
  },
  {
    id: "fence-frontage",
    title: "1C · Frontage and sides",
    subtitle: "Along Foley Road into the east corner",
    polygon: [[-39.88, -0.9], [-36.32, -24.27], [27.84, 7.81], [63.62, 50.86]],
    stats: ["2,109 m² enclosed", "267 m of fence, 4 sides", "26 m on the neighbour boundary", "98 m in overland flow"],
    notes: [
      "Adds the long strip east along Foley Road and up the Nambour Connection Road boundary to a narrow point: dense canopy, overland flow, and a corner that is hard to use.",
    ],
  },
  {
    id: "fence-whole",
    title: "1D · Whole lot",
    subtitle: "Everything behind the gate bay",
    polygon: [[-39.88, -0.9], [-30.5, -62.39], [63.62, 50.86]],
    stats: ["3,425 m² enclosed", "325 m of fence, 3 sides", "64 m on the neighbour boundary", "39% of the line on steep ground"],
    notes: [
      "Maximum space and the most fence. The Nambour Connection Road side is steep and crosses the stream outlet at 23.4 m, which needs a flood-permeable section. Encloses the most koala habitat.",
    ],
  },
];

function build({ THREE, data, groundHeight, drapePolygon }, option) {
  const group = new THREE.Group();
  const polygon = option.polygon;
  // The gate sits where the straight driveway from the existing entrance crosses the fence line.
  const padCenter = siteFrame(data)([52.8, 3]);

  // The gate sits on the side nearest the driveway pad, where the pad centre projects onto it.
  let gate = null;
  polygon.forEach(([ax, az], i) => {
    const [bx, bz] = polygon[(i + 1) % polygon.length];
    const dx = bx - ax, dz = bz - az, length = Math.hypot(dx, dz);
    const t = Math.max(GATE_WIDTH / 2, Math.min(length - GATE_WIDTH / 2, ((padCenter[0] - ax) * dx + (padCenter[1] - az) * dz) / length));
    const distance = Math.hypot(padCenter[0] - (ax + dx / length * t), padCenter[1] - (az + dz / length * t));
    if (!gate || distance < gate.distance) gate = { side: i, from: t - GATE_WIDTH / 2, to: t + GATE_WIDTH / 2, distance };
  });

  const mesh = new THREE.MeshBasicMaterial({ color: "#e4ece0", transparent: true, opacity: 0.4, side: THREE.DoubleSide, depthWrite: false });
  const gateMaterial = new THREE.MeshBasicMaterial({ color: "#f2c14e", transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false });
  const rail = new THREE.LineBasicMaterial({ color: "#ffffff" });
  // A bold line on the ground keeps the fence readable in plan view, where a vertical fence is edge-on.
  const trace = { fence: new THREE.MeshBasicMaterial({ color: "#f2c14e", side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -6, polygonOffsetUnits: -6 }), gate: new THREE.MeshBasicMaterial({ color: "#ffffff", side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -6, polygonOffsetUnits: -6 }) };
  const postGeometry = new THREE.CylinderGeometry(0.05, 0.05, FENCE_HEIGHT, 6);
  const postMaterial = new THREE.MeshStandardMaterial({ color: "#3c423f", roughness: 0.8 });
  const panel = (points, material) => {
    const positions = [];
    points.forEach(([x, z], i) => {
      if (i === 0) return;
      const [px, pz] = points[i - 1];
      const y0 = groundHeight(px, pz), y1 = groundHeight(x, z);
      positions.push(px, y0, pz, x, y1, z, x, y1 + FENCE_HEIGHT, z, px, y0, pz, x, y1 + FENCE_HEIGHT, z, px, y0 + FENCE_HEIGHT, pz);
    });
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    group.add(new THREE.Mesh(geometry, material));
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points.map(([x, z]) => new THREE.Vector3(x, groundHeight(x, z) + FENCE_HEIGHT, z))), rail));
  };
  const posts = [];
  polygon.forEach(([ax, az], i) => {
    const [bx, bz] = polygon[(i + 1) % polygon.length];
    const length = Math.hypot(bx - ax, bz - az);
    const at = (t) => [ax + (bx - ax) * t / length, az + (bz - az) * t / length];
    const nx = -(bz - az) / length * 0.3, nz = (bx - ax) / length * 0.3;
    const run = (from, to, material, line) => {
      const steps = Math.max(1, Math.ceil((to - from) / 1));
      panel(Array.from({ length: steps + 1 }, (_, k) => at(from + (to - from) * k / steps)), material);
      const [sx, sz] = at(from), [ex, ez] = at(to);
      group.add(new THREE.Mesh(drapePolygon([[sx + nx, sz + nz], [ex + nx, ez + nz], [ex - nx, ez - nz], [sx - nx, sz - nz]], groundHeight, 0.45, 0.5), line));
    };
    if (gate.side === i) {
      run(0, gate.from, mesh, trace.fence);
      run(gate.from, gate.to, gateMaterial, trace.gate);
      run(gate.to, length, mesh, trace.fence);
    } else run(0, length, mesh, trace.fence);
    for (let t = 0; t < length; t += 2.5) posts.push(at(t));
  });
  const postMesh = new THREE.InstancedMesh(postGeometry, postMaterial, posts.length);
  const matrix = new THREE.Matrix4();
  posts.forEach(([x, z], i) => postMesh.setMatrixAt(i, matrix.makeTranslation(x, groundHeight(x, z) + FENCE_HEIGHT / 2, z)));
  group.add(postMesh);

  // Faint tint over the fenced ground.
  group.add(new THREE.Mesh(drapePolygon(polygon, groundHeight, 0.35, 1), new THREE.MeshBasicMaterial({ color: "#f2c14e", transparent: true, opacity: 0.2, depthWrite: false, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -5, polygonOffsetUnits: -5 })));

  // Gate label.
  const label = document.createElement("canvas");
  label.width = 128;
  label.height = 48;
  const context = label.getContext("2d");
  context.fillStyle = "#ffffff";
  context.beginPath();
  context.roundRect(4, 4, 120, 40, 12);
  context.fill();
  context.fillStyle = "#1b1712";
  context.font = "600 26px sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("Gate", 64, 25);
  const [gx, gz] = (() => { const [ax, az] = polygon[gate.side], [bx, bz] = polygon[(gate.side + 1) % polygon.length]; const length = Math.hypot(bx - ax, bz - az), t = (gate.from + gate.to) / 2; return [ax + (bx - ax) * t / length, az + (bz - az) * t / length]; })();
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(label), depthTest: false }));
  sprite.position.set(gx, groundHeight(gx, gz) + FENCE_HEIGHT + 2.5, gz);
  sprite.scale.set(5, 1.9, 1);
  sprite.renderOrder = 22;
  group.add(sprite);

  // A car-sized block waiting in the bay, 0.6 m short of the gate, shows the clearance to the road.
  const [ax, az] = polygon[gate.side], [bx, bz] = polygon[(gate.side + 1) % polygon.length];
  let inward = [-(bz - az), bx - ax];
  const inwardLength = Math.hypot(...inward);
  inward = [inward[0] / inwardLength, inward[1] / inwardLength];
  const centroid = polygon.reduce((sum, [x, z]) => [sum[0] + x / polygon.length, sum[1] + z / polygon.length], [0, 0]);
  if ((centroid[0] - gx) * inward[0] + (centroid[1] - gz) * inward[1] < 0) inward = [-inward[0], -inward[1]];
  const back = 0.6 + CAR.length / 2;
  const cx = gx - inward[0] * back, cz = gz - inward[1] * back;
  const car = new THREE.Mesh(new THREE.BoxGeometry(CAR.width, CAR.height, CAR.length), new THREE.MeshStandardMaterial({ color: "#c9ced6", roughness: 0.6, transparent: true, opacity: 0.85 }));
  car.position.set(cx, groundHeight(cx, cz) + CAR.height / 2 + 0.2, cz);
  car.rotation.y = Math.atan2(inward[0], inward[1]);
  group.add(car);
  return group;
}

export default options.map((option) => ({ ...option, notes: [...option.notes, ...shared], build: (context) => build(context, option) }));
