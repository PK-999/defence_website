import Link from "next/link";
import { Search } from "lucide-react";
import { GlobalSearch } from "@/components/GlobalSearch";

export function HomeSearch() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex-1 [&_button]:h-12 [&_button]:w-full [&_button]:justify-between [&_button]:rounded-lg [&_button]:border-primary/40 [&_button]:bg-card [&_button]:px-4 [&_button]:text-left [&_button]:text-base">
        <GlobalSearch />
      </div>
      <Link href="/search" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-border px-5 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary">
        <Search className="h-4 w-4" aria-hidden="true" />
        Advanced search
      </Link>
    </div>
  );
}
