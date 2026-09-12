import type { ReactNode } from "react";
import { SiteBreadcrumbs } from "@/components/Breadcrumbs";

type PageWidth = "standard" | "wide" | "reading";

const widths: Record<PageWidth, string> = {
  standard: "max-w-6xl",
  wide: "max-w-7xl",
  reading: "max-w-3xl",
};

export function PageShell({ children, width = "standard", className = "", breadcrumbs = true }: { children: ReactNode; width?: PageWidth; className?: string; breadcrumbs?: boolean }) {
  return <div className={`mx-auto w-full ${widths[width]} px-4 py-10 sm:py-12 ${className}`}>{breadcrumbs && <SiteBreadcrumbs />}{children}</div>;
}

export function PageHeader({ title, description, eyebrow, actions }: { title: string; description?: string; eyebrow?: string; actions?: ReactNode }) {
  return <header className="mb-8 border-b border-border/50 pb-6"><div className="flex flex-wrap items-start justify-between gap-4"><div className="min-w-0">{eyebrow && <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.24em] text-primary">{eyebrow}</p>}<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>{description && <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">{description}</p>}</div>{actions}</div></header>;
}
