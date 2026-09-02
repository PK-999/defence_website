import { notFound } from "next/navigation";
import { getSource, getSlugs } from "@/lib/content";
import { SiteBreadcrumbs } from "@/components/Breadcrumbs";
import { SourceBadge, VerificationBadge } from "@/components/BadgeComponents";

export async function generateStaticParams() {
  const slugs = await getSlugs('sources');
  return slugs.map((slug) => ({ slug }));
}

export default async function SourcePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const source = await getSource(slug);

  if (!source) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 max-w-screen-xl py-12">
      <SiteBreadcrumbs />
      
      <div className="mb-12 border-b border-border/40 pb-8 flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1 space-y-4">
          <div className="flex gap-2 flex-wrap mb-4">
            <SourceBadge tier={source.tier as any} label={source.sourceType.replace(/-/g, ' ').toUpperCase()} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-widest">
            {source.title}
          </h1>
          <div className="font-mono text-muted-foreground text-sm tracking-wider mt-4">
            PUBLISHED BY: <span className="text-foreground">{source.publisher}</span>
            {source.publishedAt && <span> | DATE: {source.publishedAt}</span>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {source.summary && (
            <section>
              <h2 className="text-xl font-bold tracking-wider mb-4 border-l-2 border-primary pl-4 uppercase">Summary</h2>
              <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed">
                {source.summary}
              </div>
            </section>
          )}
          {source.notes && (
            <section>
              <h2 className="text-xl font-bold tracking-wider mb-4 border-l-2 border-primary pl-4 uppercase">Editorial Notes</h2>
              <div className="prose prose-invert max-w-none text-muted-foreground text-sm">
                {source.notes}
              </div>
            </section>
          )}
        </div>
        <div className="space-y-6">
          <a href={source.url} target="_blank" rel="noopener noreferrer" className="block w-full py-3 text-center border border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground font-bold tracking-widest text-sm rounded transition-colors uppercase">
            View Original Source
          </a>
          {source.archiveUrl && (
            <a href={source.archiveUrl} target="_blank" rel="noopener noreferrer" className="block w-full py-3 text-center border border-border/50 text-muted-foreground hover:bg-muted font-bold tracking-widest text-sm rounded transition-colors uppercase">
              View Archived Copy
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
