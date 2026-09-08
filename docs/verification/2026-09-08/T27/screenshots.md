# T27 automated screenshot evidence

Captured from the live local production server at `http://localhost:3001` on 8 September 2026 with Playwright Chromium, reduced motion enabled, and the isolated fixture database `.test-data/e2e.db`. These are machine-generated render checks, not owner-approved release screenshots.

| Viewport | Route | Artifact | HTTP |
| --- | --- | --- | --- |
| 1440×900 | `/` | [home desktop](screenshots/home-desktop.png) | 200 |
| 375×812 | `/` | [home mobile](screenshots/home-mobile.png) | 200 |
| 1440×900 | `/search?q=fixture` | [search desktop](screenshots/search-desktop.png) | 200 |
| 375×812 | `/compare?items=fixture-system-a,fixture-system-b` | [compare mobile](screenshots/compare-mobile.png) | 200 |
| 1440×900 | `/graph` | [graph desktop](screenshots/graph-desktop.png) | 200 |

The inspected images show the intended first-screen hierarchy, responsive stacking, comparison table containment, source-first copy, and reduced-motion static rendering. Manual keyboard, 200%/400% zoom, screen-reader, contrast, and owner acceptance checks remain open as required by `docs/test-plan.md`.
