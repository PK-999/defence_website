const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, '../content');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeMarkdown(type, slug, frontmatter, content) {
  const dir = path.join(CONTENT_DIR, type);
  ensureDir(dir);
  const base = {
    status: 'published',
    sourceIds: ['src-1'],
    tags: ['test'],
    createdAt: '2026-09-02T00:00:00Z',
    updatedAt: '2026-09-02T00:00:00Z',
    slug: slug
  };
  const finalFrontmatter = { ...base, ...frontmatter };
  const fileContent = `---\n${Object.entries(finalFrontmatter).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join('\n')}\n---\n\n${content}`;
  fs.writeFileSync(path.join(dir, `${slug}.md`), fileContent);
}

// 5 Conflicts
const conflicts = ['1947-war', '1962-war', '1965-war', '1971-war', 'kargil-1999'];
conflicts.forEach((c, i) => {
  if (c === 'kargil-1999') return; 
  writeMarkdown('conflicts', c, {
    id: c, title: `The ${c.replace('-', ' ').toUpperCase()}`, summary: `A major conflict.`,
    dateStart: `19${47 + i}-01-01`, theatres: ['Northern'], type: 'conflict',
    serviceIds: [], operationIds: [], eventIds: [], personIds: [], unitIds: [], equipmentIds: []
  }, `Historical overview of the ${c}.`);
});

// 12 People
const peopleNames = ['Sam Manekshaw', 'Arjan Singh', 'K. M. Cariappa', 'Nirmal Jit Singh Sekhon', 'Arun Khetarpal', 'Albert Ekka', 'Abdul Hamid', 'Somnath Sharma', 'Manoj Kumar Pandey', 'Sanjay Kumar', 'Yogendra Singh Yadav', 'Bana Singh'];
peopleNames.forEach((name) => {
  const slug = name.toLowerCase().replace(/[\.\s]+/g, '-');
  if (slug === 'vikram-batra') return;
  writeMarkdown('people', slug, {
    id: slug, title: name, fullName: name, summary: `A decorated hero.`,
    type: 'person', serviceId: 'ia-01', unitIds: []
  }, `Biography of ${name}.`);
});

// 10 Operations
const ops = ['safed-sagar', 'talwar', 'meghdoot', 'cactus', 'pawan', 'trident', 'python', 'vijay', 'blue-star', 'black-tornado'];
ops.forEach((op) => {
  writeMarkdown('operations', op, {
    id: op, title: `Operation ${op.replace('-', ' ').toUpperCase()}`, category: 'combat', summary: `A strategic operation.`,
    dateStart: `1984-04-13`, type: 'operation', serviceIds: []
  }, `Details of Operation ${op}.`);
});

// 30 Equipment
for(let i=1; i<=30; i++) {
  writeMarkdown('equipment', `eq-${i}`, {
    id: `eq-${i}`, title: `System ${i}`, domain: 'land', category: 'armor', serviceStatus: 'active', developmentModel: 'indigenous',
    summary: `Equipment system ${i}`, type: 'equipment', originCountries: ['India'], serviceIds: [], specs: []
  }, `Specs for System ${i}.`);
}

// 25 Sources
for(let i=1; i<=25; i++) {
  writeMarkdown('sources', `src-${i}`, {
    id: `src-${i}`, title: `File ${i}`, sourceType: 'official-report', tier: 'A',
    publisher: 'MoD', summary: `Source record ${i}`, accessedAt: '2026-09-02T00:00:00Z', url: 'https://mod.gov.in'
  }, `Transcript of source ${i}.`);
}

console.log("Seed data re-generated successfully.");
