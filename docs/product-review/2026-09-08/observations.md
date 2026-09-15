# SENTINEL product review and improvement rationale

8 September 2026 · revision `a5cb9ee3aeb819ce9b346d65d5894c19c80a439e` · single-agent review

## Decision

Retain Next.js, React, Prisma and SQLite. Build SENTINEL around an investigator's workflow: receive a briefing, open a dossier, inspect its evidence, follow a connection, compare records, and save a trail. The strongest differentiator is a coherent source-backed Indian defence reference with a restrained intelligence-console identity. A decorative reskin cannot compensate for an unpublished corpus or incomplete discovery.

This pass produces observations, research, design requirements, an implementation plan and corresponding tests. It does not implement the product changes or publish historical records. The [research brief](research.md), [Chrome evidence record](browser-review.md), [implementation plan](implementation-plan.md), and [test specification](test-plan.md) form the handoff.

## Evidence and coverage

Repository began clean. Read recovery plan, contracts, test plan, content operations, tracker, current route/component/repository implementations and relevant tests. Inventoried 77 TSX files; applied the requested React checklist to active shell, discovery, reading, evidence, comparison, graph and map paths and their data dependencies. This is a targeted product/architecture review, not a security certification or a claim that every line of all 77 files received an exhaustive audit. See [file coverage](file-review.md).

Fresh checks: `npm test`: 16 files / 63 tests passed; `npm run test:components`: 1 file / 1 test passed; `npm run typecheck`: exit 0; `npm run lint -- --quiet`: exit 0. These checks do not cover all the behaviors below. Existing E2E evidence was not rerun or represented as fresh evidence.

Read-only SQLite observations: `prisma/dev.db` contains 1,967 draft Person, 7 draft Conflict, 20 draft Operation, 11 draft Equipment, zero Unit and zero Source rows. None of these six entity tables has published rows. The existing server at localhost:3001 renders synthetic fixtures, consistent with T27's documented `.test-data/e2e.db` setup. Fixture records explicitly identify themselves as synthetic. No original database changes were made.

Chrome navigation and accessibility-state inspection worked in part. All three screenshot attempts showed blank page content and were rejected. Search text entry could not be verified through Computer Use. That was the 8 September outcome. On 9 September, one Equipment screenshot was accepted and reviewed in the [resumed visual audit](visual-audit-2026-09-09.md); subsequent captures failed again. The findings table below remains source-based unless the resumed audit supplies visual corroboration. The complete flow audit remains blocked. No mobile, zoom, screen-reader, timing or contrast certification is claimed.

## Prioritized observations

Severity: P0 = blocks trustworthy public launch; P1 = core journey failure; P2 = quality/scale improvement. Evidence: C = source inspected; A = current Chrome accessibility state; D = read-only database; H = hypothesis needing user/visual testing.

