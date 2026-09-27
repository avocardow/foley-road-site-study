// Three single-level homes in the clearing: a two-bedroom home for the couple (roughly half the
// floor area) and a one-bedroom home each for the siblings. Sizes are custom, drawn from small-home
// plans such as the Outhaus range (3.4–4.0 m wide bars, 20–54 m²) but sized to this pocket.
// Every layout keeps homes 10 m from the mapped waterway, 4.5 m from Foley Road (single storey),
// inside the existing clearing, and 1.8 m apart unless they share a fire-rated wall. Parking stays
// on the existing pad at the road, so no long driveway is needed and cars stay outside the dog fence.
// Positions were checked against the site model; see research/three-homes-layouts.md.
import { buildParts, footprint } from "./building.js";
import { costRange } from "./stage-one.js";

// Rooms laid out in bands along a building's long axis. A band either spans the full width or is
// split across it. The band with no size takes what is left.
function plan(width, length, bands, { fromEnd = false } = {}) {
  const alongX = width > length;
  const long = alongX ? width : length, short = alongX ? length : width;
  const fixed = bands.reduce((sum, band) => sum + (band.size ?? 0), 0);
  const rooms = [];
  let at = 0;
  for (const band of bands) {
    const size = band.size ?? long - fixed;
    const start = fromEnd ? long - at - size : at;
    const parts = band.split ?? [{ name: band.name, kind: band.kind, frac: 1 }];
    let across = 0;
    for (const part of parts) {
      const extent = short * part.frac;
      rooms.push(alongX ? { name: part.name, kind: part.kind, x: start, y: across, w: size, h: extent } : { name: part.name, kind: part.kind, x: across, y: start, w: extent, h: size });
      across += extent;
    }
    at += size;
  }
  return rooms;
}

// A one-bedroom bar: bedroom, bathroom with laundry beside it, then living and kitchen.
const oneBed = (width, length, options) => plan(width, length, [
  { name: "Bed", kind: "bed", size: 3.1 },
  { size: 2.2, split: [{ name: "Bath", kind: "bath", frac: 0.6 }, { name: "Ldry", kind: "laundry", frac: 0.4 }] },
  { name: "Living + kitchen", kind: "living" },
], options);

// A near-square pod: bedroom and bathroom across the front, living and kitchen behind.
const pod = (width, length) => [
  { name: "Bed", kind: "bed", x: 0, y: 0, w: width * 0.58, h: 3.1 },
  { name: "Bath + ldry", kind: "bath", x: width * 0.58, y: 0, w: width * 0.42, h: 3.1 },
  { name: "Living + kitchen", kind: "living", x: 0, y: 3.1, w: width, h: length - 3.1 },
];

// A narrow two-bedroom home in the pattern of Outhaus's Family 13.5: a bedroom at each end.
const twoBedLinear = (width, length, options) => plan(width, length, [
  { name: "Bed 1", kind: "bed", size: 3.3 },
  { size: 2.4, split: [{ name: "Bath", kind: "bath", frac: 0.6 }, { name: "Ldry", kind: "laundry", frac: 0.4 }] },
  { name: "Living + kitchen", kind: "living" },
  { name: "Bed 2", kind: "bed", size: 3.1 },
], options);

// A deeper two-bedroom home: bedrooms and bathroom along the front, living and kitchen behind.
const twoBedDeep = (width, length) => {
  const band = 3.3;
  return [
    { name: "Bed 1", kind: "bed", x: 0, y: 0, w: 3.6, h: band },
    { name: "Bath", kind: "bath", x: 3.6, y: 0, w: 2.4, h: band },
    { name: "Ldry", kind: "laundry", x: 6, y: 0, w: 1.6, h: band },
    { name: "Bed 2", kind: "bed", x: 7.6, y: 0, w: width - 7.6, h: band },
    { name: "Kitchen", kind: "kitchen", x: 0, y: band, w: Math.min(3.6, width * 0.35), h: length - band },
    { name: "Living + dining", kind: "living", x: Math.min(3.6, width * 0.35), y: band, w: width - Math.min(3.6, width * 0.35), h: length - band },
  ];
};

const PARKING = {
  siteOnly: true,
  driveway: [[[50.6, 0.3], [58.6, 0.3], [58.6, 6.3], [50.6, 6.3]]],
  cars: [{ s: 52.1, d: 3.3 }, { s: 54.6, d: 3.3 }, { s: 57.1, d: 3.3 }],
};

