"""Download enriched awardee records from the current Gallantry Awards website.

The site now exposes its paginated awardee listing as JSON and its detail
records as HTML. Linked official profile PDFs are converted to text when the
system ``pdftotext`` utility is available. This script deliberately uses only
the Python standard library plus that optional system utility.
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import json
import re
import shutil
import sys
import subprocess
import tempfile
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from html.parser import HTMLParser
from pathlib import Path
from typing import Any, Callable, Iterable
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin
from urllib.request import Request, build_opener


BASE_URL = "https://gallantryawards.gov.in"
LISTING_ENDPOINT = BASE_URL + "/awards/search_view/{page}"
AWARD_URLS = {
    "Param Vir Chakra": BASE_URL + "/awards?search=8",
    "Ashoka Chakra": BASE_URL + "/awards?search=11",
    "Maha Vir Chakra": BASE_URL + "/awards?search=9",
    "Kirti Chakra": BASE_URL + "/awards?search=12",
    "Vir Chakra": BASE_URL + "/awards?search=14",
    "Shaurya Chakra": BASE_URL + "/awards?search=13",
}
AWARD_NAMES = frozenset(AWARD_URLS)
DEFAULT_OUTPUT = Path(__file__).resolve().parents[1] / "full_gallantry_database.csv"
DEFAULT_JSON_OUTPUT = Path(__file__).resolve().parents[1] / "data" / "research" / "gallantry-database.json"
USER_AGENT = "SENTINEL research scraper/1.0 (+https://gallantryawards.gov.in/)"
REQUEST_TIMEOUT_SECONDS = 30
DEFAULT_RETRIES = 3
DEFAULT_DELAY_SECONDS = 0.1
DEFAULT_DETAIL_WORKERS = 8
NOT_DOCUMENTED = "Not documented"
PDFTOTEXT = shutil.which("pdftotext")
CSV_FIELDS = [
    "Award",
    "Name",
    "Rank",
    "Unit",
    "Year",
    "Citation",
    "Photo URL",
    "Birth Date",
    "Death Date",
    "Service Entry Date",
    "Gallantry Action Date",
    "Awarded Date",
    "Biography",
    "Citation Details",
    "Official Awardee URL",
    "Profile PDF URL",
    "Citation Source URL",
    "Source URLs",
]


def _normalise_space(value: str) -> str:
    return " ".join(value.split())


def extract_last_page(pagination: str) -> int:
    """Return the largest page number advertised by the API."""

    pages = [int(page) for page in re.findall(r'data-ci-pagination-page=["\'](\d+)', pagination)]
    return max(pages, default=1)


def parse_listing_payload(payload: str | bytes) -> list[dict[str, Any]]:
    """Validate and extract listing records from the site's JSON response."""

    try:
        decoded = json.loads(payload)
    except (TypeError, json.JSONDecodeError) as error:
        raise ValueError("Awardee listing was not valid JSON") from error

    if not isinstance(decoded, dict) or decoded.get("status") != "success":
        status = decoded.get("status") if isinstance(decoded, dict) else None
        raise ValueError(f"Awardee listing returned an unsuccessful status: {status!r}")

    records = decoded.get("data")
    if not isinstance(records, list) or any(not isinstance(record, dict) for record in records):
        raise ValueError("Awardee listing did not contain an array of records")

    return records


