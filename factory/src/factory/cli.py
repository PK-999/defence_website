"""Small explicit CLI for validating a captured source and model response."""

import argparse
import json
import sys
from pathlib import Path

import yaml

from .extraction import ExtractionError, extract_candidates


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Validate source-backed extraction candidates without publishing them.")
    parser.add_argument("--source", required=True, type=Path, help="Captured UTF-8 source document.")
    parser.add_argument("--claims-json", required=True, type=Path, help="Explicit model response JSON; no fallback response is generated.")
    parser.add_argument("--ontology", required=True, type=Path, help="Ontology YAML file.")
    args = parser.parse_args(argv)
    try:
        ontology = yaml.safe_load(args.ontology.read_text(encoding="utf-8"))
        model_output = json.loads(args.claims_json.read_text(encoding="utf-8"))
        batch = extract_candidates(args.source, lambda _: model_output, ontology)
    except (OSError, json.JSONDecodeError, ExtractionError) as error:
        print(error, file=sys.stderr)
        return 1
    print(json.dumps({"sourceHash": batch.source_hash, "sourceVersionId": batch.source_version_id, "claimIdentities": batch.claim_identities}, indent=2))
    return 0
