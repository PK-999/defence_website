import type { NormalizationResult, ValidationIssue } from "./types";

export type EquipmentSpec = {
  key: string;
  label: string;
  value: string;
  numericValue: number | null;
  unit: string | null;
  context: string | null;
  evidenceIds: string[];
};

const semanticKeys = new Set(["max-speed", "combat-radius", "ferry-range", "crew", "calibre", "barrel-length"]);

function numericValue(value: string): number | null {
  const match = value.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

export function normalizeEquipmentSpecs(input: unknown): NormalizationResult<EquipmentSpec[]> {
  const issues: ValidationIssue[] = [];
  const specs: EquipmentSpec[] = [];
  if (input === null || input === undefined) return { value: specs, issues };

  const entries: Array<[string, unknown]> = Array.isArray(input)
    ? input.map((item, index) => [String(index), item])
    : typeof input === "object" ? Object.entries(input) : [];

  for (const [entryKey, raw] of entries) {
    const object = typeof raw === "object" && raw !== null ? raw as Record<string, unknown> : { value: raw };
    const key = typeof object.key === "string" ? object.key : entryKey;
    const normalizedKey = key.toLowerCase().trim().replace(/[_\s]+/g, "-");
    const value = typeof object.value === "string" || typeof object.value === "number" ? String(object.value) : JSON.stringify(object.value);
    if (!value) {
      issues.push({ code: "EMPTY_SPEC_VALUE", path: `specs.${entryKey}`, message: "Specification value is empty.", severity: "error" });
      continue;
    }
    if (!semanticKeys.has(normalizedKey)) {
      issues.push({ code: "UNKNOWN_SPEC_KEY", path: `specs.${entryKey}`, message: `Unknown specification key requires review: ${key}`, severity: "warning" });
    }
    specs.push({
      key: normalizedKey,
      label: typeof object.label === "string" ? object.label : key,
      value,
      numericValue: numericValue(value),
      unit: typeof object.unit === "string" ? object.unit : null,
      context: typeof object.context === "string" ? object.context : null,
      evidenceIds: Array.isArray(object.evidenceIds) ? object.evidenceIds.filter((id): id is string => typeof id === "string") : [],
    });
  }
  return { value: specs, issues };
}
