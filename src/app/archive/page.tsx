import Link from "next/link";
import { SiteBreadcrumbs } from "@/components/Breadcrumbs";
import { Pagination } from "@/components/Pagination";
import { listPublicSources } from "@/lib/repositories/sources";
import { prisma } from "@/lib/db";
import { publicWhere } from "@/lib/repositories/publication";

export const dynamic = "force-dynamic";

export default async function ArchivePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const raw = await searchParams;
  const result = await listPublicSources(raw, prisma);
  const [sourceTypes, publishers] = await Promise.all([
    prisma.source.findMany({ where: publicWhere(), distinct: ["sourceType"], select: { sourceType: true }, orderBy: { sourceType: "asc" } }),
    prisma.source.findMany({ where: publicWhere(), distinct: ["publisher"], select: { publisher: true }, orderBy: { publisher: "asc" } }),
  ]);
  const params = new URLSearchParams(Object.entries(raw).flatMap(([key, value]) => value ? [[key, Array.isArray(value) ? value[0] : value]] : []));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <SiteBreadcrumbs />
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Sources</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">Browse the reviewed documents behind published records. Each source keeps its version, locator, and display rights visible.</p>
      </div>

      <form method="get" className="mb-8 grid gap-3 rounded-lg border border-border/60 bg-card/40 p-4 sm:grid-cols-4">
        <label className="sm:col-span-2"><span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Search</span><input name="q" defaultValue={typeof raw.q === "string" ? raw.q : ""} placeholder="Title or topic" className="h-10 w-full rounded border border-input bg-background px-3 text-sm" /></label>
        <label><span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type</span><select name="sourceType" defaultValue={typeof raw.sourceType === "string" ? raw.sourceType : ""} className="h-10 w-full rounded border border-input bg-background px-3 text-sm"><option value="">All types</option>{sourceTypes.flatMap((row) => row.sourceType ? [<option key={row.sourceType} value={row.sourceType}>{row.sourceType}</option>] : [])}</select></label>
        <label><span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Publisher</span><select name="publisher" defaultValue={typeof raw.publisher === "string" ? raw.publisher : ""} className="h-10 w-full rounded border border-input bg-background px-3 text-sm"><option value="">All publishers</option>{publishers.flatMap((row) => row.publisher ? [<option key={row.publisher} value={row.publisher}>{row.publisher}</option>] : [])}</select></label>
        <div className="sm:col-span-4 flex items-end gap-3"><button type="submit" className="h-10 rounded bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Apply filters</button><Link href="/archive" className="text-sm text-muted-foreground hover:text-foreground">Clear</Link></div>
      </form>

      <p className="mb-4 text-sm text-muted-foreground">{result.total} reviewed sources · showing {result.items.length}</p>
      {result.items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border/60 bg-card p-8"><h2 className="text-xl font-semibold">No reviewed source documents available</h2><p className="mt-3 max-w-2xl text-muted-foreground">Source records are being reconciled before they are shown here. Try clearing the filters or return when the next reviewed collection is published.</p></div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">{result.items.map((source) => <Link key={source.id} href={source.href} className="rounded-lg border border-border/60 bg-card p-6 transition-colors hover:border-primary/60"><div className="mb-2 text-xs uppercase tracking-widest text-primary">{source.tier} · {source.sourceType}</div><h2 className="text-xl font-semibold tracking-tight">{source.title}</h2><p className="mt-2 text-sm text-muted-foreground">{source.summary}</p><div className="mt-4 text-xs text-muted-foreground">{source.publisher}{source.publicationDate ? ` · ${source.publicationDate}` : ""}</div></Link>)}</div>
      )}
      <div className="mt-8"><Pagination page={result.page} pageCount={result.pageCount} params={params} /></div>
    </div>
  );
}
