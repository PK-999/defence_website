# T20 verification — deliberate maps and assets

Operation maps now show reviewed text locations first and load Leaflet only after explicit `Show map` activation. Attribution is visible, missing coordinates have a text fallback, and a retry control is available after activation. Added `parseLocation`, the map asset manifest/validator, and removed the confirmed invalid 404 GeoJSON placeholder. The checked-in India state geometry is a deterministic 0.01° Ramer–Douglas–Peucker simplification of the reviewed source, retaining feature properties and staying below the 1 MB public asset budget.

Evidence: `npm run validate:assets` passed; `tests/unit/assets.test.ts` and `tests/unit/location.test.ts` passed; `npm run test:e2e -- tests/e2e/maps.spec.ts --timeout=15000` passed 2/2 across Chromium desktop/mobile. The manifest caps `/india-states.geojson` at 1,000,000 bytes and the checked-in simplified asset is 720,303 bytes. Tile request count was zero before activation in both projects.
