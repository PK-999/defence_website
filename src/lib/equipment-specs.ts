export interface EquipmentSpecRow {
  label: string;
  value: string;
  sourceId?: string;
  unit?: string;
}

function cleanLabel(raw: string): string {
  return raw
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/^Ordered Quantity$/, "Fleet Ordered")
    .replace(/^Commissioned On$/, "Commission Date")
    .replace(/^Retired On$/, "Retirement Date")
    .replace(/^Gun Calibre$/, "Calibre")
    .replace(/^Status Event$/, "Procurement Milestone");
}

export function parseEquipmentSpecs(specs: unknown): EquipmentSpecRow[] {
  if (!specs) return [];
  
  let data = specs;
  if (typeof specs === "string") {
    try {
      data = JSON.parse(specs);
    } catch {
      return [];
    }
  }

  if (Array.isArray(data)) {
    return data.filter(Boolean).map((s: any) => {
      const rawLabel = s.label || s.key || s.name || s.field || "Specification";
      return {
        label: cleanLabel(String(rawLabel)),
        value: String(s.value ?? ""),
        sourceId: s.sourceId,
        unit: s.unit || undefined,
      };
    });
  }

  if (typeof data === "object" && data !== null) {
    return Object.entries(data).map(([key, val]) => ({
      label: cleanLabel(key),
      value: typeof val === "object" && val !== null ? JSON.stringify(val) : String(val ?? ""),
    }));
  }

  return [];
}
