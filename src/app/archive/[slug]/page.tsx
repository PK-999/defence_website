import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { SourceEvidenceList } from "@/components/ProvenanceViewer";
import { getPublicSourceBySlug } from "@/lib/repositories/sources";
import { PageHeader, PageShell } from "@/components/PageShell";
import type { Metadata } from "next";
import { publicMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const source = await getPublicSourceBySlug(slug);
  if (!source) notFound();
  return publicMetadata({ title: source.title, description: source.summary, pathname: `/archive/${encodeURIComponent(source.slug)}` });
}

export default async function SourcePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const source = await getPublicSourceBySlug(slug);
  if (!source) notFound();

  return (
    <PageShell width="wide">
      <PageHeader eyebrow={source.sourceType.replace(/-/g, " ").toUpperCase()} title={source.title} description={source.summary || undefined} actions={<div className="flex shrink-0 flex-wrap gap-2">{source.canonicalUrl && <a href={source.canonicalUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded border border-primary/50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary hover:bg-primary hover:text-primary-foreground">View original <ExternalLink className="h-3 w-3" aria-hidden="true" /></a>}<Link href="/archive" className="rounded border border-border px-4 py-2 text-center text-xs font-semibold text-muted-foreground hover:text-foreground">Back to sources</Link></div>} />
      <p className="-mt-4 mb-8 text-sm text-muted-foreground">Published by <span className="text-foreground">{source.publisher}</span>{source.publicationDate ? ` · ${source.publicationDate}` : ""}{source.author ? ` · ${source.author}` : ""}</p>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(240px,1fr)]">
        <div className="space-y-10">
          <section><h2 className="border-l-2 border-primary pl-4 text-xl font-bold uppercase tracking-wider">Summary</h2><p className="mt-4 leading-7 text-muted-foreground">{source.summary || "Not documented"}</p></section>
          <section><h2 className="border-l-2 border-primary pl-4 text-xl font-bold uppercase tracking-wider">Public evidence</h2><p className="mb-5 mt-3 text-sm text-muted-foreground">Every displayed locator belongs to a reviewed source version. Quotes appear only when their rights permit display.</p><SourceEvidenceList versions={source.versions} /></section>
        </div>
        <aside className="space-y-8">
          <section><h2 className="text-sm font-bold uppercase tracking-wider text-primary">Source versions</h2><ul className="mt-3 space-y-2 text-sm text-muted-foreground">{source.versions.map((version) => <li key={version.id} className="rounded border border-border/60 p-3"><span className="font-medium text-foreground">{version.versionTag}</span>{version.accessedAt && <span className="mt-1 block text-xs">Accessed {version.accessedAt.slice(0, 10)}</span>}</li>)}</ul></section>
          <section><h2 className="text-sm font-bold uppercase tracking-wider text-primary">Linked public records</h2>{source.linkedEntities.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">No public records are linked to this source yet.</p> : <ul className="mt-3 space-y-2">{source.linkedEntities.map((entity) => <li key={`${entity.type}:${entity.id}`}><Link href={entity.href} className="text-sm text-foreground hover:text-primary hover:underline">{entity.title}<span className="ml-2 text-xs text-muted-foreground">{entity.type}</span></Link></li>)}</ul>}</section>
          {source.rightsNotes && <section><h2 className="text-sm font-bold uppercase tracking-wider text-primary">Rights and display</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{source.rightsNotes}</p></section>}
          <section className="rounded border border-border/60 bg-card/40 p-4"><h2 className="text-sm font-bold">Found an issue?</h2><p className="mt-2 text-xs leading-5 text-muted-foreground">Copy page ID <code className="text-foreground">{source.id}</code> and send the correction through the configured editorial contact.</p></section>
        </aside>
      </div>
    </PageShell>
  );
}
