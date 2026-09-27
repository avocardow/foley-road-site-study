// Stage 1: one building for two siblings, each with their own bedroom, bathroom, living room and
// kitchen, under one roof. All options share one site plan: the building starts at the front left
// of the clearing and runs down the slope, 10 m from the mapped waterway and 7 m from Foley Road.
// The floor sits at 31.0 m, level with the existing pad, so the front entry is step-free; the
// ground falls 3–4 m to the back, where cars park underneath. The driveway continues from the pad
// down the right-hand side of the building and turns left under its back end.
// Room plans follow research/design-precedents.md; costs follow research/build-costs.md.
import { buildHouse, buildParts, footprint } from "./building.js";

const ORIGIN = [42, 7];
const FLOOR = 31.0;
const DRIVE = [[55, 0], [52.6, 6], [52.6, 16], [50.5, 17.5]];

// Driveway polygons in (s, d): a 3 m strip along the path plus a parking hardstand under the back.
function driveway(parking) {
  const strips = [];
  for (let i = 0; i < DRIVE.length - 1; i++) {
    const [a, b] = [DRIVE[i], DRIVE[i + 1]];
    const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const [nx, nd] = [-(b[1] - a[1]) / length * 1.5, (b[0] - a[0]) / length * 1.5];
    strips.push([[a[0] + nx, a[1] + nd], [b[0] + nx, b[1] + nd], [b[0] - nx, b[1] - nd], [a[0] - nx, a[1] - nd]]);
  }
  const [s0, d0] = ORIGIN;
  strips.push([[s0 + parking[0], d0 + parking[1]], [s0 + parking[2], d0 + parking[1]], [s0 + parking[2], d0 + parking[3]], [s0 + parking[0], d0 + parking[3]]]);
  return strips;
}

// Indicative all-in cost from research/build-costs.md (kit + licensed builder route, September 2026):
// fixed site and soft costs plus a per-m² building rate, with 10% (low) or 15% (mid) contingency.
export function costRange(area) {
  const low = (27800 + 3145 * area) * 1.10, mid = (63000 + 4090 * area) * 1.15;
  const k = (value) => `$${Math.round(value / 5000) * 5}k`;
  return `${k(low)} (low) – ${k(mid)} (mid)`;
}

const shared = [
  "Approval path: one dwelling house with two wings — one full kitchen, one kitchenette, one shared laundry — is accepted development if it meets the codes (research/planning-rules.md). That keeps the lot's secondary dwelling free for Stage 2 and avoids a fire-rated separating wall.",
  "Floor 31.0 m, level with the pad: step-free from the parking bay to the front door. Two cars park side by side under the back, with 2.3–3.6 m headroom; the parking entry needs a small cut (about 0.2 m).",
  "Driveway: about 19 m from the pad, dropping 3.9 m (≈20%). Use a concrete strip or ribbed concrete on the steepest part.",
  "Kept 10 m from the mapped waterway (Biodiversity overlay AO1.2) and 7 m from Foley Road (6 m needed for upper levels). The whole footprint is inside the existing clearing.",
  "Bedrooms face quiet Foley Road; living rooms and decks face north to the sun, the view, and Nambour Connection Road — use acoustic glazing and solid deck balustrades on that side.",
];

