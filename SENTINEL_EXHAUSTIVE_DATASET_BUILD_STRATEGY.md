# SENTINEL --- Exhaustive Dataset Build Strategy

## Coding-Agent Implementation Specification

**Purpose:** Build the durable data asset behind SENTINEL: a versioned,
provenance-rich, source-first knowledge base of publicly documented
Indian military history, people, units, awards, equipment, institutions,
defence industry, programmes, documents, media and evidence.

**Immediate rule:** Do not start by crawling the web. Build the
ontology, provenance model, source registry, validation framework and
two Golden Datasets first.

------------------------------------------------------------------------

# 1. Non-negotiable architecture

SENTINEL must preserve this chain:

``` text
SOURCE FAMILY
    ↓
SOURCE
    ↓
SOURCE VERSION
    ↓
DOCUMENT / MEDIA
    ↓
EVIDENCE
    ↓
CANDIDATE CLAIM
    ↓
EDITORIAL REVIEW
    ↓
VERIFIED CLAIM
    ↓
ENTITY + TEMPORAL RELATIONSHIP
    ↓
STORY / DATASET / WEBSITE / WAR ROOM / FUTURE RAG
```

AI output is always **candidate data**, never verified truth.

The public website consumes **Gold/verified data**, not crawler output.

The long-term moat is not article count. It is:

``` text
trusted sources
+ claim-level evidence
+ stable entity IDs
+ temporal relationships
+ source lineage
+ measurable coverage
+ correction history
```

------------------------------------------------------------------------

# 2. What "exhaustive" means

Absolute exhaustiveness is impossible. Use **bounded exhaustiveness**.

Every domain must define:

-   universe;
-   inclusion criteria;
-   exclusions;
-   known records;
-   source-complete records;
-   reviewed records;
-   unresolved gaps;
-   last review date.

Example:

``` yaml
id: AIRCRAFT_INDIAN_SERVICE
definition: >
  Publicly documented aircraft types and major Indian-service variants
  historically or currently operated by the Indian Armed Forces/Coast Guard.
include:
  - active
  - retired
  - historically_operated
  - publicly_acknowledged_development
exclude:
  - rumor_only
  - speculative_future_acquisition
  - sensitive_current_configuration
```

Internal coverage:

``` text
known universe       240
records created      219
source complete      205
editorially reviewed 188
```

Never publicly claim "100% complete" unless the universe is finite and
authoritative.

------------------------------------------------------------------------

# 3. Coverage universe

## History

-   conflicts
-   campaigns
-   operations
-   battles
-   missions
-   notable historical incidents
-   ceasefires/treaties when relevant
-   peacekeeping
-   evacuation
-   HADR/rescue
-   historical locations
-   memorials/museums

## People

-   gallantry recipients
-   historically important commanders
-   documented participants
-   service chiefs
-   notable aircrew/sailors/soldiers
-   defence scientists/designers where relevant
-   oral-history/interview subjects

## Organization

-   Ministry of Defence
-   Department of Military Affairs
-   Army/Navy/Air Force
-   Coast Guard as its own institution
-   commands/formations/regiments/battalions/squadrons
-   commissioned ships where modeled as units
-   publicly documented specialist formations
-   DRDO/labs
-   DPSUs/shipyards
-   training institutions where relevant

Do not flatten Armed Forces, Coast Guard and CAPFs into one category.

## Awards

Start with: - Param Vir Chakra - Maha Vir Chakra - Vir Chakra - Ashoka
Chakra - Kirti Chakra - Shaurya Chakra

Expand only from authoritative award registries.

## Arsenal

Air, land, sea, missiles, major weapons, sensors/electronics and support
systems using only publicly appropriate data.

## Industry

-   DRDO programmes
-   DPSUs
-   shipyards
-   relevant private manufacturers
-   development programmes
-   joint development
-   licence production
-   major publicly documented foreign partnerships

## Archive

-   official documents
-   Parliament
-   gazettes
-   gallantry citations
-   audit reports
-   annual reports
-   archival catalogue records
-   books
-   academic papers
-   reputable journalism
-   photographs
-   maps
-   interviews
-   audio/video
-   datasets

------------------------------------------------------------------------

# 4. Safety boundary

SENTINEL is an educational/historical archive, not an
operational-intelligence product.

Do not create or publish aggregated datasets of:

-   live troop locations;
-   live military aircraft/ship tracking for operational awareness;
-   current readiness states;
-   ammunition/storage locations;
-   sensitive facility layouts;
-   current special-force locations;
-   exploitable vulnerabilities;
-   non-public personnel data;
-   sensitive maintenance/readiness deficiencies;
-   data whose primary utility is real-time targeting or operational
    awareness.

Location precision:

``` text
exact
approximate
regional
historical_only
unknown
```

Prefer coarse historical precision when exact coordinates add little
educational value.

------------------------------------------------------------------------

# 5. Canonical ontology

Initial entity types:

``` text
conflict
campaign
operation
battle
event
incident
location
person
award
rank
service
organization
unit
formation
equipment_family
equipment_model
equipment_variant
ship_class
ship
programme
manufacturer
laboratory
document
media
story
collection
dataset
```

Do not create unnecessary types when `entity + category` is sufficient.

Stable IDs must not depend on display names:

``` text
conflict:kargil-1999
operation:operation-vijay-1999
award:param-vir-chakra
org:drdo
equipment:su-30mki
```

