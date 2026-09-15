import { describe, expect, test } from "vitest";
import { EQUIPMENT_DOSSIERS, getEquipmentDossier } from "@/lib/equipment-dossiers";
import { parseEquipmentSpecs } from "@/lib/equipment-specs";

const LEGACY_EQUIPMENT_SLUGS = [
  "arjun-mbt",
  "bofors-fh-77b",
  "centurion-tank",
  "folland-gnat",
  "hawker-hunter",
  "ins-vikrant-r11",
  "mil-mi-17",
  "mirage-2000",
  "t-72-ajeya",
  "t-90s-bhishma",
  "vidyut-class-missile-boat",
];

describe("equipment research", () => {
  test("covers every published legacy equipment record with cited research", () => {
    expect(Object.keys(EQUIPMENT_DOSSIERS).sort()).toEqual(LEGACY_EQUIPMENT_SLUGS.sort());

    for (const slug of LEGACY_EQUIPMENT_SLUGS) {
      const dossier = getEquipmentDossier(slug);
      expect(dossier?.overview.length).toBeGreaterThan(120);
      expect(dossier?.keyPoints.length).toBeGreaterThanOrEqual(2);
      expect(dossier?.sources.length).toBeGreaterThanOrEqual(2);
      for (const source of dossier?.sources ?? []) expect(source.url).toMatch(/^https:\/\//);
    }
  });

  test("retains imported spec labels, units, dates, scope, notes and source locators", () => {
    expect(parseEquipmentSpecs([{
      field: "maximum-speed",
      value: 68,
      unit: "km/h",
      effectiveDate: "2021-09-23",
      scope: "Arjun Mk-1A",
      note: "Road speed reported in the cited release.",
      sourceId: "pib-arjun-mk1a-2021",
      locator: "Performance section",
    }])).toEqual([{
      label: "Maximum Speed",
      value: "68",
      unit: "km/h",
      effectiveDate: "2021-09-23",
      scope: "Arjun Mk-1A",
      note: "Road speed reported in the cited release.",
      sourceId: "pib-arjun-mk1a-2021",
      locator: "Performance section",
    }]);
  });

  test("continues to parse legacy object and label-value formats", () => {
    expect(parseEquipmentSpecs({ crew: 4 })).toEqual([expect.objectContaining({ label: "Crew", value: "4" })]);
    expect(parseEquipmentSpecs([{ label: "Range", value: "450 km" }])).toEqual([expect.objectContaining({ label: "Range", value: "450 km" })]);
  });
});
