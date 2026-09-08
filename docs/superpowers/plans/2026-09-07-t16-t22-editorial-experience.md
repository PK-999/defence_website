# T16–T22 Editorial Experience and Owner Identity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Puneeth Kakarla as the intended reviewer and publisher, then complete every unblocked product task from T16 through T22 with evidence-backed public browsing, sources, reading pages, chronology, maps, graph exploration, and equipment comparison.

**Architecture:** Keep the existing Prisma publication boundary and repository DTOs as the only public-read path. Add a role-aware editorial principal record that is inactive until an OIDC issuer-plus-subject is configured, then build each public experience on typed repository functions and URL state. Every new surface has an empty, loading, error, and private-record behavior and is tested against the isolated database.

**Tech Stack:** Next.js 16.3.4 App Router, React 19, TypeScript, Prisma 5.22 with SQLite, Vitest, Playwright 1.63, Leaflet/react-leaflet, react-force-graph-2d, Tailwind CSS v4.

**Execution note:** The automated implementation steps through T22 are complete and linked from `progress_tracker.md`. Leave manual release checks (real OIDC lifecycle, screen-reader/zoom inspection, licensed media review, and production publication) unchecked until their external inputs and acceptance evidence exist.

**Spec:** `docs/implementation-plan.md` tasks T16–T22, `docs/implementation-contracts.md` C04–C12, and the approved design in the preceding conversation.

## Global Constraints

- Public queries return only `publicationStatus = PUBLISHED` and `contentKind = EDITORIAL` records; candidates, drafts, rejected records, and private evidence never leak.
- Match editor identity by OIDC `issuer + immutable subject`; email is profile metadata and cannot grant access by itself.
- Puneeth Kakarla (`puneethkakarla@gmail.com`) receives both `REVIEWER` and `PUBLISHER` roles in a pending principal record; access activates only after a configured immutable OIDC subject is linked.
- Existing published records are never overwritten by imports; changes become review proposals.
- Source claims must retain source version, locator, authority basis, rights status, and review/audit context.
- Unknown facts render as `Not documented`; do not infer dates, outcomes, locations, current status, military service, awards, or relationships.
- Maps are opt-in, attributed, bounded, and have a text equivalent; no guessed coordinates or unsupported administrative coloring.
- Graph results are one-hop, public-only, capped, typed, and accompanied by an equivalent labeled relationship list.
- Comparison accepts at most three public equipment records, deduplicates slugs, compares compatible units only, and never declares an overall winner.
- Do not add dependencies unless the installed package is incompatible with the required behavior; use existing libraries first.
- Use the installed Next.js 16.3.4 conventions and consult `node_modules/next/dist/docs/` before changing route APIs.
- Run the narrow test for each task before the broader suite; retain failing-gate evidence instead of weakening assertions.

---

### Task 0: Register the owner as reviewer and publisher

**Files:**
- Create: `prisma/migrations/20260907090000_add_editorial_principals/migration.sql` through Prisma migration tooling.
- Modify: `prisma/schema.prisma`, `src/lib/auth/editor.ts`, `src/auth.ts`, `src/lib/review/service.ts`, `src/lib/publication/service.ts`, `src/app/admin/layout.tsx`.
- Create: `src/lib/auth/roles.ts`, `src/lib/auth/principals.ts`, `tests/unit/editorial-roles.test.ts`, `tests/integration/editorial-principal.test.ts`.
- Modify: `.env.example`, `docs/MANUAL_WORK_AND_REQUIRED_INPUTS.md`, `progress_tracker.md`.

**Interfaces:**
- `EditorialRole = "REVIEWER" | "PUBLISHER"`.
- `EditorialPrincipal` stores `displayName`, `email`, `issuer`, nullable `subject`, `rolesJson`, `active`, `createdAt`, `updatedAt`.
- `getEditorialPrincipal(identity: { issuer: string; subject: string }): Promise<{ displayName: string; email: string; roles: EditorialRole[] } | null>`.
- `requireEditorRole(role: EditorialRole): Promise<EditorSession>` checks the current allow-list and active principal on every call.

