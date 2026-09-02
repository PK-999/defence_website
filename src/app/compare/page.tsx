import { SiteBreadcrumbs } from "@/components/Breadcrumbs";

export default function ComparePage({ searchParams }: { searchParams: { items?: string } }) {
  // In a real implementation, this would parse `items` from URL query parameters (e.g. ?items=mirage-2000,mig-29)
  // and fetch the corresponding equipment data.
  
  return (
    <div className="container mx-auto px-4 max-w-screen-xl py-12">
      <SiteBreadcrumbs />
      
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-widest text-primary mb-4">COMPARE SYSTEMS</h1>
        <p className="text-xl text-muted-foreground">Side-by-side technical and operational analysis.</p>
      </div>

      <div className="p-8 border border-border/50 rounded-lg bg-card text-center">
        <p className="text-muted-foreground">Select up to 3 systems from the Arsenal to compare them.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="h-64 border border-dashed border-border/50 rounded flex items-center justify-center opacity-50">Slot 1 Empty</div>
          <div className="h-64 border border-dashed border-border/50 rounded flex items-center justify-center opacity-50">Slot 2 Empty</div>
          <div className="h-64 border border-dashed border-border/50 rounded flex items-center justify-center opacity-50">Slot 3 Empty</div>
        </div>
      </div>
    </div>
  );
}
