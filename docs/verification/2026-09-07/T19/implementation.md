# T19 verification — chronology and explorer state

Added precision-aware historical date ordering, preserved missing end dates without inferring outcomes or “ongoing” status, and made conflict explorer selection URL state (`view=explorer&event=<public-event-id>`). Invalid event IDs fall back to the overview and timeline controls are keyboard-addressable.

Evidence: `tests/integration/chronology.test.ts` passed 2/2; `npm run test:e2e -- tests/e2e/timeline.spec.ts --timeout=10000` passed 4/4 across Chromium desktop/mobile.
