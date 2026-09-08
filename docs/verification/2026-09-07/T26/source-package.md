# T26 candidate source package

Status: in progress. This record is evidence for sourcing and draft-import work, not a publication claim.

## Completed on 7 September 2026

- Installed Playwright's managed Chromium build and confirmed the application's 14 desktop/mobile E2E checks pass.
- Captured nine source versions: three official PIB/Ministry of Defence pages, one Indian Express explainer, and five version-identified Wikipedia pages.
- Recorded source metadata, rights limits, SHA-256 hashes, raw evidence paths, and source roles in `../source-ledger.csv`.
- Created a claim matrix that states what each source supports and explicitly withholds conflicting casualty figures, an uncertain exact Operation Vijay start day, and an unproven FH-77B-to-Kargil relationship.
- Created eight machine-readable draft records: one conflict, three operation/battle records, two people, and two equipment variants.
- Fixed the two missing legacy Markdown slugs and confirmed `npm run validate:content` exits 0.
- Added recognized `calibre` and `barrel-length` equipment keys with a unit test.

## Import proof

Input: `data/import/kargil-initial-candidates.json`

| Step | Evidence | Result |
| --- | --- | --- |
| Validate | `../kargil-import-validate.json` | `VALIDATED`; 8 proposed creates; 0 warnings; 0 errors |
| Dry run | `../kargil-import-dry-run.json` | `DRY_RUN`; 8 proposed creates; 0 warnings; 0 errors |
| Apply | `../kargil-import-apply.json` | `APPLIED` to `.test-data/kargil-candidate-20260907.db`; 8 creates; 0 warnings; 0 errors |
| Database validation | `DATABASE_URL=file:<repo>/.test-data/kargil-candidate-20260907.db npx tsx scripts/validate-database.ts` | Exit 0; no warnings or errors |

The disposable database is ignored by Git. `prisma/dev.db` was not changed by this import.

## Exact remaining sequence

1. Configure the authenticated batch-publisher actor. It must use the existing issuer-plus-subject authorization model and write review/audit rows; it must not bypass the public-read predicate or stamp anonymous approvals.
2. Run publication validation for each entity. Automatically advance only routine claims that satisfy the policy in `docs/content-operations.md`; route exceptions into one grouped queue.
3. Reconcile the search projection and compute the Kargil collection coverage from `content/collections/kargil-1999.json`.
4. Exercise home → Kargil conflict → operation/battle → person/equipment → source on desktop and mobile. Add E2E assertions for source labels, back navigation, narrow width, missing evidence, and held disputed facts.
5. Run the T27 release suite and preserve screenshots, accessibility results, performance measurements, rollback proof, and remaining gaps. Do not publish while OIDC/batch identity is unconfigured.

## Current blockers

- Real publication attribution needs the owner-managed OIDC provider details listed in `docs/MANUAL_WORK_AND_REQUIRED_INPUTS.md` or a separately designed service identity with equivalent auditability.
- A direct source for FH-77B employment in Kargil is still needed before that edge can be created.
- Source/evidence/relationship ingestion is implemented for the candidate package; public publication remains gated by authenticated editorial identity and review.
