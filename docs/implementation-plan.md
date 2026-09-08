# SENTINEL recovery and expansion implementation plan

> **For agentic workers:** Use `superpowers:executing-plans` when available to execute this plan task by task. Subagents are optional only when separately authorized; this plan does not require delegation. Steps use checkbox syntax. Read the contracts and test case for the task before editing. Do not implement future tasks opportunistically.

**Goal:** Make SENTINEL a truthful, usable, well-organized Indian defence reference with verified content, reliable discovery, comfortable reading, and purposeful interactive exploration.

**Architecture:** Retain the existing Next.js application and SQLite/Prisma data layer. Establish canonical domain types, a publication-aware repository, reviewed evidence, a synchronized search projection, shared reading/listing components, and isolated test infrastructure. Introduce no separate graph database, new frontend scaffold, or production crawler during this recovery.

**Tech stack:** Installed baseline Next.js 16.3.4, React 19.2.8, Prisma and client 5.22.0, Tailwind 4, Base UI, Leaflet, Framer Motion, TypeScript; existing Python factory remains separate.

**Spec:** [review and recommendations](../SENTINEL_CODEBASE_REVIEW_AND_SUGGESTIONS.md). Read [implementation contracts](implementation-contracts.md), [test plan](test-plan.md), and [content operations](content-operations.md) with this file.

**Document status:** Execution is functional through T22. T00–T07 and T09–T22 pass their automated implementation gates; T08 remains blocked at the real-provider lifecycle gate. T23–T25 and T27–T28 remain planned, and T26 remains in progress pending evidence import and attributable publication. Original audit findings are dated 6 September 2026 and are not release certification.

## Global constraints

- “All sample historical content must be clearly marked as seed/demo content unless its citation has been verified.” — existing master spec.
- “Do not silently invent historical facts, specifications, quotations, casualty figures, operational claims or sources.” — existing master spec.
- “The public website consumes Gold/verified data, not crawler output.” — dataset strategy; operationalized by C03/C04 rather than a blanket green label.
- Preserve the user's existing uncommitted changes and database. Never reset the working tree or run a destructive seed against it.
- Edit only a task's listed files and direct dependencies; if a named file was renamed, locate its current consumer with `rg` and record the substitution.
- Read relevant guides in `node_modules/next/dist/docs/` before code changes; do not copy Next 14/15 conventions into this app.
- Do not upgrade application frameworks to make a planned snippet work. Validate versions of added test/auth/Markdown tooling and pin them.
- No result is “verified” without the required evidence. Missing browser/source/auth infrastructure blocks its specific gate, not all independent work.
- Publish/deploy/merge actions are separate from completing local implementation. Follow the active user's authorization; no automatic production release or mass historical publication.

## How to use this plan without losing context

1. Open `progress_tracker.md`; select the first unverified task whose dependencies are satisfied.
2. Read that task, its Cxx contracts, and named tests. Check the actual source before applying a change; line numbers from an older review are not patch anchors.
3. Capture the current failure. Write a focused regression test where behavior/data changes; for pure prose/style adjustments use the stated visual/content check instead of redundant markup tests.
4. Make one small change at a time. Do not rewrite a component unrelated to the failing behavior.
5. Run the narrow tests, then the task gate. Stop at an unexplained failure; don't suppress the rule, lower the expectation, remove evidence requirements, or change fixtures to hide it.
6. Record functional/verified/blocked state with commands, exit statuses, and evidence links. Do not mark future tasks complete.
7. Review the diff for unrelated files/secrets/data loss. If committing is appropriate to the active task, stage explicit task paths only and use the suggested commit subject. Never `git add .` in this already-dirty workspace.
8. On resume, re-read the evidence record and run the narrow check before trusting the previous result.

## Dependency order and independently reviewable deliverables

| Task | Deliverable | Dependencies | Main gate |
| --- | --- | --- | --- |
| T00 | Baseline and recoverable backup | None | Backup integrity + working-state record |
| T01 | Isolated test/quality harness | T00 | DB-01 + independent lint/typecheck |
| T02 | Immediate truthful UI and denied admin | T01 | No fake outcomes/verification; denied mutations |
| T03 | Additive schema and migration baseline | T01 | DB-02/03 |
| T04 | Canonical normalization/import | T03 | DOM-01–04, DB-03/04 |
| T05 | Public read boundary | T03,T04 | PUB-01/02 |
| T06 | Explicit evidence/relationships | T05 | EV-01–03, REL-01/02 |
| T07 | Runtime validation/publication service | T06 | PUB-03/04 |
| T08 | OIDC editor identity | T02,T03 | AUTH-01/07 + real provider gate |
| T09 | Transactional review UI/actions | T07,T08 | AUTH-02–06, AUTH-08 |
| T10 | Navigation and editorial pages | T02,T05 | NAV-01–03 |
| T11 | Bounded collections and filters | T04,T05 | COL-01–04 |
| T12 | Sourced unit pages/Forces | T06,T10,T11 | Unit journey + accessible preview |
| T13 | Shared ranked search service | T07,T12 | SRCH-01–03 |
| T14 | Reliable search interfaces | T10,T13 | SRCH-04–06 |
| T15 | Shared reading/motion/accessibility | T10 | READ-01/02 + manual accessibility |
| T16 | Useful homepage | T11,T14,T15 | First-screen task choices |
| T17 | Sources library/provenance UI | T06,T11,T15 | EV-01–03 public journey |
| T18 | People/equipment detail depth | T12,T15,T17 | READ-03 + source-linked fields |
| T19 | Chronology/conflict/operation UX | T06,T15,T17 | Exact dates/outcomes + mobile reading |
| T20 | Lazy, attributed, bounded maps | T12,T19 | MAP-01–03 |
| T21 | Scoped graph + text equivalent | T06,T13,T15 | GRAPH-01/02 |
| T22 | Real equipment comparison | T11,T18 | COMP-01/02 |
| T23 | Error handling, metadata, freshness | T05,T13,T15,T17 | META-01 + production withdrawal |
| T24 | Computed coverage | T07,T09,T17 | COV-01/02 |
| T25 | Fail-closed extraction factory | T04,T06,T07 | PIPE-01–03 |
| T26 | First reviewed connected collection | T09,T17–20,T24 | Sourcing + complete reader journey |
| T27 | Release rehearsal/documentation | T00–T26 | Full test plan + rollback evidence |
| T28 | Repeatable broader coverage | T27 | Per-collection release gate |

Execute in numeric order by default. Authentication setup can be blocked while later public read-only tasks proceed using the deny-all adapter; do not mark T08/T09 verified or enable admin as a workaround. T25 must not gate ordinary manually reviewed content import unnecessarily; T26 can use the manual source workflow if extraction dependencies are unavailable, with T25 separately blocked.

## Foundation and content integrity

### T00 — Capture the baseline and prove recovery

