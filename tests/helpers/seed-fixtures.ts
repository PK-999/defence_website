import type { PrismaClient, Prisma } from "@prisma/client";

const reviewedAt = new Date("2000-01-01T00:00:00.000Z");
const syntheticText = "This record exists only in an isolated automated test database.";

type Database = PrismaClient | Prisma.TransactionClient;

async function clearFixtureData(db: Database): Promise<void> {
  await db.searchAlias.deleteMany();
  await db.searchDocument.deleteMany();
  await db.entityFacet.deleteMany();
  await db.entityEvidence.deleteMany();
  await db.relationshipEvidence.deleteMany();
  await db.claimEvidence.deleteMany();
  await db.importProposal.deleteMany();
  await db.importIdentity.deleteMany();
  await db.importRun.deleteMany();
  await db.reviewAudit.deleteMany();
  await db.media.deleteMany();
  await db.entityAlias.deleteMany();
  await db.relationship.deleteMany();
  await db.claim.deleteMany();
  await db.evidence.deleteMany();
  await db.sourceVersion.deleteMany();
  await db.source.deleteMany();
  await db.sourceFamily.deleteMany();
  await db.unit.deleteMany();
  await db.equipment.deleteMany();
  await db.person.deleteMany();
  await db.operation.deleteMany();
  await db.conflict.deleteMany();
}

