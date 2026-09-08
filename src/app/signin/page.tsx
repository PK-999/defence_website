import Link from "next/link";
import { isAuthConfigured } from "@/auth";
import { SignInButton } from "./SignInButton";

export const metadata = { title: "Editor sign-in | SENTINEL", robots: { index: false, follow: false } };

export default function SignInPage() {
  const configured = isAuthConfigured();
  return (
    <div className="mx-auto max-w-lg space-y-6 px-6 py-16">
      <h1 className="text-3xl font-bold">Editor sign-in</h1>
      {configured ? <><p className="text-muted-foreground">Use the configured organization identity provider. Access is limited to the current editor allow-list.</p><SignInButton /></> : <p className="rounded border border-border p-4 text-muted-foreground">Editor access is not configured. Public browsing remains available.</p>}
      <Link href="/" className="text-primary hover:underline">Return to the archive</Link>
    </div>
  );
}
