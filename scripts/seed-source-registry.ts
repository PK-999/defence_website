import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Source Registry (Tier A-D)...');

  const sourceFamilies = [
    {
      slug: 'mod',
      name: 'Ministry of Defence (MoD), Government of India',
      tier: 'A',
      description: 'Official primary source for defence policy, procurement, and official announcements.',
    },
    {
      slug: 'indian-army',
      name: 'Indian Army Official Records',
      tier: 'A',
      description: 'Official army publications, gallantry citations, and press releases.',
    },
    {
      slug: 'indian-navy',
      name: 'Indian Navy Official Records',
      tier: 'A',
      description: 'Official navy publications and press releases.',
    },
    {
      slug: 'indian-air-force',
      name: 'Indian Air Force Official Records',
      tier: 'A',
      description: 'Official IAF publications and press releases.',
    },
    {
      slug: 'pib',
      name: 'Press Information Bureau (PIB)',
      tier: 'A',
      description: 'Official government press releases.',
    },
    {
      slug: 'national-archives',
      name: 'National Archives of India',
      tier: 'A',
      description: 'Declassified historical documents and official war diaries.',
    },
    {
      slug: 'drdo',
      name: 'Defence Research and Development Organisation (DRDO)',
      tier: 'B',
      description: 'First-party technical specifications and development milestones.',
    },
    {
      slug: 'hal',
      name: 'Hindustan Aeronautics Limited (HAL)',
      tier: 'B',
      description: 'Manufacturer specifications and official press releases.',
    },
  ];

  for (const family of sourceFamilies) {
    await prisma.sourceFamily.upsert({
      where: { slug: family.slug },
      update: {},
      create: family,
    });
    console.log(`Upserted SourceFamily: ${family.name}`);
  }

  console.log('Source Registry Seeding Complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
