import { HUDFrame } from "@/components/HUDFrame";

export default function ArsenalLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 space-y-3 animate-pulse">
        <div className="h-3 w-52 rounded bg-primary/20" />
        <div className="h-8 w-72 rounded bg-muted/60" />
        <div className="h-4 w-96 rounded bg-muted/40" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <HUDFrame key={i} variant="default" classification="LOADING...">
            <div className="p-5 space-y-3 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="h-3 w-20 rounded bg-primary/20" />
                <div className="h-3 w-16 rounded bg-muted/30" />
              </div>
              <div className="h-5 w-44 rounded bg-muted/60" />
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-muted/20" />
                <div className="h-3 w-3/4 rounded bg-muted/20" />
              </div>
              <div className="pt-3 border-t border-border/40 space-y-1">
                <div className="h-3 w-full rounded bg-muted/15" />
                <div className="h-3 w-2/3 rounded bg-muted/15" />
              </div>
            </div>
          </HUDFrame>
        ))}
      </div>
    </div>
  );
}
