// Shared helper for house concepts: a raised building drawn from a simple room plan.
// Plans use a frame aligned to the Foley Road boundary: s runs along the road (west to east),
// d runs into the lot away from the road. Room coordinates are metres from the building's
// front-left corner: x across the width (+s), y along the length (+d, towards the back).
// An optional rotation (degrees) swings the back of the building towards +s.

const COLORS = {
  living: "#e9d8a6", kitchen: "#f4c28a", bed: "#a9c5e8", bath: "#9fd8d0", shared: "#d7b8e8",
  laundry: "#d7b8e8", entry: "#d9d9d2", deck: "#c9a67a", stair: "#bdbdb5", store: "#c7c7bf",
};
const WALL_HEIGHT = 2.7;
const FLOOR_DEPTH = 0.35;
const CAR = { length: 4.9, width: 1.9, height: 1.5 };

export function siteFrame(data) {
  const [a, c, b] = data.boundary.map(([x, , z]) => [x, z]);
  const length = Math.hypot(b[0] - c[0], b[1] - c[1]);
  const u = [(b[0] - c[0]) / length, (b[1] - c[1]) / length];
  let n = [-u[1], u[0]];
  if ((a[0] - c[0]) * n[0] + (a[1] - c[1]) * n[1] < 0) n = [-n[0], -n[1]];
  return ([s, d]) => [c[0] + u[0] * s + n[0] * d, c[1] + u[1] * s + n[1] * d];
}

