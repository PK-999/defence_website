# SENTINEL test and acceptance plan

**Status:** Test specification with execution evidence through T05. Follow [implementation tasks](implementation-plan.md) and [shared contracts](implementation-contracts.md). Test identifiers below are stable; record evidence against them in `progress_tracker.md`.

## 1. Isolation rules and test tooling

Tests must never reset, seed, migrate, or approve anything in `prisma/dev.db` or a deployed database. Use synthetic records, not historical guesses. All fixture names begin `Fixture`; their source text clearly says it is synthetic. Test databases live only in `.test-data/`, which is ignored. Unit tests need no database. Integration and E2E use separate files; do not share a mutable SQLite file across workers.

T01 installs compatible, exact-pinned versions of `vitest`, `@vitejs/plugin-react`, `vite-tsconfig-paths`, `jsdom`, `@testing-library/react`, `@testing-library/dom`, `@testing-library/user-event`, `@testing-library/jest-dom`, `@playwright/test`, and `@axe-core/playwright`. Inspect package engines/peer dependencies first and keep their resolved versions in package-lock. Do not change Next/React/Prisma to satisfy an arbitrary test dependency version. Python tests use the factory's supported Python interpreter and `pytest` added to its development dependency group.

Create `vitest.config.mts` for node unit tests with explicit `include: ['tests/unit/**/*.test.ts']` and alias `@` → `src`. Create `vitest.components.config.mts` with jsdom and `tests/components/**/*.test.tsx`. Create `vitest.integration.config.mts` with node, `fileParallelism: false`, and `tests/integration/**/*.test.ts`; its global setup checks the guarded integration URL already initialized by the runner, without repeating migrations or seeding. Separate include patterns prevent Vitest from loading Playwright files. React Testing Library tests call cleanup after each test and import jest-dom matchers in `tests/setup.ts`.

Use asynchronous server pages through Playwright/HTTP. Do not call an async page function and claim that this verifies Next routing, serialization, or cache behavior.

### Required scripts after T01

```json
{
  "lint": "eslint .",
  "typecheck": "tsc --noEmit --incremental false",
  "test": "vitest run --config vitest.config.mts",
  "test:components": "vitest run --config vitest.components.config.mts",
  "test:integration": "tsx scripts/run-integration-tests.ts",
  "test:e2e": "tsx scripts/run-e2e-tests.ts",
  "validate:database": "tsx scripts/validate-database.ts",
  "validate:assets": "tsx scripts/validate-assets.ts"
}
```

The last two validators are introduced in T07/T20; do not invoke nonexistent scripts before those tasks. T01 can add their script entries only when their files exist. `npm test` is non-watch. CI runs each gate explicitly; a shell command ending with a successful summary must not conceal an earlier failure.

### The destructive-operation guard (DB-01)

Put the following responsibility in `scripts/lib/test-database.ts`; real implementation must also reject a symlinked directory or symlinked destination file after resolving parent realpaths.

```ts
import path from 'node:path';
export function assertTestDatabaseUrl(url: string): string {
  if (!url.startsWith('file:')) throw new Error('TEST_DB_ONLY');
  const absolute = path.resolve(url.slice(5));
  const root = path.resolve('.test-data');
  const relative = path.relative(root, absolute);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)
      || path.extname(absolute) !== '.db') throw new Error('TEST_DB_ONLY');
  return absolute;
}
```

Do not use a substring such as `url.includes('test')`. Test `file:/tmp/test-production.db`, `file:prisma/dev.db`, missing URL, PostgreSQL URL, and a `.test-data/../prisma/dev.db` traversal: all fail. A valid absolute `.test-data/integration.db` passes. Create directory and reject symlinks before writing; shell environment values must not be interpolated into unquoted commands.

`run-integration-tests.ts` chooses an absolute integration URL, guards it, creates/migrates the fixture schema, seeds deterministic data, then spawns Vitest with that URL in its environment and returns the exact child exit status. Before T03 migration files exist, it may use `prisma db push --skip-generate` only on this guarded empty disposable DB; after T03 always use migrations. Generate only the JavaScript Prisma client with `--generator client` so tests do not require the Python generator.

