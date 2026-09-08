import { notFound } from "next/navigation";
import { getOperation, getSlugs } from "@/lib/content";
import { SiteBreadcrumbs } from "@/components/Breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Timeline, TimelineEvent } from "@/components/ui/Timeline";
import { InteractiveMapLayout, ScrollSpySection } from "@/components/InteractiveMapLayout";
import { ConnectionExplorer } from "@/components/ConnectionExplorer";
import type { Metadata } from "next";
import { publicMetadata } from "@/lib/metadata";
import { getPublicOperation } from "@/lib/repositories/entities";

type RelatedEntity = { id: string; title: string; slug: string };

export async function generateStaticParams() {
  const slugs = await getSlugs('operations');
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const operation = await getPublicOperation(slug);
  if (!operation) notFound();
  return publicMetadata({ title: operation.title, description: operation.summary, pathname: `/operations/${encodeURIComponent(operation.slug)}` });
}

export default async function OperationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const operation = await getOperation(slug);

  if (!operation) {
    notFound();
  }

  // Show only dates stored on the record; an end date is not evidence of an outcome.
  const timelineEvents: TimelineEvent[] = [];
  if (operation.dateStart) {
    timelineEvents.push({
      id: "start",
      date: operation.dateStart,
      title: "Recorded start date",
      description: "The source-linked record includes this start date; event detail is not inferred."
    });
  }
  if (operation.dateEnd) {
    timelineEvents.push({
      id: "end",
      date: operation.dateEnd,
      title: "Recorded end date",
      description: "The source-linked record includes this end date; outcome information is not available here."
    });
  }

  const markers: { id: string; title: string; coordinates: [number, number] }[] = [];
  if (operation.coordinates) {
    markers.push({
      id: operation.id,
      title: operation.title,
      coordinates: JSON.parse(operation.coordinates)
    });
  }

  const defaultCenter: [number, number] = operation.coordinates ? JSON.parse(operation.coordinates) : [20.5937, 78.9629];

  return (
    <div className="container mx-auto px-4 max-w-screen-xl py-12">
      <SiteBreadcrumbs />
      
      <div className="mb-12 border-b border-border/40 pb-8">
        <Badge variant="outline" className="mb-4 bg-muted/50 uppercase tracking-wider">{operation.category}</Badge>
        <h1 className="text-4xl md:text-5xl font-bold tracking-widest uppercase mb-2">
          {operation.title}
        </h1>
        {operation.dateStart && (
          <div className="font-mono text-muted-foreground text-sm tracking-wider mb-6">
            {operation.dateStart} {operation.dateEnd ? `— ${operation.dateEnd}` : ""}
          </div>
        )}
        <p className="text-xl text-foreground/90 max-w-3xl leading-relaxed">
          {operation.summary}
        </p>
      </div>

      <InteractiveMapLayout
        markers={markers}
        defaultCenter={defaultCenter}
        extraSidebarContent={
          <ConnectionExplorer
            centerNode={{ id: operation.id, title: operation.title, type: 'operation', slug: operation.slug }}
            connections={[
              ...((operation.people || []) as RelatedEntity[]).map((p) => ({
                id: p.id, title: p.title, type: 'person' as const, slug: p.slug
              })),
              ...((operation.conflicts || []) as RelatedEntity[]).map((c) => ({
                id: c.id, title: c.title, type: 'conflict' as const, slug: c.slug
              }))
            ]}
          />
        }
      >
        <ScrollSpySection id={operation.id} className="space-y-12">
          {operation.content && (
            <section>
              <h2 className="text-xl font-bold tracking-wider mb-4 border-l-2 border-primary pl-4 uppercase">Narrative</h2>
              <div className="prose prose-invert max-w-none text-muted-foreground">
                {operation.content}
              </div>
            </section>
          )}
        </ScrollSpySection>

        {timelineEvents.length > 0 && (
          <section className="mt-12">
            <Timeline events={timelineEvents} />
          </section>
        )}
      </InteractiveMapLayout>
    </div>
  );
}
