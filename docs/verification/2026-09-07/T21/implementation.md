# T21 verification — scoped graph

Replaced the unrestricted graph dump with a typed public one-hop repository and `/api/graph?type=&id=&limit=` validation. The graph page requires topic selection, caps responses at 100 public nodes and 200 directed edges, preserves predicate/date/evidence, provides loading/error/empty states, measures the canvas with `ResizeObserver`, and renders a labeled relationship list as the text equivalent.

Evidence: `tests/integration/graph.test.ts` passed 2/2; `npm run test:e2e -- tests/e2e/graph.spec.ts --timeout=10000` passed 4/4 across Chromium desktop/mobile.
