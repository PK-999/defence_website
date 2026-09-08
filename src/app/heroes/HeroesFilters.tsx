"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  serviceFilter: string | undefined;
  medalFilter: string | undefined;
  conflictFilter: string | undefined;
  yearFilter: string | undefined;
  allServices: string[];
  allMedals: string[];
  allConflicts: string[];
  allYears: string[];
};

export function HeroesFilters({ serviceFilter, medalFilter, conflictFilter, yearFilter, allServices, allMedals, allConflicts, allYears }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    return params.toString();
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div>
        <label htmlFor="service-filter" className="block text-sm font-bold tracking-widest text-primary uppercase mb-2">Service Branch</label>
        <select
          id="service-filter"
          value={serviceFilter || ""}
          onChange={(e) => router.push(`/heroes?${createQueryString("service", e.target.value)}`)}
          className="w-full bg-card border border-border/50 rounded-lg px-4 py-3 text-foreground uppercase tracking-wider focus:outline-none focus:border-primary/50"
        >
          <option value="">All Services</option>
          {allServices.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="medal-filter" className="block text-sm font-bold tracking-widest text-primary uppercase mb-2">Medal</label>
        <select
          id="medal-filter"
          value={medalFilter || ""}
          onChange={(e) => router.push(`/heroes?${createQueryString("medal", e.target.value)}`)}
          className="w-full bg-card border border-border/50 rounded-lg px-4 py-3 text-foreground uppercase tracking-wider focus:outline-none focus:border-primary/50"
        >
          <option value="">All Medals</option>
          {allMedals.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="conflict-filter" className="block text-sm font-bold tracking-widest text-primary uppercase mb-2">Conflict</label>
        <select
          id="conflict-filter"
          value={conflictFilter || ""}
          onChange={(e) => router.push(`/heroes?${createQueryString("conflict", e.target.value)}`)}
          className="w-full bg-card border border-border/50 rounded-lg px-4 py-3 text-foreground uppercase tracking-wider focus:outline-none focus:border-primary/50"
        >
          <option value="">All Conflicts</option>
          {allConflicts.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="year-filter" className="block text-sm font-bold tracking-widest text-primary uppercase mb-2">Year</label>
        <select
          id="year-filter"
          value={yearFilter || ""}
          onChange={(e) => router.push(`/heroes?${createQueryString("year", e.target.value)}`)}
          className="w-full bg-card border border-border/50 rounded-lg px-4 py-3 text-foreground uppercase tracking-wider focus:outline-none focus:border-primary/50"
        >
          <option value="">All Years</option>
          {allYears.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
