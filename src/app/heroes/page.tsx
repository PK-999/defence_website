import Image from "next/image";
import Link from "next/link";
import { CollectionToolbar } from "@/components/CollectionToolbar";
import { PageHeader, PageShell } from "@/components/PageShell";
import { formatDisplayDate } from "@/lib/domain/dates";
import { GALLANTRY_AWARD_ORDER } from "@/lib/heroes/grouping";
import { displayAwardeeName, gallantryResearch, getAwardees, getAwardeeStory } from "@/lib/heroes/gallantry-research";

export const dynamic = "force-dynamic";

function groupAwardeesByAwardAndYear(awardees: ReturnType<typeof getAwardees>) {
  const grouped = new Map<string, Map<string, ReturnType<typeof getAwardees>>>();
  for (const awardee of awardees) {
    const years = grouped.get(awardee.award) ?? new Map<string, ReturnType<typeof getAwardees>>();
    years.set(awardee.actionYear, [...(years.get(awardee.actionYear) ?? []), awardee]);
    grouped.set(awardee.award, years);
  }
  return GALLANTRY_AWARD_ORDER.flatMap((award) => {
    const years = grouped.get(award);
    if (!years) return [];
    return [{
      award,
      years: [...years.entries()].sort(([left], [right]) => right.localeCompare(left)).map(([year, items]) => ({
        year,
        items: items.slice().sort((left, right) => displayAwardeeName(left.name).localeCompare(displayAwardeeName(right.name))),
      })),
    }];
  });
}

function matches(awardee: ReturnType<typeof getAwardees>[number], query: { service?: string; medal?: string; year?: string }): boolean {
  if (query.medal && awardee.award !== query.medal) return false;
  if (query.year && awardee.actionYear !== query.year) return false;
  if (query.service && awardee.service !== query.service) return false;
  return true;
}

export default async function HeroesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const raw = await searchParams;
  const value = (key: string) => Array.isArray(raw[key]) ? raw[key]?.[0] : raw[key];
  const query = { service: value("service")?.trim() || undefined, medal: value("medal")?.trim() || undefined, year: value("year")?.trim() || undefined };
  const allAwardees = getAwardees();
  const filteredAwardees = allAwardees.filter((awardee) => matches(awardee, query));
  const visibleAwardees = GALLANTRY_AWARD_ORDER.flatMap((award) => filteredAwardees.filter((awardee) => awardee.award === award).slice(0, 24));
  const sections = groupAwardeesByAwardAndYear(visibleAwardees);
  const services = [...new Set(allAwardees.map((awardee) => awardee.service).filter((service): service is string => Boolean(service)))].sort();
  const years = [...new Set(allAwardees.map((awardee) => awardee.actionYear))].sort((left, right) => right.localeCompare(left));
  const awardLinks = GALLANTRY_AWARD_ORDER.map((award) => ({
    award,
    count: gallantryResearch.counts[award],
    href: `/heroes/awards/${award.toLowerCase().replaceAll(" ", "-")}`,
  }));

  return <PageShell>
    <PageHeader title="Heroes" description="Official gallantry awardee profiles, service histories, photos, biographies, and citations from the Ministry of Defence directory." />
    <div className="mb-8">
      <CollectionToolbar fields={[{ key: "service", label: "Service branch", options: services }, { key: "medal", label: "Gallantry award", options: [...GALLANTRY_AWARD_ORDER] }, { key: "year", label: "Action year", options: years }]} />
    </div>
    <p className="mb-6 text-sm text-muted-foreground">{allAwardees.length.toLocaleString("en-IN")} heroes · {filteredAwardees.length.toLocaleString("en-IN")} matching · showing a 24-hero preview per award · grouped by award, then year</p>

    <section className="mb-10" aria-labelledby="award-index-heading">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 id="award-index-heading" className="text-xl font-semibold">Gallantry awards</h2>
        <span className="text-sm text-muted-foreground">Browse by award</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {awardLinks.map((item) => <Link key={item.award} data-testid="hero-award-index" href={item.href} className="rounded-lg border border-border/60 bg-card p-4 transition-colors hover:border-primary/60">
          <span className="block font-semibold">{item.award}</span>
          <span className="mt-1 block text-sm text-muted-foreground">{item.count.toLocaleString("en-IN")} {item.count === 1 ? "hero" : "heroes"}</span>
        </Link>)}
      </div>
    </section>

    {sections.length > 0 ? <div className="space-y-10">
      {sections.map((section) => <section key={section.award} data-testid="hero-award-section" aria-labelledby={`award-${section.award.replaceAll(" ", "-")}`}>
        <div className="mb-4 flex items-baseline justify-between gap-3 border-b border-border pb-3">
          <h2 id={`award-${section.award.replaceAll(" ", "-")}`} className="text-2xl font-semibold">{section.award}</h2>
          <span className="text-sm text-muted-foreground">{section.years.reduce((total, year) => total + year.items.length, 0).toLocaleString("en-IN")} heroes</span>
        </div>
        <div className="space-y-6">
          {section.years.map((year) => <div key={`${section.award}-${year.year}`} data-testid="hero-award-year">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">{year.year}</h3>
            <div data-testid="hero-awardee-grid" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {year.items.map((awardee) => {
                const name = displayAwardeeName(awardee.name);
                const summary = awardee.citationDetails ?? awardee.biography ?? getAwardeeStory(awardee).body;
                return <Link key={awardee.officialId} data-testid="hero-awardee" href={`/heroes/awardees/${awardee.officialId}`} className="group overflow-hidden rounded-lg border border-border/60 bg-card transition-colors hover:border-primary/60">
                  {awardee.photoUrl ? <Image src={awardee.photoUrl} width={640} height={360} alt={`Portrait of ${name}`} className="h-44 w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]" unoptimized /> : <div className="flex h-44 items-center justify-center bg-muted text-xs uppercase tracking-[0.16em] text-muted-foreground">Photo not documented</div>}
                  <div className="p-5">
                    <p className="text-xs uppercase text-primary">{awardee.service ?? "Service not documented"} · {formatDisplayDate(awardee.actionDate)}</p>
                    <h4 className="mt-2 text-xl font-semibold">{name}</h4>
                    <p className="mt-2 text-sm text-muted-foreground">{awardee.rank ?? "Rank not documented"}{awardee.unit !== "N/A" ? ` · ${awardee.unit}` : ""}</p>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{summary}</p>
                  </div>
                </Link>;
              })}
            </div>
          </div>)}
        </div>
      </section>)}
    </div> : <p className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">No official heroes match these filters.</p>}

    <p className="mt-8 text-xs text-muted-foreground">Filters are applied to the complete official directory snapshot. Open an award above to browse every matching hero.</p>
  </PageShell>;
}