| ID | Priority / evidence | Observation and exact implementation evidence | Improvement and reason | Plan |
|---|---|---|---|---|
| O01 | P0 D/A | Original corpus is all draft; local preview is fixtures. Homepage has no featured reviewed collection. | Publish one connected reviewed collection through existing accountable workflow before broad expansion. Distinguish preview/candidate/public environments clearly. Real depth creates usefulness. | P01,P09 |
| O02 | P0 C | `search/service.ts:searchArchive` returns SearchDocument rows without current-public entity hydration. A stale projection can remain discoverable. | Enforce publication in ranked query/hydration and withdrawal tests; never trust index existence as current publication authority. | P03 |
| O03 | P1 C | Search applies `take:500` in alphabetical order before ranking; counts and results omit later matches. Full page exposes no pagination and does not consume page. | Rank/count in SQLite before pagination; test exact matches beyond 500; add reachable result pages. Avoid false absence as the archive grows. | P03 |
| O04 | P1 C | `SiteHeader` and `HomeSearch` each mount `GlobalSearch`; each installs Cmd/Ctrl+K listener and the same results ID. | One search owner, two triggers, unique IDs and focus return. One keyboard command must open one dialog. | P02 |
| O05 | P1 C | GlobalSearch lacks input label/active descendant, active-index reset and selected-row styling; effects run while closed; fetch is not passed the created abort signal; debounce can briefly show empty state. | Explicit search states, actual signal, stale-response guard, cancellation on close/short query, accessible keyboard selection and retry. | P02 |
| O06 | P1 C/A | Conflict page always mounts `InteractiveConflictViewer`; fixed `h-[800px]`, stacked panes and minimum widths contradict default reading/mobile contracts. Chrome detail exposes the explorer without a view parameter. | Server-rendered dossier default; opt-in explorer; one pane below 1024px with Briefing/Timeline/Map controls. Makes long accounts readable and fast. | P05 |
| O07 | P1 C | Conflict page reparses dates as DD-MM-YYYY by reversing ISO segments. Raw JSON.parse coordinates bypass canonical parsing. | Use date precision and validated location adapters; test ISO/partial/invalid values and never invent chronology or coordinates. | P04,P05 |
| O08 | P0 C | `ProvenanceViewer` paints every status green with a check icon, uses single underscore replacement, omits `editorialExplanation`. Explorer calls any reference URL “OFFICIAL DOCUMENTATION”. | Shared status treatment: confirmed green, disputed/conflicting amber with explanation; source title and authority remain factual. Spy styling must not confer evidence status. | P04 |
| O09 | P1 C | Unit detail renders text and facts but no evidence/relationships; operation detail also omits provenance display. Equipment specs omit per-field evidence. | Shared dossier contract with summary, facts, narrative citations, provenance and next links across all entity types. | P04,P05 |
| O10 | P1 C | `parseCollectionQuery` accepts first duplicate key, scientific numeric syntax and arbitrary filter strings; repository ignores computed sort and returns empty invalid arrays. | One typed normalizer, recoverable invalid state, real sort, canonical URL and fixed 24-page size. Controls must agree with results. | P03 |
| O11 | P1 C | `CollectionToolbar` pushes a route per keystroke with input tied to URL. Filter chips expose raw keys. | Local draft input plus submit/debounce and replace; readable chip labels; preserve Back and reset page. Prevent typing from becoming navigation churn. | P03,P06 |
| O12 | P1 C | Compare page normalizes/truncates >3 records, double-decodes values, picks first repeated key; zero/one selection cannot add a new system from its own options. | Validated shareable 2–3 selection workflow, in-page add/search, explicit excess-input recovery, unknowns retained. | P07 |
| O13 | P1 C | Graph topic chooser includes only first 8 conflicts/operations/people; a valid deep link outside that set is rejected by the client. No equipment/unit/source choices. | Search-backed seed selector, resolve URL seed independently, all six entity types, clickable text edges with evidence. | P07 |
| O14 | P1 C | Graph cap is applied after `getPublicRelationships` fetches all matching edges and sequentially hydrates endpoints/evidence. | Bound database work before payload construction; batch public endpoint/evidence reads. A capped response alone is not bounded cost. | P07 |
| O15 | P2 C | Graph ResizeObserver runs before the graph div exists and depends on selection; loaded data does not reliably trigger attachment. Graph arrays rebuilt each render; text edges use repeated find. | Attach observer to mounted canvas, stabilize graph DTO, map node keys once; verify resize after async data. Avoid blanket memoization. | P07 |
| O16 | P1 C | Map flyTo and timeline smooth scroll/Framer Motion do not consult reduced-motion preference; CSS cannot reliably govern JS animation. Timeline arrow buttons unnamed. | Motion policy shared by JS and CSS; setView/instant scroll when reduced; accessible action labels. | P05,P06 |
| O17 | P2 C/H | Green shell uses gold/blue graph/map constants and mixed radii; input/popover/accent/destructive token mappings missing from local theme. | Complete semantic tokens and reuse them across dialogs/badges/maps/graph; confirm composited contrast in real screenshots. | P06 |
| O18 | P1 C/A | Navigation says Equipment while homepage says Arsenal; Graph leads to Connection Explorer; details expose Connected Node and developer wording. | Central dual-label vocabulary with spy title and clear domain subtitle, consistent desktop/mobile/breadcrumb/search/empty states. | P06 |
| O19 | P1 C | Mobile navigation dialog has uncontrolled state and links do not explicitly close it after navigation. | Controlled menu closes on destination selection and returns focus appropriately. Validate behavior; static inspection alone does not prove persistent overlay. | P02 |
| O20 | P1 C | `ArticleBody` is a minimal block splitter: no inline Markdown links, all headings h2, repeated titles produce duplicate IDs; units/operations bypass it. | Safe shared Markdown renderer, unique stable heading IDs, section links, native-script support; preserve no-raw-HTML behavior. | P05 |
| O21 | P2 C | Featured collection walks manifest references with sequential DB reads and returns an entity link, not a collection experience. | Bounded manifest lookup and dedicated case-file landing page with narrative route, coverage and gaps. | P08,P09 |
| O22 | P1 C | Forces overview and organization tabs remain explanatory placeholders; all units fetched without pagination. | Sourced service overviews and evidenced parent-child hierarchy; paginate unit directory; keep empty state truthful until data exists. | P08,P09 |
| O23 | P1 C | Source correction instructions refer to a “configured editorial contact” without a concrete action on the page. | Local correction draft workflow that identifies record/claim and evidence; submission enabled only with an actual configured destination. | P08 |
| O24 | P0 C | Recovery plan's status summary says T23+ planned while tracker says functional; tests mostly check narrow fixture surfaces (search test checks form/options, badge test text). | Reconcile statuses against actual behavior; add adversarial lifecycle/scale/journey tests rather than renaming existing green gates. | P01,P10 |
| O25 | P2 C/H | Current domain is chiefly military history; no unified current briefs, industry/programmes, policy/budgets, learning glossary, careers or heritage experience. | Staged finite collections with appropriate date/rights/editorial models. “Everything” is a coverage roadmap with named gaps, never a claim of universal completeness. | P08,P09,P11–P14 |
| O26 | P1 C | Generic `parseJson` catches corruption and returns empty facts; source/DTO types are duplicated and `publicWhere<T>` casts arbitrary types. | Typed repository contracts and explicit invalid-data errors; preserve missing versus malformed. Make trust invariant hard to accidentally bypass. | P03,P04 |
| O27 | P2 C | Repeated metadata/detail database reads and sequential page-then-facet queries. | Per-request dedupe of identical public reads; parallelize independent facets, retain count-before-clamped-page dependency. Cross-request caching waits for withdrawal lifecycle proof. | P03,P10 |

