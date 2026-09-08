# SENTINEL content factory

This directory contains an experimental Python ingestion/extraction/augmentation pipeline and dbt configuration. **It is not currently verified as a production content source.** Some current scripts write directly to JSON or SQLite; `run.py` seeds demonstration records; the extraction path currently contains mock fallbacks that the recovery plan removes.

Read [T25 in the implementation plan](../docs/implementation-plan.md), [C04/C06/C13 contracts](../docs/implementation-contracts.md), [PIPE-01–03 tests](../docs/test-plan.md), and [the source/import runbook](../docs/content-operations.md) before executing or changing the pipeline.

## File responsibilities

| Area | Current purpose | Required recovery |
| --- | --- | --- |
| `assets.py` | Dagster assets for document/extraction/database sync | Explicit source version, schema/quote validation, no fallback claims, idempotent candidate writes |
| `run.py` | Example materialization and demo seeding | Real argument/config validation; no silent demo seeding |
| `generate_*.py` | Hardcoded/generated data files | Candidate/demo inputs only; never automatic verification |
| `scrape_*.py` | Discovery scraping | Declared dependencies, captured source metadata, reviewed adapters |
| `augment_*.py` | Heuristic augmentation/direct updates | Unknown-preserving normalization and reviewed proposals |
| `config/` | Ontology/source rules | Canonical predicates; attribution rather than absolute truth rules |
| `analytics/` | dbt starter/coverage SQL | Remove duplicated starter config; keep analytics downstream/read-only with respect to public source data |
| `data/` | Generated/sample inputs | Explicit input selection and provenance; not the public source of truth |
| `src/factory/__init__.py` | Current greeting entry point | Proper CLI only after T25 |

## Execution policy during recovery

Do not run `run.py`, augmentation scripts, or seeds against the working database merely to test imports. Use the guarded disposable database setup and deterministic synthetic fixtures. Preserve raw input and unresolved issues; never default unknown service to Army or infer additional awards by substring. Missing document/model output must fail without writing claims.

The current pyproject requests Python >=3.14. T25 verifies the complete dependency set/lock with the supported interpreter; syntax checks alone do not establish that Dagster, dbt, Prisma Python, or scraping imports work together. Do not alter the JavaScript Prisma version to repair an unrelated Python install without a separately reviewed compatibility change.

After T25 adds the test dependency and test file, the planned narrow check is:

```bash
uv run --directory factory pytest tests/test_extraction.py
```

Run it from repository root. It must stub external extraction/network dependencies and use only disposable data. This command is a future test contract, not an assertion that the test currently exists or passes.

## Acceptance

- Missing document or failed model produces an explicit failed run and zero claim writes.
- Invalid schema/property/quote/version is quarantined with a useful error report.
- Exact replay preserves source/evidence/entity identity without duplication.
- Proposed facts remain candidates until authenticated review; no extractor publishes GOLD/PUBLISHED records.
- Source metadata, content hash, parser version, locator, rights, and review decision survive the pipeline.
- Analytics output agrees with application coverage definitions and cannot overwrite source evidence.

Record exact dependency/test results in [the progress tracker](../progress_tracker.md). Manual source review and canonical import can proceed while factory infrastructure is blocked.
