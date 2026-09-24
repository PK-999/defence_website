"use client";

import React, { useRef, useState, useEffect } from "react";
import { ClientOperationMap, MapMarker } from "./ClientOperationMap";
import { ChevronRight, ExternalLink, ChevronLeft, Calendar, Shield, MapPin, BookOpen, Target, Award } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TacticalSoundToggle } from "./TacticalSoundToggle";
import { playTacticalClick } from "@/lib/tactical-audio";
import { formatDisplayDate } from "@/lib/domain/dates";

export type EventDetail = {
  id: string;
  title: string;
  date: string;
  summary: string;
  content: string;
  coordinates?: [number, number];
  referenceUrl?: string;
  slug?: string;
  type: 'conflict' | 'operation';
  contextSummary?: string | null;
  outcomeSummary?: string | null;
  theatres?: string[];
  keyPoints?: Array<{ title: string; body: string; sourceIndexes?: number[] }>;
  sources?: Array<{ label: string; url: string; note?: string }>;
};

interface InteractiveConflictViewerProps {
  conflict: EventDetail;
  events: EventDetail[];
}

export function InteractiveConflictViewer({ conflict, events }: InteractiveConflictViewerProps) {
  // Include conflict overview as the first event in the timeline
  const allEvents: EventDetail[] = [
    { ...conflict, id: 'overview', title: `${conflict.title} (Overview)`, type: 'conflict' as const },
    ...events
  ];

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requestedEvent = searchParams.get("event");
  const selectedEventId = allEvents.some((event) => event.id === requestedEvent) ? requestedEvent! : "overview";
  const selectedEvent = allEvents.find(e => e.id === selectedEventId) || allEvents[0];
  
  const timelineRailRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const selectEvent = (id: string) => {
    playTacticalClick();
    const next = new URLSearchParams(searchParams.toString());
    next.set("view", "explorer");
    next.set("event", id);
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const scrollTimeline = (direction: 'left' | 'right') => {
    playTacticalClick();
    if (timelineRailRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      timelineRailRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Keep selected event visible in timeline on change
  useEffect(() => {
    if (timelineRailRef.current) {
      const activeElement = timelineRailRef.current.querySelector('[aria-pressed="true"]');
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedEventId]);

  // Map markers for all events
  const markers: MapMarker[] = allEvents
    .filter(e => e.coordinates)
    .map(e => ({
      id: e.id,
      title: e.title,
      coordinates: e.coordinates!
    }));

  const defaultCenter = conflict.coordinates || [20.5937, 78.9629];
  const activeIndex = Math.max(0, allEvents.findIndex(e => e.id === selectedEventId));

  return (
    <div className="w-full bg-[#050e09]/95 border border-primary/30 rounded-xl overflow-hidden shadow-2xl relative flex flex-col">
      
      {/* 1. TOP SECTION: Sleek Horizontal Timeline */}
      <div className="w-full border-b border-border/50 bg-[#06140b]/90 backdrop-blur-md z-20 flex flex-col shrink-0">
        
        {/* Timeline Header Bar */}
        <div className="h-11 border-b border-border/40 px-4 flex items-center justify-between bg-card/40">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono font-bold text-xs uppercase tracking-widest text-primary">
              OPERATIONAL TIMELINE & CHRONOLOGY
            </span>
            <span className="hidden sm:inline px-2 py-0.5 rounded bg-primary/10 border border-primary/30 font-mono text-[10px] text-primary">
              EVENT {activeIndex + 1} OF {allEvents.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => scrollTimeline('left')}
                aria-label="Scroll timeline left"
                className="p-1 rounded hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollTimeline('right')}
                aria-label="Scroll timeline right"
                className="p-1 rounded hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="h-4 w-px bg-border/40" />
            <TacticalSoundToggle />
          </div>
        </div>

        {/* Horizontal Timeline Rail */}
        <div
          ref={timelineRailRef}
          className="flex items-center gap-3 overflow-x-auto p-3.5 no-scrollbar scroll-smooth relative"
          tabIndex={0}
          aria-label="Horizontal conflict timeline"
        >
          {allEvents.map((event, index) => {
            const isSelected = event.id === selectedEventId;
            return (
              <button
                key={event.id}
                type="button"
                aria-pressed={isSelected}
                aria-label={`Select event: ${event.title}`}
                onClick={() => selectEvent(event.id)}
                className={`flex-shrink-0 group relative text-left rounded-lg border px-4 py-2.5 transition-all duration-200 min-w-[200px] max-w-[260px] ${
                  isSelected
                    ? "border-primary bg-primary/15 shadow-[0_0_15px_rgba(131,214,92,0.25)] ring-1 ring-primary/50"
                    : "border-border/60 bg-[#07170e]/80 hover:border-primary/50 hover:bg-[#0a2014]"
                }`}
              >
                {/* Step / Phase Badge */}
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className={`font-bold tracking-widest ${isSelected ? "text-primary" : "text-muted-foreground"}`}>
                    PHASE {String(index).padStart(2, "0")}
                  </span>
                  <span className="text-muted-foreground uppercase">
                    {formatDisplayDate(event.date)}
                  </span>
                </div>

                {/* Title */}
                <span className={`block text-xs font-bold truncate ${isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>
                  {event.title}
                </span>

                {/* Active Underline Glow */}
                {isSelected && (
                  <span className="absolute -bottom-px left-2 right-2 h-0.5 bg-primary shadow-[0_0_8px_#83d65c]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. BODY SECTION: 2-Column Console (Consolidated Dossier Left/Center + Map Fixed Right) */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-[620px] relative">
        
        {/* LEFT / CENTER: Complete Consolidated Dossier Panel */}
        <div className="flex-1 lg:w-7/12 xl:w-3/5 overflow-y-auto p-6 sm:p-8 space-y-6 max-h-[750px] border-b lg:border-b-0 lg:border-r border-border/40 bg-[#040c07]/90 backdrop-blur-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedEvent.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Event Metadata & Clearance Banner */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-primary/20 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-primary/15 text-primary border border-primary/30 font-mono text-[11px] font-bold tracking-widest uppercase">
                    {selectedEvent.type === 'conflict' ? 'STRATEGIC THEATRE DOSSIER' : 'OPERATIONAL ACTION DIRECTIVE'}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    DATE: {formatDisplayDate(selectedEvent.date)}
                  </span>
                </div>
                {selectedEvent.coordinates && (
                  <span className="font-mono text-[11px] text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-primary" />
                    {selectedEvent.coordinates[0].toFixed(2)}°N, {selectedEvent.coordinates[1].toFixed(2)}°E
                  </span>
                )}
              </div>

              {/* Event Title */}
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-foreground">
                  {selectedEvent.title}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground italic font-sans">
                  {selectedEvent.summary}
                </p>
              </div>

              {/* Strategic Prelude / Background Context if available */}
              {selectedEvent.contextSummary && (
                <div className="rounded-lg border border-primary/30 bg-[#071b0f]/60 p-4 sm:p-5">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-primary flex items-center gap-2 mb-2">
                    <Shield className="w-3.5 h-3.5 text-primary" />
                    STRATEGIC PRELUDE & CONTEXT
                  </h4>
                  <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                    {selectedEvent.contextSummary}
                  </p>
                </div>
              )}

              {/* Complete Operational Narrative / Full Report */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-primary flex items-center gap-2 border-l-2 border-primary pl-3">
                  <BookOpen className="w-3.5 h-3.5 text-primary" />
                  DETAILED OPERATIONAL ACCOUNT
                </h4>
                <div className="prose prose-invert max-w-none text-sm sm:text-base leading-relaxed text-muted-foreground space-y-4">
                  {(selectedEvent.content || selectedEvent.summary)
                    .split(/\n{2,}/)
                    .filter(Boolean)
                    .map((para, idx) => (
                      <p key={`${selectedEvent.id}-para-${idx}`}>{para}</p>
                    ))}
                </div>
              </div>

              {/* Key Strategic Points / Directives if available */}
              {selectedEvent.keyPoints && selectedEvent.keyPoints.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                    <Target className="w-3.5 h-3.5 text-primary" />
                    KEY OPERATIONAL MILESTONES & ASSESSMENTS
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {selectedEvent.keyPoints.map((point, idx) => (
                      <div key={idx} className="rounded-lg border border-border/60 bg-card/40 p-3.5">
                        <span className="block font-mono text-xs font-bold text-foreground mb-1">
                          {point.title}
                        </span>
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          {point.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Outcome & Impact if available */}
              {selectedEvent.outcomeSummary && (
                <div className="rounded-lg border border-accent-gold/30 bg-accent-gold/5 p-4 sm:p-5">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-accent-gold flex items-center gap-2 mb-2">
                    <Award className="w-3.5 h-3.5 text-accent-gold" />
                    THEATRE OUTCOME & STRATEGIC ASSESSMENT
                  </h4>
                  <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                    {selectedEvent.outcomeSummary}
                  </p>
                </div>
              )}

              {/* Theatre Sectors if available */}
              {selectedEvent.theatres && selectedEvent.theatres.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                    THEATRE SECTORS:
                  </span>
                  {selectedEvent.theatres.map((theatre) => (
                    <span
                      key={theatre}
                      className="px-2 py-0.5 rounded border border-border/60 bg-card/60 font-mono text-[11px] text-foreground"
                    >
                      {theatre}
                    </span>
                  ))}
                </div>
              )}

              {/* Verified Sources & External Reference Links */}
              <div className="pt-4 border-t border-border/40 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  {selectedEvent.referenceUrl && (
                    <a
                      href={selectedEvent.referenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-wider text-primary hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      OFFICIAL DOCUMENTATION ARCHIVE
                    </a>
                  )}

                  {selectedEvent.type === 'operation' && selectedEvent.slug && (
                    <Link
                      href={`/operations/${selectedEvent.slug}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded border border-primary/40 bg-primary/10 hover:bg-primary/20 text-xs font-mono font-bold tracking-widest text-primary transition-colors ml-auto"
                    >
                      <span>VIEW FULL OPERATION REPORT</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>

                {/* Sources List if provided */}
                {selectedEvent.sources && selectedEvent.sources.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block">
                      ARCHIVAL REFERENCES:
                    </span>
                    <ul className="space-y-1 text-xs font-mono text-muted-foreground">
                      {selectedEvent.sources.map((s, idx) => (
                        <li key={idx} className="flex items-baseline gap-1.5">
                          <span className="text-primary font-bold">[{idx + 1}]</span>
                          <a href={s.url} target="_blank" rel="noreferrer" className="text-foreground hover:text-primary underline">
                            {s.label}
                          </a>
                          {s.note && <span className="text-muted-foreground">({s.note})</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT: Tactical Map (Fixed on Right) */}
        <div className="flex-1 lg:w-5/12 xl:w-2/5 min-h-[420px] lg:min-h-full relative bg-[#070f17] overflow-hidden">
          <ClientOperationMap
            markers={markers}
            activeMarkerId={selectedEventId === 'overview' ? (selectedEvent.coordinates ? selectedEvent.id : undefined) : selectedEventId}
            defaultCenter={defaultCenter}
            compact
            showActiveCoordinates={false}
          />
        </div>

      </div>

    </div>
  );
}
