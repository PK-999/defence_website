# T14 verification — resilient search UI

Global search now uses debounce cleanup, AbortController cancellation, monotonically increasing request IDs, distinct error/empty states, retry, labeled combobox/listbox semantics, keyboard selection, and no stale completion updates. The full search page calls the shared GET-backed search service and includes Sources and Units.

Typecheck, lint, unit/integration suites, and production build pass. `tests/e2e/search.spec.ts` covers the GET search surface and type choices and passed in desktop and mobile Chromium on 7 September 2026. Race resolution, keyboard combobox behavior, retry interaction, and JavaScript-disabled GET navigation still require dedicated acceptance cases.
