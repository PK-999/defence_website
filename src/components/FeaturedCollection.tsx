import Link from "next/link";
import type { FeaturedCollection as FeaturedCollectionData } from "@/lib/repositories/collections";

export function FeaturedCollection({ collection }: { collection: FeaturedCollectionData }) {
  return (
    <article className="rounded-xl border border-primary/30 bg-primary/[0.06] p-6 shadow-sm sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Featured collection</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight">{collection.title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{collection.description}</p>
      <Link href={collection.href} className="mt-5 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Open the collection</Link>
    </article>
  );
}