const home = (name, origin, width, length, floorLevel, rooms, extra = {}) => ({ role: name, origin, width, length, floorLevel, rooms, ...extra });

// Owner's scheme: the siblings' building is an Outhaus-style Flex 10.8 (4 × 10.8 m: bedroom, study,
// living and dining, kitchen, bathroom) backed onto a Wide 8.4 (4 × 8.4 m: bedroom, bathroom, living
// and kitchen) under one roof — one dwelling house with two living spaces. The couple's home is a
// Family 13.5 (4 × 13.5 m, two bedrooms) as a separate secondary dwelling under the 60 m² cap,
// placed as far from the siblings' building as the pocket allows.
const flex = (width, length, options) => plan(width, length, [
  { name: "Bed", kind: "bed", size: 3.1 }, { name: "Study", kind: "store", size: 2.4 },
  { name: "Living + dining", kind: "living", size: 2.9 }, { name: "Kitchen", kind: "kitchen", size: 1.6 },
  { name: "Bath", kind: "bath" },
], options);
const wide = (width, length, options) => plan(width, length, [
  { name: "Bed", kind: "bed", size: 3.2 },
  { size: 2.0, split: [{ name: "Bath", kind: "bath", frac: 0.6 }, { name: "Robe", kind: "store", frac: 0.4 }] },
  { name: "Living + kitchen", kind: "living" },
], options);
const family = (width, length, options) => plan(width, length, [
  { name: "Bed 1", kind: "bed", size: 3.1 }, { name: "Living + dining", kind: "living", size: 3.6 },
  { name: "Kitchen", kind: "kitchen", size: 2.2 },
  { size: 1.8, split: [{ name: "Bath", kind: "bath", frac: 0.6 }, { name: "Ldry", kind: "laundry", frac: 0.4 }] },
  { name: "Bed 2", kind: "bed" },
], options);

// Driveway between the buildings: from the pad down a 3.2 m corridor to a turning court, with level
// parking bays cut into the slope under the low ends of both buildings.
const DRIVE_BETWEEN = {
  siteOnly: true,
  driveway: [
    [[53.4, -0.2], [56.6, -0.2], [56.6, 0.5], [51.6, 6], [51.6, 15.3], [48.4, 15.3], [48.4, 6], [53.4, 0.5]],
    [[42.8, 15.3], [52, 15.3], [52, 20.8], [43.2, 20.8]],
    [[40.8, 9.9], [46.7, 9.9], [46.7, 15.3], [40.8, 15.3]],
    [[52.2, 14.5], [54.7, 14.5], [54.7, 19.9], [52.2, 19.9]],
  ],
  cars: [{ s: 42.1, d: 12.6 }, { s: 45.4, d: 12.6 }, { s: 53.45, d: 17.2 }],
};

