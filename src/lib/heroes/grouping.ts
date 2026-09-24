import type { CollectionItem } from "@/lib/domain/types";

export const GALLANTRY_AWARD_ORDER = [
  "Param Vir Chakra",
  "Maha Vir Chakra",
  "Vir Chakra",
  "Ashoka Chakra",
  "Kirti Chakra",
  "Shaurya Chakra",
] as const;

const GALLANTRY_AWARDS = new Set<string>(GALLANTRY_AWARD_ORDER);
const FALLBACK_AWARD_ORDER = ["Other decorations", "Award not documented"] as const;

export type HeroCollectionItem = CollectionItem & {
  awards?: string[];
  year?: string;
};

export type HeroAwardYearGroup = {
  year: string;
  items: HeroCollectionItem[];
};

export type HeroAwardGroup = {
  award: string;
  years: HeroAwardYearGroup[];
};

export function parseHeroDecorations(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0) : [];
  } catch {
    return [];
  }
}

export function extractHeroYear(year: string | null | undefined, content: string | null | undefined): string {
  const actionYear = content?.match(/Action date shown by the memorial profile:\s*(\d{4})/i)?.[1]
    ?? content?.match(/\b(?:on|during)\s+(?:\d{1,2}\s+[A-Za-z]+\s+)?((?:19|20)\d{2})\b/i)?.[1]
    ?? content?.match(/\b(?:awarded|award|gallantry)\b[^.]{0,100}?\b((?:19|20)\d{2})\b/i)?.[1];
  return actionYear ?? year?.trim() ?? "Year not documented";
}

function compareYears(left: string, right: string): number {
  const leftYear = /^\d{4}$/.test(left) ? Number(left) : null;
  const rightYear = /^\d{4}$/.test(right) ? Number(right) : null;
  if (leftYear === null && rightYear === null) return left.localeCompare(right);
  if (leftYear === null) return 1;
  if (rightYear === null) return -1;
  return rightYear - leftYear;
}

export function groupHeroesByAwardAndYear(items: HeroCollectionItem[]): HeroAwardGroup[] {
  const groups = new Map<string, Map<string, HeroCollectionItem[]>>();

  for (const item of items) {
    const documentedAwards = item.awards ?? [];
    const gallantryAwards = documentedAwards.filter((award: string) => GALLANTRY_AWARDS.has(award));
    const awards = gallantryAwards.length > 0
      ? gallantryAwards
      : [documentedAwards.length > 0 ? "Other decorations" : "Award not documented"];

    for (const award of awards) {
      const year = item.year?.trim() || "Year not documented";
      const years = groups.get(award) ?? new Map<string, HeroCollectionItem[]>();
      const yearItems = years.get(year) ?? [];
      yearItems.push(item);
      years.set(year, yearItems);
      groups.set(award, years);
    }
  }

  const awardOrder = [...GALLANTRY_AWARD_ORDER, ...FALLBACK_AWARD_ORDER];
  return awardOrder.flatMap((award) => {
    const years = groups.get(award);
    if (!years) return [];
    return [{
      award,
      years: [...years.entries()]
        .sort(([left], [right]) => compareYears(left, right))
        .map(([year, yearItems]) => ({
          year,
          items: yearItems.sort((left, right) => left.title.localeCompare(right.title)),
        })),
    }];
  });
}
