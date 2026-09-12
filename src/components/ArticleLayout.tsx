import type { ReactNode } from "react";
import { ArticleBody } from "./ArticleBody";
import { OnThisPage } from "./OnThisPage";
import { FactList, type FactRow } from "./FactList";
import { PageHeader, PageShell } from "./PageShell";
export function ArticleLayout({ title, summary, content, facts = [], sections = [], children }: { title: string; summary?: string | null; content?: string | null; facts?: FactRow[]; sections?: Array<{ id: string; label: string }>; children?: ReactNode }) { return <PageShell width="reading"><article><PageHeader title={title} description={summary || undefined} />{facts.length > 0 && <div className="mb-8"><FactList rows={facts} /></div>}<div className="mb-8"><OnThisPage items={sections} /></div><div className="mt-8"><ArticleBody content={content} />{children}</div></article></PageShell>; }
