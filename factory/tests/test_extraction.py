import json
from pathlib import Path

import pytest

from factory.extraction import ExtractionError, extract_candidates


ONTOLOGY = {"properties": {"equipment": ["topSpeed"], "person": ["birthDate"]}}


def valid_model(_: str) -> dict:
    return {"entities": [{"entity_slug": "hal-tejas", "entity_type": "Equipment", "claims": [{"property": "topSpeed", "value": "Mach 1.8", "locator": "paragraph 1", "quote": "The top speed is Mach 1.8."}]}]}


def test_missing_document_fails_before_model_or_persistence(tmp_path: Path) -> None:
    with pytest.raises(ExtractionError, match="SOURCE_NOT_FOUND"):
        extract_candidates(tmp_path / "missing.md", valid_model, ONTOLOGY)


def test_model_failure_is_explicit_and_never_uses_mock_claims(tmp_path: Path) -> None:
    document = tmp_path / "source.md"
    document.write_text("A reviewed source.")

    def unavailable(_: str) -> dict:
        raise RuntimeError("model offline")

    with pytest.raises(ExtractionError, match="MODEL_UNAVAILABLE"):
        extract_candidates(document, unavailable, ONTOLOGY)


def test_schema_property_and_quote_are_validated_against_source(tmp_path: Path) -> None:
    document = tmp_path / "source.md"
    document.write_text("The top speed is Mach 1.8.")

    def invalid(_: str) -> str:
        return json.dumps({"entities": [{"entity_slug": "hal-tejas", "entity_type": "equipment", "claims": [{"property": "range", "value": "unknown", "locator": "paragraph 1", "quote": "not in source"}]}]})

    with pytest.raises(ExtractionError, match="INVALID_EXTRACTION"):
        extract_candidates(document, invalid, ONTOLOGY)


def test_replay_has_stable_source_version_and_claim_identities(tmp_path: Path) -> None:
    document = tmp_path / "source.md"
    document.write_text("The top speed is Mach 1.8.")
    first = extract_candidates(document, lambda _: {"entities": [{"entity_slug": "hal-tejas", "entity_type": "Equipment", "claims": [{"property": "topSpeed", "value": "Mach 1.8", "locator": "paragraph 1", "quote": "The top speed is Mach 1.8."}]}]}, ONTOLOGY)
    second = extract_candidates(document, valid_model, ONTOLOGY)
    assert first.source_hash == second.source_hash
    assert first.source_version_id == second.source_version_id
    assert first.claim_identities == second.claim_identities
