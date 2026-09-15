# React and architecture file coverage

77 TSX files inventoried. The table distinguishes direct review from inventory/static quality checks. Lint/typecheck apply across the project; they do not constitute behavioral review of every component. Relevant installed Next server/client guidance and React rules for event listeners, parallel requests and serialization were read.

| File | Review depth |
|---|---|
| `src/app/about/page.tsx` | Inventoried; lint/typecheck; inspect callers before changes |
| `src/app/admin/conflicts/page.tsx` | Inventoried; lint/typecheck; inspect callers before changes |
| `src/app/admin/coverage/page.tsx` | Inventoried; lint/typecheck; inspect callers before changes |
| `src/app/admin/equipment/page.tsx` | Inventoried; lint/typecheck; inspect callers before changes |
| `src/app/admin/layout.tsx` | Inventoried; lint/typecheck; inspect callers before changes |
| `src/app/admin/page.tsx` | Inventoried; lint/typecheck; inspect callers before changes |
| `src/app/admin/review/page.tsx` | Inventoried; lint/typecheck; inspect callers before changes |
| `src/app/archive/[slug]/page.tsx` | Direct product/React source review |
| `src/app/archive/page.tsx` | Inventoried; lint/typecheck; inspect callers before changes |
| `src/app/arsenal/ArsenalFilters.tsx` | Direct product/React source review |
| `src/app/arsenal/[slug]/page.tsx` | Direct product/React source review |
| `src/app/arsenal/page.tsx` | Inventoried; lint/typecheck; inspect callers before changes |
| `src/app/compare/page.tsx` | Direct product/React source review |
| `src/app/conflicts/[slug]/page.tsx` | Direct product/React source review |
| `src/app/conflicts/page.tsx` | Inventoried; lint/typecheck; inspect callers before changes |
| `src/app/editorial-policy/page.tsx` | Inventoried; lint/typecheck; inspect callers before changes |
| `src/app/error.tsx` | Inventoried; lint/typecheck; inspect callers before changes |
| `src/app/forces/page.tsx` | Direct product/React source review |
| `src/app/forces/units/[slug]/page.tsx` | Direct product/React source review |
| `src/app/graph/page.tsx` | Direct product/React source review |
| `src/app/heroes/HeroesFilters.tsx` | Direct product/React source review |
| `src/app/heroes/[slug]/page.tsx` | Direct product/React source review |
| `src/app/heroes/page.tsx` | Inventoried; lint/typecheck; inspect callers before changes |
| `src/app/layout.tsx` | Direct product/React source review |
| `src/app/methodology/page.tsx` | Inventoried; lint/typecheck; inspect callers before changes |
| `src/app/not-found.tsx` | Inventoried; lint/typecheck; inspect callers before changes |
| `src/app/operations/[slug]/page.tsx` | Direct product/React source review |
| `src/app/operations/page.tsx` | Inventoried; lint/typecheck; inspect callers before changes |
| `src/app/page.tsx` | Direct product/React source review |
| `src/app/privacy/page.tsx` | Inventoried; lint/typecheck; inspect callers before changes |
| `src/app/search/loading.tsx` | Inventoried; lint/typecheck; inspect callers before changes |
| `src/app/search/page.tsx` | Direct product/React source review |
| `src/app/signin/SignInButton.tsx` | Inventoried; lint/typecheck; inspect callers before changes |
| `src/app/signin/page.tsx` | Inventoried; lint/typecheck; inspect callers before changes |
| `src/app/template.tsx` | Direct product/React source review |
| `src/app/terms/page.tsx` | Inventoried; lint/typecheck; inspect callers before changes |
| `src/components/AdminAccessNotice.tsx` | Inventoried; lint/typecheck; inspect callers before changes |
| `src/components/ArticleBody.tsx` | Direct product/React source review |
| `src/components/ArticleLayout.tsx` | Direct product/React source review |
| `src/components/BadgeComponents.tsx` | Direct product/React source review |
| `src/components/Breadcrumbs.tsx` | Direct product/React source review |
| `src/components/ClaimReviewCard.tsx` | Inventoried; lint/typecheck; inspect callers before changes |
| `src/components/ClientOperationMap.tsx` | Direct product/React source review |
| `src/components/CollectionToolbar.tsx` | Direct product/React source review |
| `src/components/CompareTray.tsx` | Direct product/React source review |
| `src/components/ComparisonTable.tsx` | Direct product/React source review |
| `src/components/ConnectionExplorer.tsx` | Direct product/React source review |
| `src/components/EditorialPage.tsx` | Inventoried; lint/typecheck; inspect callers before changes |
| `src/components/EvidenceLink.tsx` | Direct product/React source review |
| `src/components/FactList.tsx` | Direct product/React source review |
| `src/components/FeaturedCollection.tsx` | Inventoried; lint/typecheck; inspect callers before changes |
| `src/components/ForcesMap.tsx` | Inventoried; lint/typecheck; inspect callers before changes |
| `src/components/ForcesMapWrapper.tsx` | Inventoried; lint/typecheck; inspect callers before changes |
| `src/components/GlobalSearch.tsx` | Direct product/React source review |
| `src/components/GraphExplorer.tsx` | Direct product/React source review |
| `src/components/HomeSearch.tsx` | Direct product/React source review |
| `src/components/InteractiveConflictViewer.tsx` | Direct product/React source review |
| `src/components/InteractiveMapLayout.tsx` | Direct product/React source review |
| `src/components/OnThisPage.tsx` | Direct product/React source review |
| `src/components/OperationMap.tsx` | Direct product/React source review |
| `src/components/Pagination.tsx` | Direct product/React source review |
| `src/components/ProvenanceViewer.tsx` | Direct product/React source review |
| `src/components/ScrambleText.tsx` | Direct product/React source review |
| `src/components/SiteFooter.tsx` | Inventoried; lint/typecheck; inspect callers before changes |
| `src/components/SiteHeader.tsx` | Direct product/React source review |
| `src/components/UnitPreview.tsx` | Direct product/React source review |
| `src/components/WarRoom.tsx` | Inventoried; lint/typecheck; inspect callers before changes |
| `src/components/WarRoomMap.tsx` | Inventoried; lint/typecheck; inspect callers before changes |
| `src/components/ui/Timeline.tsx` | Direct product/React source review |
| `src/components/ui/VerticalTimeline.tsx` | Inventoried; lint/typecheck; inspect callers before changes |
| `src/components/ui/badge.tsx` | Inventoried; lint/typecheck; inspect callers before changes |
| `src/components/ui/breadcrumb.tsx` | Inventoried; lint/typecheck; inspect callers before changes |
| `src/components/ui/button.tsx` | Inventoried; lint/typecheck; inspect callers before changes |
| `src/components/ui/card.tsx` | Inventoried; lint/typecheck; inspect callers before changes |
| `src/components/ui/dialog.tsx` | Direct product/React source review |
| `src/components/ui/input.tsx` | Inventoried; lint/typecheck; inspect callers before changes |
| `src/components/ui/separator.tsx` | Inventoried; lint/typecheck; inspect callers before changes |

## Data and test dependencies directly inspected

`src/lib/navigation.ts`, `domain/types.ts`, `domain/query.ts`, `search/service.ts`, `repositories/collections.ts`, `repositories/entities.ts`, `repositories/publication.ts`, `repositories/relationships.ts`, `repositories/graph.ts`, `content.ts`, `src/app/api/search/route.ts`, `globals.css`, package scripts, test runner isolation, current search/chronology/badge assertions and recovery contracts.

Strengths: server-rendered pages are the default; public repositories exist; graph and maps use dynamic imports; maps have explicit activation; details parallelize claims/relationships in several places; canonical source/relationship DTOs and meaningful database guard tests exist.

Primary remaining React risks: duplicate search owners/listeners, effect cancellation not wired to fetch, selected-option semantics, router pushes per character, observer attachment timing and JS motion preferences. Prioritize these before low-impact memoization or mechanical import rewrites.

Dormant WarRoom/ForcesMap and old filter implementations were located through callers. Their continued presence is maintenance risk, not proof they execute on the active homepage. Remove only after complete consumer search and replacement coverage.

This pass is not an exhaustive security audit of auth/admin/import/factory internals. Those retain their separate publication/provider/release gates.
