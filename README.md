# Foley Road site model

An interactive, browser-based terrain study for lot 1SP353650 at 77 Foley Road, Woombye. It shows the land only. No house has been placed.

## View locally

Run a static web server from this folder, then open its local URL in a browser:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Share

This project is set up for GitHub Pages. The page sends `noindex` metadata to crawlers, while remaining public to anyone with its URL. That is a search-engine request, not access control. [GitHub Pages publishing from a branch](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Data and references

- [Sunshine Coast Council Site Report](https://maps.scc.qld.gov.au/sitereport/index.html?report=da_public&lotplan=1SP353650): reports 4,083 m² and includes council contours and planning overlays.
- [Queensland Spatial Cadastral Fabric, lot parcels](https://spatial-gis.information.qld.gov.au/arcgis/rest/services/PlanningCadastre/QSCF_LandParcelPropertyFramework/FeatureServer/120): supplies the parcel outline. Queensland describes this as a graphical representation, not the legal boundary. Use the registered survey plan for legal dimensions.
- [Queensland Elevation DEM service](https://spatial-img.information.qld.gov.au/arcgis/rest/services/Elevation/QldDem/ImageServer): supplies a bare-earth terrain raster. The service combines projects with different resolutions and accuracies.
- [Realestate.com.au listing](https://www.realestate.com.au/property-residential+land-qld-woombye-204453584): source for the marketing aerials and the approximate 600 m² cleared area.
- [Google Maps 3D aerial](https://maps.app.goo.gl/kHhAVHyf9Vt2Pbne6): visual check of the current site. Its 77 Foley Road pin marks the neighbouring developed block, so the model uses the lot-plan geometry instead.
- [Three.js OrbitControls](https://threejs.org/docs/pages/OrbitControls.html): orbit, zoom, and pan controls for the 3D viewer.

## Model notes

`site-data.json` contains a sampled triangular terrain mesh from the Queensland DEM service and the cadastral outline. The approximate clearing patch is draped over the terrain and clipped to the lot; about 500 m² is shown, based on the listing's roughly 600 m² estimate. Tree crowns make the woodland edge readable, but their positions, sizes, and species are illustrative rather than a tree survey. The 3D terrain has no vertical exaggeration. Public sources do not replace a feature survey for boundary pegs, spot levels, tree locations, services, or easements.

The page includes `noindex` metadata for a future unindexed share link. Search engine exclusion is a request to crawlers, not access control; anyone with a public link may still open it.
