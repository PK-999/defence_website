import { SiteBreadcrumbs } from "@/components/Breadcrumbs";
import { CompareTray } from "@/components/CompareTray";
import { ComparisonTable } from "@/components/ComparisonTable";
import { buildComparisonHref, getPublicComparison, normalizeComparisonSlugs } from "@/lib/domain/compare";

export const dynamic = "force-dynamic";

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ items?: string | string[]; systems?: string | string[] }> }) {
  const raw = await searchParams;
  const encodedItems = Array.isArray(raw.items) ? raw.items[0] : raw.items;
  const encodedLegacySystems = Array.isArray(raw.systems) ? raw.systems[0] : raw.systems;
  const encoded = encodedItems ?? encodedLegacySystems;
  const requested = encoded ? encoded.split(",").map((slug) => decodeURIComponent(slug)) : [];
  const normalized = normalizeComparisonSlugs(requested);
  const result = await getPublicComparison(normalized);
  const options = result.systems.map((system) => ({ slug: system.slug, title: system.title }));
  return <div className="mx-auto max-w-6xl px-4 py-10"><SiteBreadcrumbs /><div className="mb-10"><h1 className="text-4xl font-bold tracking-tight text-primary">Compare systems</h1><p className="mt-3 max-w-2xl text-muted-foreground">Compare documented fields and compatible units side by side. The archive does not calculate an overall winner.</p></div>{requested.length > 3 && <p className="mb-5 rounded border border-dashed border-primary/50 p-4 text-sm text-muted-foreground">Only the first three unique systems are compared. <a href={buildComparisonHref(normalized)} className="text-primary underline">Use the capped comparison URL</a>.</p>}{result.missing.length > 0 && <p className="mb-5 rounded border border-dashed border-border p-4 text-sm text-muted-foreground">Unavailable or private systems: {result.missing.join(", ")}</p>}<CompareTray options={options} initialSlugs={result.systems.map((system) => system.slug)} /><div className="mt-8"><ComparisonTable result={result} /></div></div>;
}
