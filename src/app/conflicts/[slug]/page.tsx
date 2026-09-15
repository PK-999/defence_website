import { notFound } from "next/navigation";
import { getConflict } from "@/lib/content";
import { ConnectionExplorer } from "@/components/ConnectionExplorer";
import { ProvenanceViewer } from "@/components/ProvenanceViewer";
import { InteractiveConflictViewer, EventDetail } from "@/components/InteractiveConflictViewer";
import type { Metadata } from "next";
import { publicMetadata } from "@/lib/metadata";
import { getPublicConflict } from "@/lib/repositories/entities";
import { PageHeader, PageShell } from "@/components/PageShell";
import { ResearchDossier } from "@/components/ResearchDossier";
import { getConflictDossier, getHistoryOperationDossier } from "@/lib/history-dossiers";
import { researchedText } from "@/lib/history-display";
import { formatDisplayDate } from "@/lib/domain/dates";

export const dynamic = "force-dynamic";

type RelatedEvent = {
  id: string;
  title: string;
  slug: string;
  dateStart: string;
  dateEnd: string | null;
  summary: string;
  content: string | null;
  coordinates: string | null;
  referenceUrl: string | null;
};
type RelatedCard = { id: string; title: string; slug: string };

function dateRange(start: string, end?: string | null): string {
  return end && end !== start ? `${formatDisplayDate(start)} — ${formatDisplayDate(end)}` : formatDisplayDate(start);
}

function timelineDate(value: string): number {
  const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return Date.UTC(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
  const dayFirst = value.match(/^(\d{2})-(\d{2})-(\d{4})/);
  if (dayFirst) return Date.UTC(Number(dayFirst[3]), Number(dayFirst[2]) - 1, Number(dayFirst[1]));
  const year = value.match(/\d{4}/)?.[0];
  return year ? Date.UTC(Number(year), 0, 1) : Number.MAX_SAFE_INTEGER;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const conflict = await getPublicConflict(slug);
  if (!conflict) notFound();
  return publicMetadata({ title: conflict.title, description: conflict.summary, pathname: `/conflicts/${encodeURIComponent(conflict.slug)}` });
}

export default async function ConflictPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const conflict = await getConflict(slug);

  if (!conflict) {
    notFound();
  }
  const dossier = getConflictDossier(conflict.slug);

  // Map the conflict and its operations to the EventDetail format
  const conflictDetail: EventDetail = {
    id: conflict.id,
    title: conflict.title,
    date: dateRange(conflict.dateStart, conflict.dateEnd),
    summary: dossier?.overview ?? conflict.summary,
    content: researchedText(conflict.content || conflict.summary, dossier),
    coordinates: conflict.coordinates ? JSON.parse(conflict.coordinates) : undefined,
    referenceUrl: conflict.referenceUrl || undefined,
    slug: conflict.slug,
    type: 'conflict'
  };

  const operationsEvents: EventDetail[] = (conflict.operations || [])
    .slice()
    .sort((a: RelatedEvent, b: RelatedEvent) => timelineDate(a.dateStart) - timelineDate(b.dateStart))
    .map((op: RelatedEvent) => {
      const operationDossier = getHistoryOperationDossier(op.slug);
      return {
        id: op.id,
        title: op.title,
        date: dateRange(op.dateStart, op.dateEnd),
        summary: researchedText(op.summary, operationDossier),
        content: researchedText(op.content || op.summary, operationDossier),
        coordinates: op.coordinates ? JSON.parse(op.coordinates) : undefined,
        referenceUrl: op.referenceUrl || undefined,
        slug: op.slug,
        type: 'operation' as const
      };
    });

  return (
    <PageShell width="wide">
      <PageHeader eyebrow="THEATRE RECORD" title={conflict.title} description={(dossier?.overview ?? conflict.summary) || undefined} />
      {conflict.dateStart && <p className="-mt-4 mb-8 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">{dateRange(conflict.dateStart, conflict.dateEnd)}</p>}

      {/* 3-Column Interactive Viewer */}
      <div className="mb-16">
        <InteractiveConflictViewer 
          conflict={conflictDetail} 
          events={operationsEvents} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
        <div className="lg:col-span-2 space-y-12">
          {dossier && <ResearchDossier dossier={dossier} />}
          {!dossier && conflict.contextSummary && (
            <section>
              <h2 className="text-xl font-bold tracking-wider mb-4 border-l-2 border-primary pl-4 uppercase">Context & Prelude</h2>
              <div className="prose prose-invert max-w-none text-muted-foreground">
                {conflict.contextSummary}
              </div>
            </section>
          )}
          {!dossier && conflict.outcomeSummary && (
            <section>
              <h2 className="text-xl font-bold tracking-wider mb-4 border-l-2 border-primary pl-4 uppercase">Outcome</h2>
              <div className="prose prose-invert max-w-none text-muted-foreground">
                {conflict.outcomeSummary}
              </div>
            </section>
          )}
        </div>

        <div className="lg:col-span-1 border-l border-border/40 pl-8">
            <div className="sticky top-24 space-y-12">
              <div className="p-6 border border-border/40 bg-card rounded-lg">
                <h3 className="text-sm font-bold tracking-wider mb-4 uppercase text-muted-foreground">Theatre</h3>
                <ul className="space-y-2">
                  {conflict.theatres?.map((t: string) => (
                    <li key={t} className="font-mono text-sm">{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <ConnectionExplorer 
            centerNode={{ id: conflict.id, title: conflict.title, type: 'conflict', slug: conflict.slug }}
            connections={[
              ...((conflict.people || []) as RelatedCard[]).map((p) => ({
                id: p.id, title: p.title, type: 'person' as const, slug: p.slug
              })),
              ...((conflict.operations || []) as RelatedCard[]).map((o) => ({
                id: o.id, title: o.title, type: 'operation' as const, slug: o.slug
              })),
              ...((conflict.equipment || []) as RelatedCard[]).map((e) => ({
                id: e.id, title: e.title, type: 'equipment' as const, slug: e.slug
              }))
            ]}
          />
        </div>

      <ProvenanceViewer claims={conflict.claims} />
    </PageShell>
  );
}
