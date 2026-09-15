# Indian defence equipment source audit

Audit date: 15 September 2026 (UTC)

Collector: `src/equipment_scratch.py`

Output: [the generated research snapshot](../../indian_military_data/README.md)

## Executive conclusion

The refreshed snapshot contains 1,413 in-scope records from 12 registered source pages and 114 parsed tables. It covers named Army, Navy, and Air Force equipment, weapons, aircraft, ships, missiles, historical systems, and future programmes. The collection is source-attributed and reproducible, but it is not presented as a single authoritative order of battle: public sources do not provide one complete, primary-source inventory with every quantity, dimension, date, and variant across all three services.

The audit therefore uses a two-layer evidence model:

1. Source tables are retained verbatim enough for review, with normalized fields, raw fields, source URL, table, row, and retrieval timestamp.
2. A separate official-evidence layer contains 15 claims from DRDO and the Ministry of Defence / Press Information Bureau (PIB), plus 14 additive supplement records for recent procurement, trial, and commissioning updates. These supplements do not silently overwrite table-derived rows.

The generated data reports 64 table-derived rows with a matching official claim, 14 official supplement rows, and 1,335 table-derived rows without a matching curated primary-source claim. That last category is an explicit research gap, not a claim that the rows are false. Missing dates, dimensions, quantities, or specifications remain `Not documented`.

The display taxonomy uses only `army`, `navy`, and `airforce` as primary service domains. For cross-service rows, the first source-listed service is retained as the primary `domain`, while all applicable services are authoritative in `service_domains` and marked with `joint-service`. `service_status` is restricted to `Deployed`, `Decommissioned`, and `Planned`; the original normalized lifecycle state remains in `status` and the source wording remains in `source_status`.

## Source hierarchy and scope

The primary-source checks prioritize official DRDO product pages and PIB/Ministry of Defence releases. These are used for current service status, intended role, procurement quantities, trial outcomes, and recent commissioning dates. The broad inventory remains based on the registered source pages because no public official consolidated inventory was found during this audit.

Registered broad-coverage sources are:

- current Army equipment and infantry equipment pages;
- active and historical Indian Air Force aircraft pages;
- Indian Air Force future-programme and weapon-system pages;
- active, historical, future, and weapon-system Indian Navy pages;
- the cross-service Indian military missile page;
- a separately marked Fandom API page used only to supplement Army legacy coverage.

The Fandom page is a secondary source and is not treated as primary verification. The active-aircraft page contains Coast Guard rows; those are retained in raw output for auditability but excluded from the Army/Navy/Air Force canonical export.

## Official evidence findings

| Area | Official finding | Dataset action |
| --- | --- | --- |
| Akash | DRDO describes Akash as inducted and operational with the Army and Air Force and identifies its short-range surface-to-air role. [^1] | Added an official claim and marks matching rows `official_claim_available`. |
| BrahMos | DRDO identifies the jointly developed system as land-, sea-, and air-launched and operational with the Navy and Army. [^2] | Added an official claim; source-table fields remain unchanged. |
| MRSAM | DRDO states that MRSAM was developed for the IAF and Army Air Defence and that firing units were delivered to both. [^3] | Added an official users/status claim. |
| Guided Pinaka | DRDO reports development/qualification activity and a trial-team recommendation for induction, while upgraded launchers remained under evaluation. [^4] | Preserved the distinction between development/trials and completed induction. |
| LCA Tejas Mk1A | PIB reports a 97-aircraft contract dated 25 September 2025, with deliveries scheduled from 2027–28. [^5] | Added a 97-aircraft `on_order` supplement; it is not counted as an in-service fleet. |
| ACADA | PIB reports a 25 February 2025 contract for 223 systems and identifies the DRDO design organization and L&T procurement. [^6] | Added a 223-system Army `on_order` supplement. |
| ATAGS | PIB reports March 2025 contracts for 155 mm/52 calibre ATAGS and towing vehicles, intended to replace vintage smaller-calibre guns. [^7] | Added an Army `on_order` supplement; quantity remains not documented because the cited release does not state it. |
| NAMIS (Tr) | PIB reports the tracked anti-tank platform contract and its mechanized-infantry modernization purpose. [^8] | Added an Army `on_order` supplement without inventing quantity. |
| Nag Mk 2 | PIB reports successful field evaluation trials and says the system was ready for induction. [^9] | Added an Army `under_trials` supplement; “ready for induction” is not treated as completed induction. |
| INVAR | PIB reports a November 2025 contract for T-90 anti-tank missiles. [^10] | Added an Army `on_order` supplement; quantity and delivery schedule remain not documented. |
| INS Surat, INS Nilgiri, INS Vaghsheer | PIB reports that all three were commissioned on 15 January 2025. [^11] | Added one named-ship/submarine supplement per platform with the official commissioning date. |
| INS Arnala | PIB reports commissioning on 18 June 2025, ASW shallow-water role, 77 m length, and displacement above 1,490 tonnes. [^12] | Added a named-vessel supplement with role and dimensions; corrected active-page context so the active Arnala class is not labelled historical merely because a note mentions the former class it replaces. |
| INS Nistar | PIB reports commissioning on 18 July 2025 and its indigenous deep-sea diving/rescue role. [^13] | Added a named-vessel supplement. |
| INS Tamal | PIB reports commissioning on 1 July 2025 and identifies it as a Project 1135.6/Tushil-class multi-role stealth frigate. [^14] | Added a named-ship supplement. |
| INS Udaygiri and INS Himgiri | PIB reports both commissions on 26 August 2025 as Project 17A stealth frigates. [^15] | Added one named-ship supplement for each platform. |

