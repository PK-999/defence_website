"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { EntityType } from "@/lib/domain/entities";
import type { PublicGraphNeighborhood } from "@/lib/repositories/graph";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false, loading: () => <div className="flex h-full items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div> });
type Topic = { type: EntityType; id: string; title: string };

export function GraphExplorer({ topics }: { topics: Topic[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selected = topics.find((topic) => topic.type === searchParams.get("type") && topic.id === searchParams.get("id"));
  const hasRequestedTopic = Boolean(searchParams.get("type") || searchParams.get("id"));
  const [data, setData] = React.useState<PublicGraphNeighborhood | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [retry, setRetry] = React.useState(0);
  const [size, setSize] = React.useState({ width: 640, height: 520 });
  const graphRef = React.useRef<HTMLDivElement>(null);

  /* eslint-disable react-hooks/set-state-in-effect */
  React.useEffect(() => {
    if (!graphRef.current) return;
    const observer = new ResizeObserver(([entry]) => setSize({ width: Math.max(320, Math.floor(entry.contentRect.width)), height: Math.max(360, Math.floor(entry.contentRect.height)) }));
    observer.observe(graphRef.current);
    return () => observer.disconnect();
  }, [selected]);

  React.useEffect(() => {
    if (!selected) { setData(null); setLoading(false); setError(false); return; }
    const controller = new AbortController();
    setLoading(true); setError(false);
    fetch(`/api/graph?type=${encodeURIComponent(selected.type)}&id=${encodeURIComponent(selected.id)}&limit=40`, { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error("GRAPH_FAILED"); return response.json() as Promise<PublicGraphNeighborhood>; })
      .then((next) => setData(next))
      .catch((reason: unknown) => { if (reason instanceof DOMException && reason.name === "AbortError") return; setData(null); setError(true); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [selected?.type, selected?.id, retry]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const choose = (topic: Topic) => router.push(`${pathname}?type=${encodeURIComponent(topic.type)}&id=${encodeURIComponent(topic.id)}`, { scroll: false });
  const hrefFor = (node: PublicGraphNeighborhood["nodes"][number]) => node.href;

  return <div className="space-y-6">
    <section className="rounded-lg border border-border/60 bg-card/40 p-4"><h2 className="text-sm font-semibold uppercase tracking-wider text-primary">Choose a public topic</h2><div className="mt-3 flex flex-wrap gap-2">{topics.length === 0 ? <p className="text-sm text-muted-foreground">No reviewed topics are available.</p> : topics.map((topic) => <button type="button" key={`${topic.type}:${topic.id}`} onClick={() => choose(topic)} aria-pressed={selected?.id === topic.id && selected.type === topic.type} className={`rounded border px-3 py-2 text-sm ${selected?.id === topic.id && selected.type === topic.type ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary"}`}>{topic.title}</button>)}</div></section>
    {!selected && <p className="rounded border border-dashed border-border p-8 text-center text-muted-foreground">{hasRequestedTopic ? "This public topic is unavailable." : "Select a topic to load its one-hop public connections."}</p>}
    {selected && loading && <div className="flex h-32 items-center justify-center rounded border border-border"><Loader2 className="h-6 w-6 animate-spin text-primary" aria-label="Loading graph" /></div>}
    {selected && error && <div className="rounded border border-dashed border-destructive/50 p-8 text-center"><p className="text-sm text-muted-foreground">Graph data is temporarily unavailable.</p><button type="button" onClick={() => setRetry((value) => value + 1)} className="mt-3 text-sm font-semibold text-primary underline">Retry</button></div>}
    {selected && data && !loading && !error && <>
      <div ref={graphRef} className="h-[520px] min-h-[360px] overflow-hidden rounded-xl border border-primary/20 bg-[#02040a]" aria-label="Interactive public relationship graph"><ForceGraph2D graphData={{ nodes: data.nodes.map((node) => ({ id: `${node.type}:${node.id}`, name: node.title, group: node.type })), links: data.edges.map((edge) => ({ source: edge.source, target: edge.target })) }} width={size.width} height={size.height} nodeLabel="name" nodeColor={() => "#c99a45"} linkColor={() => "rgba(201,154,69,0.35)"} linkWidth={1.5} backgroundColor="#02040a" cooldownTicks={60} /></div>
      <section aria-label="Text equivalent of graph relationships" className="rounded-lg border border-border/60 bg-card/40 p-5"><div className="flex items-center justify-between gap-3"><h2 className="text-lg font-semibold">Relationships</h2>{data.truncated && <span className="text-xs text-muted-foreground">Showing a capped result</span>}</div>{data.edges.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">No reviewed public relationships are available for this topic.</p> : <ul className="mt-4 space-y-3">{data.edges.map((edge) => { const source = data.nodes.find((node) => `${node.type}:${node.id}` === edge.source); const target = data.nodes.find((node) => `${node.type}:${node.id}` === edge.target); return <li key={edge.id} className="text-sm"><Link href={hrefFor(source ?? data.seed)} className="text-primary hover:underline">{source?.title ?? edge.source}</Link><span className="mx-2 text-muted-foreground">{edge.predicate}</span><Link href={hrefFor(target ?? data.seed)} className="text-primary hover:underline">{target?.title ?? edge.target}</Link>{edge.validFrom || edge.validTo ? <span className="ml-2 text-xs text-muted-foreground">({edge.validFrom ?? "?"}–{edge.validTo ?? "?"})</span> : null}</li>; })}</ul>}</section>
    </>}
  </div>;
}