**Files:** Read AGENTS.md, package.json, prisma/schema.prisma, prisma.config.ts, all current git changes. Create local `docs/verification/<date>/T00/baseline.md`; modify `.gitignore` to ignore local backups/test artifacts before they are created.

**Consumes/produces:** Existing working copy → baseline evidence, backup path/hash, explicit original schema snapshot. No data mutation.

- [x] Run `pwd`, `git status --short`, `git diff --stat`, `node --version`, and `npm --version` as checked read-only commands.
- [x] Read installed package versions with `node -p "JSON.stringify({next:require('next/package.json').version,prisma:require('prisma/package.json').version,client:require('@prisma/client/package.json').version})"`.
- [x] Inventory untracked data/scripts with `rg --files`; note that they will not appear in `git diff` or a clean worktree.
- [x] Run the exact SQLite backup procedure in content-operations §1; record integrity result and hash. Do not print environment secrets.
- [x] Record read-only table counts/status distributions and foreign-key check results. Store a schema copy outside tracked source.
- [x] Reproduce original review's tsc/lint/content-validator results. The broken lint command is baseline evidence, not a task completion failure to hide.
- [x] Record browser availability and existing local server ownership; do not stop user-owned servers.

**Gate:** backup integrity `ok`; source remains unchanged; no secret/backup added to Git. **Suggested commit:** `docs: record recovery baseline` (sanitized notes only).

### T01 — Create a test harness that cannot touch real data

**Files:** Modify package.json/package-lock.json, next.config.ts, eslint.config.mjs, tsconfig.json, .gitignore. Create vitest.config.mts, vitest.components.config.mts, vitest.integration.config.mts, playwright.config.ts, tests/setup.ts, scripts/lib/test-database.ts, scripts/run-integration-tests.ts, scripts/run-e2e-tests.ts, tests/fixtures/archive.ts, tests/helpers/seed-fixtures.ts, tests/unit/test-database.test.ts.

**Contract:** Test-plan §§1–2. Before schema additions, fixture seeder uses only legacy fields; T03 extends it. **Produces:** checked test scripts and isolated .test-data/.next-test execution.

- [x] Read installed Next testing/Vitest/Playwright/ESLint guides. Record package engines and peer compatibility for new test packages; install exact versions and keep lockfile changes together.
- [x] Add the script/config contracts from test-plan §1. Replace `next lint` with `eslint .`; add ignores for generated test output/backup directories, not source paths.
- [x] Write DB-01 cases before implementing the guard. Include symlink and traversal cases, not only the happy path.
- [x] Implement realpath containment and child-process environment isolation. Return child exit status; never append a successful shell summary that masks failure.
- [x] Keep E2E output in `.next-test`, port3100, `reuseExistingServer:false`. Prove a port conflict fails without killing or reusing another process.
- [x] Create a minimal pure unit test and one synchronous component test; prove both run in their intended environments. Do not add empty passing tests named after future behaviors.
- [x] Run `npm run lint`; record its exact reported source paths as this task's additional file scope before fixing them. Fix current errors in small edits: replace `any` with actual DTO/Prisma types, remove unused imports, escape JSX quotes, update derived state/event handling. Do not blanket-disable rules or add `@ts-ignore`.
- [x] Run `npm run typecheck`, `npm test`, `npm run test:components`; capture independent exit statuses.

**Gate:** test path guard fails closed, baseline lint/typecheck are clean, framework versions unchanged. **Commit:** `test: establish isolated validation harness`.

### T02 — Remove immediate misleading behavior and deny admin by default

**Files:** Modify src/app/operations/[slug]/page.tsx, src/app/archive/page.tsx, src/components/ProvenanceViewer.tsx, src/app/admin/coverage/page.tsx, src/app/admin/layout.tsx, src/app/admin/review/actions.ts, src/app/forces/page.tsx, src/app/page.tsx, src/components/SiteFooter.tsx. Create src/lib/auth/editor.ts and tests/unit/review-service.test.ts with initial denial tests.

**Consumes/produces:** Legacy UI → honest incomplete states and deny-all `requireEditor` until T08 installs real identity. No unreviewed data is deleted.

- [x] Assert an operation end date alone does not generate a success outcome. Remove the synthetic success sentence; show only real stored narrative/date facts, marked provisional until T05 publication rules apply.
- [x] Remove static verified report/coverage cards. Use “No reviewed source documents available” and uncomputed coverage text instead of hardcoded counts/statuses.
- [x] Filter candidate/rejected claims out at this temporary display layer as defense in depth; C04 repository enforcement follows in T06. Do not call all remaining data officially confirmed.
- [x] Replace mock insignia with rank text. Hide generated mottos/war cries/victory claims from public Forces previews pending reviewed records.
- [x] Change absolute source exclusivity messaging to an accurate project purpose: “An independent educational archive building a source-linked reference to Indian defence.” T17 later documents actual methods.
- [x] Implement `requireEditor` to deny every request initially; call it before admin reads and before each mutation. No `NODE_ENV === development` bypass.
- [x] Test direct action denial, not only an admin layout redirect. Keep existing admin scaffolds inaccessible without deleting them.

```ts
// Initial behavior only; replaced by the validated session adapter in T08.
export class UnauthorizedError extends Error {}
export async function requireEditor(): Promise<never> {
  throw new UnauthorizedError('Editor access is not configured.');
}
```

**Gate:** fake verified/outcome text absent; denied actions do not write. **Commit:** `fix: remove misleading verification and close editor access`.

### T03 — Establish additive migrations and shared schema

**Files:** Modify prisma/schema.prisma, prisma.config.ts if incompatible, package scripts for JS-only generation, tests/helpers/seed-fixtures.ts. Create prisma/migrations/00000000000000_baseline/migration.sql, subsequent named migration, tests/integration/migrations.test.ts.

**Contract:** C03–C07; content-operations §2. **Produces:** fields/models consumed by all following repositories.

- [x] Baseline the saved legacy schema and migrate only a guarded disposable clone using the full migration rehearsal procedure. Never run existing seeds.
- [x] Add publication/revision fields to all public entity models; keep existing status/text/ID columns. Defaults must be DRAFT, not PUBLISHED.
- [x] Add Unit, EntityEvidence, RelationshipEvidence, ReviewAudit, ImportRun, ImportIdentity, and the search projection tables defined in C07/C09 and content runbook. Add foreign keys for concrete evidence/version links; polymorphic entity refs are validated by T07.
- [x] Add source/version/evidence/claim review metadata. Add date precision storage for conflict/operation/person dates; raw originals remain in import staging. Add equipment service/award/rank filter relations or indexed facet rows required by C08.
- [x] Add unique constraints for import identities/search documents/aliases; use deterministic edge fingerprints if nullable date columns prevent reliable composite uniqueness. Validate one official entity identity per import key.
- [x] Generate JS client only. Inspect SQLite rebuild SQL copy lists; check no legacy value column is dropped.
- [x] Extend fixture seeder to exact test-plan §2 data; negative fixture data goes into separate tests, not clean E2E seed.
- [x] Run DB-02/03 against migrated legacy and empty DB. Compare old IDs/content/relations, not only row counts.

