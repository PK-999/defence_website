"use client";

import { Shield, RefreshCw } from "lucide-react";

export default function ArsenalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-accent-danger/10 border border-accent-danger/30 text-accent-danger font-mono text-xs font-bold tracking-widest uppercase mb-6">
        <Shield className="w-4 h-4" />
        TRANSMISSION INTERRUPTED
      </div>
      <h1 className="text-3xl font-display font-bold uppercase text-foreground">
        ARSENAL INVENTORY OFFLINE
      </h1>
      <p className="mt-4 text-muted-foreground text-sm max-w-md mx-auto">
        The defence systems catalogue feed encountered an unexpected interruption.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 rounded border border-primary/40 bg-primary/10 font-mono text-xs uppercase tracking-wider text-primary hover:bg-primary/20 transition-colors"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        RETRY CONNECTION
      </button>
    </div>
  );
}
