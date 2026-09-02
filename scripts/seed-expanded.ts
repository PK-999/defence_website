import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding expanded content (V2 Stage 4)...")

  // Pre-1947 History
  const sepoyMutiny = await prisma.conflict.upsert({
    where: { slug: '1857-rebellion' },
    update: {},
    create: {
      slug: '1857-rebellion',
      title: 'First War of Indian Independence',
      shortTitle: '1857 Rebellion',
      summary: 'A major, but ultimately unsuccessful, uprising in India in 1857–58 against the rule of the British East India Company.',
      content: 'The rebellion began on 10 May 1857 in the form of a mutiny of sepoys of the Company\'s army in the garrison town of Meerut. It then erupted into other mutinies and civilian rebellions chiefly in the upper Gangetic plain and central India.',
      status: 'Historical',
      dateStart: '1857-05-10',
      dateEnd: '1858-11-01',
      theatres: JSON.stringify(['Northern India', 'Central India']),
    }
  })

  // Equipment Expansion (ORBAT)
  const tejas = await prisma.equipment.upsert({
    where: { slug: 'hal-tejas' },
    update: {},
    create: {
      slug: 'hal-tejas',
      title: 'HAL Tejas',
      domain: 'Air',
      category: 'Fighter Aircraft',
      summary: 'An Indian single-engine, delta wing, light multirole fighter.',
      status: 'Active',
      developmentModel: 'Indigenous',
      serviceStatus: 'Active Service',
      inductedYear: 2015,
      originCountries: JSON.stringify(['India']),
      specs: JSON.stringify({ role: 'Multirole light fighter', manufacturer: 'Hindustan Aeronautics Limited' }),
    }
  })

  const vikramaditya = await prisma.equipment.upsert({
    where: { slug: 'ins-vikramaditya' },
    update: {},
    create: {
      slug: 'ins-vikramaditya',
      title: 'INS Vikramaditya',
      domain: 'Naval',
      category: 'Aircraft Carrier',
      summary: 'A modified Kiev-class aircraft carrier and the flagship of the Indian Navy.',
      status: 'Active',
      developmentModel: 'Procured/Modified',
      serviceStatus: 'Active Service',
      inductedYear: 2013,
      originCountries: JSON.stringify(['Russia', 'Soviet Union']),
      specs: JSON.stringify({ displacement: '45,400 tons', aircraftCarried: 36 }),
    }
  })

  // Link to existing conflict if possible, else standalone
  console.log("Successfully seeded expanded content!")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
