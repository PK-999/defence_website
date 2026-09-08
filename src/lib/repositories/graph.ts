import type { PrismaClient } from "@prisma/client";
import { prisma as defaultPrisma } from "@/lib/db";
import { entityRoutes, type EntityRef, type EntityType } from "@/lib/domain/entities";
import { getPublicEntityById } from "./entities";
import { getPublicRelationships } from "./relationships";

type Database = PrismaClient;
export type GraphNode = { id: string; type: EntityType; title: string; slug: string; href: string };
export type GraphEdge = { id: string; source: string; target: string; predicate: string; validFrom: string | null; validTo: string | null; evidence: string[] };
export type PublicGraphNeighborhood = { seed: GraphNode; nodes: GraphNode[]; edges: GraphEdge[]; truncated: boolean };

export async function getPublicGraphNeighborhood(seed: EntityRef, options: { limit: number }, db: Database = defaultPrisma): Promise<PublicGraphNeighborhood | null> {
  const seedEntity = await getPublicEntityById(seed.type, seed.id, db);
  if (!seedEntity) return null;
  const limit = Math.min(100, Math.max(1, Math.floor(options.limit)));
  const relationships = await getPublicRelationships(seed, db);
  const nodeMap = new Map<string, GraphNode>();
  const addNode = (type: EntityType, id: string, title: string, slug: string) => nodeMap.set(`${type}:${id}`, { id, type, title, slug, href: `${entityRoutes[type]}/${encodeURIComponent(slug)}` });
  addNode(seed.type, seed.id, seedEntity.title, seedEntity.slug);
  const edges: GraphEdge[] = [];
  let truncated = relationships.length > limit;
  for (const relationship of relationships.slice(0, Math.min(limit, 200))) {
    const sourceKey = `${relationship.source.type}:${relationship.source.id}`;
    const targetKey = `${relationship.target.type}:${relationship.target.id}`;
    const missingKeys = [sourceKey, targetKey].filter((key) => !nodeMap.has(key));
    if (nodeMap.size + missingKeys.length > 100 || edges.length >= 200) {
      truncated = true;
      continue;
    }
    addNode(relationship.source.type, relationship.source.id, relationship.sourceTitle, decodeURIComponent(relationship.sourceHref.split("/").pop() ?? relationship.source.id));
    addNode(relationship.target.type, relationship.target.id, relationship.targetTitle, decodeURIComponent(relationship.targetHref.split("/").pop() ?? relationship.target.id));
    edges.push({ id: relationship.id, source: sourceKey, target: targetKey, predicate: relationship.predicate, validFrom: relationship.validFrom, validTo: relationship.validTo, evidence: relationship.evidence.map((item) => `${item.sourceTitle} · ${item.locator}`) });
  }
  return { seed: nodeMap.get(`${seed.type}:${seed.id}`)!, nodes: [...nodeMap.values()], edges, truncated };
}
