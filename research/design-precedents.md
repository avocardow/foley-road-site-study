# Design precedents and layout concepts: Stage 1 two-suite building, 77 Foley Road, Woombye

Researched 27 September 2026. These notes gather precedents and passive-design guidance, then brainstorm layouts. They are not architectural, legal or certification advice. Dimensions are gross and approximate, measured to the outside of walls. Site facts come from this repo's site model (`index.html`, `site-data.json`). Approval rules are covered in [planning-rules.md](planning-rules.md) and costs in [build-costs.md](build-costs.md); this file does not repeat them.

---

## Bottom line

- **Approval class shapes the plan more than style does.** Choose the path before drawing.
  - **Path A, one dwelling with two suites**, is recommended in [planning-rules.md](planning-rules.md). It uses one shared laundry, and one half has only a kitchenette. It needs no fire-rated wall, and a shared carport or stair is fine.
  - **Path B (house plus attached secondary dwelling) or Path C (dual occupancy)** makes two Class 1a dwellings. The shared wall must then be fire-rated to FRL 60/60/60 from the footings to the underside of the roof. It must also achieve Rw + Ctr ≥ 50, with discontinuous construction wherever a wet area or kitchen backs onto a habitable room ([NCC 9.3](https://ncc.abcb.gov.au/editions/ncc-2022/adopted/housing-provisions/9-fire-safety/part-93-fire-protection-separating-walls-and-floors), [NCC 10.7](https://ncc.abcb.gov.au/editions/ncc-2022/adopted/housing-provisions/10-health-and-amenity/part-107-sound-insulation)).
- **Two traps for a high-set building.**
  - Two dwellings over a **shared** carport are Class 2 (apartment rules). So are two dwellings **stacked** one above the other. The NCC says Class 1 buildings "cannot be located above or below any other dwelling … other than a private garage", and gives "2 dwellings above a common basement or carpark" as a Class 2 example ([NCC building classifications](https://ncc.abcb.gov.au/ncc-navigator/building-classifications)).
  - Under Path B or C, the separating wall must therefore run down through the undercroft to the ground ([Timber Queensland TDS 33](https://img.bretts.com.au/33_Separating-Walls.pdf)). Each half then gets its own bay underneath.
- **The highway is on the downhill (NNE/NE) side, which is also the sun side.**
  - Nambour Connection Road is a state-controlled road carrying about 21,000 vehicles/day, 7.9% of them heavy (2019 count, section 489) ([Qld State Road Information service](https://spatial-gis.information.qld.gov.au/arcgis/rest/services/Transportation/StateRoadInformation/MapServer)).
  - Its near edge is about 11 m from the clearing's ESE corner and about 24 m from its WNW end.
  - A floor at about 30 m AHD sits 3–4 m above the carriageway (about 26 m), with nothing between them to block the sound.
- **How to plan for the noise:**
  - Put bathrooms, laundry, stairs and robes on the highway side or end.
  - Put bedrooms on the SSW (Foley Road) side.
  - Use solid deck balustrades and screens toward the road.
  - Check whether a QDC MP4.4 transport noise corridor applies.
- **Climate zone 2 passive basics** ([YourHome, Design for climate](https://www.yourhome.gov.au/passive-design/design-climate)):
  - Keep plans narrow, with openings on both sides for cross-ventilation.
  - Use 100% openable louvre or casement windows, low-SHGC glass and ceiling fans.
  - Build lightweight and light-coloured, and shade east and west year-round.
  - Keep a long axis parallel to Foley Road (WNW–ESE). The long faces then point NNE (about 28° east of north) and SSW, close to YourHome's "up to 25° east of north" range ([YourHome, Orientation](https://www.yourhome.gov.au/passive-design/orientation)).
  - Size eaves at about 45–50% of the sill-to-eave height. That is about 1.2 m over full-height doors ([YourHome, Shading](https://www.yourhome.gov.au/passive-design/shading)).
- **Bushfire and koala:**
  - Use one simple roof with no valleys, and steel posts.
  - Make exit stairs non-combustible, and keep the undercroft clear or enclosed.
  - Cars parked under the house add fire load ([QRA Bushfire Resilient Building Guidance](https://www.qra.qld.gov.au/sites/default/files/2020-12/0576_qra_bushfire_guideline_v10_pages_print.pdf)).
  - Do no clearing. Use koala-friendly fencing, with koala-exclusion fencing only around a dog run. Dogs should be confined from 6 pm to 6 am ([Koala-sensitive Design Guideline](https://wildlifefriendlyfencing.org/wp-content/uploads/2022/05/Koala-Sensitive-Design-Guidelines.pdf)).
  - Use low, amber, shielded lighting ([DCCEEW National Light Pollution Guidelines](https://www.dcceew.gov.au/environment/biodiversity/publications/national-light-pollution-guidelines-wildlife)).
- **Parking under the house versus a carport at road level.**
  - Parking under the low end is possible: a floor at about 30 m clears 2.4 m+ under roughly the NNE 5 m of a 12 m-deep footprint.
  - But the driveway has to drop 3–4 m, into the mapped overland-flow path, and toward the highway.
  - A carport near the existing pad at road level (6 m back from Foley Road) is simpler, keeps cars out of the flow path, and removes car fire load from under the floor.
- **Shortlist:**
  - **Concept 1**, the back-to-back pair on a shared wet wall (16.8 × 6.6 m, about 111 m²), is the cheapest shape and fits Path A best.
  - **Concept 4**, the pair of long narrow units running down the slope (9.0 × 12.0 m, about 108 m²), is the fairest split. It is the best fit if Stage 1 must be two dwellings, because each unit owns a parking bay under its own low end. It also suits two factory modules.
  - **Concept 5**, two 3.5 m modules either side of an open slot (about 97 m²), is the fastest. It avoids pilot vehicles and needs no fire wall, but gives the smallest suites.
- **Budget.** The cost research finds $300k does not cover about 110 m² of high-set building here; the mid case is about $590k–$630k ([build-costs.md](build-costs.md)). Every concept below is therefore designed for the cheapest form it can take: one roof, one plumbing zone, and standard 3.0–3.6 m spans. Concept 1 at about 100 m² is the one to price first.

---

## Site facts used for layout (from the repo site model)

| Item | Value | Source in repo |
|---|---|---|
| Clearing | ~523 m²; ~31 m along Foley Road × ~24 m deep (irregular) | `site-data.json` `clearedArea` |
| Building zone (clearing outside assumed setbacks and easement A) | ~341 m²; a 16 × 12 m or 18 × 10 m footprint parallel to Foley Road fits | `index.html` panel notes |
| Fall across the zone | 30.9 → 26.2 m AHD (4.7 m), mostly 15–25%; ~30.0 → 26.6 m across a 16 × 12 m footprint | `index.html` |
| High-set floor | A floor near 30 m leaves 3–3.5 m under the low side; one level plus roof fits the 8.5 m height limit | `index.html` |
| Foley Road | Bearing ~118°/298° (WNW–ESE), on the SSW (uphill) side; carriageway ~2–4 m from the clearing edge; the road is ~32 m AHD | computed from `site-data.json` |
| Nambour Connection Road | Runs ~142°/322° along the NE side; near edge ~11 m from the clearing's ESE corner and ~24 m from its WNW end; ~26 m AHD | computed from `site-data.json` |
| Hazards | 71% of the zone is in the mapped overland flow path; flood buffer; moderate landslide; medium bushfire buffer to the east; the whole lot is core koala habitat | `index.html` layer notes |

Orientation used in all diagrams: **top of the diagram = NNE (downhill, sun, highway); bottom = SSW (uphill, Foley Road, entries).**

---

## 1. Precedents

### 1.1 Two households, one building: siblings, dual key and lock-off

| Project | What it is | What to take from it | Source |
|---|---|---|---|
| **Sisters Houses**, Daher Jardim Arquitetura, Brasília, 2020 | Two small semi-detached, mirrored houses, each 40 m² (80 m² total). The street side is a blank white wall; the garden side has large openings. Living, kitchen and laundry are one room. Concrete footings and pillars with a light steel roof; built in 100 days on a low budget. | The closest match in size and use. Two 40 m² halves work if each has one generous living room. Close off the noisy side and open the private side. | [ArchDaily](https://www.archdaily.com/954654/sisters-houses-daher-jardim-arquitetura) |
| **Blok Three Sisters**, Vokes and Peters with Blok Modular, Point Lookout (Minjerribah), Qld | Three identical, autonomous terraces for three sisters. The architects rejected one big house because some rooms would "win and others lose". Built as 12 modules, **4.6 m wide**, in a Brisbane factory. Noise from the neighbouring sister's terrace "is insulated by the double walls of the dwelling's modular construction". The ground floor of each can run as a step-free apartment, and the verandahs link at the building edge. | Identical, equal halves reduce sibling friction. Two modules side by side give a natural double wall for sound and fire separation. Design one half to be step-free for later life. | [ArchitectureAU](https://architectureau.com/articles/blok-three-sisters-by-blok-modular-with-vokes-and-peters/); [AIA awards](https://www.architecture.com.au/archives/awards/blok-three-sisters); also [Dezeen](https://www.dezeen.com/2025/09/27/blok-three-sisters-vokes-peters/) |
| **Two Sisters Holiday Home**, MNY Arkitekter, Salo, Finland, 2023 | 131 m² for two siblings and their families, on the theme "together separately". Two standalone prefabricated solid-timber units are joined by a central terrace and fanned out to keep existing pines and rocks. | A shared outdoor room between two private units, rather than shared indoor rooms. Bend or shift the plan around trees. | [ArchDaily](https://www.archdaily.com/1013240/two-sisters-holiday-home-mny-arkitekter); [Dezeen](https://www.dezeen.com/2024/04/11/mny-arkitekter-two-sisters-holiday-home/) |
| **House for Two Brothers**, Pablo Bris Marino, Colmenar de Oreja, Spain, 2024 | About 148 m² (1,593 ft²) on a plot that falls 5 m. Two independent houses: a one-bedroom "apartment-type" house and a two-bedroom house. They share a storeroom and a small pool. | Precedent for Stage 1 plus Stage 2 on a slope. Share a store and outdoor areas, not living rooms. | [ArchDaily](https://www.archdaily.com/1025392/house-for-two-brothers-pablo-bris-marino) |
| **Live Work Share House**, Bligh Graham Architects, Brisbane | A three-bedroom house, a one-bedroom flat and a studio on one narrow lot, "separated by large or micro courtyards, offering independence and privacy". Shutters give privacy while letting air through. | Small courtyards or breezeways between units give privacy and ventilation in the SEQ climate. | [ArchitectureAU](https://architectureau.com/articles/a-mini-metropolis-live-work-share-house/) |
| **Five houses embracing shared living** (roundup: Stable House by Sibling Architecture, Elsternwick Penthouse, (Gr)ancillary Dwelling, Tanoa) | Two houses around a shared courtyard, and plans that switch between one home and two. | Plan the connecting door (Path A) so it can be sealed later if the approval path changes. | [ArchitectureAU](https://architectureau.com/articles/Five-houses-embracing-shared-living/) |
| **Dual living (Queensland builder definitions)** | A dual living home is "a single home designed from the beginning to include two separate living areas". The builder's 2026 price range is $277k–$440k (slab, suburban). A duplex usually needs a dual-occupancy DA. | The volume-builder version of Path A. Their prices are for flat sites. | [Dixon Homes](https://www.dixonhomes.com/post/granny-flat-vs-dual-living-vs-duplex-brisbane) |

### 1.2 Small high-set, pole and pier houses on SEQ slopes

| Project | What it is | What to take from it | Source |
|---|---|---|---|
| **The Queenslander tradition** | A lightweight timber house on stumps, with verandahs as "the hallmark of the Queensland home". It was raised to catch breezes, to escape stormwater on steep ground, and to protect against termites. | High-set is the local vernacular. The verandah is the outdoor room and the breeze scoop. | [State Library of Queensland](https://www.slq.qld.gov.au/blog/architectural-features) |
| **Gabriel Poole, Tent House**, Eumundi, 1990 | "Half tent / half house". Won the Robin Boyd Award. Poole's lifelong subject was affordable, lightweight, climate-responsive housing. | Hinterland lightweight minimalism. | [ArchitectureAU obituary](https://architectureau.com/articles/vale-gabriel-poole-1934-2020/); [Gabriel Poole archive](http://gabrielpoole.com.au/portfolio-view/tent-house-weyba-drive/) |
| **Tent House**, Sparks Architects, Eumundi, 2016 (344 m²) | In a forest clearing. Social rooms are in the centre; bedroom and bathroom wings are reached by side corridors. An operable insulated "box" sits under a tent-like roof. | Clearing-in-forest siting close to ours; living in the centre, private wings at the ends. | [ArchDaily](https://www.archdaily.com/805984/tent-house-sparks-architects); [ArchitectureAU](https://architectureau.com/articles/tent-house-sparks-architects/) |
| **Cooroy House**, Henry Bennett + Dan Wilson, 2023 (155 m²) | A "modest, off-grid home … lightweight, single-storey … simple and cost-effective", "raised above the ground on a single platform" to limit disturbance. It takes cues from local timber-and-tin cottages. | The nearest hinterland match on cost and ethos: one platform and one simple roof. | [ArchDaily](https://www.archdaily.com/1030492/cooroy-house-henry-bennett-plus-dan-wilson) |
| **Montville Residence**, Sparks Architects, 2012 (160 m²) | A house in a forest clearing on dramatic hinterland slopes. | Hinterland forest-clearing precedent of a modest size. | [ArchDaily](https://www.archdaily.com/537452/montville-residence-sparks-architects) |
| **Avonlea House**, Robinson Architects, Eumundi, 2017 | Hillside site: house 196 m², roofed decks 51 m², carport 53 m². | A useful ratio: roofed deck at about 25% of internal area is typical for SEQ living. | [ArchDaily](https://www.archdaily.com/889660/avonlea-house-robinson-architects) |
| **YourHome case study, Cairns** | 98 m² internal plus 117 m² of covered outdoor area on a steep slope. "2 pavilions connected by a covered breezeway". "Elevated on a lightweight steel-framed platform", with concrete only for the driveway, the carport slab and the pool. It has clerestory louvres along the spine, and every bedroom opens on two sides. The owners call it "an updated version of a traditional Queenslander". It cost $470k including the pool (older figure). | The best documented analogue for Concept 2: a pavilion pair on a steel platform over a slope. | [YourHome](https://www.yourhome.gov.au/case-studies/hot-humid/cairns-queensland) |
| **YourHome case study, Caloundra** | A 10-star Sunshine Coast display home: 150 m², $244k, on a slab. | Shows how cheap flat-site slab construction is; it is not comparable to high-set. | [YourHome](https://www.yourhome.gov.au/case-studies/hot-humid/caloundra-queensland) |
| **Builders' notes on slopes** | The Shed House: an engineered suspended steel floor instead of cut and fill. Cross-falls of 2–5 m are common in the hinterland. The underfloor space can be storage, a carport or a garage. Soils are often class M or H. Anchor Homes: homes more than 1.0 m off the ground use concrete footings with braced steel piers. Stroud Homes builds catalogue plans on poles or stumps for the Sunshine Coast. | Steel posts on pad or bored footings are the default; plan for cross-bracing in the undercroft. | [The Shed House](https://theshedhouse.com.au/building-on-sloping-block-queensland-steel-floor-system/); [Anchor Homes](https://anchorhomes.com.au/blog/modular-home-foundations); [Stroud Homes](https://www.stroudhomes.com.au/noosa-builder/pole-homes-for-sunshine-coast-sloping-blocks/) |

**How these handle the key parts:**
- **Parking under.** The Cairns case put its only slab at the street edge for the driveway and carport, not under the house. Builders offer undercroft carports where the slope gives clearance.
- **Stairs.** One external stair per pavilion or a shared stair in the breezeway. QRA advises that exit stairs and decks on escape routes should not be combustible.
- **Decks.** A deep verandah on the living side, as an outdoor room.
- **Bushfire.** Lightweight steel on posts, with the subfloor either enclosed or kept clear.

### 1.3 Modular, prefab and tiny-home products that could be paired

| Product / builder | Module size and plan | Pairing notes | Source |
|---|---|---|---|
| **Designer Eco Tiny Homes, modular series** | "The One Bedroom" **12 m × 4 m** (48 m²): bedroom with built-in wardrobe, open kitchen and living, bathroom, "concealed laundry in hallway", optional deck. "The Two Bedroom" **14 m × 4 m** (56 m²): bathroom and laundry combined. | Two One Bedrooms side by side give about 96 m², with a double wall between them. The Two Bedroom is a ready-made benchmark for Stage 2. | [Designer Eco Tiny Homes](https://designerecotinyhomes.com.au/modular-series/) |
| **Blok Modular**, Brisbane | Custom only, no catalogue. Three Sisters used **4.6 m** modules. The website says full prefab homes "typically start from $1M". | High-end; the reference for how to detail module pairs. | [Blok Sunshine Coast](https://blokmodular.com.au/prefabricated-homes/sunshine-coast); [ArchitectureAU](https://architectureau.com/articles/blok-three-sisters-by-blok-modular-with-vokes-and-peters/) |
| **Arcopod**, Qld-built cabins | "The Grove" (1-bed) and "The Outlook" (studio) support "mirrored installation for twin configurations". "The Aspect" has two private bedrooms linked by a central deck breezeway. "The Hollow" has two pods around a central alfresco. Sizes and prices are not published. | Off-the-shelf versions of the twin pod and breezeway ideas. | [Arcopod cabin range](https://arcopod.com.au/cabin-range/) |
| **Saltair**, factories at Coolum and Crestmead | Steel-framed modular homes. The catalogue runs from 96.4 m² (Tweed, 3-bed) upward; smaller designs are custom. There is a sloping-block page. | A local (Coolum) factory, so a short haul to Woombye. | [Saltair designs](https://www.saltair.com.au/designs); [Saltair sloping blocks](https://saltairmodular.com.au/modular-homes-for-sloping-block/) |

**Transport width sets module width.**
- Under the 2026 National Class 1 dimension notice, Queensland allows loads up to **5.5 m** wide.
- A **pilot vehicle is needed above 3.5 m** wide (daytime, non-metro) ([NHVR information sheet](https://www.nhvr.gov.au/document/517)).
- Modules **≤ 3.5 m** (about 3.2 m inside) are therefore the cheapest to move. Modules of 4.0–4.6 m give better rooms but need pilots, and possibly a crane that can reach from Foley Road over the retained canopy.

**Pairing rule of thumb.** Two modules set **against each other** form a double-stud wall. That wall can be built as a tested fire-and-sound separating system for Paths B and C, as in Three Sisters. Two modules set **≥ 1.8 m apart** are separate buildings, so their facing walls need no fire rating ([NCC 9.2.1](https://ncc.abcb.gov.au/editions/ncc-2022/adopted/housing-provisions/9-fire-safety/part-92-fire-separation-external-walls)). If one roof spans the gap, the certifier needs to confirm how it is treated.

### 1.4 Passive, acoustic, bushfire and koala design for this lot

**Climate zone 2 (warm humid summer, mild winter): YourHome recommendations applied here.**
- **Aim.** "Eliminate the need for heating in winter and reduce the need for cooling in summer" ([Design for climate](https://www.yourhome.gov.au/passive-design/design-climate)).
- **Plan.** "Use narrow floor plans"; design openings for breezes; "Locate sleeping spaces in lower levels. Use low or no thermal mass in sleeping spaces"; provide screened, shaded outdoor living.
  - Here that means an internal depth of **6–7 m or less** for through-ventilation.
  - Put bedrooms on the uphill SSW side, which is quieter and cooler.
- **Windows.**
  - "Use 100% openable windows such as louvre or casement".
  - Use low-SHGC glass.
  - "Shade all east- and west-facing walls and glass year round".
  - Avoid over-glazing.
- **Construction.**
  - Lightweight walls where the day–night temperature swing is small.
  - "Where summer ground temperatures exceed 19°C at a depth of 3 metres, use elevated lightweight floors."
  - "Choose light-coloured roof and wall materials."
  - "Include ceiling fans in all living and sleeping spaces."
  - Use multi-layer reflective foil in the roof, and ventilate the roof space.
- **Cooling** ([Passive cooling](https://www.yourhome.gov.au/passive-design/passive-cooling)).
  - Put louvre or awning panels above internal doors to keep air moving with the doors shut.
  - Use wing walls or fins where a room has windows on only one side.
  - Clerestory or roof vents give stack ventilation on still nights.
  - Fans at 0.5 m/s can make it feel about 3°C cooler, and cut air-conditioning use by up to 75%.
- **Orientation** ([Orientation](https://www.yourhome.gov.au/passive-design/orientation)).
  - The best range is 15° west to 25° east of north.
  - The long faces of this site sit about 28° east of north, which is near enough. If the building can be rotated a few degrees clockwise within the zone, do so.
- **Eaves** ([Shading](https://www.yourhome.gov.au/passive-design/shading)).
  - The rule of thumb is an eave width of 45% of the height from sill to eave, which gives **1,200 mm** for a 2,100–2,700 mm sill-to-eave height.
  - North of 27.5°S (Woombye is about 26.7°S) the guide suggests going up toward 50%.
- **Verandahs versus winter sun.**
  - At Woombye, winter-solstice noon sun is about 40° above the horizon.
  - A 2.4 m solid verandah at a 2.7 m eave blocks most winter sun. A 1.2 m eave admits it to most of the glass.
  - YourHome suggests making north verandahs over windows **slatted pergolas**. So: a solid roof over part of the deck, and slats or a 1.2 m eave over the living-room glass.
- **Roof.**
  - A single skillion is cheap, has no valleys (a bushfire advantage), and gives a clerestory.
  - Rising to the NNE admits winter sun, but raises the highway-facing wall.
  - Rising to the SSW keeps the building low toward the highway, gives a south clerestory for soft light and stack exhaust, and relies on the NNE eave for winter sun.
  - For this site, the second (low side to the NNE, high side to the SSW) is the better default.

**Highway noise.**
- **Planning order** ([YourHome, Noise control](https://www.yourhome.gov.au/live-adapt/noise-control)):
  - "Distance and orientation first, then barriers and landscape, then the building envelope."
  - "Place bedrooms … away from roads."
  - Use "storage, wardrobes, corridors and bathrooms as buffer zones".
  - "For traffic noise, start with windows, doors, seals, vents and the roof/ceiling path."
  - Planting "should not be relied on as a physical noise barrier".
- **Indoor targets** (from AS/NZS 2107): bedrooms near major roads 35–40 dB(A) at night; living rooms 35–45 dB(A).
- **Application here:**
  - Place services and stairs on the NNE and ESE, the highway sides.
  - Use a solid, continuous deck balustrade about 1.0–1.2 m high on the NNE edge. It works as a low barrier for people seated on the deck.
  - Use acoustic laminated glass and good seals on highway-facing openings.
  - Provide a way to ventilate with the windows closed (ceiling fans and split systems) for the noisiest nights.
  - Put Stage 1 bedrooms at the WNW end, which is further from the highway.
- **Transport noise corridor.** QDC MP4.4 applies if the lot is in a designated transport noise corridor ([Business Queensland](https://www.business.qld.gov.au/industries/building-property-development/building-construction/laws-codes-standards/queensland-development-code/transport-noise-corridors); [MP4.4](https://www.hpw.qld.gov.au/__data/assets/pdf_file/0015/4830/qdcmp4.4buildingsinatransportnoisecorridor.pdf)). The traffic volume makes this plausible. The certifier checks the state mapping.

**Bushfire (medium hazard buffer; BAL to be assessed)** ([QRA guidance](https://www.qra.qld.gov.au/sites/default/files/2020-12/0576_qra_bushfire_guideline_v10_pages_print.pdf)).
- Subfloors are "vulnerable to ember attack and surface fire", made worse by "combustible objects … stored next to or underneath the house".
- A car can "burn for a long time" and adds consequential fire load. With decks or vehicles near the house, QRA points to its highest construction level.
- Cost-effective moves: "enclose the subfloor area", and "use simple roof layouts that avoid valleys and minimise the number of ridges".
- "Avoid the use of combustible decking or stairs along exit and access routes."
- Metal mesh with openings of 2 mm or less keeps embers out of gaps.
- For this site:
  - Use galvanised steel posts and bearers, which are also termite-proof.
  - Use steel or concrete stairs, and fibre-cement or hardwood decking rated to the BAL.
  - Enclose the undercroft with 2 mm mesh or battens over mesh, or leave it truly open and clean.
  - If cars go under, the BAL design has to account for them.

**Koala** ([Koala-sensitive Design Guideline](https://wildlifefriendlyfencing.org/wp-content/uploads/2022/05/Koala-Sensitive-Design-Guidelines.pdf)).
- **Koala-friendly fencing.** Use post and rail with gaps of at least 300 mm, or a solid fence with a 300 mm gap under the bottom rail. Where a fence is climbable, use rails koalas can grip, and add leaning logs or ladders.
- **Dogs.** On lots over 2,000 m², build a dog enclosure with koala-exclusion fencing around the enclosure, not the boundary. Confine dogs there from 6 pm to 6 am. The exclusion fence should be unclimbable sheet, or chain wire with a floppy top or a 600 mm smooth band. This ties in with this repo's dog-fence concept.
- **Pools.** None is planned. If one is ever added, give it a shallow lagoon entry or an escape rope at least 2 m long.
- **Lighting.** DCCEEW's six principles ([fact sheet](https://www.dcceew.gov.au/sites/default/files/documents/fs-light-pollution-guidelines.pdf)): start with natural darkness; use adaptive controls; light only the area needed; use low-intensity lights close to the ground; use non-reflective dark surfaces near fittings; use amber, low-CCT light with little or no blue.
- **High-set helps.** The ground under the house stays permeable, and koalas can pass under an open undercroft. Do not enclose the undercroft with solid walls where a koala path is likely.

---

## 2. How the approval path changes each layout

| | Path A: one dwelling, two suites (recommended in planning-rules.md) | Path B: house + attached secondary dwelling | Path C: dual occupancy |
|---|---|---|---|
| Kitchens | One full kitchen plus one kitchenette or wet bar | Two | Two |
| Laundry | **One shared, reached from both halves** | Each dwelling needs "facilities for washing clothes". A shared room between two Class 1a dwellings is a fire-separation problem. | As for Path B |
| Shared wall | Ordinary internal wall (add acoustic batts and double board by choice) | FRL 60/60/60 from the footings to the underside of the roof; Rw + Ctr ≥ 50; discontinuous where a wet area backs onto a habitable room | As for Path B |
| Parking under | A shared undercroft is fine | Each half's bay must sit under that half, with the separating wall down to the ground. Otherwise it is Class 2. | As for Path B |
| Stacked units | Allowed (one dwelling) | Class 2. Avoid. | Class 2. Avoid. |
| Size cap | None (dwelling house code) | Secondary part ≤ 60 m² GFA for accepted development | Council's dual occupancy code: the site AOs (slope ≤ 15%) are not met here, so assessment applies. AO3.1 says floor plans should **not be mirror images** and should have distinct external elements. |
| Stage 2 | Can be the secondary dwelling (≤ 60 m² to avoid a referral) | Would be a third dwelling (multiple dwelling, inconsistent use) | Would be a third dwelling |

Sources: [NCC classifications](https://ncc.abcb.gov.au/ncc-navigator/building-classifications); [NCC 9.3](https://ncc.abcb.gov.au/editions/ncc-2022/adopted/housing-provisions/9-fire-safety/part-93-fire-protection-separating-walls-and-floors); [NCC 10.7](https://ncc.abcb.gov.au/editions/ncc-2022/adopted/housing-provisions/10-health-and-amenity/part-107-sound-insulation); [Planning Regulation 2017 sch 24](https://www.legislation.qld.gov.au/view/pdf/inforce/current/sl-2017-0078); [SCC secondary dwelling sheet](https://assets-us-01.kc-usercontent.com/c631baf8-1b46-001f-580c-d0001b68b4a8/239fbece-3deb-4557-972f-4a017daf7d60/ED963022-1D3D-452B-A6CB-86E6181E019D); [SCPS 9.3.5 Dual occupancy code (Nov 2019 print)](https://assets-us-01.kc-usercontent.com/c631baf8-1b46-001f-580c-d0001b68b4a8/ba3a5b72-5eb4-4fb4-bd97-e3117bc5f907/448D7227-2B98-49DE-A6EA-39C652806EFF); details in [planning-rules.md](planning-rules.md). On what "used in conjunction with" means for two dwellings, see *Machado v Council of the City of Gold Coast* [2024] QPEC 22 ([CBP summary](https://www.cbp.com.au/insights/publications/dual-occupancies-dressed-up-as-dwellings-houses-planning-and-environment-court-of-queensland-dismis)). There the court treated internally divided houses with split backyards as unlawful dual occupancies.

---

## 3. Stage 1 concepts

**Assumptions common to all concepts:**
- Floor at about 30.0–30.3 m AHD, so entry from the uphill SSW side is at or near ground level.
- 2.7 m ceilings, one skillion roof, galvanised steel posts.
- Areas are gross enclosed. Roofed decks are extra, and are excluded from GFA.
- Unit room sizes are about 50–55 m² per half. The siblings currently share 84 m², so 2 × 50 m² plus a shared laundry is roughly the current area each, plus their own kitchen and bathroom.
- "Kitchen B" means a full kitchen under Paths B and C, or a kitchenette or wet bar under Path A.

### Concept 1: back-to-back pair on a shared wet wall ("Twin Wing")

**16.8 × 6.6 m ≈ 111 m²**, long axis parallel to Foley Road. Two halves of 8.4 × 6.6 m each (about 55 m²).

```
                 NNE  (downhill · sun · highway)
   [deck A 4.2×2.4, slatted over glass]      [deck B 4.2×2.4]
  +-----------------+--------+--------+-----------------+
  |                 | bath A |  bath B |                 |
  |  living /       | 2.4×3.0| 2.4×3.0 |  living /       |
  |  dining /       |--+-----||-----+--|  dining /       |
  |  kitchen A      |L |     ||     |  |  kitchen B      |
  |  4.8 × 6.6      |--+ bed A  bed B  +  4.8 × 6.6      |
  |                 | 3.6×3.6 || 3.6×3.6|                 |
  +-----------------+---------++--------+-----------------+
        entry A  →   [shared porch / stair 16.8×1.5]   ← entry B
                 SSW  (uphill · Foley Road)       || = shared wall
  L = laundry (1.2×3.0): one shared laundry in Path A, or a cupboard laundry in each half in Paths B/C
```

| Room (each half) | Size (m) | Area (m²) |
|---|---|---|
| Living / dining / kitchen (end room, windows on three sides) | 4.8 × 6.6 | 31.7 |
| Bedroom (SSW, against the shared wall) | 3.6 × 3.6 | 13.0 |
| Bathroom (NNE, back to back with the other half) | 2.4 × 3.0 | 7.2 |
| Laundry cupboard / linen / robe strip | 1.2 × 3.0 | 3.6 |
| **Half total** | 8.4 × 6.6 | **55.4** |

- **How sharing works.**
  - Path A: one laundry opens from the shared porch or a lobby, and an internal door between the halves is optional.
  - Paths B/C: each half has a European laundry cupboard. Shared life happens on the rear porch and in the garden.
- **Privacy and acoustics.**
  - The two bathrooms sit back to back, and the two bedrooms sit back to back, so no wet room backs onto a neighbour's bedroom. Discontinuous construction is then required only where kitchens adjoin (they do not).
  - Bathrooms and laundry buffer the NNE highway side. Bedrooms face Foley Road, a quiet local road.
- **Parking under.**
  - The undercroft is about 16.8 × 5 m at 2.4 m+ clearance under the NNE half.
  - Path A: two bays side by side, entered from one end.
  - Paths B/C: the separating wall splits the undercroft, so each bay is entered from its own end. That means two ramps, which is costly. A road-level carport is better.
- **Pros.**
  - The most compact and cheapest shape: one roof, one plumbing wall, short uphill posts, near-level entry from the uphill side (good for later life), and the least wall area.
  - Fits the 16 × 12 m zone with room for decks.
- **Cons.**
  - The halves are not equal: the ESE half is about 11 m nearer the highway, and the WNW half gets afternoon west sun on its end wall, which needs vertical screens.
  - The rooms along the shared wall have windows on one side only, though the bedroom still gets SSW windows.
  - Under Path C, AO3.1 frowns on mirror-image plans. Vary the deck and entry positions.
- **Cost notes.**
  - The best area-to-envelope ratio. The two wet rooms share one stack and drain run.
  - A 6.6 m depth spans with standard timber or steel trusses.
  - The cheapest place to cut area: drop to 15.6 m for about 103 m².

### Concept 2: dogtrot pavilions with a breezeway laundry ("Dogtrot")

**Two pavilions of 7.2 × 7.2 m (about 52 m² each) with a 3.0 m roofed breezeway between them. Overall 17.4 × 7.2 m; about 111 m² enclosed including the laundry pod.**

```
                 NNE  (downhill · highway)
   [deck A 7.2×2.4]        [screen/pod]        [deck B 7.2×2.4]
  +---------------------+  +-----------+  +---------------------+
  |  living / kitchen A |  | laundry & |  |  living / kitchen B |
  |      7.2 × 4.2      |  | store pod |  |      7.2 × 4.2      |
  |---------+-----+-----|  | 3.0×2.4   |  |-----+-----+---------|
  | bed A   |bath |entry|  | open      |  |entry|bath | bed B   |
  | 3.9×3.0 |2.1× |1.2× |  | breezeway |  |1.2× |2.1× | 3.9×3.0 |
  |         |3.0  |3.0  |  | + stair   |  |3.0  |3.0  |         |
  +---------------------+  +-----------+  +---------------------+
                 SSW  (uphill · Foley Road · arrival)
```

| Room (each pavilion) | Size (m) | Area (m²) |
|---|---|---|
| Living / dining / kitchen (NNE) | 7.2 × 4.2 | 30.2 |
| Bedroom (SSW) | 3.9 × 3.0 | 11.7 |
| Bathroom | 2.1 × 3.0 | 6.3 |
| Entry / robe | 1.2 × 3.0 | 3.6 |
| **Pavilion total** | 7.2 × 7.2 | **51.8** |
| Shared laundry / store pod in the breezeway | 3.0 × 2.4 | 7.2 |

- **How sharing works.**
  - The breezeway is the shared front door, stair head, outdoor dining room and laundry.
  - The laundry pod is a separate small structure, so it is shared under any path. The certifier needs to confirm this for Paths B/C.
  - This follows the Cairns case study and MNY's "together separately" model.
- **Privacy and acoustics.**
  - No shared wall. The 3.0 m gap exceeds the NCC's 1.8 m, so the pavilion walls need no fire rating.
  - The pod at the NNE end of the breezeway blocks the highway view and noise along it.
  - Bedrooms face SSW.
- **Parking under.**
  - Each pavilion's NNE half has about 7.2 × 4 m at 2.4 m+ clearance. Or the cars go under the breezeway and one pavilion.
  - Paths B/C: each car must sit under "its" pavilion, and nothing may be shared below.
- **Pros.**
  - The best cross-ventilation: every room has two or three outside walls, and the breezeway runs NNE–SSW.
  - Both living rooms get full NNE frontage.
  - The pavilions are equal.
  - Very clear privacy, and no fire wall.
  - Each pavilion could be one 7.2 m-wide stick-built box, or two 3.6 m modules.
- **Cons.**
  - The most external wall and roof edge, so the highest envelope cost of the three single-level options.
  - Two sets of plumbing, or a longer run through the breezeway.
  - The breezeway roof and its gutters add ember-trap junctions. Keep one continuous skillion over everything.
  - Walking from bedroom to laundry means going outside, which suits the climate.
- **Cost notes.** About 10–15% more envelope than Concept 1 for the same area (**estimate**, from wall and roof perimeter). The breezeway (about 14 m² open) is cheap floor area.

### Concept 3: split-level stepped pair ("Step")

**10.2 m along the road × 10.8 m down the slope. Upper (SSW) unit 10.2 × 5.4 m (55 m²) at about 30.9 m AHD, level with the pad and road, so step-free. Lower (NNE) unit 10.2 × 5.4 m (55 m²) at about 29.4 m, 1.5 m lower (about 9 steps). About 110 m² total.**

```
  SECTION (looking WNW)                     PLAN
                 clerestory                      NNE
   ___________     ||                 +------------------------+
  |  UPPER    |____||____             | lower unit: living /   |
  |  unit     | LOWER    |→ NNE deck  | kitchen 5.4×5.4 | bed  |
  |  30.9 m   | unit     |            |  bath · entry   | 3.6× |
  |___________| 29.4 m   |            |=================|======| ← shared wall = the step
 pad 31.0 ▓▓▓▓|__________|            | upper unit: bed · bath |
               posts 2–3 m ↓ 26.6     | living / kitchen 5.4×5.4|
                                      +------------------------+
                                                 SSW (road, pad)
```

| Room (each unit, 10.2 × 5.4) | Size (m) | Area (m²) |
|---|---|---|
| Living / dining / kitchen | 5.4 × 5.4 | 29.2 |
| Bedroom | 3.6 × 3.3 | 11.9 |
| Bathroom | 2.1 × 3.0 | 6.3 |
| Entry / laundry cupboard / store | — | ~7.7 |
| **Unit total** | 10.2 × 5.4 | **55** |

- **How sharing works.**
  - Path A: an internal stair of about 9 risers links the units, and one laundry sits at the landing.
  - Paths B/C: the units are separate side by side; they are staggered, not stacked, so they are not Class 2. Each has its own entry.
- **Privacy and acoustics.**
  - The level change separates the units strongly.
  - The lower unit and its roof shield the upper unit from the highway.
  - The upper unit gets NNE sun through a clerestory over the lower roof: the classic split-level solar trick.
  - The lower unit takes the highway exposure, but has the view and the garden.
- **Parking under.**
  - Poor. Under the lower unit the clearance is only about 2.0–2.5 m at its NNE edge.
  - Use a carport at the pad by the upper unit. That gives the upper unit a step-free car-to-door route.
- **Pros.**
  - The best for ageing: one fully step-free unit at road level.
  - Shorter posts, because the lower floor follows the ground.
  - Compact 10.2 × 10.8 m footprint.
  - Leaves the most clearing for Stage 2 and a tank.
- **Cons.**
  - Two roof levels and a stepped separating wall, which is the costliest separating-wall detail. Under Paths B/C, the wall above the lower roof must be fire-rated (Timber Queensland TDS 33, Fig. 1).
  - Unequal units: one is dark but quiet, the other bright but noisy.
  - A 5.4 m depth with a clerestory on one side limits cross-ventilation in the upper unit.
- **Cost notes.**
  - The roof step and clerestory add cost.
  - Savings: fewer tall posts and less undercroft bracing. Under Path A, one shared stair replaces two external stairs.
- **Stacked variant: one unit per level.** Legal only as one dwelling (Path A). Otherwise it is Class 2. Not recommended.

### Concept 4: long narrow units side by side down the slope ("Shotgun Pair")

**Two units of 4.5 × 12.0 m (54 m² each) side by side. The shared wall runs NNE–SSW, down the slope. Overall 9.0 m along the road × 12.0 m deep ≈ 108 m².**

```
                 NNE  (downhill · sun · highway)
      [deck A 4.5×2.4]  [deck B 4.5×2.4]
     +-----------------++-----------------+
     |  living/dining/ ||  living/dining/ |
     |  kitchen A      ||  kitchen B      |
     |   4.5 × 6.3     ||   4.5 × 6.3     |
     |-----------------||-----------------|
     | bath + laundry  || bath + laundry  |
     | cupboard 4.5×2.4|| cupboard 4.5×2.4|
     |-----------------||-----------------|
     |  bedroom A      ||  bedroom B      |
     |  4.5 × 3.3      ||  4.5 × 3.3      |
     +-----------------++-----------------+
        entry A (SSW)      entry B (SSW)
                 SSW  (uphill · Foley Road)       || = shared wall, ground to roof
```

| Room (each unit) | Size (m) | Area (m²) |
|---|---|---|
| Living / dining / kitchen (NNE end) | 4.5 × 6.3 | 28.4 |
| Bathroom + laundry cupboard (middle band) | 4.5 × 2.4 | 10.8 |
| Bedroom (SSW end, next to the entry) | 4.5 × 3.3 | 14.9 |
| **Unit total** | 4.5 × 12.0 | **54.1** |

- **How sharing works.**
  - Path A: a door in the middle band between the two bathroom zones gives one laundry shared by both units.
  - Paths B/C: no internal link. The units meet on the SSW entry porch and in the garden.
- **Privacy and acoustics.**
  - Room types match across the wall: living to living, bathroom to bathroom, bedroom to bedroom. That meets NCC 10.7's discontinuous-construction trigger by design.
  - Both bedrooms sit at the quiet uphill end, and both living rooms get the NNE view, sun and deck.
  - This is the "equitable" logic of Three Sisters.
- **Parking under.**
  - The NNE about 5 m of each unit stands 2.4–3.5 m clear.
  - Each unit's own bay sits under its own living room, with the separating wall down to the ground between the bays. This is the terrace-house pattern with private garages, allowed for Class 1a under all paths.
  - Cars arrive from the NNE, downhill side, so the driveway must loop down one side of the building.
- **Pros.**
  - The fairest split. Each unit is a simple through-house with end-to-end cross-ventilation, and the plumbing band is aligned.
  - Two modules of about 4.5 m (Three Sisters used 4.6 m) give a factory double wall.
  - The 9 m frontage leaves the most of the WNW–ESE length free for Stage 2.
- **Cons.**
  - Each unit has only one long outside wall, facing WNW (hot afternoon sun) or ESE, and each needs vertical shading.
  - A 12 m depth down the slope uses the full depth of the zone.
  - Living rooms face the highway: use a solid balustrade and acoustic glass.
  - Longer driveway to the low side.
  - A 4.5 m module needs a pilot vehicle.
- **Cost notes.**
  - A very efficient rectangle; one roof, a skillion falling to the NNE.
  - If a fire wall is needed, the module double wall supplies most of it.
  - About the same envelope as Concept 1, but more tall posts, because the whole NNE half stands high.
  - The 3.5 m module variant (3.5 × 14 m = 49 m² each, no pilot) probably does not fit the zone's depth.

### Concept 5: two 3.5 m modules either side of an open slot ("Module Pair + Slot")

**Two factory modules of 3.5 × 13.0 m (45.5 m² each) set 2.4 m apart on one steel post-and-beam deck of 9.4 × 13.0 m. A roofed slot holds a shared stair and a laundry pod of 2.4 × 2.4 m. About 97 m² enclosed.**

```
                 NNE  (downhill · highway)
      +---------+  slot 2.4  +---------+
      | living A|  (open,    | living B|
      | 3.5×4.6 |  roofed,   | 3.5×4.6 |
      |---------|  decked)   |---------|
      | kitch A |            | kitch B |
      | 3.5×2.6 |            | 3.5×2.6 |
      |---------|            |---------|
      | bath A  |            | bath B  |
      | 3.5×2.2 |  +------+  | 3.5×2.2 |
      |---------|  |laundr|  |---------|
      | bed A   |  | 2.4² |  | bed B   |
      | 3.5×3.6 |  +------+  | 3.5×3.6 |
      +---------+  ↑ stair   +---------+
                 SSW  (uphill · Foley Road)
```

| Room (each module) | Size (m) | Area (m²) |
|---|---|---|
| Living (NNE end, glass to the deck) | 3.5 × 4.6 | 16.1 |
| Galley kitchen | 3.5 × 2.6 | 9.1 |
| Bathroom (across the module) | 3.5 × 2.2 | 7.7 |
| Bedroom (SSW end) | 3.5 × 3.6 | 12.6 |
| **Module total** | 3.5 × 13.0 | **45.5** |
| Shared laundry pod in the slot | 2.4 × 2.4 | 5.8 |

- **How sharing works.**
  - The slot is the shared arrival, stair, laundry and outdoor room. The modules' side doors face each other across it.
  - This mirrors Arcopod's "Aspect" and "Hollow" layouts, and the Two Sisters terrace.
- **Privacy and acoustics.**
  - Separate buildings 2.4 m apart (more than 1.8 m), so no fire or sound separating wall.
  - Avoid facing windows across the slot by offsetting them, as YourHome advises.
- **Parking under.** As for Concept 4, the NNE end of each module stands high. With no shared structure below each module, a car can go under each (or a road-level carport).
- **Pros.**
  - The fastest build and the least on-site trade work.
  - 3.5 m modules need no pilot vehicle.
  - No separating wall under any path.
  - The slot runs along the breeze and gives each module three outside walls.
  - The WNW and ESE outer walls can be mostly solid, which suits the west sun and the highway.
- **Cons.**
  - The smallest suites (about 3.2 m inside width), about 46 m² each.
  - Two module roofs plus the slot roof: keep one continuous roof sheet over all for bushfire, and confirm with the certifier.
  - A crane must reach from Foley Road over the retained trees.
  - A 13 m length needs the zone depth.
- **Cost notes.**
  - The most repeatable. Two identical modules suit a product like Designer Eco's 12 × 4 m "One Bedroom", resized to 3.5 m.
  - Add ~14 m² of cheap slot decking.
  - The price risk is in the site deck, stair, crane and transport, not the modules.

### Comparison

| | 1 Twin Wing | 2 Dogtrot | 3 Step | 4 Shotgun Pair | 5 Module Pair + Slot |
|---|---|---|---|---|---|
| Footprint (m) | 16.8 × 6.6 | 17.4 × 7.2 | 10.2 × 10.8 | 9.0 × 12.0 | 9.4 × 13.0 |
| Enclosed (m²) | ~111 | ~111 | ~110 | ~108 | ~97 |
| Best path | A | A/B/C | A (B/C costly) | B/C (A fine) | A/B/C |
| Fire wall needed in B/C | Yes, full length | No | Yes, stepped | Yes (module double wall) | No |
| Parking under | Good in A; awkward in B/C | Good | Poor | Good, one bay per unit | Good, one bay per module |
| Equal halves | Fair | Good | Poor (by design) | Best | Best |
| Cross-ventilation | Fair | Best | Fair | Good (end to end) | Good |
| Highway buffering | Good (wet core NNE) | Good (pod) | Good for upper unit | Weak (living faces road) | Fair |
| Relative cost (**estimate**) | Lowest | +10–15% | +10–20% | ~Concept 1 + posts | Low if transport and crane are easy |

---

## 4. Stage 2 (later two-bedroom dwelling for a couple): two ideas

Keep at least **1.8 m** between Stage 1 and Stage 2 walls (NCC 9.2.1). Aim for 6 m or more for privacy and fire spread. A freestanding secondary dwelling must be within **20 m** of the primary dwelling (SCC secondary dwelling sheet). Put it at the end of the clearing that Stage 1 leaves free. With Concepts 3, 4 and 5 there is room left along the road axis.

**S2-A "Compact 60": 5.0 × 12.0 m = 60 m² GFA,** sized to stay at or under the 60 m² secondary-dwelling acceptable outcome, plus a 5.0 × 2.4 m NNE deck (excluded from GFA). The benchmark is Designer Eco's 14 × 4 m two-bedroom (56 m²).

| Room | Size (m) | Area (m²) |
|---|---|---|
| Living / dining / kitchen (NNE) | 5.0 × 5.4 | 27.0 |
| Bathroom + laundry (combined, as in the benchmark) | 2.4 × 2.7 | 6.5 |
| Bedroom 1 (SSW) | 3.0 × 3.6 | 10.8 |
| Bedroom 2 / study | 3.0 × 3.0 | 9.0 |
| Hall / robes | — | ~6.7 |
| **Total** | 5.0 × 12.0 | **60** |

**S2-B "Two-pod 80": a living pod of 6.0 × 6.0 m (36 m²) and a sleeping pod of 4.0 × 11.0 m (44 m²), linked by a 2.4 m roofed deck. About 80 m².** The sleeping pod holds two bedrooms of about 3.3 × 3.3 m, a bathroom and a laundry. This follows the Cairns two-pavilion case and Arcopod's "Hollow". At 80 m² it misses the 60 m² acceptable outcome, so expect a Council concurrence referral (see planning-rules.md). It could also be built as two 3.5–4.0 m modules.

---

## Not verified / next checks

- **Fetching.** Dezeen pages refused automated fetching, so project facts for Three Sisters and Two Sisters come from ArchitectureAU and ArchDaily. The Ecoliv modular site did not resolve (DNS failure on 27 Sept 2026), so it is omitted.
- **Arcopod and Saltair.** Neither publishes sizes or prices for its small units.
- **Local breezes.** Prevailing summer breeze directions for Woombye were not checked. Look at BoM wind roses for Nambour or Maroochydore before fixing window positions.
- **Traffic figure.** It is a 2019 count at site 23482 ("489 – South of Cobbs Road"), on the same road section as the lot but not at the lot.
- **Dual occupancy code.** The version quoted is the 11 November 2019 print. Confirm AO1.2 and AO3.1 against the current SCPS version (see planning-rules.md).
- **Certifier items.** Whether a shared laundry pod or a continuous roof over a slot between two Class 1a buildings is acceptable is untested. The same goes for whether a car under a high-set Class 1a counts as a "private garage".
- **Areas and costs.** Room sizes are brainstorm figures, not a design. Relative cost rankings are estimates, not quotes.

---

## Sources

Government, codes and guidance
- YourHome, [Design for climate](https://www.yourhome.gov.au/passive-design/design-climate); [Orientation](https://www.yourhome.gov.au/passive-design/orientation); [Shading](https://www.yourhome.gov.au/passive-design/shading); [Passive cooling](https://www.yourhome.gov.au/passive-design/passive-cooling); [Noise control](https://www.yourhome.gov.au/live-adapt/noise-control); case studies [Cairns](https://www.yourhome.gov.au/case-studies/hot-humid/cairns-queensland) and [Caloundra](https://www.yourhome.gov.au/case-studies/hot-humid/caloundra-queensland) (accessed 2026-09-27)
- NCC 2022 Housing Provisions: [Part 9.2 Fire separation of external walls](https://ncc.abcb.gov.au/editions/ncc-2022/adopted/housing-provisions/9-fire-safety/part-92-fire-separation-external-walls); [Part 9.3 Separating walls](https://ncc.abcb.gov.au/editions/ncc-2022/adopted/housing-provisions/9-fire-safety/part-93-fire-protection-separating-walls-and-floors); [Part 10.7 Sound insulation](https://ncc.abcb.gov.au/editions/ncc-2022/adopted/housing-provisions/10-health-and-amenity/part-107-sound-insulation); [Building classifications](https://ncc.abcb.gov.au/ncc-navigator/building-classifications)
- Timber Queensland, [Technical Data Sheet 33: Separating walls, Class 1a buildings](https://img.bretts.com.au/33_Separating-Walls.pdf) (rev. Aug 2014)
- [Planning Regulation 2017 (Qld)](https://www.legislation.qld.gov.au/view/pdf/inforce/current/sl-2017-0078), sch 24 definitions (current as at 11 Sept 2026)
- Sunshine Coast Council, [Secondary dwellings information sheet](https://assets-us-01.kc-usercontent.com/c631baf8-1b46-001f-580c-d0001b68b4a8/239fbece-3deb-4557-972f-4a017daf7d60/ED963022-1D3D-452B-A6CB-86E6181E019D); [SCPS Table 5.5.1 (2017 print)](https://publicdocs.scc.qld.gov.au/hpecmwebdrawer/Record/22407271/File/document); [SCPS 9.3.5 Dual occupancy code (2019 print)](https://assets-us-01.kc-usercontent.com/c631baf8-1b46-001f-580c-d0001b68b4a8/ba3a5b72-5eb4-4fb4-bd97-e3117bc5f907/448D7227-2B98-49DE-A6EA-39C652806EFF)
- Colin Biggers & Paisley, [Dual occupancies dressed up as dwelling houses (Machado v Gold Coast [2024] QPEC 22)](https://www.cbp.com.au/insights/publications/dual-occupancies-dressed-up-as-dwellings-houses-planning-and-environment-court-of-queensland-dismis)
- Queensland Development Code [MP4.4 Buildings in a transport noise corridor](https://www.hpw.qld.gov.au/__data/assets/pdf_file/0015/4830/qdcmp4.4buildingsinatransportnoisecorridor.pdf); Business Queensland, [Transport noise corridors](https://www.business.qld.gov.au/industries/building-property-development/building-construction/laws-codes-standards/queensland-development-code/transport-noise-corridors)
- Queensland Government, [State Road Information map service](https://spatial-gis.information.qld.gov.au/arcgis/rest/services/Transportation/StateRoadInformation/MapServer) (state-controlled road layer 6; AADT 2019 layer 44), queried 2026-09-27
- Queensland Reconstruction Authority, [Bushfire Resilient Building Guidance for Queensland Homes](https://www.qra.qld.gov.au/sites/default/files/2020-12/0576_qra_bushfire_guideline_v10_pages_print.pdf)
- Queensland Department of Environment and Science, Koala-sensitive Design Guideline, v2.00, Feb 2020 ([DES link](https://environment.des.qld.gov.au/__data/assets/pdf_file/0025/102859/koala-sensitive-design-guideline.pdf); [mirror used](https://wildlifefriendlyfencing.org/wp-content/uploads/2022/05/Koala-Sensitive-Design-Guidelines.pdf))
- DCCEEW, [National Light Pollution Guidelines for Wildlife](https://www.dcceew.gov.au/environment/biodiversity/publications/national-light-pollution-guidelines-wildlife) and [fact sheet](https://www.dcceew.gov.au/sites/default/files/documents/fs-light-pollution-guidelines.pdf)
- NHVR, [Information sheet: National Class 1 Load Carrying Vehicle Dimension Exemption Notice 2026](https://www.nhvr.gov.au/document/517)
- State Library of Queensland, [Architectural features](https://www.slq.qld.gov.au/blog/architectural-features)

Precedents
- [Sisters Houses / Daher Jardim Arquitetura (ArchDaily)](https://www.archdaily.com/954654/sisters-houses-daher-jardim-arquitetura)
- [Blok Three Sisters (ArchitectureAU)](https://architectureau.com/articles/blok-three-sisters-by-blok-modular-with-vokes-and-peters/); [AIA awards entry](https://www.architecture.com.au/archives/awards/blok-three-sisters); [Dezeen](https://www.dezeen.com/2025/09/27/blok-three-sisters-vokes-peters/)
- [Two Sisters Holiday Home / MNY Arkitekter (ArchDaily)](https://www.archdaily.com/1013240/two-sisters-holiday-home-mny-arkitekter); [Dezeen](https://www.dezeen.com/2024/04/11/mny-arkitekter-two-sisters-holiday-home/)
- [House for Two Brothers / Pablo Bris Marino (ArchDaily)](https://www.archdaily.com/1025392/house-for-two-brothers-pablo-bris-marino)
- [Live Work Share House, Bligh Graham (ArchitectureAU)](https://architectureau.com/articles/a-mini-metropolis-live-work-share-house/); [Five houses embracing shared living (ArchitectureAU)](https://architectureau.com/articles/Five-houses-embracing-shared-living/)
- [Tent House / Sparks Architects (ArchDaily)](https://www.archdaily.com/805984/tent-house-sparks-architects); [ArchitectureAU](https://architectureau.com/articles/tent-house-sparks-architects/)
- [Vale Gabriel Poole (ArchitectureAU)](https://architectureau.com/articles/vale-gabriel-poole-1934-2020/); [Tent House, Poole archive](http://gabrielpoole.com.au/portfolio-view/tent-house-weyba-drive/)
- [Cooroy House / Henry Bennett + Dan Wilson (ArchDaily)](https://www.archdaily.com/1030492/cooroy-house-henry-bennett-plus-dan-wilson)
- [Montville Residence / Sparks Architects (ArchDaily)](https://www.archdaily.com/537452/montville-residence-sparks-architects)
- [Avonlea House / Robinson Architects (ArchDaily)](https://www.archdaily.com/889660/avonlea-house-robinson-architects)

Builders and products
- [Dixon Homes: granny flat vs dual living vs duplex](https://www.dixonhomes.com/post/granny-flat-vs-dual-living-vs-duplex-brisbane)
- [Designer Eco Tiny Homes: modular series](https://designerecotinyhomes.com.au/modular-series/)
- [Arcopod cabin range](https://arcopod.com.au/cabin-range/)
- [Blok Modular, Sunshine Coast](https://blokmodular.com.au/prefabricated-homes/sunshine-coast)
- [Saltair designs](https://www.saltair.com.au/designs); [Saltair: modular homes for sloping blocks](https://saltairmodular.com.au/modular-homes-for-sloping-block/)
- [The Shed House: building on a sloping block in QLD](https://theshedhouse.com.au/building-on-sloping-block-queensland-steel-floor-system/)
- [Anchor Homes: modular home foundations](https://anchorhomes.com.au/blog/modular-home-foundations)
- [Stroud Homes: pole homes for Sunshine Coast sloping blocks](https://www.stroudhomes.com.au/noosa-builder/pole-homes-for-sunshine-coast-sloping-blocks/)
