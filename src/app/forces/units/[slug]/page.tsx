import { notFound } from "next/navigation";
import { SiteBreadcrumbs } from "@/components/Breadcrumbs";
import { getPublicUnit } from "@/lib/repositories/entities";
import type { Metadata } from "next";
import { publicMetadata } from "@/lib/metadata";
import { formatDisplayDate } from "@/lib/domain/dates";
import { MorseText } from "@/components/MorseText";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const unit = await getPublicUnit((await params).slug);
  if (!unit) notFound();
  return publicMetadata({
    title: unit.title,
    description: unit.summary,
    pathname: `/forces/units/${encodeURIComponent(unit.slug)}`,
  });
}

export default async function UnitPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const unit = await getPublicUnit((await params).slug);
  if (!unit) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <SiteBreadcrumbs customLastTitle={unit.title} />
      <p className="text-xs uppercase tracking-wider text-primary">{unit.unitType}</p>
      <h1 className="mt-3 text-4xl font-bold text-foreground">
        <MorseText text={unit.title} />
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">{unit.summary}</p>
      {unit.content && (
        <div className="mt-10 whitespace-pre-wrap leading-7 text-muted-foreground">
          {unit.content}
        </div>
      )}
      <dl className="mt-10 grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
        {unit.serviceId && (
          <div>
            <dt className="text-xs uppercase text-muted-foreground font-mono">Service</dt>
            <dd className="font-medium text-foreground">{unit.serviceId}</dd>
          </div>
        )}
        {unit.establishedDate && (
          <div>
            <dt className="text-xs uppercase text-muted-foreground font-mono">Established</dt>
            <dd className="font-medium text-foreground">{formatDisplayDate(unit.establishedDate)}</dd>
          </div>
        )}
        {unit.disbandedDate && (
          <div>
            <dt className="text-xs uppercase text-muted-foreground font-mono">Disbanded</dt>
            <dd className="font-medium text-foreground">{formatDisplayDate(unit.disbandedDate)}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
