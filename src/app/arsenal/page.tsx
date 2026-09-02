import { SiteBreadcrumbs } from "@/components/Breadcrumbs";
import Link from "next/link";
import { prisma } from "@/lib/content";
import { ScrambleText } from "@/components/ScrambleText";

export const dynamic = "force-dynamic";

export default async function ArsenalPage() {
  const equipmentList = await prisma.equipment.findMany({
    orderBy: { title: 'asc' }
  });

  const domains = ['Air', 'Naval', 'Land', 'Missiles'];

  return (
    <div className="container mx-auto px-4 max-w-screen-xl py-12">
      <SiteBreadcrumbs items={[{ label: "Arsenal", href: "/arsenal" }]} />
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-widest text-primary mb-4 uppercase">
          <ScrambleText text="ARSENAL" />
        </h1>
        <p className="text-xl text-muted-foreground">Weapons, platforms, and military technology.</p>
      </div>

      <div className="space-y-12">
        {domains.map(domain => {
          const domainEquip = equipmentList.filter(e => e.domain.toLowerCase() === domain.toLowerCase());
          if (domainEquip.length === 0) return null;

          return (
            <div key={domain}>
              <h2 className="text-2xl font-bold tracking-wider mb-6 text-primary border-b border-primary/20 pb-2 uppercase">{domain}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {domainEquip.map(equip => (
                  <Link 
                    key={equip.id} 
                    href={`/arsenal/${equip.slug}`}
                    className="p-6 border border-border/50 rounded-lg bg-card hover:border-primary/50 cursor-pointer block group"
                  >
                    <div className="text-xs font-bold tracking-widest text-primary uppercase mb-2">
                      {equip.category}
                    </div>
                    <h3 className="text-xl font-bold tracking-wider mb-2 group-hover:text-primary transition-colors">
                      {equip.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {equip.summary}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
