import Image from "next/image";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/ArticleLayout";
import { formatDisplayDate } from "@/lib/domain/dates";
import { displayAwardeeName, getAwardeeBiography, getAwardeeById, getAwardeeStory } from "@/lib/heroes/gallantry-research";
import { publicMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

const documented = (value: string | null | undefined) => value?.trim() && !["N/A", "Not documented"].includes(value.trim()) ? value : "Not published in the official record";

export const dynamic = "force-dynamic";
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const awardee = getAwardeeById(id);
  if (!awardee) notFound();
  const name = displayAwardeeName(awardee.name);
  return publicMetadata({ title: `${name} — ${awardee.award}`, description: `Official gallantry record, service details and source-linked citation for ${name}.`, pathname: `/heroes/awardees/${id}` });
}

export default async function GallantryAwardeePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const awardee = getAwardeeById(id);
  if (!awardee) notFound();
  const name = displayAwardeeName(awardee.name);
  const biography = getAwardeeBiography(awardee);
  const story = getAwardeeStory(awardee);
  const parentage = awardee.parentage.filter((value) => value.trim() && value.trim().toUpperCase() !== "N/A");
  const sections = [
    { id: "biography", label: "Biography" },
    ...(awardee.citationDetails ? [{ id: "citation-details", label: "Reason for award" }] : []),
    { id: "award-story", label: "Medal story" },
    { id: "official-sources", label: "Official sources" },
    ...(awardee.bibliography.length ? [{ id: "bibliography", label: "Bibliography" }] : []),
  ];

  return <ArticleLayout
    title={name}
    summary={`${awardee.award} recipient — a canonical Ministry of Defence record with service details, official profile material and citation links where published.`}
    facts={[
      { label: "Award", value: awardee.award },
      { label: "Gallantry action date", value: formatDisplayDate(awardee.actionDate) },
      { label: "Awarded date", value: formatDisplayDate(awardee.awardedDate) },
      { label: "Date of birth", value: formatDisplayDate(awardee.birthDate) },
      { label: "Date of death", value: formatDisplayDate(awardee.deathDate) },
      { label: "Service entry date", value: formatDisplayDate(awardee.serviceEntryDate) },
      { label: "Rank", value: documented(awardee.rank) },
      { label: "Service", value: documented(awardee.service) },
      { label: "Unit / organisation", value: documented(awardee.unit) },
      { label: "Service number", value: documented(awardee.serviceNumber) },
      { label: "Conflict / operation", value: documented(awardee.warOperationBattle) },
      { label: "Posthumous", value: awardee.posthumous === null ? "Not documented" : awardee.posthumous ? "Yes" : "No" },
      { label: "Resident of", value: documented(awardee.residentOf) },
      { label: "Parentage", value: parentage.length ? parentage.join(" · ") : "Not published in the official record" },
    ]}
    sections={sections}
  >
    <div className="mb-10 overflow-hidden rounded-lg border border-border/60 bg-card/60">
      {awardee.photoUrl ? <Image src={awardee.photoUrl} width={960} height={540} alt={`Portrait of ${name}`} className="max-h-[32rem] w-full object-contain object-top" unoptimized /> : <div className="flex h-56 items-center justify-center text-xs uppercase tracking-[0.16em] text-muted-foreground">Photo not documented in the official record</div>}
    </div>
    <section id="biography" className="mt-12 scroll-mt-24">
      <h2 className="border-l-2 border-primary pl-4 text-xl font-bold uppercase tracking-wider">Biography and service record</h2>
      <p className="mt-5 text-base leading-7 text-muted-foreground">{biography} <a href={awardee.sourceUrl} target="_blank" rel="noreferrer" className="whitespace-nowrap text-xs font-semibold text-primary underline" aria-label="Official Ministry of Defence awardee record">[1]</a></p>
    </section>

    {awardee.citationDetails && <section id="citation-details" className="mt-12 scroll-mt-24">
      <h2 className="border-l-2 border-primary pl-4 text-xl font-bold uppercase tracking-wider">Reason for the award</h2>
      <p className="mt-5 whitespace-pre-line text-base leading-7 text-muted-foreground">{awardee.citationDetails}</p>
    </section>}

    <section id="award-story" className="mt-12 scroll-mt-24">
      <h2 className="border-l-2 border-primary pl-4 text-xl font-bold uppercase tracking-wider">{story.title}</h2>
      <p className="mt-5 text-base leading-7 text-muted-foreground">{story.body}</p>
      {awardee.warOperationBattle && <p className="mt-4 rounded border border-border/60 bg-card/60 p-4 text-sm"><span className="font-semibold">Recorded context:</span> {awardee.warOperationBattle}</p>}
    </section>

    <section id="official-sources" className="mt-12 scroll-mt-24">
      <h2 className="border-l-2 border-primary pl-4 text-xl font-bold uppercase tracking-wider">Official sources</h2>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">The profile and citation files are linked rather than reproduced. Some citations—particularly counter-insurgency records—may be withheld or abbreviated by the publisher for security reasons.</p>
      <ul className="mt-5 space-y-3">
        <li><a href={awardee.sourceUrl} target="_blank" rel="noreferrer" className="block rounded border border-border/60 p-4 hover:border-primary"><span className="block font-medium">Ministry of Defence awardee record</span><span className="mt-1 block text-xs text-muted-foreground">Canonical name, award, date, service and unit fields</span></a></li>
        {awardee.profileUrls.map((url, index) => <li key={url}><a href={url} target="_blank" rel="noreferrer" className="block rounded border border-border/60 p-4 hover:border-primary"><span className="block font-medium">Official biographical profile{awardee.profileUrls.length > 1 ? ` ${index + 1}` : ""}</span><span className="mt-1 block text-xs text-muted-foreground">Government-hosted profile document</span></a></li>)}
        {awardee.citationUrls.map((url, index) => <li key={url}><a href={url} target="_blank" rel="noreferrer" className="block rounded border border-border/60 p-4 hover:border-primary"><span className="block font-medium">Official award citation{awardee.citationUrls.length > 1 ? ` ${index + 1}` : ""}</span><span className="mt-1 block text-xs text-muted-foreground">Government-hosted citation record</span></a></li>)}
      </ul>
    </section>

    {awardee.bibliography.length > 0 && <section id="bibliography" className="mt-12 scroll-mt-24">
      <h2 className="border-l-2 border-primary pl-4 text-xl font-bold uppercase tracking-wider">Bibliography from the official profile</h2>
      <ol className="mt-5 space-y-3 text-sm leading-6 text-muted-foreground">
        {awardee.bibliography.map((entry, index) => <li key={`${entry.title}-${index}`} className="rounded border border-border/50 p-4">{entry.url ? <a href={entry.url} target="_blank" rel="noreferrer" className="text-foreground hover:text-primary hover:underline">{entry.title}</a> : entry.title}</li>)}
      </ol>
    </section>}
  </ArticleLayout>;
}
