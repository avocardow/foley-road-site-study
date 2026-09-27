// Homes for the lot, as briefed on 2026-09-27: the siblings' building is an Outhaus-style Flex 10.8
// (4 × 10.8 m: bedroom, study, living and dining, kitchen, bathroom) backed onto a Wide 8.4
// (4 × 8.4 m: bedroom, bathroom, living and kitchen) under one roof, so it is one dwelling house
// with two living spaces. The couple's home is a Family 13.5 (4 × 13.5 m, two bedrooms): a
// separate secondary dwelling under the 60 m² cap, as far from the siblings' building as the
// pocket allows. Everything is single level and inside the existing clearing.
// Positions were checked against the site model; see research/three-homes-layouts.md.
import { buildParts, costRange, footprint } from "./building.js";

const home = (name, origin, width, length, floorLevel, rooms, extra = {}) => ({ role: name, origin, width, length, floorLevel, rooms, ...extra });

// Driveway between the buildings: dead straight from the existing entrance to a turning court, past
// the couple's home angled 15° (front to the right), with level parking bays cut into the slope under
// the low ends of both buildings.
const DRIVE_BETWEEN = {
  siteOnly: true,
  driveway: [
    [[53.05, -2.3], [56.15, -2.3], [51.25, 16], [48.15, 16]],
    [[42.8, 15.3], [51.9, 15.3], [50.6, 20.6], [43.2, 20.8]],
    [[40.65, 9.9], [46.45, 9.9], [46.45, 15.3], [40.65, 15.3]],
    [[52.72, 15.19], [55.13, 15.84], [53.84, 20.67], [51.42, 20.02]],
  ],
  cars: [{ s: 41.85, d: 12.6 }, { s: 45.15, d: 12.6 }, { s: 53.28, d: 17.93, rotation: -15 }],
};

