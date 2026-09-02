import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const CONTENT_DIR = path.join(process.cwd(), 'content');

async function migrateDirectory(dirName: string, modelName: any) {
  const dirPath = path.join(CONTENT_DIR, dirName);
  if (!fs.existsSync(dirPath)) return;
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
  
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const content = fs.readFileSync(fullPath, 'utf8');
    const { data, content: body } = matter(content);
    
    // Normalize data
    const slug = data.slug || file.replace(/\.mdx?$/, '');
    
    // Convert arrays/objects to JSON strings for SQLite
    const normalizedData = { ...data, slug, content: body };
    for (const key in normalizedData) {
      if (Array.isArray(normalizedData[key]) || typeof normalizedData[key] === 'object') {
        normalizedData[key] = JSON.stringify(normalizedData[key]);
      }
    }

    try {
      // We explicitly map the required fields based on the model
      let payload: any = {};
      if (dirName === 'conflicts') {
        payload = {
          slug: normalizedData.slug,
          title: normalizedData.title || '',
          summary: normalizedData.summary || '',
          content: normalizedData.content || '',
          status: normalizedData.status || 'published',
          dateStart: normalizedData.dateStart || '',
          dateEnd: normalizedData.dateEnd || null,
          theatres: normalizedData.theatres || '[]',
        };
      } else if (dirName === 'people') {
        payload = {
          slug: normalizedData.slug,
          title: normalizedData.title || '',
          fullName: normalizedData.fullName || '',
          summary: normalizedData.summary || '',
          content: normalizedData.content || '',
          status: normalizedData.status || 'published',
          rank: normalizedData.rank || null,
          birthDate: normalizedData.birthDate || null,
          deathDate: normalizedData.deathDate || null,
        };
      } else if (dirName === 'operations') {
        payload = {
          slug: normalizedData.slug,
          title: normalizedData.title || '',
          category: normalizedData.category || 'other',
          summary: normalizedData.summary || '',
          content: normalizedData.content || '',
          status: normalizedData.status || 'published',
          dateStart: normalizedData.dateStart || '',
          dateEnd: normalizedData.dateEnd || null,
        };
      } else if (dirName === 'equipment') {
        payload = {
          slug: normalizedData.slug,
          title: normalizedData.title || '',
          domain: normalizedData.domain || 'land',
          category: normalizedData.category || '',
          summary: normalizedData.summary || '',
          content: normalizedData.content || '',
          status: normalizedData.status || 'published',
          developmentModel: normalizedData.developmentModel || 'indigenous',
          serviceStatus: normalizedData.serviceStatus || 'active',
          originCountries: normalizedData.originCountries || '[]',
          specs: normalizedData.specs || '[]',
        };
      } else if (dirName === 'sources') {
        payload = {
          slug: normalizedData.slug,
          title: normalizedData.title || '',
          publisher: normalizedData.publisher || '',
          accessedAt: normalizedData.accessedAt || '',
          url: normalizedData.url || '',
          sourceType: normalizedData.sourceType || 'other',
          tier: normalizedData.tier || 'C',
          summary: normalizedData.summary || null,
        };
      }

      await (prisma[modelName as keyof typeof prisma] as any).upsert({
        where: { slug: payload.slug },
        update: payload,
        create: payload,
      });
      console.log(`✅ Upserted ${modelName} / ${slug}`);
    } catch (e: any) {
      console.error(`❌ Failed to upsert ${modelName} / ${slug}:`, e.message);
    }
  }
}

async function main() {
  console.log("Starting DB migration from markdown...");
  await migrateDirectory('conflicts', 'conflict');
  await migrateDirectory('people', 'person');
  await migrateDirectory('operations', 'operation');
  await migrateDirectory('equipment', 'equipment');
  await migrateDirectory('sources', 'sourceRecord');
  console.log("Migration complete.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
