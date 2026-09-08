import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { PrismaClient } from "@prisma/client";
import { getEditorialPrincipal, isPrincipalAuthorized } from "@/lib/auth/principals";

const db = new PrismaClient();

describe("editorial principals", () => {
  beforeEach(async () => {
    await db.editorialPrincipal.deleteMany();
    await db.editorialPrincipal.create({
      data: {
        displayName: "Puneeth Kakarla",
        email: "puneethkakarla@gmail.com",
        issuer: "https://issuer.example",
        subject: "puneeth-subject",
        rolesJson: JSON.stringify(["REVIEWER", "PUBLISHER"]),
        active: true,
      },
    });
  });

  it("returns Puneeth's both-role principal for an exact issuer and subject", async () => {
    const principal = await getEditorialPrincipal({ issuer: "https://issuer.example", subject: "puneeth-subject" }, db);
    expect(principal).toMatchObject({ displayName: "Puneeth Kakarla", email: "puneethkakarla@gmail.com", roles: ["REVIEWER", "PUBLISHER"] });
    expect(isPrincipalAuthorized(principal, "PUBLISHER")).toBe(true);
    expect(isPrincipalAuthorized(principal, "REVIEWER")).toBe(true);
  });

  it("denies missing, inactive, or mismatched principals", async () => {
    expect(await getEditorialPrincipal({ issuer: "https://issuer.example", subject: "wrong" }, db)).toBeNull();
    await db.editorialPrincipal.updateMany({ data: { active: false } });
    const inactive = await getEditorialPrincipal({ issuer: "https://issuer.example", subject: "puneeth-subject" }, db);
    expect(inactive).toBeNull();
    expect(isPrincipalAuthorized(inactive, "REVIEWER")).toBe(false);
  });

  it("does not let a single-role principal cross the review/publish boundary", async () => {
    await db.editorialPrincipal.updateMany({ data: { rolesJson: JSON.stringify(["REVIEWER"]) } });
    const reviewer = await getEditorialPrincipal({ issuer: "https://issuer.example", subject: "puneeth-subject" }, db);
    expect(isPrincipalAuthorized(reviewer, "REVIEWER")).toBe(true);
    expect(isPrincipalAuthorized(reviewer, "PUBLISHER")).toBe(false);
  });
});

afterAll(async () => {
  await db.$disconnect();
});
