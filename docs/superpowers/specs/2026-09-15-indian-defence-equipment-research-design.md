# Indian Defence Equipment Research Scraper Design

**Goal:** Produce a source-attributed snapshot of Indian Army, Navy, and Air Force equipment and weapon systems covering historical, active, and future/proposed systems.

**Scope:** This is a research artifact generator, not a publication/import into the SENTINEL Prisma database. The supplied Wikipedia pages are the initial source set; the registry also includes relevant future-programme pages and can be extended without changing the parser.

## Source and evidence policy

- Preserve every parsed source table as raw CSV with source URL, page key, table index, row number, and retrieval timestamp.
- Keep source wording for quantities, dates, status, specifications, and notes alongside normalized fields.
- Do not infer service status, quantities, dates, dimensions, or specifications when the source omits them.
- Use separate status values for active/in service, reserve, retired/decommissioned, historical, ordered, under construction, under development, planned, proposed, and trials.
- Treat a future programme as a system record only when a source names the programme/system; retain `source_status` and `status_as_of` so “future” is not presented as current service.

## Canonical output

The normalized CSV/JSON records contain:

`record_id`, `branch`, `domain`, `category`, `system_name`, `designation`, `variant`, `role_purpose`, `status`, `source_status`, `status_as_of`, `commissioned_or_inducted_date`, `retired_or_decommissioned_date`, `quantity`, `quantity_min`, `quantity_max`, `quantity_raw`, `quantity_values`, `specifications`, `dimensions`, `make_manufacturer`, `country_of_origin`, `operators`, `notes`, `source_key`, `source_url`, `source_table`, `source_row`, `retrieved_at`, `raw_record`.

The audit layer adds `verification_status` and `verification_sources`. These fields identify whether a matching curated official claim exists; they do not imply that every source-table field has been independently confirmed. Official-source additions are emitted as `official_supplement` records so they remain distinguishable from table extraction.

Dates use ISO text in the data artifact (`YYYY-MM-DD` or the source precision when only a year/month is stated). The website formatter can localize them later.

Quantities preserve the raw phrase and expose numeric bounds only when a number is stated. Ranges, “on order”, “planned”, and “in service” remain distinguishable through `quantity_raw` and `status`.

## Runtime and outputs

`src/equipment_scratch.py` uses `requests` for HTTP and `pandas.read_html` for standard `wikitable` extraction. It supports retries, timeouts, a polite delay, optional local HTML cache, and atomic output writes. It emits:

- `indian_military_data/raw/*.csv` — one file per source table;
- `indian_military_data/equipment_records.csv`;
- `indian_military_data/equipment_records.json`;
- `indian_military_data/source_manifest.json`;
- `indian_military_data/run_report.json`.
- `indian_military_data/official_verification.csv` and `.json` — curated primary-source claims from DRDO and the Ministry of Defence / PIB.

The raw table columns are not discarded when they do not fit the canonical schema; they are preserved under `raw_record` and in the raw CSV. Every raw CSV row also carries `source_key`, `source_url`, `source_table`, `source_row`, and `retrieved_at`.

The supplied source set has no authoritative, standalone historical Army inventory. A supplemental secondary-source Army legacy page is registered to capture additional phased-out/retired records, while the output continues to label undocumented status as `Not documented` rather than inventing historical state.

The official-source audit is additive: it records claims and selected current procurement/commissioning updates without overwriting the table wording. Where no credible public primary source was available for a field or historical inventory slice, the dataset retains `Not documented` or `not_independently_verified` rather than presenting an inference as fact.

## Validation

Tests cover multi-index flattening, citation/newline cleanup, status mapping, date normalization, quantity bounds, deterministic IDs, canonical mapping, source provenance, atomic output, and HTTP failure handling. A live run must report source/table/row counts and refuse to overwrite canonical outputs when no rows were extracted.
