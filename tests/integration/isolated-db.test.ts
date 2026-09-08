import { PrismaClient } from "@prisma/client";
import { afterAll, describe, expect, test } from "vitest";

const databaseUrl = process.env.DATABASE_URL ?? "";
const db = new PrismaClient();

afterAll(async () => db.$disconnect());

describe("isolated integration database", () => {
  test("uses the guarded disposable URL and seeded synthetic records", async () => {
    expect(databaseUrl).toMatch(/^file:.+\.test-data\/integration\.db$/);
    await expect(db.conflict.findUnique({ where: { slug: "fixture-conflict" } })).resolves.toMatchObject({
      title: "Fixture Conflict",
      summary: expect.stringContaining("Synthetic"),
    });
    await expect(db.person.findUnique({ where: { slug: "fixture-person-001" } })).resolves.toMatchObject({
      fullName: "Fixture Person 001",
    });
  });
});