**Gate:** two migration paths agree, replay safe, original DB intact. **Commit:** `feat: add publication and evidence schema safely`.

### T04 — Normalize imports and preserve identity

**Files:** Create src/lib/domain/entities.ts, dates.ts, taxonomy.ts, equipment.ts; src/lib/import/normalize.ts, service.ts; scripts/import-content.ts; tests/unit/dates.test.ts, taxonomy.test.ts; extend tests/integration/migrations.test.ts. Modify old seeds/generators only to mark/guard legacy entry points and package.json's seed routing.

**Interfaces:** C02/C06 functions; `normalizeImport(input): {records, issues}`; `importContent(input, mode): ImportReport` per content-operations §3. Export typed ValidationIssue `{code,path,message,severity:'error'|'warning'}`.

- [x] Write DOM-01–04, including leap day validity, ambiguous date rejection, exact award/rank matching, and unknown service handling.
- [x] Implement strict normalization. Do not call `new Date(value)` on unrecognized user/source strings. Validate calendar day/month/year explicitly.
- [x] Normalize legacy taxonomy through a mapping table; preserve unsupported values with review issues. Never infer current activity from a data file's age or flag.
- [x] Implement validate/dry-run/apply CLI modes with explicit input, report destination, and transactional apply. Resolve fields through an allowlist, not arbitrary nested Prisma data.
- [x] Use ImportIdentity for repeatable canonical IDs. Exact file/hash replay must not add rows; changed published content produces a review proposal, not an overwrite.
- [x] Write DB-04: a malformed later row rolls back earlier proposed changes. Verify reviewed evidence survives both successful import and failed import.
- [x] Remove legacy destructive commands from default seed usage; guard retained fixtures with DB-01. Keep migration references/data until reconciliation.
- [x] Run the focused unit and migration/integration checks; the full unit and integration suites also pass.

**Gate:** no guesses, no silent overwrite/deletion, replay stable. **Commit:** `feat: normalize and stage content imports`.

### T05 — Put all public reads behind one policy

**Files:** Create src/lib/db.ts, src/lib/repositories/entities.ts, publication.ts; modify src/lib/content.ts and every public page/API currently importing raw Prisma. Create tests/integration/publication.test.ts.

**Interfaces:** C03 publicWhere, getPublicEntity/getPublicEntityBySlug; existing getConflict/getPerson/getOperation/getEquipment/getSource wrappers delegate to public repositories.

- [x] Write PUB-01 across all six entity types, including missing reviewedAt/by, DEMO, WITHDRAWN, and direct guessed slugs.
- [x] Move Prisma singleton to db.ts with no behavior change. Keep server-only modules out of client components.
- [x] Implement shared public predicates; details use findFirst with slug+policy rather than findUnique without policy. Do not fetch an unrestricted record then serialize it before filtering.
- [x] Make getSlugs return only public slugs. Apply the same predicates to relation endpoints, listing counts, and current API queries.
- [x] Give callers typed public DTOs. Do not serialize internal reviewer notes/source paths/rejected claims.
- [x] Confirm empty public datasets render informative empty states. Do not mark legacy rows reviewed to avoid a blank site.
- [x] Search for bypasses: `rg -n 'prisma\.|from.*lib/content|from.*lib/db' src/app src/components`. Remaining direct reads are admin-gated or policy-filtered graph reads.
- [x] Run PUB-01/02 and typecheck. Browser-level guessed-slug coverage remains deferred because Playwright Chromium is unavailable; repository-level 404 behavior is covered by null results.

**Gate:** hidden data cannot leak through a second route. **Commit:** `feat: centralize public content access`.

### T06 — Make evidence and connections explicit

**Files:** Create src/lib/domain/relationships.ts, src/lib/repositories/evidence.ts, relationships.ts; modify content.ts and conflict/operation loaders; create tests/integration/evidence.test.ts, relationships.test.ts.

**Interfaces:** `getPublicClaims(ref): Promise<PublicClaim[]>`; `getPublicRelationships(ref): Promise<PublicRelationship[]>`, DTO contains source/target refs, predicate, valid dates, evidence and canonical hrefs.

- [x] Write EV-01–03 and REL-01/02 with candidate/rejected/draft-source evidence and a person from another operation in the same conflict.
- [x] Query only C04-eligible claims and sources. Map statuses/quote rights explicitly; never infer official status from the presence of evidence.
- [x] Remove Person.conflict exact-title joins and inferred operation participation. Migrate existing associations to relationship candidates, not approved edges.
- [x] Load only approved relationships with public endpoints and evidence. Preserve direction/type/date; use typed entity keys.
- [ ] Replace arbitrary `take:10` person association logic with complete paginated relationships or an explicit count/See all action.
- [x] Validate entity-ref existence and allowed predicate types at write time. Keep old joins for reconciliation, but public connection reads use reviewed records only.
- [ ] Run the two integration files and re-run PUB-01 for nested leakage.

**Gate:** rename a conflict title and relationships remain correct; no implied participants. **Commit:** `feat: connect entities through reviewed evidence`.

### T07 — Validate the runtime corpus and publish transactionally

**Files:** Create src/lib/publication/validate.ts, service.ts; scripts/validate-database.ts; extend tests/integration/publication.test.ts; modify scripts/validate-content.ts and package.json.

**Interfaces:** `validateEntityForPublication(ref): Promise<ValidationIssue[]>`; `publishEntity` from C03; `validateDatabase(): Promise<ValidationIssue[]>` read-only; output nonzero if any error.

- [x] Write PUB-03 rejecting unsupported source locators, malformed JSON, missing narrative evidence, generic biographies, fixture data outside guarded tests, invalid taxonomy, missing reviewer context.
- [x] Define error codes with field/entity refs so an agent can fix one record at a time. Warnings never silently turn into ignored publication requirements.
- [x] Verify every polymorphic entity ref, claim/evidence/source link, relationship endpoint, and alias target exists. Validate canonical IDs without auto-merging duplicates.
- [x] Implement publication as a revision-checked transaction with audit. The completed T13 projection rebuild is now called in the same transaction, deleting projections for non-public records and upserting reviewed public records.
- [x] Make legacy Markdown validator exit1 on errors and remove invented defaults that conceal missing source/status metadata. It remains separate from database validation.
- [x] Add CLI `validate:database` with explicit DATABASE_URL and read-only behavior. Negative tests prove exit1; clean fixture proves exit0. A legacy corpus with unsourced entries is expected to fail publication validation.
- [ ] Test withdrawal hides details and related reads. No public cache optimization is added before T23.

