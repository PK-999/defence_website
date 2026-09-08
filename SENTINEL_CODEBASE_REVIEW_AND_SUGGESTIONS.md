# SENTINEL: codebase review and product suggestions

## Implementation companion — added 6 September 2026

This review is the dated problem statement. Its recommendations are now expanded into an agent-executable documentation set:

- [Ordered implementation tasks T00–T28](docs/implementation-plan.md): dependencies, exact file targets, checklists, commands, gates, stop conditions, and resumption prompt.
- [Canonical implementation contracts](docs/implementation-contracts.md): identity/routes, schema additions, publication/evidence states, authentication, query/search behavior, and UI defaults.
- [Test plan](docs/test-plan.md): isolated test databases, deterministic fixtures, test IDs with expected outcomes, example executable tests, browser/accessibility checks, and release budgets.
- [Data/content operations](docs/content-operations.md): backup/baseline/migration/rollback, import, source capture, editorial review, and repeatable coverage expansion.
- [Current progress tracker](progress_tracker.md): evidence-based statuses replacing unsupported completion claims.

Execute T00 first. Do not infer that a planned task or test file already exists. Preserve the audit findings below as historical evidence; later results belong in the task verification records. Sections 4–10 map to concrete tasks in the implementation plan's traceability table.

---

**Reviewed:** 6 September 2026  
**Goal:** A comprehensive Indian defence destination with rich UI/UX, clear organization, and comfortable reading.  
**Recommendation:** Build a trustworthy, searchable defence encyclopedia with an editorial front door. Make maps, timelines, and connections useful ways to explore a topic, while keeping the default experience simple.

## 1. Overall assessment

The project has a promising structure: distinct routes for conflicts, operations, people, equipment, forces, and sources; reusable interface components; and a database schema that anticipates evidence and relationships. Keep these foundations.

The biggest problem is the gap between what the interface promises and what the underlying content delivers. Verification labels, source-first messaging, detailed-looking maps, and completed roadmap checkboxes currently imply more completeness than the implementation supports. Improving those foundations will contribute more to a rich experience than adding further animation or new sections.

My order of investment would be:

1. **Trust:** distinguish verified content, incomplete records, and demonstration data.
2. **Findability:** fix navigation, unify search, and make collections manageable.
3. **Reading quality:** consistent page templates, readable typography, meaningful illustrations, and accessible interactions.
4. **Depth:** complete one connected topic collection before expanding every domain.
5. **Breadth:** gradually cover institutions, technology, industry, policy, education, and historical material through the same structure.

“Everything” should describe the long-term coverage ambition. It should not mean showing everything on one screen or presenting undocumented facts as known. Your existing [dataset strategy](SENTINEL_EXHAUSTIVE_DATASET_BUILD_STRATEGY.md) already has the right approach: define a coverage universe, track gaps, and publish reviewed material.

## 2. Review scope and evidence limits

This review covered the application routes and APIs, shared components and UI primitives, styling and configuration, Prisma schema and content access, seed/import scripts, Python factory and analytics configuration, content/data directories, public assets, and the existing specifications/progress tracker. Generated datasets were inspected through structural checks, aggregate queries, and representative records; this was not a historical fact-check of every biography or specification. Dependencies, lockfile internals, generated framework output, and binary assets were not audited line by line.

The working tree already contained substantial changes. Findings concern the working copy, including untracked source files, rather than only the last commit. No application code or dataset was changed for this review, and no seed, migration, extraction job, or editorial mutation was executed.

**Visual verification limitation:** the browser connection reported no available browser surfaces. Consequently, there are no screenshots, measured rendered contrast results, or completed browser interaction tests. Layout and accessibility observations below are grounded in source code; responsive and visual recommendations require a later browser pass. Read-only HTTP checks against the existing local development server verified selected route responses, not the complete UX. A production build, production performance test, and full security audit were not performed.

### Current local database snapshot

Read-only queries against `prisma/dev.db` returned:

| Area | Records | Interpretation |
| --- | ---: | --- |
| Conflicts | 7 | All have `Published` status; all narrative bodies are under 100 words. |
| Operations | 20 | All have `Published` status; all narrative bodies are under 100 words. |
| People | 1,967 | 1,857 bodies contain “Biography not available” or “Wikipedia page missing”; 11 normalized full-name groups occur more than once. |
| Equipment | 11 | All marked `Deployed`; the separate Markdown collection has 30 entries, largely demonstration records. |
| Legacy source records | 25 | Representative records are titled `File 1`, `File 10`, etc., pointing to the MoD homepage. |
| Source families / sources / source versions | 0 / 0 / 0 | The new source registry is not populated in this database. |
| Evidence / claims | 0 / 0 | A provenance schema exists, but there is no populated claim-level evidence chain here. |
| Explicit relationships / aliases / media | 0 / 0 / 0 | These capabilities are modeled but unpopulated. |

These are local snapshot counts, not assertions about a deployed database. Duplicate names are candidates for entity resolution, not proof that every pair is the same person.

### Checks run

| Check | Result | What it establishes |
| --- | --- | --- |
| `npx tsc --noEmit --incremental false` | Passed | The present TypeScript project type-checks. |
| `npm run lint` | Failed | `next lint` is interpreted as an invalid project directory in this installed version. |
| Direct ESLint on `src` | 44 errors, 11 warnings across 59 files | Mostly explicit `any`, unescaped JSX text, unused values, plus three effect/state rule errors. |
| `npm run validate:content` | Passed for 83 Markdown files | Checks the legacy Markdown schema, not the runtime database or factual accuracy. |
| Python AST parsing | Passed for the 16 inspected top-level Python scripts | Syntax only; imports, installed dependencies, and execution were not validated. |
| Selected HTTP routes | See findings below | Confirms local response statuses and response sizes. |
| GeoJSON parsing | One valid large file; one invalid file | `india-states.geojson` is ~23 MB; `datameet-india.geojson` contains `404: Not Found`. |

## 3. What is worth preserving

- **Separate subject areas.** Conflicts, operations, people, and equipment are sensible entry points. They can share a knowledge model without sharing identical visual layouts.
- **The existing source/evidence/claim schema.** Extend and connect it to publication rather than starting another content architecture.
- **URL-based filters.** Arsenal and Heroes filters already preserve query parameters, which is useful for sharing and returning to a filtered collection.
- **Server-rendered content and small interactive boundaries.** Much of the application follows this pattern already. Maps and the graph are dynamically imported.
- **Reusable primitives.** The existing Base UI dialog, button, input, and breadcrumb components provide a better foundation than custom interactive `div` elements.
- **The independent educational identity.** The footer communicates the site's status clearly. Retain this alongside more precise sourcing language.
- **The product principles in the master specification.** Its emphasis on readable editorial design and progressive disclosure is stronger than the current implementation's constant green/HUD treatment.

## 4. Highest-priority findings

Priority meanings: **P0** = address before public publication/editorial use; **P1** = next core product milestone; **P2** = refinement or expansion after the basics work. P0 does not mean the prototype must be discarded.

### P0 — Verification and publication are not enforced

**Evidence:** [content access](src/lib/content.ts), [provenance display](src/components/ProvenanceViewer.tsx), [review actions](src/app/admin/review/actions.ts), [coverage dashboard](src/app/admin/coverage/page.tsx), [archive landing](src/app/archive/page.tsx).

- Public entity queries, search, and graph queries do not enforce a common published-content policy.
- `getConflict()` fetches claims without filtering out `CANDIDATE` or `REJECTED` claims. `ProvenanceViewer` calls the whole set “Golden Dataset / Verified Claims” and styles every verification status in green. This is a latent bug: the current database has no claims, but adding candidates or rejected claims would expose the mismatch.
- Approving a claim automatically sets `OFFICIALLY_CONFIRMED`, irrespective of the evidence's origin. Editorial approval and official confirmation are different properties.
- The coverage dashboard counts all claims as “Total Verified Claims” and hardcodes “SOURCE COMPLETE” / “EDITORIALLY REVIEWED” labels.
- `/archive` contains a static, verified-looking report card rather than a query over source records. It has no source link.

**Suggestion:** Centralize the publication policy and apply it to details, listings, search, graph results, and future sitemaps. Separate editorial status from evidence status. Public approved records can still contain an explicitly attributed disagreement; “approved” must not automatically mean “officially confirmed.” Compute coverage labels from actual reviewed records and a defined denominator. Replace database jargon in public pages with plain labels such as “Sources,” “Reviewed on,” and “Conflicting accounts.”

**Done when:** draft/rejected content is absent from public reads; every verification label has supporting evidence; an empty evidence set produces an honest incomplete state.

