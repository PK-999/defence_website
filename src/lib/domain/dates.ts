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

export function historicalOrderKey(value: string | null, precision: HistoricalDatePrecision = "unknown"): number {
  if (!value) return Number.POSITIVE_INFINITY;
  const parsed = parseHistoricalDate(value);
  if (parsed.precision === "unknown" || precision === "unknown") return Number.POSITIVE_INFINITY;
  const [year, month = "01", day = "01"] = parsed.iso?.split("-") ?? [];
  return Date.UTC(Number(year), Number(month) - 1, Number(day));
}
