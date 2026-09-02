import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning database for EXHAUSTIVE seed...");
  await prisma.equipment.deleteMany({});
  await prisma.person.deleteMany({});
  await prisma.operation.deleteMany({});
  await prisma.conflict.deleteMany({});

  console.log("Seeding exhaustive authentic military history data...");

  // ==========================================
  // CONFLICTS
  // ==========================================
  const c1947 = await prisma.conflict.create({
    data: {
      slug: '1947-war', title: 'Indo-Pakistani War of 1947–1948', shortTitle: '1947 War',
      summary: 'The first war fought between India and Pakistan over the princely state of Jammu and Kashmir.',
      content: 'Fought immediately after independence, it resulted in the division of Kashmir along the Line of Control.',
      status: 'Historical', dateStart: '1947-10-22', dateEnd: '1949-01-01',
      theatres: JSON.stringify(['Jammu and Kashmir']),
      outcomeSummary: 'UN ceasefire; India retained control of approx two-thirds of Kashmir.'
    }
  });

  const c1962 = await prisma.conflict.create({
    data: {
      slug: '1962-sino-indian-war', title: 'Sino-Indian War', shortTitle: '1962 War',
      summary: 'A brief military conflict between China and India over disputed Himalayan borders.',
      content: 'The war began with simultaneous Chinese offensives in Ladakh and across the McMahon Line, ending with a unilateral Chinese ceasefire.',
      status: 'Historical', dateStart: '1962-10-20', dateEnd: '1962-11-21',
      theatres: JSON.stringify(['Aksai Chin', 'NEFA (Arunachal Pradesh)']),
      outcomeSummary: 'Chinese military victory; status quo ante bellum in NEFA, Chinese retention of Aksai Chin.'
    }
  });

  const c1965 = await prisma.conflict.create({
    data: {
      slug: '1965-war', title: 'Indo-Pakistani War of 1965', shortTitle: '1965 War',
      summary: 'A culmination of skirmishes that took place between April and September 1965.',
      content: 'Pakistan launched Operation Gibraltar to infiltrate forces into Jammu and Kashmir. India retaliated by launching a full-scale military attack on West Pakistan.',
      status: 'Historical', dateStart: '1965-08-05', dateEnd: '1965-09-23',
      theatres: JSON.stringify(['Western Front', 'Kashmir']),
      outcomeSummary: 'UN mandated ceasefire; strategic Indian victory.'
    }
  });

  const c1971 = await prisma.conflict.create({
    data: {
      slug: '1971-war', title: 'Indo-Pakistani War of 1971', shortTitle: '1971 War',
      summary: 'A military confrontation during the Bangladesh Liberation War.',
      content: 'Preemptive Pakistani airstrikes led to full-scale war, resulting in the surrender of Pakistani forces in Dhaka.',
      status: 'Historical', dateStart: '1971-12-03', dateEnd: '1971-12-16',
      theatres: JSON.stringify(['Eastern Front', 'Western Front']),
      outcomeSummary: 'Decisive Indian victory; creation of Bangladesh.'
    }
  });

  const cSiachen = await prisma.conflict.create({
    data: {
      slug: 'siachen-conflict', title: 'Siachen Conflict', shortTitle: 'Siachen',
      summary: 'A military conflict over the disputed Siachen Glacier region in Kashmir.',
      content: 'India launched Operation Meghdoot to capture the glacier before Pakistan could.',
      status: 'Ongoing (Ceasefire)', dateStart: '1984-04-13', dateEnd: null,
      theatres: JSON.stringify(['Siachen Glacier', 'Saltoro Ridge']),
      outcomeSummary: 'Indian strategic victory; control of the entire Siachen Glacier.'
    }
  });

  const cKargil = await prisma.conflict.create({
    data: {
      slug: 'kargil-war', title: 'Kargil War (1999)', shortTitle: 'Kargil War',
      summary: 'An armed conflict between India and Pakistan in the Kargil district.',
      content: 'Triggered by the infiltration of Pakistani soldiers into Indian positions on the LoC.',
      status: 'Historical', dateStart: '1999-05-03', dateEnd: '1999-07-26',
      theatres: JSON.stringify(['Kargil', 'Drass', 'Batalik']),
      outcomeSummary: 'Decisive Indian victory; recapture of all Indian territory.'
    }
  });

  // ==========================================
  // OPERATIONS
  // ==========================================
  const opPolo = await prisma.operation.create({
    data: {
      slug: 'operation-polo', title: 'Operation Polo', category: 'Police Action',
      summary: 'The code name of the Hyderabad "police action".',
      content: 'A military operation in which the Indian Armed Forces invaded the State of Hyderabad and annexed it into the Indian Union.',
      status: 'Historical', dateStart: '1948-09-13', dateEnd: '1948-09-18'
    }
  });

  const opTrident = await prisma.operation.create({
    data: {
      slug: 'operation-trident', title: 'Operation Trident', category: 'Naval Strike',
      summary: 'An offensive operation launched by the Indian Navy on Pakistan\'s port city of Karachi.',
      content: 'Saw the first use of anti-ship missiles in combat in the region. Immensely successful.',
      status: 'Historical', dateStart: '1971-12-04', dateEnd: '1971-12-05',
      conflicts: { connect: [{ id: c1971.id }] }
    }
  });

  const opPython = await prisma.operation.create({
    data: {
      slug: 'operation-python', title: 'Operation Python', category: 'Naval Strike',
      summary: 'A follow-up to Operation Trident on Karachi.',
      content: 'Conducted on the night of 8/9 December 1971, causing further massive damage to the Pakistani fleet.',
      status: 'Historical', dateStart: '1971-12-08', dateEnd: '1971-12-09',
      conflicts: { connect: [{ id: c1971.id }] }
    }
  });

  const opMeghdoot = await prisma.operation.create({
    data: {
      slug: 'operation-meghdoot', title: 'Operation Meghdoot', category: 'Airborne/Alpine',
      summary: 'The operation to capture the Siachen Glacier.',
      content: 'The first assault launched in the highest battlefield in the world. Pre-empted Pakistan\'s Operation Ababeel.',
      status: 'Historical', dateStart: '1984-04-13', dateEnd: '1984-04-13',
      conflicts: { connect: [{ id: cSiachen.id }] }
    }
  });

  const opCactus = await prisma.operation.create({
    data: {
      slug: 'operation-cactus', title: 'Operation Cactus', category: 'Airborne Intervention',
      summary: 'The intervention of the Indian Armed Forces to thwart a coup in the Maldives.',
      content: 'Indian paratroopers were airlifted to Malé to restore the government of President Maumoon Abdul Gayoom.',
      status: 'Historical', dateStart: '1988-11-03', dateEnd: '1988-11-06'
    }
  });

  const opSafedSagar = await prisma.operation.create({
    data: {
      slug: 'operation-safed-sagar', title: 'Operation Safed Sagar', category: 'Air Support',
      summary: 'The Indian Air Force\'s role during the 1999 Kargil war.',
      content: 'Utilized Mirage 2000s and MiG-27s to strike high-altitude bunkers.',
      status: 'Historical', dateStart: '1999-05-26', dateEnd: '1999-07-11',
      conflicts: { connect: [{ id: cKargil.id }] }
    }
  });

  // ==========================================
  // PEOPLE
  // ==========================================
  await prisma.person.create({
    data: {
      slug: 'sam-manekshaw', title: 'Sam Manekshaw', fullName: 'Field Marshal Sam Hormusji Framji Jamshedji Manekshaw',
      summary: 'Chief of the Army Staff during the Indo-Pakistani War of 1971. First Field Marshal of India.',
      content: 'Architect of India\'s decisive victory in the 1971 war.',
      status: 'Deceased', rank: 'Field Marshal', birthDate: '1914-04-03', deathDate: '2008-06-27',
      conflicts: { connect: [{ id: c1971.id }] }, operations: { connect: [{ id: opTrident.id }, { id: opPython.id }] }
    }
  });

  await prisma.person.create({
    data: {
      slug: 'km-cariappa', title: 'K. M. Cariappa', fullName: 'Field Marshal Kodandera Madappa Cariappa',
      summary: 'First Indian Commander-in-Chief of the Indian Army.',
      content: 'Led Indian forces on the Western Front during the Indo-Pakistani War of 1947.',
      status: 'Deceased', rank: 'Field Marshal', birthDate: '1899-01-28', deathDate: '1993-05-15',
      conflicts: { connect: [{ id: c1947.id }, { id: c1965.id }] }
    }
  });

  await prisma.person.create({
    data: {
      slug: 'arjan-singh', title: 'Arjan Singh', fullName: 'Marshal of the Indian Air Force Arjan Singh',
      summary: 'The only officer of the IAF to be promoted to five-star rank.',
      content: 'Led the IAF during the 1965 war with distinction despite massive initial setbacks.',
      status: 'Deceased', rank: 'Marshal of the Air Force', birthDate: '1919-04-15', deathDate: '2017-09-16',
      conflicts: { connect: [{ id: c1965.id }] }
    }
  });

  await prisma.person.create({
    data: {
      slug: 'abdul-hamid', title: 'Abdul Hamid', fullName: 'Company Quartermaster Havildar Abdul Hamid, PVC',
      summary: 'Posthumously awarded the Param Vir Chakra for actions in the 1965 war.',
      content: 'Single-handedly destroyed multiple Pakistani Patton tanks during the Battle of Asal Uttar.',
      status: 'Killed in Action', rank: 'CQMH', birthDate: '1933-07-01', deathDate: '1965-09-10',
      conflicts: { connect: [{ id: c1965.id }] }
    }
  });

  await prisma.person.create({
    data: {
      slug: 'vikram-batra', title: 'Vikram Batra', fullName: 'Captain Vikram Batra, PVC',
      summary: 'Param Vir Chakra recipient for heroism during the Kargil War.',
      content: 'Famous for his signal "Yeh Dil Maange More!" after capturing Point 5140.',
      status: 'Killed in Action', rank: 'Captain', birthDate: '1974-09-09', deathDate: '1999-07-07',
      conflicts: { connect: [{ id: cKargil.id }] }
    }
  });

  await prisma.person.create({
    data: {
      slug: 'nirmal-jit-singh-sekhon', title: 'Nirmal Jit Singh Sekhon', fullName: 'Flying Officer Nirmal Jit Singh Sekhon, PVC',
      summary: 'The only IAF officer to be awarded the Param Vir Chakra.',
      content: 'Defended the Srinagar air base against a PAF Sabre raid in 1971 in his Folland Gnat.',
      status: 'Killed in Action', rank: 'Flying Officer', birthDate: '1943-07-17', deathDate: '1971-12-14',
      conflicts: { connect: [{ id: c1971.id }] }
    }
  });

  // ==========================================
  // EQUIPMENT (Air, Naval, Land, Missiles)
  // ==========================================
  await prisma.equipment.create({
    data: {
      slug: 'hal-tejas', title: 'HAL Tejas', domain: 'Air', category: 'Multirole Fighter',
      summary: 'Indigenous 4.5 generation light combat aircraft.',
      status: 'Active', developmentModel: 'Indigenous', serviceStatus: 'Active',
      inductedYear: 2015, originCountries: JSON.stringify(['India']), specs: JSON.stringify({ speed: 'Mach 1.8' })
    }
  });

  await prisma.equipment.create({
    data: {
      slug: 'sukhoi-su30mki', title: 'Sukhoi Su-30MKI', domain: 'Air', category: 'Air Superiority Fighter',
      summary: 'Heavy, all-weather, long-range fighter which forms the backbone of the IAF.',
      status: 'Active', developmentModel: 'Joint Venture/Licensed', serviceStatus: 'Active',
      inductedYear: 2002, originCountries: JSON.stringify(['Russia', 'India']), specs: JSON.stringify({ speed: 'Mach 2.0', payload: '8000kg' })
    }
  });
  
  await prisma.equipment.create({
    data: {
      slug: 'mirage-2000', title: 'Mirage 2000', domain: 'Air', category: 'Multirole Fighter',
      summary: 'French-origin delta wing fighter that was crucial in the Kargil war.',
      status: 'Active', developmentModel: 'Procured', serviceStatus: 'Active',
      inductedYear: 1985, originCountries: JSON.stringify(['France']), specs: JSON.stringify({ speed: 'Mach 2.2' }),
      conflicts: { connect: [{ id: cKargil.id }] }
    }
  });

  await prisma.equipment.create({
    data: {
      slug: 'ins-vikramaditya', title: 'INS Vikramaditya', domain: 'Naval', category: 'Aircraft Carrier',
      summary: 'Flagship aircraft carrier of the Indian Navy.',
      status: 'Active', developmentModel: 'Procured/Modified', serviceStatus: 'Active',
      inductedYear: 2013, originCountries: JSON.stringify(['Russia']), specs: JSON.stringify({ displacement: '45,400 tonnes' })
    }
  });

  await prisma.equipment.create({
    data: {
      slug: 'ins-arihant', title: 'INS Arihant', domain: 'Naval', category: 'SSBN Submarine',
      summary: 'India\'s first indigenously designed and built nuclear-powered ballistic missile submarine.',
      status: 'Active', developmentModel: 'Indigenous', serviceStatus: 'Active',
      inductedYear: 2016, originCountries: JSON.stringify(['India']), specs: JSON.stringify({ displacement: '6,000 tonnes' })
    }
  });

  await prisma.equipment.create({
    data: {
      slug: 'arjun-mbt', title: 'Arjun MBT', domain: 'Land', category: 'Main Battle Tank',
      summary: 'Third generation main battle tank developed by DRDO.',
      status: 'Active', developmentModel: 'Indigenous', serviceStatus: 'Active',
      inductedYear: 2004, originCountries: JSON.stringify(['India']), specs: JSON.stringify({ mainGun: '120mm rifled', weight: '68 tonnes' })
    }
  });

  await prisma.equipment.create({
    data: {
      slug: 't90-bhishma', title: 'T-90 Bhishma', domain: 'Land', category: 'Main Battle Tank',
      summary: 'Russian-origin third generation main battle tank, heavily used by the Indian Army.',
      status: 'Active', developmentModel: 'Licensed', serviceStatus: 'Active',
      inductedYear: 2001, originCountries: JSON.stringify(['Russia', 'India']), specs: JSON.stringify({ mainGun: '125mm smoothbore' })
    }
  });

  await prisma.equipment.create({
    data: {
      slug: 'brahmos', title: 'BrahMos', domain: 'Missiles', category: 'Supersonic Cruise Missile',
      summary: 'The world\'s fastest anti-ship cruise missile in operation.',
      status: 'Active', developmentModel: 'Joint Venture', serviceStatus: 'Active',
      inductedYear: 2005, originCountries: JSON.stringify(['India', 'Russia']), specs: JSON.stringify({ speed: 'Mach 3.0', range: '500+ km' })
    }
  });

  await prisma.equipment.create({
    data: {
      slug: 'agni-v', title: 'Agni-V', domain: 'Missiles', category: 'ICBM',
      summary: 'Intercontinental ballistic missile developed by DRDO.',
      status: 'Active', developmentModel: 'Indigenous', serviceStatus: 'Active',
      inductedYear: 2018, originCountries: JSON.stringify(['India']), specs: JSON.stringify({ range: '5,000-8,000 km', payload: 'Nuclear' })
    }
  });

  await prisma.equipment.create({
    data: {
      slug: 'pinaka-mbrl', title: 'Pinaka MBRL', domain: 'Land', category: 'Artillery',
      summary: 'Multiple rocket launcher produced in India for the Indian Army.',
      status: 'Active', developmentModel: 'Indigenous', serviceStatus: 'Active',
      inductedYear: 1998, originCountries: JSON.stringify(['India']), specs: JSON.stringify({ range: '40-75 km' }),
      conflicts: { connect: [{ id: cKargil.id }] }
    }
  });

  console.log("Database seeded with EXHAUSTIVE real data successfully.");
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
