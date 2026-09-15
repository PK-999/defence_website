"use client";

import { useRouter } from "next/navigation";
import { Timeline, TimelineEvent } from "@/components/ui/Timeline";

type CollectionChronologyProps = {
  events: Array<TimelineEvent & { href: string }>;
};

/** Collection-page chronology rail; selecting a card opens its full dossier. */
export function CollectionChronology({ events }: CollectionChronologyProps) {
  const router = useRouter();

  return (
    <Timeline
      events={events}
      actionLabel="Open dossier"
      onSelect={(event) => {
        if (event.href) router.push(event.href);
      }}
    />
  );
}
