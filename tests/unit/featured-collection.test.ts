import type { PrismaClient } from "@prisma/client";
import { describe, expect, it } from "vitest";
import { getFeaturedCollection } from "@/lib/repositories/collections";

function fakeDatabase(publicSlug: string | null): PrismaClient {
  const findFirst = async ({ where }: { where: { slug?: string } }) => where.slug === publicSlug ? { id: "public-fixture" } : null;
  return {
    conflict: { findFirst },
    operation: { findFirst },
    person: { findFirst },
    equipment: { findFirst },
    unit: { findFirst },
    source: { findFirst },
  } as unknown as PrismaClient;
}

describe("featured collection manifests", () => {
  it("selects the newest manifest with a public entity", async () => {
    await expect(getFeaturedCollection(fakeDatabase("indo-pakistani-war-1971"))).resolves.toMatchObject({
      slug: "war-1971",
      href: "/conflicts/indo-pakistani-war-1971",
    });
  });

  it("does not feature a manifest when every referenced entity is private", async () => {
    await expect(getFeaturedCollection(fakeDatabase(null))).resolves.toBeNull();
  });
});
