import { describe, expect, test } from "vitest";
import { mapEquipmentResearchRecord } from "@/lib/equipment-research-import";

describe("equipment research import mapping", () => {
  test("maps a normalized snapshot row into a public equipment record", () => {
    const mapped = mapEquipmentResearchRecord({
      record_id: "eq_test_001",
      system_name: "Example Mk II",
      domain: "airforce",
      category: "aircraft",
      service_domains: '["airforce"]',
      service_status: "Planned",
      status: "planned",
      status_as_of: "2026-09-15",
      role_purpose: "Multirole aircraft",
      quantity: 12,
      quantity_raw: "12 on order",
      country_of_origin: "India",
      variant: "Mk II",
      make_manufacturer: "Example Aeronautics",
      commissioned_or_inducted_date: "Not documented",
      retired_or_decommissioned_date: "Not documented",
      dimensions: "Not documented",
      specifications: "Not documented",
      notes: "Programme announced; delivery schedule is source-dependent.",
      source_key: "iaf_future_programmes",
      source_url: "https://example.test/equipment",
      source_table: 2,
      source_row: 4,
      source_status: "On order",
      verification_status: "not_independently_verified",
      verification_sources: "[]",
      tags: '["aircraft","airforce","status-planned"]',
    });

    expect(mapped).toMatchObject({
      externalId: "eq_test_001",
      slug: "equipment-example-mk-ii-eq-test-001",
      title: "Example Mk II",
      domain: "airforce",
      category: "aircraft",
      serviceStatus: "Planned",
      statusAsOf: "2026-09-15",
      variantLabel: "Mk II",
      originCountries: ["India"],
    });
    expect(mapped.summary).toContain("Multirole aircraft");
    expect(mapped.summary).not.toContain("source-attributed research snapshot");
    expect(mapped.content).not.toContain("source-backed technical facts");
    expect(mapped.content).not.toContain("Configuration scope and limitations");
    expect(mapped.content).toContain("12 on order");
    expect(mapped.specs).toEqual(expect.arrayContaining([
      expect.objectContaining({ label: "Quantity", value: "12 on order", sourceId: "iaf-future-programmes" }),
      expect.objectContaining({ label: "Manufacturer", value: "Example Aeronautics" }),
      expect.objectContaining({ label: "Keywords", value: "Aircraft, airforce, status planned" }),
    ]));
  });

  test("rejects a row outside the canonical service domains or statuses", () => {
    expect(() => mapEquipmentResearchRecord({ record_id: "bad", system_name: "Bad", domain: "space", category: "other", service_status: "Active" })).toThrow(/canonical/);
    expect(() => mapEquipmentResearchRecord({ record_id: "bad", system_name: "Bad", domain: "army", category: "other", service_status: "Active" })).toThrow(/service status/);
  });
});
