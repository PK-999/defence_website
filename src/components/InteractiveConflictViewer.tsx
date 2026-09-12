"use client";

import React from "react";
import { ClientOperationMap, MapMarker } from "./ClientOperationMap";
import { ChevronRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
};

interface InteractiveConflictViewerProps {
  conflict: EventDetail;
  events: EventDetail[];
}

export function InteractiveConflictViewer({ conflict, events }: InteractiveConflictViewerProps) {
  // Always include the conflict itself as the first event in the timeline (Overview)
  const allEvents = [
    { ...conflict, id: 'overview', title: 'Conflict Overview', type: 'conflict' as const },
    ...events
  ];

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requestedEvent = searchParams.get("event");
  const selectedEventId = allEvents.some((event) => event.id === requestedEvent) ? requestedEvent! : "overview";
  const selectedEvent = allEvents.find(e => e.id === selectedEventId) || allEvents[0];
  const selectEvent = (id: string) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set("view", "explorer");
    next.set("event", id);
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  };

  // Map markers for all events
  const markers: MapMarker[] = allEvents
    .filter(e => e.coordinates)
    .map(e => ({
      id: e.id,
      title: e.title,
      coordinates: e.coordinates!
    }));

  const defaultCenter = conflict.coordinates || [20.5937, 78.9629];

  return (
    <div className="w-full h-[800px] bg-bg-2 border border-border/40 rounded-lg overflow-hidden flex flex-col lg:flex-row relative">
      
      {/* LEFT COLUMN: Vertical Timeline */}
      <div className="w-full lg:w-72 bg-card border-b lg:border-b-0 lg:border-r border-border/40 flex flex-col z-10 overflow-hidden shrink-0">
        <div className="h-12 border-b border-border/40 flex items-center px-4 bg-muted/20 shrink-0">
          <span className="font-bold tracking-widest text-sm text-primary">TIMELINE</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {allEvents.map((event, index) => (
            <button
              key={event.id}
              type="button"
              aria-pressed={event.id === selectedEventId}
              aria-label={`Open ${event.title}`}
              onClick={() => selectEvent(event.id)}
              className={`w-full flex flex-col text-left px-4 py-3 rounded border transition-colors relative ${
                event.id === selectedEventId 
                  ? "border-primary bg-primary/10" 
                  : "border-border/30 hover:border-primary/50 bg-card/50"
              }`}
            >
              {/* Connector Line */}
              {index !== allEvents.length - 1 && (
                <div className="absolute left-6 top-full w-px h-2 bg-border/50" />
              )}
              <span className="text-[10px] text-muted-foreground tracking-widest mb-1 uppercase font-mono">{event.date}</span>
              <span className="text-sm font-bold">{event.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* MIDDLE COLUMN: Detailed Account */}
      <div className="flex-1 min-w-[300px] max-w-[500px] bg-card/80 backdrop-blur flex flex-col z-10 border-b lg:border-b-0 lg:border-r border-border/40">
        <div className="h-12 border-b border-border/40 flex items-center px-4 bg-muted/20 shrink-0">
          <span className="font-bold tracking-widest text-sm text-primary">DOSSIER</span>
        </div>
        
        <div className="flex-1 overflow-y-auto relative p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedEvent.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-xs text-primary mb-2 tracking-widest font-mono">{selectedEvent.date}</div>
              <h3 className="text-2xl font-bold tracking-wider mb-2 uppercase">{selectedEvent.title}</h3>
              
              <div className="prose prose-invert max-w-none text-muted-foreground mt-6 text-sm leading-relaxed mb-8">
                {selectedEvent.content || selectedEvent.summary}
              </div>
              
              <div className="space-y-4 mt-auto">
                {selectedEvent.referenceUrl && (
                  <a 
                    href={selectedEvent.referenceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-bold tracking-widest text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" /> OFFICIAL DOCUMENTATION
                  </a>
                )}
                
                {selectedEvent.type === 'operation' && selectedEvent.slug && (
                  <Link 
                    href={`/operations/${selectedEvent.slug}`} 
                    className="w-full py-3 flex items-center justify-between text-xs font-bold tracking-widest text-primary border border-primary/30 rounded px-4 hover:bg-primary/10 transition-colors"
                  >
                    VIEW FULL REPORT <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT COLUMN: Tactical Map */}
      <div className="flex-1 relative bg-[#0a1017] overflow-hidden min-h-[400px]">
        <ClientOperationMap 
          markers={markers} 
          activeMarkerId={selectedEventId === 'overview' ? (selectedEvent.coordinates ? selectedEvent.id : undefined) : selectedEventId} 
          defaultCenter={defaultCenter}
          compact
          showActiveCoordinates={false}
        />
      </div>

    </div>
  );
}
