import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/ArticleLayout";
import { ProvenanceViewer } from "@/components/ProvenanceViewer";
import { getPublicClaims } from "@/lib/repositories/evidence";
import { getPublicEquipment, getPublicSource } from "@/lib/repositories/entities";
import { getPublicRelationships } from "@/lib/repositories/relationships";
import type { Metadata } from "next";
import { publicMetadata } from "@/lib/metadata";
import { ResearchDossier } from "@/components/ResearchDossier";
import { getEquipmentDossier } from "@/lib/equipment-dossiers";
import { parseEquipmentSpecs } from "@/lib/equipment-specs";
import { formatDisplayDate } from "@/lib/domain/dates";
import { formatEquipmentValue } from "@/lib/equipment-presentation";

const documented = (value: string | null | undefined) => value?.trim() || "Not documented";
const readableContent = (value: string | null | undefined) => value && !/source-backed technical facts|configuration scope and limitations|source scope varies/i.test(value) ? value : null;

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const equipment = await getPublicEquipment(slug);
  if (!equipment) notFound();
  return publicMetadata({ title: equipment.title, description: equipment.summary, pathname: `/arsenal/${encodeURIComponent(equipment.slug)}` });
}

export default async function EquipmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const equipment = await getPublicEquipment(slug);
  if (!equipment) notFound();
  const ref = { type: "Equipment" as const, id: equipment.id };
  const [claims, relationships] = await Promise.all([getPublicClaims(ref), getPublicRelationships(ref)]);
  const evidenceFor = (property: string) => claims.find((claim) => claim.property === property)?.evidence;
  const rows = parseEquipmentSpecs(equipment.specs);
  const sourceIds = [...new Set(rows.flatMap((row) => row.sourceId ? [row.sourceId] : []))];
  const sources = await Promise.all(sourceIds.map(async (sourceId) => [sourceId, await getPublicSource(`research-${sourceId}`)] as const));
  const sourcesById = new Map(sources);
  const dossier = getEquipmentDossier(equipment.slug);
  const related = relationships.map((relationship) => relationship.source.id === equipment.id && relationship.source.type === "Equipment" ? { title: relationship.targetTitle, href: relationship.targetHref, type: relationship.target.type } : { title: relationship.sourceTitle, href: relationship.sourceHref, type: relationship.source.type });
  const facts = [
    { label: "Service", value: formatEquipmentValue("domain", equipment.domain), evidence: evidenceFor("domain") },
    { label: "Category", value: formatEquipmentValue("category", equipment.category), evidence: evidenceFor("category") },
    { label: "Variant", value: documented(equipment.variantLabel), evidence: evidenceFor("variantLabel") },
    { label: "Service status", value: formatEquipmentValue("serviceStatus", equipment.serviceStatus), asOf: equipment.statusAsOf ? formatDisplayDate(equipment.statusAsOf) : undefined, evidence: evidenceFor("serviceStatus") },
    { label: "Development", value: formatEquipmentValue("developmentModel", equipment.developmentModel), evidence: evidenceFor("developmentModel") },
    { label: "Origin", value: equipment.originCountries.length > 0 ? equipment.originCountries.join(", ") : "Not documented", evidence: evidenceFor("originCountries") },
  ];

  return <>
    <ArticleLayout title={equipment.title} summary={dossier?.overview ?? equipment.summary ?? "Not documented"} content={dossier ? null : readableContent(equipment.content)} facts={facts}>
      {dossier && <ResearchDossier dossier={dossier} />}
      {rows.length > 0 && <section className="mt-12"><h2 className="border-l-2 border-primary pl-4 text-xl font-bold uppercase tracking-wider">Specifications</h2><dl className="mt-5 divide-y divide-border rounded border border-border/60 bg-card/40 px-5">{rows.map((row, index) => {
        const source = row.sourceId ? sourcesById.get(row.sourceId) : null;
        return <div key={`${row.label}-${index}`} className="grid gap-2 py-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]"><dt className="text-xs uppercase tracking-wider text-muted-foreground">{row.label}</dt><dd><span className="font-medium">{row.value}{row.unit ? ` ${row.unit}` : ""}</span>{(row.effectiveDate || source) && <div className="mt-2 space-y-1 text-xs leading-5 text-muted-foreground">{row.effectiveDate && <p><span className="font-semibold text-foreground">As of:</span> {formatDisplayDate(row.effectiveDate)}</p>}{source?.url && <p><a href={source.url} target="_blank" rel="noreferrer" className="font-semibold text-primary underline">Source: {source.title}</a>{source.publisher ? ` · ${source.publisher}` : ""}{source.publishedAt ? ` · ${formatDisplayDate(source.publishedAt)}` : ""}</p>}{row.sourceId && !source && <p><span className="font-semibold text-foreground">Source unavailable:</span> {row.sourceId}</p>}</div>}</dd></div>;
      })}</dl></section>}
      {related.length > 0 && <section className="mt-12"><h2 className="border-l-2 border-primary pl-4 text-xl font-bold uppercase tracking-wider">Related records</h2><ul className="mt-5 grid gap-3 sm:grid-cols-2">{related.map((item) => <li key={`${item.type}:${item.href}`}><Link href={item.href} className="block rounded border border-border/60 p-4 hover:border-primary"><span className="text-xs uppercase tracking-wider text-primary">{item.type === "Person" ? "Heroes" : item.type === "Equipment" ? "Arsenal" : item.type}</span><span className="mt-1 block font-medium">{item.title}</span></Link></li>)}</ul></section>}
      <ProvenanceViewer claims={claims} />
    </ArticleLayout>
  </>;
}
