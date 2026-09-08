import type { Prisma, PrismaClient } from "@prisma/client";
import { prisma as defaultPrisma } from "@/lib/db";
import { hasEditorialRole, parseEditorialRoles, type EditorialRole } from "./roles";

type Database = PrismaClient | Prisma.TransactionClient;

export type EditorialPrincipal = {
  id: string;
  displayName: string;
  email: string;
  issuer: string | null;
  subject: string | null;
  roles: EditorialRole[];
};

export async function getEditorialPrincipal(identity: { issuer: string; subject: string }, db: Database = defaultPrisma): Promise<EditorialPrincipal | null> {
  const row = await db.editorialPrincipal.findFirst({
    where: { issuer: identity.issuer, subject: identity.subject, active: true },
    select: { id: true, displayName: true, email: true, issuer: true, subject: true, rolesJson: true },
  });
  if (!row) return null;
  return { ...row, roles: parseEditorialRoles(row.rolesJson) };
}

export function isPrincipalAuthorized(principal: EditorialPrincipal | null, role: EditorialRole): boolean {
  return Boolean(principal && hasEditorialRole(principal.roles, role));
}