**Gate:** code validity and historical review are distinct; validation cannot self-repair data. **Commit:** `feat: enforce publication validation and audit`.

### T08 — Configure a validated editor identity

**Files:** Create src/auth.ts, src/app/api/auth/[...nextauth]/route.ts, src/app/signin/page.tsx, src/types/next-auth.d.ts if needed; modify src/lib/auth/editor.ts, package.json/lockfile, .env.example, .gitignore exception for .env.example. Add tests/e2e/admin.spec.ts and auth unit cases.

**Contract:** C05. External prerequisite: one OIDC issuer/client and one allowed stable issuer+subject pair. Lack of those values keeps admin denied and the real integration gate blocked; it does not permit insecure local login shortcuts.

- [x] Read installed Next authentication/server-action guidance and current official Auth.js setup. Pin a compatible release; record package/version and initialize its documented Next.js handler/session exports.
- [x] Configure generic OIDC using issuer/clientId/clientSecret from server-only environment. Auth library handles PKCE/state/nonce/session verification; do not substitute hand-built token parsing.
- [x] On initial sign-in, preserve provider issuer and subject in the validated session/JWT callback. Never read an editor role from browser-submitted JSON.
- [x] Parse EDITOR_SUBJECTS as exact issuer+subject pairs. Implement requireEditor by reading the library-validated session and checking the current allow-list every call.
- [x] Missing config yields a clear “Editor access is not configured” signin page and deny-all actions. Signin may sit outside /admin so the admin guard cannot create a redirect loop.
- [x] Check guards in every admin read/action. Add noindex. Unit-test anonymous/non-editor/removed-subject failure with dependency injection only in service tests.
- [ ] With provisioned test credentials, verify real sign-in, callback, editor access, sign-out, revoked membership, expired session, and rejected callback/state. Store screenshots without tokens/cookies.

**Gate:** AUTH-01/07 plus real identity lifecycle. **Commit:** `feat: authenticate and authorize editors`.

### T09 — Make review reliable and accountable

**Files:** Create src/lib/review/service.ts; modify src/app/admin/review/actions.ts, page.tsx, src/components/ClaimReviewCard.tsx, admin navigation; add tests/integration/review.test.ts and component tests.

**Interfaces:** C05 ReviewInput/ActionResult; server action validates/authenticates, service performs transaction. Wrapper exports may retain approveClaim/rejectClaim names while adapting input to the shared service.

- [x] Write AUTH-02–06 before replacing mutation behavior. Include stale revision and audit write failure rollback.
- [x] Implement C05 transaction with conditional update count. Approval preserves the explicitly chosen evidence status; unsupported official confirmation fails.
- [x] Load entity title, complete source/version/locator, existing value, candidate value, and evidence context for the review card. Do not show only opaque entity IDs and the first quote.
- [x] Add the C13 entity-proposal diff/action flow alongside claim review; approve returns the changed entity to IN_REVIEW, while rejection preserves its published version. Write AUTH-08 approve/reject/stale/rollback tests. The separate publishEntity action is available only after re-review and shows validation issues by field.
- [x] Add a required reason field, evidence status selection on approval, and clear approve/reject action labels. Use one pending action indicator; disable duplicates while pending.
- [ ] In a try/finally reset pending state; display typed action errors inline with retry, and reload current record on CONFLICT. Never ignore `{success:false}`.
- [x] Add admin review/coverage links. Remove inert New/Edit actions until a real operation exists; the importer+review workflow is the current editing path, not fake CRUD buttons.
- [ ] Revalidate affected public paths following successful transaction; no optimistic green verification before the server succeeds.
- [ ] Run review integration/component tests and real editor UI flow if T08 infrastructure is available.

**Gate:** one review → one attributable audit; concurrent/stale/failing reviews cannot corrupt state; changed public narratives require re-publication. **Commit:** `feat: add audited claim review workflow`.

## Navigation, discovery, and reading

### T10 — Repair navigation and publish honest editorial pages

**Files:** Modify SiteHeader.tsx, SiteFooter.tsx, Breadcrumbs.tsx, next.config.ts, homepage links; create src/lib/navigation.ts, src/app/about/page.tsx, methodology/page.tsx, editorial-policy/page.tsx, privacy/page.tsx, terms/page.tsx; tests/e2e/navigation.spec.ts.

**Contract:** C02/C10. **Produces:** canonical navigation used by header/footer/cards/breadcrumbs.

- [ ] Write NAV-01–03, including descendant redirects and a mobile menu journey.
- [x] Define navigation data once; preserve actual collection routes and group links under the five C10 hubs. Do not create empty top-level hub pages to satisfy labels.
- [x] Build mobile Site navigation using existing Dialog. Trigger label “Open navigation”; selected People link label “People”; collection h1 “People.” Close on navigation and return focus when dismissed.
- [x] Add aria-current for active destination/parent hub. Desktop navigation must fit or switch to compact menu before overlap; test768/1024 widths.
- [x] Implement exact C02 redirects and fix internal history/people links to direct canonical URLs.
- [x] About explains independent educational scope; methodology explains real source/review states; editorial policy explains corrections and disagreements. Privacy describes actual cookie/auth/analytics practices, including absence of analytics if absent. Terms explain educational use/source rights without invented legal guarantees. Do not invent contact addresses; correction flow initially gives a copyable record ID and a configured contact link only when supplied.
- [x] Footer links to those real pages; Source classification points into methodology or /archive. Replace duplicate homepage CTAs with browse and search purposes.
- [ ] Verify each link and keyboard menu flow, then run NAV tests.

**Gate:** all visible routes resolve and mobile menu is operable. **Commit:** `fix: complete navigation and editorial destinations`.

### T11 — Bound collections and standardize filters

**Files:** Create src/lib/domain/query.ts, src/lib/repositories/collections.ts, src/components/CollectionToolbar.tsx, Pagination.tsx; modify heroes/page.tsx/HeroesFilters.tsx, arsenal/page.tsx/ArsenalFilters.tsx, conflicts/page.tsx, operations/page.tsx; tests/integration/collections.test.ts, tests/components/filters.test.tsx.

**Interfaces:** C08 PageResult/CollectionQuery; `listPublicEntities(type, query): Promise<PageResult<CollectionItem>>`; CollectionItem holds ref/title/slug/summary and relevant display facts only.

- [x] Write COL-01–04 with55 people and incompatible domain/category filters.
- [x] Implement query parsing/normalization, stable sort with ID tie-break, count/clamp/page fetch. Use database predicates before pagination.
- [ ] Index publication/sort/filter fields and normalized facet joins. Do not transfer entire Person/Equipment rows just to derive dropdowns.
- [x] Build visible result count, filters, active chips, clear-all, page links preserving query. Add local search and compact list/card view state without changing result identity.
- [ ] Clear page on filter/search/sort change. Clear incompatible category on domain change. Support legacy query aliases then redirect to canonical keys.
- [ ] Replace hardcoded domain list/status dropdown with C06 labels and validated facets. Distinguish service from domain.
- [ ] Use exact rank IDs if rank sort is exposed; default People alphabetically. Remove substring getRankWeight and default significance ranking.
- [ ] Check empty/invalid-filter/out-of-range states and Back/Forward. Run collection integration/component tests.

