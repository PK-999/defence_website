import type { PublicEvidence } from "@/lib/domain/types";
import { EvidenceLink } from "@/components/EvidenceLink";

export type FactRow = { label: string; value: string; href?: string; asOf?: string; evidence?: PublicEvidence[] };

export function FactList({ rows }: { rows: FactRow[] }) {
  return <dl className="grid gap-4 border-y border-border py-6 sm:grid-cols-2">{rows.map((row) => <div key={row.label}>
    <dt className="text-xs uppercase tracking-wider text-muted-foreground">{row.label}</dt>
    <dd className="mt-1">{row.href ? <a href={row.href} className="text-primary hover:underline">{row.value}</a> : row.value}{row.asOf && <span className="ml-2 text-xs text-muted-foreground">as of {row.asOf}</span>}</dd>
    {row.evidence && row.evidence.length > 0 && <div className="mt-2 flex flex-wrap gap-2">{row.evidence.map((evidence) => <EvidenceLink key={evidence.id} evidence={evidence} />)}</div>}
  </div>)}</dl>;
}
