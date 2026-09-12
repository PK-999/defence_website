import type { ReactNode } from "react";
import { PageShell, PageHeader } from "@/components/PageShell";

export function EditorialPage({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return <PageShell width="reading"><article><PageHeader eyebrow="SENTINEL EDITORIAL GUIDE" title={title} description={intro} /><div className="space-y-8 leading-7 text-foreground/90">{children}</div></article></PageShell>;
}