**Gate:** max24 records/page at2,000+ fixture rows; no hidden records in counts/facets. **Commit:** `feat: paginate and filter public collections`.

### T12 — Bring Forces and units into the reviewed model

**Files:** Modify forces/page.tsx, forces/forcesData.ts consumers; create src/app/forces/units/[slug]/page.tsx, src/components/UnitPreview.tsx; extend repositories; add tests/e2e/forces.spec.ts.

**Consumes:** T03 Unit schema/T06 relationships/T11 collections. **Produces:** canonical unit pages and safe preview.

- [ ] Import hardcoded unit data as DRAFT candidates only. Preserve original JSON text in staging; do not copy generated motto/history into reviewed fields.
- [x] Read public units through repositories; keep service tabs in `?service=...&tab=overview|organization|units` URL state.
- [x] Default Forces to a concise sourced overview; map becomes explicit opt-in under T20. Organization lists unknowns honestly and removes position-derived insignia.
- [x] Create canonical unit page with intro/service/unit type/parent/dated sourced history/related people/sources. Missing public unit→404.
- [ ] If preview is useful, use existing Dialog with Unit title/close/Escape/focus return and link to canonical page; title card is a real link or button.
- [ ] Test service filter, pagination, direct unit link, refresh preservation, invalid tab, and no unit data fallback. Verify no unsourced strength/base assertions survive public projection.
- [ ] Run PUB/REL regression and forces E2E flow.

**Gate:** unit knowledge is searchable/linkable and reviewed; no hardcoded public factual bypass. **Commit:** `feat: publish reviewed forces and unit profiles`.

### T13 — Build one ranked search service

**Files:** Create src/lib/search/service.ts, projection.ts, query.ts; modify API search route and publication/import synchronization; add tests/integration/search.test.ts.

**Interfaces:** C09. `rebuildSearchDocument(tx, ref)` deletes projection for non-public ref, otherwise upserts normalized document+aliases in the supplied transaction. `reconcileSearchIndex()` is an explicit repair tool, not an automatic read mutation.

- [ ] Write SRCH-01–03, exact alias ambiguity, title/body ranking, and private alias leakage.
- [x] Implement normalized projection for all six types; candidate imported changes do not update the public projection until approved/published.
- [x] Implement parameterized SQLite ranking using C09 scores and highest-match rule, with count and pagination. Use `instr(normalizedText, query)` or properly escaped LIKE for literal matching. Never interpolate raw user SQL.
- [x] Integrate projection updates in publish/withdraw/approved-public-revision transactions. Add validation detecting missing/stale rows.
- [x] Refactor `/api/search` to use shared service and C09 response shape; put all DB/alias work inside try/catch. Validate mode/type/query and cap page.
- [x] Rebuild test index deterministically. Verify count55 for Person fixture search and quick-prefix equality.
- [ ] Run SRCH and PUB-04 tests. Simulate database error→503 without SQL details.

**Gate:** one ranked source of truth, bounded result payloads, public policy preserved. **Commit:** `feat: unify ranked public archive search`.

### T14 — Make search interfaces consistent and recoverable

**Files:** Modify GlobalSearch.tsx and search/page.tsx; create SearchResults.tsx if shared; tests/components/search-dialog.test.tsx and tests/e2e/search.spec.ts.

**Consumes:** C09 API/service. **Produces:** accessible quick/full search with identical relevance.

- [ ] Write race test with two deferred responses resolving backwards; write503 retry test before changing fetch state.
- [x] Add AbortController and monotonically increasing request ID. Cleanup on query/close/unmount; ignore obsolete completions in success/error/finally paths.
- [x] Model idle/debouncing/loading/results/empty/error distinctly. Query shorter than2 cancels and resets state; no premature no-results during debounce.
- [ ] Implement combobox keyboard selection with labeled input/options and announced counts. Keep native links for result destinations where possible; Escape closes and focus returns.
- [x] Full search uses `searchArchive` directly with GET form, label/type select/count/pagination; include Sources/Units types. Normalize type casing through one parser.
- [ ] Make form stack at narrow widths, preserve q/type/page in URL, and show retry for server failure. Do not call search “commands.”
- [ ] Run component tests using controlled timers/deferred requests, then E2E quick→full→detail and JS-disabled GET search.

**Gate:** no stale results, usable keyboard path, both surfaces agree. **Commit:** `fix: complete accessible resilient search flows`.

### T15 — Establish a quiet, accessible reading system

**Files:** Modify globals.css, layout.tsx, template.tsx, ScrambleText.tsx, UI token usage; create ArticleLayout.tsx, ArticleBody.tsx, OnThisPage.tsx; tests/e2e/reading.spec.ts, accessibility.spec.ts.

**Contract:** C10. **Produces:** shared article presentation and safe body rendering.

- [ ] Record current screenshots if browser available; name unavailable screenshot gate explicitly otherwise.
- [x] Implement complete theme tokens with C10 starting colors, reading width/sizes, visible focus, skip link, and one main landmark. Remove global scanner/grid motion and redundant nested container padding.
- [x] Essential h1 text renders on the server immediately. Remove scramble from heading content or render stable semantic text with optional aria-hidden decoration; reduced motion removes decoration entirely.
- [ ] Read package compatibility and add exact-pinned `react-markdown`/`remark-gfm` if using Markdown. Disable raw HTML; restrict URL schemes. Do not render untrusted Markdown as executable MDX or use dangerouslySetInnerHTML.
- [x] ArticleBody renders real paragraphs/headings/lists; add intentional typography styles rather than assuming `prose` parses content. Escape/disallow embedded HTML/script and test the behavior.
- [x] ArticleLayout places intro/facts/optional media before anchors and body. OnThisPage uses real heading IDs; keyboard anchors are not hidden behind sticky header.
- [x] Remove persistent animation; honor prefers-reduced-motion in CSS and relevant Framer components. Pure stylistic choices get visual checks, not exact-class unit tests.
- [ ] Run READ-01/02 and accessibility automated/manual checks. Inspect320–1440px widths and200/400% zoom.

**Gate:** content readable before JS; ordinary reading is calm; semantics/focus verified. **Commit:** `feat: standardize accessible article reading`.

### T16 — Make the homepage an effective starting point

**Files:** Modify app/page.tsx; optionally create HomeSearch.tsx/FeaturedCollection.tsx; add tests/e2e/home.spec.ts for essential navigation only.

