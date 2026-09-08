# SENTINEL — Indian Defence Archive

SENTINEL is an independent educational reference project covering Indian defence history, people, forces, equipment, and source documents. It is an existing Next.js application with a SQLite/Prisma database and a separate experimental Python content factory.

## Start here: implementation documentation

The repository is undergoing an evidence-led recovery of content reliability and user experience. Use the progress tracker and its linked verification records for the current implementation state; the plan describes both completed and remaining work.

1. [Codebase review](SENTINEL_CODEBASE_REVIEW_AND_SUGGESTIONS.md) — findings and product direction.
2. [Implementation plan](docs/implementation-plan.md) — ordered T00–T28 tasks, exact file targets, steps, dependencies, and gates.
3. [Implementation contracts](docs/implementation-contracts.md) — shared types, statuses, routes, schema responsibilities, query behavior, and UI rules.
4. [Test plan](docs/test-plan.md) — isolated fixtures, test cases, expected results, browser/manual checks, and release gates.
5. [Data/content operations](docs/content-operations.md) — backups, migration rehearsal, rollback, import, source capture, and editorial review.
6. [Progress tracker](progress_tracker.md) — current evidence-based status; historical checkboxes are archived.
7. [Owner work and required inputs](docs/MANUAL_WORK_AND_REQUIRED_INPUTS.md) — accounts, credentials, product decisions, and the work that does not require the owner.

Read [AGENTS.md](AGENTS.md) before changing code. For Next.js APIs, consult the relevant installed `node_modules/next/dist/docs/` guide. Do not upgrade frameworks or regenerate the app to match an older tutorial.

## Current architecture

| Location | Responsibility |
| --- | --- |
| `src/app/` | Public/admin pages and search/graph APIs |
| `src/components/` | Shared UI, maps, timelines, and search |
| `src/lib/` | Existing content access, schemas, and utilities |
| `prisma/schema.prisma` | SQLite schema and client generators |
| `prisma/dev.db` | Existing local database; preserve it |
| `content/` | Legacy Markdown collection, including demonstration entries |
| `data/`, `factory/data/` | Import/generated inputs; not automatically reviewed publications |
| `factory/` | Experimental extraction/augmentation and analytics |
| `scripts/` | Legacy validation/seeding plus planned recovery tools |

The installed versions at the documentation baseline were Next.js 16.3.4, React 19.2.8, Prisma/client 5.22.0. Recheck versions at T00. The earlier Markdown-only descriptions and golden-dataset completion claims do not describe the current verified state.

## Run the existing local application

The current app requires installed Node dependencies, a generated JavaScript Prisma client, and a `DATABASE_URL` that points to the intended existing SQLite database. Do not run a seed command as an automatic setup step: some current seeds clear entity/evidence tables. For a fresh environment or missing database, follow T00–T04 to establish a safe setup.

With the existing environment configured:

```bash
npm run dev
```

Open the local URL reported by Next.js, usually http://localhost:3000. Check existing server ownership before starting another instance. Do not replace an existing `.env` file or print credentials into logs. `DATABASE_URL` uses Prisma's SQLite `file:` format; the recovery tools specify absolute paths to avoid differing relative-path resolution.

## Quality checks

Available now:

```bash
npm run typecheck
npm run lint
npm test
npm run test:components
npm run test:integration
npm run test:e2e
npm run validate:content
npm run validate:database
npm run validate:assets
```

The isolated unit, component, integration, browser, content, and database checks are implemented. The progress tracker records the latest known results and remaining manual release gates. The Markdown validator checks legacy file structure, while the database validator checks runtime publication invariants; neither alone proves historical truth.

## Data and editorial workflow

The intended flow is source → captured version → evidence → candidate claim/entity → policy evaluation → attributable publication action → published record. Imported or AI-produced content begins as DRAFT/CANDIDATE. Official confirmation is an evidence classification, not a side effect of approval. Routine claims may pass the automated evidence threshold documented in the content runbook; conflicts, living-person current details, and unclear rights stay held for a grouped decision.

Use [the content runbook](docs/content-operations.md) for the exact source ledger, validation gates, and first connected collection. The initial Kargil source pass is in [the claim matrix](docs/verification/2026-09-07/sources/claim-matrix.md), with machine-readable candidates in [the import file](data/import/kargil-initial-candidates.json). Keep unknown facts unknown and retain provenance. The Python factory is not currently certified for production ingestion; T25 specifies its fail-closed behavior and dependency cleanup. Do not run broad extraction or legacy reset scripts merely to populate the interface.

## Planned editor and deployment configuration

The Auth.js OIDC adapter and server-side editor allow-list checks use `AUTH_SECRET`, `AUTH_OIDC_ISSUER`, `AUTH_OIDC_CLIENT_ID`, `AUTH_OIDC_CLIENT_SECRET`, and `EDITOR_SUBJECTS`. The database already contains Puneeth Kakarla (`puneethkakarla@gmail.com`) as an inactive principal with both `REVIEWER` and `PUBLISHER` roles. After provider setup, link the immutable issuer/subject with `OWNER_EDITOR_ISSUER=... OWNER_EDITOR_SUBJECT=... npm run link:editorial-principal`. Missing configuration denies editor access. Real provider acceptance remains blocked until owner-managed credentials and callback URLs are configured. T23 introduces `SITE_URL` validation for public metadata.

Production deployment is a separate task requiring persistent database storage, backup/restore, authentication callback configuration, source/corpus readiness, and the release gates in T27. This documentation update does not deploy the application.

## Long-term references

- [Master product specification](SENTINEL_MASTER_BUILD_SPEC.md)
- [Exhaustive dataset strategy](SENTINEL_EXHAUSTIVE_DATASET_BUILD_STRATEGY.md)

These preserve the long-term ambition. Their conflicting older implementation prompts/version labels are superseded by the recovery contracts and task plan.