Never recycle IDs.

------------------------------------------------------------------------

# 6. Core schemas

## SourceFamily

``` python
class SourceFamily:
    id: str
    name: str
    base_url: str
    organization_type: str
    country: str | None
    default_tier: str
    authority_type: str
    ingestion_mode: str
    api_available: bool
    robots_reviewed_at: datetime | None
    terms_reviewed_at: datetime | None
    copyright_policy: str | None
    rate_limit_policy: str | None
    active: bool
    notes: str | None
```

## Source

``` python
class Source:
    id: str
    source_family_id: str
    title: str
    canonical_url: str | None
    publisher: str
    author: str | None
    published_at: date | None
    accessed_at: datetime
    source_type: str
    source_tier: str
    language: str
    license: str | None
    rights_notes: str | None
    archive_url: str | None
    status: str
```

## SourceVersion

``` python
class SourceVersion:
    id: str
    source_id: str
    retrieved_at: datetime
    http_status: int | None
    mime_type: str | None
    content_hash_sha256: str
    raw_storage_uri: str | None
    parser_version: str | None
```

Never overwrite a prior source version.

## Evidence

``` python
class Evidence:
    id: str
    source_version_id: str
    locator: str | None
    evidence_type: str
    excerpt: str | None
    summary: str | None
    page_number: int | None
    section_heading: str | None
    table_id: str | None
    timestamp_start: float | None
    timestamp_end: float | None
    language: str
    rights_safe_to_display: bool
    reviewer_notes: str | None
```

Evidence must let a researcher locate the material again.

## Claim

``` python
class Claim:
    id: str
    subject_entity_id: str
    predicate: str
    value_type: str
    value_json: object
    object_entity_id: str | None
    valid_from: date | None
    valid_to: date | None
    verification_status: str
    editorial_note: str | None
    reviewed_at: datetime | None
```

Statuses:

``` text
CANDIDATE
OFFICIALLY_CONFIRMED
MULTIPLE_CREDIBLE_SOURCES
DECLASSIFIED_RECORD
DISPUTED
SOURCE_CONFLICT
UNVERIFIED
REJECTED
```

## ClaimEvidence

``` python
class ClaimEvidence:
    claim_id: str
    evidence_id: str
    stance: str  # supports | contradicts | contextualizes
```

## Relationship

``` python
class Relationship:
    id: str
    subject_entity_id: str
    predicate: str
    object_entity_id: str
    valid_from: date | None
    valid_to: date | None
    claim_id: str | None
    status: str
```

Initial predicates:

``` text
PART_OF
INVOLVED_IN
PARTICIPATED_IN
SERVED_IN
COMMANDED
OPERATED_BY
USED_IN
AWARDED
AWARDED_FOR
OCCURRED_AT
DEVELOPED_BY
MANUFACTURED_BY
DESIGNED_BY
VARIANT_OF
MEMBER_OF_CLASS
PRECEDED_BY
SUCCEEDED_BY
REPLACED_BY
SUPPORTED_BY
RELATED_TO
DEPICTS
TAKEN_AT
```

------------------------------------------------------------------------

# 7. Entity aliases and resolution

``` python
class EntityAlias:
    id: str
    entity_id: str
    alias: str
    alias_type: str
    language: str
    valid_from: date | None
    valid_to: date | None
    source_id: str | None
```

Alias types:

``` text
official_name
former_name
short_name
abbreviation
transliteration
common_name
service_designation
manufacturer_designation
misspelling
```

Resolution:

``` text
exact canonical
→ known alias
→ structured identifier
→ contextual match
→ fuzzy candidate
→ human review
```

Never merge solely on fuzzy similarity.

------------------------------------------------------------------------

# 8. Temporal modeling

Relationships can change.

Use:

``` text
Unit → MEMBER_OF → Command
valid_from
valid_to
evidence
```

rather than one timeless `command_id`.

Apply temporal modeling to:

-   unit hierarchy;
-   ranks;
-   appointments;
-   equipment operators;
-   service status;
-   programme status;
-   names;
-   ship commissioning/decommissioning;
-   induction/retirement.

------------------------------------------------------------------------

# 9. Equipment model

Hierarchy:

``` text
CATEGORY
  ↓
FAMILY
  ↓
MODEL
  ↓
VARIANT
  ↓
INDIAN-SERVICE CONFIGURATION
```

Important specifications are claims, not orphan scalars.

Bad:

``` text
range_km = 3000
```

Good:

``` yaml
subject: equipment:example
predicate: ferry_range
value: 3000
unit: km
qualifier: manufacturer_public_configuration
evidence_ids:
  - evidence:123
```

Distinguish: - ferry range - combat radius - maximum range - speed -
ceiling - payload - dimensions - crew - propulsion - sensors - armament
compatibility

Never collapse semantically different values into one "range".

------------------------------------------------------------------------

# 10. Event model

Flexible hierarchy:

``` text
Conflict
  ↓
Campaign
  ↓
Operation
  ↓
Battle / Mission / Event
  ↓
Action
```

Evacuation, HADR, rescue, peacekeeping and maritime-security operations
must have their own categories rather than being forced into a battle
model.

------------------------------------------------------------------------

# 11. Media model

