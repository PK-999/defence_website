# Defence corpus research work log

Audience: SENTINEL editors and readers. Scope: Indian wars, battles, operations and key participants from 1947 through 9 September 2026; relevant pre-independence biography; equipment of Army, Navy and Air Force, including historical variants; all six requested gallantry decorations, including eligible police and civilian recipients. Public historical deployment and dated fleet totals are in scope. Unknown specifications and unavailable biographies remain explicit gaps.

Deliverables: structured research data and a readable reference workbook, with a report, source provenance and coverage reconciliation. Candidate records are not automatically published or written to the application database. Completeness requires an identified source universe and reconciliation, not a large row count.

The required update_plan tool was searched for and is unavailable. This file is the planning fallback. No subagents will be used, honoring the user's continuing instruction.

1. COMPLETE — Discover official registers, histories, service catalogs and existing data quality. Identify source universes and access constraints.
2. IN PROGRESS — Retrieve records and pursue gaps using award gazettes, official citations, service histories, manufacturers and dated parliamentary/PIB releases. Distinguish counts ordered, delivered, inducted, in inventory and serviceable.
3. PARTIAL — Current package preserves conflicts, repeat bars, distinct date meanings, variant applicability and role-qualified relationships. Full identity and gazette reconciliation remains outstanding. Coverage and gap matrix saved.
4. COMPLETE FOR CURRENT TRANCHE — Reference workbook, HTML report and structured-data archive created and checked. The full research request remains incomplete; no exhaustive claim is made.

Primary source classes: Gallantry Awards portal, Gazette of India, Ministry of Defence and service histories, President/PIB announcements, Parliament, DRDO and original manufacturers. Specialist databases support discovery and are labeled when used. No biographies, ranks, equipment quantities or combat links will be invented.

Discovery findings: the public portal's 431-page directory returned 4,310 rows but only 2,778 distinct IDs, including only 16 PVC IDs against the independently documented universe of 21. Its ordering is not a trustworthy enumeration boundary. Index dates also conflict with profile action-date labels. After reading the downloaded Website Policy, bulk profile harvesting was not started: section II restricts automated copying without permission, while section V separately permits attributed reproduction except third-party content. Further work uses Gazette/President/PIB and separately licensed discovery sources. Retain the initial index as incomplete source evidence, never an exhaustive roll.

## Saved checkpoint

Outputs: `outputs/defence-research-20260909/research-report.html`, `indian-defence-reference.xlsx`, `research-data.zip`. Canonical report text is `report-source.md`; structured observations are in `data/`; detailed remaining tasks and tests are in `implementation-and-tests.md`.

Current collection: 8,092 award observations across sources; 4,191 historical CSV rows; 329 official announcement events across 18 releases covering RD/ID 2018–2026; 21 primary PVC narrative briefs with separately sourced secondary life facts; 257 biography source profiles (242 with selected structured facts); 892 equipment discovery rows; 46 scoped primary equipment observations; 102 conflict/operation discovery rows; 21 equipment-operation links; 15 recent Army citation briefs; 14 documented evidence issues. These overlapping counts are not unique national totals.

Verification: 410 offline checks passed, including 346 cached source hashes. Workbook has 13 tabs, native tables/filters, frozen headings, formula-driven overview counts, and no matches in the formula-error scan. Visual samples reviewed on every tab; later corrected source-title and participation tabs rechecked. Report structure, 21 recipient sections, source-link syntax, ZIP integrity, JSON validity and output checksums checked. No claim of exhaustive historical fact verification. No app code or SQLite writes. No subagents used.

Resume with gazette reconciliation, biographies/citations beyond PVC, and Indian-variant specifications. Do not repeat completed discovery or recreate artifacts without substantive data changes. The President ceremony PDF is text-extracted but not fully converted into reviewed citation stories. The portal harvester is disabled after policy review. NCERT Veer Gatha and DRDO export catalogue retrievals failed and are recorded as unread sources.

Rebuild order after new sources: `extract_research.py` if table sources changed; `assemble_corpus.py`; `enrich_citations.py`; `primary_facts.py`; `pvc_profiles.py`; `verify_corpus.py`; workbook builder; `package_research.py`. The workbook builder is currently `/tmp/sentinel-corpus-workbook-20260909/build.mjs`, using bundled artifact-tool dependencies. Rebuild the checksum package after any workbook export. Keep original raw evidence and user changes intact.
