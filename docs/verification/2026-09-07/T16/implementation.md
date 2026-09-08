# T16 verification — focused discovery homepage

Implemented a data-aware homepage with a visible shared search entry, three real subject paths (`/conflicts`, `/heroes`, `/arsenal`), a finite manifest-backed featured collection, and a truthful empty state linking to `/conflicts` and `/archive`. Removed the legacy `/people` destination from homepage navigation.

Evidence: `npm run test:e2e -- tests/e2e/home.spec.ts` passed 4/4 across Chromium desktop/mobile. `npm run typecheck`, `npm run lint -- --quiet`, and `npm run build` passed.
