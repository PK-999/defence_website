# SENTINEL implementation and verification tracker

**Reconciled:** 8 September 2026. **Current state:** execution has completed implementation through T23. T00–T07 and T09–T23 are functional on automated checks; T08 remains functional with the real OIDC lifecycle gate blocked pending provider credentials. Playwright Chromium is installed and the current desktop/mobile browser suite passes.

Final automated pass for this tranche: `npm test` (52 unit tests), `npm run test:components` (1 component test), `npm run test:integration` (14 files/33 tests), `npm run typecheck`, `npm run lint -- --quiet`, `npm run build`, `npm run validate:content`, `npm run validate:database`, and `npm run validate:assets` all passed. `npm run test:e2e` passed all 42 Chromium checks across desktop and mobile projects after installing Playwright's managed Chromium build. The final audit also enforces the canonical comparison `items=` URL, the 100-node/200-edge graph cap, and the 1 MB map-asset budget.

The prior tracker marked scaffolds and unverified behavior complete. Its exact earlier contents are preserved in [the historical tracker](docs/history/2026-09-06-progress-tracker-before-reconciliation.md). Those checkboxes are not evidence of current completion.

## Read first

1. [Ordered implementation plan](docs/implementation-plan.md).
2. [Shared contracts](docs/implementation-contracts.md).
3. [Test cases and acceptance gates](docs/test-plan.md).
4. [Data migration and editorial runbook](docs/content-operations.md).
5. [Original codebase review](SENTINEL_CODEBASE_REVIEW_AND_SUGGESTIONS.md).

## Status vocabulary

- **planned:** task defined; no implementation claim.
- **in-progress:** active change, gate not yet passed.
- **functional:** implementation exists and narrow automated checks pass; required wider/manual checks remain.
- **verified:** all task gates passed with linked evidence.
- **blocked:** exact required external input/tool/state unavailable, with independent work continuing where possible.

Never infer verified from a file's existence, a code comment, a green badge, or an old checked box. Code, corpus sourcing, authentication-provider integration, browser UX, and deployment readiness are separate gates.

## Task ledger

