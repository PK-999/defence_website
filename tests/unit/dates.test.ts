import { describe, expect, test } from "vitest";
import { formatHistoricalDate, historicalDateSortKey, parseHistoricalDate } from "../../src/lib/domain/dates";

describe("parseHistoricalDate", () => {
  test.each([
    ["26-07-1999", { iso: "1999-07-26", precision: "day" }],
    ["1999-07-26", { iso: "1999-07-26", precision: "day" }],
    ["1999-07", { iso: "1999-07", precision: "month" }],
    ["1999", { iso: "1999", precision: "year" }],
  ])("normalizes %s without losing precision", (input, expected) => {
    expect(parseHistoricalDate(input)).toMatchObject({ ...expected, original: input });
  });

  test("represents a missing date without inventing January 1", () => {
    expect(parseHistoricalDate(null)).toEqual({ iso: null, precision: "unknown", original: null });
  });

  test.each(["31-02-1999", "1999-02-31", "03/04/1999", "1999-07-26 to 1999-07-28", "not a date"]) (
    "rejects an unsafe date value: %s",
    (input) => expect(() => parseHistoricalDate(input)).toThrow(/INVALID_DATE|AMBIGUOUS_DATE/),
  );
});

test("formats partial dates and documents unknown dates", () => {
  expect(formatHistoricalDate(parseHistoricalDate("1999-07"))).toBe("1999-07");
  expect(formatHistoricalDate(parseHistoricalDate("1999"))).toBe("1999");
  expect(formatHistoricalDate(parseHistoricalDate(null))).toBe("Date not documented");
});

test("sorts mixed historical date formats by their actual calendar position", () => {
  expect(historicalDateSortKey("03-11-1947")).toBeLessThan(historicalDateSortKey("1984-04-13"));
  expect(historicalDateSortKey("1984-04-13")).toBeLessThan(historicalDateSortKey("1999"));
  expect(historicalDateSortKey("1999-07-26T23:30:00.000Z")).toBeLessThan(historicalDateSortKey("2000"));
  expect(historicalDateSortKey("Date classified")).toBe(Number.POSITIVE_INFINITY);
});
