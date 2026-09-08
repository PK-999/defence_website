import { notFound } from "next/navigation";
import { getConflict, getSlugs } from "@/lib/content";
import { SiteBreadcrumbs } from "@/components/Breadcrumbs";
import { ConnectionExplorer } from "@/components/ConnectionExplorer";
import { ScrambleText } from "@/components/ScrambleText";
import { ProvenanceViewer } from "@/components/ProvenanceViewer";
import { InteractiveConflictViewer, EventDetail } from "@/components/InteractiveConflictViewer";
import type { Metadata } from "next";
import { publicMetadata } from "@/lib/metadata";
import { getPublicConflict } from "@/lib/repositories/entities";

export const dynamic = "force-dynamic";

type RelatedEvent = {
  id: string;
  title: string;
  slug: string;
  dateStart: string;
  summary: string;
  content: string | null;
  coordinates: string | null;
  referenceUrl: string | null;
};
type RelatedCard = { id: string; title: string; slug: string };

export async function generateStaticParams() {
  const slugs = await getSlugs('conflicts');
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const conflict = await getPublicConflict(slug);
  return conflict ? publicMetadata({ title: conflict.title, description: conflict.summary, pathname: `/conflicts/${encodeURIComponent(conflict.slug)}` }) : { title: "Page not found | SENTINEL", robots: { index: false, follow: false } };
}

export default async function ConflictPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const conflict = await getConflict(slug);

  if (!conflict) {
    notFound();
  }

  // Map the conflict and its operations to the EventDetail format
  const conflictDetail: EventDetail = {
    id: conflict.id,
    title: conflict.title,
    date: conflict.dateStart,
    summary: conflict.summary || "",
    content: conflict.content || conflict.summary || "",
    coordinates: conflict.coordinates ? JSON.parse(conflict.coordinates) : undefined,
    referenceUrl: conflict.referenceUrl || undefined,
    slug: conflict.slug,
    type: 'conflict'
  };

  const operationsEvents: EventDetail[] = (conflict.operations || [])
    .map((op: RelatedEvent) => ({
      id: op.id,
      title: op.title,
      date: op.dateStart,
      summary: op.summary || "",
      content: op.content || op.summary || "",
      coordinates: op.coordinates ? JSON.parse(op.coordinates) : undefined,
      referenceUrl: op.referenceUrl || undefined,
      slug: op.slug,
      type: 'operation' as const
    }))
    .sort((a, b) => {
      const aParts = a.date.split('-');
      const bParts = b.date.split('-');
      if (aParts.length === 3 && bParts.length === 3) {
        const aDate = new Date(`${aParts[2]}-${aParts[1]}-${aParts[0]}`);
        const bDate = new Date(`${bParts[2]}-${bParts[1]}-${bParts[0]}`);
        return aDate.getTime() - bDate.getTime();
      }
      return 0;
    });

  return (
    <div className="container mx-auto px-4 max-w-screen-2xl py-12">
      <SiteBreadcrumbs />
      
      <div className="mb-12 border-b border-border/40 pb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-widest uppercase mb-4 text-primary">
          <ScrambleText text={conflict.title} />
        </h1>
        {conflict.dateStart && (
          <div className="font-mono text-muted-foreground text-sm tracking-wider mb-6">
            {conflict.dateStart} {conflict.dateEnd ? `— ${conflict.dateEnd}` : ""}
          </div>
        )}
      </div>

      {/* 3-Column Interactive Viewer */}
      <div className="mb-16">
        <InteractiveConflictViewer 
          conflict={conflictDetail} 
          events={operationsEvents} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
        <div className="lg:col-span-2 space-y-12">
          {conflict.contextSummary && (
            <section>
              <h2 className="text-xl font-bold tracking-wider mb-4 border-l-2 border-primary pl-4 uppercase">Context & Prelude</h2>
              <div className="prose prose-invert max-w-none text-muted-foreground">
                {conflict.contextSummary}
              </div>
            </section>
          )}
          {conflict.outcomeSummary && (
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
    </div>
  );
}