### P0 — Generated filler is being treated as publishable knowledge

**Evidence:** [forces generator](generate_data.py), [forces data](src/app/forces/forcesData.ts), [people augmentation](factory/augment_people.py), [factory extraction](factory/assets.py), [operation detail](src/app/operations/[slug]/page.tsx).

- Unit mottos and war cries are generated from name templates, and many units receive generic histories and victories. These fields are displayed as facts.
- Forces rank symbols are explicitly mock insignia generated from array positions in [the Forces page](src/app/forces/page.tsx).
- Missing source documents and failed LLM extraction fall back to invented demonstration input/claims. Those candidates can then be attached to an existing source version.
- People augmentation defaults an unknown service to Army, extracts the first matching conflict/year, and uses substring medal matching. For example, searching for `Vir Chakra` inside `Param Vir Chakra` can assign additional awards incorrectly.
- Any operation with an end date receives the narrative “successfully achieves its primary objectives,” regardless of its actual outcome.
- The source rule in [the MoD configuration](factory/config/sources/mod.yaml) treats some official claims as absolute truth rather than recording attribution and scope.

**Suggestion:** Fail closed on missing documents or extraction errors; keep fixtures in an explicitly separate demo mode. Preserve unknown values. Require evidence for mottos, awards, outcomes, dates, and other identity-bearing facts. Use exact award identifiers and service-specific rank identifiers. Remove blanket success narratives and mock insignia from published educational content.

**Done when:** missing information stays unknown, extraction failures produce reviewable failures, and no template-generated historical assertion is published as verified.

### P0 — Editorial actions have no visible authorization boundary

**Evidence:** [admin layout](src/app/admin/layout.tsx) and [claim actions](src/app/admin/review/actions.ts). `/admin/review` returned HTTP 200 without authentication in the local check. No application-level authentication/authorization guard was found for these actions.

**Suggestion:** Require authenticated editor roles inside each server-side mutation, validate the requested state transition, and record reviewer identity, time, reason, and prior value. Add an explicit error result in the review card: it currently ignores the action's `{ success: false }` result. Revalidate affected public content after publication changes, not only the admin queue. Hosting-level access controls, if any, were not assessed.

**Done when:** unauthorized reads/mutations are denied and legitimate approvals create an attributable audit record. No mutation was attempted during this review.

### P1 — Navigation contains dead ends

**Evidence:** [header](src/components/SiteHeader.tsx), [homepage](src/app/page.tsx), [footer](src/components/SiteFooter.tsx), [redirects](next.config.ts), [timeline](src/components/ui/VerticalTimeline.tsx).

- The mobile menu button has no handler, menu state, or menu content.
- The homepage's People card points to `/people`; the actual collection is `/heroes`. `/people` returned 404.
- `/about`, `/methodology`, `/editorial-policy`, `/sources`, `/privacy`, and `/terms` all returned 404 despite footer links.
- Both main homepage buttons lead to `/conflicts`.
- Conflict timeline links still go through `/history/...` and depend on a redirect.
- Primary navigation has no active-page indicator. “Archive” means both the whole product and the source collection.

**Suggestion:** Implement a proper mobile navigation disclosure/dialog; standardize route definitions; add `/people` and descendant redirects if `/heroes` remains canonical; update internal history links directly; complete or remove broken footer destinations. Label `/archive` “Sources & documents.” Give each homepage action a distinct purpose.

**Done when:** every visible navigation link resolves, mobile users can reach every primary section, and current location is apparent.

### P1 — Record volume is overwhelming the collection experience

**Evidence:** [Heroes](src/app/heroes/page.tsx), [Arsenal](src/app/arsenal/page.tsx), [full search](src/app/search/page.tsx), [graph API](src/app/api/graph/route.ts).

Heroes and Arsenal fetch entire tables and filter in application memory. Full search returns all matches without pagination. Heroes renders the complete matching set. `/heroes` returned **4,781,608 bytes (~4.8 MB)** of uncompressed local development HTML; that is not a production transfer-size or timing measurement, but it confirms substantial over-rendering. The graph API returned 2,005 nodes with just 30 links.

**Suggestion:** Add database-side filtering, deterministic sorting, pagination, selected-field queries, and visible result counts. Use a manageable default such as 24 records per page, with compact list view for research. Start graph exploration from a selected entity and fetch a limited neighborhood; expand on demand.

