# T28 verification — 1971 starter collection

This tranche uses the default next-collection order from `docs/MANUAL_WORK_AND_REQUIRED_INPUTS.md`: the 1971 Indo-Pakistan war. It is deliberately finite and candidate-only. No new top-level navigation item or schema type was added.

## Scope

- Five candidate entities: one conflict, two operations/battles, one commander, and one discovery-grade equipment context.
- Five captured source versions: two official PIB/Ministry of Defence releases, one Indian Express explainer, and two Wikipedia discovery pages.
- Eight locator-based evidence rows, eight candidate claims, and three candidate relationships.
- Raw captures are SHA-256 checked before the importer opens a write transaction.
- Wikipedia is used for discovery/cross-checking only. The missile-boat equipment claim remains explicitly unverified until a direct official or technical source is captured.

## Reproducible commands

```sh
DATABASE_URL=file:<repo>/.test-data/war-1971-candidate-20260908.db \
  npx tsx scripts/prepare-test-database.ts

IMPORT_APPLY_CONFIRM=I_UNDERSTAND \
DATABASE_URL=file:<repo>/.test-data/war-1971-candidate-20260908.db \
  npm run import:content -- \
  --input data/import/war-1971-initial-candidates.json \
  --mode apply

COLLECTION_CANDIDATE_APPLY_CONFIRM=I_UNDERSTAND \
DATABASE_URL=file:<repo>/.test-data/war-1971-candidate-20260908.db \
  npm run import:collection:evidence -- \
  --input data/import/war-1971-evidence.json

DATABASE_URL=file:<repo>/.test-data/war-1971-candidate-20260908.db \
  npm run validate:database
```

## Observed results on 8 September 2026

- Content import: `APPLIED`, 5 creates, 0 warnings, 0 errors.
- Evidence import: `APPLIED_CANDIDATE`, 5 sources, 8 evidence rows, 8 claims, 3 relationships.
- Replay: stable counts of 5 sources, 5 versions, 8 evidence rows, 8 claims, 3 relationships, 10 entity/claim links, and 3 relationship links.
- Database validation: zero errors and zero warnings.
- Collection coverage: 5 known, 5 indexed, 0 sourced, 0 reviewed. The zero sourced/reviewed result is expected while all rows remain `DRAFT`/`CANDIDATE`.

The candidate database is ignored by Git and is not used by the local public server. Publication, source-journey acceptance, and a complete reader path remain blocked until an authenticated publisher identity is configured and the candidate records pass the existing review service.