| Task | Deliverable | Dependencies | Required gate | Status | Evidence |
| --- | --- | --- | --- | --- | --- |
| T00 | Baseline and recoverable backup | None | Backup integrity + working-state record | functional | [Baseline record](docs/verification/2026-09-07/T00/baseline.md); SQLite backup integrity and foreign-key checks passed. |
| T01 | Isolated test/quality harness | T00 | DB-01 + independent lint/typecheck | functional | Unit/component/integration suites, lint, typecheck, guarded build, and all 14 Playwright Chromium checks passed. |
| T02 | Immediate truthful UI and denied admin | T01 | No fake outcomes/verification; denied mutations | functional | Deny-all editor test passes; admin reads/actions are gated; synthetic outcome, coverage, insignia, and source claims were removed or labelled honestly. |
| T03 | Additive schema and migration baseline | T01 | DB-02/03 | functional | Publication/evidence/import/search schema added; baseline and additive SQL rehearsals preserve legacy rows, default new records to DRAFT, and pass integrity/schema parity tests. |
| T04 | Canonical normalization/import | T03 | DOM-01–04, DB-03/04 | functional | [Implementation evidence](docs/verification/2026-09-07/T04/implementation.md): date/taxonomy/spec normalization, guarded validate/dry-run/apply importer, idempotent import integration test, and destructive-seed guard pass. |
| T05 | Public read boundary | T03,T04 | PUB-01/02 | functional | [Implementation evidence](docs/verification/2026-09-07/T05/implementation.md): public repository predicate, filtered detail/list/search/graph reads, hidden-slug integration checks, local additive migration, and production build pass. |
| T06 | Explicit evidence/relationships | T05 | EV-01–03, REL-01/02 | functional | [Implementation evidence](docs/verification/2026-09-07/T06/implementation.md); evidence/relationship integration suites pass; browser gate deferred. |
| T07 | Runtime validation/publication service | T06 | PUB-03/04 | functional | [Implementation evidence](docs/verification/2026-09-07/T07/implementation.md); publication/integration checks pass; legacy content validator correctly reports unsourced errors. |
| T08 | OIDC editor identity | T02,T03 | AUTH-01/07 + real provider gate | functional / blocked external gate | [Implementation evidence](docs/verification/2026-09-07/T08/implementation.md); unit/typecheck/build pass; real OIDC credentials are unavailable. |
| T09 | Transactional review UI/actions | T07,T08 | AUTH-02–06, AUTH-08 | functional | [Implementation evidence](docs/verification/2026-09-07/T09/implementation.md); review integration suite passes transactional and stale-revision cases. |
| T10 | Navigation and editorial pages | T02,T05 | NAV-01–03 | functional | [Implementation evidence](docs/verification/2026-09-07/T10/implementation.md); build includes all canonical pages and redirects; desktop/mobile browser navigation checks pass. |
| T11 | Bounded collections and filters | T04,T05 | COL-01–04 | functional | [Implementation evidence](docs/verification/2026-09-07/T11/implementation.md); collection integration suite proves bounded pagination/filter behavior. |
| T12 | Sourced unit pages/Forces | T06,T10,T11 | Unit journey + accessible preview | functional | [Implementation evidence](docs/verification/2026-09-07/T12/implementation.md); public Unit repository, canonical route build, and Forces browser state checks pass. |
| T13 | Shared ranked search service | T07,T12 | SRCH-01–03 | functional | [Implementation evidence](docs/verification/2026-09-07/T13/implementation.md); ranked search integration suite passes all six type/punctuation/privacy cases. |
| T14 | Reliable search interfaces | T10,T13 | SRCH-04–06 | functional | [Implementation evidence](docs/verification/2026-09-07/T14/implementation.md); shared API/UI state and cancellation logic build and lint; desktop/mobile search surface checks pass. |
| T15 | Shared reading/motion/accessibility | T10 | READ-01/02 + manual accessibility | functional | [Implementation evidence](docs/verification/2026-09-07/T15/implementation.md); quiet layout, stable headings, skip link, focus and reduced-motion rules implemented; automated desktop/mobile browser checks pass, with zoom and screen-reader inspection still pending. |
| T16 | Useful homepage | T11,T14,T15 | First-screen task choices | functional | [Implementation evidence](docs/verification/2026-09-07/T16/implementation.md); data-backed featured slot, truthful empty state, and desktop/mobile E2E pass. |
| T17 | Sources library/provenance UI | T06,T11,T15 | EV-01–03 public journey | functional | [Implementation evidence](docs/verification/2026-09-07/T17/implementation.md); source filtering/privacy/rights integration and desktop/mobile E2E pass. |
| T18 | People/equipment detail depth | T12,T15,T17 | READ-03 + source-linked fields | functional | [Implementation evidence](docs/verification/2026-09-07/T18/implementation.md); public DTO, unknown-value, evidence-link, and private-slug checks pass. |
| T19 | Chronology/conflict/operation UX | T06,T15,T17 | Exact dates/outcomes + mobile reading | functional | [Implementation evidence](docs/verification/2026-09-07/T19/implementation.md); date integration and URL-state/mobile chronology checks pass. |
| T20 | Lazy, attributed, bounded maps | T12,T19 | MAP-01–03 | functional | [Implementation evidence](docs/verification/2026-09-07/T20/implementation.md); asset validator and pre-activation request/browser checks pass. |
| T21 | Scoped graph + text equivalent | T06,T13,T15 | GRAPH-01/02 | functional | [Implementation evidence](docs/verification/2026-09-07/T21/implementation.md); capped public graph integration and text-equivalent/browser checks pass. |
| T22 | Real equipment comparison | T11,T18 | COMP-01/02 | functional | [Implementation evidence](docs/verification/2026-09-07/T22/implementation.md); deterministic state unit/integration and desktop/mobile comparison checks pass. |
| T23 | Error handling, metadata, freshness | T05,T13,T15,T17 | META-01 + production withdrawal | functional | [Implementation evidence](docs/verification/2026-09-08/T23/implementation.md); public canonical metadata, sitemap privacy, admin noindex, custom not-found, and browser route-state checks pass. |
| T24 | Computed coverage | T07,T09,T17 | COV-01/02 | functional | [Implementation evidence](docs/verification/2026-09-08/T24/implementation.md); manifest-backed known/indexed/sourced/reviewed metrics and unknown-denominator unit checks pass. |
| T25 | Fail-closed extraction factory | T04,T06,T07 | PIPE-01–03 | planned | Not run under this plan. |
| T26 | First reviewed connected collection | T09,T17–20,T24 | Sourcing + complete reader journey | in-progress | [Candidate-package evidence](docs/verification/2026-09-07/T26/source-package.md); nine sources captured and hashed, eight draft entities validate/dry-run/apply cleanly in an isolated database. Evidence/relationship import, accountable publication, and the complete reader journey remain. |
| T27 | Release rehearsal/documentation | T00–T26 | Full test plan + rollback evidence | planned | Not run under this plan. |
| T28 | Repeatable broader coverage | T27 | Per-collection release gate | planned | Not run under this plan. |

## Observed audit baseline — not current release certification

- TypeScript passed in the original audit.
- `npm run lint` failed because it invoked `next lint`; direct ESLint found 44 errors and 11 warnings in `src`.
- The legacy Markdown validator passed 83 files; it did not validate the public database or historical accuracy.
- Local DB had 1,967 people, 7 conflicts, 20 operations, 11 equipment records, 25 legacy sources, and no populated new evidence/claim tables.
- Several public navigation destinations returned404; mobile menu had no behavior; comparison/source landing were scaffolds.
- No browser surface was available for screenshot/interaction verification in the original audit.

Re-run T00 to establish the execution-time baseline; do not assume those counts/results are still current.

## Update procedure after each task

1. Record task ID, changed file paths, and working revision/diff description.
2. Link the failing regression evidence and passing narrow check.
3. Record every required integration/manual/visual gate separately with command, exit status, data source, and outcome.
4. If a required check is unavailable, use functional/blocked, not verified; name exactly what is missing.
5. Link evidence under `docs/verification/<date>/<task-id>/` and identify the next eligible task.
6. Review the final diff for unrelated user changes before staging explicit paths.

## Release gate ledger

| Gate | State | Required proof |
| --- | --- | --- |
| Application correctness | Not verified | T01–T24 automated and integration evidence |
| Source/corpus quality | Not verified | T26 source ledger and runtime validator |
| Editor identity integration | Not verified | T08 real login/logout/revocation with configured provider |
| Browser usability/accessibility | Not verified | T27 accepted screenshots and manual checks |
| Migration/rollback | Not verified | T03/T27 disposable rehearsal and preserved backup |
| Production deployment | Not performed | Separate authorized deployment task and environment checks |

## Documentation handoff

This documentation revision supplies the task order, cross-task interfaces, acceptance cases, migration safeguards, and content production procedure. It is not evidence that the implementation or tests described in those files already exist.
