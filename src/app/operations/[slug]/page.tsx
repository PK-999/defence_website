import { notFound } from "next/navigation";
import { getOperation, getSlugs } from "@/lib/content";
import { SiteBreadcrumbs } from "@/components/Breadcrumbs";
import { Badge } from "@/components/ui/badge";

export async function generateStaticParams() {
  const slugs = await getSlugs('operations');
  return slugs.map((slug) => ({ slug }));
}

export default async function OperationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const operation = await getOperation(slug);

  if (!operation) {
    notFound();
  }

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {operation.content && (
            <section>
              <h2 className="text-xl font-bold tracking-wider mb-4 border-l-2 border-primary pl-4 uppercase">Narrative</h2>
              <div className="prose prose-invert max-w-none text-muted-foreground">
                {operation.content}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
