# SENTINEL polished intelligence archive implementation plan

> For implementing agents: use `superpowers:executing-plans` sequentially. No subagents for this requested workflow. Each task has its own acceptance gate; preserve evidence and stop at an unexplained failure.

**Goal:** A polished, fast spy-themed Indian defence reference where a reader can find a meaningful dossier, inspect its sources, follow a documented connection and save or compare what they discover.

**Architecture:** Retain the Next.js modular monolith and Prisma/SQLite publication boundary. Shared server-rendered dossier/list pages, small client interaction islands, bounded search/relationship services, versioned evidence and curated collection manifests. Extend the domain only for genuinely different editorial records.

**Stack:** Installed Next 16.3.4, React 19.2.8, Prisma/client 5.22, Tailwind 4, Base UI, existing map/graph libraries. No incidental framework upgrade.

**Spec:** [observations and experience contract](observations.md), [research](research.md), [test cases](test-plan.md), existing `docs/implementation-contracts.md` and content runbook.

## Constraints and precedence

This plan is an additive review proposal, not a rewrite of historical T00–T28 evidence. The user's spy-theme request supersedes C10's blanket plain-label preference; clear subtitles and evidence-status semantics remain mandatory. Existing database protection, publication, citations, canonical routes and accountability remain in force. Any shared contract amendment is made with its task and corresponding tests.

Read the relevant installed `node_modules/next/dist/docs/` guide before routing/rendering/data changes. No legacy seeds, original-database test setup, fixture publication, fabricated facts, fake security levels, silent capability scores or forced loading animations. Never convert every content type to Operation to avoid modeling it. The complete screenshot acceptance gate remains blocked: one Equipment surface was captured on 9 September, while other journeys and mobile coverage remain pending (see the [resumed audit](visual-audit-2026-09-09.md)).

Release order: P01 → P02 → P03 → P04 → P05 → P06 → P07 → P08 → P09 → P10. P11–P14 follow the core release. P09 research/staging can proceed while editor identity is unavailable; real publication remains gated. Each task should be a separately reviewable patch; commit explicit paths only if committing is authorized in that session.

## P01 — Establish honest baseline and active contracts

**Findings:** O01,O24. **Files:** `docs/implementation-plan.md`, `docs/implementation-contracts.md`, `docs/test-plan.md`, `progress_tracker.md`, task evidence folder; inspect `.github/workflows/quality.yml` and `scripts/run-e2e-tests.ts`.

- [ ] Record revision, clean/dirty state, source/database classification and server owner. Back up using SQLite backup API before any later mutation; record integrity/hash.
- [ ] Compare T08,T14,T15,T19,T26,T27 claims with concrete test assertions and actual runtime. Mark unproven gates functional/blocked instead of verified.
- [ ] Reconcile status introductions and replace conflicting interface examples only with implemented/tested contracts; preserve dated observations.
- [ ] Add the current vocabulary and planned-state distinction to the active contract. Keep source publication and theme separate.
- [ ] Inventory every route/action/copy state and export a task checklist under `docs/product-review/.../copy-inventory.md` at execution time.
- [ ] Run baseline lint/typecheck/unit/component checks. Record each command exit independently. Do not rebuild a user's running `.next` in place.

**Gate:** B01; no original-data change, no historical checkbox treated as evidence. **Output:** baseline/environment record consumed by all later tasks.

## P02 — One reliable search and navigation owner

**Findings:** O04,O05,O19. **Files:** modify `src/components/GlobalSearch.tsx`, `HomeSearch.tsx`, `SiteHeader.tsx`, `src/app/layout.tsx`; create `src/components/SearchProvider.tsx`, `tests/components/search-dialog.test.tsx`; extend `tests/e2e/search.spec.ts`, `navigation.spec.ts`.

**Interface:** `SearchProvider` owns one modal; `useArchiveSearch(): { openSearch(trigger: HTMLElement | null): void }`; header/home render triggers only. Client provider accepts server-rendered children; do not turn all pages into client components.

