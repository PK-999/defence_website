# T05 implementation evidence

Status: functional

Public reads now use `src/lib/db.ts`, `src/lib/repositories/publication.ts`, and typed entity/search repositories. The shared predicate requires `PUBLISHED`, `EDITORIAL`, non-null `reviewedAt`, and non-null `reviewedBy`. Detail lookups use policy-filtered `findFirst`; slugs, relation selections, archive/search data, and graph data apply the same boundary. Claims and evidence are filtered to reviewed GOLD claims and rights-safe evidence linked to public sources. Admin reads remain behind the deny-all editor gate.

The existing local `prisma/dev.db` was upgraded with the additive T03 migration after the preserved T00 backup. Integrity check returned `ok`, foreign-key check returned no rows, and legacy row counts remained 7 conflicts, 20 operations, 1,967 people, 11 equipment, and 25 source records; all legacy records remain `DRAFT`.

Checks:

- `npm run test:integration`: 4 files, 6 tests passed, including all six entity types, draft/demo/withdrawn records, hidden guessed slugs, and public importer fixtures.
- `npm run typecheck`: passed.
- `npm run lint -- --quiet`: passed.
- `npm run build`: passed with Next.js 16.3.4.
- Browser-level E2E remains blocked because the Playwright Chromium executable is not installed; this is recorded under T01 and is not treated as a pass.
