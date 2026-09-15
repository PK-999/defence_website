import json
import unittest

from src.scratch import (
    CSV_FIELDS,
    LISTING_ENDPOINT,
    build_csv_row,
    extract_last_page,
    fetch_detail_map,
    parse_awardee_detail,
    parse_listing_payload,
    parse_profile_text,
)


class ScratchScraperTests(unittest.TestCase):
    def test_listing_payload_reads_current_json_endpoint(self):
        payload = json.dumps(
            {
                "status": "success",
                "data": [
                    {
                        "a_id": "1053",
                        "a_title": "PIRU SINGH",
                        "a_rank": "COMPANY HAVILDAR MAJOR",
                        "chakra": "Param Vir Chakra",
                        "a_award_year": "1952-01-26 00:00:00",
                    }
                ],
                "pagination": '<a data-ci-pagination-page="431">Last</a>',
            }
        )

        rows = parse_listing_payload(payload)

        self.assertEqual(rows, [json.loads(payload)["data"][0]])
        self.assertEqual(LISTING_ENDPOINT.format(page=2), "https://gallantryawards.gov.in/awards/search_view/2")

    def test_pagination_uses_last_page_from_server_response(self):
        pagination = (
            '<a data-ci-pagination-page="2">2</a>'
            '<a data-ci-pagination-page="431">Last</a>'
        )

        self.assertEqual(extract_last_page(pagination), 431)

    def test_detail_parser_reads_unit_and_citation_image(self):
        html = """
        <table>
          <tr><td>Award / Date of Action</td><td>Param Vir Chakra (Posthumous), 26-01-1952</td></tr>
          <tr><td>Unit/Regiments/Corps</td><td>6 RAJPUTANA RIFLES</td></tr>
          <tr><td>Service</td><td>Indian Army</td></tr>
        </table>
        <img class="img-account-profile" src="/assets/uploads/PIRU.jpg" alt="" />
        <div id="tabProfile"><iframe src="/assets/uploads/piru-profile.pdf"></iframe></div>
        <div id="tabParam1">
          <img src="/assets/uploads/PIRU1.jpg" alt="Citation" />
        </div>
        <div id="ci"><iframe src="/assets/uploads/piru-citation.pdf"></iframe></div>
        """

        detail = parse_awardee_detail(html)

        self.assertEqual(detail["Unit"], "6 RAJPUTANA RIFLES")
        self.assertEqual(detail["Service"], "Indian Army")
        self.assertEqual(detail["Award / Date of Action"], "Param Vir Chakra (Posthumous), 26-01-1952")
        self.assertEqual(detail["Photo URL"], "https://gallantryawards.gov.in/assets/uploads/PIRU.jpg")
        self.assertEqual(detail["Profile PDF URL"], "https://gallantryawards.gov.in/assets/uploads/piru-profile.pdf")
        self.assertEqual(detail["Citation"], "https://gallantryawards.gov.in/assets/uploads/PIRU1.jpg")
        self.assertEqual(detail["Citation PDF URL"], "https://gallantryawards.gov.in/assets/uploads/piru-citation.pdf")

    def test_profile_parser_extracts_dates_biography_and_citation(self):
        profile_text = """
        CAPTAIN FIXTURE HERO
        DATE OF ENROLMENT/ COMMISSION 07 June 1997
        AWARD/DATE OF ACTION Param Vir Chakra (Posthumous)/ 02 July 1999
        OTHER AWARDS WITH DATE

        Lieutenant Fixture Hero was bom on 25 June 1975 to Shri Parent Hero.
        He joined the National Defence Academy and was commissioned into the Army.
        He was presented the Param Vir Chakra on 15 August 2000.

        CITATION
        02 July 1999
        Fixture Hero led his platoon through intense enemy fire and captured the objective.
        Reference: Gazette of India, Notification No. 1.

        REFERENCES
        A synthetic fixture reference.
        """

        parsed = parse_profile_text(profile_text)

        self.assertEqual(parsed["Birth Date"], "1975-06-25")
        self.assertEqual(parsed["Service Entry Date"], "1997-06-07")
        self.assertEqual(parsed["Gallantry Action Date"], "1999-07-02")
        self.assertEqual(parsed["Awarded Date"], "2000-08-15")
        self.assertIn("joined the National Defence Academy", parsed["Biography"])
        self.assertNotIn("REFERENCES", parsed["Biography"])
        self.assertIn("captured the objective", parsed["Citation Details"])
        self.assertNotIn("Reference:", parsed["Citation Details"])

    def test_csv_row_combines_listing_and_detail_data(self):
        listing = {
            "a_title": "PIRU SINGH",
            "a_rank": "COMPANY HAVILDAR MAJOR",
            "chakra": "Param Vir Chakra",
            "a_award_year": "1952-01-26 00:00:00",
        }

        row = build_csv_row(
            {**listing, "a_id": "1053"},
            {
                "Unit": "6 RAJPUTANA RIFLES",
                "Citation": "https://example.test/citation.jpg",
                "Photo URL": "https://example.test/photo.jpg",
                "Profile PDF URL": "https://example.test/profile.pdf",
                "Official Awardee URL": "https://example.test/awardee/1053",
                "Birth Date": "1923-01-01",
                "Death Date": "1952-01-26",
                "Service Entry Date": "1941-01-01",
                "Gallantry Action Date": "1952-01-26",
                "Awarded Date": "1952-01-26",
                "Biography": "A documented biography.",
                "Citation Details": "A documented citation.",
            },
        )

        self.assertEqual(row["Unit"], "6 RAJPUTANA RIFLES")
        self.assertEqual(row["Photo URL"], "https://example.test/photo.jpg")
        self.assertEqual(row["Birth Date"], "1923-01-01")
        self.assertEqual(row["Gallantry Action Date"], "1952-01-26")
        self.assertEqual(row["Biography"], "A documented biography.")
        self.assertEqual(row["Citation Details"], "A documented citation.")
        self.assertEqual(row["Official Awardee URL"], "https://example.test/awardee/1053")

    def test_detail_fetches_are_deduplicated_before_mapping_results(self):
        requested_ids = []

        def fetch_detail(awardee_id):
            requested_ids.append(awardee_id)
            return {"Unit": f"Unit {awardee_id}"}

        details = fetch_detail_map(["1053", "1053", "1055"], fetch_detail, max_workers=2)

        self.assertEqual(sorted(requested_ids), ["1053", "1055"])
        self.assertEqual(details["1053"], {"Unit": "Unit 1053"})
        self.assertEqual(details["1055"], {"Unit": "Unit 1055"})

    def test_csv_row_does_not_emit_blank_required_fields_for_whitespace_values(self):
        listing = {
            "a_title": "  NAME  ",
            "a_rank": "   ",
            "chakra": " Vir Chakra ",
            "a_award_year": "1948-01-26 00:00:00",
        }

        row = build_csv_row(listing, {})

        self.assertEqual(row["Name"], "NAME")
        self.assertEqual(row["Award"], "Vir Chakra")
        self.assertEqual(row["Rank"], "N/A")

    def test_enrichment_columns_are_part_of_the_output_contract(self):
        self.assertIn("Photo URL", CSV_FIELDS)
        self.assertIn("Service Entry Date", CSV_FIELDS)
        self.assertIn("Gallantry Action Date", CSV_FIELDS)
        self.assertIn("Citation Details", CSV_FIELDS)
        self.assertIn("Source URLs", CSV_FIELDS)


if __name__ == "__main__":
    unittest.main()
