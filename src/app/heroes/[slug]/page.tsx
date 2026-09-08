import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteBreadcrumbs } from "@/components/Breadcrumbs";
import { ArticleLayout } from "@/components/ArticleLayout";
import { ProvenanceViewer } from "@/components/ProvenanceViewer";
import { getPublicClaims } from "@/lib/repositories/evidence";
import { getPublicPerson, getPublicSlugs } from "@/lib/repositories/entities";
import { getPublicRelationships } from "@/lib/repositories/relationships";
import type { Metadata } from "next";
import { publicMetadata } from "@/lib/metadata";

const documented = (value: string | null | undefined) => value?.trim() || "Not documented";

export const dynamic = "force-dynamic";
export async function generateStaticParams() { return (await getPublicSlugs("Person")).map((slug) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const person = await getPublicPerson(slug);
  if (!person) notFound();
  return publicMetadata({ title: person.fullName, description: person.summary, pathname: `/heroes/${encodeURIComponent(person.slug)}` });
}

export default async function PersonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const person = await getPublicPerson(slug);
  if (!person) notFound();
  const ref = { type: "Person" as const, id: person.id };
  const [claims, relationships] = await Promise.all([getPublicClaims(ref), getPublicRelationships(ref)]);
  const evidenceFor = (property: string) => claims.find((claim) => claim.property === property)?.evidence;
  const related = relationships.map((relationship) => relationship.source.id === person.id && relationship.source.type === "Person" ? { title: relationship.targetTitle, href: relationship.targetHref, type: relationship.target.type } : { title: relationship.sourceTitle, href: relationship.sourceHref, type: relationship.source.type });
  const dates = person.birthDate || person.deathDate ? `${person.birthDate ? person.birthDate : "Not documented"} — ${person.deathDate ? person.deathDate : "Not documented"}` : "Not documented";

  return <>
    <SiteBreadcrumbs />
    <ArticleLayout title={person.fullName} summary={person.summary || "Not documented"} content={person.content} facts={[
      { label: "Rank", value: documented(person.rank), evidence: evidenceFor("rank") },
      { label: "Service", value: documented(person.serviceBranch), evidence: evidenceFor("serviceBranch") },
      { label: "Life dates", value: dates, evidence: [...(evidenceFor("birthDate") ?? []), ...(evidenceFor("deathDate") ?? [])] },
      { label: "Decorations", value: documented(person.decorations), evidence: evidenceFor("decorations") },
      { label: "Conflict context", value: documented(person.conflict), evidence: evidenceFor("conflict") },
    ]}>
      {related.length > 0 && <section className="mt-12"><h2 className="border-l-2 border-primary pl-4 text-xl font-bold uppercase tracking-wider">Related records</h2><ul className="mt-5 grid gap-3 sm:grid-cols-2">{related.map((item) => <li key={`${item.type}:${item.href}`}><Link href={item.href} className="block rounded border border-border/60 p-4 hover:border-primary"><span className="text-xs uppercase tracking-wider text-primary">{item.type}</span><span className="mt-1 block font-medium">{item.title}</span></Link></li>)}</ul></section>}
      <ProvenanceViewer claims={claims} />
    </ArticleLayout>
  </>;
}