**Done when:** a large dataset does not force the user to load or scroll through thousands of entries to find one person.

### P1 — Search promises more than it supports

**Evidence:** [search API](src/app/api/search/route.ts), [search page](src/app/search/page.tsx), [search dialog](src/components/GlobalSearch.tsx).

The API supports alias lookup, but the full search page does not. Both omit source documents and the hardcoded forces/units. There is no relevance ranking or stable ordering; the dialog concatenates five results per type. It can display stale responses because requests are not cancelled or sequence-checked, and failures can look like “no results.” Alias lookup is outside the API's error boundary. The current alias table is empty, so alias matching is implemented but not delivering value yet.

**Suggestion:** Use one search service for quick and full search. Normalize whitespace, support known abbreviations and alternative names, rank exact names/aliases first, and paginate results. Include sources and modeled units. Distinguish loading, no match, unavailable data, and network error. Add keyboard selection and properly labeled inputs. Change “Type a command” to a content-search prompt unless commands are implemented.

**Done when:** a query returns consistent results in both surfaces, a quickly edited query never shows stale matches, and failed requests offer retry.

### P1 — Relationships are inferred from labels instead of supported links

**Evidence:** [content access](src/lib/content.ts), [schema](prisma/schema.prisma), [graph API](src/app/api/graph/route.ts).

`getConflict()` matches `Person.conflict` against the exact conflict title instead of the existing relation. Only 12 people match any conflict title in the current database; labels such as `1971 Indo-Pakistani War` differ from the corresponding entity's `Indo-Pakistani War of 1971`. Both person relationship join tables are empty. `getOperation()` treats participation in the parent conflict as enough to connect someone to the individual operation. It also arbitrarily limits people to ten. The graph drops relationship predicates, direction, and temporal context.

**Suggestion:** Resolve canonical IDs at ingestion, review ambiguous matches, and store explicit participation/command relationships with evidence and dates. Keep “associated with the wider conflict” distinct from “participated in this operation.” Label connections by their meaning and let readers access the complete list.

**Done when:** the person → operation → conflict journey follows explicit, attributable relationships and does not change when a display title is edited.

### P1 — Data formats and seeds disagree

**Evidence:** [schemas](src/lib/schemas.ts), [Prisma seed](prisma/seed.ts), [exhaustive import](prisma/seed-exhaustive.ts), [other exhaustive seed](scripts/seed-exhaustive.ts), [golden dataset seed](scripts/seed-golden-datasets.ts), [Arsenal](src/app/arsenal/page.tsx).

- Dates alternate between ISO and `DD-MM-YYYY`; the timeline assumes the year is the third segment.
- Domain values vary between `air`, `Air`, `Sea`, and `Naval`; Arsenal's default sections recognize only a fixed capitalized set. A record may exist but be invisible in the default listing.
- Service statuses vary between `active`, `Active`, `Deployed`, and `Retired`; filters expose only the latter two.
- `status` sometimes represents publication, sometimes service activity, and sometimes a person's life status.
- Specifications can be either arrays or objects, with inconsistent keys and units.
- `kargil-war` and `kargil-1999` are used by different seeds for the same intended subject.
- Multiple seeds clear tables. The default exhaustive seed deletes provenance tables before importing entities, potentially removing previously reviewed evidence.

**Suggestion:** Establish canonical vocabularies, ISO storage dates with precision metadata for partial dates, stable IDs, and one validated import path. Preserve original source strings separately. Normalize legacy values through an explicit migration. Treat family/model/variant and ship class/individual ship as distinct where needed. Make import replay idempotent and transactional; keep database reset commands separate from normal imports.

**Done when:** changing seed entry points cannot silently alter taxonomy, erase reviewed evidence, or hide otherwise valid records.

### P1 — Important promised experiences remain placeholders

**Evidence:** [Compare](src/app/compare/page.tsx), [Archive](src/app/archive/page.tsx), [admin equipment](src/app/admin/equipment/page.tsx), [admin conflicts](src/app/admin/conflicts/page.tsx), [progress tracker](progress_tracker.md).

Comparison ignores selected items and renders three empty slots; Arsenal offers no selection flow. Admin New/Edit buttons have no implemented behavior. The archive landing is a static card. The progress tracker marks comparison, source filtering, reduced motion, accessibility, and golden datasets complete despite these gaps.