`run-e2e-tests.ts` owns the E2E DB and isolated build lifecycle: guard → migrate → seed → build → launch Playwright/server → return status. It sets `DATABASE_URL`, `SITE_URL=http://127.0.0.1:3100`, `SENTINEL_TEST_RUN=1`, and a dedicated Next dist directory `.next-test`. It does not seed on each page request. Add `distDir: process.env.SENTINEL_TEST_RUN === '1' ? '.next-test' : '.next'` to next.config in T01 and ignore `.next-test`. This variable changes output location only, never authentication or publication behavior. Refuse an occupied 3100 port; do not kill another process or reuse its server.

Playwright config requirements:

```ts
import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e', fullyParallel: false, workers: 1,
  retries: process.env.CI ? 1 : 0,
  use: { baseURL: 'http://127.0.0.1:3100', trace: 'retain-on-failure' },
  webServer: {
    command: 'npm run start -- --hostname 127.0.0.1 --port 3100',
    url: 'http://127.0.0.1:3100', reuseExistingServer: false,
    timeout: 120000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'] } },
  ],
});
```

The wrapper propagates test environment variables to both build and Playwright. Include `.next-test/types` in TS configuration only if needed by generated types; never resolve production type errors by excluding source files. Full cross-browser release pass adds Firefox and WebKit when their binaries are available. A missing browser is a named blocked gate, not a pass. Interactive browser inspection by an agent must also follow that session's browser tooling instructions.

## 2. Deterministic fixture contract

Create `tests/fixtures/archive.ts` and `tests/helpers/seed-fixtures.ts` in T01, extending the schema-aware seeder in T03. Apply the reset rules below; never reset a database used by another test or running server. Use fixed timestamps `2000-01-01T00:00:00.000Z` unless testing time changes. Never read today's date to determine sort order.

### Reset and lifecycle rules

1. Integration tests run sequentially with no `test.concurrent`. In `beforeEach`, guard the URL again and restore the deterministic fixture using a transaction that deletes dependent rows before parents, then inserts parents before dependents. Maintain explicit schema-aware ordering as T03 adds relations; do not disable foreign keys. Migration tests use their own guarded database files and close all clients before deleting those files.
2. A rollback transaction is an alternative only when every operation under test receives that transaction client. It cannot isolate calls through another Prisma client, HTTP requests, or deliberate concurrent-review tests. Those tests require committed setup and cleanup in their dedicated guarded database.
3. The normal E2E suite reads an immutable baseline. Search, navigation, filters, and comparisons may change browser state but must not alter shared content. Each browser project receives a fresh browser context; no test may rely on cookies or local storage from a previous test.
4. Content-changing E2E scenarios (review, publication, withdrawal, and freshness) belong in `tests/e2e-lifecycle/`, outside the normal config's `testDir`. Add `playwright.lifecycle.config.ts` in the first owning task and extend `run-e2e-tests.ts` with an explicit `--lifecycle` mode. The runner enumerates each lifecycle scenario and browser project, and runs each pair with a freshly migrated/seeded database and a server it owns. Execute these runs sequentially because they share port 3100 and `.next-test`. Disable Playwright retries for this config: a retry must repeat the entire guarded database/build/server lifecycle, not reuse a mutated database.
5. For each lifecycle run: guard a unique file path beneath `.test-data/` → migrate → seed → build using that database URL → start the server → execute the scenario → collect evidence → stop the owned server and await exit → disconnect clients → clean up the guarded database and its SQLite sidecar files. Never reseed or replace a database beneath a running server. Preserve failed-run artifacts under the ignored test-data directory when needed for diagnosis, and report their paths.
6. The release gate runs both `npm run test:e2e` and `npm run test:e2e -- --lifecycle` once lifecycle tests exist. The wrapper must reject unknown flags and return nonzero if any selected scenario fails; do not accept an empty selection as success. Record scenario/project results separately. Verify a representative mutating scenario twice through separate runner invocations and confirm identical starting counts and results.

