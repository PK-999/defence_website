import { notFound } from "next/navigation";
import { getOperation } from "@/lib/content";
import { InteractiveMapLayout, ScrollSpySection } from "@/components/InteractiveMapLayout";
import { ConnectionExplorer } from "@/components/ConnectionExplorer";
import { PageHeader, PageShell } from "@/components/PageShell";
import type { Metadata } from "next";
import { publicMetadata } from "@/lib/metadata";
import { getPublicOperation } from "@/lib/repositories/entities";
import { getOperationDossier, type OperationDossierEvent } from "@/lib/operation-dossiers";

type RelatedEntity = { id: string; title: string; slug: string };

export const dynamic = "force-dynamic";

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

  const dossier = getOperationDossier(operation.slug);
  // A dossier can add dated, source-linked field notes. When no such notes
  // exist, retain the database dates without inferring an outcome or narrative.
  const timelineEvents: OperationDossierEvent[] = dossier?.events.length ? dossier.events : [
    ...(operation.dateStart ? [{
      id: "start",
      date: operation.dateStart,
      title: "Recorded start date",
      description: "The source-linked record includes this start date; event detail is not inferred."
    }] : []),
    ...(operation.dateEnd ? [{
      id: "end",
      date: operation.dateEnd,
      title: "Recorded end date",
      description: "The source-linked record includes this end date; outcome information is not available here."
    }] : []),
  ];

  const operationCoordinates: [number, number] | undefined = operation.coordinates
    ? (() => {
      try {
        const parsed = JSON.parse(operation.coordinates) as unknown;
        return Array.isArray(parsed) && parsed.length === 2 && parsed.every((value) => typeof value === "number")
          ? [parsed[0], parsed[1]] as [number, number]
          : undefined;
      } catch { return undefined; }
    })()
    : undefined;

  const defaultCenter: [number, number] = operationCoordinates ?? [20.5937, 78.9629];
  const isBattle = operation.category.toLowerCase().includes("battle");
  const markers: { id: string; title: string; coordinates: [number, number] }[] = [];
  if (isBattle) {
    for (const event of timelineEvents) {
      const coordinates = event.coordinates ?? operationCoordinates;
      if (coordinates) markers.push({ id: event.id, title: event.title, coordinates });
    }
  } else if (operationCoordinates) {
    markers.push({ id: operation.id, title: operation.title, coordinates: operationCoordinates });
  }

  return (
    <PageShell width="wide">
      <PageHeader eyebrow={`FIELD OPERATION · ${operation.category}`} title={operation.title} description={operation.summary || undefined} />
      {operation.dateStart && <p className="-mt-4 mb-8 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">{operation.dateStart} {operation.dateEnd ? `— ${operation.dateEnd}` : ""}</p>}

      <InteractiveMapLayout
        markers={markers}
        defaultCenter={defaultCenter}
        timelineEvents={timelineEvents}
        mapCompact={isBattle}
        showActiveCoordinates={!isBattle}
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
          {dossier?.context && (
            <section>
              <h2 className="text-xl font-bold tracking-wider mb-4 border-l-2 border-primary pl-4 uppercase">Dossier</h2>
              <p className="text-lg leading-relaxed text-muted-foreground">{dossier.context}</p>
            </section>
          )}

          {operation.content && (
            <section>
              <h2 className="text-xl font-bold tracking-wider mb-4 border-l-2 border-primary pl-4 uppercase">Full report</h2>
              <div className="prose prose-invert max-w-none text-muted-foreground space-y-4">
                {operation.content.split(/\n{2,}/).map((paragraph, index) => <p key={`${operation.id}-paragraph-${index}`}>{paragraph}</p>)}
              </div>
            </section>
          )}

          {dossier?.stories.length ? (
            <section>
              <h2 className="text-xl font-bold tracking-wider mb-4 border-l-2 border-primary pl-4 uppercase">Stories &amp; field notes</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {dossier.stories.map((story) => (
                  <article key={story.title} className="rounded-lg border border-border/50 bg-card/60 p-5">
                    <h3 className="text-lg font-semibold tracking-wide text-foreground">{story.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{story.body}</p>
                    <a href={story.sourceUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex text-[10px] font-mono uppercase tracking-[0.18em] text-primary hover:underline">
                      Source: {story.sourceLabel}
                    </a>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
        </ScrollSpySection>
      </InteractiveMapLayout>
    </PageShell>
  );
}
