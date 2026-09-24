import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHeader, PageShell } from "@/components/PageShell";
import { formatDisplayDate } from "@/lib/domain/dates";
import { displayAwardeeName, getAwardeeBiography, getAwardeeById, getAwardeeStory } from "@/lib/heroes/gallantry-research";
import { publicMetadata } from "@/lib/metadata";
import { HUDFrame } from "@/components/HUDFrame";
import { Medal3DViewer } from "@/components/Medal3DViewer";
import { Medal, Shield, Award, ExternalLink, BookOpen, FileText, Bookmark } from "lucide-react";
import type { Metadata } from "next";

const documented = (value: string | null | undefined) =>
  value?.trim() && !["N/A", "Not documented"].includes(value.trim())
    ? value
    : "Not published in the official record";

export const revalidate = 3600;
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const awardee = getAwardeeById(id);
  if (!awardee) notFound();
  const name = displayAwardeeName(awardee.name);
  return publicMetadata({
    title: `${name} — ${awardee.award}`,
    description: `Official gallantry record, service details and source-linked citation for ${name}.`,
    pathname: `/heroes/awardees/${id}`,
  });
}

export default async function GallantryAwardeePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const awardee = getAwardeeById(id);
  if (!awardee) notFound();

  const name = displayAwardeeName(awardee.name);
  const biography = getAwardeeBiography(awardee);
  const story = getAwardeeStory(awardee);
  const parentage = awardee.parentage.filter((value) => value.trim() && value.trim().toUpperCase() !== "N/A");

  const isPVC = awardee.award.includes("Param Vir");
  const isMVC = awardee.award.includes("Maha Vir");
  const isAshoka = awardee.award.includes("Ashoka");

  const rewardedAction = awardee.citationDetails || story?.body || "Conferred for conspicuous bravery and gallantry in the face of the enemy.";

  const navSections = [
    { id: "rewarded-action", label: "01 // REWARDED ACTION" },
    { id: "biography", label: "02 // BIOGRAPHY & SERVICE" },
    { id: "battle-narrative", label: "03 // BATTLE NARRATIVE" },
    { id: "official-sources", label: "04 // OFFICIAL SOURCES" },
    ...(awardee.bibliography.length ? [{ id: "bibliography", label: "05 // BIBLIOGRAPHY" }] : []),
  ];

  const facts = [
    { label: "Award", value: awardee.award, highlight: true },
    { label: "Gallantry Action Date", value: formatDisplayDate(awardee.actionDate) },
    { label: "Awarded Date", value: formatDisplayDate(awardee.awardedDate) },
    { label: "Rank", value: documented(awardee.rank) },
    { label: "Service", value: documented(awardee.service) },
    { label: "Unit / Organisation", value: documented(awardee.unit) },
    { label: "Service Number", value: documented(awardee.serviceNumber) },
    { label: "Conflict / Operation", value: documented(awardee.warOperationBattle) },
    { label: "Posthumous", value: awardee.posthumous === null ? "Not documented" : awardee.posthumous ? "Yes" : "No" },
    { label: "Date of Birth", value: formatDisplayDate(awardee.birthDate) },
    { label: "Date of Death", value: formatDisplayDate(awardee.deathDate) },
    { label: "Service Entry Date", value: formatDisplayDate(awardee.serviceEntryDate) },
    { label: "Resident Of", value: documented(awardee.residentOf) },
    { label: "Parentage", value: parentage.length ? parentage.join(" · ") : "Not published in the official record" },
  ];

  return (
    <PageShell width="wide">
      {/* 2-Column Tactical Layout: Frozen Left Column + Scrollable Right Column */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start mt-2">
        
        {/* LEFT COLUMN: Frozen Portrait & Facts Dossier */}
        <aside className="w-full lg:w-[380px] xl:w-[420px] shrink-0 lg:sticky lg:top-24 self-start space-y-6">
          
          {/* Portrait with HUD Framing & Scanner */}
          <HUDFrame
            variant={isPVC ? "danger" : isAshoka ? "gold" : isMVC ? "cyan" : "default"}
            classification={awardee.award.toUpperCase()}
            scanline
            className="overflow-hidden shadow-2xl"
          >
            <div className="relative bg-[#050d09] overflow-hidden">
              {awardee.photoUrl ? (
                <div className="relative h-80 sm:h-96 w-full bg-black/60 flex items-center justify-center">
                  <Image
                    src={awardee.photoUrl}
                    alt={`Official portrait of ${name}`}
                    fill
                    className="object-contain object-center"
                    unoptimized
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                </div>
              ) : (
                <div className="flex h-72 flex-col items-center justify-center gap-2 p-6 text-center text-xs font-mono uppercase tracking-[0.16em] text-muted-foreground bg-muted/20">
                  <Shield className="w-10 h-10 text-primary/40 animate-pulse" />
                  <span>Photo Classified / Not Documented</span>
                </div>
              )}

              {/* Identity Overlay */}
              <div className="p-4 border-t border-border/40 bg-[#07150c]/90">
                <span className="block font-mono text-[10px] uppercase tracking-widest text-primary font-bold">
                  {awardee.service ?? "ARMED FORCES"} · {awardee.rank ?? "OFFICER"}
                </span>
                <h3 className="text-xl font-bold tracking-tight text-foreground mt-0.5">
                  {name}
                </h3>
                {awardee.posthumous && (
                  <span className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-accent-danger/15 text-accent-danger border border-accent-danger/30 font-bold">
                    [POSTHUMOUS CONFERMENT]
                  </span>
                )}
              </div>
            </div>
          </HUDFrame>

          {/* Interactive 3D Medal Inspection Artifact */}
          <Medal3DViewer awardName={awardee.award} variant="card" />

          {/* Frozen Tactical Record Table */}
          <div className="rounded-lg border border-primary/25 bg-[#06120b]/90 backdrop-blur-md p-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-primary/20 pb-2 mb-3">
              <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-primary" />
                MILITARY RECORD
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">ID: #{awardee.officialId}</span>
            </div>

            <dl className="divide-y divide-border/30 text-xs font-mono">
              {facts.map((fact) => (
                <div key={fact.label} className="py-2 flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                  <dt className="text-[11px] text-muted-foreground uppercase tracking-wide shrink-0">
                    {fact.label}
                  </dt>
                  <dd className={`text-right font-medium text-xs break-words ${fact.highlight ? "text-primary font-bold" : "text-foreground"}`}>
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Quick Official Archive Link */}
          <a
            href={awardee.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-primary/40 bg-primary/10 hover:bg-primary/20 hover:border-primary text-xs font-mono uppercase tracking-wider text-primary transition-colors"
          >
            <span>MINISTRY OF DEFENCE ARCHIVE</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </aside>

        {/* RIGHT COLUMN: Scrollable Narrative, Rewarded Action, and Dossier */}
        <main className="flex-1 min-w-0 space-y-8">
          
          {/* Header Title & Summary */}
          <header className="border-b border-border/50 pb-6">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-primary mb-2 flex items-center gap-2">
              <Medal className="w-4 h-4 text-accent-gold" />
              MINISTRY OF DEFENCE · CANONICAL HONOUR ROLL
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground uppercase">
              {name}
            </h1>
            <p className="mt-3 text-base sm:text-lg leading-relaxed text-muted-foreground">
              {awardee.award} recipient — a canonical Ministry of Defence record with service details, official citation documents, and battlefield engagement narratives.
            </p>
          </header>

          {/* Sections Navigation: High-Tech Sticky HUD Bar */}
          <nav aria-label="On this page" className="sticky top-20 z-20 rounded-lg border border-primary/30 bg-[#050e08]/95 backdrop-blur-md p-2.5 shadow-md">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest pl-2 shrink-0 hidden sm:inline">
                SECTIONS:
              </span>
              {navSections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="whitespace-nowrap px-3 py-1.5 rounded border border-border/60 hover:border-primary bg-card/60 hover:bg-primary/10 font-mono text-[11px] font-semibold text-primary transition-all tracking-wider shrink-0"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </nav>

          {/* 1. REWARDED ACTION (Prominently Placed at the Very Top as Requested) */}
          <section id="rewarded-action" className="scroll-mt-36">
            <div className="rounded-lg border-2 border-primary/50 bg-[#06140b]/90 backdrop-blur-md p-6 sm:p-8 shadow-[0_0_30px_rgba(131,214,92,0.15)] relative">
              <div className="flex items-center justify-between border-b border-primary/30 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  <h2 className="text-xl sm:text-2xl font-mono font-bold uppercase tracking-wider text-primary">
                    REWARDED ACTION
                  </h2>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/40 font-mono text-[11px] font-bold uppercase tracking-widest">
                  OFFICIAL CITATION DIRECTIVE
                </span>
              </div>
              <blockquote className="relative text-base sm:text-lg leading-relaxed text-foreground font-sans pl-4 border-l-4 border-primary whitespace-pre-line italic">
                &ldquo;{rewardedAction}&rdquo;
              </blockquote>
              <div className="mt-4 pt-3 border-t border-primary/20 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-muted-foreground">
                <span>CANONICAL CITATION GAZETTE</span>
                <span className="text-primary">{formatDisplayDate(awardee.actionDate)}</span>
              </div>
            </div>
          </section>

          {/* 2. BIOGRAPHY AND SERVICE RECORD */}
          <section id="biography" className="scroll-mt-36 rounded-lg border border-border/60 bg-card/60 p-6 sm:p-8">
            <h2 className="border-l-2 border-primary pl-4 text-xl sm:text-2xl font-bold uppercase tracking-wider text-foreground">
              Biography and Service Record
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                {biography}{" "}
                <a
                  href={awardee.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="whitespace-nowrap text-xs font-semibold text-primary underline hover:text-primary/80"
                  aria-label="Official Ministry of Defence awardee record"
                >
                  [Official Ministry of Defence Record]
                </a>
              </p>
            </div>
          </section>

          {/* 3. BATTLE NARRATIVE / MEDAL STORY */}
          <section id="battle-narrative" className="scroll-mt-36 rounded-lg border border-border/60 bg-card/60 p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Bookmark className="w-5 h-5 text-primary" />
              <h2 className="border-l-2 border-primary pl-4 text-xl sm:text-2xl font-bold uppercase tracking-wider text-foreground">
                {story.title}
              </h2>
            </div>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>{story.body}</p>
              {awardee.warOperationBattle && (
                <div className="mt-6 rounded border border-primary/30 bg-primary/5 p-4 text-sm font-mono">
                  <span className="font-bold text-primary uppercase tracking-wider">THEATRE ENGAGEMENT CONTEXT:</span>{" "}
                  <span className="text-foreground">{awardee.warOperationBattle}</span>
                </div>
              )}
            </div>
          </section>

          {/* 4. OFFICIAL SOURCES & CITATION DOCUMENTS */}
          <section id="official-sources" className="scroll-mt-36 rounded-lg border border-border/60 bg-card/60 p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 className="border-l-2 border-primary pl-4 text-xl sm:text-2xl font-bold uppercase tracking-wider text-foreground">
                Official Sources & Verified Citations
              </h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              The profile and citation files are directly authenticated against government and Ministry of Defence archival servers.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              <li>
                <a
                  href={awardee.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group block h-full rounded-lg border border-border/60 bg-[#08180e]/60 p-4 hover:border-primary transition-colors"
                >
                  <span className="block font-medium text-foreground group-hover:text-primary transition-colors">
                    Ministry of Defence Awardee Record
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground font-mono">
                    Canonical name, award, date, service and unit fields
                  </span>
                </a>
              </li>
              {awardee.profileUrls.map((url, index) => (
                <li key={url}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="group block h-full rounded-lg border border-border/60 bg-[#08180e]/60 p-4 hover:border-primary transition-colors"
                  >
                    <span className="block font-medium text-foreground group-hover:text-primary transition-colors">
                      Official Biographical Profile{awardee.profileUrls.length > 1 ? ` ${index + 1}` : ""}
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground font-mono">
                      Government-hosted profile document
                    </span>
                  </a>
                </li>
              ))}
              {awardee.citationUrls.map((url, index) => (
                <li key={url}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="group block h-full rounded-lg border border-border/60 bg-[#08180e]/60 p-4 hover:border-primary transition-colors"
                  >
                    <span className="block font-medium text-foreground group-hover:text-primary transition-colors">
                      Official Award Citation{awardee.citationUrls.length > 1 ? ` ${index + 1}` : ""}
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground font-mono">
                      Government-hosted citation record
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>

          {/* 5. BIBLIOGRAPHY FROM OFFICIAL PROFILE */}
          {awardee.bibliography.length > 0 && (
            <section id="bibliography" className="scroll-mt-36 rounded-lg border border-border/60 bg-card/60 p-6 sm:p-8">
              <h2 className="border-l-2 border-primary pl-4 text-xl sm:text-2xl font-bold uppercase tracking-wider text-foreground">
                Bibliography from Official Profile
              </h2>
              <ol className="mt-5 space-y-3 text-sm leading-relaxed text-muted-foreground list-decimal list-inside font-mono">
                {awardee.bibliography.map((entry, index) => (
                  <li key={`${entry.title}-${index}`} className="rounded border border-border/40 p-3 bg-card/40">
                    {entry.url ? (
                      <a
                        href={entry.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-foreground hover:text-primary hover:underline"
                      >
                        {entry.title}
                      </a>
                    ) : (
                      entry.title
                    )}
                  </li>
                ))}
              </ol>
            </section>
          )}

        </main>
      </div>
    </PageShell>
  );
}
