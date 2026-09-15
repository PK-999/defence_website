const valueLabels: Record<string, Record<string, string>> = {
  domain: { army: "Army", land: "Army", navy: "Navy", sea: "Navy", airforce: "Air Force", air: "Air Force", support: "Support" },
  serviceStatus: { active: "Deployed", deployed: "Deployed", retired: "Decommissioned", decommissioned: "Decommissioned", planned: "Planned" },
};

function titleCase(value: string): string {
  return value.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim().replace(/^\w/, (letter) => letter.toUpperCase());
}

export function formatEquipmentValue(field: string, value: string | null | undefined): string {
  const normalized = value?.trim();
  if (!normalized || normalized.toLowerCase() === "unknown" || normalized.toLowerCase() === "not documented") return "Not documented";
  return valueLabels[field]?.[normalized.toLowerCase()] ?? titleCase(normalized);
}
