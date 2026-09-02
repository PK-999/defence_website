import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning database...");
  await prisma.equipment.deleteMany({});
  await prisma.person.deleteMany({});
  await prisma.operation.deleteMany({});
  await prisma.conflict.deleteMany({});

  console.log("Seeding authentic military history data...");

  // --- CONFLICTS ---
  const conflictKargil = await prisma.conflict.create({
    data: {
      slug: 'kargil-war',
      title: 'Kargil War (1999)',
      shortTitle: 'Op Vijay',
      summary: 'An armed conflict between India and Pakistan that took place between May and July 1999 in the Kargil district of Kashmir.',
      content: 'The cause of the war was the infiltration of Pakistani soldiers disguised as Kashmiri militants into positions on the Indian side of the Line of Control (LoC).',
      status: 'Historical',
      dateStart: '1999-05-03',
      dateEnd: '1999-07-26',
      theatres: JSON.stringify(['Kargil', 'Drass', 'Batalik']),
      outcomeSummary: 'Indian decisive military victory. Recapture of all Indian territory.',
      contextSummary: 'Post-nuclear test escalation in the subcontinent.'
    }
  });

  const conflict1971 = await prisma.conflict.create({
    data: {
      slug: '1971-war',
      title: 'Indo-Pakistani War of 1971',
      shortTitle: '1971 War',
      summary: 'A military confrontation between India and Pakistan that occurred during the Bangladesh Liberation War in East Pakistan.',
      content: 'The war began with preemptive aerial strikes on 11 Indian air stations, which led to the commencement of hostilities with Pakistan and Indian entry into the war for independence in East Pakistan on the side of Bengali nationalist forces.',
      status: 'Historical',
      dateStart: '1971-12-03',
      dateEnd: '1971-12-16',
      theatres: JSON.stringify(['Eastern Front (East Pakistan)', 'Western Front (India-West Pakistan)']),
      outcomeSummary: 'Decisive Indian victory resulting in the creation of Bangladesh.',
      contextSummary: 'Culmination of the Bangladesh Liberation War.'
    }
  });

  // --- OPERATIONS ---
  const opTrident = await prisma.operation.create({
    data: {
      slug: 'operation-trident',
      title: 'Operation Trident',
      category: 'Naval Strike',
      summary: 'An offensive operation launched by the Indian Navy on Pakistan\'s port city of Karachi during the Indo-Pakistani War of 1971.',
      content: 'Operation Trident saw the first use of anti-ship missiles in combat in the region. The operation was conducted on the night of 4–5 December and inflicted heavy damage on Pakistani vessels and facilities.',
      status: 'Historical',
      dateStart: '1971-12-04',
      dateEnd: '1971-12-05',
      conflicts: { connect: [{ id: conflict1971.id }] }
    }
  });

  const opSafedSagar = await prisma.operation.create({
    data: {
      slug: 'operation-safed-sagar',
      title: 'Operation Safed Sagar',
      category: 'Air Support',
      summary: 'The code name assigned to the Indian Air Force\'s role in acting jointly with Ground troops during the 1999 Kargil war.',
      content: 'Aimed at flushing out regular and irregular troops of the Pakistani Army from vacated Indian Positions in the Kargil sector along the Line of Control.',
      status: 'Historical',
      dateStart: '1999-05-26',
      dateEnd: '1999-07-11',
      conflicts: { connect: [{ id: conflictKargil.id }] }
    }
  });

  // --- PEOPLE ---
  const manekshaw = await prisma.person.create({
    data: {
      slug: 'sam-manekshaw',
      title: 'Sam Manekshaw',
      fullName: 'Field Marshal Sam Hormusji Framji Jamshedji Manekshaw',
      summary: 'Chief of the Army Staff of the Indian Army during the Indo-Pakistani War of 1971, and the first Indian Army officer to be promoted to the rank of field marshal.',
      content: 'Manekshaw\'s distinguished military career spanned four decades and five wars, beginning with service in the British Indian Army in World War II.',
      status: 'Deceased',
      rank: 'Field Marshal',
      birthDate: '1914-04-03',
      deathDate: '2008-06-27',
      conflicts: { connect: [{ id: conflict1971.id }] },
      operations: { connect: [{ id: opTrident.id }] }
    }
  });

  const vikramBatra = await prisma.person.create({
    data: {
      slug: 'vikram-batra',
      title: 'Vikram Batra',
      fullName: 'Captain Vikram Batra, PVC',
      summary: 'An officer of the Indian Army, awarded with the Param Vir Chakra, India\'s highest and most prestigious award for valour, for his actions during the 1999 Kargil War.',
      content: 'He led one of the toughest operations in mountain warfare in Indian history. He was often referred to as "Sher Shah" in the intercepted messages of the Pakistan Army.',
      status: 'Killed in Action',
      rank: 'Captain',
      birthDate: '1974-09-09',
      deathDate: '1999-07-07',
      conflicts: { connect: [{ id: conflictKargil.id }] }
    }
  });

  // --- EQUIPMENT ---
  const tejas = await prisma.equipment.create({
    data: {
      slug: 'hal-tejas',
      title: 'HAL Tejas',
      domain: 'Air',
      category: 'Multirole Fighter',
      summary: 'An Indian single-engine, delta wing, light multirole fighter designed by the Aeronautical Development Agency (ADA) and Hindustan Aeronautics Limited (HAL).',
      content: 'The Tejas is the second supersonic fighter developed by HAL after the HAL HF-24 Marut.',
      status: 'Active',
      developmentModel: 'Indigenous',
      serviceStatus: 'Active Service',
      inductedYear: 2015,
      originCountries: JSON.stringify(['India']),
      specs: JSON.stringify({ role: 'Multirole light fighter', manufacturer: 'Hindustan Aeronautics Limited' })
    }
  });

  const vikramaditya = await prisma.equipment.create({
    data: {
      slug: 'ins-vikramaditya',
      title: 'INS Vikramaditya',
      domain: 'Naval',
      category: 'Aircraft Carrier',
      summary: 'A modified Kiev-class aircraft carrier and the flagship of the Indian Navy, which entered into service in 2013.',
      content: 'Originally built as Baku and commissioned in 1987, the carrier served with the Soviet Navy and later with the Russian Navy (as Admiral Gorshkov) before being decommissioned in 1996.',
      status: 'Active',
      developmentModel: 'Procured/Modified',
      serviceStatus: 'Active Service',
      inductedYear: 2013,
      originCountries: JSON.stringify(['Russia', 'Soviet Union']),
      specs: JSON.stringify({ displacement: '45,400 tons', length: '284 metres' })
    }
  });

  const brahmos = await prisma.equipment.create({
    data: {
      slug: 'brahmos',
      title: 'BrahMos',
      domain: 'Missiles',
      category: 'Cruise Missile',
      summary: 'A medium-range ramjet supersonic cruise missile that can be launched from submarine, ships, aircraft, or land.',
      content: 'It is a joint venture between the Russian Federation\'s NPO Mashinostroyeniya and India\'s Defence Research and Development Organisation (DRDO), who together have formed BrahMos Aerospace.',
      status: 'Active',
      developmentModel: 'Joint Venture',
      serviceStatus: 'Active Service',
      inductedYear: 2005,
      originCountries: JSON.stringify(['India', 'Russia']),
      specs: JSON.stringify({ range: '450 km', speed: 'Mach 3' })
    }
  });

  const mirage2000 = await prisma.equipment.create({
    data: {
      slug: 'mirage-2000',
      title: 'Dassault Mirage 2000',
      domain: 'Air',
      category: 'Multirole Fighter',
      summary: 'A French multirole, single-engine fourth-generation jet fighter manufactured by Dassault Aviation.',
      content: 'The Mirage 2000 played a decisive role in the 1999 Kargil War by deploying laser-guided bombs on high-altitude enemy bunkers.',
      status: 'Active',
      developmentModel: 'Procured',
      serviceStatus: 'Active Service',
      inductedYear: 1985,
      originCountries: JSON.stringify(['France']),
      specs: JSON.stringify({ manufacturer: 'Dassault Aviation', role: 'Multirole fighter' }),
      conflicts: { connect: [{ id: conflictKargil.id }] }
    }
  });

  console.log("Database seeded with robust real data successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