**Suggestion:** Finish or explicitly hide incomplete public interactions. Replace binary completion checkboxes with `planned / scaffolded / functional / verified`, supported by acceptance evidence. Reconcile the current database architecture with documentation that still describes a Markdown-only product.

## 5. Organize comprehensive coverage without clutter

### Recommended information architecture

Use a small number of recognizable hubs. Deep categories belong inside a hub or in search filters.

| Primary hub | Contents | Existing material to build upon |
| --- | --- | --- |
| **Explore** | Curated collections, beginner starting points, a few featured stories | Homepage and existing collection routes |
| **History** | Conflicts, campaigns, battles, operations, peacekeeping, humanitarian missions, timelines | `/conflicts`, `/operations` |
| **Forces & people** | Services, organization, ranks, units, biographies, awards | `/forces`, `/heroes` |
| **Equipment & technology** | Equipment by domain and role, variants, development programmes, comparisons | `/arsenal`, `/compare` |
| **Knowledge & sources** | Explainers, terminology, documents, evidence, research guides; later policy and industry context | `/archive`, future learning pages |

Keep search visibly available across all hubs. Put the full graph under Explore or relevant entity pages, with a descriptive name such as “Explore connections.” It need not occupy a permanent top-level slot.

This is a proposed navigation grouping, not a requirement to rename every route. First repair the current links; introduce hub pages when enough real material exists to justify them.

### Coverage beyond the current history archive

The current descriptor and routes primarily serve military history. To meet your broader ambition, maintain a coverage matrix for these areas:

| Coverage area | Useful reader questions | Suggested timing |
| --- | --- | --- |
| Organization and people | How do ranks, commands, regiments, and awards fit together? | Core expansion |
| History and missions | What happened, why, who participated, and what evidence survives? | Initial flagship |
| Equipment and technology | What is this system's role, which variant is described, and how did it develop? | Core expansion |
| Industry and research | Which organizations design/build systems, and how are programmes related? | After entity/source foundations |
| Policy, budgets, and procurement | What does a policy or allocation mean, and what changed in a particular year? | Later, with editorial ownership and dated sources |
| Education and careers | What are the basic concepts, institutions, and official entry routes? | Later learning collection; time-sensitive details link to current official notices |
| Heritage and media | Where can readers find museums, memorials, oral histories, photographs, and documents? | Later, with rights and source metadata |
| Public developments | Which official announcements update an existing topic? | Optional dated updates, linked to canonical topic pages |

Keep institutional categories explicit rather than putting every uniformed organization under a generic “Army” label. The dataset strategy already calls for distinct treatment of Armed Forces, Coast Guard, and CAPFs.

For each collection, track definition, included/excluded record types, known records, sourced records, reviewed records, open gaps, owner, and last review date. A database count alone cannot establish completeness.

### The mechanism that keeps the site simple

Every entity should have one canonical page. Collections, timelines, maps, and search point to that page. Each page initially answers three questions: **What is this? Why does it matter? Where can I go next?** Specifications, extended chronology, and evidence can be progressively disclosed.

Avoid a second biography under a conflict, a separate biography under an award, and another under a unit. Reuse the same person record with context-specific links.

## 6. Concrete UI/UX direction

### Homepage: a useful front door

The current `min-h-[85vh]` hero spends most of a screen on branding, with browse destinations below it. Suggested content order:

1. A concise title and plain-language description of what readers can find.
2. A prominent search box with example subjects drawn from the actual database.
3. A compact set of subject entry points.
4. One well-produced featured story or collection.
5. A short “Start here” learning path and a small recently reviewed section.
6. A clear link explaining sources and corrections.

Keep this curated. Do not add a live ticker, large statistics wall, autoplay, or a feed from every department. Show record counts only where they help someone choose a collection, and distinguish indexed from reviewed counts.

### Collection pages: browsing should work before animation

- Use a shared pattern: title → one-sentence description → search/filter controls → result count/sort → results → pagination.
- Allow compact list and illustrated card views where appropriate.
- Show active-filter chips and a clear-all action. Changing an Arsenal domain should clear an incompatible category instead of preserving an impossible combination.
- Distinguish **domain** from **service**. “Air” is a domain; it should not be labeled “Branch.” Equipment may be used by more than one service.
- Derive valid service-status options from canonical values, including development and retired states.
- For people, prefer an understandable default such as alphabetical or editorially featured. If rank ordering is offered, use exact service-aware ranks: the current substring match lets `General` match `Lieutenant General` prematurely.
- Show useful summary text without requiring an accordion click just to reveal a link. Provide a real title link on timeline entries.

