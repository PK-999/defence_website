"""CLI for the fail-closed extraction assets.

The command never seeds demo records and requires an explicit source slug. Model
configuration is supplied through SENTINEL_EXTRACTION_MODEL and the Ollama adapter.
"""

import argparse
import os
import sys

from dagster import RunConfig, materialize

from assets import ExtractionConfig, candidate_claims, database_sync, raw_source_document


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Extract source-backed candidate claims without publishing them.")
    parser.add_argument("--source-slug", required=True, help="Slug of a captured markdown source under factory/data.")
    args = parser.parse_args(argv)
    if not os.environ.get("SENTINEL_EXTRACTION_MODEL"):
        parser.error("SENTINEL_EXTRACTION_MODEL is required; no mock model is available")
    config = {"ops": {name: {"config": {"source_slug": args.source_slug}} for name in ("raw_source_document", "candidate_claims", "database_sync")}}
    result = materialize([raw_source_document, candidate_claims, database_sync], run_config=RunConfig(config))
    return 0 if result.success else 1


if __name__ == "__main__":
    sys.exit(main())
