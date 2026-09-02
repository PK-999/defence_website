import { SiteBreadcrumbs } from "@/components/Breadcrumbs";

export default function ForcesPage() {
  return (
    <div className="container mx-auto px-4 max-w-screen-xl py-12">
      <SiteBreadcrumbs />
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-widest text-primary mb-4">FORCES</h1>
        <p className="text-xl text-muted-foreground">Organizational structures, commands, and units.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['INDIAN ARMY', 'INDIAN NAVY', 'INDIAN AIR FORCE'].map(force => (
          <div key={force} className="p-8 border border-border/50 rounded-lg bg-card hover:border-primary/50 cursor-pointer text-center">
            <h2 className="text-2xl font-bold tracking-wider mb-2">{force}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
