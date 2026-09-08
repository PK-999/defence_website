# T17 verification — sources and provenance

Added `listPublicSources` and `getPublicSourceBySlug` with publication predicates, bounded pagination, source type/publisher/date filtering, public version/evidence DTOs, rights-safe quote handling, and public linked-entity filtering. Archive/source pages now use canonical database records; disclosure controls are real buttons with `aria-expanded`/`aria-controls`. Restricted quotes render as `Quote unavailable for display.`

Evidence: `tests/integration/sources.test.ts` passed 3/3; `npm run test:e2e -- tests/e2e/sources.spec.ts --timeout=10000` passed 4/4 across Chromium desktop/mobile. Full integration (33 tests) and E2E (42 tests) also passed.