export function buildHouse({ THREE, data, groundHeight, drapePolygon }, spec) {
  const toXZ = siteFrame(data);
  const group = new THREE.Group();
  if (spec.siteOnly) return siteWorks();
  const at = localFrame(toXZ, spec);
  const ghost = spec.future;
  const angle = (() => { const [x0, z0] = at(0, 0), [x1, z1] = at(0, 1); return Math.atan2(x1 - x0, z1 - z0); })();
  const place = (mesh, x, y, height) => { const [px, pz] = at(x, y); mesh.position.set(px, height, pz); mesh.rotation.y = angle; return mesh; };
  const floor = spec.floorLevel;
  const { width, length } = spec;

  // Driveway and parking hardstand on the ground.
  const concrete = new THREE.MeshStandardMaterial({ color: "#b9b8b0", roughness: 0.95, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 });
  for (const area of spec.driveway ?? []) group.add(new THREE.Mesh(drapePolygon(area.map(toXZ), groundHeight, 0.2, 0.75), concrete));

  // Parking and paths only, with no building.
  function siteWorks() {
    const material = new THREE.MeshStandardMaterial({ color: "#b9b8b0", roughness: 0.95, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 });
    for (const area of spec.driveway ?? []) group.add(new THREE.Mesh(drapePolygon(area.map(toXZ), groundHeight, 0.2, 0.75), material));
    const carMaterial = new THREE.MeshStandardMaterial({ color: "#c9ced6", roughness: 0.6 });
    for (const car of spec.cars ?? []) {
      const [px, pz] = toXZ([car.s, car.d]);
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(CAR.width, CAR.height, CAR.length), carMaterial);
      mesh.position.set(px, groundHeight(px, pz) + CAR.height / 2 + 0.1, pz);
      const turn = (car.rotation ?? 0) * Math.PI / 180;
      const [fx, fz] = toXZ([car.s + Math.sin(turn), car.d + Math.cos(turn)]);
      mesh.rotation.y = Math.atan2(fx - px, fz - pz);
      group.add(mesh);
    }
    for (const person of spec.people ?? []) {
      const [px, pz] = toXZ([person.s, person.d]);
      group.add(makePerson(THREE, px, groundHeight(px, pz), pz));
    }
    return group;
  }

  // Floor plate with the plan painted on it.
  const scale = 48;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(length * scale);
  const context = canvas.getContext("2d");
  const row = (y) => (length - y) * scale;
  context.fillStyle = "#f3f1ea";
  context.fillRect(0, 0, canvas.width, canvas.height);
  for (const room of spec.rooms) {
    context.fillStyle = COLORS[room.kind] ?? "#e0e0e0";
    context.fillRect(room.x * scale, row(room.y + room.h), room.w * scale, room.h * scale);
    context.strokeStyle = "#3a3a36";
    context.lineWidth = 3;
    context.strokeRect(room.x * scale, row(room.y + room.h), room.w * scale, room.h * scale);
  }
  for (const [x0, y0, x1, y1] of spec.partyWalls ?? []) {
    context.strokeStyle = "#b0413e";
    context.lineWidth = 9;
    context.beginPath();
    context.moveTo(x0 * scale, row(y0));
    context.lineTo(x1 * scale, row(y1));
    context.stroke();
  }
  context.strokeStyle = "#1f1f1c";
  context.lineWidth = 8;
  context.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);
  // Openings: stretches of the outline where this part opens into a joined part.
  for (const [x0, y0, x1, y1, kind = "living"] of spec.openings ?? []) {
    context.strokeStyle = COLORS[kind];
    context.lineWidth = 12;
    context.beginPath();
    context.moveTo(Math.max(x0 * scale, 8), Math.min(Math.max(row(y0), 4), canvas.height - 4));
    context.lineTo(Math.min(x1 * scale, canvas.width - 8), Math.min(Math.max(row(y1), 4), canvas.height - 4));
    context.stroke();
  }
  context.fillStyle = "#1f1f1c";
  context.textAlign = "center";
  context.textBaseline = "middle";
  for (const room of spec.rooms) {
    if (!room.name) continue;
    const size = Math.min(26, room.w * scale / (room.name.length * 0.62), room.h * scale / 2.6);
    context.font = `600 ${size}px sans-serif`;
    const cx = (room.x + room.w / 2) * scale, cy = row(room.y + room.h / 2);
    context.fillText(room.name, cx, cy - size * 0.45);
    context.font = `400 ${size * 0.8}px sans-serif`;
    context.fillText(`${(room.w * room.h).toFixed(0)} m²`, cx, cy + size * 0.6);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  const plate = new THREE.Mesh(new THREE.PlaneGeometry(width, length), new THREE.MeshBasicMaterial({ map: texture, toneMapped: false, transparent: !!ghost, opacity: ghost ? 0.55 : 1 }));
  // Lying flat and turned so the canvas top faces the back (north), labels read upright in a north-up view.
  plate.rotation.set(-Math.PI / 2, 0, Math.PI);
  const plateHolder = place(new THREE.Group(), width / 2, length / 2, floor + 0.02);
  plateHolder.add(plate);
  group.add(plateHolder);
  const slab = place(new THREE.Mesh(new THREE.BoxGeometry(width, FLOOR_DEPTH, length), new THREE.MeshStandardMaterial({ color: "#5d5a52", roughness: 0.9 })), width / 2, length / 2, floor - FLOOR_DEPTH / 2);
  group.add(slab);

  // Decks at floor level.
  const deckMaterial = new THREE.MeshStandardMaterial({ color: COLORS.deck, roughness: 0.9, transparent: !!ghost, opacity: ghost ? 0.5 : 1 });
  for (const deck of spec.decks ?? []) group.add(place(new THREE.Mesh(new THREE.BoxGeometry(deck.w, 0.15, deck.h), deckMaterial), deck.x + deck.w / 2, deck.y + deck.h / 2, floor - 0.075));

  if (!ghost) addInterior();

  // See-through walls and a skillion roof, so the plan stays readable from above.
  const wallMaterial = new THREE.MeshStandardMaterial({ color: ghost ? "#cfd6e6" : "#f1efe8", transparent: true, opacity: ghost ? 0.18 : 0.4, side: THREE.DoubleSide, depthWrite: false });
  const edgeMaterial = new THREE.LineBasicMaterial({ color: ghost ? "#aab8d6" : "#ffffff" });
  const box = place(new THREE.Mesh(new THREE.BoxGeometry(width, WALL_HEIGHT, length), wallMaterial), width / 2, length / 2, floor + WALL_HEIGHT / 2);
  group.add(box);
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(box.geometry), edgeMaterial);
  edges.position.copy(box.position);
  edges.rotation.copy(box.rotation);
  group.add(edges);
  if (spec.roof === false) return finish();
  const roof = spec.roof ?? { overhang: 0.6, rise: 1.0 };
  const roofWidth = width + roof.overhang * 2, roofLength = length + roof.overhang * 2;
  const roofMesh = new THREE.Mesh(new THREE.PlaneGeometry(roofWidth, Math.hypot(roofLength, roof.rise)), new THREE.MeshStandardMaterial({ color: "#8e9aa3", transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false }));
  // Skillion roof rising towards the back (north) to open the living spaces to the sun.
  const roofHolder = place(new THREE.Group(), width / 2, length / 2, floor + WALL_HEIGHT + 0.25 + roof.rise / 2);
  roofMesh.rotation.x = -Math.PI / 2 - Math.atan2(roof.rise, roofLength);
  roofHolder.add(roofMesh);
  const roofEdges = new THREE.LineSegments(new THREE.EdgesGeometry(roofMesh.geometry), edgeMaterial);
  roofEdges.rotation.copy(roofMesh.rotation);
  roofHolder.add(roofEdges);
  group.add(roofHolder);
  return finish();

  // Furniture at real sizes, faint walls around bedrooms and bathrooms, and people for scale.
  function addInterior() {
    const box = (x, y, w, h, height, color, lift = 0, opacity = 1) => {
      const material = new THREE.MeshStandardMaterial({ color, roughness: 0.8, transparent: opacity < 1, opacity, depthWrite: opacity === 1 });
      group.add(place(new THREE.Mesh(new THREE.BoxGeometry(w, height, h), material), x + w / 2, y + h / 2, floor + lift + height / 2));
    };
    const strips = spec.rooms.filter((room) => room.kind === "kitchen" && !room.name);
    for (const room of spec.rooms) {
      const { x, y, w, h } = room;
      if (room.kind === "bed") {
        // Queen bed with its head on an outside wall where possible, and a robe on one side.
        const headHigh = y + h >= length - 0.01 && y > 0;
        const bedX = x + w / 2 + (w > 3.4 ? 0.3 : 0) - 0.765;
        const bedY = headHigh ? y + h - 0.15 - 2.03 : y + 0.15;
        box(bedX, bedY, 1.53, 2.03, 0.5, "#f4f1ea");
        box(bedX - 0.05, headHigh ? y + h - 0.15 : y + 0.07, 1.63, 0.08, 1.0, "#8a7358");
        box(x + 0.1, y + 0.3, 0.6, Math.min(2.1, h - 0.6), 2.1, "#b9a58a");
      } else if (room.kind === "bath") {
        box(x + w - 1.0, y + h - 1.0, 0.9, 0.9, 0.05, "#d8e4e6");
        box(x + w - 1.0, y + h - 1.05, 0.9, 0.02, 2.0, "#bfe3ea", 0, 0.35);
        box(x + 0.15, y + h - 0.75, 0.4, 0.65, 0.42, "#ffffff");
        box(x + 0.1, y + 0.1, Math.min(0.9, w - 1.2), 0.5, 0.85, "#e9e4da");
      } else if (room.kind === "laundry") {
        box(x + w - 0.7, y + 0.1, 0.6, 0.6, 0.85, "#f5f5f5");
        box(x + w - 0.7, y + 0.75, 0.6, 0.5, 0.9, "#e9e4da");
      } else if (room.kind === "store" && /study/i.test(room.name)) {
        box(x + 0.1, y + 0.2, 0.6, 1.2, 0.75, "#a07f5a");
        box(x + 0.8, y + 0.55, 0.45, 0.45, 0.45, "#56606a");
      } else if (room.kind === "kitchen" && !room.name) {
        box(x, y, w, h, 0.9, "#d9d4c8");
        box(x, y + h, w, 0.7, 1.8, "#c8ccd0");
      } else if (room.kind === "living") {
        // Keep a 1 m working aisle clear of any kitchen bench inside this room.
        let x0 = x + 0.3, x1 = x + w - 0.3;
        for (const strip of strips) {
          if (strip.y >= y + h || strip.y + strip.h <= y) continue;
          if (strip.x <= x + 0.01) x0 = Math.max(x0, strip.x + strip.w + 1.0);
          else x1 = Math.min(x1, strip.x - 1.0);
        }
        const cx = (x0 + x1) / 2;
        const dining = (tableY) => {
          box(cx - 0.4, tableY, 0.8, 1.2, 0.75, "#9c7b55");
          for (const [dx, dy] of [[-0.75, 0.15], [-0.75, 0.65], [0.35, 0.15], [0.35, 0.65]]) box(cx + dx, tableY + dy, 0.4, 0.4, 0.45, "#6d5a45");
        };
        const lounge = (sofaY) => {
          box(cx - 1.0, sofaY, 2.0, 0.9, 0.8, "#6f8a78");
          box(cx - 0.5, sofaY - 1.0, 1.0, 0.5, 0.4, "#9c7b55");
        };
        // A short room that continues another living space takes the dining table.
        if (h < 3 && w < 3.5) dining(y + (h - 1.2) / 2);
        else if (h >= 4.5) { dining(y + 0.6); lounge(y + h - 1.2); }
        else lounge(y + h - 1.2);
      }
    }
    // Faint partitions around enclosed rooms, leaving the building's outside walls to the wall box.
    const partition = new THREE.MeshStandardMaterial({ color: "#e8e4dc", transparent: true, opacity: 0.45, side: THREE.DoubleSide, depthWrite: false });
    for (const room of spec.rooms.filter((candidate) => candidate.kind === "bed" || candidate.kind === "bath")) {
      const { x, y, w, h } = room;
      const edges = [[x, y, x + w, y], [x + w, y, x + w, y + h], [x, y + h, x + w, y + h], [x, y, x, y + h]];
      for (const [x0, y0, x1, y1] of edges) {
        const outside = (x0 === x1 && (x0 <= 0.01 || x0 >= width - 0.01)) || (y0 === y1 && (y0 <= 0.01 || y0 >= length - 0.01));
        if (outside) continue;
        const along = Math.hypot(x1 - x0, y1 - y0);
        const wall = new THREE.Mesh(new THREE.BoxGeometry(x0 === x1 ? 0.09 : along, 2.6, x0 === x1 ? along : 0.09), partition);
        group.add(place(wall, (x0 + x1) / 2, (y0 + y1) / 2, floor + 1.3));
      }
    }
    for (const person of spec.people ?? []) {
      const [px, pz] = at(person.x, person.y);
      group.add(makePerson(THREE, px, floor, pz));
    }
  }

  function finish() {
  if (spec.posts === false) return addCars();
  // Steel posts from the ground to the floor on a grid no wider than 3.6 m.
  const posts = [];
  // postSpan widens the grid across the building, e.g. to keep car bays underneath clear.
  const columns = Math.ceil(width / (spec.postSpan ?? 3.6)), rows = Math.ceil(length / 3.6);
  for (let i = 0; i <= columns; i++) for (let j = 0; j <= rows; j++) posts.push([width * i / columns, length * j / rows]);
  for (const deck of spec.decks ?? []) for (const [x, y] of [[deck.x, deck.y], [deck.x + deck.w, deck.y], [deck.x, deck.y + deck.h], [deck.x + deck.w, deck.y + deck.h]]) if (x < 0 || x > width || y < 0 || y > length) posts.push([x, y]);
  const postMaterial = new THREE.MeshStandardMaterial({ color: "#2e3230", roughness: 0.7, transparent: !!ghost, opacity: ghost ? 0.5 : 1 });
  for (const [x, y] of posts) {
    const [px, pz] = at(x, y);
    const base = groundHeight(px, pz);
    const height = floor - FLOOR_DEPTH - base;
    if (height <= 0.05) continue;
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.15, height, 0.15), postMaterial);
    post.position.set(px, base + height / 2, pz);
    group.add(post);
  }

  return addCars();
  }

  function addCars() {
  // Cars parked underneath.
  const carMaterial = new THREE.MeshStandardMaterial({ color: "#c9ced6", roughness: 0.6 });
  for (const car of spec.cars ?? []) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(car.across ? CAR.length : CAR.width, CAR.height, car.across ? CAR.width : CAR.length), carMaterial);
    const [px, pz] = at(car.x, car.y);
    mesh.position.set(px, groundHeight(px, pz) + CAR.height / 2 + 0.1, pz);
    mesh.rotation.y = angle;
    group.add(mesh);
  }
  return group;
  }
}

