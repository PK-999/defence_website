import csv
import json
import tempfile
import unittest
from pathlib import Path

import pandas as pd
import requests

from src.equipment_scratch import (
    SOURCE_REGISTRY,
    build_canonical_record,
    canonical_record_id,
    clean_cell,
    extract_wikitable_frames,
    flatten_columns,
    is_header_like_row,
    normalise_date,
    normalise_status,
    parse_quantity,
    parse_quantity_values,
    run_scrape,
)
from src.equipment_official import OFFICIAL_CLAIMS, OFFICIAL_SUPPLEMENT_RECORDS


class _FakeResponse:
    def __init__(self, html):
        self.text = html
        self.content = html.encode("utf-8")

    def raise_for_status(self):
        return None


class _FakeSession:
    def __init__(self, html, failing_keys=()):
        self.html = html
        self.failing_keys = set(failing_keys)

    def get(self, url, timeout):
        if "list_of_active_indian_military_aircraft" in url.casefold() and "iaf_active_aircraft" in self.failing_keys:
            raise requests.RequestException("simulated source failure")
        if "fandom.com/api.php" in url:
            return _FakeResponse(json.dumps({"parse": {"text": {"*": self.html}}}))
        return _FakeResponse(self.html)


class EquipmentHelpersTests(unittest.TestCase):
    def test_clean_cell_removes_wikipedia_citations_and_whitespace(self):
        self.assertEqual(clean_cell("  120\n tonnes [12]  "), "120 tonnes")

    def test_flatten_columns_preserves_multi_index_headers(self):
        frame = pd.DataFrame(
            [["T-90", "India"]],
            columns=pd.MultiIndex.from_tuples(
                [("System", "Name"), ("Origin", "Country")]
            ),
        )

        self.assertEqual(
            list(flatten_columns(frame).columns),
            ["System | Name", "Origin | Country"],
        )

    def test_status_and_date_are_normalized_without_guessing(self):
        self.assertEqual(normalise_status("In service"), "in_service")
        self.assertEqual(
            normalise_status("4 under construction, 1 planned"),
            "under_construction_and_planned",
        )
        self.assertEqual(normalise_status("Under construction"), "under_construction")
        self.assertEqual(normalise_status("Phased out"), "decommissioned_or_retired")
        self.assertEqual(normalise_date("June 2026"), "2026-06")
        self.assertEqual(normalise_date("date unknown"), "Not documented")

    def test_quantity_keeps_raw_text_and_numeric_bounds(self):
        self.assertEqual(
            parse_quantity("12 in service; 6 on order"),
            (6, 12, "12 in service; 6 on order"),
        )
        self.assertEqual(parse_quantity_values("124 (Mk 1) 2 (Mk 1A)"), [124, 2])
        self.assertEqual(parse_quantity("40–80 planned"), (40, 80, "40–80 planned"))
        self.assertEqual(parse_quantity("N/A"), (None, None, "N/A"))

    def test_canonical_record_contains_source_and_raw_fields(self):
        raw = {
            "Aircraft": "Tejas",
            "Variant": "Mk1A",
            "Units": "141",
            "Status": "On order",
        }

        record = build_canonical_record(
            raw,
            source_key="iaf_future",
            source_url="https://example.test",
            table_index=2,
            row_index=3,
            retrieved_at="2026-09-15T00:00:00Z",
        )

        self.assertEqual(record["system_name"], "Tejas")
        self.assertEqual(record["status"], "on_order")
        self.assertEqual(record["quantity"], 141)
        self.assertEqual(record["source_table"], 2)
        self.assertEqual(record["source_row"], 3)
        self.assertEqual(record["raw_record"]["Variant"], "Mk1A")
        self.assertEqual(record["source_status"], "On order")
        self.assertEqual(record["verification_status"], "not_independently_verified")

    def test_record_id_is_stable_for_the_same_source_row(self):
        self.assertEqual(
            canonical_record_id("army_equipment", 4, 12),
            canonical_record_id("army_equipment", 4, 12),
        )
        self.assertNotEqual(
            canonical_record_id("army_equipment", 4, 12),
            canonical_record_id("army_equipment", 4, 13),
        )

    def test_header_rows_from_repeated_wiki_headers_are_skipped(self):
        columns = ["Submarine | Class", "Submarine | Boat", "Submarine | Comm."]
        self.assertTrue(
            is_header_like_row(
                {"Submarine | Class": "Class", "Submarine | Boat": "Boat", "Submarine | Comm.": "Comm."},
                columns,
            )
        )
        self.assertTrue(
            is_header_like_row(
                {"Submarine | Class": "Attack submarine (16)", "Submarine | Boat": "Attack submarine (16)", "Submarine | Comm.": "Attack submarine (16)"},
                columns,
            )
        )
        self.assertFalse(
            is_header_like_row(
                {"Submarine | Class": "Kalvari class", "Submarine | Boat": "INS Kalvari", "Submarine | Comm.": "2017"},
                columns,
            )
        )

    def test_table_heading_and_explicit_service_context_are_preserved(self):
        frames = extract_wikitable_frames(
            "<h2>Naval Air Arm</h2><table class='wikitable'>"
            "<tr><th>Aircraft</th><th>Role</th></tr>"
            "<tr><td>MiG-29K</td><td>Fighter</td></tr></table>"
        )
        self.assertEqual(frames[0][1], "Naval Air Arm")
        record = build_canonical_record(
            {"Aircraft": "MiG-29K", "Role": "Fighter"},
            source_key="iaf_active_aircraft",
            source_url="https://example.test",
            table_index=1,
            row_index=1,
            retrieved_at="2026-09-15T00:00:00Z",
            category="Naval Air Arm",
        )
        self.assertEqual(record["branch"], "Indian Navy")

    def test_registry_covers_historical_aircraft_and_infantry_equipment(self):
        self.assertIn("iaf_historical_aircraft", SOURCE_REGISTRY)
        self.assertIn("army_infantry_equipment", SOURCE_REGISTRY)

    def test_in_service_quantity_and_future_note_keep_combined_status(self):
        record = build_canonical_record(
            {"Aircraft": "Rafale", "In service": "28", "Notes": "114 planned"},
            source_key="iaf_active_aircraft",
            source_url="https://example.test",
            table_index=1,
            row_index=1,
            retrieved_at="2026-09-15T00:00:00Z",
            category="Air Force",
        )
        self.assertEqual(record["status"], "in_service_and_on_order")

    def test_introduction_column_is_mapped_to_induction_date(self):
        record = build_canonical_record(
            {"Name": "Agni-II", "Intr.": "2002", "Status": "In service"},
            source_key="indian_military_missiles",
            source_url="https://example.test",
            table_index=1,
            row_index=1,
            retrieved_at="2026-09-15T00:00:00Z",
        )
        self.assertEqual(record["commissioned_or_inducted_date"], "2002")

    def test_official_evidence_layer_has_primary_sources_and_supplements(self):
        self.assertGreaterEqual(len(OFFICIAL_CLAIMS), 10)
        self.assertGreaterEqual(len(OFFICIAL_SUPPLEMENT_RECORDS), 5)
        self.assertTrue(all(claim["url"].startswith("https://") for claim in OFFICIAL_CLAIMS))
        self.assertIn("ACADA", {record["system_name"] for record in OFFICIAL_SUPPLEMENT_RECORDS})

    def test_run_writes_raw_row_provenance(self):
        html = (
            "<h2>Procurement programmes</h2><table class='wikitable'>"
            "<tr><th>Name</th><th>Quantity</th><th>Status</th></tr>"
            "<tr><td>Test system</td><td>2</td><td>On order</td></tr></table>"
        )
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory)
            report = run_scrape(
                output_dir=output,
                source_keys=["iaf_future_programmes"],
                delay=0,
                cache_dir=output / "cache",
                use_cache=False,
                session=_FakeSession(html),
            )
            self.assertEqual(report["canonical_rows"], 1)
            with (output / "raw/iaf_future_programmes_table_01.csv").open(newline="", encoding="utf-8") as handle:
                row = next(csv.DictReader(handle))
            self.assertEqual(row["source_key"], "iaf_future_programmes")
            self.assertEqual(row["source_table"], "1")
            self.assertEqual(row["source_row"], "1")
            self.assertTrue(row["retrieved_at"])

    def test_full_run_adds_official_supplements_and_claim_export(self):
        html = (
            "<h2>Procurement programmes</h2><table class='wikitable'>"
            "<tr><th>Name</th><th>Quantity</th><th>Status</th></tr>"
            "<tr><td>Test system</td><td>2</td><td>On order</td></tr></table>"
        )
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory)
            report = run_scrape(
                output_dir=output,
                source_keys=list(SOURCE_REGISTRY),
                delay=0,
                cache_dir=output / "cache",
                use_cache=False,
                session=_FakeSession(html),
            )
            self.assertEqual(report["official_evidence_claims"], len(OFFICIAL_CLAIMS))
            self.assertEqual(report["official_supplement_rows"], len(OFFICIAL_SUPPLEMENT_RECORDS))
            self.assertEqual(
                report["canonical_rows"],
                len(SOURCE_REGISTRY) + len(OFFICIAL_SUPPLEMENT_RECORDS),
            )
            with (output / "official_verification.csv").open(encoding="utf-8") as handle:
                self.assertEqual(sum(1 for _ in handle), len(OFFICIAL_CLAIMS) + 1)
            self.assertTrue((output / "raw/official_pib_drdo_updates_table_01.csv").exists())

    def test_run_refuses_zero_records_and_partial_source_failure(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory)
            with self.assertRaises(RuntimeError):
                run_scrape(
                    output_dir=output,
                    source_keys=["iaf_future_programmes"],
                    delay=0,
                    cache_dir=output / "cache",
                    use_cache=False,
                    session=_FakeSession("<p>No tables</p>"),
                )
            self.assertFalse((output / "equipment_records.csv").exists())

        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory)
            with self.assertRaises(RuntimeError):
                run_scrape(
                    output_dir=output,
                    source_keys=["iaf_future_programmes", "iaf_active_aircraft"],
                    delay=0,
                    cache_dir=output / "cache",
                    use_cache=False,
                    session=_FakeSession(
                        "<table class='wikitable'><tr><th>Name</th></tr><tr><td>Test system</td></tr></table>",
                        failing_keys={"iaf_active_aircraft"},
                    ),
                )
            self.assertFalse((output / "equipment_records.csv").exists())


if __name__ == "__main__":
    unittest.main()
