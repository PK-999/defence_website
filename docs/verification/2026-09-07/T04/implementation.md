# T04 implementation evidence

Status: functional

Implemented strict date, taxonomy, equipment-spec, exact award/rank identity, entity, and import normalization in `src/lib/domain/` and `src/lib/import/`. `scripts/import-content.ts` supports `validate`, `dry-run`, and explicitly confirmed `apply`; apply writes draft entities, import identity, run reports, and proposals for published conflicts. Replaying the same input hash returns `UNCHANGED`. A malformed later row is rejected before transaction creation; the rollback test confirms no earlier row is written and reviewed evidence remains intact.

Legacy destructive seed entry points now require `ALLOW_DESTRUCTIVE_SEED=1` and a guarded `.test-data/*.db` `DATABASE_URL`. No production or `prisma/dev.db` seed was run.

Checks:

- `npm test`: 6 files, 38 tests passed.
- `npm run typecheck`: passed.
- `npm run lint -- --quiet`: passed.
- `npm run test:integration`: 4 files, 7 tests passed, including importer validation/apply/idempotency, malformed-batch rollback, and migration checks.