const pairLayouts = [
  {
    id: "pair-drive-between",
    title: "A · Driveway between, parking under",
    subtitle: "Your pair left, friends right, the driveway between · 4.25 m apart",
    recommended: true,
    gap: 4.25,
    site: DRIVE_BETWEEN,
    homes: [
      home("A", [39.75, 4.5], 4, 8.4, 31.0, plan(4, 8.4, [
        { name: "Bed", kind: "bed", size: 3.2 },
        { size: 2.0, split: [{ name: "Bath", kind: "bath", frac: 0.6 }, { name: "Shared ldry", kind: "laundry", frac: 0.4 }] },
        { name: "Living + kitchen", kind: "living" },
      ]), { partyWalls: [[4, 0, 4, 8.4]], postSpan: 4.1 }),
      home("B", [43.75, 4.5], 4, 10.8, 31.0, plan(4, 10.8, [
        { name: "Bed", kind: "bed", size: 3.1 }, { name: "Study", kind: "store", size: 2.4 },
        { name: "Bath", kind: "bath", size: 1.8 }, { name: "Kitchen", kind: "kitchen", size: 1.6 },
        { name: "Living + dining", kind: "living" },
      ]), { postSpan: 4.1 }),
      home("F", [52, 6.5], 4, 13.5, 31.1, family(4, 13.5), { decks: [{ x: 4, y: 1, w: 2, h: 6.5 }], postSpan: 4.1 }),
    ],
    notes: [
      "The driveway runs from the existing pad down a 3.2 m corridor between the two homes to a turning court at the bottom: about 19.5 m long at an 18% average grade. It separates the two households, and no shed, carport, or garage is needed.",
      "Parking under the homes: two cars side by side under the low end of your building (one under the Wide, one under the Flex) and one under the couple's home beside the driveway, each on a level bay cut into the slope at about 28.3 m. Headroom is about 2.35–2.45 m with floors raised about 0.3 m (31.0 m and 31.1 m), which costs one or two extra front steps. The bays need up to about 0.8 m of cut, with a low retaining wall at the uphill end, and a little fill at the back of the court.",
      "Your Wide 8.4 and Flex 10.8 run side by side down the slope, sharing a long wall under one roof; the bathrooms and the shared laundry sit back to back on one plumbing run. Posts stand only on the long edges, so the car bays underneath stay clear.",
      "The couple's Family 13.5 runs down the right-hand edge with its deck on the far (east) side, facing away from you. Visitors park on the pad at the road.",
      "The court and bays sit in the mapped overland flow path: use permeable paving or gravel with a spoon drain, and confirm with a civil engineer.",
    ],
  },

  {
    id: "pair-front-friends-behind",
    title: "B · Your pair in front, friends behind",
    subtitle: "Flex 10.8 + Wide 8.4 under one roof · Family 13.5 at the back · 5 m apart",
    gap: 5.0,
    homes: [
      home("A", [39.5, 4.5], 8.4, 4, 30.9, wide(8.4, 4), { partyWalls: [[0, 4, 8.4, 4], [8.4, 0, 8.4, 4]] }),
      home("Shared", [47.9, 4.5], 2.4, 4, 30.9, [{ name: "Laundry + entry", kind: "shared", x: 0, y: 0, w: 2.4, h: 4 }], { decks: [{ x: 2.4, y: 0, w: 2.6, h: 8 }] }),
      home("B", [39.5, 8.5], 10.8, 4, 30.9, flex(10.8, 4)),
      home("F", [42.5, 17.5], 13.5, 4, 29.0, family(13.5, 4, { fromEnd: true }), { decks: [{ x: 13.5, y: 0.4, w: 1.8, h: 3.6 }] }),
    ],
    notes: [
      "Your building is one 8 × 10.8 m rectangle under one roof: the Wide 8.4 along the road, the Flex 10.8 behind it, sharing a long wall. The 2.4 m left over beside the Wide becomes a shared covered laundry and entry — the simplest, cheapest shape, and one that clearly reads as one dwelling. Each of you has your own front door off the shared entry.",
      "The couple's Family 13.5 sits across the back, 5 m from your building — the most the pocket allows — and its floor is about 1.9 m lower because the land falls away. Its only deck faces east, away from you.",
      "For privacy: a planted screen or battened fence in the 5 m gap, bedrooms and bathrooms on the walls that face each other with high windows, and living rooms and decks facing away. Your deck faces the private garden on the east side.",
    ],
  },
  {
    id: "pair-left-friends-right",
    title: "C · Your pair left, friends right, no driveway",
    subtitle: "Both buildings running down the slope · 4.25 m apart",
    gap: 4.25,
    homes: [
      home("A", [39.75, 4.5], 4, 8.4, 30.7, wide(4, 8.4), { partyWalls: [[4, 0, 4, 8.4]], decks: [{ x: 1, y: 8.4, w: 3, h: 2.2 }] }),
      home("B", [43.75, 4.5], 4, 10.8, 30.7, plan(4, 10.8, [
        { name: "Bed", kind: "bed", size: 3.1 }, { name: "Study", kind: "store", size: 2.4 },
        { name: "Bath", kind: "bath", size: 1.8 }, { name: "Kitchen", kind: "kitchen", size: 1.6 },
        { name: "Living + dining", kind: "living" },
      ])),
      home("F", [52, 6.5], 4, 13.5, 30.9, family(4, 13.5), { decks: [{ x: 4, y: 1, w: 2, h: 6.5 }] }),
    ],
    notes: [
      "Your Wide 8.4 and Flex 10.8 run side by side down the slope, sharing a long wall; the bathrooms back onto each other on one plumbing run. Both living rooms face north. The Wide's shorter length leaves a small deck at the back.",
      "The couple's Family 13.5 runs down the right-hand edge, 4.25 m away, with its deck on the far (east) side. A garden strip between the buildings takes the screen planting.",
      "Laundry: in the Flex's study end or a cupboard; the notch at the back is inside the waterway buffer, so it cannot be enclosed.",
    ],
  },
  {
    id: "friends-left-pair-right",
    title: "D · Friends on the left, your pair on the right",
    subtitle: "Family 13.5 down the left edge · 3 m apart",
    gap: 3.0,
    homes: [
      home("F", [41.5, 4.5], 4, 13.5, 30.4, family(4, 13.5), { decks: [{ x: 0.9, y: 13.5, w: 3.1, h: 1.6 }] }),
      home("B", [48.5, 6.5], 10.8, 4, 31.2, flex(10.8, 4, { fromEnd: true }), { partyWalls: [[0, 4, 8.4, 4]] }),
      home("A", [48.5, 10.5], 8.4, 4, 31.2, wide(8.4, 4, { fromEnd: true }), { decks: [{ x: 0, y: 4, w: 6, h: 2 }] }),
    ],
    notes: [
      "The couple's Family 13.5 runs down the left edge along the waterway buffer; your building sits on the higher right-hand side next to the parking, with the Flex along the front and the Wide behind it.",
      "The gap is only 3 m, the least private of the three.",
    ],
  },
];