``` python
class Media:
    id: str
    media_type: str
    title: str | None
    creator: str | None
    created_at: date | None
    source_id: str
    license: str | None
    copyright_status: str
    credit_line: str | None
    original_url: str
    local_derivative_uri: str | None
    alt_text: str
    caption: str | None
```

Relationships:

``` text
Media → DEPICTS → Entity
Media → TAKEN_AT → Location
Media → RELATED_TO → Event
```

Do not scrape Google Images.

------------------------------------------------------------------------

# 12. Source authority

## Tier A --- primary/authoritative

Government, MoD, service sites, Coast Guard, PIB, Parliament, India
Code/Gazette where applicable, CAG, National Archives, official
gallantry citations, official annual reports and official
DPSU/manufacturer material for first-party company claims.

## Tier B --- institutional/technical

UN, reputable foreign government archives, official foreign
military/manufacturer records, established public research institutes.

## Tier C --- scholarly/high-quality secondary

Peer-reviewed research, university presses, established
historians/books, major reputable journalism.

## Tier D --- specialist

Established specialist defence/history publications after editorial
review.

## Discovery only

Wikipedia, social media, forums, random blogs/videos and unattributed
infographics.

Discovery material can generate a research task. It cannot establish a
material claim by itself.

------------------------------------------------------------------------

# 13. Trusted source registry --- researched seed list

**Before automating any source:** inspect robots.txt, terms,
copyright/access policy, pagination, rate limits and whether an
API/export exists. Trusted does not mean permission to mirror.

## Government / MoD

  ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  Source            URL                                                                                                                                                                                   Primary use               Tier
  ----------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- ------------------------- -----------------
  Ministry of       https://www.mod.gov.in/                                                                                                                                                               Ministry documents,       A
  Defence                                                                                                                                                                                                 policy, institutional     
                                                                                                                                                                                                          material                  

  Department of     https://www.mod.gov.in/dod                                                                                                                                                            DoD material              A
  Defence                                                                                                                                                                                                                           

  Department of     https://www.dmamod.gov.in/                                                                                                                                                            DMA                       A
  Military Affairs                                                                                                                                                                                        documents/institutional   
                                                                                                                                                                                                          material                  

  Department of     https://www.ddpmod.gov.in/                                                                                                                                                            DPSUs, production,        A
  Defence                                                                                                                                                                                                 exports, indigenisation,  
  Production                                                                                                                                                                                              annual reports            

  DDP DPSU          https://www.ddpmod.gov.in/our-organizations/defence-public-sector-undertakings                                                                                                        Canonical DPSU registry   A
  directory                                                                                                                                                                                                                         

  Department of     https://www.desw.gov.in/                                                                                                                                                              Veterans/institutional    A
  Ex-Servicemen                                                                                                                                                                                           reports                   
  Welfare                                                                                                                                                                                                                           

  MoD/DDP Annual    https://www.ddpmod.gov.in/sites/default/files/f8e94bda5b77b0d965c38149f88e92d60cd38ff431611165edca1c59b99653ff/4fd1090a4871149c4845f914894dca251728a192696dcf1d284a02fb51618c3d.pdf   MoD structure,            A
  Report 2024-25                                                                                                                                                                                          programmes, DPSUs         

  Press Information https://www.pib.gov.in/                                                                                                                                                               Dated official releases   A
  Bureau                                                                                                                                                                                                                            
  ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

PIB records should preserve PRID when available.

## Parliament / law

  ---------------------------------------------------------------------------------------------------------
  Source            URL                                             Use                   Tier
  ----------------- ----------------------------------------------- --------------------- -----------------
  Parliament        https://eparlib.sansad.in/                      Debates, committee    A
  Digital Library                                                   reports, historical   
                                                                    documents             

  Committee Reports https://eparlib.sansad.in/handle/123456789/13   Standing Committee on A
                                                                    Defence               

  Sansad            https://sansad.in/                              Current parliamentary A
                                                                    resources/questions   

  India Code        https://www.indiacode.nic.in/                   Defence legislation   A
  ---------------------------------------------------------------------------------------------------------

Parliamentary answers are excellent dated official evidence. Preserve
question date, ministry and answer context.

## National Archives

  ---------------------------------------------------------------------------------------------------------------------------------------------
  Source            URL                                                                              Use                      Tier
  ----------------- -------------------------------------------------------------------------------- ------------------------ -----------------
  National Archives https://www.nationalarchives.nic.in/                                             Archival authority       A
  of India                                                                                                                    

  Abhilekh Patal    https://www.nationalarchives.nic.in/en/online-portal-abhilekh-patal              Catalogue/digitisation   A
  info                                                                                               guidance                 

  Abhilekh Patal    https://www.abhilekh-patal.in/                                                   Archival                 A
                                                                                                     catalogue/digitised      
                                                                                                     records                  

  NAI Reference     https://www.nationalarchives.nic.in/en/research-and-references/reference-tools   Guides to holdings       A
  Tools                                                                                              including military       
                                                                                                     records                  
  ---------------------------------------------------------------------------------------------------------------------------------------------

NAI describes Abhilekh Patal as a large and expanding digital
repository. Build a catalogue adapter before document-scale extraction.