export async function seedLegacyFixtures(db: PrismaClient): Promise<void> {
  await db.$transaction(async (tx) => {
    await clearFixtureData(tx);

    const conflict = await tx.conflict.create({
      data: {
        slug: "fixture-conflict", title: "Fixture Conflict",
        summary: "Synthetic test conflict; never publish as historical content.", content: syntheticText,
        status: "Published", dateStart: "1999-01-01", dateEnd: "1999-01-03",
        dateStartPrecision: "day", dateEndPrecision: "day", theatres: JSON.stringify(["Test range"]),
        publicationStatus: "PUBLISHED", contentKind: "EDITORIAL", reviewedAt, reviewedBy: "fixture-reviewer", revision: 1,
      },
    });
    await tx.conflict.create({
      data: {
        slug: "fixture-conflict-other", title: "Fixture Other Conflict", summary: "Synthetic second conflict.", content: syntheticText,
        status: "Published", dateStart: "1998-01-01", theatres: JSON.stringify(["Test range"]),
        publicationStatus: "PUBLISHED", contentKind: "EDITORIAL", reviewedAt, reviewedBy: "fixture-reviewer", revision: 1,
      },
    });
    await tx.conflict.create({
      data: {
        slug: "fixture-conflict-draft", title: "Fixture Draft Conflict", summary: "Hidden synthetic draft.", content: syntheticText,
        status: "Published", dateStart: "1997", theatres: JSON.stringify(["Test range"]), publicationStatus: "DRAFT",
      },
    });

    const operation = await tx.operation.create({
      data: {
        slug: "fixture-operation", title: "Fixture Operation", category: "event",
        summary: "Synthetic test operation; never publish as historical content.", content: syntheticText,
        status: "Published", dateStart: "1999-01-02", dateEnd: "1999-01-02", dateStartPrecision: "day", dateEndPrecision: "day",
        publicationStatus: "PUBLISHED", contentKind: "EDITORIAL", reviewedAt, reviewedBy: "fixture-reviewer", revision: 1,
        conflicts: { connect: { id: conflict.id } },
      },
    });
    await tx.operation.create({
      data: {
        slug: "fixture-operation-other", title: "Fixture Other Operation", category: "humanitarian", summary: "Synthetic second operation.",
        content: syntheticText, status: "Published", dateStart: "1998-01-02", publicationStatus: "PUBLISHED", contentKind: "EDITORIAL",
        reviewedAt, reviewedBy: "fixture-reviewer", revision: 1,
      },
    });
    await tx.operation.create({
      data: {
        slug: "fixture-operation-draft", title: "Fixture Draft Operation", category: "other", summary: "Hidden synthetic draft.",
        content: syntheticText, status: "Published", dateStart: "1997", publicationStatus: "DRAFT",
      },
    });

    const personIds: string[] = [];
    for (let index = 1; index <= 55; index += 1) {
      const person = await tx.person.create({
        data: {
          slug: `fixture-person-${String(index).padStart(3, "0")}`,
          title: `Fixture Person ${String(index).padStart(3, "0")}`,
          fullName: `Fixture Person ${String(index).padStart(3, "0")}`,
          summary: "Synthetic test person; never publish as a historical profile.", content: syntheticText,
          status: "Published", serviceBranch: "Test service", year: "1999", birthDatePrecision: "unknown", deathDatePrecision: "unknown",
          publicationStatus: "PUBLISHED", contentKind: "EDITORIAL", reviewedAt, reviewedBy: "fixture-reviewer", revision: 1,
          conflicts: index <= 2 ? { connect: { id: conflict.id } } : undefined,
          operations: index === 1 ? { connect: { id: operation.id } } : undefined,
        },
      });
      personIds.push(person.id);
    }
    const draftPerson = await tx.person.create({
      data: { slug: "fixture-person-draft", title: "Fixture Draft Person", fullName: "Fixture Draft Person", summary: "Hidden synthetic draft.", content: syntheticText, status: "Published", publicationStatus: "DRAFT" },
    });
    await tx.person.create({
      data: { slug: "fixture-person-withdrawn", title: "Fixture Withdrawn Person", fullName: "Fixture Withdrawn Person", summary: "Hidden synthetic withdrawn record.", content: syntheticText, status: "Published", publicationStatus: "WITHDRAWN" },
    });
    await tx.person.create({
      data: { slug: "fixture-person-demo", title: "Fixture Demo Person", fullName: "Fixture Demo Person", summary: "Hidden synthetic demo record.", content: syntheticText, status: "Published", publicationStatus: "PUBLISHED", contentKind: "DEMO" },
    });

    const equipmentA = await tx.equipment.create({
      data: {
        slug: "fixture-system-a", title: "Fixture System A", domain: "land", category: "test", summary: "Synthetic test equipment.", content: syntheticText,
        status: "Published", developmentModel: "indigenous", serviceStatus: "active", originCountries: JSON.stringify(["Test country"]),
        specs: JSON.stringify({ "combat-radius": "500 km", "ferry-range": "1,800 km" }), publicationStatus: "PUBLISHED", contentKind: "EDITORIAL",
        reviewedAt, reviewedBy: "fixture-reviewer", revision: 1, variantLabel: "Fixture variant A", statusAsOf: "2000-01-01",
      },
    });
    const equipmentB = await tx.equipment.create({
      data: {
        slug: "fixture-system-b", title: "Fixture System B", domain: "air", category: "test", summary: "Synthetic test equipment.", content: syntheticText,
        status: "Published", developmentModel: "joint-development", serviceStatus: "limited", originCountries: JSON.stringify(["Test country"]),
        specs: JSON.stringify({ "ferry-range": "2,000 km" }), publicationStatus: "PUBLISHED", contentKind: "EDITORIAL",
        reviewedAt, reviewedBy: "fixture-reviewer", revision: 1, variantLabel: "Fixture variant B", statusAsOf: "2000-01-01",
      },
    });
    await tx.equipment.create({
      data: {
        slug: "fixture-system-draft", title: "Fixture Draft System", domain: "unknown", category: "test", summary: "Hidden synthetic draft.", content: syntheticText,
        status: "Published", developmentModel: "unknown", serviceStatus: "unknown", originCountries: JSON.stringify([]), specs: JSON.stringify({}), publicationStatus: "DRAFT",
      },
    });

    const family = await tx.sourceFamily.create({ data: { slug: "fixture-family", name: "Fixture Source Family", tier: "A", description: syntheticText } });
    const source = await tx.source.create({
      data: {
        sourceFamilyId: family.id, slug: "fixture-source", title: "Fixture Source", summary: syntheticText, publisher: "Fixture Publisher", author: "Fixture Author",
        publicationDate: "1999", canonicalUrl: "https://example.test/sentinel-source", sourceType: "official-report", tier: "A", language: "en",
        rightsNotes: "Synthetic text permitted for tests.", publicationStatus: "PUBLISHED", contentKind: "EDITORIAL", reviewedAt, reviewedBy: "fixture-reviewer", revision: 1,
      },
    });
    await tx.source.create({
      data: {
        sourceFamilyId: family.id, slug: "fixture-source-draft", title: "Fixture Draft Source", summary: syntheticText,
        publisher: "Fixture Publisher", canonicalUrl: "https://example.test/draft", sourceType: "other", tier: "DISCOVERY", publicationStatus: "DRAFT",
      },
    });
    const version = await tx.sourceVersion.create({
      data: {
        sourceId: source.id, versionTag: "Fixture snapshot", accessedAt: reviewedAt, url: "https://example.test/sentinel-source", format: "text",
        contentHash: "fixture-hash", rawStoragePath: ".test-data/fixture-source.txt", parserVersion: "fixture-1", httpStatus: 200,
      },
    });
    const evidence = await tx.evidence.create({
      data: {
        sourceVersionId: version.id, locator: "sentence1", quote: "This is synthetic test evidence.", evidenceType: "TEXT", rightsSafeToDisplay: true,
        authorityType: "technical-first-party", authorityBasis: "Synthetic fixture classification.",
      },
    });
    await tx.claim.create({
      data: {
        entityType: "Person", entityId: personIds[0], property: "summary", value: "Synthetic test person", verificationStatus: "MULTIPLE_CREDIBLE_SOURCES",
        status: "GOLD", editorialNote: "Synthetic fixture claim.", reviewedAt, reviewedBy: "fixture-reviewer", revision: 1, evidence: { create: { evidenceId: evidence.id } },
      },
    });
    const restrictedEvidence = await tx.evidence.create({
      data: { sourceVersionId: version.id, locator: "sentence2", quote: "Restricted synthetic quote.", evidenceType: "TEXT", rightsSafeToDisplay: false, authorityType: "scholarly", authorityBasis: "Synthetic fixture classification." },
    });
    await tx.claim.create({
      data: {
        entityType: "Person", entityId: personIds[0], property: "restrictedQuote", value: "Restricted synthetic claim", verificationStatus: "DECLASSIFIED_RECORD",
        status: "GOLD", editorialNote: "Restricted fixture claim.", reviewedAt, reviewedBy: "fixture-reviewer", revision: 1, evidence: { create: { evidenceId: restrictedEvidence.id } },
      },
    });
    const draftSource = await tx.source.findUniqueOrThrow({ where: { slug: "fixture-source-draft" } });
    const draftVersion = await tx.sourceVersion.create({ data: { sourceId: draftSource.id, versionTag: "Draft fixture snapshot", accessedAt: reviewedAt, url: "https://example.test/draft", format: "text" } });
    const draftEvidence = await tx.evidence.create({ data: { sourceVersionId: draftVersion.id, locator: "sentence1", quote: "Draft source quote.", evidenceType: "TEXT", rightsSafeToDisplay: true, authorityType: "discovery" } });
    await tx.claim.create({
      data: {
        entityType: "Person", entityId: personIds[0], property: "draftSourceOnly", value: "Draft source claim", verificationStatus: "UNVERIFIED",
        status: "GOLD", reviewedAt, reviewedBy: "fixture-reviewer", revision: 1, evidence: { create: { evidenceId: draftEvidence.id } },
      },
    });
    await tx.claim.create({
      data: { entityType: "Person", entityId: personIds[0], property: "candidateOnly", value: "Candidate claim", verificationStatus: "UNVERIFIED", status: "CANDIDATE" },
    });
    await tx.claim.create({
      data: { entityType: "Person", entityId: personIds[0], property: "rejectedOnly", value: "Rejected claim", verificationStatus: "DISPUTED", status: "REJECTED", reviewedAt, reviewedBy: "fixture-reviewer" },
    });
    await tx.entityEvidence.create({ data: { entityType: "Person", entityId: personIds[0], section: "content", evidenceId: evidence.id } });
    await tx.relationship.create({
      data: {
        sourceType: "Person", sourceId: personIds[0], targetType: "Operation", targetId: operation.id, predicate: "PARTICIPATED_IN",
        status: "GOLD", reviewedAt, reviewedBy: "fixture-reviewer", revision: 1, fingerprint: "fixture-person-001-participated-in-fixture-operation",
        evidence: { create: { evidenceId: evidence.id } },
      },
    });
    await tx.entityAlias.createMany({
      data: [
        { entityType: "Equipment", entityId: equipmentA.id, alias: "Fixture Falcon", normalizedAlias: "fixture falcon", type: "Test" },
        { entityType: "Equipment", entityId: equipmentB.id, alias: "Fixture Falcon", normalizedAlias: "fixture falcon", type: "Test" },
        { entityType: "Person", entityId: draftPerson.id, alias: "Fixture Secret", normalizedAlias: "fixture secret", type: "Test" },
      ],
    });
    await tx.unit.create({
      data: { slug: "fixture-unit", title: "Fixture Unit", summary: "Synthetic test unit.", content: syntheticText, serviceId: "test-service", unitType: "test", publicationStatus: "PUBLISHED", contentKind: "EDITORIAL", reviewedAt, reviewedBy: "fixture-reviewer", revision: 1 },
    });
    await tx.unit.create({ data: { slug: "fixture-unit-draft", title: "Fixture Draft Unit", summary: "Hidden synthetic draft.", unitType: "test", publicationStatus: "DRAFT" } });
  });
}
