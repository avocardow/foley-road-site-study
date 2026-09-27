# Foley Road site model

An interactive, browser-based terrain study for lot 1SP353650 at 77 Foley Road, Woombye. It shows the land only. No house has been placed.

## View locally

Install dependencies once, then run the Vite dev server:

```sh
npm install
npm run dev
```

Vite prints the local URL and reloads the viewer when its files change.

## Share

This project builds to `dist` with Vite and deploys to GitHub Pages through GitHub Actions. The page sends `noindex` metadata to crawlers while remaining public to anyone with its URL. That is a search-engine request, not access control.

## Data and references

- [Sunshine Coast Council Site Report](https://maps.scc.qld.gov.au/sitereport/index.html?report=da_public&lotplan=1SP353650): reports 4,083 m² and includes council contours and planning overlays.
- [Queensland Spatial Cadastral Fabric, lot parcels](https://spatial-gis.information.qld.gov.au/arcgis/rest/services/PlanningCadastre/QSCF_LandParcelPropertyFramework/FeatureServer/120): supplies the parcel outline. The lot is surveyed (B&D plot controlled, ±0.25 m), with a stated area of 4,083 m². It is also addressed as 85 Foley Road. The fabric is still a graphical representation; use survey plan SP353650 for legal dimensions.
- [Queensland Spatial Cadastral Fabric, easement parcels](https://spatial-gis.information.qld.gov.au/arcgis/rest/services/PlanningCadastre/QSCF_LandParcelPropertyFramework/FeatureServer/130): easements A (121 m²) and B (6 m²) on SP353650. Their purposes are not published there.
- [Queensland Elevation DEM service](https://spatial-img.information.qld.gov.au/arcgis/rest/services/Elevation/QldDem/ImageServer): supplies 0.5–1 m LiDAR bare-earth terrain, sampled at 0.5 m for the lot and at 2 m around it. The service combines projects with different resolutions and accuracies.
- [Queensland roads and tracks](https://spatial-gis.information.qld.gov.au/arcgis/rest/services/Transportation/RoadsAndTracks/MapServer/10): confirms Nambour Connection Road is a sealed dual carriageway and Foley Road a sealed two-way road. Its centrelines have unknown positional accuracy and sit about 10 m from the carriageways visible in the aerial, so road positions come from the aerial instead.

## Model notes

`site-data.json` uses a local frame in GDA94 / MGA zone 56 metres centred on the lot (x east, z south, y DEM height). It holds the cadastral outline and easements, a triangular terrain mesh sampled from the DEM, a 2 m DEM grid around the lot, and features traced from the parcel aerial: the clearing (about 523 m² inside the lot), a 4.3 × 5.8 m concrete or rubble pad at the Foley Road boundary, and the carriageway edges of both roads (Foley Road 6.6 m with an unsealed verge opposite the lot; Nambour Connection Road 13.4 m). Road edges hidden by canopy are interpolated at the measured width. Tree crowns stop at the clearing edge so the modelled tree line matches the photo, but individual tree positions, sizes, and heights are illustrative. The 3D terrain has no vertical exaggeration. Public sources do not replace a feature survey for boundary pegs, spot levels, tree locations, services, or easements.

The two supplied aerials can be draped over the model. Inside the lot they lie on the DEM terrain; outside it they lie on the 2 m DEM grid, as do the roads. Each photo toggle is independent; when both are on, the wider view blends over the parcel detail to make residual image offsets visible. The parcel edge is drawn in turquoise from the cadastral geometry. **Top view** gives a north-up plan. The parcel detail is tied to the cadastral corners; the wider image is registered with a projective fit to shared features around the parcel and roads (64 inliers; median residual 0.73 close-image pixels). The white boundary on either aerial is approximate and is not used as a control. This checks relative image alignment, not survey accuracy.

## Concepts

The default view is the existing site. The **Concepts** switcher shows one concept at a time over it without moving the camera. Each concept lives in `concepts/` and is listed in `concepts/index.js`; add a new file that exports options with an `id`, `title`, `subtitle`, `stats`, `notes`, and a `build(context)` function returning a Three.js group, then add it to the index.

Concept 1 compares dog-fence outlines: a clearing fit, the clearing plus the western forest to the neighbour boundary, a frontage-and-sides outline, and the whole lot. Every option keeps its Foley Road side 4.5 m inside the boundary, so the gate has a 7 m holding bay from the carriageway edge and a car never waits on the road.

The page includes `noindex` metadata and a permissive `robots.txt` so crawlers can read the directive. Search engine exclusion is a request to crawlers, not access control; anyone with a public link may still open it.
