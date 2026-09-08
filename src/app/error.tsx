"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center px-6 py-20 text-center"><h1 className="text-3xl font-bold">The archive could not load</h1><p className="mt-3 text-muted-foreground">Try the request again. No private record details are shown in this error state.</p><button type="button" onClick={() => reset()} className="mt-6 rounded border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10">Try again</button></div>;
}
