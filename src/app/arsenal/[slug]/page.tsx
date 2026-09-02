import { notFound } from "next/navigation";
import { getEquipment, getSlugs } from "@/lib/content";
import { SiteBreadcrumbs } from "@/components/Breadcrumbs";
import { Badge } from "@/components/ui/badge";

export async function generateStaticParams() {
  const slugs = await getSlugs('equipment');
  return slugs.map((slug) => ({ slug }));
}

export default async function EquipmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const equipment = await getEquipment(slug);

  if (!equipment) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 max-w-screen-xl py-12">
      <SiteBreadcrumbs />
      
      <div className="mb-12 border-b border-border/40 pb-8 flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1 space-y-4">
          <Badge variant="outline" className="mb-4 bg-muted/50 uppercase tracking-wider">{equipment.domain} / {equipment.category}</Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-widest uppercase">
            {equipment.title}
          </h1>
          <p className="text-xl text-foreground/90 max-w-2xl leading-relaxed mt-4">
            {equipment.summary}
          </p>
          <div className="flex gap-2 flex-wrap mt-4">
            <Badge variant="secondary" className="uppercase tracking-wider">{equipment.serviceStatus.replace(/-/g, ' ')}</Badge>
            <Badge variant="outline" className="uppercase tracking-wider">{equipment.developmentModel.replace(/-/g, ' ')}</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {equipment.content && (
            <section>
              <h2 className="text-xl font-bold tracking-wider mb-4 border-l-2 border-primary pl-4 uppercase">Role & History</h2>
              <div className="prose prose-invert max-w-none text-muted-foreground">
                {equipment.content}
              </div>
            </section>
          )}
        </div>
        <div className="space-y-8">
          {equipment.specs && equipment.specs.length > 0 && (
            <div className="p-6 border border-border/40 bg-card rounded-lg">
              <h3 className="text-sm font-bold tracking-wider mb-4 uppercase text-muted-foreground">Specifications</h3>
              <ul className="space-y-4">
                {equipment.specs.map((spec: any, i: number) => (
                  <li key={i} className="flex flex-col border-b border-border/40 pb-2 last:border-0">
                    <span className="text-xs uppercase text-muted-foreground tracking-wider">{spec.label}</span>
                    <span className="font-mono text-sm">{spec.value} {spec.unit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
