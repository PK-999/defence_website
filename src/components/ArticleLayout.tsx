import type { ReactNode } from "react";
import { ArticleBody } from "./ArticleBody";
import { OnThisPage } from "./OnThisPage";
import { FactList, type FactRow } from "./FactList";
export function ArticleLayout({ title, summary, content, facts = [], sections = [], children }: { title: string; summary?: string | null; content?: string | null; facts?: FactRow[]; sections?: Array<{ id: string; label: string }>; children?: ReactNode }) { return <article className="mx-auto max-w-4xl px-4 py-10"><header><h1 className="text-4xl font-bold tracking-tight">{title}</h1>{summary && <p className="mt-4 max-w-3xl text-xl text-muted-foreground">{summary}</p>}</header>{facts.length > 0 && <div className="mt-8"><FactList rows={facts} /></div>}<div className="mt-8"><OnThisPage items={sections} /></div><div className="mt-10"><ArticleBody content={content} />{children}</div></article>; }
