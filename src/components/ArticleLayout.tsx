import type { ReactNode } from "react";
import { ArticleBody } from "./ArticleBody";
import { FactList, type FactRow } from "./FactList";
import { PageHeader, PageShell } from "./PageShell";

export function ArticleLayout({
  title,
  summary,
  content,
  width = "wide",
  facts = [],
  sections = [],
  children,
}: {
  title: string;
  summary?: string | null;
  content?: string | null;
  width?: "standard" | "wide" | "reading";
  facts?: FactRow[];
  sections?: Array<{ id: string; label: string }>;
  children?: ReactNode;
}) {
  return (
    <PageShell width={width}>
      <article>
        <PageHeader title={title} description={summary || undefined} />
        {facts.length > 0 && (
          <div className="mb-8">
            <FactList rows={facts} />
          </div>
        )}
        {sections.length > 0 && (
          <nav aria-label="On this page" className="mb-8 rounded-lg border border-border/60 bg-muted/20 p-4">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Sections</p>
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-primary hover:underline">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
        <div className="mt-8">
          <ArticleBody content={content} />
          {children}
        </div>
      </article>
    </PageShell>
  );
}
