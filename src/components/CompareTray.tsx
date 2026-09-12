"use client";

import * as React from "react";
import Link from "next/link";
import { buildComparisonHref, normalizeComparisonSlugs } from "@/lib/domain/compare";

type Option = { slug: string; title: string };
export function CompareTray({ options, initialSlugs = [] }: { options: Option[]; initialSlugs?: string[] }) {
  const [selected, setSelected] = React.useState(() => normalizeComparisonSlugs(initialSlugs));
  const toggle = (slug: string) => setSelected((current) => current.includes(slug) ? current.filter((item) => item !== slug) : normalizeComparisonSlugs([...current, slug]));
  return <section aria-label="Arsenal comparison" className="rounded-lg border border-primary/30 bg-primary/[0.05] p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold">Compare arsenal</h2><p className="text-xs text-muted-foreground">Choose up to three public systems. Values stay side by side without an overall winner.</p></div><span className="text-xs text-muted-foreground">{selected.length}/3 selected</span></div><div className="mt-3 flex flex-wrap gap-2">{options.map((option) => <button type="button" key={option.slug} aria-pressed={selected.includes(option.slug)} onClick={() => toggle(option.slug)} className={`rounded border px-3 py-2 text-sm ${selected.includes(option.slug) ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary"}`}>{selected.includes(option.slug) ? "Remove " : "Add "}{option.title}</button>)}</div><div className="mt-4 flex flex-wrap gap-3">{selected.length > 0 && <Link href={buildComparisonHref(selected)} className="rounded bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Compare selected</Link>}{selected.length > 0 && <button type="button" onClick={() => setSelected([])} className="rounded border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Clear</button>}</div></section>;
}