| Fixture | Required contents | Purpose |
| --- | --- | --- |
| People | `person-001` through `person-055`, slugs `fixture-person-001`…`fixture-person-055`, titles `Fixture Person 001`…`055`, PUBLISHED/EDITORIAL with reviewer/time/evidence | 24/24/7 pagination, stable ordering |
| Hidden people | `person-draft`, `person-withdrawn`, `person-demo` | Every public surface must exclude them |
| Conflict | `conflict-public`, slug `fixture-conflict`, title `Fixture Conflict`; `conflict-other`; `conflict-draft` | Public detail, contextual false-link regression |
| Operations | `operation-public` and `operation-other`, each connected to its own conflict with approved evidence | Explicit vs inferred participation |
| Equipment | `equipment-a`/`fixture-system-a` and `equipment-b`/`fixture-system-b`, both public; equipment-draft | Comparison, different range concepts |
| Source | `source-public`, slug `fixture-source`, published, captured synthetic text; `source-draft` | Evidence visibility and source search |
| Unit | `unit-public`/`fixture-unit` and unit-draft | Unit navigation, source/relationship integration |
| Claims | claim-gold-confirmed, claim-gold-disputed, claim-candidate, claim-rejected, claim-gold-no-evidence, claim-gold-draft-source | Proper public evidence filtering |
| Relationships | reviewed person-001 PARTICIPATED_IN operation-public; a candidate edge; an edge to person-draft; two opposite/different predicates | False association, filtering, direction |
| Aliases | equipment-a alias `Fixture Falcon`; equipment-b alias `Fixture Falcon`; draft person alias `Fixture Secret` | Ambiguity must remain, private alias exclusion |
| Malformed inputs | JSON truncated specs, impossible/ambiguous date, invalid status/domain, unsupported URL | Validator failures without production corruption |

Valid fixture records meet all publication requirements, including EntityEvidence for their narrative and valid evidence metadata. Negative fixtures deliberately break one rule each; validator negative tests operate on a separate database from the clean E2E fixture. Synthetic publication is allowed only in the guarded test database via an explicit validator option; production corpus validation always rejects it. Entity type counts are asserted within a type, so adding a new Unit fixture does not break a Person count test.

The source snapshot is `tests/fixtures/source.txt` containing `This is synthetic test evidence. Fixture operation began in 1999. Fixture System A has a fictional combat radius of 500 km.` The seeder copies it to the guarded test-data directory and computes its real SHA-256; locators are sentence1/2/3. Use originalUrl `https://example.test/sentinel-source`. E2E tests intercept that exact external URL and fulfill the same fixture text when testing original-source navigation; no real network request or public test-only application route is needed. Other generated fixture claims/narrative get matching synthetic text snapshots as necessary, not mismatched quotations attached to this source. Test documents are clearly synthetic and are never imported by normal content setup.

Equipment A has combat-radius 500 km and ferry-range 1,800 km. Equipment B has ferry-range 2,000 km and no combat-radius. These are fictional test values and must never become real equipment data. They prove missing values are not zero and different measures are not conflated.

## 3. Test matrix: write these tests in the owning task

For each ID, first run the narrow test and observe its intended failure against old behavior. If the failure is an unrelated missing dependency/setup error, fix setup and repeat. Only then change implementation. A skipped test is not passing evidence.