- [ ] **Step 1: Write the failing role tests.** Assert that a pending Puneeth record has both roles but no subject cannot authorize; a matching issuer/subject authorizes review and publish; a mismatched subject, inactive principal, or missing configuration is denied; reviewer cannot publish and publisher cannot review unless both roles are present.
- [ ] **Step 2: Run the focused tests and verify they fail.** Run `npx vitest run --config vitest.config.mts tests/unit/editorial-roles.test.ts tests/integration/editorial-principal.test.ts`; expected failure is missing principal/role APIs.
- [ ] **Step 3: Add the schema and safe seed path.** Add the principal model and an idempotent fixture/administrative configuration record for display name/email/roles with `active = false` and `subject = null`. Do not put a client secret or guessed subject in source control.
- [ ] **Step 4: Implement authorization and audit context.** Extend the session identity with principal display metadata, require exact role checks, and make review/publish services reject insufficient roles before mutations. Persist the principal identity in existing audit fields without exposing secrets.
- [ ] **Step 5: Configure the owner contract.** Add `EDITOR_PRINCIPALS` example JSON to `.env.example` showing the owner record and a blank/explicitly missing subject; document that the actual provider subject must be set through the deployment secret manager.
- [ ] **Step 6: Run focused and auth regression tests.** Expected: role tests pass, existing deny-all auth tests pass, and no public route becomes accessible with only the email address.
- [ ] **Step 7: Run `npm run typecheck`, `npm run lint -- --quiet`, and `npm run test:integration`.** Record the migration and test evidence in `docs/verification/2026-09-07/T08/`.

### Task 1: T16 focused discovery homepage

**Files:**
- Modify: `src/app/page.tsx`, `src/lib/repositories/collections.ts`, `src/lib/navigation.ts`.
- Create: `src/components/HomeSearch.tsx`, `src/components/FeaturedCollection.tsx`, `tests/e2e/home.spec.ts`.

**Interfaces:**
- `getFeaturedCollection(): Promise<{ slug: string; title: string; description: string; href: string } | null>` reads the finite collection manifest and verifies at least one public entity.
- Reuse the existing `GlobalSearch` behavior and public collection links; do not create a second search implementation.

- [ ] **Step 1: Write the home E2E tests.** At desktop and 375px mobile widths, assert that purpose, search entry, and real collection links are visible without scrolling through a branding-only screen; assert no links point to nonexistent `/people` or legacy routes; assert an empty public database shows “The archive is being built” plus working Browse and Sources links.
- [ ] **Step 2: Run `npm run test:e2e -- tests/e2e/home.spec.ts` and verify the new assertions fail against the current hero.**
- [ ] **Step 3: Implement the concise hero, visible search, three-or-fewer subject choices, and data-backed featured collection.** Keep one browse CTA and one search CTA, preserve the shared header/footer, and remove duplicate archive actions.
- [ ] **Step 4: Run the focused E2E test in desktop and mobile projects.** Expected: PASS with no fake counts or dead links.
- [ ] **Step 5: Run `npm run build` and update `docs/verification/2026-09-07/T16/implementation.md` and `progress_tracker.md`.**

### Task 2: T17 source library and provenance

**Files:**
- Modify: `src/app/archive/page.tsx`, `src/app/archive/[slug]/page.tsx`, `src/components/ProvenanceViewer.tsx`, `src/components/BadgeComponents.tsx`, `src/lib/repositories/entities.ts`, `src/lib/repositories/evidence.ts`.
- Create: `src/lib/repositories/sources.ts`, `tests/integration/sources.test.ts`, `tests/e2e/sources.spec.ts`.

**Interfaces:**
- `listPublicSources(query: CollectionQuery): Promise<CollectionPage<SourceListItem>>` filters/paginates public `Source` rows by source type, publisher, and publication date.
- `getPublicSourceBySlug(slug: string): Promise<PublicSourceDetail | null>` includes public versions, evidence locators, linked public entities, rights-safe quote state, and canonical/original URLs.

- [ ] **Step 1: Write integration tests for public-source filtering, pagination, draft/candidate/rejected exclusion, all evidence items, and private entity link exclusion.**
- [ ] **Step 2: Write E2E tests for archive list → source detail, keyboard disclosure, source URL semantics, unavailable quote text, and empty library.**
- [ ] **Step 3: Run the focused integration/E2E tests and verify failures.**
- [ ] **Step 4: Implement source repository DTOs and source detail rendering.** Replace legacy `SourceRecord` assumptions only where canonical `Source` rows exist; keep legacy rows draft unless identity equivalence is proven.
- [ ] **Step 5: Replace clickable provenance containers with `<button aria-expanded aria-controls>`, show every relevant public evidence item, and hide quotes unless `rightsSafeToDisplay` is true.**
- [ ] **Step 6: Add correction guidance with a copyable page ID and configured contact link; do not render a dead submit action.**
- [ ] **Step 7: Run tests, typecheck, lint, and build; record T17 evidence.**

### Task 3: T18 sourced people and equipment detail pages

**Files:**
- Modify: `src/app/heroes/[slug]/page.tsx`, `src/app/arsenal/[slug]/page.tsx`, `src/lib/repositories/entities.ts`, `src/components/ArticleLayout.tsx`, `src/components/ArticleBody.tsx`.
- Create: `src/components/FactList.tsx`, `src/components/EvidenceLink.tsx`, `tests/e2e/detail-pages.spec.ts`.