const options = [
  {
    id: "home-side-by-side",
    title: "1 · Side by side",
    subtitle: "Two 4.5 × 12 m halves down the slope",
    recommended: true,
    spec: {
      origin: ORIGIN, width: 9, length: 12, floorLevel: FLOOR,
      rooms: [
        { name: "Bed A", kind: "bed", x: 0, y: 0, w: 4.5, h: 3.3 }, { name: "Bed B", kind: "bed", x: 4.5, y: 0, w: 4.5, h: 3.3 },
        { name: "Bath A", kind: "bath", x: 0, y: 3.3, w: 2.7, h: 2.4 }, { name: "Laundry", kind: "shared", x: 2.7, y: 3.3, w: 3.6, h: 2.4 }, { name: "Bath B", kind: "bath", x: 6.3, y: 3.3, w: 2.7, h: 2.4 },
        { name: "Living + kitchen A", kind: "living", x: 0, y: 5.7, w: 4.5, h: 6.3 }, { name: "Living + kitchen B", kind: "living", x: 4.5, y: 5.7, w: 4.5, h: 6.3 },
      ],
      partyWalls: [[4.5, 0, 4.5, 3.3], [4.5, 5.7, 4.5, 12]],
      decks: [{ x: 1, y: 12, w: 8, h: 2.4 }, { x: 3, y: -1.2, w: 6, h: 1.2 }],
      cars: [{ x: 4.6, y: 8.9, across: true }, { x: 4.6, y: 11.2, across: true }],
      driveway: driveway([1.5, 7.6, 9, 12.4]),
    },
    stats: ["108 m² (two 54 m² halves)", "Least wall per m² of the practical shapes (0.39 m/m²)", "Parking for 2 under the back", "Indicative all-in cost: " + costRange(108)],
    notes: [
      "Your front-to-back idea, and the fairest split: each half is a through-house with the bedroom at the road end, bathroom in the middle, and living, kitchen, and deck facing north. Room types match across the shared wall, which is also the structural spine.",
      "The laundry sits between the bathrooms on one plumbing run, reached from either side.",
    ],
  },
  {
    id: "home-front-back",
    title: "2 · Front and back",
    subtitle: "One unit at the road end, one over the carport",
    spec: {
      origin: ORIGIN, width: 8.4, length: 13, floorLevel: FLOOR,
      rooms: [
        { name: "Living + kitchen A", kind: "living", x: 0, y: 0, w: 5, h: 5.6 }, { name: "Bed A", kind: "bed", x: 5, y: 0, w: 3.4, h: 3.4 }, { name: "Bath A", kind: "bath", x: 5, y: 3.4, w: 3.4, h: 2.2 },
        { name: "Shared entry", kind: "entry", x: 0, y: 5.6, w: 4.2, h: 2.2 }, { name: "Laundry", kind: "shared", x: 4.2, y: 5.6, w: 4.2, h: 2.2 },
        { name: "Living + kitchen B", kind: "living", x: 0, y: 7.8, w: 5, h: 5.2 }, { name: "Bath B", kind: "bath", x: 5, y: 7.8, w: 3.4, h: 2.2 }, { name: "Bed B", kind: "bed", x: 5, y: 10, w: 3.4, h: 3 },
      ],
      partyWalls: [[0, 5.6, 8.4, 5.6], [0, 7.8, 8.4, 7.8]],
      decks: [{ x: 1, y: 13, w: 7.4, h: 2 }, { x: 0, y: -1.2, w: 5, h: 1.2 }],
      cars: [{ x: 4.2, y: 9.4, across: true }, { x: 4.2, y: 11.8, across: true }],
      driveway: driveway([1, 8.2, 8.4, 13]),
    },
    stats: ["109 m² (47 + 47 m² units + 15 m² shared core)", "Unit A is step-free from the pad", "Parking for 2 under unit B", "Indicative all-in cost: " + costRange(109)],
    notes: [
      "A shared entry and laundry core separates the two units, so no bedroom or living room shares a wall. Unit A at the front is step-free — good for later life — but its living room faces Foley Road rather than north.",
      "Unit B gets the north deck and view, over the carport.",
    ],
  },
  {
    id: "home-module-pair",
    title: "3 · Module pair",
    subtitle: "Two 3.5 × 13 m factory modules and a shared slot",
    spec: {
      origin: ORIGIN, width: 9.4, length: 13, floorLevel: FLOOR,
      rooms: [
        { name: "Bed A", kind: "bed", x: 0, y: 0, w: 3.5, h: 3.6 }, { name: "Bath A", kind: "bath", x: 0, y: 3.6, w: 3.5, h: 2.2 }, { name: "Kitchen A", kind: "kitchen", x: 0, y: 5.8, w: 3.5, h: 2.6 }, { name: "Living A", kind: "living", x: 0, y: 8.4, w: 3.5, h: 4.6 },
        { name: "Laundry", kind: "shared", x: 3.5, y: 0, w: 2.4, h: 2.4 }, { name: "Slot deck", kind: "deck", x: 3.5, y: 2.4, w: 2.4, h: 10.6 },
        { name: "Bed B", kind: "bed", x: 5.9, y: 0, w: 3.5, h: 3.6 }, { name: "Bath B", kind: "bath", x: 5.9, y: 3.6, w: 3.5, h: 2.2 }, { name: "Kitchen B", kind: "kitchen", x: 5.9, y: 5.8, w: 3.5, h: 2.6 }, { name: "Living B", kind: "living", x: 5.9, y: 8.4, w: 3.5, h: 4.6 },
      ],
      decks: [{ x: 1, y: 13, w: 8.4, h: 1.8 }],
      cars: [{ x: 4.7, y: 9.2, across: true }, { x: 4.7, y: 11.6, across: true }],
      driveway: driveway([1.5, 8, 9.4, 13]),
    },
    stats: ["97 m² enclosed (two 45.5 m² modules + laundry pod)", "No separating wall: modules sit 2.4 m apart", "Least on-site building work; crane needed", "Indicative all-in cost: " + costRange(97)],
    notes: [
      "Two identical factory modules on one steel deck, with a roofed slot between them for the stair, laundry pod, and a shared outdoor room. 3.5 m modules travel without a pilot vehicle.",
      "The smallest suites (about 3.2 m inside width), and the crane must reach from Foley Road over retained trees.",
    ],
  },
  {
    id: "home-starter",
    title: "4 · Starter wing",
    subtitle: "Build one half now, the second later",
    parts: (future) => [
      {
        origin: ORIGIN, width: 4.5, length: 12, floorLevel: FLOOR,
        rooms: [
          { name: "Bed A", kind: "bed", x: 0, y: 0, w: 4.5, h: 3.3 }, { name: "Bath + laundry", kind: "bath", x: 0, y: 3.3, w: 4.5, h: 2.4 }, { name: "Living + kitchen A", kind: "living", x: 0, y: 5.7, w: 4.5, h: 6.3 },
        ],
        partyWalls: [[4.5, 0, 4.5, 12]],
        decks: [{ x: 1, y: 12, w: 3.5, h: 2.4 }, { x: 0, y: -1.2, w: 4.5, h: 1.2 }],
        cars: [{ x: 3, y: 9.6, across: true }],
        driveway: driveway([0.5, 7.6, 9, 12.4]),
      },
      {
        origin: [ORIGIN[0] + 4.5, ORIGIN[1]], width: 4.5, length: 12, floorLevel: FLOOR, future,
        rooms: [
          { name: "Bed B", kind: "bed", x: 0, y: 0, w: 4.5, h: 3.3 }, { name: "Bath B", kind: "bath", x: 0, y: 3.3, w: 4.5, h: 2.4 }, { name: "Living + kitchen B", kind: "living", x: 0, y: 5.7, w: 4.5, h: 6.3 },
        ],
      },
    ],
    stats: ["54 m² now (a one-bedroom half), 54 m² later", "Fits $300k in the low-to-mid case", "Parking for 1–2 under", "Indicative all-in cost now: " + costRange(54)],
    notes: [
      "Concept 1 built in two stages: the first half with a shared-wall-ready side, its own bath and laundry, and the stair, driveway, and services sized for both. The second half (shown faded) bolts on later against the prepared wall.",
      "The honest fit for $300k: research/build-costs.md puts a full 108 m² two-unit building at about $410k (low) to $590k (mid) on this site.",
    ],
  },
];

export default options.map((option) => {
  const parts = option.parts ? option.parts(true) : [option.spec];
  return {
    ...option,
    notes: [...option.notes, ...shared],
    footprints: (data) => parts.map((part) => footprint(data, part)),
    build: (context) => buildParts(context, parts),
  };
});
