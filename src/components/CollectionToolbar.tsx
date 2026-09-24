"use client";

import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, RotateCcw, ChevronDown } from "lucide-react";

export type CollectionOption = string | { value: string; label: string };

interface CollectionToolbarProps {
  fields: Array<{
    key: string;
    label: string;
    options: CollectionOption[];
  }>;
  className?: string;
}

function CollectionToolbarFallback() {
  return (
    <div className="relative rounded-lg border border-primary/30 bg-[#06120b]/90 backdrop-blur-md p-3 sm:p-4 shadow-[0_4px_24px_rgba(0,0,0,0.5)] animate-pulse">
      <div className="h-10 flex items-center gap-3">
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">INITIALIZING TACTICAL FILTERS...</span>
      </div>
    </div>
  );
}

export function CollectionToolbar(props: CollectionToolbarProps) {
  return (
    <Suspense fallback={<CollectionToolbarFallback />}>
      <CollectionToolbarInner {...props} />
    </Suspense>
  );
}

function CollectionToolbarInner({ fields, className = "" }: CollectionToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();

  const change = (key: string, value: string) => {
    const params = new URLSearchParams(search.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key === "domain") {
      params.delete("category");
      params.delete("use");
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clear = () => router.push(pathname, { scroll: false });

  const fieldKeys = new Set(fields.map((field) => field.key));
  const labelFor = (field: { options: CollectionOption[] }, value: string) => {
    const selected = field.options.find((option) =>
      typeof option === "string" ? option === value : option.value === value
    );
    return typeof selected === "string" ? selected : selected?.label ?? value;
  };

  const activeFilters = Array.from(search.entries()).filter(
    ([key]) => key !== "page" && fieldKeys.has(key)
  );

  return (
    <div
      className={`relative rounded-lg border border-primary/30 bg-[#06120b]/90 backdrop-blur-md p-3 sm:p-4 shadow-[0_4px_24px_rgba(0,0,0,0.5)] ${className}`}
    >
      {/* Corner Brackets */}
      <span className="absolute -top-px -left-px h-2 w-2 border-t-2 border-l-2 border-primary pointer-events-none" />
      <span className="absolute -top-px -right-px h-2 w-2 border-t-2 border-r-2 border-primary pointer-events-none" />
      <span className="absolute -bottom-px -left-px h-2 w-2 border-b-2 border-l-2 border-primary pointer-events-none" />
      <span className="absolute -bottom-px -right-px h-2 w-2 border-b-2 border-r-2 border-primary pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Console Telemetry */}
        <div className="flex items-center gap-2.5 text-xs font-mono text-primary font-bold uppercase tracking-wider shrink-0">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-primary/10 border border-primary/25">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <SlidersHorizontal className="w-3 h-3 text-primary" />
            <span className="text-[11px] tracking-widest">TACTICAL FILTERS</span>
          </div>
          {activeFilters.length > 0 ? (
            <span className="px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/40 text-[10px] font-bold">
              {activeFilters.length} ENGAGED
            </span>
          ) : (
            <span className="hidden sm:inline-flex text-[10px] text-muted-foreground font-normal tracking-wide">
              CLEARANCE: ALL DIRECTIVES
            </span>
          )}
        </div>

        {/* Right: Selectors & Clear Action */}
        <div className="flex flex-wrap items-center gap-2 flex-1 md:justify-end">
          {fields.map((field) => {
            const currentValue = search.get(field.key) ?? "";
            const isSelected = Boolean(currentValue);

            return (
              <div
                key={field.key}
                className={`relative inline-flex items-center rounded border text-xs font-mono transition-all duration-200 ${
                  isSelected
                    ? "border-primary bg-primary/15 text-primary shadow-[0_0_12px_rgba(131,214,92,0.25)] ring-1 ring-primary/40"
                    : "border-border/70 bg-[#0a180f]/70 text-foreground hover:border-primary/50 hover:bg-[#0c1f13]"
                }`}
              >
                <label htmlFor={`filter-${field.key}`} className="pl-2.5 pr-1 text-[10px] text-muted-foreground uppercase tracking-widest select-none shrink-0 font-semibold">
                  {field.label}:
                </label>
                <div className="relative flex items-center">
                  <select
                    id={`filter-${field.key}`}
                    aria-label={field.label}
                    value={currentValue}
                    onChange={(e) => change(field.key, e.target.value)}
                    className="appearance-none bg-transparent py-1.5 pl-1 pr-7 text-xs font-semibold uppercase tracking-wider focus:outline-none cursor-pointer text-foreground"
                  >
                    <option value="" className="bg-[#050d09] text-muted-foreground">
                      ALL
                    </option>
                    {field.options.map((option) => {
                      const value = typeof option === "string" ? option : option.value;
                      const label = typeof option === "string" ? option : option.label;
                      return (
                        <option key={value} value={value} className="bg-[#050d09] text-foreground">
                          {label}
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary/60 pointer-events-none" />
                </div>
              </div>
            );
          })}

          {activeFilters.length > 0 && (
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-accent-danger/40 bg-accent-danger/10 text-accent-danger hover:bg-accent-danger/20 hover:border-accent-danger text-xs font-mono uppercase tracking-wider transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>RESET</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFilters.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-border/40 flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest">ENGAGED:</span>
          {activeFilters.map(([key, value]) => {
            const field = fields.find((item) => item.key === key);
            return (
              <span
                key={`${key}-${value}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 text-[11px] text-primary"
              >
                <span>
                  {field?.label ?? key}: <strong>{field ? labelFor(field, value) : value}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => change(key, "")}
                  aria-label={`Remove filter ${field?.label ?? key}`}
                  className="hover:text-foreground text-primary/70 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