// A 1.75 m figure for scale, standing at the given floor or ground level.
function makePerson(THREE, x, level, z) {
  const person = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ color: "#e07a5f", roughness: 0.7 });
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.19, 1.12, 4, 10), material);
  body.position.y = 0.75;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.115, 12, 10), material);
  head.position.y = 1.635;
  person.add(body, head);
  person.position.set(x, level, z);
  return person;
}

// A point in a building's own coordinates, as site (x, z).
export function pointAt(data, spec, x, y) {
  return localFrame(siteFrame(data), spec)(x, y);
}

// Several parts (a later wing, an upper floor) combined into one concept group.
export function buildParts(context, specs) {
  const group = new context.THREE.Group();
  for (const spec of specs) group.add(buildHouse(context, spec));
  return group;
}

function localFrame(toXZ, spec) {
  const [s0, d0] = spec.origin;
  const theta = (spec.rotation ?? 0) * Math.PI / 180;
  const cos = Math.cos(theta), sin = Math.sin(theta);
  return (x, y) => toXZ([s0 + x * cos + y * sin, d0 - x * sin + y * cos]);
}

// Clear height under the floor at a point in the building's own coordinates.
export function clearanceAt({ data, groundHeight }, spec, x, y) {
  const [px, pz] = localFrame(siteFrame(data), spec)(x, y);
  return spec.floorLevel - FLOOR_DEPTH - groundHeight(px, pz);
}

// Indicative all-in cost from research/build-costs.md (kit + licensed builder route, September 2026):
// fixed site and soft costs plus a per-m² building rate, with 10% (low) or 15% (mid) contingency.
export function costRange(area) {
  const low = (27800 + 3145 * area) * 1.10, mid = (63000 + 4090 * area) * 1.15;
  const k = (value) => `$${Math.round(value / 5000) * 5}k`;
  return `${k(low)} (low) – ${k(mid)} (mid)`;
}
