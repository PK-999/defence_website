import Image from "next/image";
import Link from "next/link";
import { CollectionToolbar } from "@/components/CollectionToolbar";
import { PageHeader, PageShell } from "@/components/PageShell";
import { formatDisplayDate } from "@/lib/domain/dates";
import { GALLANTRY_AWARD_ORDER } from "@/lib/heroes/grouping";
import { displayAwardeeName, gallantryResearch, getAwardees, getAwardeeStory } from "@/lib/heroes/gallantry-research";
import { HUDFrame } from "@/components/HUDFrame";
import { ScrambleText } from "@/components/ScrambleText";
import { Medal, Shield, Award, RotateCw } from "lucide-react";
import { Medal3DViewer } from "@/components/Medal3DViewer";

export const revalidate = 3600;

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

  return (
    <PageShell width="wide">
      <PageHeader
        eyebrow="MINISTRY OF DEFENCE · HONOUR ROLL"
        title="Gallantry Heroes"
        description="Official gallantry awardee dossiers, battlefield action narratives, citation documents, and service histories."
      />

      <div className="mb-8">
        <CollectionToolbar
          fields={[
            { key: "service", label: "Service branch", options: services },
            { key: "medal", label: "Gallantry award", options: [...GALLANTRY_AWARD_ORDER] },
            { key: "year", label: "Action year", options: years },
          ]}
        />
      </div>

      <div className="mb-6 flex items-center justify-between text-xs font-mono text-muted-foreground border-b border-primary/20 pb-2">
        <span>
          ARCHIVE INDEX: {allAwardees.length.toLocaleString("en-IN")} HEROES RECORDED
        </span>
        <span className="text-primary">
          {filteredAwardees.length.toLocaleString("en-IN")} MATCHING DIRECTIVES
        </span>
      </div>

      {/* GALLANTRY MEDAL TIERS */}
      <section className="mb-14" aria-labelledby="award-index-heading">
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <h2 id="award-index-heading" className="text-lg font-mono font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
            <Medal className="w-4 h-4 text-accent-gold" />
            Gallantry Decorations
          </h2>
          <span className="text-xs font-mono text-muted-foreground">Select award category</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {awardLinks.map((item) => {
            const isPVC = item.award.includes("Param Vir");
            const isAshoka = item.award.includes("Ashoka");
            const isMVC = item.award.includes("Maha Vir");
            const classification = isPVC
              ? "HIGHEST VALOUR · WARTIME"
              : isAshoka
              ? "HIGHEST VALOUR · PEACETIME"
              : isMVC
              ? "DISTINGUISHED VALOUR"
              : "GALLANTRY DECORATION";

            return (
              <div key={item.award} className="group relative">
                <HUDFrame
                  variant={isPVC ? "danger" : isAshoka ? "gold" : isMVC ? "cyan" : "default"}
                  classification={classification}
                >
                  <div className="p-3.5 flex items-center gap-3.5">
                    {/* Interactive 3D Medal Flip Thumbnail */}
                    <div className="shrink-0">
                      <Medal3DViewer
                        awardName={item.award}
                        variant="disc"
                        className="w-12 h-12"
                      />
                    </div>

                    <Link
                      data-testid="hero-award-index"
                      href={item.href}
                      className="min-w-0 flex-1 block"
                    >
                      <span className="block font-bold tracking-wide text-foreground group-hover:text-primary transition-colors text-sm sm:text-base leading-tight">
                        {item.award}
                      </span>
                      <span className="mt-1 flex items-center justify-between text-xs font-mono text-muted-foreground">
                        <span>
                          {item.count.toLocaleString("en-IN")} {item.count === 1 ? "Citation" : "Citations"}
                        </span>
                        <span className="text-primary text-[10px] uppercase font-bold group-hover:underline">
                          VIEW ARCHIVE &rarr;
                        </span>
                      </span>
                    </Link>
                  </div>
                </HUDFrame>
              </div>
            );
          })}
        </div>
      </section>

      {/* HEROES BY AWARD & YEAR */}
      {sections.length > 0 ? (
        <div className="space-y-16">
          {sections.map((section) => {
            const isPVC = section.award.includes("Param Vir");
            return (
              <section
                key={section.award}
                data-testid="hero-award-section"
                aria-labelledby={`award-${section.award.replaceAll(" ", "-")}`}
              >
                <div className="mb-6 flex items-baseline justify-between gap-3 border-b-2 border-primary/40 pb-3">
                  <h2
                    id={`award-${section.award.replaceAll(" ", "-")}`}
                    className="text-2xl font-display font-bold uppercase tracking-wide text-foreground"
                  >
                    {section.award}
                  </h2>
                  <span className="font-mono text-xs text-primary font-semibold">
                    {section.years.reduce((total, year) => total + year.items.length, 0).toLocaleString("en-IN")} DOSSIERS
                  </span>
                </div>

                <div className="space-y-10">
                  {section.years.map((year) => (
                    <div key={`${section.award}-${year.year}`} data-testid="hero-award-year">
                      <div className="mb-4 inline-flex items-center gap-2 px-2.5 py-1 rounded bg-muted border border-border/80 text-xs font-mono text-primary font-bold">
                        <span>YEAR: {year.year}</span>
                      </div>

                      <div data-testid="hero-awardee-grid" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {year.items.map((awardee) => {
                          const name = displayAwardeeName(awardee.name);
                          const summary = awardee.citationDetails ?? awardee.biography ?? getAwardeeStory(awardee).body;
                          return (
                            <Link
                              key={awardee.officialId}
                              data-testid="hero-awardee"
                              href={`/heroes/awardees/${awardee.officialId}`}
                              className="group block"
                            >
                              <HUDFrame
                                variant={isPVC ? "danger" : "default"}
                                label={awardee.service ?? "ARMED FORCES"}
                                scanline
                                className="h-full"
                              >
                                <div className="overflow-hidden bg-background/60">
                                  {awardee.photoUrl ? (
                                    <Image
                                      src={awardee.photoUrl}
                                      width={640}
                                      height={360}
                                      alt={`Portrait of ${name}`}
                                      className="h-44 w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                      unoptimized
                                    />
                                  ) : (
                                    <div className="flex h-44 items-center justify-center bg-muted/40 text-xs font-mono uppercase tracking-[0.16em] text-muted-foreground">
                                      Photo Classified / Unavailable
                                    </div>
                                  )}
                                </div>
                                <div className="p-5">
                                  <p className="font-mono text-[11px] uppercase text-primary font-semibold">
                                    {formatDisplayDate(awardee.actionDate)}
                                  </p>
                                  <h4 className="mt-1.5 text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                    {name}
                                  </h4>
                                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                                    {awardee.rank ?? "Rank unrecorded"}
                                    {awardee.unit !== "N/A" ? ` · ${awardee.unit}` : ""}
                                  </p>
                                  <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                                    {summary}
                                  </p>
                                  <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-mono text-primary">
                                    <span>OPEN OFFICIAL DOSSIER</span>
                                    <span>→</span>
                                  </div>
                                </div>
                              </HUDFrame>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <p className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          No official heroes match these filters.
        </p>
      )}

      <p className="mt-12 text-xs font-mono text-muted-foreground border-t border-border/40 pt-4">
        Archive grounds exclusively in official Ministry of Defence records (gallantryawards.gov.in).
      </p>
    </PageShell>
  );
}
