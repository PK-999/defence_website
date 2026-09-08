import type { NextAuthOptions } from "next-auth";
import type { OAuthConfig } from "next-auth/providers/oauth";

type OidcProfile = { sub: string; name?: string; email?: string; picture?: string };

const issuer = process.env.AUTH_OIDC_ISSUER?.trim();
const clientId = process.env.AUTH_OIDC_CLIENT_ID?.trim();
const clientSecret = process.env.AUTH_OIDC_CLIENT_SECRET?.trim();

export function isAuthConfigured(): boolean {
  return Boolean(process.env.AUTH_SECRET?.trim() && issuer && clientId && clientSecret && parseSubjects(process.env.EDITOR_SUBJECTS).length > 0);
}

function parseSubjects(value: string | undefined): Array<{ issuer: string; subject: string }> {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is { issuer: string; subject: string } => typeof item === "object" && item !== null && typeof (item as { issuer?: unknown }).issuer === "string" && Boolean((item as { issuer: string }).issuer.trim()) && typeof (item as { subject?: unknown }).subject === "string" && Boolean((item as { subject: string }).subject.trim())).map((item) => ({ issuer: item.issuer.trim(), subject: item.subject.trim() }));
  } catch {
    return [];
  }
}

const provider: OAuthConfig<OidcProfile> | null = issuer && clientId && clientSecret ? {
  id: "sentinel-oidc",
  name: "Organization sign-in",
  type: "oauth",
  wellKnown: `${issuer.replace(/\/$/, "")}/.well-known/openid-configuration`,
  clientId,
  clientSecret,
  idToken: true,
  checks: ["pkce", "state", "nonce"],
  authorization: { params: { scope: "openid profile email" } },
  profile(profile) {
    return { id: profile.sub, name: profile.name ?? profile.sub, email: profile.email ?? null, image: profile.picture ?? null };
  },
} : null;

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  providers: provider ? [provider] : [],
  pages: { signIn: "/signin" },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (typeof account?.issuer === "string" && account.providerAccountId) {
        token.issuer = account.issuer;
        token.subject = account.providerAccountId;
        token.actorId = `${account.issuer}|${account.providerAccountId}`;
      } else if (profile?.sub && provider?.issuer) {
        token.issuer = provider.issuer;
        token.subject = profile.sub;
        token.actorId = `${provider.issuer}|${profile.sub}`;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && typeof token.issuer === "string" && typeof token.subject === "string") {
        Object.assign(session.user, { issuer: token.issuer, subject: token.subject, actorId: typeof token.actorId === "string" ? token.actorId : `${token.issuer}|${token.subject}` });
      }
      return session;
    },
  },
};
