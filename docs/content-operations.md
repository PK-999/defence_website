# SENTINEL data migration and editorial operations runbook

**Status:** Instructions for future implementation. No migration, source capture, or publication was executed when this document was written. Read [contracts](implementation-contracts.md), [ordered tasks](implementation-plan.md), and [tests](test-plan.md) first.

## 1. Preserve the current working state

Before editing code, record `git status --short`, `git diff --stat`, installed Node/npm/Next/Prisma versions, and the task being attempted. Existing uncommitted files belong to the user. Never use `git reset --hard`, `git clean`, checkout-overwrite, blanket staging, or a seed reset to obtain a convenient baseline.

Back up SQLite through its backup API so an active WAL is included. Do not rely on copying only the `.db` file while a server may be writing. This command creates a new local backup without altering the source:

```bash
python3 - <<'PY'
from pathlib import Path
from datetime import datetime, timezone
import sqlite3, hashlib
source = Path('prisma/dev.db').resolve()
directory = Path('.local-backups').resolve()
directory.mkdir(exist_ok=True)
destination = directory / ('sentinel-' + datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S%fZ') + '.db')
src = sqlite3.connect(source.as_uri() + '?mode=ro', uri=True)
dst = sqlite3.connect(destination)
src.backup(dst)
result = dst.execute('PRAGMA integrity_check').fetchone()[0]
dst.close(); src.close()
assert result == 'ok', result
print('Backup:', destination)
print('SHA256:', hashlib.sha256(destination.read_bytes()).hexdigest())
PY
```

Ignore `.local-backups/` in Git. Do not upload this directory. Record backup path/hash in local verification notes. Use `PRAGMA foreign_key_check` and counts for each table as additional baseline evidence. Empty tables are valid observations, not permission to fabricate their contents.

For a complete worktree snapshot, record tracked diff and an inventory of untracked files separately. `git diff` alone does not include the untracked factory/data files. If isolation is needed, copy the relevant working state into a safe workspace; do not assume a new worktree contains uncommitted work.

## 2. Schema migration rehearsal

The current repository has no committed migration directory in the reviewed snapshot. T03 must establish a baseline before adding publication/evidence tables.

1. Copy `prisma/schema.prisma` to `.local-backups/legacy-schema.prisma` before editing it. This is a schema snapshot, not a second maintained schema.
2. Use the SQLite backup API to create `.test-data/migration-rehearsal.db` from the backup. Run the path guard from DB-01 before modifying that destination.
3. Verify installed Prisma CLI and JavaScript client are both 5.22.0. Generate only `client`; do not require Python during this migration.
4. Run the installed `prisma migrate diff --help` and confirm `--to-schema-datamodel` exists. The newer online `--to-schema` examples are not the selected command contract.
5. Generate `prisma/migrations/00000000000000_baseline/migration.sql` from empty to the saved legacy schema, using the installed CLI. Inspect the result before execution.

```bash
npx prisma migrate diff --from-empty --to-schema-datamodel .local-backups/legacy-schema.prisma --script
```

Save stdout as the baseline migration only after confirming exit status is zero. The output should create the legacy tables/indices. It must not contain a destructive reset of the existing database. Keep schema provider SQLite.

6. On the disposable clone only, mark baseline applied with `prisma migrate resolve --applied 00000000000000_baseline`. Explicitly supply that clone's absolute file DATABASE_URL through a Node child-process environment or a correctly quoted shell assignment. Do not run this using an inherited unknown DATABASE_URL.
7. Add the C03–C07 schema changes, with additive nullable/default fields. Generate the next migration from saved legacy schema to new schema using installed `migrate diff` and inspect SQL. SQLite table rebuilds require checking copy-column lists and foreign-key restoration; a generated DROP TABLE alone is not proof of data loss, but omitted copy columns are unacceptable.
8. On the clone, apply pending migrations using `migrate deploy`, run integrity/foreign-key checks, and compare old fields row-by-row against the backup by ID. New publication defaults must be DRAFT. Record the deliberate changes, not just counts.
9. Create a brand-new empty test database and apply the complete migration chain. Compare schema/table/index definitions with the migrated clone. Both paths must work.
10. Re-run `migrate deploy`; it must apply zero new migrations and preserve counts/values.
11. Test new validation/import/publication against the clone. Never run `migrate reset`, `db push --accept-data-loss`, or the old exhaustive seed against the user's database.