### Entity pages: one familiar reading structure

Suggested common anatomy:

```text
Breadcrumbs
Title + short introduction + concise fact summary
Optional sourced image with caption and credit
Overview | History/timeline | Related topics | Sources

Readable narrative with headings and inline reference links
Relevant interactive map/timeline, when it adds understanding
Related records with the relationship explained
Sources, review date, correction link
```

Use anchored sections for normal reading so the page remains searchable, linkable, and printable. Reserve tabs for genuinely alternative views. On desktop, an unobtrusive contents rail can help; on mobile, use a compact “On this page” disclosure.

Specific changes:

- **People:** always retain a short introduction even when a biography exists; show sourced service/rank, awards with citations, and related units/events. The current detail page omits much of the metadata already available in the listing.
- **Equipment:** prioritize role, variant, service history, normalized specifications, imagery, and source notes. Distinguish combat radius, ferry range, and other measures in the data before attempting comparison.
- **Conflicts:** open with context and a short overview, then timeline/operations and outcomes. Offer the three-pane explorer as a deliberate view rather than requiring it for basic reading.
- **Operations:** use actual documented milestones, objectives, outcomes, and participants. Unknown outcomes should remain unknown.
- **Sources:** provide a real library with title, publisher, date, document type, linked topics, original/archived URL, and a locator where relevant.

### Visual language: keep the identity, improve reading comfort

The existing dark palette, typography roles, and subtle technical cues can work. The current global grid, scan line, neon text, HUD borders, scrambling headings, and route transitions apply the same emphasis everywhere.

Suggested design choices, subject to rendered testing:

- Use a quiet dark background and solid reading surfaces; reserve green for selected controls and limited accents.
- Prefer sentence case for titles and prose. Reserve spaced uppercase and monospace for short labels, dates, or specifications.
- Aim for roughly 65–75 characters per narrative line, comfortable body sizing, and generous line height.
- Add well-chosen, credited photographs, diagrams, historical documents, or annotated illustrations. A small number of relevant images will add more depth than repeating glowing panels.
- Offer a light/reading theme eventually; the root currently forces `dark` and defines no separate light palette.
- Remove the continuous scanner from normal reading. Restrict decorative animation to brief, optional emphasis.
- Render heading text immediately: `ScrambleText` initially contains an empty string, so headings are empty until client effects run.
- Audit token completeness. Components refer to colors such as `input`, `popover`, `destructive`, and `accent`, while the custom theme maps only part of the token set. Admin coverage also uses a separate set of undefined custom properties. Verify computed styles before declaring the precise visual effect.
- Render content as structured paragraphs/headings or through a safe Markdown renderer. Several detail pages currently insert Markdown-bearing strings as plain React text; adding a `prose` class does not parse Markdown, and no typography plugin is declared.

### Maps and timelines: explain the subject

`InteractiveConflictViewer` has an 800px fixed-height outer layout, nested scrolling, a minimum 300px middle column, and a minimum 400px map. This needs mobile verification; stacking the same desktop structure risks crowding or clipped content.

On small screens, use a single reading column and switchable timeline/map views. Keep selected events linkable in the URL. Provide a text list covering the same information as map markers. Use meaningful fit-to-bounds/default zoom rather than a close zoom for every location, including a missing-location fallback.

`india-states.geojson` is approximately 23 MB and is fetched by ForcesMap. Simplify geometry, load only when the map is needed, and verify whether national-level historical exploration requires state-boundary detail at all. The unused `datameet-india.geojson` is an error response saved as data; remove or replace it through a validated asset process.

State fills in ForcesMap choose the first service color encountered for overlapping areas. This can imply a clean division of responsibilities that the data does not establish. Label the view's meaning, use dated sources, and avoid presenting illustrative coverage as exact jurisdiction. Add source/precision metadata to locations rather than displaying four decimal places indiscriminately. `OperationMap` disables the attribution control despite supplying attribution text; keep applicable map credits visible and review provider requirements.

## 7. Accessibility and responsive acceptance criteria

