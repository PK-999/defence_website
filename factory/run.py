import sys
import os
import asyncio
from dagster import materialize, RunConfig
from assets import raw_source_document, candidate_claims, database_sync, ExtractionConfig

os.environ["DATABASE_URL"] = "file:../prisma/dev.db"

async def seed_mock_data():
    from prisma import Prisma
    db = Prisma()
    await db.connect()
    
    # Ensure source exists
    source_family = await db.sourcefamily.upsert(
        where={"slug": "drdo"},
        data={
            "create": {"name": "DRDO", "slug": "drdo", "tier": "A", "description": "Defense Research"},
            "update": {}
        }
    )
    
    source = await db.source.upsert(
        where={"slug": "drdo-tejas-brochure-2023"},
        data={
            "create": {
                "title": "Tejas LCA Brochure",
                "slug": "drdo-tejas-brochure-2023",
                "author": "DRDO",
                "family": {"connect": {"id": source_family.id}},
                "versions": {
                    "create": [{
                        "versionTag": "v1.0"
                    }]
                }
            },
            "update": {}
        }
    )

    # Ensure Equipment exists
    await db.equipment.upsert(
        where={"slug": "hal-tejas"},
        data={
            "create": {
                "title": "HAL Tejas",
                "slug": "hal-tejas",
                "domain": "Air",
                "category": "Fighter Aircraft",
                "summary": "Light Combat Aircraft",
                "status": "Active",
                "developmentModel": "Indigenous",
                "serviceStatus": "Deployed",
                "specs": "{}",
                "originCountries": "[\"India\"]"
            },
            "update": {}
        }
    )
    await db.disconnect()

if __name__ == "__main__":
    asyncio.run(seed_mock_data())
    
    # Create the config mapping for all assets that require the ExtractionConfig
    config_dict = {
        "ops": {
            "raw_source_document": {
                "config": {"source_slug": "drdo-tejas-brochure-2023"}
            },
            "database_sync": {
                "config": {"source_slug": "drdo-tejas-brochure-2023"}
            }
        }
    }
    
    result = materialize(
        [raw_source_document, candidate_claims, database_sync],
        run_config=config_dict
    )
    
    if result.success:
        print("Pipeline materialized successfully!")
        sys.exit(0)
    else:
        print("Pipeline failed!")
        sys.exit(1)
