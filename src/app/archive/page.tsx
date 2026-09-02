import { SiteBreadcrumbs } from "@/components/Breadcrumbs";
import { SourceBadge, VerificationBadge } from "@/components/BadgeComponents";

export default function ArchivePage() {
  return (
    <div className="container mx-auto px-4 max-w-screen-xl py-12">
      <SiteBreadcrumbs />
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-widest text-primary mb-4">ARCHIVE</h1>
        <p className="text-xl text-muted-foreground">Search and explore primary and secondary sources.</p>
      </div>
      <div className="grid grid-cols-1 gap-6">
        <div className="p-8 border border-border/50 rounded-lg bg-card flex flex-col gap-4">
          <div className="flex gap-2">
            <SourceBadge tier="A" label="PRIMARY" />
            <VerificationBadge status="OFFICIALLY_CONFIRMED" />
          </div>
          <h2 className="text-2xl font-bold tracking-wider">Declassified Report: Operation Vijay</h2>
          <p className="text-muted-foreground">Official Ministry of Defence records regarding the 1999 Kargil conflict.</p>
        </div>
      </div>
    </div>
  );
}
