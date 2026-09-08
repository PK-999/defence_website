"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  forceFilter: string | undefined;
  useFilter: string | undefined;
  allDomains: string[];
  allCategories: string[];
};

export function ArsenalFilters({ forceFilter, useFilter, allDomains, allCategories }: Props) {
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
    <div className="flex flex-col sm:flex-row gap-6">
      <div className="flex-1">
        <label htmlFor="force-filter" className="block text-sm font-bold tracking-widest text-primary uppercase mb-2">Branch</label>
        <select
          id="force-filter"
          value={forceFilter || ""}
          onChange={(e) => router.push(`/arsenal?${createQueryString("force", e.target.value)}`)}
          className="w-full bg-card border border-border/50 rounded-lg px-4 py-3 text-foreground uppercase tracking-wider focus:outline-none focus:border-primary/50"
        >
          <option value="">All</option>
          {allDomains.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        <label htmlFor="use-filter" className="block text-sm font-bold tracking-widest text-primary uppercase mb-2">Type</label>
        <select
          id="use-filter"
          value={useFilter || ""}
          onChange={(e) => router.push(`/arsenal?${createQueryString("use", e.target.value)}`)}
          className="w-full bg-card border border-border/50 rounded-lg px-4 py-3 text-foreground uppercase tracking-wider focus:outline-none focus:border-primary/50"
        >
          <option value="">All</option>
          {allCategories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        <label htmlFor="status-filter" className="block text-sm font-bold tracking-widest text-primary uppercase mb-2">Deployment Status</label>
        <select
          id="status-filter"
          value={searchParams.get("status") || ""}
          onChange={(e) => router.push(`/arsenal?${createQueryString("status", e.target.value)}`)}
          className="w-full bg-card border border-border/50 rounded-lg px-4 py-3 text-foreground uppercase tracking-wider focus:outline-none focus:border-primary/50"
        >
          <option value="">All</option>
          <option value="Deployed">Deployed</option>
          <option value="Retired">Retired</option>
        </select>
      </div>
    </div>
  );
}