const layouts = [
  {
    id: "pair-drive-between",
    title: "A · Driveway between, parking under",
    subtitle: "Your pair left, friends angled on the right, a straight driveway between · 4.7 m apart",
    recommended: true,
    gap: 4.7,
    site: DRIVE_BETWEEN,
    homes: [
      home("A", [39.5, 4.5], 4, 8.4, 31.0, [
        { name: "Bed", kind: "bed", x: 0, y: 0, w: 4, h: 3 },
        { name: "Bath", kind: "bath", x: 0, y: 3, w: 2.2, h: 2.2 },
        { name: "Entry + shared ldry", kind: "laundry", x: 2.2, y: 3, w: 1.8, h: 2.2 },
        { name: "Kitchen · living · dining", kind: "living", x: 0, y: 5.2, w: 4, h: 3.2 },
        { name: "", kind: "kitchen", x: 3.35, y: 5.2, w: 0.65, h: 2.6 },
      ], { partyWalls: [[4, 0, 4, 8.4]], postSpan: 4.1 }),
      home("B", [43.5, 4.5], 4, 10.8, 31.0, [
        { name: "Bed", kind: "bed", x: 0, y: 0, w: 4, h: 3.1 },
        { name: "Bath", kind: "bath", x: 0, y: 3.1, w: 2.2, h: 2.2 },
        { name: "Study nook", kind: "store", x: 2.2, y: 3.1, w: 1.8, h: 2.2 },
        { name: "Kitchen · living · dining", kind: "living", x: 0, y: 5.3, w: 4, h: 5.5 },
        { name: "", kind: "kitchen", x: 0, y: 5.3, w: 0.65, h: 3.2 },
      ], { postSpan: 4.1 }),
      home("F", [54.6, 7], 4, 13.5, 31.1, [
        { name: "Bed 1", kind: "bed", x: 0, y: 0, w: 4, h: 3.1 },
        { name: "Kitchen · living · dining", kind: "living", x: 0, y: 3.1, w: 4, h: 5.5 },
        { name: "", kind: "kitchen", x: 0, y: 5.6, w: 0.65, h: 3 },
        { name: "Hall + ldry", kind: "laundry", x: 0, y: 8.6, w: 1.8, h: 2.2 },
        { name: "Bath", kind: "bath", x: 1.8, y: 8.6, w: 2.2, h: 2.2 },
        { name: "Bed 2", kind: "bed", x: 0, y: 10.8, w: 4, h: 2.7 },
      ], { rotation: -15, postSpan: 4.1 }),
    ],
    notes: [
      "Your building sits as far left as it can go: its back-left corner is on the 10 m waterway buffer line, and angling it only swings the back further right. The couple's home is angled 15° with its front swung right into the free front-right corner, and its side deck is removed. That opens a dead-straight 3 m driveway from the existing entrance to a turning court at the bottom: about 19 m at a 20% average grade, with no bends and about 0.8 m clear of each building. It separates the two households, and no shed, carport, or garage is needed.",
      "Angling your building as well (front to the left) was tested: its front cannot move further left because of the waterway buffer, so its back swings towards the couple's home and the gap drops from 4.7 m to about 3.8 m. It stays square to the road.",
      "Parking under the homes: two cars side by side under the low end of your building (one under the Wide, one under the Flex) and one under the back of the couple's home, reached from the court, each on a level bay cut into the slope at about 28.3 m. Headroom is about 2.35–2.45 m with floors raised about 0.3 m (31.0 m and 31.1 m), which costs one or two extra front steps. The bays need up to about 0.8 m of cut, with a low retaining wall at the uphill end, and a little fill at the back of the court.",
      "Your Wide 8.4 and Flex 10.8 run side by side down the slope, sharing a long wall under one roof. Posts stand only on the long edges, so the car bays underneath stay clear.",
      "Open plan: in every home only the bedrooms and bathroom are enclosed. Each bedroom sits at the road end; the rest opens into one kitchen, living, and dining space facing north. There are no corridors — the passage beside each bathroom doubles as the entry and shared laundry (Wide), a study nook (Flex), or the hall and laundry to the second bedroom (Family 13.5). Kitchen benches run along the shared wall, so both kitchens, the shared laundry, and the Flex bathroom share one plumbing wall.",
      "Open areas: Wide about 13 m² plus the 4 m² entry; Flex about 22 m² plus the 4 m² study nook; Family 13.5 about 22 m². Bathrooms are 2.2 × 2.2 m, the minimum practical size under Queensland's livable-housing rules (research/three-homes.md).",
      "The couple's Family 13.5 runs down the right-hand edge, angled away from your building at the front. Visitors park in the turning court.",
      "The court and bays sit in the mapped overland flow path: use permeable paving or gravel with a spoon drain, and confirm with a civil engineer.",
    ],
  },
];

const shared = [
  "Single-level, high-set homes on steel posts, sized from small-home plans such as the Outhaus range (Flex 10.8, Wide 8.4, Family 13.5) for a builder to build to spec. Both buildings sit inside the existing clearing, 10 m from the mapped waterway and 4.5 m from Foley Road.",
];
const approval = "Approval: your building is the dwelling house (one roof, two living spaces) and the couple's 54 m² home is the secondary dwelling — under the 60 m² cap, so it needs no planning application if it meets the other acceptable outcomes (research/planning-rules.md). Keep the site shared: no dividing fences, shared parking and paths.";

export default layouts.map((layout) => {
  const floors = layout.homes.reduce((totals, part) => ({ ...totals, [part.role]: (totals[part.role] ?? 0) + part.width * part.length }), {});
  const total = Object.values(floors).reduce((sum, area) => sum + area, 0);
  const couple = floors.F, siblings = total - couple;
  const siblingParts = ["A", "B"].filter((role) => floors[role]).map((role) => Math.round(floors[role])).join(" + ");
  const parts = layout.homes.map((part) => ({ ...part, decks: part.decks ?? [] }));
  return {
    ...layout,
    stats: [
      `${Math.round(total)} m² in total: couple ${Math.round(couple)} m², siblings ${siblingParts} m²`,
      `${layout.gap} m between the two buildings`,
      `Siblings' building indicative cost: ${costRange(siblings)}`,
      `Couple's home indicative cost: ${costRange(couple)}`,
    ],
    notes: [...layout.notes, approval, ...shared],
    footprints: (data) => parts.map((part) => footprint(data, part)),
    build: (context) => buildParts(context, [...parts, layout.site]),
  };
});
