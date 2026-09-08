import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteBreadcrumbs } from "@/components/Breadcrumbs";
import { ArticleLayout } from "@/components/ArticleLayout";
import { ProvenanceViewer } from "@/components/ProvenanceViewer";
import { getPublicClaims } from "@/lib/repositories/evidence";
import { getPublicEquipment, getPublicSlugs } from "@/lib/repositories/entities";
import { getPublicRelationships } from "@/lib/repositories/relationships";

type EquipmentSpec = { label: string; value: string };
const documented = (value: string | null | undefined) => value?.trim() || "Not documented";
const labelize = (value: string) => value.replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
function specs(value: unknown): EquipmentSpec[] {
  if (Array.isArray(value)) return value.flatMap((entry) => typeof entry === "object" && entry !== null ? [{ label: typeof (entry as { label?: unknown }).label === "string" ? (entry as { label: string }).label : "Specification", value: String((entry as { value?: unknown }).value ?? "Not documented") }] : []);
  if (value && typeof value === "object") return Object.entries(value).map(([label, entry]) => ({ label: labelize(label), value: typeof entry === "string" || typeof entry === "number" ? String(entry) : "Not documented" }));
  return [];
}

export const dynamic = "force-dynamic";
export async function generateStaticParams() { return (await getPublicSlugs("Equipment")).map((slug) => ({ slug })); }

export default async function EquipmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const equipment = await getPublicEquipment(slug);
  if (!equipment) notFound();
  const ref = { type: "Equipment" as const, id: equipment.id };
  const [claims, relationships] = await Promise.all([getPublicClaims(ref), getPublicRelationships(ref)]);
  const evidenceFor = (property: string) => claims.find((claim) => claim.property === property)?.evidence;
  const rows = specs(equipment.specs);
  const related = relationships.map((relationship) => relationship.source.id === equipment.id && relationship.source.type === "Equipment" ? { title: relationship.targetTitle, href: relationship.targetHref, type: relationship.target.type } : { title: relationship.sourceTitle, href: relationship.sourceHref, type: relationship.source.type });
  const facts = [
    { label: "Domain", value: documented(equipment.domain), evidence: evidenceFor("domain") },
    { label: "Category", value: documented(equipment.category), evidence: evidenceFor("category") },
    { label: "Variant", value: documented(equipment.variantLabel), evidence: evidenceFor("variantLabel") },
    { label: "Service status", value: documented(equipment.serviceStatus), asOf: equipment.statusAsOf ?? undefined, evidence: evidenceFor("serviceStatus") },
    { label: "Development", value: documented(equipment.developmentModel), evidence: evidenceFor("developmentModel") },
    { label: "Origin", value: equipment.originCountries.length > 0 ? equipment.originCountries.join(", ") : "Not documented", evidence: evidenceFor("originCountries") },
  ];

  return <>
    <SiteBreadcrumbs />
    <ArticleLayout title={equipment.title} summary={equipment.summary || "Not documented"} content={equipment.content} facts={facts}>
      {rows.length > 0 && <section className="mt-12"><h2 className="border-l-2 border-primary pl-4 text-xl font-bold uppercase tracking-wider">Specifications</h2><dl className="mt-5 divide-y divide-border rounded border border-border/60 bg-card/40 px-5">{rows.map((row) => <div key={row.label} className="grid gap-1 py-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]"><dt className="text-xs uppercase tracking-wider text-muted-foreground">{row.label}</dt><dd>{row.value}</dd></div>)}</dl></section>}
      {related.length > 0 && <section className="mt-12"><h2 className="border-l-2 border-primary pl-4 text-xl font-bold uppercase tracking-wider">Related records</h2><ul className="mt-5 grid gap-3 sm:grid-cols-2">{related.map((item) => <li key={`${item.type}:${item.href}`}><Link href={item.href} className="block rounded border border-border/60 p-4 hover:border-primary"><span className="text-xs uppercase tracking-wider text-primary">{item.type}</span><span className="mt-1 block font-medium">{item.title}</span></Link></li>)}</ul></section>}
      <ProvenanceViewer claims={claims} />
    </ArticleLayout>
  </>;
}