- [ ] Write S01–S04 regressions with both triggers mounted; fake timers for debounce and controllable fetch promises. Confirm intended failures.
- [ ] Implement one keyboard listener and one dialog with per-instance IDs from `useId`; focus returns to the activating trigger.
- [ ] Implement query states `idle | debouncing | loading | results | empty | error`; query change resets active index; close/short query invalidates request and aborts actual fetch signal.
- [ ] Give input a visible/accessible label, listbox option IDs, `aria-activedescendant`, selected styling and polite result/error status. Enter opens the active result; Escape closes.
- [ ] Control mobile menu open state; close on link activation and pathname change. Avoid trapping focus on an unmounted trigger.
- [ ] Run component tests and Chrome keyboard journey. Add 503/retry and out-of-order query checks.

**Gate:** S01–S04, N01. **Implementation anchor:** `fetch(url, { signal: controller.signal })`; increment request generation on close as well as new query. No SWR dependency needed just to own one listener.

## P03 — Search and collection correctness at realistic scale

**Findings:** O02,O03,O10,O11,O26,O27. **Files:** `src/lib/search/service.ts`, `src/lib/domain/query.ts`, `types.ts`, `src/lib/repositories/collections.ts`, `src/app/api/search/route.ts`, `src/app/search/page.tsx`, `src/components/CollectionToolbar.tsx`, collection pages; extend integration search/collections/publication tests; create unit query tests.

**Interface:** retain existing canonical EntityRef `{type,id}` and `SearchResponse` with `pageCount` consistently; document any C09 naming reconciliation. `parseCollectionQuery` returns normalized values plus invalid reasons/canonical query. Public search must join/recheck current public entities before counting and returning results.

- [ ] Add S05–S07 and Q01–Q03 using >500 matching rows, stale published projection, repeated controls, invalid numbers and sorting. Run failing cases in a separately guarded integration DB.
- [ ] Move exact/alias/prefix/contains/body ranking and count before pagination into parameterized SQLite queries. Enumerate entity table/type mapping in code; no user SQL identifiers. Use C09 score ordering, typed-ID tie break and literal wildcard escaping.
- [ ] Normalize whitespace/case consistently in projection and queries. Return short-query success consistently; reject >120, invalid type, repeated controlled parameters and non-integer page syntax with typed errors.
- [ ] Enforce fixed page sizes 8 quick/24 full; remove initial 500-row truncation. Rehydrate public state or join public tables before total and page calculation.
- [ ] Add full-search pagination, label the input/select and preserve query/type/page via GET. Make no-JS submissions useful.
- [ ] Apply sort in repositories, canonicalize clamped URLs, validate filters against real allowed values, reset dependent filters/page, retain tracking parameters only outside data filters.
- [ ] Use draft text for collection typing; submit or debounce committed URL updates with replace, preserving deliberate filter history. Parallelize independent facets; count-before-clamped-page remains sequential.
- [ ] Test stale-index withdrawal, rank beyond row 500, all six types, query errors and Back behavior. Record query count/rows for 2,000/10,000 synthetic records.

**Gate:** S05–S07,Q01–Q03; no stale/private result or truncated total. **Rollback:** preserve old search projection until new query/reconciliation validated; migration only if indexes are added, rehearsed on clone.

## P04 — Evidence is visible and semantically accurate

**Findings:** O07,O08,O09,O26. **Files:** `BadgeComponents.tsx`, `ProvenanceViewer.tsx`, `EvidenceLink.tsx`, `src/lib/repositories/entities.ts`, `evidence.ts`, `src/lib/domain/types.ts`, entity detail pages, publication validation; tests `evidence.test.ts`, new `provenance.test.tsx`.

**Interface:** use existing `PublicClaim`, `PublicEvidence`, `PublicRelationship`; add no internal reviewer notes to public DTOs. Shared display status maps each verification enum to label/icon/semantic colour and public explanation.

- [ ] Write E01–E04 for disputed explanation, rights-hidden quote, malformed JSON and evidence links for unit/operation/specification.
- [ ] Reuse one status component: confirmed/corroborated green, disputed/conflicting amber + plain explanation, unavailable neutral. Replace all underscores through a label dictionary.
- [ ] Expose only approved editorial explanation; show source title/publisher/date/version/locator with view-original action. Do not label arbitrary URLs official.
- [ ] Retrieve section evidence as well as atomic claims; wire unit and operation dossiers and equipment spec rows to it. Preserve publication filtering and source-rights rules.
- [ ] Replace unchecked JSON casts and catch-to-empty with domain validation. Differentiate absent optional data from corrupt persisted data; log safe record ID/error code, return recoverable error.
- [ ] Run evidence integration/component tests and source journey; verify hidden quotes are absent from HTML/JSON, not merely collapsed.

