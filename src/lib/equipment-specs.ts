export type EquipmentSpecRow = {
  label: string;
  value: string;
  unit?: string;
  effectiveDate?: string;
  scope?: string;
  note?: string;
  sourceId?: string;
  locator?: string;
};

const labelize = (value: string) => value
  .replace(/[-_]/g, " ")
  .replace(/\b\w/g, (letter) => letter.toUpperCase());

const optionalString = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() ? value.trim() : undefined;

export function parseEquipmentSpecs(value: unknown): EquipmentSpecRow[] {
  if (Array.isArray(value)) {
    return value.flatMap((entry) => {
      if (typeof entry !== "object" || entry === null) return [];
      const record = entry as Record<string, unknown>;
      const field = optionalString(record.label) ?? optionalString(record.field) ?? optionalString(record.key) ?? "Specification";
      return [{
        label: labelize(field),
        value: record.value === null || record.value === undefined ? "Not documented" : String(record.value),
        ...(optionalString(record.unit) ? { unit: optionalString(record.unit) } : {}),
        ...(optionalString(record.effectiveDate) ? { effectiveDate: optionalString(record.effectiveDate) } : {}),
        ...(optionalString(record.scope) ?? optionalString(record.context) ? { scope: optionalString(record.scope) ?? optionalString(record.context) } : {}),
        ...(optionalString(record.note) ? { note: optionalString(record.note) } : {}),
        ...(optionalString(record.sourceId) ? { sourceId: optionalString(record.sourceId) } : {}),
        ...(optionalString(record.locator) ? { locator: optionalString(record.locator) } : {}),
      }];
    });
  }

  if (value && typeof value === "object") {
    return Object.entries(value).map(([label, entry]) => ({
      label: labelize(label),
      value: typeof entry === "string" || typeof entry === "number" ? String(entry) : "Not documented",
    }));
  }

  return [];
}
