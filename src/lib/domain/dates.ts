export type HistoricalDate = {
  iso: string | null;
  precision: "day" | "month" | "year" | "unknown";
  original: string | null;
};

export type HistoricalDatePrecision = HistoricalDate["precision"];

export class HistoricalDateError extends Error {
  constructor(public readonly code: "INVALID_DATE" | "AMBIGUOUS_DATE", value: string) {
    super(`${code}: ${value}`);
    this.name = "HistoricalDateError";
  }
}

function validateDay(year: number, month: number, day: number, original: string): void {
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day) || month < 1 || month > 12) {
    throw new HistoricalDateError("INVALID_DATE", original);
  }
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  if (day < 1 || day > daysInMonth) throw new HistoricalDateError("INVALID_DATE", original);
}

export function parseHistoricalDate(value: string | null): HistoricalDate {
  if (value === null) return { iso: null, precision: "unknown", original: null };
  const original = value;
  const input = value.trim();
  if (!input) throw new HistoricalDateError("INVALID_DATE", original);
  if (input.includes("/")) throw new HistoricalDateError("AMBIGUOUS_DATE", original);

  const legacy = /^(\d{2})-(\d{2})-(\d{4})$/.exec(input);
  if (legacy) {
    const [, day, month, year] = legacy;
    validateDay(Number(year), Number(month), Number(day), original);
    return { iso: `${year}-${month}-${day}`, precision: "day", original };
  }

  const day = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input);
  if (day) {
    const [, year, month, dayOfMonth] = day;
    validateDay(Number(year), Number(month), Number(dayOfMonth), original);
    return { iso: input, precision: "day", original };
  }

  const month = /^(\d{4})-(\d{2})$/.exec(input);
  if (month) {
    const monthNumber = Number(month[2]);
    if (monthNumber < 1 || monthNumber > 12) throw new HistoricalDateError("INVALID_DATE", original);
    return { iso: input, precision: "month", original };
  }

  if (/^\d{4}$/.test(input)) return { iso: input, precision: "year", original };
  throw new HistoricalDateError("INVALID_DATE", original);
}

export function formatHistoricalDate(value: HistoricalDate | string | null, precision?: HistoricalDatePrecision): string {
  if (typeof value === "object" && value !== null) return value.iso ?? "Date not documented";
  if (!value) return "Date not documented";
  const parsed = parseHistoricalDate(value);
  if (precision && precision !== "unknown" && parsed.precision !== precision) return parsed.iso ?? "Date not documented";
  return parsed.iso ?? "Date not documented";
}

/** Format a stored historical date for readers without applying local timezone conversion. */
export function formatDisplayDate(value: string | null | undefined): string {
  const input = value?.trim();
  if (!input || /^(?:date )?not documented$/i.test(input)) return "Not documented";
  const day = /^(\d{4})-(\d{2})-(\d{2})(?:T.*)?$/.exec(input);
  if (day) return `${day[3]}-${day[2]}-${day[1]}`;
  const month = /^(\d{4})-(\d{2})$/.exec(input);
  if (month) return `${month[2]}-${month[1]}`;
  const monthNames: Record<string, string> = { january: "01", february: "02", march: "03", april: "04", may: "05", june: "06", july: "07", august: "08", september: "09", october: "10", november: "11", december: "12" };
  const named = /^(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),?\s+(\d{4})$/i.exec(input);
  if (named) return `${named[2].padStart(2, "0")}-${monthNames[named[1].toLowerCase()]}-${named[3]}`;
  const namedDayFirst = /^(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December),?\s+(\d{4})$/i.exec(input);
  if (namedDayFirst) return `${namedDayFirst[1].padStart(2, "0")}-${monthNames[namedDayFirst[2].toLowerCase()]}-${namedDayFirst[3]}`;
  if (/^\d{2}-\d{2}-\d{4}$/.test(input) || /^\d{4}$/.test(input)) return input;
  return input;
}

export function historicalOrderKey(value: string | null, precision: HistoricalDatePrecision = "unknown"): number {
  if (!value) return Number.POSITIVE_INFINITY;
  const parsed = parseHistoricalDate(value);
  if (parsed.precision === "unknown" || precision === "unknown") return Number.POSITIVE_INFINITY;
  const [year, month = "01", day = "01"] = parsed.iso?.split("-") ?? [];
  return Date.UTC(Number(year), Number(month) - 1, Number(day));
}

/** Return a stable ascending sort key for legacy and normalized stored dates. */
export function historicalDateSortKey(value: string | null | undefined): number {
  const input = value?.trim().replace(/T.*$/, "");
  if (!input || /^(?:date )?(?:classified|not documented)$/i.test(input)) return Number.POSITIVE_INFINITY;
  try {
    const parsed = parseHistoricalDate(input);
    if (!parsed.iso) return Number.POSITIVE_INFINITY;
    const [year, month = "01", day = "01"] = parsed.iso.split("-");
    return Date.UTC(Number(year), Number(month) - 1, Number(day));
  } catch {
    return Number.POSITIVE_INFINITY;
  }
}