**Gate:** E01–E04. Publication/data changes require transactional service; no direct update to make a badge green.

## P05 — Comfortable dossiers and purposeful explorers

**Findings:** O06,O07,O09,O16,O20. **Files:** `ArticleLayout.tsx`, `ArticleBody.tsx`, `OnThisPage.tsx`, `InteractiveConflictViewer.tsx`, `InteractiveMapLayout.tsx`, `ClientOperationMap.tsx`, `OperationMap.tsx`, `ui/Timeline.tsx`, all six detail routes; create `src/lib/ui/motion.ts`, reading/chronology tests.

**Interface:** normal dossier is server rendered; `view=explorer&event=<id>&pane=briefing|timeline|map` selects optional interaction. Shared date/location types govern display. Narrative renderer accepts trusted Markdown text with raw HTML disabled and safe link protocols.

- [ ] Add D01–D04 before replacement: default normal article, precise chronology, duplicate/non-Latin headings, reduced motion and named timeline controls.
- [ ] Render summary, facts, body, source sections and related records in document flow; use explorer only for explicit view. No 800px global reader box.
- [ ] Use canonical historical date parser/order keys; never reverse ISO components or fabricate unknown endpoints. Use location precision/as-of fields rather than four decimals by default.
- [ ] Below 1024px show one explorer pane at a time; keep event and pane state shareable and Back-compatible. Invalid event returns overview without deleting valid context.
- [ ] Use a maintained safe Markdown renderer only after version/compatibility review; no raw HTML. Generate unique heading IDs and on-page navigation from the same AST. Support Devanagari text without empty IDs.
- [ ] Honor reduced motion in JS: instant `setView`, automatic rather than smooth scroll, no transform-based entrance; disable movement in Framer config when requested.
- [ ] Map remains opt-in and has missing-coordinate/tile-failure fallback, source precision and attribution. Name previous/next timeline buttons. Keyboard and no-JS reading checks complete task.

**Gate:** D01–D04; fresh accepted desktop/mobile dossier screenshots required before visual verification.

## P06 — Cohesive spy theme across every state

**Findings:** O11,O17,O18. **Files:** create `src/lib/ui/copy.ts`, `src/lib/ui/status.ts`; modify `globals.css`, navigation, breadcrumbs, header/footer, all active UI copy consumers and map/graph colour inputs. Add `docs/design/sentinel-language.md`.

**Interface:** central navigation entries `{href,label,description}`; labels from observations table; status colours separate from decorative accent. Canonical domain values and URL paths remain stable.

- [ ] Use O18 vocabulary as the starting contract. Inventory visible and assistive labels, tab options, metadata, loading/empty/error/toast states and admin consequences.
- [ ] Use the accepted Equipment screenshot as one baseline surface; capture the remaining journeys, then create and select a visual reference for the redesign before implementation. Rejected blank captures are not design references.
- [ ] Complete semantic background/surface/popover/input/accent/destructive/foreground/focus tokens. Base on current green identity; remove unrelated gold/blue constants after comparing accepted references.
- [ ] Implement dual labels, sentence-case body text, mono dossier metadata, 16–18px narrative, ≥12px supporting metadata and preferred 44px touch targets.
- [ ] Apply the motion durations in observations; actions respond immediately, transitions never delay reading. Keep accurate confirmation text for save/copy/error states.
- [ ] Inspect every canonical page and important state at 320/375/768/1024/1440px; measure composited contrast, check focus and 200%/400% zoom. Fix observed mismatches only.

**Gate:** V01–V03; complete visual acceptance requires the remaining desktop/mobile journeys and redesigned-state captures; the single baseline Equipment capture does not satisfy this gate. Pure copy/style changes use content/visual checks rather than tautological unit tests.

## P07 — Useful assessment and connection tools

**Findings:** O12–O15. **Files:** `CompareTray.tsx`, `ComparisonTable.tsx`, `GraphExplorer.tsx`, `src/app/compare/page.tsx`, `src/app/graph/page.tsx`, `src/lib/domain/compare.ts`, repositories `graph.ts`/`relationships.ts`; tests compare/graph.

