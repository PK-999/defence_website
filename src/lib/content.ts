import { prisma } from "@/lib/db";
import {
  getPublicConflict,
  getPublicEquipment,
  getPublicOperation,
  getPublicPerson,
  getPublicSlugs,
  getPublicSource,
} from "@/lib/repositories/entities";
import { getPublicClaims } from "@/lib/repositories/evidence";
import { getPublicRelationships } from "@/lib/repositories/relationships";
import type { EntityType } from "@/lib/domain/entities";

export { prisma };

const directoryTypes = {
  conflicts: "Conflict",
  people: "Person",
  operations: "Operation",
  equipment: "Equipment",
  sources: "Source",
} as const;

export async function getSlugs(directory: keyof typeof directoryTypes): Promise<string[]> {
  return getPublicSlugs(directoryTypes[directory], prisma);
}

function slugFromHref(href: string): string {
  return decodeURIComponent(href.split("/").pop() ?? "");
}

function relatedEndpoint(relationship: Awaited<ReturnType<typeof getPublicRelationships>>[number], center: { type: EntityType; id: string }) {
  return relationship.source.type === center.type && relationship.source.id === center.id
    ? { type: relationship.target.type, id: relationship.target.id, title: relationship.targetTitle, href: relationship.targetHref }
    : { type: relationship.source.type, id: relationship.source.id, title: relationship.sourceTitle, href: relationship.sourceHref };
}

export async function getConflict(slug: string) {
  const conflict = await getPublicConflict(slug, prisma);
  if (!conflict) return null;
  const center = { type: "Conflict" as const, id: conflict.id };
  const relationships = await getPublicRelationships(center, prisma);
  const operations = conflict.operations;
  const people = relationships.map((relationship) => relatedEndpoint(relationship, center)).filter((endpoint) => endpoint.type === "Person").map((endpoint) => ({ id: endpoint.id, title: endpoint.title, slug: slugFromHref(endpoint.href) }));
  const equipment = relationships.map((relationship) => relatedEndpoint(relationship, center)).filter((endpoint) => endpoint.type === "Equipment").map((endpoint) => ({ id: endpoint.id, title: endpoint.title, slug: slugFromHref(endpoint.href) }));
  const claims = await getPublicClaims(center, prisma);
  return { ...conflict, operations, people, equipment, claims };
}
export const getPerson = (slug: string) => getPublicPerson(slug, prisma);
export async function getOperation(slug: string) {
  const operation = await getPublicOperation(slug, prisma);
  if (!operation) return null;
  const center = { type: "Operation" as const, id: operation.id };
  const relationships = await getPublicRelationships(center, prisma);
  const conflicts = relationships.map((relationship) => relatedEndpoint(relationship, center)).filter((endpoint) => endpoint.type === "Conflict").map((endpoint) => ({ id: endpoint.id, title: endpoint.title, slug: slugFromHref(endpoint.href) }));
  const people = relationships.map((relationship) => relatedEndpoint(relationship, center)).filter((endpoint) => endpoint.type === "Person").map((endpoint) => ({ id: endpoint.id, title: endpoint.title, slug: slugFromHref(endpoint.href) }));
  return { ...operation, conflicts, people };
}
export const getEquipment = (slug: string) => getPublicEquipment(slug, prisma);
export const getSource = (slug: string) => getPublicSource(slug, prisma);
