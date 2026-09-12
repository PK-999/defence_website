"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Link as LinkIcon, Database } from "lucide-react";
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

const displayType: Record<ConnectionNode["type"], string> = {
  conflict: "Conflicts",
  person: "Heroes",
  operation: "Operations",
  equipment: "Arsenal",
  unit: "Forces",
  source: "Sources",
};

export function ConnectionExplorer({ centerNode, connections }: ConnectionExplorerProps) {
  const grouped = connections.reduce((acc, curr) => {
    if (!acc[curr.type]) acc[curr.type] = [];
    acc[curr.type].push(curr);
    return acc;
  }, {} as Record<string, ConnectionNode[]>);

  const availableTypes = Object.keys(grouped);
  const [activeTab, setActiveTab] = React.useState<string>(availableTypes.length > 0 ? availableTypes[0] : "");

  const getHref = (type: string, slug: string) => {
    const map: Record<string, string> = {
      conflict: '/conflicts',
      person: '/heroes',
      operation: '/operations',
      equipment: '/arsenal',
      unit: '/forces',
      source: '/archive'
    };
    return `${map[type] || '/'}/${slug}`;
  };

  return (
    <div className="w-full bg-card border border-border/40 rounded-lg p-8 md:p-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background opacity-50 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-12">
        {/* Left Side: Center Node */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center space-y-6">
          <div className="flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold tracking-widest uppercase text-muted-foreground">Connected Node</h3>
          </div>
          <div className="p-8 border border-primary/50 bg-background rounded-lg text-center shadow-[0_0_30px_rgba(201,154,69,0.15)] w-full max-w-[18rem]">
            <Badge className="mb-4 uppercase tracking-wider">{displayType[centerNode.type]}</Badge>
            <h4 className="text-2xl font-bold tracking-wider">{centerNode.title}</h4>
          </div>
        </div>

        <ArrowRight className="hidden md:block w-10 h-10 text-muted-foreground/30 flex-shrink-0" />
        <ArrowRight className="md:hidden w-10 h-10 text-muted-foreground/30 rotate-90 self-center" />

        {/* Right Side: Tabbed Connections */}
        <div className="flex-1 w-full min-w-0">
          {availableTypes.length > 0 ? (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2 border-b border-border/40 pb-4">
                {availableTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setActiveTab(type)}
                    className={`px-4 py-2 rounded-md text-sm font-bold tracking-widest uppercase transition-all ${
                      activeTab === type
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    {displayType[type as ConnectionNode["type"]] ?? type} ({grouped[type].length})
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {grouped[activeTab]?.map(node => (
                  <Link
                    key={node.id}
                    href={getHref(node.type, node.slug)}
                    className="flex items-center p-4 border border-border/40 rounded-lg bg-background/50 hover:border-primary/50 hover:bg-primary/5 transition-all group shadow-sm hover:shadow-md"
                  >
                    <span className="text-sm font-semibold tracking-wider group-hover:text-primary transition-colors line-clamp-2">
                      {node.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-muted-foreground bg-muted/10 rounded-lg border border-dashed border-border/40">
              <Database className="w-8 h-8 mb-4 opacity-50" />
              <p className="text-sm uppercase tracking-widest font-semibold">No direct connections found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