- [ ] Add C01–C03 and G01–G03. Include URL seed outside first eight, Unit/Equipment/Source seeds, fourth selection and malformed percent/duplicate keys.
- [ ] Compare exposes a public equipment search/add control; one selection prompts another; max three blocks addition with an accessible explanation. Parse once and preserve canonical `items=` URL.
- [ ] Display variant/unit/context and source per compared value. Unknown stays unknown; no winner score; horizontal table overflow is bounded and labeled.
- [ ] Graph resolves a requested public seed independently of chooser results. Seed finder uses ranked search; text relationships include human predicate, direction, dates and evidence links.
- [ ] Bound relationship retrieval before full hydration. Batch endpoints by entity type and evidence by edge IDs; preserve order/cap/truncated. Avoid unlimited Promise.all over the corpus.
- [ ] Mount ResizeObserver with the actual graph node; test async load then resize. Stable graph data and node maps avoid rebuilding simulation on unrelated state changes.
- [ ] Verify 503/retry, hidden seeds, rapid seed changes and equivalent keyboard text navigation. Measure DB workload with high-degree fixture.

**Gate:** C01–C03,G01–G03; no >100 nodes/>200 edges or hidden records, database work bounded independently of output cap.

## P08 — Real investigation journeys

**Findings:** O21–O23,O25. **Files:** create `src/app/collections/[slug]/page.tsx`, `src/app/saved/page.tsx`, `src/components/CasebookButton.tsx`, `src/lib/casebook.ts`, `src/app/corrections/page.tsx`; modify home, featured collections, Forces and source detail. Add journey/casebook tests.

**Interface:** `CasebookV1={version:1,items:Array<{type:EntityType,slug:string,savedAt:string}>}`; store references only, max 100. Published DTOs resolve on render; withdrawn items show unavailable without cached private text. Collection manifests remain editorial source of inclusion.

- [ ] Write J01–J04 for a complete case-file path, persistence denial, stale records and a correction draft.
- [ ] Replace feature link-to-first-entity with a collection landing containing scope, overview, ordered trail, sources and named gaps.
- [ ] Homepage prioritizes published case file, search, domain entry and useful next action; no synthetic counts. Show computed coverage only against a defined universe.
- [ ] Implement browser-local Casebook with version parsing, storage failure message, add/remove/undo and clear. Do not promise accounts or sync.
- [ ] Implement copy-link success/failure states and correction draft containing record URL, issue description and proposed source. Enable submission only for a real configured destination; never fake “sent”.
- [ ] Implement sourced Forces overview/hierarchy from public evidenced records; bound/paginate units. Do not keep selectable blank promises as completed features.

**Gate:** J01–J04. No external message sent during verification; correction draft can be reviewed locally.

## P09 — Publish the first substantive connected collection

**Findings:** O01,O21,O22,O25. **Files:** existing `content/collections/kargil-1999.json`, T26 candidate package, import scripts and source registry; source evidence files in designated local evidence storage; update tracker only with proof.

- [ ] Validate current T26 source package against R01–R03; deduplicate source identities/versions before additions.
- [ ] Capture exact source bytes, hashes, publication/access dates, passage locators and rights notes. Distinguish commemoration from 1999 events and historically scoped variant use from current inventory.
- [ ] Complete existing T26 minimum: conflict, at least two documented operations/events, two people, two equipment profiles, three source documents and one end-to-end trail. Counts do not excuse invented edges.
- [ ] Run importer validate then dry-run; review proposed identity/content changes; apply only to guarded candidate. Replay proves idempotence.
- [ ] Establish accountable publisher through existing OIDC/principal workflow; sources first, entities next, relationships after endpoints. Missing identity blocks publication only.
- [ ] Validate candidate, inspect all published paths in Chrome, follow original sources, record coverage/gaps and rollback evidence. Repeat 1971 only after Kargil gate succeeds.

**Gate:** R01–R04 in test plan and existing T26/T28 gates. No original-data cutover or public deployment is implied by candidate readiness.

## P10 — Release quality, performance and documentation

**Files:** `.github/workflows/quality.yml`, test runners/lifecycle config, `docs/MANUAL_WORK_AND_REQUIRED_INPUTS.md`, tracker and new evidence folder. Change test runner only if lifecycle support is missing, never silently accept unknown flags.