These are code-observed gaps and proposed checks, not a conformance certification:

- Convert clickable `div` elements in VerticalTimeline, ProvenanceViewer, and unit cards into buttons/links with visible focus and appropriate expanded state.
- Use the existing dialog primitive for the unit modal, with a title, focus management, Escape handling, focus return, and a labeled close button.
- Give timeline arrow buttons accessible names. Give search inputs and selects explicit labels rather than relying on placeholders.
- Add a skip-to-content link. Avoid the nested main landmark introduced by the admin layout inside the root layout's `main`.
- Provide textual access to graph relationships; canvas node clicking is not an adequate sole navigation method.
- Honor reduced-motion preferences across scrambling text, route transitions, map fly-to, and timeline animations.
- Test keyboard-only operation, zoom/reflow, touch targets, screen-reader names/status announcements, and contrast on the actual composited backgrounds.
- Test 320/375/768/1024/1440px widths, long titles, large text, empty results, many results, and slow/failed requests. Pay particular attention to the fixed-width desktop header and the non-wrapping search form.

Use WCAG 2.2 AA as an acceptance target: normal text contrast of at least 4.5:1, meaningful reflow, operable controls, and clear focus are relevant here. These requirements and their exceptions should be checked against the [W3C WCAG 2.2 specification](https://www.w3.org/TR/WCAG22/). For continuous automatic motion, review the [W3C pause/stop/hide guidance](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html); removing decorative persistent motion is the simplest product choice.

## 8. Engineering and content architecture suggestions

### Choose one authoritative publication path

Today there are parallel content systems: Markdown under `content/`, JSON under `data/` and `factory/data/`, a SQLite database, hardcoded Forces arrays, and two source models. This makes it difficult to know which edit changes the website.

Keep the current application and relational foundation. Make the database the explicit public read model, with one validated ingestion path. Treat raw source snapshots and import files as inputs, not competing live stores. Document the relationship between `SourceRecord` and `Source → SourceVersion → Evidence`, then migrate the old source records deliberately. Add stable source IDs and provenance to units, which currently bypass the database entirely.

### Finish validation where data enters and leaves the system

- Validate canonical enums, date precision, JSON fields, units, references, URL schemes, and source locators before import.
- Use the declared extraction schemas to validate LLM output; currently `ExtractionResult` and related classes are defined but the raw decoded dictionary is used directly.
- Confirm quoted evidence actually occurs in the captured source and retain a source-content hash/parser version.
- Avoid attaching extracted claims to whichever source version happens to be returned first.
- Deduplicate using external identity plus reviewed aliases, not only a name-derived slug. Preserve multiple awards when a source returns multiple rows for a person.
- Make validation failures exit nonzero. The legacy validator currently logs errors but deliberately permits success exit, and it supplies missing source/status fields by default.
- Validate the database projection, not only the 83 legacy Markdown files. Schema-valid `System 1` and a homepage URL are not sufficient editorial content.

### Keep infrastructure proportional

Next.js plus a relational database is sufficient for the next milestone. The current graph does not require a separate graph database. Introduce a dedicated search service only when measured relevance, language, or scale needs justify it.

The Python factory can be useful later, but first make one document → candidate claim → review → published page workflow reliable. Its entry point currently prints a greeting; scraping imports several packages absent from `pyproject.toml`; dbt configuration includes duplicated starter configuration and sample models. Clean and document this path before treating it as a production content factory. These are source/config observations; no factory dependency installation or dbt execution was attempted.

### Repair the developer feedback loop

Replace the broken lint script with direct ESLint invocation, and run type-check, lint, database/content validation, focused behavior tests, and build as independent CI gates. The installed Next.js guide uses the ESLint CLI; this agrees with the current [official Next.js ESLint documentation](https://nextjs.org/docs/app/api-reference/config/eslint).

Useful regression tests would cover publication filtering, date normalization, duplicate resolution, exact award/rank matching, search consistency, incompatible filters, navigation redirects, and unauthorized editorial mutations. Avoid spending effort on tests that only restate static card markup.

Add appropriate loading, error, not-found, and retry experiences. The source tree has no custom route-level loading/error/not-found files. Search and graph failures currently have weak recovery. Add entity-specific metadata, canonical URLs, sharing previews, and a sitemap containing only public records; currently metadata is global. Verify the installed Next.js documentation before implementing caching or metadata changes. Define how an editorial update invalidates detail pages and lists, since the app mixes dynamic listings and statically enumerated detail routes.

Document the database setup, canonical seed/import command, backup/restore procedure, environment variable names, and content review workflow in the README. Preserve existing data during setup. Keep logs, Python bytecode, temporary editor files, and invalid downloads out of source control. Review production database storage and runtime Prisma dependency installation when choosing a deployment target; no deployment architecture was tested here.

## 9. Proposed reader journeys and their current health

These are source/HTTP assessments; browser interaction and screenshots remain unverified.

| Step | Reader task | Current health | Desired result |
| --- | --- | --- | --- |
| 1 | Arrive and choose a topic | Partial | Search and subject choices visible early; distinct calls to action. |
| 2 | Open a collection on mobile | Blocked by implementation gap | Functional menu, labeled filters, count, pagination. |
| 3 | Find a person/equipment by name or alias | Partial | Consistent ranked results and honest missing-data states. |
| 4 | Read a conflict or operation | Partial | Clear introduction, structured narrative, sourced chronology, optional map. |
| 5 | Follow a connection to a participant or system | Weak | Explicit relationship, evidence, and complete linked lists. |
| 6 | Inspect the original evidence | Mostly scaffolded | A real document record and exact supporting locator. |
| 7 | Compare equipment | Placeholder | Two or three actual selected variants, normalized sourced measures. |
| 8 | Return/share/bookmark the current view | Partial | Stable detail URLs and URL state for filters, tabs, and selected events. |

An excellent initial demonstration would be: **Home → Kargil collection → documented operation/event → participant or equipment → supporting source.** Make every step substantive and working before adding more flagship topics.

## 10. Phased implementation roadmap

### Phase A — Establish a truthful, usable baseline

1. Repair mobile navigation, dead links, and route aliases.
2. Remove misleading verification, fabricated outcomes, mock insignia, and generic facts from publishable content.
3. Protect editorial actions and apply a common public-content policy.
4. Normalize dates/statuses/domains and select the canonical ingestion path.
5. Repair lint and validate the actual runtime database.
6. Reclassify scaffolded features in the progress tracker.

**Exit gate:** all public navigation works; incomplete material is identified; publication rules and editorial permissions are enforced; critical data checks can fail the pipeline.

### Phase B — Deliver a comfortable research and reading experience

1. Unify search and paginate the main collections.
2. Establish shared collection/entity templates and readable typography.
3. Implement keyboard behavior, dialog semantics, reduced motion, and mobile layouts.
4. Populate a real Sources library and connect evidence to one curated topic collection.
5. Simplify map data and offer textual alternatives.

**Exit gate:** someone unfamiliar with the project can find a topic, understand it, follow a meaningful connection, and verify a fact on desktop and mobile.

### Phase C — Add depth and distinctive experiences

1. Complete one sourced conflict collection and a small coherent equipment collection.
2. Add credited imagery and structured editorial narratives.
3. Finish equipment selection/comparison with comparable, variant-specific measures.
4. Offer scoped graph exploration and shareable selected-event state.
5. Add meaningful per-entity metadata and share previews.

**Exit gate:** rich interactions reveal useful context without increasing the effort needed for ordinary reading.

### Phase D — Broaden coverage sustainably

Expand organization, awards, industry, technology explainers, policy, heritage, and optional dated developments using coverage matrices and named editorial ownership. Add multilingual support and citation-grounded AI only after the core corpus and source retrieval are dependable.

Defer live feeds, a large account system, 3D viewers, gamification, and additional infrastructure unless a demonstrated user need justifies them. Simple bookmark collections can eventually begin locally without requiring an account.

## 11. Success measures

Track outcomes that represent a useful archive:

- Percentage of public records meeting a documented sourcing/readability standard.
- Coverage against a defined collection universe, separated into indexed, sourced, and reviewed.
- Zero-result queries, successful search-to-detail journeys, and searches for missing subjects.
- Ability of novice users to answer a factual question and locate its source.
- Broken links, duplicate identity candidates, stale dated facts, and unreviewed claims.
- Mobile rendering/interaction performance measured in production and representative devices.
- Keyboard completion of search, filters, timelines, source expansion, and dialogs.

The next release should earn a reader's confidence through a complete, connected journey. More rows and more visual effects can follow once that experience is dependable.
