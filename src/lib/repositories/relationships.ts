import type { PrismaClient } from "@prisma/client";
import { prisma as defaultPrisma } from "@/lib/db";
import { isEntityType, type EntityType } from "@/lib/domain/entities";
import { type PublicRelationship } from "@/lib/domain/types";
import { getPublicEntityById } from "./entities";
import { getPublicEvidenceForRelationship } from "./evidence";
import { publicWhere } from "./publication";

type Database = PrismaClient;

const publicSourceWhere = publicWhere();
const publicEntityRoutes: Record<EntityType, string> = {
  Conflict: "/conflicts",
  Operation: "/operations",
  Person: "/heroes",
  Equipment: "/arsenal",
  Unit: "/forces/units",
  Source: "/archive",
};

export async function getPublicRelationships(ref: { type: EntityType; id: string }, db: Database = defaultPrisma): Promise<PublicRelationship[]> {
  const rows = await db.relationship.findMany({
    where: {
      status: "GOLD",
      reviewedAt: { not: null },
      reviewedBy: { not: null },
      evidence: {
        some: {
          evidence: {
            locator: { not: null },
            sourceVersion: { source: publicSourceWhere },
          },
        },
      },
      OR: [
        { sourceType: ref.type, sourceId: ref.id },
        { targetType: ref.type, targetId: ref.id },
      ],
    },
    orderBy: [{ predicate: "asc" }, { id: "asc" }],
    select: { id: true, sourceType: true, sourceId: true, targetType: true, targetId: true, predicate: true, validFrom: true, validTo: true },
  });

  const publicRelationships: PublicRelationship[] = [];
  for (const row of rows) {
    if (!isEntityType(row.sourceType) || !isEntityType(row.targetType)) continue;
    const source = await getPublicEntityById(row.sourceType, row.sourceId, db);
    const target = await getPublicEntityById(row.targetType, row.targetId, db);
    if (!source || !target) continue;
    const evidence = await getPublicEvidenceForRelationship(row.id, db);
    if (evidence.length === 0) continue;
    const sourceRef = { type: row.sourceType, id: row.sourceId } as const;
    const targetRef = { type: row.targetType, id: row.targetId } as const;
    publicRelationships.push({
      id: row.id,
      source: sourceRef,
      target: targetRef,
      predicate: row.predicate,
      validFrom: row.validFrom,
      validTo: row.validTo,
      sourceTitle: source.title,
      targetTitle: target.title,
      sourceHref: `${publicEntityRoutes[sourceRef.type]}/${encodeURIComponent(source.slug)}`,
      targetHref: `${publicEntityRoutes[targetRef.type]}/${encodeURIComponent(target.slug)}`,
      evidence,
    });
  }
  return publicRelationships;
}
