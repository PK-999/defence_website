import type { ReactNode } from "react";
import { PageHeader, PageShell } from "./PageShell";

interface EditorialPageProps {
  title: string;
  intro?: string;
  children: ReactNode;
}

export function EditorialPage({ title, intro, children }: EditorialPageProps) {
  return (
    <PageShell width="reading">
      <PageHeader title={title} description={intro} />
      <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">
        {children}
      </div>
    </PageShell>
  );
}
