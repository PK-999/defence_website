"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TacticalSoundToggle } from "@/components/TacticalSoundToggle";
import { playTacticalClick } from "@/lib/tactical-audio";
import { formatDisplayDate } from "@/lib/domain/dates";

export type TimelineEvent = {
  id: string;
  date: string;
  title: string;
  description?: string;
  href?: string;
};

interface TimelineProps {
  events: TimelineEvent[];
  activeEventId?: string | null;
  onSelect?: (event: TimelineEvent) => void;
  onActiveChange?: (event: TimelineEvent) => void;
  actionLabel?: string;
}

export function Timeline({ events, activeEventId, onSelect, onActiveChange, actionLabel = "Focus map" }: TimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const animationFrame = useRef<number | null>(null);
  const scrollSoundTop = useRef(0);
  const scrollSoundTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialIndex = Math.max(0, events.findIndex((event) => event.id === activeEventId));
  const [wheelIndex, setWheelIndex] = useState(initialIndex);
  const [proximityIndex, setProximityIndex] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();

  const scrollToIndex = (index: number) => {
    const bounded = Math.max(0, Math.min(events.length - 1, index));
    const container = scrollRef.current;
    const item = itemRefs.current[bounded];
    if (!container || !item) return;
    container.scrollTo({
      top: item.offsetTop - (container.clientHeight - item.offsetHeight) / 2,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  const commitCenteredItem = () => {
    animationFrame.current = null;
    const container = scrollRef.current;
    if (!container) return;
    const center = container.getBoundingClientRect().top + container.clientHeight / 2;
    let nearest = wheelIndex;
    let nearestDistance = Number.POSITIVE_INFINITY;
    itemRefs.current.forEach((item, index) => {
      if (!item) return;
      const rect = item.getBoundingClientRect();
      const distance = Math.abs(rect.top + rect.height / 2 - center);
      if (distance < nearestDistance) {
        nearest = index;
        nearestDistance = distance;
      }
    });
    if (nearest !== wheelIndex) {
      setWheelIndex(nearest);
      onActiveChange?.(events[nearest]);
    }
  };

  const handleScroll = () => {
    if (animationFrame.current !== null) cancelAnimationFrame(animationFrame.current);
    animationFrame.current = requestAnimationFrame(commitCenteredItem);
  };
  const handleTimelineScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const top = event.currentTarget.scrollTop;
    if (Math.abs(top - scrollSoundTop.current) >= 28 && !scrollSoundTimer.current) {
      scrollSoundTop.current = top;
      playTacticalClick();
      scrollSoundTimer.current = setTimeout(() => { scrollSoundTimer.current = null; }, 85);
    }
    handleScroll();
  };
  const focusIndex = proximityIndex ?? wheelIndex;

  useEffect(() => () => {
    if (animationFrame.current !== null) cancelAnimationFrame(animationFrame.current);
    if (scrollSoundTimer.current !== null) clearTimeout(scrollSoundTimer.current);
  }, []);

  if (!events || events.length === 0) return null;

  return (
    <section className="relative w-full py-8" aria-label="Timeline">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h3 className="border-l-2 border-primary pl-4 text-xl font-bold uppercase tracking-widest text-primary">Timeline</h3>
        <div className="flex items-center gap-2">
          <TacticalSoundToggle />
          <button type="button" onClick={() => scrollToIndex(wheelIndex - 1)} aria-label="Previous timeline entry" className="rounded border border-border/40 p-2 transition-colors hover:bg-primary/10 hover:text-primary">
            <ChevronUp className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => scrollToIndex(wheelIndex + 1)} aria-label="Next timeline entry" className="rounded border border-border/40 p-2 transition-colors hover:bg-primary/10 hover:text-primary">
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div ref={scrollRef} onScroll={handleTimelineScroll} className="relative h-[34rem] snap-y snap-mandatory overflow-y-auto overscroll-contain pl-12 pr-28 [perspective:900px] [scrollbar-color:theme(colors.primary/40)_transparent] sm:pr-40" tabIndex={0} aria-label="Scrollable timeline">
        <div className="absolute bottom-0 left-[1.55rem] top-0 w-px bg-border/50" aria-hidden="true" />
        <div className="space-y-3 py-[13rem]">
          {events.map((event, index) => {
            const signedDistance = index - focusIndex;
            const distance = Math.abs(signedDistance);
            const active = index === wheelIndex;
            const scale = reducedMotion ? 1 : distance === 0 ? 1.18 : distance === 1 ? 0.96 : distance === 2 ? 0.9 : 0.86;
            const opacity = active ? 1 : distance === 1 ? 0.52 : distance === 2 ? 0.28 : 0.14;
            return (
              <motion.div
                key={event.id}
                ref={(node) => { itemRefs.current[index] = node; }}
                data-timeline-event={event.id}
                initial={false}
                animate={{ opacity, scale, x: reducedMotion ? 0 : active ? 24 : distance === 1 ? 8 : 0, rotateX: reducedMotion ? 0 : Math.max(-14, Math.min(14, signedDistance * -7)) }}
                transition={{ type: reducedMotion ? "tween" : "spring", stiffness: 360, damping: 24, mass: 0.7, duration: reducedMotion ? 0 : undefined }}
                className="relative min-h-28 snap-center origin-left pl-8 will-change-transform"
              >
                <span className={`absolute left-[-1.95rem] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 transition-all ${active ? "border-primary bg-primary shadow-[0_0_18px_rgba(132,204,22,0.95)]" : "border-primary/50 bg-background"}`} aria-hidden="true" />
                <button
                  type="button"
                  onMouseEnter={() => setProximityIndex(index)}
                  onMouseLeave={() => setProximityIndex(null)}
                  onFocus={() => setProximityIndex(index)}
                  onBlur={() => setProximityIndex(null)}
                  onClick={() => {
                    scrollToIndex(index);
                    onActiveChange?.(event);
                    onSelect?.(event);
                  }}
                  aria-current={active ? "step" : undefined}
                  className={`w-full rounded-lg border px-6 py-5 text-left transition-colors ${active ? "border-primary/90 bg-primary/12 ring-1 ring-primary/40 shadow-[0_0_34px_rgba(132,204,22,0.08)]" : "border-border/35 bg-card/70 hover:border-primary/60"}`}
                >
                  <div className="mb-2 font-mono text-[11px] font-bold tracking-[0.18em] text-muted-foreground">{formatDisplayDate(event.date)}</div>
                  <h4 className="text-lg font-bold tracking-wide text-foreground sm:text-xl">{event.title}</h4>
                  {active && event.description && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{event.description}</p>}
                  {active && onSelect && <span className="mt-4 block text-[10px] font-mono uppercase tracking-[0.24em] text-primary">{actionLabel}</span>}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
