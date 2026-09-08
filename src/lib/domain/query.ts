import type { CollectionQuery } from "./types";

const positive = (value: string | null | undefined, fallback: number) => { const parsed = Number(value); return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback; };

export function parseCollectionQuery(input: URLSearchParams | Record<string, string | string[] | undefined>): CollectionQuery {
  const get = (key: string) => input instanceof URLSearchParams ? input.get(key) ?? undefined : Array.isArray(input[key]) ? input[key]?.[0] : input[key];
  const pageSize = Math.min(24, positive(get("pageSize") ?? get("size"), 24));
  const page = positive(get("page"), 1);
  const sort = get("sort") === "date" ? "date" : "title";
  return { page, pageSize, sort, q: get("q")?.trim() || undefined, service: get("service")?.trim() || undefined, medal: get("medal")?.trim() || undefined, conflict: get("conflict")?.trim() || undefined, year: get("year")?.trim() || undefined, domain: (get("domain") ?? get("force"))?.trim() || undefined, category: (get("category") ?? get("use"))?.trim() || undefined, status: get("status")?.trim() || undefined };
}
