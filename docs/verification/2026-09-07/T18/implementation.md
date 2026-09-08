# T18 verification — sourced people and equipment details

People and equipment detail routes now read the public repositories, render absent values as `Not documented`, show source-linked claims through keyboard disclosures, expose normalized equipment specifications/variant/status-as-of fields, and link only public related records. Added reusable `FactList` and `EvidenceLink` components.

Evidence: `npm run test:e2e -- tests/e2e/detail-pages.spec.ts --timeout=10000` passed 6/6 across Chromium desktop/mobile. Typecheck, lint, build, and full E2E passed.
