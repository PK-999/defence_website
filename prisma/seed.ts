import { PrismaClient } from '@prisma/client';
import { assertDestructiveSeedAllowed } from '../scripts/lib/test-database';

const prisma = new PrismaClient();

async function main() {
  assertDestructiveSeedAllowed();
  console.log('Clearing database...');
  await prisma.claim.deleteMany();
  await prisma.evidence.deleteMany();
  await prisma.sourceVersion.deleteMany();
  await prisma.source.deleteMany();
  await prisma.sourceFamily.deleteMany();
  await prisma.person.deleteMany();
  await prisma.operation.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.conflict.deleteMany();

  console.log('Seeding Conflicts...');
  const kargil = await prisma.conflict.create({
    data: {
      title: 'Kargil War 1999',
      slug: 'kargil-1999',
      dateStart: '1999-05-03',
      dateEnd: '1999-07-26',
      summary: 'An armed conflict between India and Pakistan that took place in the Kargil district of Kashmir.',
      contextSummary: 'Pakistani forces and Kashmiri militants infiltrated into positions on the Indian side of the LOC.',
      outcomeSummary: 'India successfully recaptured all positions infiltrated by Pakistani forces. Decisive Indian military victory.',
      content: 'The Kargil War (Operation Vijay) was a significant high-altitude mountain warfare conflict. The IAF launched Operation Safed Sagar, while the Navy initiated Operation Talwar to blockade Pakistani ports. The Indian Army\'s infantry, supported by Bofors artillery, fought grueling battles to retake peaks like Tololing and Tiger Hill.',
      theatres: '["Kashmir", "Batalik", "Drass", "Kaksar", "Mushkoh Valley"]',
      status: 'Published'
    }
  });

  await prisma.conflict.create({
    data: {
      title: 'Indo-Pakistani War of 1971',
      slug: 'indo-pak-1971',
      dateStart: '1971-12-03',
      dateEnd: '1971-12-16',
      summary: 'A military confrontation that resulted in the creation of Bangladesh.',
      contextSummary: 'The Bangladesh Liberation War led to millions of refugees pouring into India, prompting Indian intervention.',
      outcomeSummary: 'Decisive Indian victory, creation of independent Bangladesh, and the surrender of over 90,000 Pakistani troops.',
      content: 'The 1971 war was a swift and decisive conflict. In the east, the Indian Army and Mukti Bahini outflanked Pakistani defenses, racing to Dhaka. In the west, the IAF dominated the skies, and the Navy launched Operation Trident and Python, heavily damaging the Karachi port. The war ended with the signing of the Instrument of Surrender on 16 December 1971.',
      theatres: '["Eastern Front (East Pakistan)", "Western Front (India-West Pakistan Border)", "Arabian Sea", "Bay of Bengal"]',
      status: 'Published'
    }
  });

  console.log('Seeding Equipment...');
  await prisma.equipment.create({
    data: {
      title: 'HAL Tejas',
      slug: 'hal-tejas',
      domain: 'Air',
      category: 'Fighter Aircraft',
      summary: 'An Indian single-engine, delta wing, light multirole fighter.',
      status: 'Active',
      developmentModel: 'Indigenous',
      serviceStatus: 'Deployed',
      content: 'The HAL Tejas is an Indian, single engine, delta wing, light multirole fighter designed by the Aeronautical Development Agency (ADA) in collaboration with Aircraft Research and Design Centre (ARDC) of Hindustan Aeronautics Limited (HAL) for the Indian Air Force and Indian Navy. It came from the Light Combat Aircraft (LCA) programme, which began in the 1980s to replace India\'s ageing MiG-21 fighters.',
      specs: JSON.stringify([
        { label: "Top Speed", value: "Mach 1.8", unit: "" },
        { label: "Range", value: "1,850", unit: "km" },
        { label: "Service Ceiling", value: "16,000", unit: "m" }
      ]),
      originCountries: '["India"]'
    }
  });

  await prisma.equipment.create({
    data: {
      title: 'Mirage 2000',
      slug: 'mirage-2000',
      domain: 'Air',
      category: 'Fighter Aircraft',
      summary: 'French multirole, single-engine fourth-generation jet fighter.',
      status: 'Active',
      developmentModel: 'Imported',
      serviceStatus: 'Deployed',
      content: 'The Dassault Mirage 2000 is a French multirole, single-engine fourth-generation jet fighter. The Indian Air Force extensively used Mirage 2000s during the 1999 Kargil War to drop laser-guided bombs on high-altitude Pakistani bunkers, proving to be a game-changer in the conflict.',
      specs: JSON.stringify([
        { label: "Top Speed", value: "Mach 2.2", unit: "" },
        { label: "Combat Range", value: "1,550", unit: "km" }
      ]),
      originCountries: '["France"]'
    }
  });

  console.log('Seeding People...');
  await prisma.person.create({
    data: {
      title: 'Capt. Vikram Batra',
      fullName: 'Vikram Batra',
      slug: 'vikram-batra',
      rank: 'Captain',
      status: 'Published',
      summary: 'Officer of the Indian Army, awarded the Param Vir Chakra posthumously for his actions during the 1999 Kargil War.',
      content: 'Captain Vikram Batra, PVC (9 September 1974 – 7 July 1999) was an officer of the Indian Army. He was posthumously awarded the Param Vir Chakra, India\'s highest and most prestigious award for valour, for his actions during the 1999 Kargil War in Kashmir between India and Pakistan. He led one of the toughest operations in mountain warfare in Indian history. His famous battle cry was "Yeh Dil Maange More!".',
      birthDate: '1974-09-09',
      deathDate: '1999-07-07'
    }
  });

  await prisma.person.create({
    data: {
      title: 'Field Marshal Sam Manekshaw',
      fullName: 'Sam Hormusji Framji Jamshedji Manekshaw',
      slug: 'sam-manekshaw',
      rank: 'Field Marshal',
      status: 'Published',
      summary: 'Chief of the Army Staff of the Indian Army during the Indo-Pakistani War of 1971.',
      content: 'Field Marshal Sam Hormusji Framji Jamshedji Manekshaw, MC (3 April 1914 – 27 June 2008), was the Chief of the Army Staff of the Indian Army during the Indo-Pakistani War of 1971, and the first Indian Army officer to be promoted to the rank of field marshal. Under his command, Indian forces conducted victorious campaigns against Pakistan in the 1971 war that led to the liberation of Bangladesh.',
      birthDate: '1914-04-03',
      deathDate: '2008-06-27'
    }
  });

  console.log('Seeding Operations...');
  await prisma.operation.create({
    data: {
      title: 'Operation Safed Sagar',
      slug: 'safed-sagar',
      category: 'Air Support',
      status: 'Published',
      dateStart: '1999-05-26',
      dateEnd: '1999-07-11',
      summary: 'The Indian Air Force\'s role in acting jointly with Indian Army ground troops during the Kargil war.',
      content: 'Operation Safed Sagar (White Sea) was the code name assigned to the Indian Air Force\'s role in acting jointly with Indian Army ground troops during the 1999 Kargil war that was aimed at flushing out Regular and Irregular troops of the Pakistani Army from vacated Indian Positions in the Kargil sector along the Line of Control. It was the first large scale use of airpower in the Jammu and Kashmir region since the Indo-Pakistani War of 1971.'
    }
  });

  await prisma.operation.create({
    data: {
      title: 'Operation Trident',
      slug: 'trident',
      category: 'Naval Offensive',
      status: 'Published',
      dateStart: '1971-12-04',
      dateEnd: '1971-12-05',
      summary: 'An offensive operation launched by the Indian Navy on Pakistan\'s port city of Karachi.',
      content: 'Operation Trident was an offensive operation launched by the Indian Navy on Pakistan\'s port city of Karachi during the Indo-Pakistani War of 1971. Operation Trident saw the first use of anti-ship missiles in combat in the region. The operation was a massive success, heavily damaging Pakistani naval assets with zero Indian casualties.'
    }
  });

  console.log('Seeding Provenance Claims...');
  const fam = await prisma.sourceFamily.create({
    data: {
      name: 'Ministry of Defence',
      slug: 'mod',
      tier: 'A',
      description: 'Official reports'
    }
  });

  const src = await prisma.source.create({
    data: {
      title: 'Kargil Review Committee Report',
      slug: 'krc-1999',
      author: 'KRC',
      sourceFamilyId: fam.id
    }
  });

  const ver = await prisma.sourceVersion.create({
    data: {
      sourceId: src.id,
      versionTag: 'Final 2000'
    }
  });

  const claim = await prisma.claim.create({
    data: {
      entityId: kargil.id,
      entityType: 'Conflict',
      property: 'casualtyCount',
      value: '527 Indian soldiers KIA',
      status: 'GOLD',
      verificationStatus: 'OFFICIALLY_CONFIRMED'
    }
  });

  const ev = await prisma.evidence.create({
    data: {
      sourceVersionId: ver.id,
      quote: 'The total number of Indian soldiers killed in the conflict was 527.',
      locator: 'Chapter 4, Page 45'
    }
  });

  await prisma.claimEvidence.create({
    data: {
      claimId: claim.id,
      evidenceId: ev.id
    }
  });

  console.log('Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
