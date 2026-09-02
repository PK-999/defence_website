import { notFound } from "next/navigation";
import { getPerson, getSlugs } from "@/lib/content";
import { SiteBreadcrumbs } from "@/components/Breadcrumbs";

export async function generateStaticParams() {
  const slugs = await getSlugs('people');
  return slugs.map((slug) => ({ slug }));
}

export default async function PersonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const person = await getPerson(slug);

  if (!person) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 max-w-screen-xl py-12">
      <SiteBreadcrumbs />
      
      <div className="mb-12 border-b border-border/40 pb-8 flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1 space-y-4">
          <div className="text-sm font-bold tracking-wider text-primary uppercase">
            {person.rank}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-widest uppercase">
            {person.fullName}
          </h1>
          <div className="font-mono text-muted-foreground text-sm tracking-wider">
            {person.birthDate && person.deathDate ? `${person.birthDate} — ${person.deathDate}` : ""}
          </div>
          <p className="text-xl text-foreground/90 max-w-2xl leading-relaxed mt-4">
            {person.summary}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {person.content && (
            <section>
              <h2 className="text-xl font-bold tracking-wider mb-4 border-l-2 border-primary pl-4 uppercase">Biography</h2>
              <div className="prose prose-invert max-w-none text-muted-foreground">
                {person.content}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