| IDs / test file | Inputs/action | Exact expected behavior |
| --- | --- | --- |
| DB-01 `tests/unit/test-database.test.ts` | Guard URLs and symlinks listed above | Only real paths strictly inside .test-data accepted |
| DB-02 `tests/integration/migrations.test.ts` | Migrate fresh DB and copied legacy fixture | Same final schema; old IDs/text preserved; new publication DRAFT |
| DB-03 same | Reapply migrations/import twice | No duplicate entity/evidence/version/alias rows; no provenance loss |
| DB-04 same | Invalid row halfway through import | Transaction rolled back; counts and hashes unchanged |
| DOM-01 `tests/unit/dates.test.ts` | 26-07-1999, 1999-07-26, 1999-07, 1999, null | Correct ISO/precision; original preserved |
| DOM-02 same | 31-02-1999, 03/04/1999, arbitrary string | Validation error; no JS Date rollover |
| DOM-03 `tests/unit/taxonomy.test.ts` | Air/Naval/Missiles/Deployed, unknown label | Canonical mapped values; unknown → review issue |
| DOM-04 same | Only “Param Vir Chakra”; unknown service; Lieutenant General | No extra medal; null service; exact rank identity |
| PUB-01 `tests/integration/publication.test.ts` | Read all visible/hidden entity IDs and slugs | Only PUBLISHED/EDITORIAL with review fields visible |
| PUB-02 same | Hide a source/entity already indexed | Search, counts, details, graph, sources and sitemap exclude it |
| PUB-03 same | Missing review/evidence or generic body → publish | Reject with explicit validation issue; no state/audit change |
| PUB-04 same | Publish, read, withdraw, read again | No stale public page/API after successful operation |
| EV-01 `tests/integration/evidence.test.ts` | Mixed claim fixtures | Only valid GOLD with public source shown; disputed stays amber/text |
| EV-02 same | Unsupported URL, nonexistent locator, mismatched quote | Cannot approve/publish without an accepted review resolution |
| EV-03 same | rightsSafeToDisplay=false | No quote text in public DTO/HTML; citation/locator remains |
| AUTH-01 `tests/unit/review-service.test.ts` | No session; non-editor; removed allow-list subject | UNAUTHORIZED before any write |
| AUTH-02 same | Valid editor + unsupported status/short reason | INVALID_INPUT, no write |
| AUTH-03 `tests/integration/review.test.ts` | Approve evidence-backed candidate | GOLD, selected evidence status, revision+1, exactly one audit |
| AUTH-04 same | Two approvals at identical revision | One success, one CONFLICT; exactly one audit |
| AUTH-05 same | Failure creating audit | Claim update rolls back |
| AUTH-06 same | Secondary source + OFFICIALLY_CONFIRMED | INSUFFICIENT_EVIDENCE; no automatic source promotion |
| AUTH-07 `tests/e2e/admin.spec.ts` | Anonymous /admin and unauthenticated mutation transport | No private content; action denied; do not rely solely on layout redirect |
| AUTH-08 `tests/integration/review.test.ts` | Approve/reject/stale/failing ImportProposal | Approve sets IN_REVIEW/removes projection; reject preserves old publication; stale/failed review has no partial changes |
| REL-01 `tests/integration/relationships.test.ts` | Person associated with conflict-other only | Not listed as participant in operation-public |
| REL-02 same | Duplicate/directed/candidate/private edges | Only evidenced public edges; directions and predicates preserved |
| COL-01 `tests/integration/collections.test.ts` | 55 people, pages 1/2/3/999 | 24/24/7/7 items; page999 clamped to3; total55; no overlap |
| COL-02 same | Unknown filter, empty set, negative/nonnumeric page | Recoverable invalid filter, true zero state, normalized page1 |
| COL-03 `tests/components/filters.test.tsx` | Change domain with incompatible category and page3 | Category cleared; page1; unrelated valid parameters preserved |
| COL-04 same | Select sort, clear-all, browser Back | URL and controls agree; result ordering stable |
| SRCH-01 `tests/integration/search.test.ts` | Case/whitespace-normalized title, exact alias, body term | C09 score order; typed IDs unique |
| SRCH-02 same | Quick vs full, same query/type | First eight match exactly |
| SRCH-03 same | Private alias; literal %/_; 1 char; >120 chars | No leak; literals not wildcard expansion; empty; INVALID_QUERY |
| SRCH-04 `tests/components/search-dialog.test.tsx` | Older request resolves after newer query; clear query during load | New query wins; no stale results/loading |
| SRCH-05 same | HTTP503/network rejection, retry | Error state, not no-results; retry succeeds |
| SRCH-06 same | Ctrl/Cmd+K, arrows, Enter, Escape, close | Correct result navigation, focus return, cancelled request |
| NAV-01 `tests/e2e/navigation.spec.ts` | At375px open menu, choose every collection | Functional links and visible current section |
| NAV-02 same | /people /people/fixture-person-001 /history/fixture-conflict /sources | One intended permanent redirect to canonical destination; details resolve |
| NAV-03 same | Every header/footer link | No404; no misleading link that has no page |
| READ-01 `tests/e2e/reading.spec.ts` | JS disabled, fixture article | h1/introduction/body/source links readable without hydration |
| READ-02 same | Markdown heading/link and literal script fixture | Safe structured output; no executed HTML/script |
| READ-03 same | Hero profile with content, absent death date | Summary retained; available date shown independently; no invented date |
| MAP-01 `tests/e2e/maps.spec.ts` | Open conflict before clicking Show map | No tile/GeoJSON request; equivalent location text visible |
| MAP-02 same | Click map; missing coordinates; tile error | Valid map with attribution OR clear fallback; no fabricated marker |
| MAP-03 `tests/unit/assets.test.ts` | Invalid JSON, oversized geometry, missing source/license | Validation nonzero with path and reason |
| GRAPH-01 `tests/integration/graph.test.ts` | No seed/private seed/large neighborhood | 400/404/<=100nodes <=200edges plus truncated |
| GRAPH-02 `tests/e2e/graph.spec.ts` | Choose seed, use text relationships, simulate503 | Canonical links available; retry state works |
| COMP-01 `tests/unit/compare.test.ts` | zero/one/two/three/four/duplicate/hidden slugs | C11 states; max3; no private details |
| COMP-02 `tests/e2e/compare.spec.ts` | Equipment fixtures A/B | Two columns; missing combat-radius “Not documented”; range labels distinct |
| META-01 `tests/e2e/metadata.spec.ts` | Public/draft/admin and sitemap | Correct title/canonical; private excluded; admin noindex |
| PIPE-01 `factory/tests/test_extraction.py` | Missing file or model unavailable | Explicit failure; zero DB calls; no mock fallback |
| PIPE-02 same | Bad schema/property/quote/source-version | Quarantine/validation failure, not publication |
| PIPE-03 same | Identical captured bytes/extraction replay | Same hash/version/evidence identity; no duplicate writes |
| COV-01 `tests/unit/coverage.test.ts` | 10 known,8 indexed,6 sourced,4 reviewed | Display each count; reviewed40%; never “100% complete” |
| COV-02 same | Unknown denominator or zero-known | “Coverage not yet defined”; no divide-by-zero/invented percent |

