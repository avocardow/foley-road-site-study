// Stage 2 (later): a two-bedroom home for a couple, kept within the 60 m² gross floor area of a
// secondary dwelling so it needs no planning application (research/planning-rules.md). With Stage 1
// down the left and the driveway beside it, the free space is a 5 × 6 m pocket at the front right,
// so the home goes up two storeys on the high ground by the pad.
import { buildParts, footprint } from "./building.js";
import { costRange } from "./stage-one.js";

const lower = {
  origin: [54.4, 6.5], width: 4.8, length: 6.2, floorLevel: 31.2, roof: false, future: true,
  rooms: [
    { name: "Bath + laundry", kind: "bath", x: 0, y: 0, w: 2.4, h: 2.4 }, { name: "Entry + stair", kind: "stair", x: 2.4, y: 0, w: 2.4, h: 2.4 },
    { name: "Living + kitchen", kind: "living", x: 0, y: 2.4, w: 4.8, h: 3.8 },
  ],
  decks: [{ x: 0, y: 6.2, w: 4.8, h: 1.6 }],
};
const upper = {
  origin: [54.4, 6.5], width: 4.8, length: 6.2, floorLevel: 34.1, posts: false, future: true,
  rooms: [
    { name: "Stair", kind: "stair", x: 0, y: 0, w: 1.9, h: 2.8 }, { name: "Bed 2", kind: "bed", x: 1.9, y: 0, w: 2.9, h: 2.8 },
    { name: "Bed 1", kind: "bed", x: 0, y: 2.8, w: 4.8, h: 3.4 },
  ],
};

export default [
  {
    id: "friends-two-storey",
    title: "A · Two-storey 60",
    subtitle: "4.8 × 6.2 m over two levels, front right",
    stats: ["60 m² gross floor area (the secondary-dwelling limit)", "Entry level with the pad; bedrooms upstairs", "Height about 7.7 m of the 8.5 m limit", "Indicative all-in cost: " + costRange(60)],
    notes: [
      "Living, kitchen, and a combined bathroom and laundry at pad level with a north deck; two bedrooms upstairs. Decks and parking do not count towards the 60 m².",
      "Sits 3.4 m from Stage 1 and just clear of the driveway; the fence gate would shift about 2 m left to line up with the driveway.",
      "A larger home (70–90 m²) would need a dual occupancy approval or Council's agreement that it is still ancillary (research/planning-rules.md).",
      "Parking: a space on the pad beside the driveway, or share the bays under Stage 1.",
    ],
    footprints: (data) => [footprint(data, lower)],
    build: (context) => buildParts(context, [lower, upper]),
  },
];
