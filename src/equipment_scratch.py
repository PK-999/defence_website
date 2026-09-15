"""Build a source-attributed Indian military equipment research dataset.

This is intentionally a separate research scraper. It uses the user's
pandas/requests approach for Wikipedia tables, but keeps raw tables and
canonical rows together with provenance so that later editorial review can
reconcile duplicate systems and verify changing status or quantities.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
import tempfile
import time
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from io import StringIO
from pathlib import Path
from typing import Any, Iterable

import pandas as pd
import requests
from bs4 import BeautifulSoup
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

try:
    from src.equipment_official import OFFICIAL_CLAIMS, OFFICIAL_SUPPLEMENT_RECORDS
except ModuleNotFoundError:  # pragma: no cover - supports direct script execution from src/
    from equipment_official import OFFICIAL_CLAIMS, OFFICIAL_SUPPLEMENT_RECORDS


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT_DIR = ROOT / "indian_military_data"
USER_AGENT = "SENTINEL Indian defence equipment research scraper/1.0"
NOT_DOCUMENTED = "Not documented"
UNPARSED = "Unclear"
CACHE_TTL_SECONDS = 24 * 60 * 60


@dataclass(frozen=True)
class SourceSpec:
    key: str
    branch: str
    domain: str
    url: str
    scope: str
    description: str
    context_status: str | None = None


SOURCE_REGISTRY: dict[str, SourceSpec] = {
    "army_equipment": SourceSpec(
        key="army_equipment",
        branch="Indian Army",
        domain="land equipment and weapons",
        url="https://en.wikipedia.org/wiki/List_of_equipment_of_the_Indian_Army",
        scope="current inventory with historical and future status notes",
        description="Army equipment tables, including vehicles, artillery, air defence, missiles, small arms, and support systems.",
        context_status="in_service",
    ),
    "iaf_active_aircraft": SourceSpec(
        key="iaf_active_aircraft",
        branch="Indian Air Force",
        domain="aircraft",
        url="https://en.wikipedia.org/wiki/List_of_active_Indian_military_aircraft",
        scope="active aircraft inventory",
        description="Current aircraft tables grouped by combat, transport, helicopter, trainer, and support roles.",
        context_status="in_service",
    ),
    "iaf_historical_aircraft": SourceSpec(
        key="iaf_historical_aircraft",
        branch="Indian Air Force",
        domain="historical aircraft",
        url="https://en.wikipedia.org/wiki/List_of_historical_aircraft_of_the_Indian_Air_Force",
        scope="historical and retired Air Force aircraft",
        description="Historical aircraft tables with introduction, retirement, count, origin, role, and notes.",
        context_status="historical",
    ),
    "iaf_future_programmes": SourceSpec(
        key="iaf_future_programmes",
        branch="Indian Air Force",
        domain="future aircraft and programmes",
        url="https://en.wikipedia.org/wiki/Future_of_the_Indian_Air_Force",
        scope="ordered, under-development, planned, and proposed systems",
        description="Future Air Force procurement and development programme tables.",
        context_status="planned_or_proposed",
    ),
    "iaf_weapon_systems": SourceSpec(
        key="iaf_weapon_systems",
        branch="Indian Air Force",
        domain="air force weapon systems",
        url="https://en.wikipedia.org/wiki/Indian_Air_Force",
        scope="air defence and missile system tables in the service overview",
        description="Air Force overview tables that include air defence and missile systems.",
        context_status=None,
    ),
    "army_infantry_equipment": SourceSpec(
        key="army_infantry_equipment",
        branch="Indian Army",
        domain="infantry weapons and individual equipment",
        url="https://en.wikipedia.org/wiki/List_of_infantry_equipment_of_the_Indian_Army",
        scope="current infantry equipment and future procurements",
        description="Army infantry weapons, protective equipment, explosives, anti-tank systems, and future procurements.",
        context_status=None,
    ),
    "army_legacy_equipment": SourceSpec(
        key="army_legacy_equipment",
        branch="Indian Army",
        domain="legacy and historical Army equipment",
        url="https://military-history.fandom.com/api.php?action=parse&page=Equipment_of_the_Indian_Army&prop=text&format=json",
        scope="supplemental legacy, retired, and historical equipment records",
        description="Secondary-source Army equipment tables used to supplement historical and legacy coverage not present in the supplied current-inventory page.",
        context_status=None,
    ),
    "navy_active_ships": SourceSpec(
        key="navy_active_ships",
        branch="Indian Navy",
        domain="ships and submarines",
        url="https://en.wikipedia.org/wiki/List_of_active_Indian_Navy_ships",
        scope="active ships and naval craft",
        description="Current Navy fleet tables with classes, vessels, pennant numbers, displacement, commissioning year, origin, and notes.",
        context_status="in_service",
    ),
    "navy_historical_ships": SourceSpec(
        key="navy_historical_ships",
        branch="Indian Navy",
        domain="historical ships and submarines",
        url="https://en.wikipedia.org/wiki/List_of_ships_of_the_Indian_Navy",
        scope="historical, former, and legacy Navy vessels",
        description="Historical Navy vessel tables, including former and decommissioned classes.",
        context_status="historical",
    ),
    "navy_future_programmes": SourceSpec(
        key="navy_future_programmes",
        branch="Indian Navy",
        domain="future ships, aircraft, and weapons",
        url="https://en.wikipedia.org/wiki/Future_of_the_Indian_Navy",
        scope="ordered, under-construction, under-development, planned, and proposed systems",
        description="Future Navy platform and weapon programme tables.",
        context_status="planned_or_proposed",
    ),
    "navy_weapon_systems": SourceSpec(
        key="navy_weapon_systems",
        branch="Indian Navy",
        domain="naval weapon systems",
        url="https://en.wikipedia.org/wiki/Weapon_systems_of_the_Indian_Navy",
        scope="current and future naval weapons",
        description="Navy missile, torpedo, gun, anti-submarine, and other weapon-system tables.",
        context_status=None,
    ),
    "indian_military_missiles": SourceSpec(
        key="indian_military_missiles",
        branch="Indian Army · Indian Navy · Indian Air Force",
        domain="joint missile systems",
        url="https://en.wikipedia.org/wiki/List_of_Indian_military_missiles",
        scope="historical, current, and development-stage missile systems",
        description="Cross-service missile tables with designers, guidance, range, warhead, service date, and status fields.",
        context_status=None,
    ),
}


CANONICAL_FIELDS = [
    "record_id",
    "branch",
    "domain",
    "category",
    "system_name",
    "designation",
    "variant",
    "role_purpose",
    "status",
    "source_status",
    "verification_status",
    "verification_sources",
    "status_as_of",
    "commissioned_or_inducted_date",
    "retired_or_decommissioned_date",
    "quantity",
    "quantity_min",
    "quantity_max",
    "quantity_raw",
    "quantity_values",
    "specifications",
    "dimensions",
    "make_manufacturer",
    "country_of_origin",
    "operators",
    "notes",
    "source_key",
    "source_url",
    "source_table",
    "source_row",
    "retrieved_at",
    "raw_record",
]


def clean_cell(value: Any) -> str:
    """Clean display text while removing only common Wikipedia citations."""

    if value is None:
        return ""
    try:
        if bool(pd.isna(value)):
            return ""
    except (TypeError, ValueError):
        pass
    text = str(value).replace("\xa0", " ").replace("\r", " ").replace("\n", " ")
    text = re.sub(r"\[(?:\d+|lower-alpha\s+\d+|upper-alpha\s+\d+)\]", "", text, flags=re.IGNORECASE)
    return " ".join(text.split()).strip()


def _unique_column_names(columns: Iterable[str]) -> list[str]:
    counts: dict[str, int] = {}
    result: list[str] = []
    for raw_column in columns:
        column = clean_cell(raw_column) or "Unnamed"
        counts[column] = counts.get(column, 0) + 1
        result.append(column if counts[column] == 1 else f"{column} ({counts[column]})")
    return result


def flatten_columns(frame: pd.DataFrame) -> pd.DataFrame:
    """Flatten multi-level table headers and clean every cell."""

    flattened = frame.copy()
    if isinstance(flattened.columns, pd.MultiIndex):
        labels = [
            " | ".join(
                part for part in (clean_cell(value) for value in column) if part and part.casefold() != "nan"
            )
            for column in flattened.columns.to_flat_index()
        ]
    else:
        labels = [clean_cell(column) for column in flattened.columns]
    flattened.columns = _unique_column_names(labels)
    return flattened.apply(lambda column: column.map(clean_cell))


def canonical_record_id(source_key: str, table_index: int, row_index: int) -> str:
    """Return a deterministic source-row identity without merging sources."""

    seed = f"{source_key}\x1f{table_index}\x1f{row_index}".encode("utf-8")
    return f"eq_{hashlib.sha256(seed).hexdigest()[:20]}"


def normalise_status(value: Any) -> str:
    """Map source wording to a conservative status vocabulary."""

    text = clean_cell(value)
    lowered = text.casefold()
    if not lowered or lowered in {"n/a", "na", "unknown", "tbd", "-"}:
        return "not_documented"
    if any(token in lowered for token in ("under construction", "being built", "laid down")) and any(
        token in lowered for token in ("planned", "proposed")
    ):
        return "under_construction_and_planned"
    if any(token in lowered for token in ("under construction", "being built", "laid down")):
        return "under_construction"
    if any(token in lowered for token in ("decommissioned", "retired", "withdrawn", "scrapped", "phased out", "out of service")):
        return "decommissioned_or_retired"
    if any(token in lowered for token in ("under development", "in development", "design phase", "development phase")):
        return "under_development"
    if any(token in lowered for token in ("under trials", "user trials", "trial phase", "flight testing")):
        return "under_trials"
    if any(token in lowered for token in ("in service", "operational", "active service", "currently used")):
        if "order" in lowered or "planned" in lowered:
            return "in_service_and_on_order"
        return "in_service"
    if any(token in lowered for token in ("on order", "ordered", "contract signed", "approved", "being inducted")):
        return "on_order"
    if "reserve" in lowered:
        return "reserve"
    if any(token in lowered for token in ("planned", "proposed", "future", "rfi issued", "expected")):
        return "planned_or_proposed"
    if any(token in lowered for token in ("former", "historical", "legacy")):
        return "historical"
    return "not_documented"


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


def _valid_date(year: int, month: int, day: int) -> str | None:
    try:
        return datetime(year, month, day, tzinfo=timezone.utc).date().isoformat()
    except ValueError:
        return None


def normalise_date(value: Any) -> str:
    """Normalize a date while preserving year/month precision and ambiguity."""

    text = clean_cell(value)
    if not text:
        return NOT_DOCUMENTED
    lowered = text.casefold()
    if lowered in {"n/a", "na", "unknown", "date unknown", "tbd", "-", "not available"}:
        return NOT_DOCUMENTED

    year_range = re.search(r"\b((?:19|20)\d{2})\s*[–—-]\s*((?:19|20)\d{2})\b", text)
    if year_range:
        return f"{year_range.group(1)}–{year_range.group(2)}"

    iso = re.search(r"\b((?:19|20|21)\d{2})-(\d{2})-(\d{2})\b", text)
    if iso and (parsed := _valid_date(int(iso.group(1)), int(iso.group(2)), int(iso.group(3)))):
        return parsed
    year_month = re.search(r"\b((?:19|20|21)\d{2})-(\d{1,2})\b", text)
    if year_month and 1 <= int(year_month.group(2)) <= 12:
        return f"{year_month.group(1)}-{int(year_month.group(2)):02d}"

    day_month_year = re.search(
        r"\b(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+)[,\s]+((?:19|20|21)\d{2})\b",
        text,
        flags=re.IGNORECASE,
    )
    if day_month_year and (month := _MONTHS.get(day_month_year.group(2).casefold())):
        if parsed := _valid_date(int(day_month_year.group(3)), month, int(day_month_year.group(1))):
            return parsed

    month_day_year = re.search(
        r"\b([A-Za-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?(?:,)?\s+((?:19|20|21)\d{2})\b",
        text,
        flags=re.IGNORECASE,
    )
    if month_day_year and (month := _MONTHS.get(month_day_year.group(1).casefold())):
        if parsed := _valid_date(int(month_day_year.group(3)), month, int(month_day_year.group(2))):
            return parsed

    month_year = re.search(r"\b([A-Za-z]+)\s+((?:19|20|21)\d{2})\b", text, flags=re.IGNORECASE)
    if month_year and (month := _MONTHS.get(month_year.group(1).casefold())):
        return f"{month_year.group(2)}-{month:02d}"

    numeric = re.search(r"\b(\d{1,2})[/.](\d{1,2})[/.]((?:19|20|21)\d{2})\b", text)
    if numeric:
        first, second, year = map(int, numeric.groups())
        if first > 12 and (parsed := _valid_date(year, second, first)):
            return parsed
        if second > 12 and (parsed := _valid_date(year, first, second)):
            return parsed
        return f"{UNPARSED}: {text}"

    year = re.search(r"\b((?:19|20|21)\d{2})\b", text)
    if year:
        return year.group(1)
    return f"{UNPARSED}: {text}"


def parse_quantity(value: Any) -> tuple[int | None, int | None, str]:
    """Return conservative lower/upper quantity bounds and the raw phrase."""

    raw = clean_cell(value)
    if not raw:
        return None, None, NOT_DOCUMENTED
    range_match = re.search(r"\b(\d[\d,]*)\s*(?:[–—-]|to)\s*(\d[\d,]*)\b", raw, flags=re.IGNORECASE)
    if range_match:
        lower = int(range_match.group(1).replace(",", ""))
        upper = int(range_match.group(2).replace(",", ""))
        return min(lower, upper), max(lower, upper), raw
    values = parse_quantity_values(raw)
    if not values:
        return None, None, raw
    quantity = values[0]
    if len(values) > 1:
        return min(values), max(values), raw
    return quantity, quantity, raw


def parse_quantity_values(value: Any) -> list[int]:
    """Preserve every explicit numeric quantity in a source phrase."""

    text = clean_cell(value)
    values: list[int] = []
    for match in re.finditer(r"\b\d[\d,]*\b", text):
        prefix = text[max(0, match.start() - 6):match.start()].casefold().rstrip()
        if prefix.endswith("mk") or prefix.endswith("mark"):
            continue
        values.append(int(match.group(0).replace(",", "")))
    return values


def _base_header(header: str) -> str:
    return clean_cell(header).split(" | ", 1)[0].casefold()


def _header_parts(header: str) -> list[str]:
    return [part.casefold() for part in clean_cell(header).split(" | ") if part]


def is_header_like_row(raw_record: dict[str, Any], columns: Iterable[str]) -> bool:
    """Identify repeated section/header rows emitted by Wikipedia table markup."""

    values = [clean_cell(value) for value in raw_record.values() if clean_cell(value)]
    if not values:
        return True
    if len(values) > 1 and len(set(value.casefold() for value in values)) == 1:
        return True
    header_tokens = {part for column in columns for part in _header_parts(column)}
    return len(values) > 1 and all(value.casefold() in header_tokens for value in values)


def _values_for(raw_record: dict[str, str], names: Iterable[str]) -> list[str]:
    wanted = {name.casefold() for name in names}
    return [
        cleaned_value
        for key, raw_value in raw_record.items()
        if any(part in wanted for part in _header_parts(key)) and (cleaned_value := clean_cell(raw_value))
    ]


def _first_value(raw_record: dict[str, str], names: Iterable[str]) -> str:
    values = _values_for(raw_record, names)
    return values[0] if values else NOT_DOCUMENTED


def _joined_values(raw_record: dict[str, str], names: Iterable[str]) -> str:
    values = list(dict.fromkeys(_values_for(raw_record, names)))
    return " | ".join(values) if values else NOT_DOCUMENTED


def _date_value(raw_record: dict[str, str], names: Iterable[str]) -> str:
    for value in _values_for(raw_record, names):
        parsed = normalise_date(value)
        if parsed != NOT_DOCUMENTED and not parsed.startswith(f"{UNPARSED}:"):
            return parsed
    return NOT_DOCUMENTED


def _json_value(values: dict[str, str]) -> str:
    return json.dumps(values, ensure_ascii=False, sort_keys=True) if values else NOT_DOCUMENTED


def _matching_values(raw_record: dict[str, str], tokens: Iterable[str]) -> dict[str, str]:
    lowered_tokens = tuple(token.casefold() for token in tokens)
    return {
        key: value
        for key, value in raw_record.items()
        if value and any(token in part for token in lowered_tokens for part in _header_parts(key))
    }


def _has_documented_value(values: Iterable[str]) -> bool:
    missing = {"", "-", "–", "—", "n/a", "na", "unknown", NOT_DOCUMENTED.casefold()}
    return any(clean_cell(value).casefold() not in missing for value in values)


def _branch_for_context(source: SourceSpec | None, category: str | None) -> str:
    """Correct service attribution for the shared active-aircraft page."""

    if source and source.key == "iaf_active_aircraft":
        context = clean_cell(category).casefold()
        if "army aviation" in context:
            return "Indian Army"
        if "naval air arm" in context:
            return "Indian Navy"
        if "coast guard" in context:
            return "Indian Coast Guard"
    return source.branch if source else NOT_DOCUMENTED


def _official_claims_for(system_name: str, branch: str) -> list[dict[str, Any]]:
    lowered_name = clean_cell(system_name).casefold()
    lowered_branch = clean_cell(branch).casefold()
    matches: list[dict[str, Any]] = []
    for claim in OFFICIAL_CLAIMS:
        aliases = [clean_cell(alias).casefold() for alias in claim["system_aliases"]]
        branches = [clean_cell(alias).casefold() for alias in claim["branch_aliases"]]
        name_match = any(alias == lowered_name or alias in lowered_name or lowered_name in alias for alias in aliases)
        branch_match = any(alias == lowered_branch or alias in lowered_branch or lowered_branch in alias for alias in branches)
        if name_match and branch_match:
            matches.append(claim)
    return matches


def build_canonical_record(
    raw_record: dict[str, Any],
    *,
    source_key: str,
    source_url: str,
    table_index: int,
    row_index: int,
    retrieved_at: str,
    category: str | None = None,
    branch_override: str | None = None,
    domain_override: str | None = None,
) -> dict[str, Any]:
    """Map one cleaned source row without discarding unmatched source fields."""

    cleaned = {clean_cell(key): clean_cell(value) for key, value in raw_record.items() if clean_cell(key)}
    source = SOURCE_REGISTRY.get(source_key)
    branch = branch_override or _branch_for_context(source, category)
    domain = domain_override or (source.domain if source else NOT_DOCUMENTED)
    system_name = _first_value(
        cleaned,
        ("boat", "ship", "vessel", "aircraft", "name", "system", "weapon", "missile", "vehicle", "equipment", "class", "programme", "program"),
    )
    designation = _first_value(cleaned, ("designation", "model", "mark"))
    variant = _first_value(cleaned, ("variant", "mark", "model"))
    role_purpose = _first_value(cleaned, ("role", "purpose", "mission", "function", "type"))
    status_text = _joined_values(cleaned, ("status", "notes", "note", "remarks", "fate", "disposition"))
    status = normalise_status(status_text)
    if status == "not_documented" and category:
        status = normalise_status(category)
    if status == "not_documented" and source and source.context_status:
        status = source.context_status
    if status == "historical" and source and source.context_status == "in_service":
        status = source.context_status
    in_service_values = _values_for(cleaned, ("in service", "active", "operational"))
    if _has_documented_value(in_service_values):
        if status in {"on_order", "planned_or_proposed", "under_development", "under_trials", "under_construction_and_planned"}:
            status = "in_service_and_on_order"
        elif status not in {"decommissioned_or_retired", "historical"}:
            status = "in_service"
    official_claims = _official_claims_for(system_name, branch)

    quantity, quantity_max, quantity_raw = parse_quantity(
        _first_value(cleaned, ("quantity", "units", "in service", "no. of ships", "no. of boats", "no. of airframes", "number"))
    )
    if quantity_raw == NOT_DOCUMENTED:
        quantity_raw = NOT_DOCUMENTED

    dimensions = _matching_values(cleaned, ("dimension", "length", "beam", "height", "width", "diameter", "draft", "draught", "weight", "displacement"))
    specifications = _matching_values(
        cleaned,
        ("spec", "range", "speed", "engine", "propulsion", "armament", "calibre", "caliber", "capacity", "payload", "guidance", "warhead", "power", "crew", "endurance", "performance"),
    )

    return {
        "record_id": canonical_record_id(source_key, table_index, row_index),
        "branch": branch,
        "domain": domain,
        "category": category or _first_value(cleaned, ("category", "class", "type")),
        "system_name": system_name,
        "designation": designation,
        "variant": variant,
        "role_purpose": role_purpose,
        "status": status,
        "source_status": status_text,
        "verification_status": "official_claim_available" if official_claims else "not_independently_verified",
        "verification_sources": json.dumps(sorted({claim["url"] for claim in official_claims}), ensure_ascii=False),
        "status_as_of": retrieved_at[:10],
        "commissioned_or_inducted_date": _date_value(cleaned, ("comm.", "commissioned", "commissioning", "inducted", "induction", "introduced", "introduction", "intr.", "entered service", "entry into service", "service from")),
        "retired_or_decommissioned_date": _date_value(cleaned, ("decommissioned", "retired", "withdrawn", "retirement", "decommissioning", "service till", "service until")),
        "quantity": quantity,
        "quantity_min": quantity,
        "quantity_max": quantity_max,
        "quantity_raw": quantity_raw,
        "quantity_values": json.dumps(parse_quantity_values(quantity_raw), ensure_ascii=False),
        "specifications": _json_value(specifications),
        "dimensions": _json_value(dimensions),
        "make_manufacturer": _first_value(cleaned, ("manufacturer", "make", "builder", "shipyard", "developer", "designer", "producer")),
        "country_of_origin": _first_value(cleaned, ("origin", "country", "country of origin")),
        "operators": _joined_values(cleaned, ("operator", "operators", "used by")),
        "notes": _joined_values(cleaned, ("notes", "note", "remarks", "comment", "fate")),
        "source_key": source_key,
        "source_url": source_url,
        "source_table": table_index,
        "source_row": row_index,
        "retrieved_at": retrieved_at,
        "raw_record": cleaned,
    }


def _repair_table_attributes(html: str) -> str:
    """Repair numeric rowspan/colspan quote mismatches seen in live wiki HTML."""

    return re.sub(
        r"\b(rowspan|colspan)\s*=\s*(['\"])(\d+)(?:['\"])",
        lambda match: f"{match.group(1)}={match.group(2)}{match.group(3)}{match.group(2)}",
        html,
        flags=re.IGNORECASE,
    )


def extract_wikitable_frames(html: str) -> list[tuple[pd.DataFrame, str]]:
    """Extract each `table.wikitable`, including tables with `sortable` classes."""

    soup = BeautifulSoup(_repair_table_attributes(html), "html.parser")
    frames: list[tuple[pd.DataFrame, str]] = []
    for table in soup.select("table.wikitable"):
        table_heading = ""
        caption = table.find("caption")
        if caption:
            table_heading = clean_cell(caption.get_text(" ", strip=True))
        if not table_heading:
            context_heading = table.find_previous(["h2", "h3", "h4", "h5", "h6"])
            if context_heading:
                table_heading = clean_cell(context_heading.get_text(" ", strip=True))
        table_html = StringIO(str(table))
        try:
            frame = pd.read_html(table_html, flavor="lxml")[0]
        except (ImportError, ValueError):
            frame = pd.read_html(StringIO(str(table)), flavor="bs4")[0]
        frames.append((frame, table_heading or NOT_DOCUMENTED))
    return frames


def build_session(retries: int = 3) -> requests.Session:
    retry = Retry(
        total=retries,
        connect=retries,
        read=retries,
        status=retries,
        backoff_factor=0.5,
        status_forcelist=(429, 500, 502, 503, 504),
        allowed_methods=frozenset({"GET"}),
        raise_on_status=False,
    )
    adapter = HTTPAdapter(max_retries=retry)
    session = requests.Session()
    session.headers.update({"User-Agent": USER_AGENT, "Accept": "text/html,application/xhtml+xml"})
    session.mount("https://", adapter)
    session.mount("http://", adapter)
    return session


def _cache_path(cache_dir: Path, url: str) -> Path:
    digest = hashlib.sha256(url.encode("utf-8")).hexdigest()[:24]
    return cache_dir / f"{digest}.html"


def _write_bytes_atomically(data: bytes, output: Path) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(dir=output.parent, prefix=f".{output.name}.", suffix=".tmp", delete=False) as temporary:
        temporary_path = Path(temporary.name)
        temporary.write(data)
    temporary_path.replace(output)


def fetch_source_html(
    session: requests.Session,
    source: SourceSpec,
    *,
    timeout: float,
    cache_dir: Path | None,
    use_cache: bool,
    cache_ttl_seconds: float = CACHE_TTL_SECONDS,
) -> tuple[str, bool]:
    if cache_dir and use_cache:
        cached = _cache_path(cache_dir, source.url)
        if cached.exists() and cached.stat().st_size > 0 and time.time() - cached.stat().st_mtime <= cache_ttl_seconds:
            return _decode_source_payload(cached.read_text(encoding="utf-8"), source), True
    response = session.get(source.url, timeout=timeout)
    response.raise_for_status()
    html = _decode_source_payload(response.text, source)
    if cache_dir:
        _write_bytes_atomically(response.content, _cache_path(cache_dir, source.url))
    return html, False


def _decode_source_payload(payload: str, source: SourceSpec) -> str:
    """Return HTML from either a normal page or the Fandom parse API response."""

    if "fandom.com/api.php" not in source.url:
        return payload
    parsed = json.loads(payload)
    try:
        return parsed["parse"]["text"]["*"]
    except (KeyError, TypeError) as error:
        raise ValueError(f"Fandom API response did not contain parsed HTML: {error}") from error


def _write_text_atomically(text: str, output: Path) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=output.parent, prefix=f".{output.name}.", suffix=".tmp", delete=False) as temporary:
        temporary_path = Path(temporary.name)
        temporary.write(text)
    temporary_path.replace(output)


def _write_csv_atomically(rows: list[dict[str, Any]], fields: list[str], output: Path) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", newline="", dir=output.parent, prefix=f".{output.name}.", suffix=".tmp", delete=False) as temporary:
        temporary_path = Path(temporary.name)
        writer = csv.DictWriter(
            temporary,
            fieldnames=fields,
            extrasaction="ignore",
            lineterminator="\n",
        )
        writer.writeheader()
        for row in rows:
            serialised = dict(row)
            if isinstance(serialised.get("raw_record"), dict):
                serialised["raw_record"] = json.dumps(serialised["raw_record"], ensure_ascii=False, sort_keys=True)
            writer.writerow(serialised)
    temporary_path.replace(output)


def _write_json_atomically(value: Any, output: Path) -> None:
    _write_text_atomically(json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n", output)


def _build_official_supplement_records(retrieved_at: str) -> list[dict[str, Any]]:
    claims_by_id = {claim["claim_id"]: claim for claim in OFFICIAL_CLAIMS}
    records: list[dict[str, Any]] = []
    for row_index, supplement in enumerate(OFFICIAL_SUPPLEMENT_RECORDS, start=1):
        claim = claims_by_id[supplement["claim_id"]]
        raw_record = dict(supplement)
        raw_record["source_title"] = claim["title"]
        raw_record["source_publisher"] = claim["publisher"]
        raw_record["source_published_date"] = claim["published_date"]
        records.append(
            {
                "record_id": canonical_record_id("official_pib_drdo_updates", 1, row_index),
                "branch": supplement["branch"],
                "domain": supplement["domain"],
                "category": supplement["category"],
                "system_name": supplement["system_name"],
                "designation": "Not documented",
                "variant": "Not documented",
                "role_purpose": supplement["role_purpose"],
                "status": supplement["status"],
                "source_status": supplement["source_status"],
                "verification_status": "official_supplement",
                "verification_sources": json.dumps([claim["url"]], ensure_ascii=False),
                "status_as_of": supplement["status_as_of"],
                "commissioned_or_inducted_date": supplement["commissioned_or_inducted_date"],
                "retired_or_decommissioned_date": supplement["retired_or_decommissioned_date"],
                "quantity": supplement["quantity"],
                "quantity_min": supplement["quantity_min"],
                "quantity_max": supplement["quantity_max"],
                "quantity_raw": supplement["quantity_raw"],
                "quantity_values": supplement["quantity_values"],
                "specifications": supplement["specifications"],
                "dimensions": supplement["dimensions"],
                "make_manufacturer": supplement["make_manufacturer"],
                "country_of_origin": supplement["country_of_origin"],
                "operators": supplement["operators"],
                "notes": supplement["notes"],
                "source_key": "official_pib_drdo_updates",
                "source_url": claim["url"],
                "source_table": 1,
                "source_row": row_index,
                "retrieved_at": retrieved_at,
                "raw_record": raw_record,
            }
        )
    return records


def run_scrape(
    *,
    output_dir: Path = DEFAULT_OUTPUT_DIR,
    source_keys: Iterable[str] | None = None,
    delay: float = 0.5,
    timeout: float = 30.0,
    retries: int = 3,
    cache_dir: Path | None = None,
    use_cache: bool = True,
    cache_ttl_seconds: float = CACHE_TTL_SECONDS,
    session: requests.Session | None = None,
) -> dict[str, Any]:
    """Fetch registered sources and atomically write raw and canonical artifacts."""

    if delay < 0:
        raise ValueError("delay must be non-negative")
    if timeout <= 0:
        raise ValueError("timeout must be positive")
    if retries < 0:
        raise ValueError("retries must be non-negative")
    if cache_ttl_seconds < 0:
        raise ValueError("cache_ttl_seconds must be non-negative")

    selected_keys = list(source_keys or SOURCE_REGISTRY.keys())
    unknown = [key for key in selected_keys if key not in SOURCE_REGISTRY]
    if unknown:
        raise ValueError(f"Unknown source key(s): {', '.join(unknown)}")
    sources = [SOURCE_REGISTRY[key] for key in selected_keys]
    output_dir.mkdir(parents=True, exist_ok=True)
    raw_dir = output_dir / "raw"
    if cache_dir is None:
        cache_dir = output_dir / ".cache"
    active_session = session or build_session(retries)
    retrieved_at = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    records: list[dict[str, Any]] = []
    source_runs: list[dict[str, Any]] = []

    for source_index, source in enumerate(sources):
        if source_index and delay:
            time.sleep(delay)
        source_run: dict[str, Any] = {"key": source.key, "url": source.url, "tables": [], "error": None}
        try:
            html, cached = fetch_source_html(
                active_session,
                source,
                timeout=timeout,
                cache_dir=cache_dir,
                use_cache=use_cache,
                cache_ttl_seconds=cache_ttl_seconds,
            )
            source_run["cached"] = cached
            frames = extract_wikitable_frames(html)
            for table_index, (frame, heading) in enumerate(frames, start=1):
                cleaned_frame = flatten_columns(frame)
                raw_path = raw_dir / f"{source.key}_table_{table_index:02d}.csv"
                raw_columns = ["source_key", "source_url", "source_table", "source_row", "retrieved_at", *cleaned_frame.columns]
                raw_rows = [
                    {
                        "source_key": source.key,
                        "source_url": source.url,
                        "source_table": table_index,
                        "source_row": row_index,
                        "retrieved_at": retrieved_at,
                        **raw_row,
                    }
                    for row_index, raw_row in enumerate(cleaned_frame.to_dict("records"), start=1)
                ]
                _write_csv_atomically(raw_rows, raw_columns, raw_path)
                row_count = 0
                excluded_count = 0
                for row_index, raw_row in enumerate(cleaned_frame.to_dict("records"), start=1):
                    if is_header_like_row(raw_row, cleaned_frame.columns):
                        continue
                    record = build_canonical_record(
                        raw_row,
                        source_key=source.key,
                        source_url=source.url,
                        table_index=table_index,
                        row_index=row_index,
                        retrieved_at=retrieved_at,
                        category=heading if heading != NOT_DOCUMENTED else None,
                    )
                    if record["system_name"] == NOT_DOCUMENTED:
                        continue
                    if record["branch"] == "Indian Coast Guard":
                        excluded_count += 1
                        continue
                    if source.key == "iaf_weapon_systems" and clean_cell(heading).casefold() == "commands":
                        excluded_count += 1
                        continue
                    records.append(record)
                    row_count += 1
                source_run["tables"].append(
                    {
                        "table": table_index,
                        "heading": heading,
                        "rows": row_count,
                        "excluded_rows": excluded_count,
                        "raw_file": str(raw_path.relative_to(output_dir)),
                    }
                )
            source_run["raw_tables"] = len(frames)
            source_run["canonical_rows"] = sum(table["rows"] for table in source_run["tables"])
        except (requests.RequestException, ImportError, ValueError) as error:
            source_run["error"] = f"{type(error).__name__}: {error}"
            source_run["raw_tables"] = 0
            source_run["canonical_rows"] = 0
        source_runs.append(source_run)
        print(f"[{source.key}] {source_run.get('canonical_rows', 0)} canonical rows from {source_run.get('raw_tables', 0)} tables", flush=True)

    failed_sources = [source_run for source_run in source_runs if source_run.get("error")]
    if failed_sources:
        failed_keys = ", ".join(source_run["key"] for source_run in failed_sources)
        raise RuntimeError(f"Source extraction failed for: {failed_keys}; canonical outputs were not replaced")
    include_official_supplements = source_keys is None or set(selected_keys) == set(SOURCE_REGISTRY)
    official_records = _build_official_supplement_records(retrieved_at) if include_official_supplements else []
    if official_records:
        records.extend(official_records)
        official_raw_rows = []
        for record in official_records:
            official_raw_rows.append(
                {
                    "source_key": record["source_key"],
                    "source_url": record["source_url"],
                    "source_table": record["source_table"],
                    "source_row": record["source_row"],
                    "retrieved_at": retrieved_at,
                    **record["raw_record"],
                }
            )
        official_raw_fields = list(dict.fromkeys(key for row in official_raw_rows for key in row))
        _write_csv_atomically(
            official_raw_rows,
            official_raw_fields,
            raw_dir / "official_pib_drdo_updates_table_01.csv",
        )
    if not records:
        raise RuntimeError("No equipment records were extracted; refusing to overwrite canonical outputs")

    _write_csv_atomically(records, CANONICAL_FIELDS, output_dir / "equipment_records.csv")
    _write_json_atomically(records, output_dir / "equipment_records.json")
    claim_fields = [
        "claim_id",
        "publisher",
        "title",
        "published_date",
        "field",
        "value",
        "url",
        "system_aliases",
        "branch_aliases",
    ]
    claim_rows = [
        {
            field: json.dumps(claim[field], ensure_ascii=False)
            if isinstance(claim[field], list)
            else claim[field]
            for field in claim_fields
        }
        for claim in OFFICIAL_CLAIMS
    ]
    _write_csv_atomically(claim_rows, claim_fields, output_dir / "official_verification.csv")
    _write_json_atomically(OFFICIAL_CLAIMS, output_dir / "official_verification.json")
    _write_json_atomically(
        {
            "generated_at": retrieved_at,
            "selected_sources": [asdict(source) for source in sources],
            "source_registry_size": len(SOURCE_REGISTRY),
            "official_evidence_sources": OFFICIAL_CLAIMS,
        },
        output_dir / "source_manifest.json",
    )
    report = {
        "generated_at": retrieved_at,
        "selected_sources": selected_keys,
        "canonical_rows": len(records),
        "raw_tables": sum(int(source_run.get("raw_tables", 0)) for source_run in source_runs),
        "official_evidence_claims": len(OFFICIAL_CLAIMS),
        "official_supplement_rows": len(official_records),
        "source_runs": source_runs,
        "status_counts": pd.Series([record["status"] for record in records]).value_counts().to_dict(),
        "branch_counts": pd.Series([record["branch"] for record in records]).value_counts().to_dict(),
        "coverage_notes": [
            {
                "branch": "Indian Army",
                "state": "historical",
                "note": "No authoritative standalone historical Army inventory was available in the registered open sources; supplemental legacy records are included, and undocumented status is not inferred.",
            },
            {
                "branch": "Indian Army · Indian Navy · Indian Air Force",
                "state": "official_verification",
                "note": f"{len(OFFICIAL_CLAIMS)} curated DRDO/Ministry of Defence claims were exported; {len(official_records)} additive official supplement records were included. Unmatched source-table rows remain explicitly not independently verified.",
            },
        ],
    }
    _write_json_atomically(report, output_dir / "run_report.json")
    print(f"Equipment extraction complete: {len(records)} rows written to {output_dir}", flush=True)
    return report


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIR)
    parser.add_argument("--source", action="append", choices=sorted(SOURCE_REGISTRY), help="Run only this registered source; repeat for multiple sources.")
    parser.add_argument("--delay", type=float, default=0.5)
    parser.add_argument("--timeout", type=float, default=30.0)
    parser.add_argument("--retries", type=int, default=3)
    parser.add_argument("--cache-dir", type=Path, default=None)
    parser.add_argument("--cache-ttl-hours", type=float, default=CACHE_TTL_SECONDS / 3600, help="Use cached HTML only up to this age; use 0 to disable cache reads.")
    parser.add_argument("--no-cache", action="store_true", help="Always fetch live HTML instead of reading the local cache.")
    args = parser.parse_args(argv)
    try:
        run_scrape(
            output_dir=args.output_dir,
            source_keys=args.source,
            delay=args.delay,
            timeout=args.timeout,
            retries=args.retries,
            cache_dir=args.cache_dir,
            use_cache=not args.no_cache,
            cache_ttl_seconds=args.cache_ttl_hours * 3600,
        )
    except (RuntimeError, ValueError, requests.RequestException) as error:
        parser.exit(1, f"Equipment extraction failed: {error}\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
