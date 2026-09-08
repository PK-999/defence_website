"""Fail-closed, deterministic candidate extraction primitives."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any, Callable

from pydantic import BaseModel, ConfigDict, Field, ValidationError


class ExtractionError(RuntimeError):
    """A recoverable extraction failure that must not enter publication state."""


class ExtractedClaim(BaseModel):
    model_config = ConfigDict(extra="forbid")
    property: str = Field(min_length=1)
    value: str = Field(min_length=1)
    locator: str = Field(min_length=1)
    quote: str = Field(min_length=1)


class EntityClaims(BaseModel):
    model_config = ConfigDict(extra="forbid")
    entity_slug: str = Field(min_length=1)
    entity_type: str = Field(min_length=1)
    claims: list[ExtractedClaim]


class ExtractionResult(BaseModel):
    model_config = ConfigDict(extra="forbid")
    entities: list[EntityClaims]


class CandidateBatch(BaseModel):
    source_hash: str
    source_version_id: str
    parser_version: str
    result: ExtractionResult
    claim_identities: list[str]


ModelCallable = Callable[[str], Any]


def _fail(code: str, detail: str) -> ExtractionError:
    return ExtractionError(f"{code}: {detail}")


def _parse_model_output(output: Any) -> ExtractionResult:
    if isinstance(output, str):
        try:
            output = json.loads(output)
        except json.JSONDecodeError as error:
            raise _fail("INVALID_EXTRACTION_SCHEMA", "model output is not JSON") from error
    try:
        return ExtractionResult.model_validate(output)
    except ValidationError as error:
        raise _fail("INVALID_EXTRACTION_SCHEMA", str(error)) from error


def _validate_result(result: ExtractionResult, document: str, ontology: dict[str, Any]) -> None:
    properties = {str(key).lower(): {str(value) for value in values} for key, values in (ontology.get("properties") or {}).items()}
    for entity in result.entities:
        allowed = properties.get(entity.entity_type.lower())
        if allowed is None:
            raise _fail("INVALID_EXTRACTION", f"entity type is not in ontology: {entity.entity_type}")
        for claim in entity.claims:
            if claim.property not in allowed:
                raise _fail("INVALID_EXTRACTION", f"property is not in ontology: {claim.property}")
            if claim.quote not in document:
                raise _fail("INVALID_EXTRACTION", f"quote is not present in captured source: {claim.locator}")


def extract_candidates(path: Path, model: ModelCallable | None, ontology: dict[str, Any], parser_version: str = "factory-extraction-v1") -> CandidateBatch:
    """Read, extract, validate, and fingerprint candidates before any persistence call."""

    if not path.is_file():
        raise _fail("SOURCE_NOT_FOUND", str(path))
    raw = path.read_bytes()
    document = raw.decode("utf-8")
    source_hash = hashlib.sha256(raw).hexdigest()
    source_version_id = hashlib.sha256(f"{source_hash}:{parser_version}".encode()).hexdigest()
    if model is None:
        raise _fail("MODEL_UNAVAILABLE", "no extraction model is configured")
    try:
        output = model(document)
    except Exception as error:
        raise _fail("MODEL_UNAVAILABLE", str(error)) from error
    result = _parse_model_output(output)
    _validate_result(result, document, ontology)
    identities = [
        hashlib.sha256(f"{source_version_id}:{entity.entity_type.lower()}:{entity.entity_slug}:{claim.property}:{claim.value}:{claim.locator}:{claim.quote}".encode()).hexdigest()
        for entity in result.entities
        for claim in entity.claims
    ]
    return CandidateBatch(source_hash=source_hash, source_version_id=source_version_id, parser_version=parser_version, result=result, claim_identities=identities)
