import Link from "next/link";
import { PageHeader, PageShell } from "@/components/PageShell";
import { CollectionToolbar } from "@/components/CollectionToolbar";
import { Pagination } from "@/components/Pagination";
import { parseCollectionQuery } from "@/lib/domain/query";
import { prisma } from "@/lib/db";
import { formatEquipmentValue } from "@/lib/equipment-presentation";
import { HUDFrame } from "@/components/HUDFrame";
import { Shield, Plane, Crosshair, Anchor, Cpu, ChevronRight, Gauge, Activity } from "lucide-react";
import { parseEquipmentSpecs } from "@/lib/equipment-specs";

export const revalidate = 3600;

function cleanTitle(raw: string): string {
  // If title repeats itself or has excessive duplication, clean it up
  const words = raw.split(/\s+/);
  const seen = new Set<string>();
  const cleaned: string[] = [];
  for (const w of words) {
    const lower = w.toLowerCase();
    if (seen.has(lower) && words.length > 5) {
      continue;
    }
    seen.add(lower);
    cleaned.push(w);
  }
  return cleaned.join(" ");
}

export default async function ArsenalPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const query = parseCollectionQuery(raw);

  const where = {
    domain: query.domain || undefined,
    category: query.category || undefined,
    serviceStatus: query.status || undefined,
    ...(query.q ? { title: { contains: query.q } } : {}),
  };

  const [domains, categories, statuses, total, rows] = await Promise.all([
    prisma.equipment.findMany({
      distinct: ["domain"],
      select: { domain: true },
      orderBy: { domain: "asc" },
    }),
    prisma.equipment.findMany({
      distinct: ["category"],
      select: { category: true },
      orderBy: { category: "asc" },
    }),
    prisma.equipment.findMany({
      distinct: ["serviceStatus"],
      select: { serviceStatus: true },
      orderBy: { serviceStatus: "asc" },
    }),
    prisma.equipment.count({ where }),
    prisma.equipment.findMany({
      where,
      orderBy: [
        { serviceStatus: "asc" },
        { title: "asc" },
      ],
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        domain: true,
        category: true,
        serviceStatus: true,
        originCountries: true,
        inductedYear: true,
        retiredYear: true,
        specs: true,
        variantLabel: true,
      },
    }),
  ]);

  const pageCount = Math.max(1, Math.ceil(total / query.pageSize));

  const params = new URLSearchParams(
    Object.entries(raw).flatMap(([key, value]) =>
      value ? [[key, Array.isArray(value) ? value[0] : value]] : []
    )
  );

  const getServiceBadgeVariant = (domain: string) => {
    switch (domain?.toLowerCase()) {
      case "navy":
        return "cyan";
      case "airforce":
        return "gold";
      case "army":
        return "default";
      default:
        return "danger";
    }
  };

  const getCategoryIcon = (category: string) => {
    const c = category?.toLowerCase() || "";
    if (c.includes("aircraft") || c.includes("fighter") || c.includes("helicopter")) return <Plane className="w-3.5 h-3.5" />;
    if (c.includes("ship") || c.includes("submarine") || c.includes("carrier")) return <Anchor className="w-3.5 h-3.5" />;
    if (c.includes("missile") || c.includes("weapon") || c.includes("artillery")) return <Crosshair className="w-3.5 h-3.5" />;
    return <Shield className="w-3.5 h-3.5" />;
  };

  return (
    <PageShell width="wide">
      <PageHeader
        eyebrow="STRATEGIC DEFENCE INVENTORY"
        title="Arsenal & Weapons Systems"
        description="Comprehensive technical specifications, operational deployments, and archival service records of land, air, and maritime systems across India's armed forces."
      />

      {/* Modern HUD Filter Console with optimal placement */}
      <div className="mb-8">
        <CollectionToolbar
          fields={[
            {
              key: "domain",
              label: "Service Branch",
              options: domains.map((row) => ({
                value: row.domain,
                label: formatEquipmentValue("domain", row.domain),
              })),
            },
            {
              key: "category",
              label: "Platform Class",
              options: categories.map((row) => ({
                value: row.category,
                label: formatEquipmentValue("category", row.category),
              })),
            },
            {
              key: "status",
              label: "Service Status",
              options: statuses.map((row) => ({
                value: row.serviceStatus,
                label: formatEquipmentValue("serviceStatus", row.serviceStatus),
              })),
            },
          ]}
        />
      </div>

      {/* Telemetry Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between text-xs font-mono text-muted-foreground border-b border-primary/20 pb-2">
        <span className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-primary" />
          <span>INVENTORY REGISTRY: {total.toLocaleString("en-IN")} SYSTEMS CATALOGUED</span>
        </span>
        <span className="text-primary font-bold">
          PAGE {query.page} OF {pageCount} ({rows.length} DISPLAYED)
        </span>
      </div>

      {/* Rationalized Systems Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((item) => {
          const variant = getServiceBadgeVariant(item.domain);
          const title = cleanTitle(item.title);
          const parsedSpecs = parseEquipmentSpecs(item.specs);
          const topSpecs = parsedSpecs.slice(0, 3);
          
          let origins: string[] = [];
          try {
            origins = JSON.parse(item.originCountries);
          } catch {
            origins = [];
          }

          return (
            <Link
              key={item.id}
              href={`/arsenal/${encodeURIComponent(item.slug)}`}
              className="group block h-full"
            >
              <HUDFrame
                variant={variant}
                classification={formatEquipmentValue("serviceStatus", item.serviceStatus).toUpperCase()}
                scanline
                className="h-full flex flex-col justify-between"
              >
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Domain & Category Badges */}
                    <div className="flex items-center justify-between gap-2 mb-2 font-mono text-[10px]">
                      <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-primary">
                        {getCategoryIcon(item.category)}
                        <span>{formatEquipmentValue("domain", item.domain)}</span>
                      </span>
                      <span className="text-muted-foreground uppercase px-2 py-0.5 rounded bg-muted/40 border border-border/60">
                        {formatEquipmentValue("category", item.category)}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-1 mt-1">
                      {title}
                    </h2>

                    {item.variantLabel && (
                      <p className="font-mono text-xs text-muted-foreground mt-0.5">
                        Variant: {item.variantLabel}
                      </p>
                    )}

                    {/* Summary */}
                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                      {item.summary}
                    </p>
                  </div>

                  {/* Technical Specifications Snippet */}
                  <div className="mt-4 pt-3 border-t border-border/40">
                    {topSpecs.length > 0 ? (
                      <div className="space-y-1 font-mono text-[11px] mb-3">
                        {topSpecs.map((spec) => (
                          <div key={spec.label} className="flex justify-between items-center text-muted-foreground">
                            <span className="truncate pr-2">{spec.label}:</span>
                            <span className="text-foreground font-semibold shrink-0">
                              {spec.value} {spec.unit || ""}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : origins.length > 0 || item.inductedYear ? (
                      <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted-foreground mb-3">
                        {origins.length > 0 && (
                          <span>Origin: <strong className="text-foreground">{origins.join(", ")}</strong></span>
                        )}
                        {item.inductedYear && (
                          <span>· Inducted: <strong className="text-foreground">{item.inductedYear}</strong></span>
                        )}
                      </div>
                    ) : null}

                    {/* Card Action Link */}
                    <div className="flex items-center justify-between font-mono text-xs text-primary font-bold group-hover:translate-x-0.5 transition-transform">
                      <span>VIEW SYSTEM SPECIFICATIONS</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </HUDFrame>
            </Link>
          );
        })}
      </div>

      {rows.length === 0 && (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground font-mono">
          <Shield className="w-10 h-10 mx-auto text-primary/40 animate-pulse mb-3" />
          <p className="text-base text-foreground font-bold">No Arsenal Directives Found</p>
          <p className="text-xs text-muted-foreground mt-1">Try adjusting service, category, or status filter parameters.</p>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-10">
        <Pagination page={query.page} pageCount={pageCount} params={params} />
      </div>
    </PageShell>
  );
}
