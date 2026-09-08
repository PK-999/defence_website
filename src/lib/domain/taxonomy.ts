import type { NormalizationResult, ValidationIssue } from "./types";

export type Domain = "air" | "land" | "sea" | "missile" | "space-isr" | "support" | "unknown";
export type ServiceStatus = "active" | "retired" | "under-development" | "planned" | "limited" | "unknown";
export type DevelopmentModel = "indigenous" | "joint-development" | "license-produced" | "imported" | "mixed" | "unknown";
export type OperationCategory = "combat" | "evacuation" | "humanitarian" | "peacekeeping" | "maritime-security" | "rescue" | "battle" | "event" | "other";
export type ServiceId = "army" | "navy" | "air-force" | "coast-guard" | "tri-service";

const knownRanks = [
  "Field Marshal", "Marshal of the Indian Air Force", "General", "Air Chief Marshal", "Admiral",
  "Lieutenant General", "Air Marshal", "Vice Admiral", "Major General", "Air Vice Marshal", "Rear Admiral",
  "Brigadier", "Air Commodore", "Commodore", "Colonel", "Group Captain", "Captain (Navy)", "Captain",
  "Lieutenant Colonel", "Wing Commander", "Commander", "Major", "Squadron Leader", "Lieutenant Commander",
  "Captain (Army)", "Flight Lieutenant", "Lieutenant", "Flying Officer", "Sub Lieutenant", "Pilot Officer",
  "Subedar Major", "Honorary Captain", "Master Warrant Officer", "Master Chief Petty Officer I", "Subedar",
  "Warrant Officer", "Master Chief Petty Officer II", "Naib Subedar", "Junior Warrant Officer", "Chief Petty Officer",
  "Havildar", "Sergeant", "Petty Officer", "Naik", "Corporal", "Leading Seaman", "Lance Naik", "Leading Aircraftsman",
  "Sepoy", "Rifleman", "Grenadier", "Aircraftsman", "Seaman", "2nd Lt.", "Lt. General", "Lt. Colonel", "Maj. General",
] as const;

const knownAwards = [
  "Param Vir Chakra", "Ashoka Chakra", "Maha Vir Chakra", "Kirti Chakra", "Vir Chakra", "Shaurya Chakra",
  "Sena Medal", "Nao Sena Medal", "Vayu Sena Medal", "Param Vishisht Seva Medal", "Ati Vishisht Seva Medal",
  "Vishisht Seva Medal",
] as const;

function unknownIssue(code: string, value: string): ValidationIssue[] {
  return [{ code, path: "value", message: `Unrecognized taxonomy value requires review: ${value}`, severity: "warning" }];
}

function normalize<T>(value: string | null | undefined, map: Record<string, T>, fallback: T, code: string): NormalizationResult<T> {
  const key = value?.trim().toLowerCase().replace(/[_\s]+/g, "-") ?? "";
  const mapped = map[key];
  return mapped === undefined
    ? { value: fallback, issues: value ? unknownIssue(code, value) : [] }
    : { value: mapped, issues: [] };
}

export function normalizeDomain(value: string | null | undefined): NormalizationResult<Domain> {
  return normalize(value, {
    air: "air", aerospace: "air", land: "land", ground: "land", sea: "sea", naval: "sea", maritime: "sea",
    missile: "missile", missiles: "missile", "space-isr": "space-isr", space: "space-isr", support: "support",
  }, "unknown", "UNKNOWN_DOMAIN");
}

export function normalizeServiceStatus(value: string | null | undefined): NormalizationResult<ServiceStatus> {
  return normalize(value, {
    active: "active", deployed: "active", "active-service": "active", retired: "retired", decommissioned: "retired",
    "under-development": "under-development", development: "under-development", planned: "planned", limited: "limited",
  }, "unknown", "UNKNOWN_SERVICE_STATUS");
}

export function normalizeDevelopmentModel(value: string | null | undefined): NormalizationResult<DevelopmentModel> {
  return normalize(value, {
    indigenous: "indigenous", "joint-development": "joint-development", "joint-venture": "joint-development",
    "license-produced": "license-produced", licensed: "license-produced", imported: "imported", procured: "imported", "procured-modified": "mixed", mixed: "mixed",
  }, "unknown", "UNKNOWN_DEVELOPMENT_MODEL");
}

export function normalizeService(value: string | null | undefined): NormalizationResult<ServiceId | null> {
  return normalize(value, {
    army: "army", "indian-army": "army", navy: "navy", naval: "navy", "indian-navy": "navy", airforce: "air-force", "air-force": "air-force", "indian-air-force": "air-force", "coast-guard": "coast-guard", "indian-coast-guard": "coast-guard", "tri-service": "tri-service",
  }, null, "UNKNOWN_SERVICE");
}

export function normalizeRank(value: string | null | undefined): NormalizationResult<string | null> {
  if (value === null || value === undefined || !value.trim()) return { value: null, issues: [] };
  const exact = knownRanks.find((rank) => rank.toLowerCase() === value.trim().toLowerCase());
  return exact
    ? { value: exact, issues: [] }
    : { value: null, issues: unknownIssue("UNKNOWN_RANK", value) };
}

export function normalizeAwards(value: unknown): NormalizationResult<string[]> {
  if (value === null || value === undefined) return { value: [], issues: [] };
  let values: unknown[];
  if (Array.isArray(value)) values = value;
  else if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      values = Array.isArray(parsed) ? parsed : [value];
    } catch {
      values = [value];
    }
  } else values = [value];

  const issues: ValidationIssue[] = [];
  const normalized: string[] = [];
  for (const item of values) {
    if (typeof item !== "string" || !item.trim()) {
      issues.push({ code: "UNKNOWN_AWARD", path: "value", message: "Award identity requires review.", severity: "warning" });
      continue;
    }
    const exact = knownAwards.find((award) => award.toLowerCase() === item.trim().toLowerCase());
    if (!exact) {
      issues.push(...unknownIssue("UNKNOWN_AWARD", item));
      continue;
    }
    if (!normalized.includes(exact)) normalized.push(exact);
  }
  return { value: normalized, issues };
}

export function normalizeOperationCategory(value: string | null | undefined): NormalizationResult<OperationCategory> {
  return normalize(value, {
    combat: "combat", evacuation: "evacuation", humanitarian: "humanitarian", peacekeeping: "peacekeeping", "maritime-security": "maritime-security", rescue: "rescue", battle: "battle", "naval-battle": "battle", event: "event", other: "other",
  }, "other", "UNKNOWN_OPERATION_CATEGORY");
}
