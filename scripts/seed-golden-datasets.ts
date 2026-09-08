import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Golden Datasets (Exhaustive Dataset Strategy)...');

  // 1. Get Source Families
  const drdoFamily = await prisma.sourceFamily.findUnique({ where: { slug: 'drdo' } });
  const halFamily = await prisma.sourceFamily.findUnique({ where: { slug: 'hal' } });
  const pibFamily = await prisma.sourceFamily.findUnique({ where: { slug: 'pib' } });

  if (!drdoFamily || !halFamily || !pibFamily) {
    throw new Error('Source families not found. Please run seed-source-registry.ts first.');
  }

  // 2. Create Sources
  const tejasBrochure = await prisma.source.upsert({
    where: { slug: 'drdo-tejas-brochure-2023' },
    update: {},
    create: {
      sourceFamilyId: drdoFamily.id,
      slug: 'drdo-tejas-brochure-2023',
      title: 'LCA Tejas Official Specifications',
      author: 'DRDO / ADA',
      publicationDate: '2023-01-01',
      versions: {
        create: {
          versionTag: 'PDF Brochure',
          url: 'https://drdo.gov.in/tejas-brochure.pdf',
          format: 'PDF',
          accessedAt: new Date(),
        }
      }
    },
    include: { versions: true }
  });

  const kargilReport = await prisma.source.upsert({
    where: { slug: 'kargil-review-committee-report' },
    update: {},
    create: {
      sourceFamilyId: pibFamily.id,
      slug: 'kargil-review-committee-report',
      title: 'Kargil Review Committee Report',
      author: 'K. Subrahmanyam',
      publicationDate: '2000-01-07',
      versions: {
        create: {
          versionTag: 'Executive Summary',
          url: 'https://pib.gov.in/kargil-report',
          format: 'Web',
          accessedAt: new Date(),
        }
      }
    },
    include: { versions: true }
  });

  // 3. Create Evidence
  const tejasSpeedEvidence = await prisma.evidence.create({
    data: {
      sourceVersionId: tejasBrochure.versions[0].id,
      locator: 'Page 4, Performance Data',
      quote: 'Maximum speed: Mach 1.8',
    }
  });

  const kargilDatesEvidence = await prisma.evidence.create({
    data: {
      sourceVersionId: kargilReport.versions[0].id,
      locator: 'Section 1.4',
      quote: 'The conflict officially concluded on July 26, 1999',
    }
  });

  // 4. Create Entities & Claims
  // We will assume the base entities (Equipment: Tejas, Conflict: Kargil War) exist, but we should create them if not.
  const tejasEntity = await prisma.equipment.upsert({
    where: { slug: 'hal-tejas' },
    update: {},
    create: {
      slug: 'hal-tejas',
      title: 'HAL Tejas',
      domain: 'air',
      category: 'fighter',
      summary: 'Indian single-engine, delta wing, light multirole fighter.',
      status: 'published',
      developmentModel: 'indigenous',
      serviceStatus: 'active',
      originCountries: JSON.stringify(['India']),
      specs: JSON.stringify([]),
    }
  });

  const kargilEntity = await prisma.conflict.upsert({
    where: { slug: 'kargil-war' },
    update: {},
    create: {
      slug: 'kargil-war',
      title: 'Kargil War',
      summary: 'An armed conflict between India and Pakistan that took place between May and July 1999.',
      status: 'published',
      dateStart: '1999-05-03',
      dateEnd: '1999-07-26',
      theatres: JSON.stringify(['Kashmir', 'Kargil']),
    }
  });

  // 5. Connect Evidence to Claims
  await prisma.claim.create({
    data: {
      entityType: 'Equipment',
      entityId: tejasEntity.id,
      property: 'topSpeed',
      value: 'Mach 1.8',
      verificationStatus: 'OFFICIALLY_CONFIRMED',
      evidence: {
        create: {
          evidenceId: tejasSpeedEvidence.id
        }
      }
    }
  });

  await prisma.claim.create({
    data: {
      entityType: 'Conflict',
      entityId: kargilEntity.id,
      property: 'endDate',
      value: '1999-07-26',
      verificationStatus: 'OFFICIALLY_CONFIRMED',
      evidence: {
        create: {
          evidenceId: kargilDatesEvidence.id
        }
      }
    }
  });

  console.log('Golden Datasets Seeding Complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
