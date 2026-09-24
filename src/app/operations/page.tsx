import Link from "next/link";
import { PageHeader, PageShell } from "@/components/PageShell";
import { CollectionToolbar } from "@/components/CollectionToolbar";
import { Pagination } from "@/components/Pagination";
import { parseCollectionQuery } from "@/lib/domain/query";
import { listPublicEntities } from "@/lib/repositories/collections";
import { prisma } from "@/lib/db";
import { HUDFrame } from "@/components/HUDFrame";
import { Crosshair, ArrowRight, Calendar, Tag } from "lucide-react";

export const revalidate = 3600;

export default async function OperationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const query = { ...parseCollectionQuery(raw), sort: "date" as const };
  const result = await listPublicEntities("Operation", query, prisma);
  const params = new URLSearchParams(
    Object.entries(raw).flatMap(([key, value]) =>
      value ? [[key, Array.isArray(value) ? value[0] : value]] : []
    )
  );

  // Dynamically extract distinct operational years and categories from database
  const allOperations = await prisma.operation.findMany({
    select: { dateStart: true, category: true },
  });

  const yearSet = new Set<string>();
  const categorySet = new Set<string>([
    "combat",
    "evacuation",
    "humanitarian",
    "maritime-security",
    "rescue",
    "battle",
  ]);

  for (const op of allOperations) {
    if (op.dateStart) {
      const match = op.dateStart.match(/(\d{4})/);
      if (match) yearSet.add(match[1]);
    }
    if (op.category) {
      categorySet.add(op.category.toLowerCase().replace(/\s+/g, "-"));
    }
  }

  const years = [...yearSet].sort((a, b) => b.localeCompare(a));
  const categories = [...categorySet].sort();

  return (
    <PageShell>
      <PageHeader
        eyebrow="FIELD DIRECTIVES · TACTICAL ENGAGEMENTS"
        title="Military Operations"
        description="Catalog of combat, rescue, evacuation, peacekeeping, and joint operations carried out by the Indian Armed Forces."
        actions={
          <div className="w-full max-w-2xl">
            <CollectionToolbar
              fields={[
                { key: "category", label: "Category", options: categories },
                { key: "year", label: "Year / period", options: years },
              ]}
            />
          </div>
        }
      />

      <div className="mb-6 flex items-center justify-between text-xs font-mono text-muted-foreground border-b border-primary/20 pb-2">
        <span>FIELD MISSIONS: {result.total} LOGGED OPERATIONS</span>
        <span className="text-primary">SHOWING {result.items.length} ACTIVE DIRECTIVES</span>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {result.items.map((op) => {
          const startDate = op.facts.find((f) => f.label === "Start")?.value ?? "Date classified";
          const category = op.facts.find((f) => f.label === "Category")?.value ?? "Operation";
          return (
            <Link key={op.id} href={op.href} className="block group">
              <HUDFrame
                variant="default"
                classification={category.toUpperCase()}
                label={startDate}
                scanline
                className="h-full"
              >
                <div className="p-5 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-primary uppercase mb-2">
                      <Tag className="w-3 h-3" />
                      <span>{category}</span>
                    </div>

                    <h2 className="text-lg font-display font-bold uppercase tracking-tight text-foreground group-hover:text-primary transition-colors">
                      {op.title}
                    </h2>

                    <p className="mt-2.5 text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {op.summary}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-mono text-primary">
                    <span className="flex items-center gap-1">
                      <Crosshair className="w-3.5 h-3.5" /> OPEN MISSION DOSSIER
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </HUDFrame>
            </Link>
          );
        })}
      </div>

      {result.items.length === 0 && (
        <p className="mt-8 rounded-lg border border-dashed p-8 text-center text-muted-foreground font-mono">
          No operations match the selected category or period filter.
        </p>
      )}

      <div className="mt-10">
        <Pagination page={result.page} pageCount={result.pageCount} params={params} />
      </div>
    </PageShell>
  );
}