**Interfaces:**
- `FactList` accepts typed rows `{ label: string; value: string; href?: string; asOf?: string; evidence?: EvidenceSummary[] }[]` and renders absent values as `Not documented`.
- Detail DTOs expose reviewed fields only and never expose raw storage paths, reviewer notes, rejected claims, or candidate relationships.

- [ ] **Step 1: Write E2E cases for one-date people, unknown equipment specs, long titles, absent media, source links, and private/candidate records.**
- [ ] **Step 2: Run the focused tests and confirm missing behavior.**
- [ ] **Step 3: Implement shared fact/evidence presentation.** People must show independently available birth/death dates, reviewed rank/service/decorations, units, and documented participation. Equipment must show domain, role, variant, status with as-of context, development model, and normalized specs.
- [ ] **Step 4: Add rights-aware media slots only for complete Media DTOs; otherwise render no misleading substitute image.**
- [ ] **Step 5: Add grouped related-topic links with bounded pagination/“See all” behavior.**
- [ ] **Step 6: Run detail E2E, integration publication/privacy tests, typecheck, lint, and build; record T18 evidence.**

### Task 4: T19 conflict and operation chronology

**Files:**
- Modify: `src/app/conflicts/page.tsx`, `src/app/conflicts/[slug]/page.tsx`, `src/app/operations/page.tsx`, `src/app/operations/[slug]/page.tsx`, `src/components/InteractiveConflictViewer.tsx`, `src/components/InteractiveMapLayout.tsx`, `src/components/ui/Timeline.tsx`, `src/components/ui/VerticalTimeline.tsx`, `src/lib/domain/dates.ts`.
- Create: `tests/e2e/timeline.spec.ts`, `tests/integration/chronology.test.ts`.

**Interfaces:**
- `formatHistoricalDate(value: string, precision: HistoricalDatePrecision): string` and `historicalOrderKey(value, precision): number` are the only display/order helpers.
- Explorer URL state is `view=explorer&event=<public-event-id>`; invalid event IDs resolve to overview without throwing or stealing focus.

- [ ] **Step 1: Write date regression tests for month/year/unknown precision, missing end dates, ordering, and no “ongoing” inference.**
- [ ] **Step 2: Write E2E tests for canonical links, timeline keyboard navigation, URL refresh/back state, overview fallback, and mobile overflow.**
- [ ] **Step 3: Run focused tests and confirm failures.**
- [ ] **Step 4: Implement chronology from stored reviewed records only.** Show conflict context, dated milestones, operations/events, outcomes, related people/equipment, and source links; remove generic/synthetic narratives.
- [ ] **Step 5: Make explorer opt-in and component-scoped.** Use labeled buttons, one mobile pane, bounded columns, and no global custom event scroll spy.
- [ ] **Step 6: Run chronology tests, browser tests, typecheck, lint, and build; record T19 evidence.**

### Task 5: T20 deliberate maps and asset validation

**Files:**
- Modify: `src/components/ClientOperationMap.tsx`, `src/components/OperationMap.tsx`, `src/components/ForcesMap.tsx`, `src/components/ForcesMapWrapper.tsx`, `src/components/WarRoomMap.tsx`, `src/components/InteractiveConflictViewer.tsx`.
- Create: `src/lib/domain/location.ts`, `scripts/validate-assets.ts`, `public/maps/manifest.json`, `tests/unit/assets.test.ts`, `tests/e2e/maps.spec.ts`.

**Interfaces:**
- `parseLocation(input): Location | null` returns coordinates, precision, source URL, and as-of date; it returns null for missing/invalid values.
- `MapManifest` records provider, attribution text, source/license, asset path, byte budget, and simplification command.

- [ ] **Step 1: Write MAP-01 tests asserting no tile/GeoJSON request before activation, visible text locations, missing-coordinate fallback, and provider-error retry.**
- [ ] **Step 2: Add asset validation tests for every checked-in GeoJSON file, maximum size, valid JSON geometry, and manifest attribution.**
- [ ] **Step 3: Run focused tests and confirm failures.**
- [ ] **Step 4: Implement explicit “Show map” activation using dynamic imports; keep text location lists visible before and after activation.**
- [ ] **Step 5: Apply precision/source/as-of metadata, fit multiple markers, respect reduced motion, restore attribution, and show a retry/error fallback.**
- [ ] **Step 6: Validate existing assets and remove only confirmed unused 404 references; do not invent polygons or jurisdiction colors.**
- [ ] **Step 7: Run map unit/E2E tests, typecheck, lint, build, and record request/asset evidence in T20 docs.**

