import { HUDFrame } from "@/components/HUDFrame";

export default function ConflictsLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8 space-y-3 animate-pulse">
        <div className="h-3 w-48 rounded bg-primary/20" />
        <div className="h-8 w-80 rounded bg-muted/60" />
        <div className="h-4 w-96 rounded bg-muted/40" />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <HUDFrame key={i} variant={i % 2 === 0 ? "danger" : "default"} classification="LOADING...">
            <div className="p-6 space-y-3 animate-pulse">
              <div className="h-3 w-24 rounded bg-primary/20" />
              <div className="h-5 w-48 rounded bg-muted/60" />
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-muted/30" />
                <div className="h-3 w-3/4 rounded bg-muted/30" />
              </div>
            </div>
          </HUDFrame>
        ))}
      </div>
    </div>
  );
}
