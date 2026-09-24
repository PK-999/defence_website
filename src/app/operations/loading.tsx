import { HUDFrame } from "@/components/HUDFrame";

export default function OperationsLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8 space-y-3 animate-pulse">
        <div className="h-3 w-56 rounded bg-primary/20" />
        <div className="h-8 w-60 rounded bg-muted/60" />
        <div className="h-4 w-96 rounded bg-muted/40" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <HUDFrame key={i} variant="default" classification="LOADING...">
            <div className="p-5 space-y-3 animate-pulse">
              <div className="h-3 w-16 rounded bg-primary/20" />
              <div className="h-5 w-40 rounded bg-muted/60" />
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-muted/20" />
                <div className="h-3 w-3/4 rounded bg-muted/20" />
              </div>
            </div>
          </HUDFrame>
        ))}
      </div>
    </div>
  );
}
