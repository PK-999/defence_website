import Link from "next/link";
import { ArrowRight, BookOpen, Crosshair, Radar, Shield, Compass, Activity, Terminal, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { HUDFrame } from "@/components/HUDFrame";
import { ScrambleText } from "@/components/ScrambleText";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { ParticleField } from "@/components/ParticleField";

export const revalidate = 3600;

export default async function Home() {
  const [peopleCount, opsCount, equipmentCount, unitsCount, conflicts] = await Promise.all([
    prisma.person.count(),
    prisma.operation.count(),
    prisma.equipment.count(),
    prisma.unit.count(),
    prisma.conflict.findMany({
      orderBy: { dateStart: "desc" },
      take: 4,
      select: { slug: true, title: true, summary: true, dateStart: true, theatres: true },
    }),
  ]);

  const dossiers = [
    {
      title: "THEATRE CONFLICTS",
      tagline: "7 Major Wars & Conflicts",
      description: "Declassified strategic timelines, boundary skirmishes, high-altitude engagements, and multi-service joint operations.",
      href: "/conflicts",
      icon: Shield,
      classification: "TOP SECRET",
      variant: "danger" as const,
      coords: "34.1526° N, 77.5771° E",
    },
    {
      title: "GALLANTRY HEROES",
      tagline: `${peopleCount.toLocaleString()}+ Decorated Personnel`,
      description: "Official citations, medal records, battlefield action narratives, and biographical dossiers of Param Vir Chakra and gallantry awardees.",
      href: "/heroes",
      icon: Crosshair,
      classification: "HONOUR ROLL",
      variant: "gold" as const,
      coords: "28.6143° N, 77.1994° E",
    },
    {
      title: "ARSENAL & PLATFORMS",
      tagline: `${equipmentCount.toLocaleString()}+ Military Systems`,
      description: "Technical specifications, indigenous development histories, avionics, armor, naval vessels, and missile inventories.",
      href: "/arsenal",
      icon: BookOpen,
      classification: "TECHNICAL SPEC",
      variant: "default" as const,
      coords: "12.9716° N, 77.5946° E",
    },
    {
      title: "COMMANDS & REGIMENTS",
      tagline: `${unitsCount} Battle-Tested Units`,
      description: "Integrated command structures, regional HQs, regimental mottos, war cries, battle honours, and unit genealogies.",
      href: "/forces",
      icon: Compass,
      classification: "ORDER OF BATTLE",
      variant: "cyan" as const,
      coords: "18.5204° N, 73.8567° E",
    },
  ];

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      {/* ========================================================
          HERO SECTION: FUTURISTIC SPY COMMAND CONSOLE
          ======================================================== */}
      <section className="relative min-h-[85vh] flex flex-col justify-center items-center px-4 py-16 sm:py-24 border-b border-primary/20 bg-gradient-to-b from-[#030906] via-[#050f0a] to-[#040a07]">
        {/* Ambient Particle Constellation */}
        <ParticleField />

        {/* Ambient Radial Spotlight */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(131,214,92,0.12),transparent_100%)] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-5xl text-center flex flex-col items-center">
          {/* Telemetry Header Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-card/80 backdrop-blur-md mb-8 text-xs font-mono text-primary shadow-[0_0_15px_rgba(131,214,92,0.2)]">
            <Activity className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span className="font-bold tracking-widest uppercase">SENTINEL DEFENCE CODEX · v5.1</span>
            <span className="text-muted-foreground">|</span>
            <span className="text-muted-foreground hidden sm:inline">LOC: 28°36&apos;50&quot;N 77°12&apos;18&quot;E</span>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
          </div>

          {/* Main Scramble Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight uppercase text-foreground">
            <span className="block text-primary glow-text-primary">
              <ScrambleText text="INDIA'S DEFENCE ARCHIVE" speed={35} />
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-3xl text-base sm:text-xl text-muted-foreground leading-relaxed font-sans">
            A single-source archival intelligence network documenting seven decades of military operations, legendary citations, indigenous weaponry, and military commands.
          </p>

          {/* Quick Action Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/search"
              className="relative group inline-flex items-center gap-2 px-6 py-3.5 rounded-md bg-primary text-primary-foreground font-mono font-bold text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(131,214,92,0.35)] hover:bg-primary/90 hover:shadow-[0_0_35px_rgba(131,214,92,0.6)] transition-all"
            >
              <Radar className="w-4 h-4" />
              <span>LAUNCH ARCHIVE SEARCH</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/conflicts"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md border border-primary/40 bg-card/60 backdrop-blur-md text-foreground font-mono text-sm tracking-wider uppercase hover:border-primary hover:bg-primary/10 transition-all"
            >
              <Terminal className="w-4 h-4 text-primary" />
              <span>EXPLORE CONFLICT DOSSIERS</span>
            </Link>
          </div>

          {/* Bottom Security Clearance Readout */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-xs font-mono text-muted-foreground border-t border-primary/20 pt-6">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary inline-block" />
              OPEN-SOURCE INTEL
            </span>
            <span className="text-border">/</span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-accent-gold inline-block" />
              GAZETTE-GROUNDED
            </span>
            <span className="text-border">/</span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-accent-cyan inline-block" />
              TRI-SERVICE REPOSITORY
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================
          TELEMETRY STATS BAR (ODOMETER ANIMATED COUNTERS)
          ======================================================== */}
      <section className="relative z-10 -mt-8 mx-auto max-w-6xl px-4 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <HUDFrame variant="gold" label="PERSONNEL">
            <div className="p-4 sm:p-5">
              <p className="text-2xl sm:text-4xl font-extrabold text-accent-gold glow-text-gold">
                <AnimatedCounter value={peopleCount} suffix="+" />
              </p>
              <p className="mt-1 text-xs font-mono text-muted-foreground uppercase tracking-wider">
                Hero Profiles & Citations
              </p>
            </div>
          </HUDFrame>

          <HUDFrame variant="danger" label="THEATRES">
            <div className="p-4 sm:p-5">
              <p className="text-2xl sm:text-4xl font-extrabold text-accent-danger glow-text-danger">
                <AnimatedCounter value={opsCount} />
              </p>
              <p className="mt-1 text-xs font-mono text-muted-foreground uppercase tracking-wider">
                Field Operations
              </p>
            </div>
          </HUDFrame>

          <HUDFrame variant="default" label="ARSENAL">
            <div className="p-4 sm:p-5">
              <p className="text-2xl sm:text-4xl font-extrabold text-primary glow-text-primary">
                <AnimatedCounter value={equipmentCount} suffix="+" />
              </p>
              <p className="mt-1 text-xs font-mono text-muted-foreground uppercase tracking-wider">
                Defense Platforms
              </p>
            </div>
          </HUDFrame>

          <HUDFrame variant="cyan" label="ORDER OF BATTLE">
            <div className="p-4 sm:p-5">
              <p className="text-2xl sm:text-4xl font-extrabold text-accent-cyan glow-text-cyan">
                <AnimatedCounter value={unitsCount} />
              </p>
              <p className="mt-1 text-xs font-mono text-muted-foreground uppercase tracking-wider">
                Regiments & Commands
              </p>
            </div>
          </HUDFrame>
        </div>
      </section>

      {/* ========================================================
          CLASSIFIED MISSION DOSSIERS (MAIN SECTION)
          ======================================================== */}
      <section className="mx-auto max-w-6xl px-4 py-20 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-primary/20 pb-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-primary text-xs font-mono tracking-widest uppercase">
              <Terminal className="w-3.5 h-3.5 text-primary" />
              <span>TACTICAL DIRECTIVES</span>
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-display font-bold uppercase tracking-tight text-foreground">
              ARCHIVAL REPOSITORIES
            </h2>
          </div>
          <Link
            href="/intel"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-primary hover:underline uppercase tracking-wider"
          >
            <span>OPEN INTEL LEDGER</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {dossiers.map((dossier) => {
            const Icon = dossier.icon;
            return (
              <Link key={dossier.title} href={dossier.href} className="block group">
                <HUDFrame
                  variant={dossier.variant}
                  label={dossier.coords}
                  classification={dossier.classification}
                  scanline
                  className="h-full hover:-translate-y-1 transition-transform"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-10 rounded-md bg-card/80 border border-primary/30 flex items-center justify-center group-hover:border-primary group-hover:shadow-[0_0_12px_rgba(131,214,92,0.3)] transition-all">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-mono text-xs text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                        ACCESS DOSSIER <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>

                    <h3 className="mt-5 text-xl font-display font-bold tracking-wide uppercase text-foreground group-hover:text-primary transition-colors">
                      {dossier.title}
                    </h3>

                    <p className="mt-1 font-mono text-xs text-primary font-semibold">
                      {dossier.tagline}
                    </p>

                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {dossier.description}
                    </p>
                  </div>
                </HUDFrame>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          RECENT CONFLICTS THEATRE BRIEFING
          ======================================================== */}
      <section className="border-t border-primary/20 bg-[#030906] py-16 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="font-mono text-xs font-semibold text-primary uppercase tracking-[0.25em]">
                HISTORICAL THEATRES OF WAR
              </p>
              <h2 className="mt-1 text-2xl sm:text-3xl font-display font-bold uppercase text-foreground">
                MAJOR ARMED ENGAGEMENTS
              </h2>
            </div>
            <Link
              href="/conflicts"
              className="text-xs font-mono text-primary hover:underline flex items-center gap-1"
            >
              VIEW ALL THEATRES <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {conflicts.map((conflict) => (
              <Link
                key={conflict.slug}
                href={`/conflicts/${encodeURIComponent(conflict.slug)}`}
                className="group block"
              >
                <div className="h-full rounded-lg border border-border/60 bg-card/40 p-5 hover:border-primary/60 hover:bg-card/80 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-primary mb-2">
                      <span>{conflict.dateStart.slice(0, 10)}</span>
                      <span className="text-muted-foreground uppercase text-[9px] px-1.5 py-0.5 rounded border border-border/60">
                        DEEP REPORT
                      </span>
                    </div>
                    <h3 className="font-bold text-base tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {conflict.title}
                    </h3>
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {conflict.summary}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-between text-[11px] font-mono text-primary">
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          METHODOLOGY & GROUNDING BANNER
          ======================================================== */}
      <section className="border-t border-primary/20 py-16 px-4 bg-gradient-to-t from-background to-[#040b07]">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-primary/10 border border-primary/20 text-xs font-mono text-primary mb-4">
            <Shield className="w-3.5 h-3.5" />
            <span>PRIMARY SOURCE INTEGRITY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold uppercase text-foreground">
            EVERY CITATION TRACEABLE TO PUBLIC MILITARY RECORDS
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            SENTINEL synthesizes official gazettes, war dispatches, parliamentary reports, and regiment histories into an accessible, interactive digital intelligence asset.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/about"
              className="px-5 py-2.5 rounded border border-primary/40 bg-card/60 font-mono text-xs uppercase tracking-wider text-primary hover:bg-primary/15 transition-colors"
            >
              Read Archival Methodology
            </Link>
            <Link
              href="/intel"
              className="px-5 py-2.5 rounded border border-border/80 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:border-foreground/50 transition-colors"
            >
              Browse Intel Streams
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