- [ ] Run all narrow regressions then lint/typecheck/unit/component/integration/assets/content validators against explicit safe inputs.
- [ ] Run isolated production E2E plus publication→withdrawal lifecycle against one fresh DB/server per scenario. Never reseed the server being inspected.
- [ ] Recheck real OIDC login/non-editor deny/revocation/logout when configured; mock tests do not close provider gate.
- [ ] Capture and accept all main journeys in requested Chrome workflow, including errors and keyboard use; run screen-reader and zoom inspection.
- [ ] Measure three production runs with fixed dataset/device/network; record median and bytes/query counts. Targets: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1; lab interaction timing is not field INP. Preserve source content while optimizing.
- [ ] Inspect rollback on disposable candidate. Review diff and mark each gate independently. Produce release candidate evidence; deployment remains its own authorized action.

**Gate:** L01–L04; unresolved P0 blocks public launch.

## P11 — Field Manual and learning trails

**Files:** create `src/app/field-manual/page.tsx`, `[slug]/page.tsx`, `content/learning/` reviewed manifests, glossary schema/validator and tests. Reuse dossier/evidence display.

- [ ] Define glossary record `{slug,term,aliases,language,definition,sourceRefs,reviewedAt}` and link only valid public source references.
- [ ] Start with 30 sourced terms and three finite trails (services/ranks, aircraft roles, evidence literacy). Keep official acronym expansions alongside plain definitions.
- [ ] Add alias search, term links and optional local reading progress. Hindi aliases require reviewed translations.
- [ ] Test ambiguous acronyms, withdrawn sources, Unicode IDs and a complete novice trail; validate labels in five user sessions.

**Gate:** X01; editorial glossary entries do not become unsourced sidebar definitions.

## P12 — Situation Briefs, industry and policy

**Files:** additive Prisma migration plus repositories/validators/search adapters for `Briefing` and `Programme` only when implementing; new `/briefings`, `/industry`, `/policy` routes and manifests; extend canonical type union and every exhaustive switch with migration tests.

- [ ] Define publication fields shared with existing entities, source/evidence linkage, eventDate versus publishedAt, revision, reviewedAt, expiresAt where relevant. Budget values additionally require fiscalYear, basis (BE/RE/actual), currency and scale.
- [ ] Write X02 before extending schema: unknown fiscal basis fails; event date not overwritten by article date; retraction removes every public/search projection.
- [ ] Add a 3–5 item reviewed weekly digest, one budget brief using R04/R05 and one programme history with separately sourced milestones. Never treat order announcement as delivery.
- [ ] Provide source/date filters and changed-since-last-review notes; show stale status when review expires. Store source-specific attribution, not pooled “confirmed” claims.
- [ ] Rehearse migrations and extend source/evidence/relationship/search metadata paths for each type; stop if any switch or publication boundary is missing.

**Gate:** X02 plus full publication/search suite. Do not start a crawler or AI summary service as an incidental dependency.

## P13 — Recruitment and heritage directories

**Files:** new `/careers`, `/heritage` routes; typed notice/heritage schemas, validated content manifests, dedicated validators and tests. These can begin as reviewed static records referencing published sources.

- [ ] Notice schema: issuer, title, source URL, notification date, application close instant with timezone, exam/event date, supersedes, checkedAt, reviewDueAt, publication state. Heritage schema: official name, location precision, visiting/source date, rights and public URL.
- [ ] Write X03 using R06 dates: on review date applications are closed although examination is upcoming. Expired or unchecked notices never show active Apply.
- [ ] Add one official recruitment notice and five heritage/resources entries after exact source review. Link eligibility to original notice; do not guess eligibility or collect applications.
- [ ] Add corrections and original-source links; validate expired/moved destinations and asset rights. Reuse site vocabulary without changing official names.

**Gate:** X03; clear update ownership and no dead submission promises.

## P14 — Hindi and repeatable expansion

**Files:** shared UI copy catalog, language-aware routes/metadata, translated collection/learning records and font config. Reuse existing imports/publication, add locale tests.

- [ ] Define source-linked translations with original record revision and language tag. Keep stable entity identity across languages; separate translation review from source review.
- [ ] Add Hindi for the first collection and Field Manual; load needed Devanagari fonts rather than assuming Latin subsets cover them.
- [ ] Test language switch preserves record, citation target, filters and safe fallback; set lang/hreflang and canonical behavior explicitly.
- [ ] Expand one finite collection at a time, with known universe/gaps, source review, candidate validation and accepted reader journey.

**Gate:** X04. No universal “complete Indian defence database” badge; publish measured collection coverage and its definition.
