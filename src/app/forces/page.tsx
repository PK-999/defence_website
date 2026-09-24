import { PageHeader, PageShell } from "@/components/PageShell";
import { prisma } from "@/lib/db";
import { ForcesExplorer } from "@/components/ForcesExplorer";
import { getForcesForService, getRenownedUnitsForService } from "./forcesData";

export const revalidate = 3600;

export default async function ForcesPage() {
  const allForces = getForcesForService("All");
  const allRenownedUnits = getRenownedUnitsForService("All");

  const heroSlugs = [
    ...new Set(
      allRenownedUnits.flatMap(
        (unit) => unit.notableHeroes?.map((hero) => hero.slug) ?? []
      )
    ),
  ];

  const publicHeroRows =
    heroSlugs.length > 0
      ? await prisma.person.findMany({
          where: { slug: { in: heroSlugs } },
          select: { slug: true },
        })
      : [];
  const publicHeroSlugs = publicHeroRows.map((hero) => hero.slug);

  return (
    <PageShell width="wide">
      <PageHeader
        eyebrow="INTEGRATED THEATRE DIRECTORY"
        title="Armed Forces of the Union"
        description="Operational command structures, headquarters, areas of responsibility, and major bases across the Indian Army, Indian Navy, Indian Air Force, and Tri-Service Commands."
      />

      <ForcesExplorer
        forces={allForces}
        renownedUnits={allRenownedUnits}
        publicHeroSlugs={publicHeroSlugs}
      />
    </PageShell>
  );
}
