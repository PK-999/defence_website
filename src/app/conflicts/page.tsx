import Link from "next/link";
import { PageHeader, PageShell } from "@/components/PageShell";
import { CollectionToolbar } from "@/components/CollectionToolbar";
import { Pagination } from "@/components/Pagination";
import { parseCollectionQuery } from "@/lib/domain/query";
import { listPublicEntities } from "@/lib/repositories/collections";
import { prisma } from "@/lib/db";
import { HUDFrame } from "@/components/HUDFrame";
import { Shield, ArrowRight, Calendar, MapPin } from "lucide-react";

export const revalidate = 3600;

export default async function ConflictsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const result = await listPublicEntities("Conflict", { ...parseCollectionQuery(raw), sort: "date" }, prisma);
  const params = new URLSearchParams(
    Object.entries(raw).flatMap(([key, value]) =>
      value ? [[key, Array.isArray(value) ? value[0] : value]] : []
    )
  );
  const years = ["1947", "1948", "1961", "1962", "1965", "1971", "1984", "1999"];

  return (
    <PageShell>
      <PageHeader
        eyebrow="MILITARY CAMPAIGNS · THEATRES OF WAR"
        title="Armed Conflicts"
        description="Official operational timelines, boundary engagements, strategic declassified summaries, and theatre histories of modern Indian military conflicts."
        actions={
          <div className="w-full max-w-2xl">
            <CollectionToolbar fields={[{ key: "year", label: "Year / period", options: years }]} />
          </div>
        }
      />

      <div className="mb-6 flex items-center justify-between text-xs font-mono text-muted-foreground border-b border-primary/20 pb-2">
        <span>THEATRE RECORDS: {result.total} MAJOR ENGAGEMENTS</span>
        <span className="text-primary">ORDER: CHRONOLOGICAL SEQUENCE</span>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {result.items.map((conflict, index) => {
          const startDate = conflict.facts.find((fact) => fact.label === "Start")?.value ?? "Classified";
          return (
            <Link key={conflict.id} href={conflict.href} className="block group">
              <HUDFrame
                variant={index % 2 === 0 ? "danger" : "default"}
                classification="CAMPAIGN FILE"
                label={`CODE: CF-${1947 + index * 8}`}
                scanline
                className="h-full"
              >
                <div className="p-6 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-primary mb-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{startDate}</span>
                    </div>

                    <h2 className="text-xl font-display font-bold uppercase tracking-tight text-foreground group-hover:text-primary transition-colors">
                      {conflict.title}
                    </h2>

                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {conflict.summary}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-xs font-mono text-primary">
                    <span className="flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5" /> OPEN DECLASSIFIED DOSSIER
                    </span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </HUDFrame>
            </Link>
          );
        })}
      </div>

      {result.items.length === 0 && (
        <p className="mt-8 rounded-lg border border-dashed p-8 text-center text-muted-foreground font-mono">
          No conflict files match the specified temporal filter.
        </p>
      )}

      <div className="mt-10">
        <Pagination page={result.page} pageCount={result.pageCount} params={params} />
      </div>
    </PageShell>
  );
}
