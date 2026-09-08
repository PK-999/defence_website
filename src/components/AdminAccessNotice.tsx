import { ShieldAlert } from "lucide-react";

export function AdminAccessNotice() {
  return (
    <div className="rounded-lg border border-dashed border-border/50 bg-card p-8 text-center">
      <ShieldAlert className="mx-auto mb-3 h-8 w-8 text-muted-foreground" aria-hidden="true" />
      <h1 className="text-xl font-semibold">Editor access is unavailable</h1>
      <p className="mt-2 text-sm text-muted-foreground">Configure the validated editor identity provider before opening review tools.</p>
    </div>
  );
}