If Prisma config loading fails, inspect `prisma.config.ts` and the installed CLI. The current config's skills integration and ignored type error are not a database requirement. Remove/replace incompatible config only in the implementation diff with a recorded explanation; do not upgrade Prisma incidentally. Preserve a documented way to generate the Python client separately.

### Switching a local application to the candidate

Keep original database and backup intact. Stop only the server started for the task, then launch the candidate with an explicit absolute DATABASE_URL pointing to the verified clone/candidate. Complete smoke checks before changing the user's normal environment configuration. Do not rename an active SQLite database underneath a process. Deployment data migration requires deployment-specific backup/restore and storage validation; this runbook does not authorize a production cutover.

### Rollback

For additive schema changes, roll application code back only if the old code remains compatible with added fields/tables. Otherwise stop the task-owned process, point it back to the preserved original database and matching original code revision/worktree, and smoke-test that pair. Do not overwrite a database containing new editorial work. Export post-migration audit/import records before any later merge-back. Document which changes would be lost by restoring a backup and avoid automatic reverse data transforms.

## 3. Canonical import flow

Create one entry point `scripts/import-content.ts` in T04. It accepts:

```text
--input <absolute-or-repository-relative-json-path>
--mode validate | dry-run | apply
--report <output-json-path>
```

Default mode is validate. An omitted input is an error, never a guess between `data/` and `factory/data/`. The importer supports an explicit array/envelope with `schemaVersion: 1`, `sourceVersionId`, `entityType`, `externalId`, and normalized data. It produces a report with input hash, source version, proposed creates/updates, unchanged rows, warnings, conflicts, and errors. Validation/dry-run never writes the database. Apply is transactional and refuses any unresolved error.

Do not feed arbitrary Prisma nested `connect/create` JSON directly into `data:`. Whitelist fields and resolve relationship candidates separately. Stable external keys map to canonical IDs through `ImportIdentity` `(sourceSystem, externalId, entityType)` unique. Record `ImportRun` with input hash/status/report and deduplicate an exact replay. Existing published records are not overwritten by import; propose changes in staging for editor review.

Normalization preserves raw values and records issues. Explicit mappings are in C06. Unknown service stays null. Repeated award rows merge exact award IDs, not substring labels. Duplicate names require an identity resolution record. Source URL, accession ID, and captured bytes must describe the same document. Paths are resolved relative to the script/repo deliberately, never whatever directory the process happens to start in.

Retire the old seed entry points from normal package scripts. Mark them as development fixtures and guard them against non-test URLs before retaining any deletion behavior. Preserve their source text for reference until migration reconciliation completes. Do not erase them solely to make validation green.

## 4. Source capture and evidence review

Create `docs/verification/<date>/source-ledger.csv` with columns:

```text
sourceId,title,publisher,canonicalUrl,publicationDate,accessedAt,sourceType,tier,language,rightsNotes,versionId,contentHash,rawStoragePath,parserVersion,reviewer,status
```

1. Choose a document that actually supports the required subject. A department homepage is a publisher reference, not a citation for every fact.
2. Open the document and confirm title, publisher, date, URL, and relevant passage. Record uncertainty explicitly. Do not invent an inaccessible PDF URL or page number.
3. Save a permitted local snapshot outside `public/`; compute SHA-256 of bytes. Record access failure as a failure. Do not replace an unavailable source with LLM prose.
4. Extract text with an identified parser version. Keep page/paragraph/table/time locators. For OCR, record transcription and confidence issues.
5. Create candidate entities/claims/evidence in staging; they are not public.
6. Verify proposed quotes against the actual passage, then assess whether the passage supports the particular claim and variant/date/context. This check may be automated when the source text, locator, and extraction output are reproducible.
7. Check conflicting sources. A newer source need not supersede an older historical fact; validity dates and scope matter.
8. Record display rights for text/images/maps. A source can be cited without reproducing a long passage. Do not assume official branding makes every asset freely reusable.
9. Apply the configured evidence policy. Routine claims may be accepted without per-fact manual review when one directly relevant Tier A source or two independent reputable sources support the exact scope and there is no conflict. The action must still record an authenticated editor or dedicated batch-publisher actor, the policy version, source versions, time, and reason. Conflicts, living-person current details, sensitive/current operational material, and uncertain rights remain held for a grouped decision. Approval creates audit metadata; it does not invent official confirmation.
10. Publish the entity only after summary, narrative, identity, factual fields, related records, and evidence pass the publication validator.

