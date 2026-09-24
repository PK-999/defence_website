import { HUDFrame } from "@/components/HUDFrame";

export default function HeroesLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 space-y-3 animate-pulse">
        <div className="h-3 w-56 rounded bg-primary/20" />
        <div className="h-8 w-64 rounded bg-muted/60" />
        <div className="h-4 w-96 rounded bg-muted/40" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-12">
        {Array.from({ length: 6 }).map((_, i) => (
          <HUDFrame key={i} variant="default" classification="LOADING...">
            <div className="p-3.5 flex items-center gap-3.5 animate-pulse">
              <div className="w-12 h-12 rounded-full bg-muted/40" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-36 rounded bg-muted/60" />
                <div className="h-3 w-20 rounded bg-muted/30" />
              </div>
            </div>
          </HUDFrame>
        ))}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <HUDFrame key={`card-${i}`} variant="default">
            <div className="animate-pulse">
              <div className="h-44 bg-muted/30" />
              <div className="p-5 space-y-3">
                <div className="h-3 w-24 rounded bg-primary/20" />
                <div className="h-5 w-40 rounded bg-muted/60" />
                <div className="h-3 w-32 rounded bg-muted/30" />
                <div className="space-y-2 mt-3">
                  <div className="h-3 w-full rounded bg-muted/20" />
                  <div className="h-3 w-3/4 rounded bg-muted/20" />
                </div>
              </div>
            </div>
          </HUDFrame>
        ))}
      </div>
    </div>
  );
}
