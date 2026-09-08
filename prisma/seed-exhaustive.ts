import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { assertDestructiveSeedAllowed } from '../scripts/lib/test-database';

const prisma = new PrismaClient();

async function main() {
  assertDestructiveSeedAllowed();
  console.log('Clearing database for exhaustive seed...');
  await prisma.claimEvidence.deleteMany();
  await prisma.evidence.deleteMany();
  await prisma.claim.deleteMany();
  await prisma.sourceVersion.deleteMany();
  await prisma.source.deleteMany();
  await prisma.sourceFamily.deleteMany();
  
  await prisma.person.deleteMany();
  await prisma.operation.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.conflict.deleteMany();

  // Load JSONs
  const dataPath = path.join(__dirname, '../factory/data');
  const conflicts = JSON.parse(fs.readFileSync(path.join(dataPath, 'conflicts.json'), 'utf-8'));
  const equipment = JSON.parse(fs.readFileSync(path.join(dataPath, 'equipment.json'), 'utf-8'));
  const operations = JSON.parse(fs.readFileSync(path.join(dataPath, 'operations.json'), 'utf-8'));
  const people = JSON.parse(fs.readFileSync(path.join(dataPath, 'people.json'), 'utf-8'));
  let peopleScraped = [];
  try {
    peopleScraped = JSON.parse(fs.readFileSync(path.join(dataPath, 'people_scraped.json'), 'utf-8'));
  } catch(e) {
    console.log('No scraped people found, skipping.');
  }

  console.log(`Seeding ${conflicts.length} conflicts...`);
  for (const item of conflicts) {
    await prisma.conflict.create({ data: item });
  }

  console.log(`Seeding ${equipment.length} equipment items...`);
  for (const item of equipment) {
    await prisma.equipment.create({ data: item });
  }

  console.log(`Seeding ${operations.length} operations...`);
  for (const item of operations) {
    await prisma.operation.create({ data: item });
  }

  console.log(`Seeding ${people.length} people...`);
  for (const item of people) {
    await prisma.person.create({ data: item });
  }

  if (peopleScraped.length > 0) {
    console.log(`Seeding ${peopleScraped.length} scraped people...`);
    for (const item of peopleScraped) {
      // Use upsert to avoid conflicts with hardcoded people
      await prisma.person.upsert({
        where: { slug: item.slug },
        update: {},
        create: item
      });
    }
  }

  console.log('Exhaustive seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
