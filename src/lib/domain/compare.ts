import type { PrismaClient } from "@prisma/client";
import { prisma as defaultPrisma } from "@/lib/db";
import { getPublicEquipment } from "@/lib/repositories/entities";

export function normalizeComparisonSlugs(slugs: string[]): string[] {
  return [...new Set(slugs.map((slug) => slug.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b)).slice(0, 3);
}

export function buildComparisonHref(slugs: string[]): string {
  const normalized = normalizeComparisonSlugs(slugs);
  return normalized.length ? `/compare?items=${encodeURIComponent(normalized.join(","))}` : "/compare";
}

type ComparisonSystem = NonNullable<Awaited<ReturnType<typeof getPublicEquipment>>>;
export type ComparisonResult = { systems: ComparisonSystem[]; missing: string[]; rows: Array<{ label: string; values: Array<{ slug: string; value: string }> }> };

function unitOf(value: string): string | null {
  return value.match(/(?:^|\s)(km\/h|km|kg|mm|m|tonnes?|t)(?:$|\s)/i)?.[1]?.toLowerCase() ?? null;
}

export async function getPublicComparison(slugs: string[], db: PrismaClient = defaultPrisma): Promise<ComparisonResult> {
  const normalized = normalizeComparisonSlugs(slugs);
  const loaded = await Promise.all(normalized.map(async (slug) => ({ slug, equipment: await getPublicEquipment(slug, db) })));
  const systems = loaded.flatMap((item) => item.equipment ? [item.equipment] : []);
  const missing = loaded.filter((item) => !item.equipment).map((item) => item.slug);
  const maps = systems.map((system) => ({ system, specs: system.specs && typeof system.specs === "object" && !Array.isArray(system.specs) ? system.specs as Record<string, unknown> : {} }));
  const keys = [...new Set(maps.flatMap((item) => Object.keys(item.specs)))].sort();
  const rows = keys.flatMap((key) => {
    if (!maps.every(({ specs }) => Object.prototype.hasOwnProperty.call(specs, key))) return [];
    const values = maps.map(({ system, specs }) => ({ slug: system.slug, value: typeof specs[key] === "string" || typeof specs[key] === "number" ? String(specs[key]) : "Not documented" }));
    const units = values.map((value) => unitOf(value.value)).filter((unit): unit is string => Boolean(unit));
    if (units.length > 0 && new Set(units).size > 1) return [];
    return [{ label: key.replace(/[-_]/g, " "), values }];
  });
  return { systems, missing, rows };
}
