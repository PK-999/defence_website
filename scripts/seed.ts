import { PrismaClient } from "@prisma/client";
import { UNITS_DATA, RENOWNED_UNITS } from "../src/app/forces/forcesData";

const prisma = new PrismaClient();

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  console.log("🌱 Starting unified seed...");

  // Seed Units from UNITS_DATA and RENOWNED_UNITS
  const allUnits = [...UNITS_DATA, ...RENOWNED_UNITS];
  const seenSlugs = new Set<string>();

  let unitCount = 0;
  for (const u of allUnits) {
    const slug = slugify(u.name);
    if (seenSlugs.has(slug)) continue;
    seenSlugs.add(slug);

    const serviceId = u.service?.toLowerCase().replace(/\s+/g, "-") || "army";

    await prisma.unit.upsert({
      where: { slug },
      update: {
        title: u.name,
        summary: u.history ? u.history.slice(0, 300) + "..." : u.name,
        content: [
          u.history ? `## History\n${u.history}` : "",
          u.victories ? `## Victories & Honors\n${u.victories}` : "",
          u.heroes ? `## Decorated Heroes\n${u.heroes}` : "",
          u.strength ? `## Approximate Strength\n${u.strength}` : "",
          u.baseLocation ? `## Base / Regimental Center\n${u.baseLocation}` : "",
        ].filter(Boolean).join("\n\n"),
        serviceId,
        unitType: u.type || "Regiment",
        motto: u.motto || null,
        warCry: u.warCry || null,
      },
      create: {
        slug,
        title: u.name,
        summary: u.history ? u.history.slice(0, 300) + "..." : u.name,
        content: [
          u.history ? `## History\n${u.history}` : "",
          u.victories ? `## Victories & Honors\n${u.victories}` : "",
          u.heroes ? `## Decorated Heroes\n${u.heroes}` : "",
          u.strength ? `## Approximate Strength\n${u.strength}` : "",
          u.baseLocation ? `## Base / Regimental Center\n${u.baseLocation}` : "",
        ].filter(Boolean).join("\n\n"),
        serviceId,
        unitType: u.type || "Regiment",
        motto: u.motto || null,
        warCry: u.warCry || null,
      },
    });
    unitCount++;
  }

  console.log(`✅ Seeded ${unitCount} military units.`);

  const stats = {
    conflicts: await prisma.conflict.count(),
    people: await prisma.person.count(),
    operations: await prisma.operation.count(),
    equipment: await prisma.equipment.count(),
    units: await prisma.unit.count(),
    sources: await prisma.source.count(),
  };
  console.log("📊 Database Record Status:", stats);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
