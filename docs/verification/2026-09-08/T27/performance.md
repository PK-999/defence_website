# T27 local performance evidence

Measured on 8 September 2026 against the live production build at `http://localhost:3001`, using Playwright Chromium at 1440×900 with the isolated fixture database. Each route was loaded three times. Raw measurements are in [`performance.json`](performance.json).

| Route | Median HTML bytes | Median DOMContentLoaded | Median load event | Console/page errors |
| --- | ---: | ---: | ---: | ---: |
| `/` | 40,070 | 61.9 ms | 90.0 ms | 0 |
| `/heroes` | 48,373 | 49.9 ms | 76.3 ms | 0 |
| `/search?q=fixture` | 29,117 | 45.4 ms | 75.0 ms | 0 |

All three representative pages remain below the 500 KB first-page HTML target, and no browser errors occurred. First-contentful-paint medians were 72 ms, 56 ms, and 56 ms respectively. Headless Chromium did not expose a largest-contentful-paint entry in these runs, so no LCP claim is made; field INP/LCP and representative network-condition measurements remain open release gates.