## Experience specification: the user is the investigator

Tone: confident, concise, precise. The user opens files and follows evidence; real service members retain their actual names, ranks and roles. Do not relabel real people as intelligence agents. “Classified”, “declassified”, “live surveillance”, “secure clearance”, and “verified” are factual claims, not decorative badges. Keep public-source and independent-project identity visible. No forced boot sequence or sound.

| Surface | Spy-facing wording | Visible clarity / behavior |
|---|---|---|
| Home / | Briefing Room | Indian defence: history, people, systems and sources |
| /conflicts | Conflict Files | Wars and historical context |
| /operations | Mission Archive | Operations, battles and events; real category visible |
| /heroes | Personnel Dossiers | People and service histories |
| /arsenal | Arsenal | Equipment and technology |
| /forces | Command Directory | Services and units; no inferred hierarchy |
| /graph | Intel Board | Explore documented connections |
| /archive | Evidence Vault | Sources and documents |
| /search | Intel Search | Search Indian defence; keep “Search” in accessible name |
| /compare | Assessment Desk | Compare equipment specifications |
| Future /briefings | Situation Briefs | Dated public updates; no live implication |
| Future /field-manual | Field Manual | Defence terms and learning paths |
| Future /saved | My Casebook | Saved locally on this device; no implied cloud sync |
| Future /industry | Programme Desk | Industry and procurement milestones |
| Future /policy | Policy Files | Budgets, doctrine and public policy |
| Future /careers | Recruitment Desk | Official notices and deadlines |
| Future /heritage | Heritage Files | Museums, memorials and archive media |
| Forces tabs | Service Brief / Chain of Command / Unit Files | Link-based sections retain current-section semantics |
| Dossier tabs | Briefing / Timeline / Evidence / Connections / Map | Hide or explain unavailable sections |
| Search placeholder | Search a name, operation or system | Examples drawn from published corpus |
| Result action | Open dossier / Open source | Exact destination type remains clear |
| Filter heading/chips | Narrow the search / Air / 1999 | Avoid raw query keys and invented security levels |
| Reset/paging | Clear filters / Previous files / Next files | Page n of m, keyboard accessible |
| Loading | Retrieving records… | Real loading state, no artificial delay |
| Empty | No published files match this search | Clear filters + suggested published topic |
| Error | Records unavailable. Retry retrieval | Separate unavailable from zero matches |
| Missing detail | File unavailable | Search + return to Briefing Room; no hidden title leak |
| Source CTA | Inspect evidence / Open original source | Publisher, date, locator, authority |
| Save | Add to Casebook / Saved on this device | Undo/remove and actual persistence status |
| Share | Copy dossier link / Link copied | Only announce success after clipboard succeeds |
| Compare | Add to assessment / Review selected systems | 2–3 limit explained at selection time |
| Review/admin | Review Desk / Awaiting review / Publish record | Keep approval/rejection/withdrawal consequences explicit |
| Sign-in | Editor access | Actual identity flow; never pretend ordinary readers have clearance |
| Footer | About SENTINEL / Evidence standards / Corrections | Keep Privacy and Terms literal and discoverable |

All page titles, breadcrumbs, controls, tab labels, tooltips, aria labels, loading/error/empty text, badges, toast feedback, metadata and email-free correction drafts belong in a copy inventory. Preserve actual technical specifications, source titles, official event names and dates exactly. Routes need not change with labels.

Motion specification: 120–180 ms hover/focus colour transitions; 160–220 ms disclosure/selection transitions; maximum 8 px entrance movement; no reading-content exit delay, persistent scan line, scrambled essential label or ambient loop. These are proposed design targets, not measured results. Reduced motion removes spatial effects and uses immediate map/scroll updates. Keep body 16–18 px, evidence metadata at least 12 px, comfortable 65–72ch reading width, obvious keyboard focus, and minimum 44px preferred touch targets. Confirm actual contrast and 320px reflow before acceptance.

## Architecture decision

Use the existing modular monolith: Next server pages → public application/repository services → SQLite/Prisma. Client islands own search dialog, saved casebook, filters and optional explorers. Keep import/extraction outside request rendering. Public source/claim/entity/relationship publication stays transactional with search updates. A future Briefing or Notice is not an Operation; introduce a typed model only when its editorial fields and publication/search behavior are tested. Collections are curated manifests over canonical records, not copied narratives scattered across TSX files.

Do not introduce a graph database, microservices or vector search to solve the current issues. SQLite ranked queries and bounded relationships are sufficient candidates until measured scale demonstrates otherwise. Preserve external provider, storage/backup, rights and public release gates as distinct from UI implementation.
