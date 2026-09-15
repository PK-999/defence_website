import type { HistoryDossier } from "@/lib/history-dossiers";
import { formatDisplayDate } from "@/lib/domain/dates";

function Citations({ indexes, sourceCount }: { indexes?: number[]; sourceCount: number }) {
  const citations = indexes?.length ? indexes : Array.from({ length: sourceCount }, (_, index) => index + 1);
  if (citations.length === 0) return null;
  return <span className="ml-1 whitespace-nowrap text-xs font-medium text-primary" aria-label={`Sources ${citations.join(", ")}`}>
    {citations.map((index) => <a key={index} href={`#research-source-${index}`} className="ml-1 underline decoration-primary/50 hover:decoration-primary">[{index}]</a>)}
  </span>;
}

export function ResearchDossier({ dossier, hideOverview = false }: { dossier: HistoryDossier; hideOverview?: boolean }) {
  const researchParagraphs = dossier.researchParagraphs?.length ? dossier.researchParagraphs : [dossier.overview];
  return <section data-testid="research-dossier" className="space-y-8">
    <div>
      <h2 className="mb-4 border-l-2 border-primary pl-4 text-xl font-bold uppercase tracking-wider">Research dossier</h2>
      {!hideOverview && <div className="space-y-4 text-base leading-7 text-muted-foreground">{researchParagraphs.map((paragraph, index) => <p key={`${paragraph.slice(0, 24)}-${index}`}>{paragraph}{index === 0 && <Citations indexes={dossier.overviewSources} sourceCount={dossier.sources.length} />}</p>)}</div>}
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      {dossier.keyPoints.map((point) => <article key={point.title} className="rounded-lg border border-border/50 bg-card/60 p-5">
        <h3 className="font-semibold text-foreground">{point.title}</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{point.body}<Citations indexes={point.sourceIndexes} sourceCount={dossier.sources.length} /></p>
      </article>)}
    </div>
    <div>
      <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">Sources and references</h3>
      <ol className="mt-4 space-y-3">
        {dossier.sources.map((source, index) => <li id={`research-source-${index + 1}`} key={source.url} className="scroll-mt-24"><a href={source.url} target="_blank" rel="noreferrer" className="grid grid-cols-[auto_1fr] gap-3 rounded border border-border/50 p-4 hover:border-primary"><span className="font-mono text-xs text-primary">[{index + 1}]</span><span><span className="block font-medium text-foreground">{source.label}</span><span className="mt-1 block text-xs leading-5 text-muted-foreground">{[source.publisher, source.date ? formatDisplayDate(source.date) : null, source.note].filter(Boolean).join(" · ")}</span></span></a></li>)}
      </ol>
    </div>
  </section>;
}