### Task 6: T21 scoped graph exploration

**Files:**
- Modify: `src/app/api/graph/route.ts`, `src/components/GraphExplorer.tsx`, `src/components/ConnectionExplorer.tsx`, `src/app/graph/page.tsx`.
- Create: `src/lib/repositories/graph.ts`, `tests/integration/graph.test.ts`, `tests/e2e/graph.spec.ts`.

**Interfaces:**
- `getPublicGraphNeighborhood(seed: EntityRef, options: { limit: number }): Promise<{ seed: GraphNode; nodes: GraphNode[]; edges: GraphEdge[]; truncated: boolean }>` validates the typed seed, loads one-hop GOLD/public relationships, caps output, preserves direction/predicate/date, and never returns private endpoints.
- Graph page selection is URL state `type=<EntityType>&id=<canonical-id>`.

- [ ] **Step 1: Write integration tests for missing/private seeds, public one-hop edges, edge evidence, limit/truncation, and a synthetic neighborhood over 100 nodes.**
- [ ] **Step 2: Write E2E tests for topic selection, URL refresh/back, labeled relationship list, loading/empty/error/retry states, and mobile canvas resizing.**
- [ ] **Step 3: Run focused tests and confirm failures.**
- [ ] **Step 4: Implement typed graph repository and route validation; return 400 for malformed seed and 404/empty for absent/private seed, never a full-database dump.**
- [ ] **Step 5: Replace mount-wide fetch with topic selection, cancellation, capped responses, and text-equivalent links.**
- [ ] **Step 6: Measure canvas with ResizeObserver, keep controls inside the container, and respect reduced motion.**
- [ ] **Step 7: Run graph tests, related publication regressions, typecheck, lint, build, and record T21 evidence.**

### Task 7: T22 equipment comparison

**Files:**
- Modify: `src/app/compare/page.tsx`, `src/app/arsenal/page.tsx`, `src/app/arsenal/ArsenalFilters.tsx`, `src/lib/repositories/collections.ts`.
- Create: `src/lib/domain/compare.ts`, `src/components/CompareTray.tsx`, `src/components/ComparisonTable.tsx`, `tests/unit/compare.test.ts`, `tests/e2e/compare.spec.ts`.

**Interfaces:**
- `normalizeComparisonSlugs(slugs: string[]): string[]` trims, deduplicates, and caps at three.
- `buildComparisonHref(slugs: string[]): string` returns `/compare?items=<encoded-slug-list>` with deterministic ordering. The page accepts the earlier `systems` spelling as a compatibility alias while all new links use `items`.
- `getPublicComparison(slugs: string[]): Promise<ComparisonResult>` resolves only public equipment and returns missing/unavailable systems separately.

- [ ] **Step 1: Write unit tests for dedupe, max-three, deterministic URL, incompatible/missing units, and `Not documented` values.**
- [ ] **Step 2: Write E2E tests for add/remove/clear/compare, direct URL, refresh/back, unavailable/private slugs, keyboard operation, semantic table headers, and mobile overflow.**
- [ ] **Step 3: Run focused tests and confirm failures.**
- [ ] **Step 4: Implement explicit comparison controls separate from card links, a tray with count/remove/clear, and URL state that reconstructs after refresh.**
- [ ] **Step 5: Implement a semantic comparison table with compatible units only, variant context, source links, and no overall score/winner.**
- [ ] **Step 6: Enforce the public repository predicate and states for zero, one, unavailable, and more-than-three inputs.**
- [ ] **Step 7: Run comparison tests, publication/privacy regressions, typecheck, lint, build, and record T22 evidence.**

### Task 8: T16–T22 release verification and documentation

**Files:**
- Modify: `progress_tracker.md`, `docs/implementation-plan.md`, `README.md`.
- Create: `docs/verification/2026-09-07/T16/` through `T22/` implementation evidence and screenshots where accepted.

- [ ] Run `npm test`, `npm run test:components`, `npm run test:integration`, `npm run typecheck`, `npm run lint -- --quiet`, `npm run build`, `npm run test:e2e`, `npm run validate:content`, and `npm run validate:database` independently.
- [ ] Run map asset validation and candidate import validation/dry-run against the isolated database; prove `prisma/dev.db` was not changed by candidate imports.
- [ ] Inspect 375px, 768px, 1024px, and 1440px browser states, keyboard traversal, reduced motion, and text equivalents for map/graph.
- [ ] Update each task status only from linked evidence; keep T08 real-provider activation and T26 source/evidence publication gaps explicit.
- [ ] Run `git diff --check` and inspect the final changed-file list for unrelated deletions or generated secrets.