const layouts = [
  {
    id: "three-front-pair",
    title: "1 · Front pair, big home behind",
    subtitle: "Two siblings' bars at the road, couple's home across the back",
    recommended: true,
    homes: [
      home("A", [38.5, 4.6], 8.4, 4.2, 30.5, oneBed(8.4, 4.2), { decks: [{ x: 8.4, y: 0.4, w: 2.5, h: 3.8 }] }),
      home("B", [49.4, 6.6], 8.4, 4.2, 30.85, oneBed(8.4, 4.2, { fromEnd: true })),
      home("F", [42.7, 12.8], 12.3, 7.8, 29.75, twoBedDeep(12.3, 7.8), { decks: [{ x: 1, y: 7.8, w: 10.5, h: 2 }] }),
    ],
    notes: [
      "The siblings' homes sit on the high ground by the road, each with its bedroom at the outer end and living rooms facing a shared deck between them. The couple's home takes the whole back of the clearing, with bedrooms facing the garden and a living room and deck facing north.",
      "A 4 m garden strip runs between the rows: the shared outdoor room for all three homes.",
    ],
  },
  {
    id: "three-bars",
    title: "2 · Three bars",
    subtitle: "Couple in the middle, siblings at the left and back",
    homes: [
      home("B", [40.4, 4.6], 4.2, 10.4, 30.15, oneBed(4.2, 10.4), { decks: [{ x: 0.6, y: 10.4, w: 3.6, h: 1.8 }] }),
      home("F", [46.4, 6.6], 11.2, 7.8, 30.85, twoBedDeep(11.2, 7.8), { decks: [{ x: -1.8, y: 1, w: 1.8, h: 6.8 }] }),
      home("A", [44.2, 16.6], 11.6, 4.2, 29.1, oneBed(11.6, 4.2, { fromEnd: true }), { decks: [{ x: 0, y: 4.2, w: 6, h: 1.8 }] }),
    ],
    notes: [
      "The largest total floor area of the seven layouts. The couple's home sits in the middle on the high ground near the parking; one sibling's long bar runs down the left edge, the other lies across the back with a north deck.",
      "A deck in the 1.8 m gap links the left bar and the couple's home.",
    ],
  },
  {
    id: "three-l-home",
    title: "3 · L-home and two cabins",
    subtitle: "Couple's L around a courtyard deck, two cabins on the right",
    homes: [
      home("F", [41.8, 4.6], 4.2, 13.2, 30.85, twoBedLinear(4.2, 13.2).map((room) => room.name === "Living + kitchen" ? { ...room, name: "Study", kind: "store" } : room)),
      home("F", [46, 4.6], 4.2, 8.4, 30.85, [{ name: "Living + kitchen", kind: "living", x: 0, y: 0, w: 4.2, h: 8.4 }], { decks: [{ x: 0, y: 8.4, w: 4.2, h: 2.4 }] }),
      home("B", [52, 6.6], 4.2, 8.2, 30.85, oneBed(4.2, 8.2), { decks: [{ x: 0, y: 8.2, w: 2.8, h: 1.6 }] }),
      home("A", [47.8, 17], 8.8, 4, 29.1, oneBed(8.8, 4, { fromEnd: true }), { decks: [{ x: 0, y: 4, w: 6, h: 1.6 }] }),
    ],
    notes: [
      "Two joined bars make the couple's L: a sleeping wing down the left edge and a living wing beside it, wrapping a north-facing courtyard deck. One sibling's cabin runs down the right, the other lies across the back.",
      "Two narrow wings suit two builder-made modules or a simple stick-built frame with 4.2 m spans.",
    ],
  },
  {
    id: "three-duplex-behind",
    title: "4 · Main house front, duplex behind",
    subtitle: "Couple's long home at the road, siblings share a wall behind",
    homes: [
      home("F", [39.8, 6.6], 16.2, 6.2, 30.85, twoBedLinear(16.2, 6.2), { decks: [{ x: 16.2, y: 0, w: 2, h: 6.2 }] }),
      home("A", [42.7, 14.6], 6.2, 6.2, 29.45, pod(6.2, 6.2), { decks: [{ x: 0.3, y: 6.2, w: 5.9, h: 1.4 }], partyWalls: [[6.2, 0, 6.2, 6.2]] }),
      home("B", [48.9, 14.6], 6.2, 6.2, 29.45, pod(6.2, 6.2), { decks: [{ x: 0, y: 6.2, w: 5.9, h: 1.4 }] }),
    ],
    notes: [
      "The couple's home is the step-free main house along the road. The siblings' pods share one fire-rated wall behind it, each with its own north deck — the simplest two-building site.",
      "The attached pair saves a wall and a roof edge; the separating wall must be fire-rated and acoustic, ground to roof.",
    ],
  },
  {
    id: "three-courtyard",
    title: "5 · Courtyard",
    subtitle: "Two cabins as wings, couple's home across the back",
    homes: [
      home("A", [39.4, 4.6], 4.2, 8.6, 30.15, oneBed(4.2, 8.6), { decks: [{ x: 4.2, y: 3, w: 2, h: 5.6 }] }),
      home("B", [53.4, 6.6], 4.2, 7.2, 30.85, oneBed(4.2, 7.2), { decks: [{ x: -2, y: 2.4, w: 2, h: 4.8 }] }),
      home("F", [42.8, 15.4], 12.2, 5.6, 29.25, twoBedLinear(12.2, 5.6), { decks: [{ x: 2.5, y: -2.2, w: 7.2, h: 2.2 }] }),
    ],
    notes: [
      "Three homes around a shared courtyard of about 9 × 8 m: the most open and sociable layout, and the smallest total floor area. Every living room and deck faces the courtyard.",
      "Good if the couple's home can be smaller (68 m²) and outdoor space matters more than floor area.",
    ],
  },
  {
    id: "three-village-street",
    title: "6 · Village street",
    subtitle: "A shared boardwalk down the slope between the homes",
    homes: [
      home("F", [41.7, 4.6], 5.8, 13.2, 30.55, plan(5.8, 13.2, [
        { name: "Bed 1", kind: "bed", size: 3.3 }, { name: "Bed 2", kind: "bed", size: 3.1 },
        { size: 2.2, split: [{ name: "Bath", kind: "bath", frac: 0.6 }, { name: "Ldry", kind: "laundry", frac: 0.4 }] },
        { name: "Living + kitchen", kind: "living" },
      ]), { decks: [{ x: 5.8, y: 0, w: 2.4, h: 15.8 }] }),
      home("A", [49.9, 6.6], 6, 6, 30.85, pod(6, 6)),
      home("B", [49.9, 14.4], 5, 6.2, 29.45, pod(5, 6.2), { decks: [{ x: 0, y: 6.2, w: 5, h: 1.2 }] }),
    ],
    notes: [
      "A 2.4 m boardwalk runs from the parking down the slope between the homes: front doors open onto it, like a lane. The couple's long home is on the left with its living room at the north end; the siblings' pods step down on the right.",
      "The boardwalk also carries services and is the shared outdoor room.",
    ],
  },
  {
    id: "three-terrace",
    title: "7 · Terrace row",
    subtitle: "Three homes joined in one building",
    homes: [
      home("A", [41.5, 6.6], 3.8, 10.2, 30.85, oneBed(3.8, 10.2), { decks: [{ x: 0, y: 10.2, w: 3.8, h: 1.8 }], partyWalls: [[3.8, 0, 3.8, 10.2]] }),
      home("B", [45.3, 6.6], 3.8, 10.2, 30.85, oneBed(3.8, 10.2), { decks: [{ x: 0, y: 10.2, w: 3.8, h: 1.8 }], partyWalls: [[3.8, 0, 3.8, 10.2]] }),
      home("F", [49.1, 6.6], 7.4, 10.2, 30.85, [
        { name: "Bed 1", kind: "bed", x: 0, y: 0, w: 3.7, h: 3.4 }, { name: "Bed 2", kind: "bed", x: 3.7, y: 0, w: 3.7, h: 3.4 },
        { name: "Bath", kind: "bath", x: 0, y: 3.4, w: 4.4, h: 2.2 }, { name: "Ldry", kind: "laundry", x: 4.4, y: 3.4, w: 3, h: 2.2 },
        { name: "Living + kitchen", kind: "living", x: 0, y: 5.6, w: 7.4, h: 4.6 },
      ], { decks: [{ x: 0, y: 10.2, w: 5.8, h: 1.8 }] }),
    ],
    notes: [
      "One building, one roof, three homes side by side down the slope — the cheapest envelope per square metre, like the 'Side by side' Stage 1 concept with a third, wider home added. Every home has a bedroom at the road end and a living room and deck facing north.",
      "Two fire-rated, acoustic separating walls. Leaves the right-hand part of the clearing free as garden.",
    ],
  },
];