## Normalization corrections applied

- `Intr.`, introduction, inducted, commissioned, and service-from fields are mapped to `commissioned_or_inducted_date` without inventing day/month precision.
- Phased-out wording is normalized to `decommissioned_or_retired`; under-construction wording is kept distinct from planned-only wording.
- Multiple explicit quantity values are preserved in `quantity_values`; `quantity_min` and `quantity_max` are only bounds visible in the source phrase.
- Source context is used carefully: active Navy and Air Force pages can set an in-service context, while historical pages retain historical context. A historical note about a predecessor class no longer overrides an active source context.
- Raw source rows are still written even when a row is excluded from the canonical export, and extraction fails closed if any registered source fails before canonical files are replaced.

## Limitations that remain

The result should not be described as a fully verified inventory or as a complete historical Army list. The registered public sources do not provide an authoritative standalone historical Army inventory, and open official releases do not publish every technical field for every legacy or future item. Quantities may represent in-service units, orders, variants, named vessels, or source-specific counts; the raw phrase and status fields must be read together.

The official claims are targeted audit evidence, not a claim that the other 1,335 table-derived rows are independently verified. For publication, the next research pass should add system-level primary-source citations for each high-value row, reconcile duplicate class/name records, and refresh dynamic procurement and service status. The dataset deliberately leaves gaps visible so future enrichment can be audited rather than silently replacing uncertainty.

## Reproducibility

Run:

```bash
/tmp/sentinel-equipment-scraper-venv/bin/python src/equipment_scratch.py \
  --output-dir indian_military_data --delay 0.5 --no-cache
```

The official claims are in [official_verification.csv](../../indian_military_data/official_verification.csv) and [official_verification.json](../../indian_military_data/official_verification.json). The full normalized output is [equipment_records.csv](../../indian_military_data/equipment_records.csv); source-specific raw tables are under [raw](../../indian_military_data/raw/).

## Primary sources

[^1]: [DRDO — Akash](https://drdo.gov.in/drdo/en/offerings/products/akash)
[^2]: [DRDO — BrahMos](https://drdo.gov.in/drdo/en/offerings/products/brahmos)
[^3]: [DRDO — MRSAM](https://drdo.gov.in/drdo/en/offerings/products/mrsam)
[^4]: [DRDO — Guided Pinaka Rocket System](https://drdo.gov.in/drdo/en/offerings/products/guided-pinaka-rocket-system)
[^5]: [PIB — 97 LCA Mk1A aircraft contract](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2171108&lang=2&reg=3)
[^6]: [PIB — ACADA contract](https://www.pib.gov.in/pressreleasepage.aspx?lang=2&prid=2106362&reg=48)
[^7]: [PIB — ATAGS and HMV 6x6 contracts](https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=2115365&lang=2&reg=48)
[^8]: [PIB — NAMIS Tracked and light vehicles contracts](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2115804&lang=2&reg=48&s=09)
[^9]: [PIB — Nag Mk 2 field evaluation trials](https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2092585&lang=2&reg=48)
[^10]: [PIB — INVAR anti-tank missile contract](https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2189725&lang=2&reg=48)
[^11]: [PIB — INS Surat, INS Nilgiri and INS Vaghsheer](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2093018&lang=1&reg=20)
[^12]: [PIB — INS Arnala](https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=2137263&lang=2&reg=48)
[^13]: [PIB — INS Nistar](https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2145766)
[^14]: [PIB — INS Tamal](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2141361&lang=2&reg=48)
[^15]: [PIB — INS Udaygiri and INS Himgiri](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2160941&lang=1&reg=37)
