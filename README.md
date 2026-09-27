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
- [Queensland Spatial Cadastral Fabric, lot parcels](https://spatial-gis.information.qld.gov.au/arcgis/rest/services/PlanningCadastre/QSCF_LandParcelPropertyFramework/FeatureServer/120): supplies the parcel outline. Queensland describes this as a graphical representation, not the legal boundary. Use the registered survey plan for legal dimensions.
- [Queensland Elevation DEM service](https://spatial-img.information.qld.gov.au/arcgis/rest/services/Elevation/QldDem/ImageServer): supplies a bare-earth terrain raster. The service combines projects with different resolutions and accuracies.

## Model notes

`site-data.json` contains a sampled triangular terrain mesh from the Queensland DEM service and the cadastral outline. The clearing patch is draped over the terrain and clipped to the lot; about 500 m² is shown. Tree crowns and the concrete apron make site features readable, but their positions, sizes, and shapes are illustrative rather than surveyed. The 3D terrain has no vertical exaggeration. Public sources do not replace a feature survey for boundary pegs, spot levels, tree locations, services, or easements.

The page includes `noindex` metadata and a permissive `robots.txt` so crawlers can read the directive. Search engine exclusion is a request to crawlers, not access control; anyone with a public link may still open it.
