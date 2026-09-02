import { notFound } from "next/navigation";
import { getConflict, getSlugs } from "@/lib/content";
import { SiteBreadcrumbs } from "@/components/Breadcrumbs";
import { WarRoom } from "@/components/WarRoom";
import { ConnectionExplorer } from "@/components/ConnectionExplorer";
import { ScrambleText } from "@/components/ScrambleText";

export async function generateStaticParams() {
  const slugs = await getSlugs('conflicts');
  return slugs.map((slug) => ({ slug }));
}

export default async function ConflictPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const conflict = await getConflict(slug);

  if (!conflict) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 max-w-screen-xl py-12">
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
        <p className="text-xl text-foreground/90 max-w-3xl leading-relaxed">
          {conflict.summary}
        </p>
      </div>

      {slug === 'kargil-1999' && (
        <div className="mb-16">
          <WarRoom />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
        <div className="lg:col-span-2 space-y-12">
          {conflict.contextSummary && (
            <section>
              <h2 className="text-xl font-bold tracking-wider mb-4 border-l-2 border-primary pl-4 uppercase">Why it happened</h2>
              <div className="prose prose-invert max-w-none text-muted-foreground">
                {conflict.contextSummary}
              </div>
            </section>
          )}

          {conflict.content && (
            <section>
              <h2 className="text-xl font-bold tracking-wider mb-4 border-l-2 border-primary pl-4 uppercase">Overview</h2>
              <div className="prose prose-invert max-w-none text-muted-foreground">
                {conflict.content}
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

        <div className="space-y-8">
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

      <ConnectionExplorer 
        centerNode={{ id: conflict.id, title: conflict.title, type: 'conflict', slug: conflict.slug }}
        connections={[
          { id: 'p1', title: 'Capt. Vikram Batra', type: 'person', slug: 'vikram-batra' },
          { id: 'o1', title: 'Operation Safed Sagar', type: 'operation', slug: 'safed-sagar' },
          { id: 'e1', title: 'Mirage 2000', type: 'equipment', slug: 'mirage-2000' }
        ]}
      />
    </div>
  );
}
