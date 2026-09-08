import Link from "next/link";

export default function NotFound() {
  return <div className="mx-auto flex min-h-[55vh] max-w-2xl flex-col items-center justify-center px-6 py-20 text-center"><p className="text-sm font-semibold uppercase tracking-widest text-primary">404</p><h1 className="mt-3 text-3xl font-bold">Page not found</h1><p className="mt-3 text-muted-foreground">That public record or route is unavailable. Search the archive or browse a reviewed collection.</p><div className="mt-6 flex flex-wrap justify-center gap-3"><Link href="/search" className="rounded bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Search the archive</Link><Link href="/conflicts" className="rounded border border-border px-4 py-2 text-sm font-semibold">Browse conflicts</Link></div></div>;
}
