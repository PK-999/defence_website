import { getServerSession } from "next-auth";
import { authOptions, isAuthConfigured } from "@/auth";
import { prisma } from "@/lib/db";
import { getEditorialPrincipal, isPrincipalAuthorized } from "./principals";
import type { EditorialRole } from "./roles";

export class UnauthorizedError extends Error {
  constructor(message = "Editor access is not configured.") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export type EditorSession = { issuer: string; subject: string; actorId: string; displayName?: string; email?: string; roles?: EditorialRole[] };

type EditorSubject = { issuer: string; subject: string };

export function parseEditorSubjects(value: string | undefined): EditorSubject[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is EditorSubject => typeof item === "object" && item !== null && typeof (item as EditorSubject).issuer === "string" && Boolean((item as EditorSubject).issuer.trim()) && typeof (item as EditorSubject).subject === "string" && Boolean((item as EditorSubject).subject.trim())).map((item) => ({ issuer: item.issuer.trim(), subject: item.subject.trim() }));
  } catch {
    return [];
  }
}

export function isAllowedEditor(issuer: string, subject: string, configured = parseEditorSubjects(process.env.EDITOR_SUBJECTS)): boolean {
  return configured.some((item) => item.issuer === issuer && item.subject === subject);
}

/**
 * Temporary fail-closed adapter. T08 replaces this with the validated OIDC
 * session check; there is intentionally no development or test bypass.
 */
export async function requireEditor(): Promise<EditorSession> {
  if (!isAuthConfigured()) throw new UnauthorizedError();
  const session = await getServerSession(authOptions);
  const identity = session?.user as (EditorSession & { name?: string | null }) | undefined;
  if (!identity?.issuer || !identity.subject || !isAllowedEditor(identity.issuer, identity.subject)) throw new UnauthorizedError("You are not an authorized editor.");
  return { issuer: identity.issuer, subject: identity.subject, actorId: identity.actorId || `${identity.issuer}|${identity.subject}` };
}

export async function requireEditorRole(role: EditorialRole): Promise<EditorSession> {
  const editor = await requireEditor();
  const principal = await getEditorialPrincipal(editor, prisma);
  if (!principal || !isPrincipalAuthorized(principal, role)) throw new UnauthorizedError(`The signed-in editor is not authorized for the ${role.toLowerCase()} role.`);
  return { ...editor, displayName: principal.displayName, email: principal.email, roles: principal.roles };
}

export async function requireAnyEditorRole(roles: readonly EditorialRole[]): Promise<EditorSession> {
  const editor = await requireEditor();
  const principal = await getEditorialPrincipal(editor, prisma);
  if (!principal || !roles.some((role) => isPrincipalAuthorized(principal, role))) throw new UnauthorizedError("The signed-in editor has no active editorial role.");
  return { ...editor, displayName: principal.displayName, email: principal.email, roles: principal.roles };
}
