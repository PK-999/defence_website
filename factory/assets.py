import json
import os
from pathlib import Path

import yaml
from dagster import AssetExecutionContext, Config, asset

from factory.extraction import ExtractionError, extract_candidates
from prisma import Prisma

prisma = Prisma()


class ExtractionConfig(Config):
    source_slug: str


def source_path(source_slug: str) -> Path:
    return Path(__file__).parent / "data" / f"{source_slug}.md"


def ontology() -> dict:
    return yaml.safe_load((Path(__file__).parent / "config" / "ontology.yaml").read_text(encoding="utf-8"))


@asset
def raw_source_document(context: AssetExecutionContext, config: ExtractionConfig) -> str:
    path = source_path(config.source_slug)
    if not path.is_file():
        raise ExtractionError(f"SOURCE_NOT_FOUND: {path}")
    return path.read_text(encoding="utf-8")


@asset
def candidate_claims(context: AssetExecutionContext, raw_source_document: str, config: ExtractionConfig) -> dict:
    model_name = os.environ.get("SENTINEL_EXTRACTION_MODEL")
    if not model_name:
        raise ExtractionError("MODEL_UNAVAILABLE: SENTINEL_EXTRACTION_MODEL is not configured")
    try:
        import ollama
    except Exception as error:
        raise ExtractionError("MODEL_UNAVAILABLE: Ollama adapter is unavailable") from error

    rules = ontology()
    prompt = json.dumps({"ontology": rules.get("properties", {}), "document": raw_source_document}, indent=2)

    def call_model(document: str):
        response = ollama.chat(model=model_name, messages=[{"role": "user", "content": prompt.replace(raw_source_document, document)}], format="json")
        return response["message"]["content"]

    batch = extract_candidates(source_path(config.source_slug), call_model, rules)
    context.log.info(f"Extraction successful: {len(batch.result.entities)} entities found.")
    return batch.result.model_dump()


@asset
def database_sync(context: AssetExecutionContext, candidate_claims: dict, config: ExtractionConfig):
    """Persist validated candidates atomically; any precondition failure aborts all writes."""
    import asyncio

    async def run_sync():
        await prisma.connect()
        try:
            source = await prisma.source.find_unique(where={"slug": config.source_slug})
            if not source:
                raise ExtractionError(f"SOURCE_VERSION_NOT_FOUND: source {config.source_slug}")
            source_version = await prisma.sourceversion.find_first(where={"sourceId": source.id})
            if not source_version:
                raise ExtractionError(f"SOURCE_VERSION_NOT_FOUND: version for {config.source_slug}")

            resolved: list[tuple[dict, str]] = []
            for entity_data in candidate_claims.get("entities", []):
                slug = entity_data["entity_slug"]
                entity_type = entity_data["entity_type"]
                entity_id = None
                if entity_type == "Equipment":
                    entity = await prisma.equipment.find_unique(where={"slug": slug})
                    entity_id = entity.id if entity else None
                elif entity_type == "Conflict":
                    entity = await prisma.conflict.find_unique(where={"slug": slug})
                    entity_id = entity.id if entity else None
                else:
                    raise ExtractionError(f"ENTITY_TYPE_UNSUPPORTED: {entity_type}")
                if not entity_id:
                    raise ExtractionError(f"ENTITY_NOT_FOUND: {entity_type}:{slug}")
                resolved.append((entity_data, entity_id))

            async with prisma.tx() as transaction:
                for entity_data, entity_id in resolved:
                    for claim_data in entity_data["claims"]:
                        evidence = await transaction.evidence.create(data={"sourceVersionId": source_version.id, "locator": claim_data["locator"], "quote": claim_data["quote"]})
                        claim = await transaction.claim.create(data={"entityType": entity_data["entity_type"], "entityId": entity_id, "property": claim_data["property"], "value": claim_data["value"], "verificationStatus": "UNVERIFIED", "status": "CANDIDATE", "evidence": {"create": [{"evidenceId": evidence.id}]}})
                        context.log.info(f"Created CANDIDATE Claim {claim.id} for {entity_data['entity_type']} {entity_data['entity_slug']}: {claim_data['property']}")
        finally:
            await prisma.disconnect()

    asyncio.run(run_sync())
    return True
