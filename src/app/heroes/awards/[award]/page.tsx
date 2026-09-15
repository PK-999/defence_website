import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader, PageShell } from "@/components/PageShell";
import { Pagination } from "@/components/Pagination";
import { formatDisplayDate } from "@/lib/domain/dates";
import { parseCollectionQuery } from "@/lib/domain/query";
import { displayAwardeeName, gallantryResearch, getAwardBySlug, groupAwardeesByYear } from "@/lib/heroes/gallantry-research";
import { publicMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export function generateStaticParams() {
  return gallantryResearch.awardees.length > 0 ? [
    { award: "param-vir-chakra" },
    { award: "maha-vir-chakra" },
    { award: "vir-chakra" },
    { award: "ashoka-chakra" },
    { award: "kirti-chakra" },
    { award: "shaurya-chakra" },
  ] : [];
}

export async function generateMetadata({ params }: { params: Promise<{ award: string }> }): Promise<Metadata> {
  const { award: slug } = await params;
  const award = getAwardBySlug(slug);
  if (!award) notFound();
  return publicMetadata({ title: `${award} awardees`, description: `Officially listed ${award} recipients, grouped by the Ministry of Defence award/action record year.`, pathname: `/heroes/awards/${slug}` });
}

export default async function ResearchedAwardPage({ params, searchParams }: { params: Promise<{ award: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { award: slug } = await params;
  const award = getAwardBySlug(slug);
  if (!award) notFound();
  const query = parseCollectionQuery(await searchParams);
  const allAwardees = groupAwardeesByYear(award).flatMap((group) => group.awardees);
  // Award directories use a larger, bounded page so the complete smaller
  // cohorts (including all 98 Ashoka Chakra recipients) are visible together,
  // while the larger cohorts remain paginated for a responsive reader.
  const pageSize = 100;
  const pageStart = (query.page - 1) * pageSize;
  const pageAwardees = allAwardees.slice(pageStart, pageStart + pageSize);
  const pageIds = new Set(pageAwardees.map((awardee) => awardee.officialId));
  const groups = groupAwardeesByYear(award).map((group) => ({ ...group, awardees: group.awardees.filter((awardee) => pageIds.has(awardee.officialId)) })).filter((group) => group.awardees.length > 0);
  const count = gallantryResearch.counts[award];
  const pageCount = Math.max(1, Math.ceil(allAwardees.length / pageSize));
  const paginationParams = new URLSearchParams();
  paginationParams.set("size", String(pageSize));

  return <PageShell>
    <PageHeader eyebrow="OFFICIAL GALLANTRY DIRECTORY" title={award} description={`${count.toLocaleString("en-IN")} ${count === 1 ? "hero" : "heroes"} from the Ministry of Defence Gallantry Awards portal, grouped by action year.`} />
    <div className="mb-8 rounded-lg border border-border/60 bg-card/60 p-5 text-sm leading-6 text-muted-foreground">
      <p>Dates are shown as the portal’s documented gallantry action date where published. Awarded date, service entry date, biography, and citation details are shown on each hero’s source-linked dossier when available.</p>
      <a className="mt-3 inline-flex font-mono text-xs uppercase tracking-[0.16em] text-primary hover:underline" href={gallantryResearch.source.url} target="_blank" rel="noreferrer">Source: {gallantryResearch.source.publisher}</a>
    </div>
    <div className="space-y-10">
      {groups.map((group) => <section key={group.year} data-testid="researched-award-year" aria-labelledby={`award-year-${group.year}`}>
        <div className="mb-4 flex items-baseline justify-between border-b border-border/60 pb-3">
          <h2 id={`award-year-${group.year}`} className="text-2xl font-semibold">{group.year}</h2>
          <span className="text-sm text-muted-foreground">{group.awardees.length} {group.awardees.length === 1 ? "recipient" : "recipients"}</span>
        </div>
        <div data-testid="researched-awardee-grid" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {group.awardees.map((awardee) => <Link key={awardee.officialId} data-testid="researched-awardee" href={`/heroes/awardees/${awardee.officialId}`} className="rounded-lg border border-border/60 bg-card p-5 transition-colors hover:border-primary/60">
            {awardee.photoUrl ? <Image src={awardee.photoUrl} width={640} height={360} alt={`Portrait of ${displayAwardeeName(awardee.name)}`} className="mb-4 h-40 w-full rounded object-cover object-top" unoptimized /> : <div className="mb-4 flex h-40 items-center justify-center rounded bg-muted text-xs uppercase tracking-[0.16em] text-muted-foreground">Photo not documented</div>}
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-primary">{awardee.service ?? "Service not documented"} · {formatDisplayDate(awardee.actionDate)}</p>
            <h3 className="mt-2 text-xl font-semibold">{displayAwardeeName(awardee.name)}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{awardee.rank || "Rank not listed"}{awardee.unit !== "N/A" ? ` · ${awardee.unit}` : ""}</p>
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{awardee.citationDetails ?? awardee.biography ?? "Citation details not documented"}</p>
          </Link>)}
        </div>
      </section>)}
    </div>
    <div className="mt-8"><Pagination page={query.page} pageCount={pageCount} params={paginationParams} /></div>
  </PageShell>;
}
