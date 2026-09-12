import Link from "next/link";
import { PageHeader, PageShell } from "@/components/PageShell";
import { getResearchLedger, recordsFor, searchableText, type ResearchRecord } from "@/lib/research-ledger";

export const metadata = { title: "Intel Ledger | SENTINEL", description: "A searchable ledger of collected Indian defence research records and their evidence status." };

const pageSize = 30;
const sections = [
  ["awardObservations", "Award signals"],
  ["historicalAwardRoster", "Award roster"],
  ["officialAwardAnnouncements", "Official announcements"],
  ["pvcRecipientProfiles", "PVC dossiers"],
  ["biographicalFacts", "Biography files"],
  ["citationBriefs", "Citation briefs"],
  ["equipmentDiscovery", "Arsenal leads"],
  ["equipmentPrimaryFacts", "Arsenal facts"],
  ["conflictOperationDiscovery", "Conflict and operation leads"],
  ["operationPrimaryFacts", "Operation records"],
  ["personConflictLinks", "Personnel links"],
  ["equipmentOperationLinks", "Arsenal links"],
  ["sources", "Source registry"],
  ["evidenceIssues", "Evidence issues"],
] as const;

function labelFor(record: ResearchRecord): string {
  for (const key of ["name", "entity", "title", "operation", "event", "equipment", "medal", "id"]) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return "Unlabelled research record";
}

function statusFor(record: ResearchRecord): string {
  for (const key of ["publicationStatus", "verification", "biographyStatus", "status"]) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return "research_only";
}

function compactFields(record: ResearchRecord): Array<[string, string]> {
  return Object.entries(record).filter(([key, value]) => key !== "id" && typeof value !== "object" && value !== null && String(value).trim()).slice(0, 4).map(([key, value]) => [key, String(value)]);
}

function RecordCard({ record }: { record: ResearchRecord }) {
  return <article className="rounded-xl border border-border/70 bg-card/50 p-5">
    <div className="flex items-start justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">{statusFor(record)}</p><h2 className="mt-2 text-lg font-semibold">{labelFor(record)}</h2></div><span className="font-mono text-[10px] text-muted-foreground">{typeof record.id === "string" ? record.id : "record"}</span></div>
    <dl className="mt-4 grid gap-2 text-xs sm:grid-cols-2">{compactFields(record).map(([key, value]) => <div key={key}><dt className="uppercase tracking-wider text-muted-foreground">{key}</dt><dd className="mt-0.5 line-clamp-2 text-foreground">{value}</dd></div>)}</dl>
    <details className="mt-4 border-t border-border/50 pt-3"><summary className="cursor-pointer text-xs font-semibold uppercase tracking-wider text-primary">Open record payload</summary><pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap break-words rounded bg-background/80 p-3 text-[11px] leading-5 text-muted-foreground">{JSON.stringify(record, null, 2)}</pre></details>
  </article>;
}

export default async function IntelPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const ledger = await getResearchLedger();
  const section = typeof query.section === "string" && sections.some(([key]) => key === query.section) ? query.section : sections[0][0];
  const q = typeof query.q === "string" ? query.q.trim().toLowerCase() : "";
  const page = Math.max(1, Number.parseInt(typeof query.page === "string" ? query.page : "1", 10) || 1);
  const all = recordsFor(ledger, section);
  const filtered = q ? all.filter((record) => searchableText(record).includes(q)) : all;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const records = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const counts = Object.fromEntries(sections.map(([key]) => [key, recordsFor(ledger, key).length]));
  const href = (next: { section?: string; q?: string; page?: number }) => { const params = new URLSearchParams(); params.set("section", next.section ?? section); if (next.q ?? q) params.set("q", next.q ?? q); if ((next.page ?? 1) > 1) params.set("page", String(next.page)); return `/intel?${params.toString()}`; };

  return <PageShell width="wide"><PageHeader eyebrow="SENTINEL · INTEL LEDGER" title="The research room" description="A searchable field ledger for every collected war, operation, award, hero, arsenal lead, relationship, and source. Records marked research-only are leads for review, not official confirmation." actions={<div className="flex flex-wrap gap-3 text-xs"><span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-primary">{Object.values(counts).reduce((sum, value) => sum + value, 0).toLocaleString()} collected records</span><Link href="/research/ledger.json" className="rounded-full border border-border px-3 py-1 hover:border-primary hover:text-primary">Download ledger JSON</Link></div>} />
    <div className="grid gap-8 lg:grid-cols-[250px_1fr]"><aside><h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Channels</h2><nav aria-label="Intel ledger sections" className="mt-3 grid gap-1">{sections.map(([key, label]) => <Link key={key} href={href({ section: key, page: 1 })} aria-current={section === key ? "page" : undefined} className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${section === key ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}><span>{label}</span><span className="font-mono text-[10px]">{Number(counts[key]).toLocaleString()}</span></Link>)}</nav></aside><section><form className="flex gap-2" action="/intel" method="get"><input type="hidden" name="section" value={section} /><label className="sr-only" htmlFor="intel-query">Search the intel ledger</label><input id="intel-query" name="q" defaultValue={q} placeholder="Search names, medals, operations, arsenal systems, or sources" className="min-w-0 flex-1 rounded-lg border border-border bg-card px-4 py-3 text-sm" /><button className="rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground" type="submit">Search</button></form><div className="mt-5 flex items-center justify-between gap-3"><h2 className="text-xl font-semibold">{sections.find(([key]) => key === section)?.[1]}</h2><p className="font-mono text-xs text-muted-foreground">{filtered.length.toLocaleString()} hits · page {currentPage}/{totalPages}</p></div><div className="mt-4 grid gap-4">{records.length ? records.map((record, index) => <RecordCard key={`${typeof record.id === "string" ? record.id : "record"}-${index}`} record={record} />) : <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">No records match this query.</p>}</div><nav aria-label="Intel ledger pagination" className="mt-6 flex items-center justify-between border-t border-border pt-4 text-sm"><span className="text-muted-foreground">{filtered.length.toLocaleString()} records</span><div className="flex gap-2">{currentPage > 1 && <Link href={href({ page: currentPage - 1 })} className="rounded border border-border px-3 py-2 hover:border-primary">Previous</Link>}{currentPage < totalPages && <Link href={href({ page: currentPage + 1 })} className="rounded border border-border px-3 py-2 hover:border-primary">Next</Link>}</div></nav></section></div></PageShell>;
}
