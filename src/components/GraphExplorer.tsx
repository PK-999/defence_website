"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Dynamically import ForceGraph to prevent SSR issues with canvas
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center w-full h-[600px] bg-background/50 border border-primary/10 rounded-lg"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
});

type Node = {
  id: string;
  name: string;
  group: string;
  val: number;
};

type Link = {
  source: string;
  target: string;
};

type GraphData = {
  nodes: Node[];
  links: Link[];
};

export function GraphExplorer() {
  const [data, setData] = useState<GraphData | null>(null);
  const fgRef = useRef<any>();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/graph")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      })
      .catch((err) => console.error("Error fetching graph data:", err));
  }, []);

  const handleNodeClick = useCallback((node: any) => {
    // Navigate based on group
    let path = "";
    if (node.group === "Conflict") path = "/history";
    if (node.group === "Person") path = "/people";
    if (node.group === "Operation") path = "/operations";
    if (node.group === "Equipment") path = "/arsenal";
    
    // Fallback: If we had a slug we'd use it, but we can search for it for now
    // A more robust implementation would pass slugs in the API. 
    // Wait, I did pass `slug` in the API for nodes! Let's just use it if available.
    if (node.slug && path) {
      router.push(`${path}/${node.slug}`);
    } else {
      router.push(`/search?q=${encodeURIComponent(node.name)}`);
    }
  }, [router]);

  if (!data) return <div className="flex items-center justify-center w-full h-[600px]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="w-full h-[80vh] min-h-[600px] border border-primary/20 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,255,65,0.1)] relative bg-background">
      <div className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur-sm p-4 border border-primary/20 rounded-lg">
        <h3 className="font-heading text-lg font-bold text-primary tracking-widest uppercase mb-2">Network Graph</h3>
        <div className="flex flex-col gap-2 text-xs font-mono">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#00ff41" }}></div> Conflict</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#008f11" }}></div> Operation</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#64748b" }}></div> Person</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#94a3b8" }}></div> Equipment</div>
        </div>
      </div>
      <ForceGraph2D
        ref={fgRef}
        graphData={data}
        nodeLabel="name"
        nodeColor={(node: any) => {
          switch (node.group) {
            case "Conflict": return "#00ff41";
            case "Operation": return "#008f11";
            case "Person": return "#64748b";
            case "Equipment": return "#94a3b8";
            default: return "#ffffff";
          }
        }}
        linkColor={() => "rgba(0, 255, 65, 0.2)"}
        nodeRelSize={4}
        linkWidth={1.5}
        onNodeClick={handleNodeClick}
        backgroundColor="#02040a"
        d3VelocityDecay={0.3} // Keep it moving a bit
      />
    </div>
  );
}
