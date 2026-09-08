import type { PrismaClient } from "@prisma/client";
import { prisma as defaultPrisma } from "@/lib/db";
import { getPublicEntityById } from "./entities";
import { publicWhere } from "./publication";
import type { EntityRef } from "@/lib/domain/entities";
import type { PublicClaim, PublicEvidence, VerificationStatus } from "@/lib/domain/types";

type Database = PrismaClient;

const publicSourceWhere = publicWhere();
const validVerificationStatuses = new Set<VerificationStatus>([
  "OFFICIALLY_CONFIRMED", "MULTIPLE_CREDIBLE_SOURCES", "DECLASSIFIED_RECORD", "DISPUTED", "SOURCE_CONFLICT", "UNVERIFIED",
]);

export type EvidenceRow = {
  id: string;
  locator: string | null;
  quote: string | null;
  rightsSafeToDisplay: boolean;
  sourceVersion: {
    versionTag: string;
    url: string | null;
    archiveUrl: string | null;
    source: {
      id: string;
      slug: string;
      title: string;
      publisher: string | null;
      canonicalUrl: string | null;
      family: { name: string; tier: string };
    };
  };
};

export function toPublicEvidence(row: EvidenceRow): PublicEvidence | null {
  const locator = row.locator?.trim();
  if (!locator) return null;
  const source = row.sourceVersion.source;
  return {
    id: row.id,
    locator,
    sourceId: source.id,
    sourceTitle: source.title,
    publisher: source.publisher ?? source.family.name,
    versionTag: row.sourceVersion.versionTag,
    sourceHref: `/archive/${encodeURIComponent(source.slug)}`,
    originalUrl: row.sourceVersion.url ?? source.canonicalUrl,
    archiveUrl: row.sourceVersion.archiveUrl,
    quote: row.rightsSafeToDisplay ? row.quote : null,
  };
}

export async function getPublicClaims(ref: EntityRef, db: Database = defaultPrisma): Promise<PublicClaim[]> {
  if (!(await getPublicEntityById(ref.type, ref.id, db))) return [];

  const claims = await db.claim.findMany({
    where: {
      entityType: ref.type,
      entityId: ref.id,
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
    },
    orderBy: { property: "asc" },
    select: {
      id: true,
      property: true,
      value: true,
      verificationStatus: true,
      editorialNote: true,
      evidence: {
        where: {
          evidence: {
            locator: { not: null },
            sourceVersion: { source: publicSourceWhere },
          },
        },
        select: {
          evidence: {
            select: {
              id: true,
              locator: true,
              quote: true,
              rightsSafeToDisplay: true,
              sourceVersion: {
                select: {
                  versionTag: true,
                  url: true,
                  archiveUrl: true,
                  source: { select: { id: true, slug: true, title: true, publisher: true, canonicalUrl: true, family: { select: { name: true, tier: true } } } },
                },
              },
            },
          },
        },
      },
    },
  });

  return claims.flatMap((claim) => {
    if (!validVerificationStatuses.has(claim.verificationStatus as VerificationStatus)) return [];
    const evidence = claim.evidence.map((link) => toPublicEvidence(link.evidence as EvidenceRow)).filter((item): item is PublicEvidence => item !== null);
    if (evidence.length === 0) return [];
    return [{
      id: claim.id,
      property: claim.property,
      value: claim.value,
      verificationStatus: claim.verificationStatus as VerificationStatus,
      editorialExplanation: claim.editorialNote,
      evidence,
    }];
  });
}

export async function getPublicEvidenceForRelationship(relationshipId: string, db: Database = defaultPrisma): Promise<PublicEvidence[]> {
  const links = await db.relationshipEvidence.findMany({
    where: { relationshipId, evidence: { locator: { not: null }, sourceVersion: { source: publicSourceWhere } } },
    select: {
      evidence: {
        select: {
          id: true, locator: true, quote: true, rightsSafeToDisplay: true,
          sourceVersion: { select: { versionTag: true, url: true, archiveUrl: true, source: { select: { id: true, slug: true, title: true, publisher: true, canonicalUrl: true, family: { select: { name: true, tier: true } } } } } },
        },
      },
    },
  });
  return links.map((link) => toPublicEvidence(link.evidence as EvidenceRow)).filter((item): item is PublicEvidence => item !== null);
}