## Armed Forces / Coast Guard

  -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  Source            URL                                                                                                            Use                                Tier
  ----------------- -------------------------------------------------------------------------------------------------------------- ---------------------------------- -----------------
  Indian Army       https://indianarmy.nic.in/                                                                                     Official Army                      A
                                                                                                                                   history/institutional material     

  India.gov Army    https://www.india.gov.in/category/defence-foreign-affairs/subcategory/defence/details/website-of-indian-army   Resolve official Army site if      A
  directory                                                                                                                        domain changes                     

  Join Indian Navy  https://www.joinindiannavy.gov.in/                                                                             Official Navy institutional        A
                                                                                                                                   material                           

  Indian Air Force  https://careerairforce.gov.in/                                                                                 Official IAF material              A
  portal                                                                                                                                                              

  IAF History       https://careerairforce.gov.in/indian-air-force-history                                                         Official historical chronology     A

  Indian Coast      https://indiancoastguard.gov.in/                                                                               Official ICG material              A
  Guard                                                                                                                                                               

  ICG History       https://indiancoastguard.gov.in/history                                                                        Formation/history/ships/aviation   A
                                                                                                                                   milestones                         
  -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

For service URLs that change, resolve the canonical destination through
MoD/DMA/India.gov.in rather than guessing.

## Gallantry / awards

  -------------------------------------------------------------------------------------------
  Source            URL                                   Use               Tier
  ----------------- ------------------------------------- ----------------- -----------------
  Gallantry Awards  https://www.gallantryawards.gov.in/   Chakra-series     A
                                                          awardees, units,  
                                                          years, citations, 
                                                          photographs       

  National Awards   https://www.awards.gov.in/            Broader           A
  Portal                                                  government award  
                                                          cross-checking    
  -------------------------------------------------------------------------------------------

The dedicated Gallantry Awards portal should be preferred for gallantry
records.

## DRDO

  -------------------------------------------------------------------------------------------------------------
  Source            URL                                                 Use                   Tier
  ----------------- --------------------------------------------------- --------------------- -----------------
  DRDO              https://www.drdo.gov.in/                            Canonical R&D         A
                                                                        institution           

  DRDO Products     https://drdo.gov.in/drdo/en/offerings/products      Public                A
                                                                        products/programmes   

  DRDO Publications https://drdo.gov.in/drdo/en/documents/publication   Technology Focus and  A
                                                                        publications          
  -------------------------------------------------------------------------------------------------------------

Do not infer classified capability from public technical material.

## Defence industry / DPSUs

Use DDP's DPSU directory as the canonical organization registry.

  -----------------------------------------------------------------------------------------------------------------------
  Source                  URL                                                    Use
  ----------------------- ------------------------------------------------------ ----------------------------------------
  HAL                     https://www.hal-india.co.in/                           Aircraft/helicopters/manufacturing/R&D

  HAL Products            https://www.hal-india.co.in/products                   Product catalogue

  HAL Annual Reports      https://hal-india.co.in/investors/annual-report/home   Company history/production/business
                                                                                 records

  BEL                     https://bel-india.in/                                  Defence electronics

  BEL Defence             https://bel-india.in/defence/                          Product categories

  BDL                     https://bdl-india.in/                                  Missile/weapon manufacturer

  BDL Products            https://bdl-india.in/products                          Public product catalogue

  Mazagon Dock            https://mazagondock.in/                                Warships/submarines

  GRSE                    https://grse.in/                                       Warships/shipbuilding

  Goa Shipyard            https://www.goashipyard.in/                            Naval/Coast Guard shipbuilding

  Goa Shipyard Products   https://www.goashipyard.in/our-products                Product catalogue
  -----------------------------------------------------------------------------------------------------------------------

Company sources are Tier A for what the company officially states about
itself/products, but do not use marketing claims alone to establish
combat effectiveness.

Seed remaining DPSUs from:
https://www.ddpmod.gov.in/our-organizations/defence-public-sector-undertakings

Resolve their current official domains programmatically/manual-review
before adding adapters.

## Budget / audit / open data

  ---------------------------------------------------------------------------------------
  Source            URL                               Use               Tier
  ----------------- --------------------------------- ----------------- -----------------
  India Budget      https://www.indiabudget.gov.in/   Official defence  A
                                                      expenditure       
                                                      documents         

  CAG               https://cag.gov.in/               Defence audits    A

  Open Government   https://www.data.gov.in/          Government        A/B
  Data                                                datasets/APIs     
  ---------------------------------------------------------------------------------------

Budget extraction must distinguish: - Budget Estimate - Revised
Estimate - Actual where present - Revenue - Capital - Pensions - demand
number - financial year

CAG findings must be represented as findings of a specific audit, not
silently converted into timeless assertions.

## International / research

  -----------------------------------------------------------------------------------------------------------------------------------
  Source            URL                                                                   Use                       Tier
  ----------------- --------------------------------------------------------------------- ------------------------- -----------------
  UN Peacekeeping   https://peacekeeping.un.org/en/india                                  India's UN peacekeeping   A
  --- India                                                                               record                    

  UN Peacekeeping   https://peacekeeping.un.org/                                          Mission records           A

  SIPRI Databases   https://www.sipri.org/databases                                       Arms/military datasets    B

  SIPRI Arms        https://www.sipri.org/databases/armstransfers                         Major conventional arms   B
  Transfers                                                                               transfers since 1950      

  SIPRI interactive https://armstransfers.sipri.org/                                      Transfer registers/CSV    B
  DB                                                                                      tools                     

  SIPRI methodology https://www.sipri.org/databases/armstransfers/sources-and-methods     Definitions/limitations   B

  World Bank        https://data.worldbank.org/indicator/MS.MIL.XPND.GD.ZS?locations=IN   Macro series sourced from B
  military                                                                                SIPRI                     
  expenditure India                                                                                                 

  MP-IDSA           https://idsa.in/                                                      Defence/security research B/C

  MP-IDSA Military  https://idsa.in/topics/military-history                               Military-history research B/C
  History                                                                                                           

  MP-IDSA           https://idsa.in/publications                                          Books/monographs/briefs   B/C
  Publications                                                                                                      

  MP-IDSA Journals  https://idsa.in/journal                                               Scholarly research        C
  -----------------------------------------------------------------------------------------------------------------------------------

