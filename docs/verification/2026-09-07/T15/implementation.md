# T15 verification — quiet reading system

Removed the global scanner/grid treatment and nested main container, added a skip link and visible focus styles, stabilized heading text by making `ScrambleText` semantic and immediate, added reduced-motion CSS, and created reusable `ArticleLayout`, `ArticleBody`, and `OnThisPage` components. People and equipment detail pages now use the shared reading layout.

`npm run typecheck`, lint, unit/integration suites, and production build pass. `tests/e2e/reading.spec.ts` covers the skip-link/heading contract and passed in desktop and mobile Chromium on 7 September 2026 as part of a 14/14 passing suite. Screenshot comparison, 200/400% zoom, keyboard-only traversal, and screen-reader inspection remain manual release checks.
