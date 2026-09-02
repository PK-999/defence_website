import { SiteBreadcrumbs } from "@/components/Breadcrumbs";
import Link from "next/link";
import { prisma } from "@/lib/content";
import { ScrambleText } from "@/components/ScrambleText";

export const dynamic = "force-dynamic";

export default async function OperationsPage() {
  const operations = await prisma.operation.findMany({
    orderBy: { dateStart: 'desc' }
  });

  return (
    <div className="container mx-auto px-4 max-w-screen-xl py-12">
      <SiteBreadcrumbs items={[{ label: "Operations", href: "/operations" }]} />
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-widest text-primary mb-4 uppercase">
          <ScrambleText text="OPERATIONS" />
        </h1>
        <p className="text-xl text-muted-foreground">Combat, rescue, and humanitarian missions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {operations.map(op => (
          <Link 
            key={op.id} 
            href={`/operations/${op.slug}`}
            className="p-8 border border-border/50 rounded-lg bg-card hover:border-primary/50 cursor-pointer block group"
          >
            <div className="text-xs font-bold tracking-widest text-primary uppercase mb-2">
              {new Date(op.dateStart).getFullYear()}
            </div>
            <h2 className="text-2xl font-bold tracking-wider mb-3 group-hover:text-primary transition-colors">
              {op.title}
            </h2>
            <p className="text-muted-foreground text-sm line-clamp-3">
              {op.summary}
            </p>
          </Link>
        ))}
        {operations.length === 0 && (
           <div className="p-8 border border-border/50 rounded-lg bg-card">
             <p className="text-muted-foreground">No operations indexed yet.</p>
           </div>
        )}
      </div>
    </div>
  );
}