class _AwardeeDetailParser(HTMLParser):
    """Extract labelled table values and linked official media from one profile."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.details: dict[str, str] = {}
        self.citation_url: str | None = None
        self.photo_url: str | None = None
        self.profile_pdf_url: str | None = None
        self.citation_pdf_url: str | None = None
        self._cells: list[str] | None = None
        self._cell_parts: list[str] | None = None
        self._section_stack: list[tuple[str, str]] = []

    @property
    def _sections(self) -> set[str]:
        return {section_id for _, section_id in self._section_stack}

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = dict(attrs)
        element_id = attributes.get("id")
        if element_id in {"tabProfile", "tabParam1", "ci"}:
            self._section_stack.append((tag, element_id))
        if tag == "tr":
            self._cells = []
        elif tag == "td" and self._cells is not None:
            self._cell_parts = []
        elif tag == "img":
            alt = _normalise_space(attributes.get("alt") or "").casefold()
            classes = set((attributes.get("class") or "").split())
            source = attributes.get("src")
            if "img-account-profile" in classes and source:
                self.photo_url = urljoin(BASE_URL + "/", source)
            elif "citation" in alt and source:
                self.citation_url = urljoin(BASE_URL + "/", source)
        elif tag in {"a", "iframe"}:
            source = attributes.get("href") if tag == "a" else attributes.get("src")
            if not source:
                return
            absolute_source = urljoin(BASE_URL + "/", source)
            if "tabProfile" in self._sections and absolute_source.casefold().split("?", 1)[0].endswith(".pdf"):
                self.profile_pdf_url = absolute_source
            elif "ci" in self._sections and absolute_source.casefold().split("?", 1)[0].endswith(".pdf"):
                self.citation_pdf_url = absolute_source

    def handle_data(self, data: str) -> None:
        if self._cell_parts is not None:
            self._cell_parts.append(data)

    def handle_endtag(self, tag: str) -> None:
        if tag == "td" and self._cell_parts is not None and self._cells is not None:
            self._cells.append(_normalise_space("".join(self._cell_parts)))
            self._cell_parts = None
        elif tag == "tr" and self._cells:
            if len(self._cells) >= 2:
                label = self._cells[0].rstrip(":").casefold()
                value = self._cells[1]
                labels = {
                    "award / date of action": "Award / Date of Action",
                    "service": "Service",
                    "service number": "Service Number",
                    "rank": "Rank",
                    "unit/regiments/corps": "Unit",
                    "son of": "Son Of",
                    "daughter of": "Daughter Of",
                    "mother's name": "Mother's Name",
                    "resident of (village/district/state/domicile)": "Resident Of",
                    "war/operation/battle": "War/Operation/Battle",
                }
                canonical_label = labels.get(label)
                if canonical_label and value:
                    self.details[canonical_label] = value
            self._cells = None
        else:
            for index in range(len(self._section_stack) - 1, -1, -1):
                section_tag, _ = self._section_stack[index]
                if section_tag == tag:
                    del self._section_stack[index]
                    break


def parse_awardee_detail(html: str | bytes) -> dict[str, str]:
    """Return labelled fields and official media links from an awardee page."""

    parser = _AwardeeDetailParser()
    parser.feed(html.decode("utf-8", errors="replace") if isinstance(html, bytes) else html)
    parser.close()
    if parser.photo_url:
        parser.details["Photo URL"] = parser.photo_url
    if parser.citation_url:
        parser.details["Citation"] = parser.citation_url
    if parser.profile_pdf_url:
        parser.details["Profile PDF URL"] = parser.profile_pdf_url
    if parser.citation_pdf_url:
        parser.details["Citation PDF URL"] = parser.citation_pdf_url
    return parser.details


def _year_from_listing(value: Any) -> str:
    match = re.search(r"\b(\d{4})\b", str(value or ""))
    return match.group(1) if match else "N/A"


def _value_or(value: Any, fallback: str) -> str:
    normalised = _normalise_space(str(value or ""))
    return normalised or fallback


_MONTHS = {
    "jan": 1,
    "january": 1,
    "feb": 2,
    "february": 2,
    "mar": 3,
    "march": 3,
    "apr": 4,
    "april": 4,
    "may": 5,
    "jun": 6,
    "june": 6,
    "jul": 7,
    "july": 7,
    "aug": 8,
    "august": 8,
    "sep": 9,
    "sept": 9,
    "september": 9,
    "oct": 10,
    "october": 10,
    "nov": 11,
    "november": 11,
    "dec": 12,
    "december": 12,
}


def extract_date(value: Any) -> str | None:
    """Return an unambiguous date as ISO text, preserving no guessed precision."""

    text = _normalise_space(str(value or ""))
    candidates: list[tuple[int, int, int]] = []
    for match in re.finditer(r"\b(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})\b", text):
        candidates.append((int(match.group(1)), int(match.group(2)), int(match.group(3))))
    for match in re.finditer(
        r"\b(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+)[,\s]+(\d{4})\b",
        text,
        flags=re.IGNORECASE,
    ):
        month = _MONTHS.get(match.group(2).casefold())
        if month:
            candidates.append((int(match.group(1)), month, int(match.group(3))))
    for match in re.finditer(
        r"\b([A-Za-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?(?:,)?\s+(\d{4})\b",
        text,
        flags=re.IGNORECASE,
    ):
        month = _MONTHS.get(match.group(1).casefold())
        if month:
            candidates.append((int(match.group(2)), month, int(match.group(3))))
    for day, month, year in candidates:
        try:
            return dt.date(year, month, day).isoformat()
        except ValueError:
            continue
    return None


def _date_after(pattern: str, text: str) -> str | None:
    match = re.search(pattern, text, flags=re.IGNORECASE)
    return extract_date(text[match.end(): match.end() + 160]) if match else None


def _clean_section(value: str) -> str:
    paragraphs: list[str] = []
    current: list[str] = []
    for line in value.replace("\r", "").replace("\x00", "").split("\n"):
        cleaned = _normalise_space(line)
        if not cleaned:
            if current:
                paragraphs.append(" ".join(current))
                current = []
        elif not re.match(r"^Source:\s*", cleaned, flags=re.IGNORECASE):
            current.append(cleaned)
    if current:
        paragraphs.append(" ".join(current))
    return "\n\n".join(paragraphs).strip()


def parse_profile_text(text: str | bytes) -> dict[str, str]:
    """Extract structured dates plus biography and citation prose from a profile PDF."""

    raw = text.decode("utf-8", errors="replace") if isinstance(text, bytes) else text
    raw = raw.replace("\r\n", "\n").replace("\r", "\n")
    compact = _normalise_space(raw)
    parsed: dict[str, str] = {}

    service_entry = re.search(
        r"\bDATE\s+OF\s+ENROLMENT\s*/?\s*COMMISSION\b\s*(.+?)(?=\s+AWARD\s*/?\s*DATE\s+OF\s+ACTION\b)",
        compact,
        flags=re.IGNORECASE,
    )
    action_value = re.search(
        r"\bAWARD\s*/?\s*DATE\s+OF\s+ACTION\b\s*(.+?)(?=\s+(?:WAR\s*/?\s*BATTLE|OTHER\s+AWARDS|CITATION)\b|$)",
        compact,
        flags=re.IGNORECASE,
    )
    if service_entry and (date := extract_date(service_entry.group(1))):
        parsed["Service Entry Date"] = date
    if action_value and (date := extract_date(action_value.group(1))):
        parsed["Gallantry Action Date"] = date

    for key, pattern in {
        # Some older profile PDFs contain the OCR typo “bom” for “born”.
        "Birth Date": r"\b(?:was\s+)?(?:born|bom)\s*(?:on|:)\s*",
        "Death Date": r"\b(?:died|death|passed\s+away|killed|martyred|attained\s+martyrdom)\s*(?:on|:)\s*",
    }.items():
        if date := _date_after(pattern, compact):
            parsed[key] = date
    if date := _date_after(r"\b(?:awarded|conferred|presented)\b[^.]{0,160}?\bon\s*", compact):
        parsed["Awarded Date"] = date

    citation_match = re.search(r"(?im)^\s*CITATION\s*$", raw)
    profile_body = raw[:citation_match.start()] if citation_match else raw
    citation_body = raw[citation_match.end():] if citation_match else ""
    citation_body = re.split(
        r"(?im)^\s*(?:REFERENCE|REFERENCES|BIBLIOGRAPHY)\b.*$",
        citation_body,
        maxsplit=1,
    )[0]

    header = re.search(r"(?is)OTHER\s+AWARDS\s+WITH\s+DATE.*?(?:\n\s*\n|\f)", profile_body)
    if header:
        biography_body = profile_body[header.end():]
    elif "\f" in profile_body:
        biography_body = profile_body.split("\f", 1)[1]
    else:
        biography_body = profile_body
    biography_body = re.split(
        r"(?im)^\s*(?:REFERENCE|REFERENCES|BIBLIOGRAPHY)\b.*$",
        biography_body,
        maxsplit=1,
    )[0]
    if biography := _clean_section(biography_body):
        parsed["Biography"] = biography
    if citation := _clean_section(citation_body):
        parsed["Citation Details"] = citation
    return parsed


def extract_pdf_text(pdf_bytes: bytes, converter: str | None = PDFTOTEXT) -> str:
    """Extract text from a PDF when the optional system converter is available."""

    if not converter:
        return ""
    try:
        completed = subprocess.run(
            [converter, "-", "-"],
            input=pdf_bytes,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=REQUEST_TIMEOUT_SECONDS,
            check=False,
        )
    except (OSError, subprocess.TimeoutExpired):
        return ""
    if completed.returncode != 0:
        return ""
    return completed.stdout.decode("utf-8", errors="replace")


def build_csv_row(listing: dict[str, Any], detail: dict[str, str]) -> dict[str, str]:
    """Combine one listing, official detail page, and optional profile evidence."""

    official_url = detail.get("Official Awardee URL") or (
        f"{BASE_URL}/awardee/{listing.get('a_id')}" if listing.get("a_id") else ""
    )
    action_date = detail.get("Gallantry Action Date") or extract_date(detail.get("Award / Date of Action"))
    citation_source = detail.get("Citation PDF URL") or detail.get("Profile PDF URL")
    if not citation_source:
        citation_source = detail.get("Citation") or official_url
    source_urls = list(dict.fromkeys(
        value for value in (
            official_url,
            detail.get("Photo URL"),
            detail.get("Profile PDF URL"),
            detail.get("Citation PDF URL"),
            detail.get("Citation"),
        ) if value
    ))

    def enrichment_value(key: str) -> str:
        value = _normalise_space(str(detail.get(key) or ""))
        return value if value and value.casefold() not in {"n/a", "no data found!"} else NOT_DOCUMENTED

    return {
        "Award": _value_or(listing.get("chakra"), "N/A"),
        "Name": _value_or(listing.get("a_title"), "N/A"),
        "Rank": _value_or(listing.get("a_rank"), "N/A"),
        "Unit": _value_or(detail.get("Unit"), "N/A"),
        "Year": _year_from_listing(listing.get("a_award_year")),
        "Citation": _value_or(detail.get("Citation"), "Citation not available"),
        "Photo URL": _value_or(detail.get("Photo URL"), NOT_DOCUMENTED),
        "Birth Date": enrichment_value("Birth Date"),
        "Death Date": enrichment_value("Death Date"),
        "Service Entry Date": enrichment_value("Service Entry Date"),
        "Gallantry Action Date": _value_or(action_date, NOT_DOCUMENTED),
        "Awarded Date": enrichment_value("Awarded Date"),
        "Biography": enrichment_value("Biography"),
        "Citation Details": enrichment_value("Citation Details"),
        "Official Awardee URL": _value_or(official_url, NOT_DOCUMENTED),
        "Profile PDF URL": _value_or(detail.get("Profile PDF URL"), NOT_DOCUMENTED),
        "Citation Source URL": _value_or(citation_source, NOT_DOCUMENTED),
        "Source URLs": "; ".join(source_urls) if source_urls else NOT_DOCUMENTED,
    }


def _fetch_bytes(
    url: str,
    opener: Any,
    *,
    retries: int = DEFAULT_RETRIES,
    timeout: int = REQUEST_TIMEOUT_SECONDS,
    sleep: Callable[[float], None] = time.sleep,
) -> bytes:
    request = Request(
        url,
        headers={
            "Accept": "application/json, text/html;q=0.9, */*;q=0.8",
            "User-Agent": USER_AGENT,
        },
    )
    last_error: Exception | None = None
    for attempt in range(retries):
        try:
            with opener.open(request, timeout=timeout) as response:
                if response.status != 200:
                    raise RuntimeError(f"HTTP {response.status} from {url}")
                return response.read()
        except (HTTPError, URLError, TimeoutError, RuntimeError) as error:
            last_error = error
            if attempt + 1 < retries:
                sleep(min(2**attempt, 4))
    raise RuntimeError(f"Failed to fetch {url}: {last_error}") from last_error


def fetch_listing_rows(
    opener: Any,
    *,
    delay: float = DEFAULT_DELAY_SECONDS,
    sleep: Callable[[float], None] = time.sleep,
) -> list[dict[str, Any]]:
    """Fetch every listing page once; the API returns all award categories."""

    first_payload = _fetch_bytes(LISTING_ENDPOINT.format(page=1), opener)
    first_rows = parse_listing_payload(first_payload)
    try:
        first_json = json.loads(first_payload)
        last_page = extract_last_page(str(first_json.get("pagination") or ""))
    except (TypeError, json.JSONDecodeError) as error:
        raise ValueError("Awardee listing pagination was not valid JSON") from error

    rows = list(first_rows)
    print(f"Listing page 1/{last_page}: {len(first_rows)} records", flush=True)
    for page in range(2, last_page + 1):
        if delay > 0:
            sleep(delay)
        payload = _fetch_bytes(LISTING_ENDPOINT.format(page=page), opener)
        page_rows = parse_listing_payload(payload)
        if not page_rows:
            break
        rows.extend(page_rows)
        if page == last_page or page % 10 == 0:
            print(f"Listing page {page}/{last_page}: {len(page_rows)} records", flush=True)

    return rows


def fetch_awardee_detail(awardee_id: Any, opener: Any) -> dict[str, str]:
    """Fetch one official page and its linked profile/citation evidence."""

    if not awardee_id:
        return {}
    url = f"{BASE_URL}/awardee/{awardee_id}"
    try:
        detail = parse_awardee_detail(_fetch_bytes(url, opener))
        detail["Official Awardee URL"] = url
        profile_url = detail.get("Profile PDF URL")
        if profile_url:
            try:
                profile_text = extract_pdf_text(_fetch_bytes(profile_url, opener))
            except RuntimeError as error:
                print(f"Warning: {error}", file=sys.stderr, flush=True)
            else:
                detail.update(parse_profile_text(profile_text))
        citation_pdf_url = detail.get("Citation PDF URL")
        if citation_pdf_url and not detail.get("Citation Details"):
            try:
                citation_text = extract_pdf_text(_fetch_bytes(citation_pdf_url, opener))
            except RuntimeError as error:
                print(f"Warning: {error}", file=sys.stderr, flush=True)
            else:
                citation_data = parse_profile_text(citation_text)
                if citation_data.get("Citation Details"):
                    detail["Citation Details"] = citation_data["Citation Details"]
        return detail
    except RuntimeError as error:
        print(f"Warning: {error}", file=sys.stderr, flush=True)
        return {}


def fetch_detail_map(
    awardee_ids: Iterable[str],
    fetch_detail: Callable[[str], dict[str, str]],
    *,
    max_workers: int = DEFAULT_DETAIL_WORKERS,
    on_complete: Callable[[int, int], None] | None = None,
) -> dict[str, dict[str, str]]:
    """Fetch unique profile IDs with bounded concurrency."""

    if max_workers < 1:
        raise ValueError("max_workers must be positive")

    unique_ids = list(dict.fromkeys(awardee_id for awardee_id in awardee_ids if awardee_id))
    if not unique_ids:
        return {}

    details: dict[str, dict[str, str]] = {}
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {executor.submit(fetch_detail, awardee_id): awardee_id for awardee_id in unique_ids}
        for completed, future in enumerate(as_completed(futures), start=1):
            details[futures[future]] = future.result()
            if on_complete:
                on_complete(completed, len(unique_ids))
    return details


def _write_csv_atomically(rows: list[dict[str, str]], output: Path) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(
        mode="w",
        encoding="utf-8",
        newline="",
        prefix=f".{output.name}.",
        suffix=".tmp",
        dir=output.parent,
        delete=False,
    ) as temporary:
        temporary_path = Path(temporary.name)
        writer = csv.DictWriter(temporary, fieldnames=CSV_FIELDS)
        writer.writeheader()
        writer.writerows(rows)
    temporary_path.replace(output)


def _write_json_atomically(rows: list[dict[str, str]], output: Path) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(
        mode="w",
        encoding="utf-8",
        prefix=f".{output.name}.",
        suffix=".tmp",
        dir=output.parent,
        delete=False,
    ) as temporary:
        temporary_path = Path(temporary.name)
        json.dump(rows, temporary, ensure_ascii=False, separators=(",", ":"))
    temporary_path.replace(output)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--json-output", type=Path, default=DEFAULT_JSON_OUTPUT)
    parser.add_argument(
        "--skip-details",
        action="store_true",
        help="Do not request individual profile pages; useful for a listing-only refresh.",
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=DEFAULT_DELAY_SECONDS,
        help="Seconds between listing/detail requests (default: %(default)s).",
    )
    parser.add_argument(
        "--workers",
        type=int,
        default=DEFAULT_DETAIL_WORKERS,
        help="Concurrent profile requests (default: %(default)s).",
    )
    args = parser.parse_args(argv)
    if args.delay < 0:
        parser.error("--delay must be non-negative")
    if args.workers < 1:
        parser.error("--workers must be positive")

    opener = build_opener()
    listing_rows = fetch_listing_rows(opener, delay=args.delay)
    selected_rows = [row for row in listing_rows if row.get("chakra") in AWARD_NAMES]
    if not selected_rows:
        raise RuntimeError("No supported awardee records found; refusing to overwrite the CSV")

    details_by_id: dict[str, dict[str, str]] = {}
    if not args.skip_details:
        awardee_ids = [str(row.get("a_id") or "") for row in selected_rows]

        def fetch_detail(awardee_id: str) -> dict[str, str]:
            if args.delay > 0:
                time.sleep(args.delay)
            return fetch_awardee_detail(awardee_id, build_opener())

        def report_detail_progress(completed: int, total_details: int) -> None:
            if completed == total_details or completed % 100 == 0:
                print(f"Fetched {completed}/{total_details} profile details", flush=True)

        details_by_id = fetch_detail_map(
            awardee_ids,
            fetch_detail,
            max_workers=args.workers,
            on_complete=report_detail_progress,
        )

    csv_rows: list[dict[str, str]] = []
    total = len(selected_rows)
    for index, listing in enumerate(selected_rows, start=1):
        awardee_id = str(listing.get("a_id") or "")
        detail = details_by_id.get(awardee_id, {})
        csv_rows.append(build_csv_row(listing, detail))
        if index == total or index % 100 == 0:
            print(f"Prepared {index}/{total} awardee rows", flush=True)

    _write_csv_atomically(csv_rows, args.output)
    _write_json_atomically(csv_rows, args.json_output)
    print(f"Scraping complete: {len(csv_rows)} rows written to {args.output}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (RuntimeError, ValueError) as error:
        print(f"Scraping failed: {error}", file=sys.stderr)
        raise SystemExit(1)
