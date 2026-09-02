import { SiteBreadcrumbs } from "@/components/Breadcrumbs";
import Link from "next/link";
import { prisma } from "@/lib/content";
import { ScrambleText } from "@/components/ScrambleText";

export const dynamic = "force-dynamic";

export default async function PeoplePage() {
  const people = await prisma.person.findMany({
    orderBy: { title: 'asc' }
  });

  return (
    <div className="container mx-auto px-4 max-w-screen-xl py-12">
      <SiteBreadcrumbs items={[{ label: "Hall of Valour", href: "/people" }]} />
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-widest text-primary mb-4 uppercase">
          <ScrambleText text="HALL OF VALOUR" />
        </h1>
        <p className="text-xl text-muted-foreground">Biographies, citations, and service histories.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {people.map(person => (
          <Link 
            key={person.id}
            href={`/people/${person.slug}`} 
            className="p-8 border border-border/50 rounded-lg bg-card hover:border-primary/50 cursor-pointer block group"
          >
            <div className="text-sm font-bold tracking-wider text-primary uppercase mb-2">
              {person.rank || 'Officer'}
            </div>
            <h2 className="text-2xl font-bold tracking-wider mb-2 group-hover:text-primary transition-colors">
              {person.title}
            </h2>
            <p className="text-muted-foreground text-sm line-clamp-3">
              {person.summary}
            </p>
          </Link>
        ))}
        {people.length === 0 && (
          <div className="p-8 border border-border/50 rounded-lg bg-card col-span-3 text-center">
            <p className="text-muted-foreground">No personnel records found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