## 4. Example executable regression tests

These imports name proposed files created by owning tasks; do not create empty exports merely to make import errors disappear.

```ts
// tests/unit/dates.test.ts
import { expect, test } from 'vitest';
import { parseHistoricalDate } from '../../src/lib/domain/dates';
test('preserves year-only precision', () => {
  expect(parseHistoricalDate('1999')).toEqual({
    iso: '1999', precision: 'year', original: '1999',
  });
});
test('rejects impossible and ambiguous calendar input', () => {
  expect(() => parseHistoricalDate('31-02-1999')).toThrow();
  expect(() => parseHistoricalDate('03/04/1999')).toThrow();
});
```

```ts
// tests/integration/search.test.ts
import { expect, test } from 'vitest';
import { searchArchive } from '../../src/lib/search/service';
test('quick results are a prefix of full results', async () => {
  const quick = await searchArchive({ q: 'Fixture', type: 'Person', page: 1, pageSize: 8 });
  const full = await searchArchive({ q: 'Fixture', type: 'Person', page: 1, pageSize: 24 });
  expect(quick.items.map(x => x.id)).toEqual(full.items.slice(0, 8).map(x => x.id));
  expect(full.total).toBe(55);
  expect(full.items.some(x => x.id === 'person-draft')).toBe(false);
});
```

```ts
// tests/e2e/navigation.spec.ts
import { test, expect } from '@playwright/test';
test('mobile reader can reach people from the menu', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  const menu = page.getByRole('dialog', { name: 'Site navigation' });
  await expect(menu).toBeVisible();
  await menu.getByRole('link', { name: 'People' }).click();
  await expect(page).toHaveURL(/\/heroes(?:\?|$)/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('People');
});
```

```ts
// tests/e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('public article has no detected A/AA accessibility violations', async ({ page }) => {
  await page.goto('/conflicts/fixture-conflict');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  expect(results.violations).toEqual([]);
});
```

Axe passing is only the automated portion; complete the manual checks below. Never rename controls to match tests while leaving their actual behavior broken.

## 5. Responsive, accessibility, and visual checks

