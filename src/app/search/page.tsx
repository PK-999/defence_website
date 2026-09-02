import { prisma } from "@/lib/content";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function AdvancedSearchPage(
  props: { searchParams: Promise<{ q?: string; type?: string }> }
) {
  const searchParams = await props.searchParams;
  const q = searchParams.q || "";
  const typeFilter = searchParams.type || "all";

  // Reusable search clause for Prisma
  const searchClause = q.length >= 2 ? {
    OR: [
      { title: { contains: q } },
      { summary: { contains: q } },
    ]
  } : undefined;

  let results: any[] = [];

  if (q.length >= 2) {
    const fetchPromises = [];
    if (typeFilter === "all" || typeFilter === "conflict") {
      fetchPromises.push(prisma.conflict.findMany({ where: searchClause, select: { id: true, title: true, slug: true, summary: true } }).then(res => res.map(r => ({ ...r, type: 'Conflict', href: `/history/${r.slug}` }))));
    }
    if (typeFilter === "all" || typeFilter === "person") {
      fetchPromises.push(prisma.person.findMany({ where: searchClause, select: { id: true, title: true, slug: true, summary: true } }).then(res => res.map(r => ({ ...r, type: 'Person', href: `/people/${r.slug}` }))));
    }
    if (typeFilter === "all" || typeFilter === "operation") {
      fetchPromises.push(prisma.operation.findMany({ where: searchClause, select: { id: true, title: true, slug: true, summary: true } }).then(res => res.map(r => ({ ...r, type: 'Operation', href: `/operations/${r.slug}` }))));
    }
    if (typeFilter === "all" || typeFilter === "equipment") {
      fetchPromises.push(prisma.equipment.findMany({ where: searchClause, select: { id: true, title: true, slug: true, summary: true } }).then(res => res.map(r => ({ ...r, type: 'Equipment', href: `/arsenal/${r.slug}` }))));
    }

    const fetched = await Promise.all(fetchPromises);
    results = fetched.flat();
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
        </select>
        <Button type="submit">SEARCH</Button>
      </form>

      {q.length > 0 && q.length < 2 && (
        <p className="text-muted-foreground">Please enter at least 2 characters to search.</p>
      )}

      {q.length >= 2 && results.length === 0 && (
        <p className="text-muted-foreground">No results found for "{q}".</p>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4 font-mono">Found {results.length} result(s) for "{q}"</p>
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
