import * as React from "react";
import Link from "next/link";
import { ArrowRight, Link as LinkIcon } from "lucide-react";
import { Badge } from "./ui/badge";

export type ConnectionNode = {
  id: string;
  type: 'conflict' | 'person' | 'operation' | 'equipment' | 'unit' | 'source';
  title: string;
  slug: string;
};

export type ConnectionExplorerProps = {
  centerNode: ConnectionNode;
  connections: ConnectionNode[];
};

export function ConnectionExplorer({ centerNode, connections }: ConnectionExplorerProps) {
  const grouped = connections.reduce((acc, curr) => {
    if (!acc[curr.type]) acc[curr.type] = [];
    acc[curr.type].push(curr);
    return acc;
  }, {} as Record<string, ConnectionNode[]>);

  const getHref = (type: string, slug: string) => {
    const map: Record<string, string> = {
      conflict: '/history',
      person: '/people',
      operation: '/operations',
      equipment: '/arsenal',
      unit: '/forces',
      source: '/archive'
    };
    return `${map[type] || '/'}/${slug}`;
  };

  return (
    <div className="w-full bg-card border border-border/40 rounded-lg p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background opacity-50 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-8">
          <LinkIcon className="w-4 h-4 text-primary" />
          <h3 className="text-lg font-bold tracking-widest uppercase">Connection Explorer</h3>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          {/* Center Node */}
          <div className="p-6 border-2 border-primary/50 bg-background rounded-lg text-center shadow-[0_0_20px_rgba(201,154,69,0.1)] w-64">
            <Badge className="mb-2 uppercase tracking-wider">{centerNode.type}</Badge>
            <h4 className="text-xl font-bold tracking-wider">{centerNode.title}</h4>
          </div>

          <ArrowRight className="hidden md:block w-8 h-8 text-muted-foreground/30 flex-shrink-0" />

          {/* Connected Nodes */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
            {Object.entries(grouped).map(([type, nodes]) => (
              <div key={type} className="space-y-3">
                <h5 className="text-xs font-bold tracking-widest text-muted-foreground uppercase border-b border-border/40 pb-2">
                  {type} ({nodes.length})
                </h5>
                <div className="space-y-2">
                  {nodes.map(node => (
                    <Link 
                      key={node.id} 
                      href={getHref(node.type, node.slug)}
                      className="block p-3 border border-border/40 rounded bg-muted/20 hover:border-primary/50 hover:bg-primary/5 transition-colors group"
                    >
                      <span className="text-sm font-semibold tracking-wider group-hover:text-primary transition-colors">
                        {node.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            
            {Object.keys(grouped).length === 0 && (
              <div className="col-span-full text-center p-8 text-muted-foreground text-sm">
                No connections found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