SIPRI cautions that its TIV measures transfer volume and is **not a
sales price**. Preserve SIPRI uncertainty conventions and review its
fair-use terms before redistribution.

## Secondary-source families

Register individually after editorial review: - peer-reviewed
journals; - university presses; - established military historians; -
Reuters; - The Hindu; - The Indian Express; - BBC; - other established
outlets with strong editorial standards; - specialist defence
publications approved by the editorial policy.

For history, prefer primary records + contemporaneous reporting +
scholarly synthesis over retrospective click-driven coverage.

------------------------------------------------------------------------

# 14. Data zones

``` text
BRONZE / RAW
    ↓
SILVER / NORMALIZED
    ↓
CANDIDATE / MACHINE EXTRACTED
    ↓
GOLD / VERIFIED
```

## Bronze

Immutable source capture/metadata. Bronze is not truth.

## Silver

Parsed documents, sections, tables, normalized dates/names/units.

## Candidate

Machine-proposed entities, aliases, claims and relationships.

## Gold

Reviewed, publishable knowledge.

------------------------------------------------------------------------

# 15. Recommended stack

Start lightweight:

``` text
Python 3.12+
Pydantic
httpx
BeautifulSoup/lxml
Playwright only when required
PyMuPDF
Polars
DuckDB
Parquet
PostgreSQL
dbt
Dagster
pytest
ruff
mypy
```

Object storage: S3-compatible; MinIO is acceptable locally.

Do not add Spark until scale proves a need.

Do not add Neo4j until graph workloads prove a need. PostgreSQL can
model relationships effectively for a long time.

------------------------------------------------------------------------

# 16. Repository structure

``` text
sentinel-data/
├── README.md
├── pyproject.toml
├── docker-compose.yml
├── Makefile
├── docs/
│   ├── architecture.md
│   ├── ontology.md
│   ├── source-policy.md
│   ├── editorial-policy.md
│   ├── safety-policy.md
│   ├── ingestion-policy.md
│   └── runbooks/
├── schemas/
├── config/
│   ├── source_families.yaml
│   ├── predicates.yaml
│   ├── entity_types.yaml
│   ├── ranks.yaml
│   ├── awards.yaml
│   └── safety_rules.yaml
├── ingestion/
│   ├── base.py
│   ├── pib/
│   ├── mod/
│   ├── parliament/
│   ├── gallantry/
│   ├── national_archives/
│   ├── drdo/
│   ├── dpsu/
│   ├── cag/
│   ├── budget/
│   ├── un/
│   └── sipri/
├── parsing/
├── normalization/
├── resolution/
├── extraction/
├── review/
├── quality/
├── pipelines/
├── dbt/
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── fixtures/
│   └── golden/
└── data/
    └── .gitkeep
```

Do not commit large/raw copyrighted source collections to Git.

------------------------------------------------------------------------

# 17. PostgreSQL tables

Minimum:

``` text
source_families
sources
source_versions
documents
document_sections
entities
entity_aliases
locations
evidence
claims
claim_evidence
relationships
media
media_entities
review_tasks
review_decisions
coverage_domains
coverage_items
dataset_builds
pipeline_runs
```

Later:

``` text
source_lineage
citations
story_entities
collections
translations
embeddings
```

------------------------------------------------------------------------

# 18. Storage

Bronze:

``` text
bronze/
  source_family=<id>/
    year=<yyyy>/
      month=<mm>/
        <source_id>/
          metadata.json
          source.bin
```

SHA-256 every artifact.

Silver should use Parquet for normalized analytical data.

Every Gold build emits:

``` json
{
  "dataset_version": "YYYY.MM.patch",
  "built_at": "...",
  "schema_version": "...",
  "pipeline_commit": "...",
  "source_snapshot": "...",
  "validation_status": "passed"
}
```

Failed validation blocks publication.

------------------------------------------------------------------------

# 19. Adapter contract

``` python
class SourceAdapter(Protocol):
    def discover(self, cursor=None) -> list[DiscoveredSource]: ...
    def fetch(self, source) -> RawArtifact: ...
    def metadata(self, artifact) -> SourceMetadata: ...
    def parse(self, artifact) -> ParsedDocument: ...
```

Adapters never write Gold claims.

Before enabling:

``` text
[ ] source identity verified
[ ] robots.txt reviewed
[ ] terms/access reviewed
[ ] copyright handling documented
[ ] API/export checked first
[ ] conservative rate limit set
[ ] retry/backoff configured
[ ] canonical URL logic tested
[ ] pagination tested
[ ] duplicate behavior tested
[ ] 20-record pilot manually reviewed
```

Never bypass authentication, CAPTCHAs or access controls.

