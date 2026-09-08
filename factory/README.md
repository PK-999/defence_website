# SENTINEL content factory

This directory contains the Python ingestion/extraction/augmentation pipeline and dbt configuration. The extraction core is fail-closed: missing documents, unavailable models, invalid ontology properties, and quotes absent from the captured source stop the run before persistence. Candidates remain non-public until the authenticated review workflow publishes them.

Read [T25 in the implementation plan](../docs/implementation-plan.md), [C04/C06/C13 contracts](../docs/implementation-contracts.md), [PIPE-01–03 tests](../docs/test-plan.md), and [the source/import runbook](../docs/content-operations.md) before executing or changing the pipeline.

## File responsibilities

| Area | Current purpose | Required recovery |
| --- | --- | --- |
| `assets.py` | Dagster assets for document/extraction/database sync | Explicit source version, schema/quote validation, no fallback claims, idempotent candidate writes |
| `run.py` | Explicit Dagster materialization | Requires `--source-slug` and `SENTINEL_EXTRACTION_MODEL`; never seeds demonstration records |
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

The narrow T25 check is:

```bash
uv run --directory factory pytest tests/test_extraction.py
```

Run it from repository root. It uses disposable local documents and model callables; it does not write the working database.

For a deterministic operator check without an LLM, the installed `factory` command accepts an explicit captured source, ontology, and model-response JSON:

```bash
uv run --directory factory factory \
  --source data/drdo-tejas-brochure-2023.md \
  --claims-json /path/to/model-response.json \
  --ontology config/ontology.yaml
```

## Acceptance

- Missing document or failed model produces an explicit failed run and zero claim writes.
- Invalid schema/property/quote/version is quarantined with a useful error report.
- Exact replay preserves source/evidence/entity identity without duplication.
- Proposed facts remain candidates until authenticated review; no extractor publishes GOLD/PUBLISHED records.
- Source metadata, content hash, parser version, locator, rights, and review decision survive the pipeline.
- Analytics output agrees with application coverage definitions and cannot overwrite source evidence.

Record exact dependency/test results in [the progress tracker](../progress_tracker.md). Manual source review and canonical import can proceed while an external model adapter is unavailable; they must not be replaced with fallback claims.
