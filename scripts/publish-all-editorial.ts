import { PrismaClient } from "@prisma/client";
import { reconcileSearchIndex } from "../src/lib/search/service";

const ACTOR = "owner-requested-bulk-release-2026-09-12";
const REASON = "Owner-requested bulk release of pre-existing editorial records. Source and evidence completeness remains visible for follow-up review.";

const entities = [
  ["Conflict", "conflict"],
  ["Operation", "operation"],
  ["Person", "person"],
  ["Equipment", "equipment"],
  ["Source", "source"],
] as const;

type EntityType = (typeof entities)[number][0];

function assertConfirmation(): void {
  if (process.env.PUBLISH_ALL_CONFIRM !== "I_UNDERSTAND") {
    throw new Error("PUBLISH_ALL_CONFIRM_REQUIRED: set PUBLISH_ALL_CONFIRM=I_UNDERSTAND to release editorial records.");
  }
}

async function main(): Promise<void> {
  assertConfirmation();
  const db = new PrismaClient();
  const published: Record<string, number> = {};

  try {
    const now = new Date();
    await db.$transaction(async (tx) => {
      for (const [type, model] of entities) {
        const delegate = tx[model] as unknown as {
          findMany: (args: unknown) => Promise<Array<{ id: string; publicationStatus: string; revision: number }>>;
          update: (args: unknown) => Promise<unknown>;
        };
        const rows = await delegate.findMany({
          where: { contentKind: "EDITORIAL", publicationStatus: { not: "PUBLISHED" } },
          select: { id: true, publicationStatus: true, revision: true },
        });
        published[type] = rows.length;
        for (const row of rows) {
          await delegate.update({
            where: { id: row.id },
            data: {
              publicationStatus: "PUBLISHED",
              reviewedAt: now,
              reviewedBy: ACTOR,
              revision: { increment: 1 },
            },
          });
          await tx.reviewAudit.create({
            data: {
              actorId: ACTOR,
              action: "BULK_PUBLISH",
              entityType: type satisfies EntityType,
              entityId: row.id,
              previousValue: JSON.stringify({ publicationStatus: row.publicationStatus, revision: row.revision }),
              nextValue: JSON.stringify({ publicationStatus: "PUBLISHED", revision: row.revision + 1 }),
              reason: REASON,
            },
          });
        }
      }
    }, { maxWait: 10_000, timeout: 120_000 });

    const indexed = await reconcileSearchIndex(db);
    console.log(JSON.stringify({ actor: ACTOR, published, indexed, reason: REASON }, null, 2));
  } finally {
    await db.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