------------------------------------------------------------------------

# 20. PDF/document pipeline

``` text
PDF
→ metadata
→ native text
→ layout blocks
→ sections
→ tables/figures
→ extraction quality
→ OCR only when native extraction is unusable
```

Preserve page numbers, headings, tables, captions and footnotes.

Do not flatten long reports into one text blob.

Document intelligence:

``` text
DOCUMENT
→ PARSE
→ SECTION
→ RULES
→ NER
→ ENTITY LINKING
→ CANDIDATE CLAIMS
→ CANDIDATE RELATIONSHIPS
→ DEDUPLICATION
→ REVIEW
```

------------------------------------------------------------------------

# 21. Token-efficient AI extraction

Order:

``` text
deterministic parser
→ regex/rules
→ alias dictionaries
→ NER/small model
→ LLM for ambiguous sections
→ human review
```

LLM requests must include: - exact task; - allowed predicates; - allowed
entity types; - candidate IDs; - source locator; - strict JSON schema; -
explicit instruction to return UNKNOWN rather than guess.

Cache by:

``` text
source_version_hash + prompt_version + model_version
```

LLM confidence is triage only.

------------------------------------------------------------------------

# 22. Deduplication and source lineage

Deduplicate at: - canonical URL; - source version; - document; -
paragraph; - sentence; - claim; - media perceptual hash where
appropriate.

Track:

``` text
SOURCE B → DERIVED_FROM → SOURCE A
SOURCE C → SYNDICATED_FROM → SOURCE A
```

Five articles repeating one wire report are not five independent
confirmations.

Use: - hashes; - sentence similarity; - attribution; - timestamps; -
known syndication.

------------------------------------------------------------------------

# 23. Contradictions

Never average conflicting historical claims.

``` text
CLAIM A ← evidence/source A
CLAIM B ← evidence/source B
status = SOURCE_CONFLICT
```

Public UI can later show:

``` text
PUBLIC SOURCES DIFFER
Official source A states ...
Source B reports ...
```

Final resolution requires stronger evidence/editorial review.

------------------------------------------------------------------------

# 24. Measurement normalization

Store:

``` text
original_value
original_unit
normalized_value
normalized_unit
measurement_type
qualifier
evidence
```

Preserve: - approximately; - reportedly; - maximum; - estimated; -
source-specific conditions.

Never manufacture precision.

------------------------------------------------------------------------

# 25. Review strategy

Mandatory human review: - casualties; - controversial events; -
quotations; - allegations; - disputed territorial/history claims; -
exact coordinates; - hero narratives; - current capability claims; -
sensitive-looking material; - claims supported only by secondary
sources.

Medium: - equipment metadata; - unit history; - organization/programme
relationships.

Low: - hashes; - MIME type; - URL metadata; - deterministic file
metadata.

------------------------------------------------------------------------

# 26. Research queue

Automatically create tasks:

``` text
HIGH
- person missing official citation
- event has conflicting date
- equipment induction lacks authoritative evidence
- map precision unsupported
- media rights unknown

MEDIUM
- entity has one secondary source only
- alias unresolved

LOW
- optional summary missing
- secondary tags incomplete
```

The gap queue is how SENTINEL becomes progressively exhaustive.

------------------------------------------------------------------------

# 27. Coverage dashboard

Required internal metrics:

``` text
entities by type
claims by status
relationships by predicate
sources by tier/family
evidence per claim
orphan entities
entities without Tier A/B evidence
unresolved aliases
source conflicts
broken URLs
coverage by domain
review queue
pipeline freshness
AI cost
```

Do not optimize for article count.

------------------------------------------------------------------------

# 28. Quality tests

Referential:

``` text
claim.subject exists
evidence.source_version exists
relationship subject/object exist
media.source exists
```

Temporal:

``` text
end >= start
death >= birth
retirement >= induction
decommission >= commission
```

Publication:

``` text
published entity has source
verified claim has evidence
equipment spec has evidence
public media has rights status
public media has alt text
```

Uniqueness: - IDs; - slugs per namespace; - source hashes.

Safety flags: - suspiciously precise current military coordinates; -
live operational feeds; - unsupported readiness claims; - prohibited
aggregation categories.

Anomalies create review tasks; they never silently mutate data.

------------------------------------------------------------------------

# 29. Golden Dataset 1 --- Kargil

Before scalable crawling, build a deep Kargil corpus.

Illustrative target:

``` text
1 conflict
major named operations
30–50 events
~50 people
~30 units/formations
~30 relevant systems
~30 historical locations
~200 sources
500–1,000 evidence records
1,000–2,000 claims
500+ relationships
```

Test: - timeline; - geography; - people; - awards; - unit aliases; -
equipment; - air/land relationships; - conflicting sources; -
citations; - media; - War Room needs.

Exit gate: representative facts trace reliably:

``` text
entity → claim → evidence → source
```

------------------------------------------------------------------------

# 30. Golden Dataset 2 --- 1971

1971 must test: - multiple theatres; - Army/Navy/Air Force; - larger
chronology; - naval operations; - air operations; - international/UN
material; - broader geography; - larger equipment universe; -
political/strategic context.

After Kargil + 1971, write:

``` text
docs/golden-dataset-findings.md
```

Then revise/freeze ontology for scale.

**Automation comes after these two datasets.**

------------------------------------------------------------------------

# 31. Expansion waves