**Contract:** C10; review §6. **Produces:** clear entry to actual corpus.

- [ ] Replace85vh branding-only hero with title, short description, visible search, and subject choices. Use the shared search behavior rather than a third implementation.
- [ ] Add one featured reviewed collection queried from data; if none exists, show a plain building-the-archive message with working source/browse links.
- [ ] Add a small Start here learning section only with real destinations. Never render cards for nonexistent pages.
- [ ] Show at most three recently reviewed records; dates are reviewedAt, not import updatedAt. Do not show fabricated counts.
- [ ] Use one distinct CTA for browsing and one for search. Remove duplicated/ambiguous archive buttons.
- [ ] Verify at375px that purpose/search/first topic choices appear without an entire branding screen of scrolling. Review long titles and empty corpus.
- [ ] Run navigation/home E2E and capture desktop/mobile states.

**Gate:** a novice can identify where to begin; no empty feature links. **Commit:** `feat: make homepage a focused discovery hub`.

### T17 — Build the real source library and provenance experience

**Files:** Modify archive/page.tsx, archive/[slug]/page.tsx, ProvenanceViewer.tsx, BadgeComponents.tsx; extend source repositories/collections; tests/e2e/sources.spec.ts.

**Consumes:** canonical Source model + C04 DTO; SourceRecord is legacy input only after a reviewed mapping.

- [ ] Migrate legitimate legacy source metadata to candidates; placeholder FileN/homepage records stay draft. Preserve legacy IDs in import identity mapping and redirects when actual equivalence is proven.
- [ ] Query/paginate public documents by type/publisher/date; title links lead to real source detail pages.
- [ ] Detail displays publisher/date/version/locator context, original URL, archived URL when known, source classification, and linked public entities.
- [ ] Replace ProvenanceViewer clickable div with button+aria-expanded+aria-controls; public title “Sources and evidence.” Show explicit status description and appropriate color/icon.
- [ ] Render all relevant public evidence, not just evidence[0]. Honor quote rights and explain unavailable original documents without fabricated replacements.
- [ ] Provide a correction action only through configured contact; otherwise show copyable page ID and explain the workflow without a dead submit button.
- [ ] Test candidate/rejected/draft-source exclusion, quote rights, keyboard disclosures, real link semantics, and empty library.

**Gate:** reader can reach the supporting document from a claim. **Commit:** `feat: connect source library to public evidence`.

### T18 — Complete people and equipment details

**Files:** Modify heroes/[slug]/page.tsx, arsenal/[slug]/page.tsx; create FactList.tsx and EvidenceLink.tsx if useful; extend typed repositories; tests/e2e/reading.spec.ts.

- [ ] Apply ArticleLayout to both pages; always show a short introduction, including when full content exists.
- [ ] People shows independent birth/death values, exact reviewed rank/service/awards, units, and participation links. Do not require both dates to show either one.
- [ ] Equipment shows domain/role/variant/current-status as-of source/development history/specifications. Normalize arrays/objects at ingestion, not scattered page try/catch blocks.
- [ ] Show unknown specs as Not documented and attach evidence references to populated material facts. Avoid unsourced decorative badges.
- [ ] Add reviewed media through Media DTO only when rights metadata exists; record alt/caption/credit. No random substitute photo.
- [ ] Add related topics grouped by meaning with pagination/See all if needed. Keep core narrative uncluttered.
- [ ] Run READ-03, evidence integration, long title/absent media/unknown date cases and mobile article screenshots.

**Gate:** details expose the useful data already available in the knowledge model without losing sourcing. **Commit:** `feat: deepen sourced people and equipment pages`.

### T19 — Repair chronology and conflict/operation reading

**Files:** Modify conflicts/page.tsx, conflicts/[slug]/page.tsx, operations/page.tsx, operations/[slug]/page.tsx, InteractiveConflictViewer.tsx, ui/Timeline.tsx, ui/VerticalTimeline.tsx, InteractiveMapLayout.tsx; tests/e2e/timeline.spec.ts.

- [ ] Replace split/reverse date parsing with C06 parser/formatter/order keys. Missing end dates do not imply ongoing status.
- [ ] Make titles direct canonical links; disclosure buttons reveal optional summaries with expanded semantics. Label Previous events/Next events buttons.
- [ ] Use ArticleLayout for conflict context, dated chronology, operations, outcome, related people/equipment, and sources. Every milestone comes from documented records.
- [ ] Operation objective/outcome fields display only stored reviewed content; remove synthetic generic timeline narratives permanently.
- [ ] Explorer is opt-in via `view=explorer&event=<id>`; selected invalid ID→overview. Keep ordinary reading in normal flow.
- [ ] On narrow screens show one explorer pane with clear controls; do not stack fixed800px desktop columns. Preserve selected event on refresh/Back.
- [ ] Decouple scroll spy from global custom events where multiple explorers might collide; use component-scoped state/context. Auto-select only when reader intentionally engages the explorer; do not steal focus during scroll.
- [ ] Run date regressions, keyboard timeline tests, URL-state tests, and mobile overflow/reading inspection.

**Gate:** dates/outcomes accurate to stored evidence; reader can navigate without pointer or map. **Commit:** `feat: make chronological exploration accessible`.

## Rich exploration and operational completion

### T20 — Load maps deliberately and validate assets

**Files:** Modify ClientOperationMap.tsx, OperationMap.tsx, ForcesMap.tsx, ForcesMapWrapper.tsx, WarRoomMap.tsx if retained, InteractiveConflictViewer.tsx; create src/lib/domain/location.ts, scripts/validate-assets.ts, public/maps/manifest.json; tests/unit/assets.test.ts, tests/e2e/maps.spec.ts.

- [ ] Write MAP-01 asserting no tile/GeoJSON network request before activation. Assert text location list is visible.
- [ ] Add Show map action around dynamic import/render. If coordinates absent, show Location not documented and do not create a guessed marker.
- [ ] Add typed precision/source/asOf metadata and apply it to displayed coordinates. Fit bounds for multiple locations; reduced-motion changes center without animated flight.
- [ ] Restore visible provider attribution. Source/provider requirements must be recorded in the map manifest; map errors have retry and text fallback.
- [ ] Validate the two GeoJSON assets. Remove the unused404 file after confirming no imports reference it. Simplify valid geometry with a reproducible offline tool/config, target<=1MB, preserving necessary shapes; record source/license and simplification command.
- [ ] Do not portray first-service-wins state coloring as exact jurisdiction. Either use sourced dated coverage or restrict view to sourced high-level locations without unsupported polygons.
- [ ] Consolidate duplicate map icon/controller code only where behavior matches; inspect whether WarRoom is unused before deleting or leaving a clearly deprecated module.
- [ ] Run MAP-01–03, coordinate parsing, provider failure, and narrow-screen inspection. Record requests/bytes and screenshots.

