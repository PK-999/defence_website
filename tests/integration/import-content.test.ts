import { afterAll, describe, expect, it } from "vitest";
import { PrismaClient } from "@prisma/client";
import { importContent } from "@/lib/import/service";

const db = new PrismaClient();

const input = {
  schemaVersion: 1,
  sourceSystem: "integration-fixture",
  records: [{
    entityType: "Conflict",
    externalId: "imported-conflict-1",
    data: {
      slug: "imported-conflict-1",
      title: "Imported Fixture Conflict",
      summary: "Synthetic imported record.",
      dateStart: "26-07-1999",
      theatres: ["Test range"],
    },
  }],
};

describe("content import service", () => {
  it("validates without touching the database, then applies a draft and is idempotent", async () => {
    const before = await db.conflict.count();
    const validation = await importContent(input, "validate");
    expect(validation.status).toBe("VALIDATED");
    expect(await db.conflict.count()).toBe(before);

    const applied = await importContent(input, "apply", { client: db, databaseUrl: process.env.DATABASE_URL });
    expect(applied.status).toBe("APPLIED");
    expect(applied.proposedCreates).toBe(1);
    expect((await db.conflict.findUnique({ where: { slug: "imported-conflict-1" } }))?.publicationStatus).toBe("DRAFT");

    const unchanged = await importContent(input, "apply", { client: db, databaseUrl: process.env.DATABASE_URL });
    expect(unchanged.status).toBe("UNCHANGED");

    const changedSlug = { ...input, records: [{ ...input.records[0], data: { ...input.records[0].data, slug: "imported-conflict-renamed" } }] };
    const identityReplay = await importContent(changedSlug, "apply", { client: db, databaseUrl: process.env.DATABASE_URL });
    expect(identityReplay.unchanged).toBe(1);
    expect(await db.conflict.findUnique({ where: { slug: "imported-conflict-renamed" } })).toBeNull();
  });

  it("rejects a malformed later row without applying the earlier valid row or deleting evidence", async () => {
    const evidenceBefore = await db.evidence.count();
    const malformedBatch = {
      schemaVersion: 1,
      sourceSystem: "integration-rollback-fixture",
      records: [
        {
          entityType: "Conflict",
          externalId: "rollback-valid-conflict",
          data: { slug: "rollback-valid-conflict", title: "Rollback Valid Conflict", summary: "Must not be written.", dateStart: "1999", theatres: [] },
        },
        {
          entityType: "Operation",
          externalId: "rollback-invalid-operation",
          data: { slug: "rollback-invalid-operation", title: "Rollback Invalid Operation", summary: "Missing date and category." },
        },
      ],
    };

    const rejected = await importContent(malformedBatch, "apply", { client: db, databaseUrl: process.env.DATABASE_URL });
    expect(rejected.status).toBe("REJECTED");
    expect(rejected.errors.length).toBeGreaterThan(0);
    expect(await db.conflict.findUnique({ where: { slug: "rollback-valid-conflict" } })).toBeNull();
    expect(await db.evidence.count()).toBe(evidenceBefore);
    expect(await db.importRun.count({ where: { inputHash: rejected.inputHash } })).toBe(0);
  });
});

afterAll(async () => {
  await db.$disconnect();
});
