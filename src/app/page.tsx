import Link from "next/link";
import { ArrowRight, BookOpen, Crosshair, Shield } from "lucide-react";
import { FeaturedCollection } from "@/components/FeaturedCollection";
import { HomeSearch } from "@/components/HomeSearch";
import { getFeaturedCollection } from "@/lib/repositories/collections";

export const dynamic = "force-dynamic";

const subjects = [
  { title: "CONFLICTS", description: "Chronological timelines of major conflicts.", href: "/conflicts", icon: Shield },
  { title: "PEOPLE", description: "Sourced profiles of service members and leaders.", href: "/heroes", icon: Crosshair },
  { title: "ARSENAL", description: "Equipment, variants, and published specifications.", href: "/arsenal", icon: BookOpen },
] as const;

export default async function Home() {
  const featured = await getFeaturedCollection();

  return (
    <div className="flex-1">
      <section className="border-b border-border/40 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/[0.09] via-background to-background px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="font-mono text-xs font-semibold tracking-[0.35em] text-primary sm:text-sm">SENTINEL · INDIAN DEFENCE ARCHIVE</p>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">Start with a question.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">Explore India&apos;s military history through reviewed records, clear chronology, and sources you can follow.</p>
          <div className="mt-9"><HomeSearch /></div>
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span>Reviewed public records</span><span aria-hidden="true">·</span><span>Source-linked claims</span><span aria-hidden="true">·</span><span>Historical context</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">EXPLORE THE ARCHIVE</h2>
            <p className="mt-2 text-sm text-muted-foreground">Choose a subject, then follow the evidence.</p>
          </div>
          <Link href="/archive" className="hidden items-center gap-1 text-sm font-semibold text-primary hover:underline sm:inline-flex">Browse sources <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {subjects.map(({ title, description, href, icon: Icon }) => (
            <Link key={title} href={href} className="group rounded-xl border border-border/60 bg-card p-6 transition-colors hover:border-primary/60 hover:bg-primary/[0.04]">
              <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
              <h3 className="mt-5 text-lg font-bold tracking-[0.16em] group-hover:text-primary">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-border/40 bg-muted/10 px-4 py-14 sm:py-16">
        <div className="mx-auto max-w-5xl">
          {featured ? <FeaturedCollection collection={featured} /> : (
            <div className="rounded-xl border border-dashed border-border/80 bg-card/40 p-7 text-center sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">First release in progress</p>
              <h2 className="mt-3 text-2xl font-semibold">The archive is being built</h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">Reviewed collections will appear here as they are published. You can still browse the current public records and their source library.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href="/conflicts" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Browse the archive</Link>
                <Link href="/archive" className="rounded-md border border-border px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary">View sources</Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="px-4 py-14 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Every story should lead back to evidence.</h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">SENTINEL keeps the record, the source, and the limits of what is documented together so readers can make informed connections.</p>
          <Link href="/methodology" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">Read the methodology <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
      </section>
    </div>
  );
}