``` text
Wave 0  Ontology
Wave 1  Canonical registries
Wave 2  Kargil Golden Dataset
Wave 3  1971 Golden Dataset
Wave 4  Scalable ingestion framework
Wave 5  1947–48 / 1962 / 1965 / major campaigns
Wave 6  Gallantry + People
Wave 7  Arsenal
Wave 8  Units/formations
Wave 9  Industry/programmes
Wave 10 Archive/media
Wave 11 Long tail
Wave 12 Continuous gap closure/corrections
```

Canonical registries include: - services; - ranks; - awards; -
conflicts; - operation categories; - equipment taxonomy; -
organizations; - source families.

------------------------------------------------------------------------

# 32. Campaign-pack research

Never research randomly.

Example:

``` text
1971
├── context
├── theatres
├── operations
├── events
├── people
├── units
├── equipment
├── locations
├── documents
├── photographs
└── sources
```

One research effort should create a dense connected cluster.

------------------------------------------------------------------------

# 33. Coverage matrices

Conflict:

``` text
overview
context
timeline
operations
events
map
people
units
equipment
primary_sources
media
story_experience
```

Equipment:

``` text
service
domain
category
era
status
family
variant
operator
induction
retirement
manufacturer
development_model
spec_source_coverage
service_history
```

Person:

``` text
service
rank
unit
award
conflict
operation
citation
biographical_source
portrait_rights
```

Suggested prioritization:

``` text
historical significance 30%
coverage gap            20%
source availability     20%
connection density      15%
educational value       10%
audience interest        5%
```

------------------------------------------------------------------------

# 34. Versioning and releases

Use:

``` text
Git            → code/schemas/config/light reviewed records
Object storage → permitted raw artifacts
PostgreSQL     → operational knowledge
Parquet        → analytical snapshots
```

Every release records: - dataset version; - schema version; - pipeline
version; - Git commit; - source snapshot; - build time; - quality
report.

Potential safe public datasets later:

``` text
sentinel-conflicts
sentinel-operations
sentinel-gallantry
sentinel-aircraft-history
sentinel-naval-vessels
sentinel-equipment
sentinel-sources
```

Every public row should expose: - SENTINEL ID; - source IDs; - last
verified; - dataset version; - licence.

Never republish third-party copyrighted datasets merely because they
were used as evidence.

------------------------------------------------------------------------

# 35. Copyright / rights

For every source family record:

``` text
can_store_raw
can_display_excerpt
can_display_thumbnail
can_redistribute
attribution_required
commercial_restrictions
notes
```

Publicly accessible does not mean freely redistributable.

For copyrighted books/news: - store bibliographic metadata; - use
legally appropriate short excerpts/notes; - link to the source; - do not
mirror the work.

------------------------------------------------------------------------

# 36. Observability and cost

Every pipeline run logs:

``` text
run_id
source_family
start/end
discovered
fetched
changed
parse_success/failure
candidate_claims
review_tasks
errors
AI model/tokens/cost
```

Alert on: - source disappearance; - parser failure spike; - zero-record
anomaly; - schema drift; - source-domain change; - duplicate spike; -
excessive AI cost.

Cost rules: 1. API/export before scrape. 2. Incremental discovery. 3.
Hash before reprocessing. 4. Cache parsing. 5. Cache LLM output. 6.
Rules before AI. 7. Small models before large models. 8. No blanket OCR.
9. No blanket embeddings. 10. Track cost per verified claim.

------------------------------------------------------------------------

# 37. Required CLI

``` bash
sentinel sources list
sentinel sources validate
sentinel ingest discover <source-family>
sentinel ingest fetch <source-id>
sentinel parse <source-version-id>
sentinel extract <document-id>
sentinel review queue
sentinel review show <task-id>
sentinel validate
sentinel coverage refresh
sentinel coverage report
sentinel build gold
sentinel export parquet
sentinel export website
```

High-risk claims cannot bypass review.

------------------------------------------------------------------------

# 38. Implementation stages

## Stage 1 --- Foundation

Python project, CI, Postgres, lint/typecheck/tests, local
infrastructure.

## Stage 2 --- Schemas

Implement and test all core Pydantic models.

## Stage 3 --- Database

Migrations, foreign keys, uniqueness and state constraints.

## Stage 4 --- Source registry

Seed the researched sources in this document. No crawlers.

## Stage 5 --- Bronze

Immutable storage, SHA-256, manifests.

## Stage 6 --- Generic parsing

HTML/PDF parsers tested on committed fixtures.

## Stage 7 --- First official adapter

Choose a structurally simple source; 20-record pilot only.

## Stage 8 --- Gallantry

High-value canonical early dataset. Output Candidate records only.

## Stage 9 --- Review workflow

Candidate → reviewed → Gold, with reviewer metadata.

## Stage 10 --- Kargil

Build the first Golden Dataset.

## Stage 11 --- Validation

Block Gold publication on failures.

## Stage 12 --- 1971

Build the second Golden Dataset.

## Stage 13 --- Ontology retrospective

Document schema changes.

## Stage 14 --- Orchestration

Introduce Dagster.

## Stage 15 --- Transformations

Introduce dbt models/tests.

## Stage 16 --- Coverage engine

Machine-readable completeness and gap generation.

## Stage 17 --- Source expansion

