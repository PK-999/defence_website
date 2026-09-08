# T00 baseline — 2026-09-07

This is the execution baseline for the recovery implementation. It records the working copy and database before T01–T05 changes. Existing user changes were already present and were preserved.

## Working copy

- Repository: `/Users/apple/codes/defence_website`
- Branch: `main`
- HEAD: `845dabf inital push`
- Node: `v26.5.0`
- npm: `11.17.0`
- Next.js: `16.3.4`
- Prisma CLI: `5.22.0`
- Prisma client: `5.22.0`
- Existing server: PID `59923` listening on TCP `*:3000`; it was not stopped or modified.
- The working tree contained existing tracked and untracked application/data changes. The full `git status --short` and `git diff --stat` were captured in the task execution log before implementation.

## Database backup

The SQLite backup API was used so active WAL content is included. The source database was opened read-only and was not changed.

- Source: `prisma/dev.db`
- Backup: `.local-backups/sentinel-20260907T042141071689Z.db`
- SHA-256: `e7c30348dccf197ca729f979a11628757867a9eaaf804493c5f2b5b9d3313a4b`
- `PRAGMA integrity_check`: `ok`
- `PRAGMA foreign_key_check`: zero rows
- Schema snapshot: `.local-backups/legacy-schema.prisma`
- Schema snapshot SHA-256: `8c5348e186bc74b89acdd92ea48034ebd5712156750743f9926a0fb68dec2c1a`

## Baseline rows

| Table | Rows |
| --- | ---: |
| Conflict | 7 |
| Operation | 20 |
| Person | 1,967 |
| Equipment | 11 |
| SourceRecord | 25 |
| SourceFamily | 0 |
| Source | 0 |
| SourceVersion | 0 |
| Evidence | 0 |
| Claim | 0 |
| Relationship | 0 |
| EntityAlias | 0 |
| Media | 0 |

Legacy status distributions were `Published: 7` for Conflict, `Published: 20` for Operation, `Published: 1,967` for Person, and `Published: 11` for Equipment. SourceRecord has no status field. The new provenance tables were empty at baseline.

## Baseline checks

- `npm run validate:content`: passed; 83 Markdown files validated.
- `npm run typecheck`: could not run because the package had no `typecheck` script.
- `npm run lint`: failed because the script invokes removed `next lint`, which Next interpreted as a directory named `lint`.
- No source or database mutation was performed by these checks.

The lint and typecheck results are baseline findings for T01. The local backup directory is ignored by Git; it must never be uploaded or committed.
