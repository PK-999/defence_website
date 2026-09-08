"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type SearchResult = {
  id: string;
  title: string;
  summary: string;
  type: string;
  href: string;
};

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [retryNonce, setRetryNonce] = React.useState(0);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const router = useRouter();
  const requestId = React.useRef(0);
  const controller = React.useRef<AbortController | null>(null);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  React.useEffect(() => {
    if (query.length < 2) {
      // The query state is the source of truth; clear stale results immediately when it becomes too short.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([]);
      setError(false);
      controller.current?.abort();
      return;
    }
    const timeoutId = setTimeout(() => {
      controller.current?.abort();
      const id = ++requestId.current;
      const nextController = new AbortController(); controller.current = nextController;
      setLoading(true);
      setError(false);
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then((res) => { if (!res.ok) throw new Error("SEARCH_FAILED"); return res.json(); })
        .then((data) => {
          if (id !== requestId.current) return;
          setResults(data.results || []);
        })
        .catch((reason: unknown) => {
          if (id !== requestId.current || (reason instanceof DOMException && reason.name === "AbortError")) return;
          setResults([]); setError(true);
        })
        .finally(() => {
          if (id === requestId.current) setLoading(false);
        })
    }, 300);

    return () => { clearTimeout(timeoutId); controller.current?.abort(); };
  }, [query, retryNonce]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") { event.preventDefault(); setActiveIndex((index) => Math.min(index + 1, Math.max(0, results.length - 1))); }
    if (event.key === "ArrowUp") { event.preventDefault(); setActiveIndex((index) => Math.max(0, index - 1)); }
    if (event.key === "Enter" && results[activeIndex]) { event.preventDefault(); handleSelect(results[activeIndex].href); }
  };

  const handleSelect = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        className="relative h-8 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64 border border-input inline-flex items-center px-4 py-2 hover:bg-accent hover:text-accent-foreground"
      >
        <span className="hidden lg:inline-flex">Search archive...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </DialogTrigger>
      <DialogContent className="p-0 border-border/40 gap-0 overflow-hidden max-w-2xl bg-card shadow-2xl">
        <DialogTitle className="sr-only">Search</DialogTitle>
        <div className="flex items-center px-4 py-3 border-b border-border/40">
          <Search className="w-5 h-5 mr-3 text-muted-foreground" />
          <Input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="global-search-results"
            aria-autocomplete="list"
            className="flex-1 border-0 shadow-none focus-visible:ring-0 text-base h-auto p-0 bg-transparent"
            placeholder="Type a command or search..."
            autoFocus
          />
          {loading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground ml-2" />}
        </div>
        <div id="global-search-results" role="listbox" aria-label="Search results" className="max-h-[60vh] overflow-y-auto p-2">
          {results.length === 0 && query.length >= 2 && !loading && (
            <div className="p-4 text-center text-sm text-muted-foreground">{error ? <><p>Search is temporarily unavailable.</p><button type="button" className="mt-2 text-primary underline" onClick={() => setRetryNonce((value) => value + 1)}>Retry</button></> : `No results found for "${query}".`}</div>
          )}
          {results.length > 0 && (
            <div className="flex flex-col gap-1">
              {results.map((r) => (
                <button
                  key={`${r.type}-${r.id}`}
                  role="option"
                  aria-selected={results[activeIndex]?.id === r.id}
                  onClick={() => handleSelect(r.href)}
                  className="flex flex-col text-left px-3 py-2 rounded-md hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{r.title}</span>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 py-0.5 bg-muted rounded-full">
                      {r.type}
                    </span>
                  </div>
                  {r.summary && (
                    <span className="text-xs text-muted-foreground line-clamp-1 mt-1">{r.summary}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="border-t border-border/40 p-2 px-4 bg-muted/10 flex justify-end">
          <Link href={`/search?q=${encodeURIComponent(query)}`} onClick={() => setOpen(false)} className="text-xs font-semibold hover:underline text-primary tracking-wider uppercase">
            Advanced Search &rarr;
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
