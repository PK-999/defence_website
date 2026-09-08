import { afterAll, describe, expect, it } from "vitest";
import { PrismaClient } from "@prisma/client";
import { formatHistoricalDate, historicalOrderKey } from "@/lib/domain/dates";
import { getPublicOperation } from "@/lib/repositories/entities";

const db = new PrismaClient();

describe("historical chronology", () => {
  it("formats precision without inventing missing dates", () => {
    expect(formatHistoricalDate("1999-07", "month")).toBe("1999-07");
    expect(formatHistoricalDate("1999", "year")).toBe("1999");
    expect(formatHistoricalDate(null, "unknown")).toBe("Date not documented");
    expect(historicalOrderKey("1999-07", "month")).toBeLessThan(historicalOrderKey("2000", "year"));
    expect(historicalOrderKey(null, "unknown")).toBe(Number.POSITIVE_INFINITY);
  });

  it("keeps a missing operation end date missing", async () => {
    const operation = await getPublicOperation("fixture-operation-other", db);
    expect(operation?.dateEnd).toBeNull();
  });
});

afterAll(async () => db.$disconnect());
