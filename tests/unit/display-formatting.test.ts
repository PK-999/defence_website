import { describe, expect, test } from "vitest";
import { formatDisplayDate } from "@/lib/domain/dates";

describe("display formatting", () => {
  test("renders complete ISO dates as dd-mm-yyyy without timezone shifts", () => {
    expect(formatDisplayDate("1948-07-18")).toBe("18-07-1948");
    expect(formatDisplayDate("1999-07-26T23:30:00.000Z")).toBe("26-07-1999");
  });

  test("preserves partial and undocumented dates", () => {
    expect(formatDisplayDate("1948")).toBe("1948");
    expect(formatDisplayDate("1948-07")).toBe("07-1948");
    expect(formatDisplayDate(null)).toBe("Not documented");
    expect(formatDisplayDate("Not documented")).toBe("Not documented");
  });
});
