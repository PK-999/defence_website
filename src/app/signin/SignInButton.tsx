"use client";

import { signIn } from "next-auth/react";

export function SignInButton() {
  return <button type="button" onClick={() => signIn("sentinel-oidc", { callbackUrl: "/admin" })} className="rounded border border-primary px-4 py-2 text-primary hover:bg-primary/10">Sign in with organization</button>;
}
