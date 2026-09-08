import type { PublicEvidence } from "@/lib/domain/types";

export function EvidenceLink({ evidence }: { evidence: PublicEvidence }) {
  return <a href={evidence.sourceHref} className="inline-flex max-w-full items-center gap-1 rounded border border-border/70 px-2 py-1 text-[11px] text-muted-foreground hover:border-primary hover:text-primary" title={`${evidence.sourceTitle} · ${evidence.locator}`}><span className="truncate">{evidence.sourceTitle}</span><span aria-hidden="true">·</span><span>{evidence.locator}</span></a>;
}
