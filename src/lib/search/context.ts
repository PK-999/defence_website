import type { EntityType } from "@/lib/domain/entities";

export const searchScopes = ["conflicts", "operations", "heroes", "arsenal", "forces", "sources", "intel"] as const;
export type SearchScope = (typeof searchScopes)[number];

const scopeConfig: Record<SearchScope, { primary: EntityType[]; related: EntityType[] }> = {
  conflicts: { primary: ["Conflict"], related: ["Operation"] },
  operations: { primary: ["Operation"], related: ["Conflict"] },
  heroes: { primary: ["Person"], related: ["Unit"] },
  arsenal: { primary: ["Equipment"], related: ["Unit"] },
  forces: { primary: ["Unit"], related: ["Operation", "Equipment"] },
  sources: { primary: ["Source"], related: [] },
  intel: { primary: [], related: [] },
};

export function isSearchScope(value: unknown): value is SearchScope {
  return typeof value === "string" && (searchScopes as readonly string[]).includes(value);
}

export function searchScopeForPathname(pathname: string): SearchScope | undefined {
  const match = searchScopes.find((scope) => pathname === `/${scope}` || pathname.startsWith(`/${scope}/`));
  return match;
}

export function searchScopeBoost(type: EntityType, scope: SearchScope | undefined): number {
  if (!scope) return 0;
  const config = scopeConfig[scope];
  if (config.primary.includes(type)) return 60;
  if (config.related.includes(type)) return 24;
  return 0;
}

export function searchScopeLabel(scope: SearchScope | undefined): string | undefined {
  if (!scope) return undefined;
  return scope === "intel" ? "Intel Ledger" : scope[0].toUpperCase() + scope.slice(1);
}
