import { PageHeader, PageShell } from "@/components/PageShell";
import { HUDFrame } from "@/components/HUDFrame";
import { Shield, BookOpen, FileCheck, ExternalLink, Terminal } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "About & Methodology | SENTINEL",
  description: "Archival methodology, primary source grounding, and editorial standards of the SENTINEL Indian Defence Archive.",
};

export default function AboutPage() {
  return (
    <PageShell width="reading">
      <PageHeader
        eyebrow="SYSTEM ARCHITECTURE & METHODOLOGY"
        title="About the Archive"
        description="SENTINEL is an open-source, independent digital intelligence archive and educational wiki documenting India's military history, operational campaigns, decorated personnel, and defence assets."
      />

      <div className="space-y-12 text-sm leading-relaxed text-muted-foreground font-sans">
        {/* Core Mission */}
        <section>
          <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-wider mb-2">
            <Terminal className="w-3.5 h-3.5 text-primary" />
            <span>Mission Objective</span>
          </div>
          <h2 className="text-xl font-display font-bold text-foreground uppercase tracking-wide border-l-2 border-primary pl-3">
            A Single Stop Open-Source Defence Repository
          </h2>
          <p className="mt-4">
            India&apos;s military history spans seven decades of high-altitude warfare, counter-insurgency, maritime patrol, peacekeeping, and peacekeeping operations across four continents. However, historical documentation, official citations, order of battle registries, and weapon platform specifications are often dispersed across disparate archives, gazette files, and official documents.
          </p>
          <p className="mt-3">
            SENTINEL synthesizes this archival universe into a unified, high-performance, cinematic digital intelligence platform that educates citizens, researchers, and history enthusiasts.
          </p>
        </section>

        {/* Source Tier Hierarchy */}
        <section>
          <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-wider mb-2">
            <FileCheck className="w-3.5 h-3.5 text-primary" />
            <span>Research Rigour</span>
          </div>
          <h2 className="text-xl font-display font-bold text-foreground uppercase tracking-wide border-l-2 border-primary pl-3">
            Source Hierarchy & Grounding Standards
          </h2>
          <p className="mt-4">
            Every entry in the SENTINEL database is grounded in verifiable open-source evidence:
          </p>

          <div className="mt-6 space-y-4">
            <HUDFrame variant="gold" label="TIER 1 · CANONICAL GOVERNMENT RECORDS">
              <div className="p-4">
                <h3 className="font-bold text-foreground text-sm">Official Gazette & Ministry Dispatches</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Official Gazette of India notifications, Ministry of Defence Gallantry Award records (gallantryawards.gov.in), parliamentary committee reports, and Armed Forces historical divisions.
                </p>
              </div>
            </HUDFrame>

            <HUDFrame variant="default" label="TIER 2 · REGIMENTAL & SERVICE MONOGRAPHS">
              <div className="p-4">
                <h3 className="font-bold text-foreground text-sm">Regimental Archives & Official Histories</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Published regimental histories, war dispatches by theatre commanders, and official service histories published by the Ministry of Defence Historical Division.
                </p>
              </div>
            </HUDFrame>

            <HUDFrame variant="cyan" label="TIER 3 · PEER-REVIEWED & TECHNICAL DOSSIERS">
              <div className="p-4">
                <h3 className="font-bold text-foreground text-sm">Defence Research & Strategic Analysis</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Monographs from the Manohar Parrikar Institute for Defence Studies and Analyses (MP-IDSA), Centre for Joint Warfare Studies (CENJOWS), and technical defence databases.
                </p>
              </div>
            </HUDFrame>
          </div>
        </section>

        {/* Independence & Neutrality */}
        <section>
          <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-wider mb-2">
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span>Operational Independence</span>
          </div>
          <h2 className="text-xl font-display font-bold text-foreground uppercase tracking-wide border-l-2 border-primary pl-3">
            Disclaimer & Educational Nature
          </h2>
          <p className="mt-4">
            SENTINEL is an independent educational and archival project. It is <strong>not</strong> an official Government of India or Armed Forces website, and it does not host classified or restricted materials. All data presented has been compiled strictly from publicly available sources, government disclosures, and published literature.
          </p>
          <p className="mt-3">
            Names, service crests, medals, and original source documents belong to their respective copyright holders and custodians.
          </p>
        </section>

        {/* Explore Links */}
        <div className="mt-12 pt-8 border-t border-primary/20 flex flex-wrap gap-4">
          <Link
            href="/intel"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-primary text-primary-foreground font-mono text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors"
          >
            <span>Open Intel Ledger</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/heroes"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded border border-border bg-card/60 font-mono text-xs font-bold uppercase tracking-wider hover:border-primary text-primary transition-colors"
          >
            Browse Gallantry Heroes
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
