import { SiteBreadcrumbs } from "@/components/Breadcrumbs";
import Link from "next/link";
import { ScrambleText } from "@/components/ScrambleText";
import { prisma } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const conflicts = await prisma.conflict.findMany({
    orderBy: { dateStart: 'desc' }
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <SiteBreadcrumbs 
        items={[{ label: "History", href: "/history" }]} 
      />
      
      <h1 className="text-5xl font-bold tracking-widest text-primary mt-8 mb-6 uppercase">
        <ScrambleText text="HISTORY ARCHIVE" />
      </h1>
      <p className="text-xl text-muted-foreground mb-16 max-w-2xl">
        Explore major conflicts and chronological timelines.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {conflicts.map((conflict) => (
          <Link 
            key={conflict.id}
            href={`/history/${conflict.slug}`} 
            className="p-8 border border-border/50 rounded-lg bg-card hover:border-primary/50 cursor-pointer block group"
          >
            <h2 className="text-2xl font-bold tracking-wider mb-2 group-hover:text-primary transition-colors">
              {conflict.title}
            </h2>
            <p className="text-muted-foreground mb-4">
              {new Date(conflict.dateStart).getFullYear()}
              {conflict.dateEnd ? ` - ${new Date(conflict.dateEnd).getFullYear()}` : ' - Present'}
            </p>
            <div className="text-sm font-bold tracking-wider text-primary">
              ENTER WAR ROOM →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
