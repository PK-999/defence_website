# SENTINEL publication checkpoint — 2026-09-09

## Owner-requested release amendment — 2026-09-12

All non-demo editorial rows are now public in the production catalogue after an explicit owner-requested bulk release:

- 7 conflicts
- 21 operations
- 1,967 heroes
- 39 arsenal records
- 34 sources
- 2,068 indexed records

The release created 1,980 `BULK_PUBLISH` audit entries with actor `owner-requested-bulk-release-2026-09-12`. This action makes the collected rows discoverable; it does not change their evidence status. The Intel Ledger continues to show `research_only`, `secondary_unverified`, and `editorial_review_required` labels so readers can distinguish collected leads from source-backed editorial claims.

The current production deployment is `dpl_AYtvtu2AXGEhMvzmaDYHAPGVqhBh` at `https://defence-website-zeta.vercel.app`.

Battle detail pages now publish source-linked dossier context, dated field notes, and stories without repeating the same overview as a second full report. Scrolling the chronology moves the map to the centered event, and operation maps use the same direct, unlabelled presentation as conflict maps.
The release also includes a vertically scrollable chronology wheel on conflict and operation pages. Collection routes use chronology as their sole record presentation. The centered card is enlarged and highlighted while surrounding record names fade by distance; each centered-event transition provides an optional sharp ratchet click with a mute control and reduced-motion fallback.

The reviewed release importer is `scripts/import-research-corpus.ts` (`npm run import:research`). It is idempotent, records source versions and locators, links evidence to the published sections, creates GOLD claims, and publishes through the normal publication validator and audit trail.

The local SQLite catalogue now contains this evidence-backed public slice:

- 34 retrieved primary sources, each with a captured source version and rights note.
- 21 Param Vir Chakra profiles, using the National War Memorial profile narratives and preserving narrative-date uncertainty.
- Five operation/battle records: Operation Bison, Operation Meghdoot, Operation Safed Sagar, Tololing, and Tiger Hill.
- 28 equipment records backed by 46 primary technical facts, with specification scope and limitations retained.

The complete collected corpus is also published through the public **Intel Ledger** at `/intel` and `/research/ledger.json`. That ledger exposes all 14,711 collected records across award observations, historical rosters, official announcements, biography files, equipment leads and facts, conflict/operation leads, relationships, source metadata, and evidence issues. Each section preserves its research status; `research_only`, `secondary_unverified`, and `editorial_review_required` are intentionally visible labels rather than silently promoted facts.

The wider research package remains staged for relational promotion: 4,191 historical award rows, 2,068 Shaurya Chakra rows, 257 structured biography profiles, 892 equipment discovery rows, 102 conflict/operation candidates, and 361 participation links. These records are already visible in the Intel Ledger with their research status, but are not presented as verified public facts because their current evidence is secondary, incomplete, conflicting, or only a discovery lead. The corpus is explicitly incomplete and has no defensible denominator for an exhaustive claim.

Validation evidence for this checkpoint:

- `npm run import:research -- --mode validate` — no corpus errors.
- Disposable clone rehearsal — 34 sources, 21 people, 5 operations, 28 equipment published; `npm run validate:database` returned zero errors and zero warnings.
- Local database — `npm run validate:database` returned zero errors and zero warnings.
- `npm test` — 16 files and 63 tests passed.
- `npm run test:integration` — 14 files and 33 tests passed.
- `npm run build` — Next.js production build completed successfully.
- Browser smoke test on the current production server — the Somnath Sharma profile, Operation Meghdoot, Rafale, and the linked National War Memorial source rendered with their source-linked evidence.

The preserved pre-import SQLite backup and hash are recorded in `.local-backups/` and are not part of the publication artifact.