const shared = [
  "Parking: three cars on the existing pad at the road, outside the dog fence; people walk in through a pedestrian gate. This avoids a steep driveway (about $12k–$20k and a 20% grade in the Stage 1 concepts).",
  "Single-level, high-set homes: at most about 3 m under the floor at the low corners. Sizes are custom but follow small-home plans such as the Outhaus range: 3.8–4.2 m wide bars, 1-bed homes of 30–50 m², 2-bed homes of 70–100 m².",
  "Approval: three homes on one lot is a 'multiple dwelling', which this zone does not intend (impact assessment). The practical framings are a dwelling house plus a secondary dwelling of up to 60 m² — for example the couple's home as the house and the siblings' homes as one building of up to 60 m² — or a dwelling house with attached wings (research/planning-rules.md, research/three-homes.md).",
];

const pairApproval = "Approval: your building is the dwelling house (one roof, two living spaces) and the couple's 54 m² home is the secondary dwelling — under the 60 m² cap, so it needs no planning application if it meets the other acceptable outcomes (research/planning-rules.md). Keep the site shared: no dividing fences, shared parking and paths.";
for (const layout of pairLayouts) layout.notes.push(pairApproval);

export default [...pairLayouts, ...layouts].map((layout) => {
  const floors = layout.homes.reduce((totals, part) => ({ ...totals, [part.role]: (totals[part.role] ?? 0) + part.width * part.length }), {});
  const total = Object.values(floors).reduce((sum, area) => sum + area, 0);
  const couple = floors.F, siblings = total - couple;
  const siblingParts = ["A", "B", "Shared"].filter((role) => floors[role]).map((role) => Math.round(floors[role])).join(" + ");
  const parts = layout.homes.map((part) => ({ ...part, rooms: part.rooms, decks: part.decks ?? [] }));
  return {
    ...layout,
    stats: [
      `${Math.round(total)} m² in total: couple ${Math.round(couple)} m² (${Math.round(100 * couple / total)}%), siblings ${siblingParts} m²`,
      ...(layout.gap ? [`${layout.gap} m between the two buildings`] : []),
      `Siblings' homes indicative cost: ${costRange(siblings)}`,
      `Couple's home indicative cost: ${costRange(couple)}`,
    ],
    notes: [...layout.notes, ...shared.filter((note) => !(layout.site && note.startsWith("Parking:")))],
    footprints: (data) => parts.map((part) => footprint(data, part)),
    build: (context) => buildParts(context, [...parts, layout.site ?? PARKING]),
  };
});