**Gate:** maps are optional, attributed, accessible through text, and bounded in size. **Commit:** `perf: defer and simplify educational maps`.

### T21 — Scope graph exploration to a question

**Files:** Modify api/graph/route.ts, GraphExplorer.tsx, ConnectionExplorer.tsx, graph/page.tsx; create src/lib/repositories/graph.ts; tests/integration/graph.test.ts, tests/e2e/graph.spec.ts.

- [ ] Write GRAPH-01 for missing/private seed and a synthetic>100-node neighborhood.
- [ ] Require type+id seed, validate typed IDs, load only one-hop approved/public relationships, cap results and report truncation. Preserve predicate/direction/dates.
- [ ] Page offers search/select a topic instead of fetching the whole database on mount. Selected topic goes into URL.
- [ ] Provide labeled relationship list with canonical links alongside the canvas. Keyboard users can complete the same topic-to-topic journey.
- [ ] Add loading/empty/error/retry; HTTP503 must not be treated as valid graph data. Cancel superseded requests.
- [ ] Measure canvas container through ResizeObserver and supply dimensions; resize mobile/desktop without clipped controls. Respect reduced motion.
- [ ] Run graph tests and related-publication regressions.

**Gate:** no global2,005-node dump; graph has a useful equivalent text path. **Commit:** `feat: scope graph discovery to reviewed relationships`.

### T22 — Implement real equipment comparison

**Files:** Modify compare/page.tsx, Arsenal card/list controls; create src/lib/domain/compare.ts, CompareTray.tsx, ComparisonTable.tsx; tests/unit/compare.test.ts, tests/e2e/compare.spec.ts.

- [ ] Write COMP-01/02 using fictional A/B specs. Use Promise searchParams per installed Next conventions.
- [ ] Add explicit Add to comparison controls separate from card title links; keyboard accessible and no nested buttons inside anchors. Tray shows selected count, remove, clear, and Compare.
- [ ] Store selection in URL or local state until navigating to canonical compare URL; final URL fully reconstructs comparison.
- [ ] Deduplicate slugs, enforce max3, resolve only public equipment, and handle0/1/unavailable inputs using C11 states.
- [ ] Render semantic table with column headers/captions; mobile table has labeled bounded horizontal overflow. Include variant context and source links.
- [ ] Compare only like measures and validated units. Missing=Not documented; no overall winner/capability score. Show incompatible contexts separately.
- [ ] Test add/remove/refresh/Back/direct URL and max limit. Re-run publication filtering.

**Gate:** comparison works end-to-end with sourced, comparable fields. **Commit:** `feat: compare selected equipment records`.

### T23 — Close failure, metadata, and freshness gaps

**Files:** Create app/loading.tsx, error.tsx, not-found.tsx, sitemap.ts, robots.ts; add generateMetadata to all public detail pages; create src/lib/config.ts; modify layout/root metadata and database route behavior; tests/e2e/metadata.spec.ts, tests/e2e-lifecycle/publication.spec.ts, playwright.lifecycle.config.ts, scripts/run-e2e-tests.ts.

- [ ] Write META-01 and production PUB-04 for withdrawal. Include source and unit pages, not only four original entity types.
- [ ] Validate SITE_URL; build tests supply local explicit origin. Use public repository metadata so private titles cannot leak through head tags.
- [ ] Generate canonical URLs and source-linked summaries; sitemap only public canonical entities. Exclude admin/auth/query aliases and internal paths.
- [ ] Keep database-backed pages dynamic initially with version-supported settings. Document later cache optimization as a separate measurable change. Ensure no source mutation is performed during generateStaticParams/build.
- [ ] Add retry error boundary, friendly not-found with search/browse, and non-misleading loading states. Avoid leaking stack traces or fake record counts.
- [ ] Verify500/API503/not-found/empty states are distinct. Add noindex to admin/auth and sensible social preview defaults; no fabricated entity image.
- [ ] Run isolated production E2E with publish/withdraw/read cycle and inspect generated head/sitemap. Use `npm run test:e2e -- --lifecycle` and the per-scenario database/server lifecycle in test-plan §2; never reseed beneath the running server.

**Gate:** metadata respects publication and errors recover cleanly; updated content is not stale. **Commit:** `feat: add public metadata and reliable route states`.

### T24 — Replace coverage decoration with computed evidence

**Files:** Modify admin/coverage/page.tsx; create src/lib/coverage.ts, content/collections schema/manifest handling; update analytics coverage model only if active; tests/unit/coverage.test.ts.

- [ ] Write COV-01/02. Define indexed/sourced/reviewed counts separately against an explicit known-universe manifest.
- [ ] Count GOLD claims with valid evidence for verified claims; count source documents, not source families, when label says documents.
- [ ] Show undefined denominators as Coverage not yet defined. No hardcoded COMPLETE labels.
- [ ] Link gaps to filtered review queue or record IDs; display last review date and collection owner.
- [ ] Reuse C10 tokens instead of undefined admin CSS variables. Protect the dashboard with requireEditor.
- [ ] If dbt is used, make its output match the same definitions and validate count parity. Otherwise keep admin computation in application queries; do not require dbt just to count rows.
- [ ] Run unit tests and inspect populated/empty/unknown-denominator states.

**Gate:** percentages/count labels can be recomputed from actual records. **Commit:** `feat: compute honest collection coverage`.

### T25 — Make extraction fail closed and replay safely

**Files:** Modify factory/assets.py, run.py, pyproject.toml/uv.lock, src/factory/__init__.py, config/ontology.yaml, config/sources/mod.yaml, analytics/dbt_project.yml/profiles.yml; create factory/tests/test_extraction.py; update factory/README.md.

- [ ] Write PIPE-01 with missing local document and unavailable model; assert zero database writes.
- [ ] Remove mock fallback source/claim responses. Raise a typed extraction error and persist a failure report outside publication state.
- [ ] Validate response through Pydantic ExtractionResult plus ontology allowlists. Keep source version explicit; no find_first version selection.
- [ ] Check quote/locator against captured text and evidence policy. Queue unsupported or ambiguous claims for review; never mark GOLD in the extractor.
- [ ] Add deterministic hash-based version/evidence identity and transactional candidate writes. Exact replay is idempotent; partial failure rolls back.
- [ ] Remove blind official-source truth overrides; record attribution and conflicting evidence. Do not infer Army/awards/year with substring defaults.
- [ ] Declare actually imported dependencies in the locked factory environment and provide a real CLI entry point that validates arguments and returns nonzero on failure. Keep source fetching as a separately configured adapter; no automatic broad crawl.
- [ ] Remove duplicated dbt configuration/starter models from the active run after confirming they are unused. Test only real coverage transformations against disposable data; analytics must not write public source tables.
- [ ] Run `uv run --directory factory pytest tests/test_extraction.py` after configuring the project's supported uv/Python environment; if dependencies are incompatible, record the exact resolution error and keep manual ingestion functional.

