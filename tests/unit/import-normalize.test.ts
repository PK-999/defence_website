import { describe, expect, it } from "vitest";
import { normalizeImport } from "@/lib/import/normalize";

describe("content import normalization", () => {
  it("normalizes legacy dates and equipment taxonomy while preserving provenance", () => {
    const result = normalizeImport({
      schemaVersion: 1,
      sourceSystem: "fixture",
      records: [{
        entityType: "Equipment",
        externalId: "eq-1",
        data: {
          slug: "fixture-equipment",
          title: "Fixture Equipment",
          summary: "A fixture.",
          domain: "naval",
          developmentModel: "procured",
          serviceStatus: "deployed",
          inductedYear: 2020,
          specs: { combat_radius_km: "350", unknown_field: "keep out" },
        },
      }],
    });

    expect(result.records[0]?.data.domain).toBe("sea");
    expect(result.records[0]?.data.developmentModel).toBe("imported");
    expect(result.records[0]?.data.serviceStatus).toBe("active");
    expect(result.records[0]?.data.specs).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: "combat-radius-km", numericValue: 350 }),
    ]));
    expect(result.records[0]?.issues.some((item) => item.code === "UNKNOWN_SPEC_KEY")).toBe(true);
  });

  it("rejects ambiguous dates and unsupported entity records", () => {
    const result = normalizeImport({
      schemaVersion: 1,
      sourceSystem: "fixture",
      records: [
        { entityType: "Operation", externalId: "op-1", data: { slug: "op", title: "Op", summary: "Summary", dateStart: "01/02/1999", category: "combat" } },
        { entityType: "Unknown", externalId: "bad", data: {} },
      ],
    });

    expect(result.records).toHaveLength(1);
    expect(result.issues.some((item) => item.code === "AMBIGUOUS_DATE")).toBe(true);
    expect(result.issues.some((item) => item.code === "UNKNOWN_ENTITY_TYPE")).toBe(true);
  });

  it("accepts source-backed artillery calibre fields without taxonomy warnings", () => {
    const result = normalizeImport({
      schemaVersion: 1,
      sourceSystem: "fixture",
      records: [{
        entityType: "Equipment",
        externalId: "artillery-1",
        data: {
          slug: "fixture-howitzer",
          title: "Fixture howitzer",
          summary: "A source-backed fixture.",
          domain: "land",
          specs: [
            { key: "calibre", value: 155, unit: "mm" },
            { key: "barrel-length", value: 39, unit: "calibres" },
          ],
        },
      }],
    });

    expect(result.records[0]?.issues).toEqual([]);
    expect(result.records[0]?.data.specs).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: "calibre", numericValue: 155, unit: "mm" }),
      expect.objectContaining({ key: "barrel-length", numericValue: 39, unit: "calibres" }),
    ]));
  });
});
