# T26 verification — candidate evidence and relationship import

Added `data/import/kargil-evidence.json`, a machine-readable package for nine captured sources, twelve locator-based evidence rows, ten candidate claims, and five candidate relationships. `scripts/import-collection-evidence.ts` validates all references and raw capture paths before a transaction, resolves entity identities by canonical slug, writes deterministic IDs, and leaves every source/claim/relationship non-public (`DRAFT`/`CANDIDATE`).

Evidence against the isolated candidate database `.test-data/kargil-candidate-20260907.db`:

- `COLLECTION_CANDIDATE_APPLY_CONFIRM=I_UNDERSTAND DATABASE_URL=file:/Users/apple/codes/defence_website/.test-data/kargil-candidate-20260907.db npm run import:collection:evidence -- --input data/import/kargil-evidence.json` applied `9 sources / 12 evidence / 10 claims / 5 relationships`.
- Re-running the same command preserved stable counts (`9 / 9 / 12 / 10 / 5` for sources, versions, evidence, claims, relationships; link rows remained `15 / 15 / 6`).
- `DATABASE_URL=file:/Users/apple/codes/defence_website/.test-data/kargil-candidate-20260907.db npm run validate:database` passed with zero errors and warnings.

The importer also hashes every raw capture with SHA-256 and stops before opening a write transaction when a capture is missing or changed. The explicit confirmation and `.test-data` restriction prevent an accidental candidate import into a production database.

Publication and the complete public reader journey remain blocked until an authenticated owner/batch-publisher identity is configured. The candidate database and `prisma/dev.db` are not used by the public local server.