**Gate:** source/model failure never becomes a claim; replay safe. **Commit:** `fix: enforce evidence-first extraction failures`.

### T26 — Build one real connected collection

**Files:** Add reviewed collection manifest and evidence/source ledger; use canonical import/review tools rather than editing page components. Update verification notes and progress tracker.

- [ ] Follow content-operations §§4–6 exactly. Choose actual obtainable sources before authoring detailed narrative.
- [ ] Capture document metadata/hash/rights/locator and record every unresolved gap. Treat the minimum counts as targets, not permission to manufacture facts.
- [ ] Import candidates through validate→dry-run→apply on the candidate database. Resolve identities and relationship evidence.
- [ ] Review claims/narrative/media and publish through audited service. Current service-status claims require dated evidence; old input labels do not suffice.
- [ ] Validate candidate corpus in read-only mode, including no fixtures/placeholders, no private-source evidence, and consistent search projection.
- [ ] Complete Home→collection→operation/event→person/equipment→source on mobile and desktop. Confirm each step teaches something and the link means what its label claims.
- [ ] Record coverage, source ledger, screenshot evidence, and remaining omissions. A missing source blocks only the corresponding editorial gate; never report complete sourcing without it.

**Gate:** content-operations §6 minimums + complete evidence journey. **Commit:** `content: publish reviewed connected collection` only when publication work is authorized and evidence exists.

### T27 — Rehearse release and reconcile documentation

**Files:** Update README.md, progress_tracker.md, docs/verification release record, factory/README.md; create .github/workflows/quality.yml if repository CI is desired/available; no automatic deployment job.

- [ ] Run every test-plan §7 gate as an independent command. Preserve failed gate status; do not report “tests pass” based solely on TypeScript.
- [ ] Run full responsive/keyboard/screen-reader/reduced-motion checks and save accepted screenshots. If browser tooling is missing, record exactly which checks remain blocked.
- [ ] Run performance budgets with production build and fixed dataset; record raw/compressed bytes and environment separately.
- [ ] Repeat migration/rollback rehearsal against disposable candidate. Verify new editor activity is not discarded by rollback procedure.
- [ ] Add CI jobs for lint/typecheck/unit/components, isolated integration, and E2E production build. Use locked installs and test DB paths, no production secrets/crawler execution/seed resets. Python job is separate and conditional on the supported environment being established.
- [ ] Update README with actual working commands, required environment names, source pipeline, test DB policy, auth setup state, and startup/storage assumptions.
- [ ] Mark tasks verified only from evidence; distinguish software readiness, editor-provider readiness, content readiness, and deployment readiness. Inspect final diff for unrelated changes.
- [ ] Present the local verified result and unresolved limitations. Deployment/storage/auth callback production setup is a separate task; do not silently publish.

**Gate:** all applicable release gates passed, others explicitly blocked; no unsupported completion claims. **Commit:** `docs: record verified release readiness`.

### T28 — Expand coverage without growing clutter

**Files:** New collection manifests and reviewed data, reusable domain extensions only when required; no new top-level navigation item by default.

- [ ] Pick one domain from the review coverage matrix; follow content-operations §7 collection playbook.
- [ ] Define first finite scope and acceptance questions before data collection. Use five candidate records to expose taxonomy problems.
- [ ] Reuse entity/detail/source/list templates; model new concepts only when an existing type cannot represent them accurately. For example, organization and programme must not be shoehorned into Equipment merely to avoid a reviewed schema extension.
- [ ] Write one additional domain fixture and validation/search/source-journey regression for any new type. Extend C02/C03/C09 atomically if a type is added.
- [ ] Establish domain-specific review fields: fiscal year/units for budgets; expiry/official notice for careers; rights for media; translation review for languages.
- [ ] Repeat publication/performance/accessibility/coverage gates before increasing sample size. Keep optional dated updates linked to canonical entities.
- [ ] Add light theme, multilingual UX, bookmarks, or AI only through separate scoped plans with the same test/evidence discipline; they are not blockers for the recovery release and do not get empty buttons now.

**Gate:** each new collection independently passes T26/T27-style evidence and UX gates. **Commit:** name the actual reviewed collection, not “make dataset exhaustive.”

## Task-to-review traceability

| Review finding/recommendation | Owning tasks |
| --- | --- |
| Misleading verification/publication, source labels | T02,T03,T05–09,T17,T24 |
| Generated filler, outcomes, insignia, inferred facts | T02,T04,T07,T12,T19,T25,T26 |
| Unprotected admin and ignored action errors | T02,T08,T09 |
| Broken mobile menu/links/route naming | T10,T16 |
| Unbounded collection payloads/filter mismatches | T04,T11 |
| Inconsistent search, missing types, stale responses | T12–14 |
| False/missing relationships and graph overload | T06,T12,T21 |
| Date/taxonomy/seed/provenance drift | T03,T04,T07,T25 |
| Placeholder compare/archive/admin controls | T09,T17,T22 |
| Reading hierarchy, media, Markdown, tokens, motion | T15–20 |
| Map size/attribution/precision/false coverage | T20 |
| Accessibility and responsive verification | T10–23,T27 + test-plan §5 |
| Metadata, loading/errors, stale public data | T23 |
| Misleading progress and infrastructure complexity | T00,T01,T24,T25,T27 |
| Comprehensive coverage without clutter | T16,T26,T28 + content-operations §7 |

## Stop conditions and recovery decisions

- **Unexpected historical value:** create an issue in import report; keep raw value; do not infer a replacement.
- **New schema/data loss prompt:** stop mutation, inspect migration diff, rehearse on clone; never accept reset automatically.
- **Failing test unrelated to current change:** reproduce and identify baseline/new cause; fix required dependency or record exact blocker. Do not mark task verified.
- **Missing source/auth/browser:** keep dependent gate blocked and continue tasks that do not need it. No mock public evidence, auth bypass, or invented screenshots.
- **Current source differs from this plan:** locate equivalent responsibility, update affected task/contracts/tests together, then proceed. Avoid blindly applying snippets.
- **Scope grows:** complete the current narrow deliverable and record the new proposal separately unless the additional change is required to pass its existing gate.

## Executor handoff prompt

```text
Read AGENTS.md, docs/implementation-plan.md, docs/implementation-contracts.md,
docs/test-plan.md, docs/content-operations.md, and progress_tracker.md.
Inspect the current working state. Preserve all user changes and the original DB.
Select the first unverified task with satisfied dependencies; implement only that
task and its explicit prerequisites. Demonstrate its regression, make the minimal
change, run its exact gate, and record evidence. Never fill missing historical
facts, sources, credentials, or browser results with invented data. Do not promote
draft/demo content to make the site look populated. Do not deploy automatically.
Report changed files, test results, remaining blockers, and the next task.
```