Run on homepage, Heroes populated/empty, Arsenal filtered, search results/error, conflict standard/explorer, operation, person, unit dialog/page, sources/detail, compare, graph text view, and admin review when configured. For each, record viewport, URL/query, screenshot path, observed result, and whether this is a synthetic or reviewed corpus.

Widths: 320,375,768,1024,1440 CSS px. At 200% and 400% zoom verify reflow and focus visibility. The main document must not horizontally scroll; comparison tables/maps can have labeled, bounded internal overflow where justified.

1. Press Tab from the address bar: skip link appears, then navigation and search in logical order.
2. Activate the skip link: focus reaches main content below the sticky header.
3. Open/close mobile menu by keyboard: focus is contained and returns to trigger.
4. Search with keyboard only; hear input label, result availability, and error/retry state through a screen reader.
5. Operate timeline/provenance disclosures with Enter/Space; verify expanded state and controlled content association.
6. Open unit preview: dialog has a title, Escape closes, background is unavailable to keyboard focus, focus returns.
7. Switch system preference to reduced motion: no scramble/scanner, animated map flight, or smooth forced scroll.
8. Select a source claim: source title, locator, status explanation, and allowed quote are perceivable without color.
9. Check all interactive states' rendered contrast, especially muted text, borders/focus, disabled controls, and colored badges.
10. With JS disabled: homepage links, article headings/text, full GET search, and ordinary detail/source navigation work. Rich maps may require JS but must have a text alternative.
11. Break network requests to search/map/graph: each displays the planned recovery instead of infinite loading.
12. Capture mobile/desktop screenshots after content/fonts settle. Do not accept blank/loading/error screenshots as successful layout evidence.

Save evidence under `docs/verification/YYYY-MM-DD/<task-id>/`; do not save auth tokens/cookies. Missing browser access means these gates remain blocked. It does not block unit/data/documentation work.

## 6. Performance gates

Use production build, fixed dataset size, browser/device/network description, and three runs; report median. Initial engineering budgets (project targets, not measurements already achieved):

- Collection renders <=24 records, irrespective of total corpus size.
- Quick search returns <=8 results; full page <=24.
- Graph returns <=100 nodes and <=200 edges.
- Map is not downloaded before activation; served simplified GeoJSON <=1 MB uncompressed.
- Heroes first-page raw HTML target <=500 KB with 2,000 synthetic records. Compare using the same build mode; do not compare development bytes to compressed production bytes.
- Seek LCP <=2.5 seconds, INP <=200ms, CLS <=0.1 on representative traffic; field INP cannot be proved with one local interaction. Label lab approximations and outstanding field measurement.
- No browser console/page errors on happy paths; expected simulated failure responses are asserted explicitly.

If a budget fails, identify query size, rendered row count, transferred assets, or layout shifts before adding caching. Do not remove accessibility/source content just to lower bytes.

## 7. Final commands and gates

After the relevant task scripts exist, run from repository root:

```bash
npm run lint
npm run typecheck
npm test
npm run test:components
npm run test:integration
npm run validate:assets
npm run test:e2e
npm run test:e2e -- --lifecycle
```

Run each as a separate checked command; capture exit statuses. `test:e2e` owns its isolated production build. Run `validate:database` against a read-only release candidate using the content runbook, without mutating it. Run factory tests through its locked environment only after T25. If a test must use a live OIDC provider, document the test account setup and execute the real login/logout/revocation tests; service mocks alone do not close the authentication integration gate.

**No release until:** P0 tests pass; reviewed corpus validator passes; browser/user journeys are evidenced; migration rehearsal and rollback are proven; deployment-specific configuration is checked. Missing source rights, editor credentials, or a browser are recorded with the exact blocked gate. “All code tests pass” does not mean historical content is verified.

### Evidence record format

```text
Task: Txx
Status: planned | in-progress | functional | verified | blocked
Working revision / diff description:
Dataset: synthetic test DB | reviewed candidate (path/hash)
Failing regression: command + exit + relevant assertion
Passing verification: command + exit + result count
Manual/browser evidence: URL + viewport + screenshot + outcome
Known limitations:
Next task and dependency gate:
```

Never mark a task verified with an empty command, missing screenshot for a visual gate, ignored test failures, or a fabricated result count.