Priority: 1. PIB 2. Parliament 3. MoD/DDP reports 4. DRDO 5. service
sites 6. DPSUs 7. CAG 8. National Archives catalogue 9. Budget 10.
UN/SIPRI

## Stage 18 --- Internal review UI

Only after CLI workflow is stable.

## Stage 19 --- Coverage dashboard

## Stage 20 --- Website export/API

Expose Gold data to SENTINEL.

------------------------------------------------------------------------

# 39. Adapter definition of done

``` text
[ ] family registered
[ ] access policy documented
[ ] 20-record pilot reviewed
[ ] discovery tested
[ ] pagination tested
[ ] retries tested
[ ] canonical URLs tested
[ ] versioning tested
[ ] parser tested
[ ] duplicates tested
[ ] conservative rate limit
[ ] no direct Gold writes
[ ] observability
[ ] deterministic fixtures
[ ] integration tests
```

------------------------------------------------------------------------

# 40. Dataset-release definition of done

``` text
[ ] schema validation
[ ] referential integrity
[ ] Gold claims have evidence
[ ] source links checked
[ ] rights checks
[ ] safety checks
[ ] coverage report
[ ] conflicts preserved/labeled
[ ] build manifest
[ ] reproducible build documented
```

------------------------------------------------------------------------

# 41. Anti-patterns

Never:

``` text
crawl millions of pages first
generate articles first
trust LLM confidence
invent citations
average conflicting claims
count copied sources as corroboration
store important specs without evidence
auto-merge fuzzy entities
publish Candidate data
aggregate sensitive current information because it is public
add Neo4j just because this is a graph
add Spark just because this is data engineering
build RAG before evidence quality is mature
```

------------------------------------------------------------------------

# 42. Future RAG preparation

Do not build RAG now.

Future indexable objects:

``` text
entity summary
verified claim
evidence summary
source metadata
document section
```

Future answer path:

``` text
QUESTION
→ ENTITY RESOLUTION
→ CLAIM RETRIEVAL
→ EVIDENCE
→ SOURCE
→ ANSWER
→ CITATION VALIDATION
```

This is superior to embedding only long editorial articles.

------------------------------------------------------------------------

# 43. First 90 days

## Weeks 1--2

-   repo
-   ontology
-   schemas
-   Postgres
-   tests
-   source registry
-   Bronze

## Weeks 3--4

-   parsers
-   Candidate/Gold states
-   review CLI
-   first official adapter

## Weeks 5--7

-   Kargil Golden Dataset
-   evidence review
-   entity-resolution fixes

## Week 8

-   Kargil retrospective

## Weeks 9--11

-   1971 Golden Dataset
-   multi-service/theatre modeling

## Week 12

-   ontology freeze for scale phase
-   Dagster/dbt plan
-   adapter backlog
-   coverage baseline

Do not optimize for record count during the first 90 days.

Optimize for the correctness of the knowledge model.

------------------------------------------------------------------------

# 44. Coding-agent prompt

``` text
You are the lead data-platform engineer for SENTINEL.

Read `SENTINEL_EXHAUSTIVE_DATASET_BUILD_STRATEGY.md` completely and treat it as the data-program source of truth.

Do NOT start crawling websites.

First:
1. inspect the repository;
2. report the current stack;
3. identify conflicts with this specification;
4. create `docs/data-implementation-plan.md`;
5. design exact Pydantic models and PostgreSQL tables;
6. design the SourceFamily registry;
7. design tests and migrations;
8. identify the minimum local infrastructure.

Mandatory implementation order:

Ontology/schema
→ Source Registry
→ Validation
→ Bronze/Silver/Candidate/Gold
→ Kargil Golden Dataset
→ 1971 Golden Dataset
→ ontology review
→ scalable ingestion.

AI output is Candidate data only.
No adapter may directly create verified Gold claims.
No adapter may bypass access/rights review.

Do not initially build:
- RAG/vector search;
- Neo4j;
- Spark;
- CMS;
- large crawling cluster.

Write tests before critical behavior.

For each stage report:
- files changed;
- tests added;
- commands run;
- results;
- risks.

Start with repository inspection and `docs/data-implementation-plan.md`.
```

------------------------------------------------------------------------

# 45. Implementation prompt after plan approval

``` text
Proceed with the approved `docs/data-implementation-plan.md`.

Work in small verified slices.

For each task:
1. state files in scope;
2. add/update tests first;
3. implement the smallest correct solution;
4. run tests;
5. run lint/type checking;
6. update docs;
7. record schema decisions.

For every source adapter:
- confirm SourceFamily registration;
- confirm access-policy review;
- run a 20-record pilot;
- save deterministic fixtures;
- test pagination/retries/hashes/duplicates;
- output Candidate records only.

Stop and report instead of guessing if:
- source terms are unclear;
- identity is ambiguous;
- claims conflict;
- material appears operationally sensitive;
- the schema cannot represent the source faithfully.
```

------------------------------------------------------------------------

# 46. North-star test

The data platform should eventually answer, for any important fact:

``` text
What do we know?
How do we know it?
Which source says it?
Where exactly does it say it?
Does another credible source disagree?
When was this true?
Which entities are connected?
How complete is our coverage?
When was this last reviewed?
```

If those questions are reliably answerable, SENTINEL's website, War
Rooms, Data Lab, research tools and future AI become downstream
engineering problems rather than trust problems.

**Build the evidence system first. Scale second.**
