import Link from "next/link";
import { SiteBreadcrumbs } from "@/components/Breadcrumbs";
import { CollectionToolbar } from "@/components/CollectionToolbar";
import { Pagination } from "@/components/Pagination";
import { parseCollectionQuery } from "@/lib/domain/query";
import { listPublicEntities } from "@/lib/repositories/collections";
import { prisma } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function PeoplePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const raw = await searchParams; const query = parseCollectionQuery(raw); const result = await listPublicEntities("Person", query, prisma);
  const [services, years] = await Promise.all([prisma.person.findMany({ where: { publicationStatus: "PUBLISHED", contentKind: "EDITORIAL", reviewedAt: { not: null }, reviewedBy: { not: null } }, distinct: ["serviceBranch"], select: { serviceBranch: true }, orderBy: { serviceBranch: "asc" } }), prisma.person.findMany({ where: { publicationStatus: "PUBLISHED", contentKind: "EDITORIAL", reviewedAt: { not: null }, reviewedBy: { not: null } }, distinct: ["year"], select: { year: true }, orderBy: { year: "asc" } })]);
  const params = new URLSearchParams(Object.entries(raw).flatMap(([key, value]) => value ? [[key, Array.isArray(value) ? value[0] : value]] : []));
  return <div className="mx-auto max-w-6xl px-4 py-10"><SiteBreadcrumbs /><h1 className="text-4xl font-bold">People</h1><p className="mt-2 text-muted-foreground">Reviewed biographies, service histories, and citations.</p><div className="my-8"><CollectionToolbar fields={[{ key: "service", label: "Service branch", options: services.flatMap((row) => row.serviceBranch ? [row.serviceBranch] : []) }, { key: "year", label: "Year", options: years.flatMap((row) => row.year ? [row.year] : []) }]} /></div><p className="mb-4 text-sm text-muted-foreground">{result.total} reviewed records · showing {result.items.length}</p><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{result.items.map((person) => <Link key={person.id} href={person.href} className="rounded border border-border bg-card p-5 hover:border-primary"><p className="text-xs uppercase text-primary">{person.facts[0]?.value}</p><h2 className="mt-2 text-xl font-semibold">{person.title}</h2><p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{person.summary}</p></Link>)}</div>{result.items.length === 0 && <p className="rounded border border-dashed p-8 text-center text-muted-foreground">No reviewed people match these filters.</p>}<div className="mt-8"><Pagination page={result.page} pageCount={result.pageCount} params={params} /></div></div>;
}
