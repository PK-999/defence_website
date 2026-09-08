import os
import json
import yaml
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional

from dagster import asset, AssetExecutionContext, Config

# Initialize Prisma Client once
from prisma import Prisma
prisma = Prisma()

class ExtractionConfig(Config):
    source_slug: str

class ExtractedClaim(BaseModel):
    property: str = Field(description="The property being extracted, e.g., 'topSpeed' or 'endDate'. Must be from the approved ontology.")
    value: str = Field(description="The extracted factual value.")
    locator: str = Field(description="Where in the source this was found (e.g. 'Page 4, Paragraph 2').")
    quote: str = Field(description="The exact text quote from the source supporting this claim.")

class EntityClaims(BaseModel):
    entity_slug: str = Field(description="The slug of the entity this claim belongs to.")
    entity_type: str = Field(description="The type of entity (e.g., Equipment, Conflict, Person).")
    claims: List[ExtractedClaim]

class ExtractionResult(BaseModel):
    entities: List[EntityClaims]

@asset
def raw_source_document(context: AssetExecutionContext, config: ExtractionConfig) -> str:
    """
    Fetch the raw text or markdown of the source document.
    For MVP, we simulate reading a local markdown file based on the source slug.
    """
    # Attempt to load a sample document if it exists, otherwise return a dummy string.
    doc_path = Path(f"data/{config.source_slug}.md")
    if doc_path.exists():
        return doc_path.read_text()
    
    # Return some mock text for demonstration if file doesn't exist.
    context.log.warning(f"No document found at {doc_path}. Using mock data.")
    return "The HAL Tejas is an Indian single-engine, delta wing, light multirole fighter. It has a top speed of Mach 1.8 and was inducted into the Indian Air Force in 2016."

@asset
def candidate_claims(context: AssetExecutionContext, raw_source_document: str) -> dict:
    """
    Use an LLM to extract structured Candidate Claims from the raw source document,
    guided by the ontology.yaml configuration.
    """
    import ollama

    # Load ontology rules
    ontology_path = Path(__file__).parent / "config" / "ontology.yaml"
    if ontology_path.exists():
        ontology = yaml.safe_load(ontology_path.read_text())
    else:
        ontology = {"properties": {}}

    context.log.info(f"Loaded ontology with {len(ontology.get('properties', {}))} entity types.")

    prompt = f"""
    You are a meticulous military historian and data extraction agent.
    Extract facts from the following document based strictly on this allowed ontology:
    {json.dumps(ontology.get('properties', {}), indent=2)}

    DOCUMENT:
    {raw_source_document}
    
    Return the result strictly as a valid JSON object matching this schema:
    {{
      "entities": [
        {{
          "entity_slug": "string",
          "entity_type": "string",
          "claims": [
            {{
              "property": "string",
              "value": "string",
              "locator": "string",
              "quote": "string"
            }}
          ]
        }}
      ]
    }}
    """

    context.log.info("Calling Ollama API...")
    try:
        response = ollama.chat(
            model='llama3.1', # Defaulting to llama3.1 for general extraction
            messages=[{'role': 'user', 'content': prompt}],
            format='json'
        )
        result_json = json.loads(response['message']['content'])
        context.log.info(f"Extraction successful: {len(result_json.get('entities', []))} entities found.")
        return result_json
    except Exception as e:
        context.log.warning(f"Ollama extraction failed: {e}. Returning mock data.")
        return {
            "entities": [
                {
                    "entity_slug": "hal-tejas",
                    "entity_type": "Equipment",
                    "claims": [
                        {
                            "property": "topSpeed",
                            "value": "Mach 1.8",
                            "locator": "Mock Document, Sentence 2",
                            "quote": "It has a top speed of Mach 1.8"
                        }
                    ]
                }
            ]
        }

@asset
def database_sync(context: AssetExecutionContext, candidate_claims: dict, config: ExtractionConfig):
    """
    Take the structured JSON candidate claims and sync them to the Prisma database
    as 'CANDIDATE' status claims requiring human review.
    """
    import asyncio
    
    async def run_sync():
        await prisma.connect()
        try:
            # 1. Ensure the source exists in DB to attach evidence
            source = await prisma.source.find_unique(where={"slug": config.source_slug})
            if not source:
                context.log.error(f"Source {config.source_slug} not found in database. Cannot attach evidence.")
                return
            
            # Use the first version for simplicity
            source_version = await prisma.sourceversion.find_first(where={"sourceId": source.id})
            if not source_version:
                context.log.error(f"No SourceVersion found for source {config.source_slug}.")
                return

            for entity_data in candidate_claims.get("entities", []):
                slug = entity_data["entity_slug"]
                e_type = entity_data["entity_type"]
                
                # Try to find the entity in the flat tables
                entity_id = None
                if e_type == "Equipment":
                    e = await prisma.equipment.find_unique(where={"slug": slug})
                    if e: entity_id = e.id
                elif e_type == "Conflict":
                    e = await prisma.conflict.find_unique(where={"slug": slug})
                    if e: entity_id = e.id
                
                if not entity_id:
                    context.log.warning(f"Entity {slug} of type {e_type} not found. Skipping claims.")
                    continue
                
                # Insert Claims
                for claim_data in entity_data["claims"]:
                    # Create Evidence record
                    evidence = await prisma.evidence.create({
                        "sourceVersionId": source_version.id,
                        "locator": claim_data["locator"],
                        "quote": claim_data["quote"]
                    })
                    
                    # Create Claim record
                    claim = await prisma.claim.create({
                        "entityType": e_type,
                        "entityId": entity_id,
                        "property": claim_data["property"],
                        "value": claim_data["value"],
                        "verificationStatus": "UNVERIFIED",
                        "status": "CANDIDATE",
                        "evidence": {
                            "create": [{"evidenceId": evidence.id}]
                        }
                    })
                    context.log.info(f"Created CANDIDATE Claim {claim.id} for {e_type} {slug}: {claim_data['property']} = {claim_data['value']}")

        finally:
            await prisma.disconnect()
            
    asyncio.run(run_sync())
    return True
