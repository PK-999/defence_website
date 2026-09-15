# Indian Defence Equipment Research Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and run a standalone Python scraper that produces an auditable Army, Navy, and Air Force equipment dataset from active, historical, and future programme sources.

**Architecture:** `src/equipment_scratch.py` owns source fetching, table cleanup, canonical normalization, and atomic artifact output. Raw tables, normalized records, source manifest, and run report remain in `indian_military_data/` and are not imported into the public Prisma database.

**Tech Stack:** Python 3, pandas, requests, lxml, unittest, CSV, JSON.

**Spec:** `docs/superpowers/specs/2026-09-15-indian-defence-equipment-research-design.md`

## Global Constraints

- Preserve raw source text and provenance for every output row.
- Never guess missing quantities, dates, status, dimensions, or specifications.
- Separate active, historical, retired/decommissioned, ordered, under-construction, development, planned, proposed, and trials states.
- Refuse to overwrite canonical output if the run extracts zero rows.
- Do not modify the existing SQLite database or public publication pipeline.

---

### Task 1: Define the parser contract with failing tests

**Files:**
- Create: `tests/python/test_equipment_scratch.py`
- Test: `src/equipment_scratch.py` import and pure helpers

**Interfaces:**
- Tests consume `clean_cell`, `flatten_columns`, `normalise_status`, `normalise_date`, `parse_quantity`, `canonical_record_id`, and `build_canonical_record`.

- [ ] **Step 1: Write focused failing tests**

```python
class EquipmentHelpersTests(unittest.TestCase):
    def test_clean_cell_removes_wikipedia_citations_and_whitespace(self):
        self.assertEqual(clean_cell("  120\n tonnes [12]  "), "120 tonnes")

    def test_flatten_columns_preserves_multi_index_headers(self):
        frame = pd.DataFrame([["T-90", "India"]], columns=pd.MultiIndex.from_tuples([("System", "Name"), ("Origin", "Country")]))
        self.assertEqual(list(flatten_columns(frame).columns), ["System | Name", "Origin | Country"])

    def test_status_and_date_are_normalized_without_guessing(self):
        self.assertEqual(normalise_status("In service"), "in_service")
        self.assertEqual(normalise_status("4 under construction, 1 planned"), "under_construction_and_planned")
        self.assertEqual(normalise_date("June 2026"), "2026-06")
        self.assertEqual(normalise_date("date unknown"), "Not documented")

    def test_quantity_keeps_raw_text_and_numeric_bounds(self):
        self.assertEqual(parse_quantity("12 in service; 6 on order"), (12, 12, "12 in service; 6 on order"))
        self.assertEqual(parse_quantity("40–80 planned"), (40, 80, "40–80 planned"))
        self.assertEqual(parse_quantity("N/A"), (None, None, "N/A"))

    def test_canonical_record_contains_source_and_raw_fields(self):
        record = build_canonical_record({"Aircraft": "Tejas", "Variant": "Mk1A", "Units": "141", "Status": "On order"}, source_key="iaf_future", source_url="https://example.test", table_index=2, row_index=3, retrieved_at="2026-09-15T00:00:00Z")
        self.assertEqual(record["system_name"], "Tejas")
        self.assertEqual(record["status"], "on_order")
        self.assertEqual(record["quantity"], 141)
        self.assertEqual(record["source_table"], 2)
        self.assertEqual(record["source_row"], 3)
        self.assertEqual(record["raw_record"]["Variant"], "Mk1A")
```

- [ ] **Step 2: Run the test and confirm the expected missing-module failure**

Run: `python3 -m unittest tests/python/test_equipment_scratch.py`

Expected: FAIL because `src.equipment_scratch` does not exist yet.

### Task 2: Implement source registry, parsing, normalization, and outputs

**Files:**
- Create: `src/equipment_scratch.py`
- Create: `requirements-equipment-scraper.txt`

**Interfaces:**
- Produces the pure helper functions from Task 1 plus `scrape_source`, `run_scrape`, and `main`.
- CLI flags: `--output-dir`, `--delay`, `--timeout`, `--retries`, `--cache-dir`, `--source`, and `--no-cache`.

- [ ] **Step 1: Add pinned scraper dependencies**

```text
pandas>=2.2,<3
requests>=2.31,<3
lxml>=5,<7
```

- [ ] **Step 2: Implement source registry and HTTP fetcher**

Register the supplied pages plus future-programme pages with explicit branch/domain/source keys. Use a `requests.Session`, a descriptive user agent, retries for 429/5xx/network errors, timeout enforcement, optional cache files, and retrieval timestamps.

- [ ] **Step 3: Implement table cleanup and provenance**

Flatten `MultiIndex` headers, remove only citation markers such as `[12]` and `[lower-alpha 1]`, collapse whitespace, preserve raw column names, and attach `source_key`, `source_url`, `source_table`, and `source_row` to every row.

- [ ] **Step 4: Implement conservative canonical mapping**

Map common source headers into the canonical schema. Use source text to derive status, date precision, and quantity bounds; retain the raw values. Store unmatched source columns in `raw_record`.

- [ ] **Step 5: Write raw and canonical artifacts atomically**

Write one raw CSV per source table, combined `equipment_records.csv`/`.json`, `source_manifest.json`, and `run_report.json`. Fail before replacement if no rows were extracted.

### Task 3: Run and validate the live collection

**Files:**
- Create: `indian_military_data/raw/*.csv`
- Create: `indian_military_data/equipment_records.csv`
- Create: `indian_military_data/equipment_records.json`
- Create: `indian_military_data/source_manifest.json`
- Create: `indian_military_data/run_report.json`

**Interfaces:** The generated artifacts are the handoff for later review/import; no application code reads them automatically.

- [ ] **Step 1: Create an isolated environment and install the scraper requirements**

Run: `python3 -m venv /tmp/sentinel-equipment-scraper-venv` followed by `/tmp/sentinel-equipment-scraper-venv/bin/pip install -r requirements-equipment-scraper.txt`.

- [ ] **Step 2: Run the scraper against all registered sources**

Run: `/tmp/sentinel-equipment-scraper-venv/bin/python src/equipment_scratch.py --output-dir indian_military_data --delay 0.5`.

Expected: raw tables and canonical artifacts are written, with nonzero per-source row counts and a report containing retrieval timestamps and errors, if any.

- [ ] **Step 3: Validate output integrity**

Run: `/tmp/sentinel-equipment-scraper-venv/bin/python -m unittest discover -s tests/python -p 'test_*.py'`, then parse the canonical CSV and JSON to confirm equal row counts, unique `record_id` values, source URLs on every record, and no blank canonical fields.

- [ ] **Step 4: Review the diff and preserve unrelated work**

Run: `git diff --check` and `git status --short`; do not stage or remove unrelated existing changes, databases, caches, or research artifacts.
