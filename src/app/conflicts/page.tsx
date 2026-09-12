import Link from "next/link";
import { PageHeader, PageShell } from "@/components/PageShell";
import { Pagination } from "@/components/Pagination";
import { parseCollectionQuery } from "@/lib/domain/query";
import { listPublicEntities } from "@/lib/repositories/collections";
import { prisma } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function ConflictsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) { const raw = await searchParams; const result = await listPublicEntities("Conflict", parseCollectionQuery(raw), prisma); const params = new URLSearchParams(Object.entries(raw).flatMap(([key, value]) => value ? [[key, Array.isArray(value) ? value[0] : value]] : [])); return <PageShell><PageHeader title="Conflicts" description="Reviewed conflicts with sourced dates and context." /><p className="mb-4 text-sm text-muted-foreground">{result.total} reviewed records</p><div className="space-y-3">{result.items.map((conflict) => <Link key={conflict.id} href={conflict.href} className="block rounded-lg border border-border/60 bg-card p-5 transition-colors hover:border-primary/60"><h2 className="text-xl font-semibold">{conflict.title}</h2><p className="mt-2 text-sm text-muted-foreground">{conflict.summary}</p></Link>)}</div>{result.items.length === 0 && <p className="mt-6 rounded-lg border border-dashed p-8 text-center text-muted-foreground">No reviewed conflicts are available.</p>}<div className="mt-8"><Pagination page={result.page} pageCount={result.pageCount} params={params} /></div></PageShell>; }
