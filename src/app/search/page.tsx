import { searchArchive } from "@/lib/search/service";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SearchPageResult = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  type: string;
  href: string;
};

export default async function AdvancedSearchPage(
  props: { searchParams: Promise<{ q?: string; type?: string }> }
) {
  const searchParams = await props.searchParams;
  const q = searchParams.q || "";
  const typeFilter = searchParams.type || "all";

  let results: SearchPageResult[] = [];
  let total = 0;

  if (q.length >= 2) {
    const response = await searchArchive({ q, type: typeFilter, mode: "full" }, prisma);
    results = response.results;
    total = response.total;
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-4xl font-bold tracking-widest uppercase mb-8">Advanced Search</h1>
      
      <form className="flex gap-4 mb-8" action="/search" method="GET">
        <Input 
          type="text" 
          name="q" 
          defaultValue={q} 
          placeholder="Enter search term..." 
          className="max-w-md"
        />
        <select name="type" defaultValue={typeFilter} className="bg-background border border-border/40 rounded-md px-3">
          <option value="all">All Domains</option>
          <option value="conflict">Conflicts</option>
          <option value="person">Personnel</option>
          <option value="operation">Operations</option>
          <option value="equipment">Equipment</option>
          <option value="unit">Units</option>
          <option value="source">Sources</option>
        </select>
        <Button type="submit">SEARCH</Button>
      </form>

      {q.length > 0 && q.length < 2 && (
        <p className="text-muted-foreground">Please enter at least 2 characters to search.</p>
      )}

      {q.length >= 2 && results.length === 0 && (
        <p className="text-muted-foreground">No results found for &quot;{q}&quot;.</p>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4 font-mono">Found {total} result(s) for &quot;{q}&quot;</p>
          {results.map((result) => (
            <Link key={`${result.type}-${result.id}`} href={result.href} className="block group">
              <div className="border border-border/40 rounded-lg p-6 bg-card hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{result.title}</h3>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 py-0.5 bg-muted rounded-full">
                    {result.type}
                  </span>
                </div>
                {result.summary && (
                  <p className="text-muted-foreground">{result.summary}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
