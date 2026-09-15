# Site-wide search release verification — 2026-09-15

## Product decision

SENTINEL has one search entry point: the global archive control in the site header. Collection pages remain focused on browsing and filtering their chronology or directory; they no longer duplicate a text search field. The home page keeps its first-screen choices and links to the archive search without placing a second search bar in the hero.

## Search behavior

- The header search opens from every route and supports keyboard access with `⌘ K` / `Ctrl K`.
- Queries are sent to `/api/search` with the current route's archive scope.
- Search remains archive-wide, but the active section receives a relevance boost so its records appear first. Related record types receive a smaller boost.
- The full archive link preserves the query and scope, and the search page labels the active prioritisation.
- Routes without a collection scope search the complete archive.

| Route scope | Primary records | Related records |
| --- | --- | --- |
| Conflicts | Conflicts | Operations |
| Operations | Operations | Conflicts |
| Heroes | Heroes / people | Units |
| Arsenal | Arsenal / equipment | Units |
| Forces | Units | Operations, equipment |
| Sources | Sources | — |
| Intel Ledger | Complete archive | — |

## Removed duplicate entry points

- Home hero search bar.
- Collection text search fields on conflicts, operations, heroes, arsenal, forces, and source archive pages.
- Intel Ledger text search field.

Select filters such as category, service, medal, year / period, source type, and publisher remain where they narrow the current section. They do not compete with the global search control.

## Implementation notes

- `src/lib/search/context.ts` owns route-to-scope mapping, labels, and primary/related boosts.
- `src/lib/search/service.ts` applies the optional scope boost after the existing text and alias ranking.
- `src/app/api/search/route.ts` validates scope values before querying.
- `src/components/GlobalSearch.tsx` derives scope from the pathname and preserves it in the archive link.
- `src/components/CollectionToolbar.tsx` renders only structured select refinements.
- The award directory uses a bounded 100-record page so the complete 98-record Ashoka Chakra cohort is visible together while larger cohorts remain paginated.

## Verification evidence

- `npm run typecheck` — passed.
- `npx eslint src tests --quiet` — passed.
- `npm test` — passed.
- `npm run test:components` — passed.
- `npm run test:integration` — passed.
- `npm run test:e2e` — 82 desktop/mobile tests passed.
- `npm run validate:database` — passed with zero errors and zero warnings.
- `git diff --check` — passed.

Focused browser checks also confirm that `/`, `/operations`, `/conflicts`, `/heroes`, `/arsenal`, `/archive`, and `/intel` contain no duplicate collection text search input, while the global header search includes the originating section scope.

## Production smoke

- Deployment `dpl_3qyynnvJsCasaiuVzcqmVXaUZNgX` completed with `READY` and was aliased to `https://defence-website-zeta.vercel.app`.
- Live Chrome `/operations` showed Category and Year / period refinements above the divider, a single global search control, and a vertically scrollable chronology.
- Live Chrome search for `battle` returned operation records and displayed `PRIORITISING OPERATIONS + RELATED RECORDS`; the full archive link preserved `scope=operations`.
- Live Chrome `/` showed the archive CTA and global header search without a hero search bar.
- Live HTML smoke counted 98 Ashoka Chakra awardee cards at `/heroes/awards/ashoka-chakra`.
