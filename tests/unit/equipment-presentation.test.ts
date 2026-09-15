import { describe, expect, test } from "vitest";
import { formatEquipmentValue } from "@/lib/equipment-presentation";

describe("equipment presentation", () => {
  test("turns stored taxonomy values into reader-friendly labels", () => {
    expect(formatEquipmentValue("domain", "airforce")).toBe("Air Force");
    expect(formatEquipmentValue("category", "armoured-vehicles")).toBe("Armoured vehicles");
    expect(formatEquipmentValue("serviceStatus", "Decommissioned")).toBe("Decommissioned");
    expect(formatEquipmentValue("developmentModel", "unknown")).toBe("Not documented");
  });
});
