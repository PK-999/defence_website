import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { requireAnyEditorRole, UnauthorizedError } from "@/lib/auth/editor";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    await requireAnyEditorRole(["REVIEWER", "PUBLISHER"]);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return (
        <main className="mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center px-6 py-20 text-center">
          <ShieldAlert className="mb-4 h-10 w-10 text-muted-foreground" aria-hidden="true" />
          <h1 className="text-2xl font-semibold">Editor access is unavailable</h1>
          <p className="mt-3 text-muted-foreground">This review area is closed until an editor identity provider is configured.</p>
        </main>
      );
    }
    throw error;
  }

  return (
    <div className="flex h-full min-h-[80vh] bg-muted/10">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/40 bg-card p-6 flex flex-col gap-6">
        <div className="flex items-center gap-2 text-primary border-b border-border/40 pb-4">
          <ShieldAlert className="w-5 h-5" />
          <span className="font-bold tracking-widest text-sm">ADMIN COMMAND</span>
        </div>
        
        <nav className="flex flex-col gap-2 text-sm tracking-wider font-semibold">
          <Link href="/admin" className="px-4 py-2 hover:bg-muted rounded text-muted-foreground hover:text-foreground">DASHBOARD</Link>
          <Link href="/admin/conflicts" className="px-4 py-2 hover:bg-muted rounded text-muted-foreground hover:text-foreground">CONFLICTS</Link>
          <Link href="/admin/equipment" className="px-4 py-2 hover:bg-muted rounded text-muted-foreground hover:text-foreground">EQUIPMENT</Link>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
