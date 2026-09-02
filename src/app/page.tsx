import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrambleText } from "@/components/ScrambleText";

export default function Home() {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center border-b border-border/40 overflow-hidden">
        {/* Abstract topographic/radar background placeholder */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background opacity-80" />
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        
        <div className="container px-4 z-10 flex flex-col items-center text-center space-y-8 max-w-4xl">
          <div className="space-y-4">
            <ScrambleText 
              text="SENTINEL" 
              className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-widest text-primary"
            />
            <p className="text-xl md:text-2xl font-mono tracking-widest text-muted-foreground uppercase">
              <ScrambleText text="INDIAN DEFENCE ARCHIVE" />
            </p>
          </div>
          
          <p className="text-lg md:text-xl max-w-2xl text-foreground/80 font-medium">
            A source-first interactive archive of India's military history.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 mt-12 w-full justify-center">
            <Button nativeButton={false} render={<Link href="/history" />} size="lg" className="px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-bold tracking-wider">
              ENTER THE ARCHIVE
            </Button>
            <Button nativeButton={false} render={<Link href="/history" />} size="lg" variant="outline" className="px-8 tracking-wider font-semibold border-primary/50 text-primary hover:bg-primary/10">
              EXPLORE HISTORY
            </Button>
          </div>

          <div className="mt-16 pt-8 border-t border-border/40 w-full max-w-3xl hidden md:block">
            <div className="flex justify-between items-center text-sm font-mono text-muted-foreground">
              <span>1947</span>
              <div className="flex-1 h-px bg-border/40 mx-4"></div>
              <span>1962</span>
              <div className="flex-1 h-px bg-border/40 mx-4"></div>
              <span>1965</span>
              <div className="flex-1 h-px bg-border/40 mx-4"></div>
              <span>1971</span>
              <div className="flex-1 h-px bg-border/40 mx-4"></div>
              <span>1999</span>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Section */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4 max-w-screen-xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold tracking-wider mb-2">EXPLORE THE ARCHIVE</h2>
            <div className="w-12 h-1 bg-primary mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "HISTORY", desc: "Chronological timelines of major conflicts.", href: "/history" },
              { name: "PEOPLE", desc: "Hall of Valour and individual profiles.", href: "/people" },
              { name: "OPERATIONS", desc: "Detailed accounts of military operations.", href: "/operations" },
              { name: "ARSENAL", desc: "Weapons, platforms, and equipment.", href: "/arsenal" },
              { name: "FORCES", desc: "Organizational structure and units.", href: "/forces" },
              { name: "ARCHIVE", desc: "Search through primary and secondary sources.", href: "/archive" },
            ].map((portal) => (
              <Link key={portal.name} href={portal.href} className="group block h-full">
                <div className="h-full p-8 rounded-lg border border-border/50 bg-card hover:border-primary/50 transition-colors flex flex-col justify-center items-center text-center space-y-4">
                  <h3 className="text-xl font-bold tracking-widest group-hover:text-primary transition-colors">{portal.name}</h3>
                  <p className="text-sm text-muted-foreground">{portal.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Block */}
      <section className="py-20 border-t border-border/40">
        <div className="container mx-auto px-4 max-w-3xl text-center space-y-6">
          <h2 className="text-3xl font-bold text-primary">Every story should lead back to evidence.</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            SENTINEL relies exclusively on officially declassified records, primary government sources, and reputable historical texts. We verify claims, cite our sources, and let the facts speak for themselves.
          </p>
          <div className="pt-4">
            <Button nativeButton={false} variant="link" render={<Link href="/history" />} className="text-primary hover:text-primary/80">
              Explore History &rarr;
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