When no source can be obtained, keep the record draft or publish only separately verified sections under the agreed editorial policy. An empty collection is preferable to falsely labeled content. The implementing agent can finish software gates while recording the sourcing gate as blocked; it must not mark the collection sourced.

## 5. Publication checklist for each entity

- [ ] Stable canonical ID and unique slug; ambiguous identity resolved or explicitly excluded from publication.
- [ ] Reader-friendly title and summary with no fixture/generic biography error text.
- [ ] Narrative is structured and supported by EntityEvidence section links.
- [ ] Dates have correct precision; current/service-status facts have an as-of source.
- [ ] Awards/ranks/units use exact identities; no inferred extra awards or guessed Army membership.
- [ ] Material claims have accessible locators and appropriate evidence status.
- [ ] Related entities are public and the relationship itself is supported.
- [ ] Media, if included, has credit/rights/source/alt/caption.
- [ ] Editor or batch-publisher identity, policy version, time, reason, and revision are recorded.
- [ ] Publication validator returns zero errors; candidate/rejected claims do not leak.
- [ ] Detail, collection, search, and source journey inspected after publication.

There is no minimum word-count rule that can substitute for substantive content. Automated source checks must assess claim scope, independence, conflicts, and locator validity. Sampling and grouped editorial review remain release-quality controls even when routine facts do not receive individual manual approval.

## 6. First connected collection: explicit deliverable

T26 targets a modest, deeply linked Kargil collection, subject to obtaining sources:

- One conflict overview with context, period, documented outcome, and source notes.
- At least two individually documented operations/events, with precise distinction between an operation and a battle/event.
- At least two sourced person profiles explicitly connected to their documented participation.
- At least two equipment profiles with source-backed Indian-service variant context.
- At least three real source documents, each with at least one usable evidence locator.
- At least one narrative route from conflict → operation/event → person or equipment → source, without a dead end.

These are minimum product acceptance targets, not historical claims. Do not invent relationships to meet counts. If source availability prevents a target, state which missing evidence blocks it. Do not merge events into the Operation table silently: use category `battle`/`event` under the current model only when explicitly labeled and approved by the taxonomy contract, or document a small schema extension before import.

## 7. Coverage calculation and later expansion

Each collection manifest under `content/collections/<slug>.json` defines id/title/description, inclusion/exclusion rules, source of the known universe, known entity refs, reviewer, updatedAt, and a list of gaps. Unknown universe size is null, never zero-as-unknown. Counts derive from real public/source/review state.

For every new domain, repeat this sequence:

1. Write one collection manifest with a finite first scope.
2. Identify the canonical entity types and existing reusable page templates.
3. Find and review its source registry before crawling.
4. Import a five-record candidate sample and run validation.
5. Resolve identity/taxonomy issues; never copy a whole new domain's content into page components.
6. Review/publish the sample and complete the search → page → source journey.
7. Measure collection queries, mobile reading, and coverage counts.
8. Expand incrementally using the same adapter and tests.

Policy/budgets require fiscal year, currency/units, allocations vs actuals, and source dates. Careers require a current official notice, applicability dates, and an expiration/review policy. Industry requires organization/programme/equipment distinctions. Heritage/media requires rights and geographic source context. Multilingual records need language tags, native-script typography, reviewed translations and links to original evidence. A future AI answer must retrieve and cite existing public evidence and abstain when unsupported; no chatbot is part of the current recovery release.

## 8. Release candidate and handoff

Create a read-only candidate copy and run `validate:database` with that explicit URL after T07. Its report includes publication errors, dangling references, unsupported statuses, duplicate identity candidates, stale search projections, missing source locators, and fixture/generic-text detection. Validation must not rewrite rows to make itself pass.

Release evidence bundles: code revision, migration IDs, candidate hash, validator report, test results, source ledger, coverage manifest, screenshots, unresolved limitations, and rollback instructions. A new model/agent resumes from the first unverified task and these artifacts, not from the old checked boxes or assumptions about previous success.
