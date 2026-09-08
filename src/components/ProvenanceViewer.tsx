"use client";

import React, { useState } from 'react';
import { ShieldCheck, BookOpen, ExternalLink, ChevronDown, ChevronRight } from 'lucide-react';
import type { PublicClaim } from '@/lib/domain/types';

export function ProvenanceViewer({ claims }: { claims: PublicClaim[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const visibleClaims = claims ?? [];
  if (visibleClaims.length === 0) return null;

  return (
    <section className="mt-16 border-t border-border/40 pt-12">
      <h2 className="text-xl font-bold tracking-wider mb-6 border-l-2 border-primary pl-4 uppercase flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-primary" />
        Source-linked claims
      </h2>
      <p className="text-muted-foreground text-sm mb-6 max-w-2xl">
        These claims are shown only when they are not marked as candidate or rejected. Publication review and source authority are tracked separately.
      </p>

      <div className="space-y-4">
        {visibleClaims.map((claim) => (
          <div key={claim.id} className="border border-primary/20 rounded-lg overflow-hidden bg-card/30 shadow-lg shadow-primary/5">
            <button type="button" aria-expanded={expandedId === claim.id} aria-controls={`claim-evidence-${claim.id}`} className="w-full p-4 flex items-center justify-between text-left hover:bg-card transition-colors" onClick={() => setExpandedId(expandedId === claim.id ? null : claim.id)}>
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs uppercase tracking-widest text-primary/90 bg-primary/10 px-2 py-1 rounded border border-primary/20">
                  {claim.property}
                </span>
                <span className="font-medium text-foreground">{claim.value}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-400 rounded border border-green-500/20">
                  <ShieldCheck className="w-3 h-3" /> {claim.verificationStatus.replace('_', ' ')}
                </span>
                {expandedId === claim.id ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
              </div>
            </button>
            
            {expandedId === claim.id && (
              <div id={`claim-evidence-${claim.id}`} className="p-4 bg-background/50 border-t border-primary/10 space-y-4">
                {claim.evidence.map((evidence) => (
                    <div key={evidence.id} className="text-sm space-y-3">
                      <div className="flex items-start gap-3">
                        <BookOpen className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="font-medium text-foreground flex items-center gap-2">
                            <a href={evidence.sourceHref} className="text-primary hover:underline">{evidence.sourceTitle}</a> <span className="text-muted-foreground/70 text-xs px-1.5 py-0.5 bg-muted rounded">({evidence.versionTag})</span>
                          </div>
                          <div className="text-muted-foreground text-xs mt-1">
                            Publisher: {evidence.publisher}
                          </div>
                        </div>
                      </div>
                      <div className="pl-7">
                        <div className="font-mono text-[11px] text-primary/70 mb-1 tracking-wider uppercase">Locator: {evidence.locator}</div>
                        {evidence.quote ? (
                          <div className="italic border-l-2 border-primary/30 pl-3 text-foreground/80 py-1 bg-primary/5 rounded-r">
                            &quot;{evidence.quote}&quot;
                          </div>
                        ) : <p className="text-xs text-muted-foreground">Quote unavailable for display.</p>}
                      </div>
                      {evidence.originalUrl && (
                        <div className="pl-7 mt-2">
                          <a href={evidence.originalUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline group">
                            View Original Source <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </a>
                        </div>
                      )}
                    </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export function SourceEvidenceList({ versions }: { versions: Array<{ id: string; versionTag: string; evidence: PublicClaim["evidence"] }> }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const evidence = versions.flatMap((version) => version.evidence.map((item) => ({ ...item, versionTag: version.versionTag })));
  if (evidence.length === 0) return <p className="rounded border border-dashed border-border p-5 text-sm text-muted-foreground">No public evidence locators are available for this source.</p>;
  return <div className="space-y-3">{evidence.map((item) => {
    const expanded = expandedId === item.id;
    return <div key={item.id} className="overflow-hidden rounded-lg border border-primary/20 bg-card/30">
      <button type="button" aria-expanded={expanded} aria-controls={`source-evidence-${item.id}`} className="flex w-full items-center justify-between gap-4 p-4 text-left hover:bg-card" onClick={() => setExpandedId(expanded ? null : item.id)}>
        <span><span className="block font-medium">{item.versionTag}</span><span className="mt-1 block font-mono text-xs text-primary/80">Locator: {item.locator}</span></span>
        {expanded ? <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" /> : <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />}
      </button>
      {expanded && <div id={`source-evidence-${item.id}`} className="space-y-3 border-t border-primary/10 bg-background/50 p-4 text-sm">
        <p className="text-muted-foreground">{item.quote ? <span className="italic text-foreground/85">&quot;{item.quote}&quot;</span> : "Quote unavailable for display."}</p>
        <div className="flex flex-wrap gap-3"><a href={item.sourceHref} className="text-xs font-semibold text-primary hover:underline">Open source record</a>{item.originalUrl && <a href={item.originalUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">View original <ExternalLink className="h-3 w-3" aria-hidden="true" /></a>}{item.archiveUrl && <a href={item.archiveUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-primary hover:underline">View archived copy</a>}</div>
      </div>}
    </div>;
  })}</div>;
}
