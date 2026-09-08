import type { ReactNode } from "react";

export function EditorialPage({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return <article className="mx-auto max-w-3xl py-8"><p className="text-xs uppercase tracking-[0.2em] text-primary">Sentinel editorial guide</p><h1 className="mt-3 text-4xl font-bold tracking-tight">{title}</h1><p className="mt-4 text-lg text-muted-foreground">{intro}</p><div className="mt-10 space-y-8 leading-7 text-foreground/90">{children}</div></article>;
}
