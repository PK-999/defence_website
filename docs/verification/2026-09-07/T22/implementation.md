# T22 verification — equipment comparison

Added deterministic comparison slug normalization and canonical `/compare?items=...` URLs, public-only equipment resolution, missing/private reporting, compatible shared-unit rows, variant context, semantic table headers, and an explicit compare tray with add/remove/clear controls. The page accepts the earlier `systems` parameter as a compatibility alias. No overall score or winner is calculated.

Evidence: `tests/unit/compare.test.ts` passed 2/2; `tests/integration/compare.test.ts` passed 1/1; `npm run test:e2e -- tests/e2e/compare.spec.ts --timeout=15000` passed 4/4 across Chromium desktop/mobile.
