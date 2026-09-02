"use client";

import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crosshair, MapPin, ChevronRight, X } from "lucide-react";
import Link from "next/link";

type WarRoomEvent = {
  id: string;
  title: string;
  date: string;
  summary: string;
  coordinates: { x: number; y: number };
  details: string;
};

// Placeholder events for Kargil
const EVENTS: WarRoomEvent[] = [
  {
    id: "e1",
    title: "Infiltration Discovered",
    date: "May 3, 1999",
    summary: "Local shepherds report armed men on the heights.",
    coordinates: { x: 30, y: 40 },
    details: "Local shepherds in Batalik sector noticed unknown armed personnel constructing bunkers on the ridgelines. Initial patrols sent by the Indian Army are ambushed.",
  },
  {
    id: "e2",
    title: "Operation Safed Sagar",
    date: "May 26, 1999",
    summary: "Indian Air Force launches airstrikes.",
    coordinates: { x: 45, y: 35 },
    details: "The Indian Air Force begins air strikes against the infiltrated positions. Due to the high altitude, targeting is complex, leading to the adaptation of Mirage 2000s for laser-guided bombing.",
  },
  {
    id: "e3",
    title: "Battle of Tololing",
    date: "June 13, 1999",
    summary: "Crucial victory secures the strategic peak.",
    coordinates: { x: 35, y: 50 },
    details: "After weeks of bitter fighting, the Rajputana Rifles capture the Tololing peak. This was the turning point of the war, providing a foothold for further assaults.",
  },
  {
    id: "e4",
    title: "Capture of Tiger Hill",
    date: "July 4, 1999",
    summary: "The most prominent peak falls after a grueling assault.",
    coordinates: { x: 40, y: 55 },
    details: "The 18 Grenadiers, supported by artillery and the 8 Sikh, launch a multi-directional assault on Tiger Hill. The peak is captured after intense close-quarters combat.",
  }
];

export function WarRoom() {
  const [selectedEventId, setSelectedEventId] = useState<string>(EVENTS[0].id);
  const selectedEvent = EVENTS.find(e => e.id === selectedEventId) || EVENTS[0];

  return (
    <div className="w-full h-[800px] bg-bg-2 border border-border/40 rounded-lg overflow-hidden flex flex-col font-mono relative">
      {/* Top Bar */}
      <div className="h-12 border-b border-border/40 flex items-center justify-between px-4 bg-muted/20">
        <div className="flex items-center gap-2 text-primary">
          <Crosshair className="w-4 h-4" />
          <span className="font-bold tracking-widest text-sm">WAR ROOM / TACTICAL OVERVIEW</span>
        </div>
        <div className="text-xs text-muted-foreground tracking-widest">OP VIJAY 1999</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row relative">
        {/* Map Area */}
        <div className="flex-1 relative bg-[#0a1017] overflow-hidden">
          {/* Topographic Background Placeholder */}
          <div className="absolute inset-0 opacity-20" 
               style={{ backgroundImage: 'radial-gradient(circle at center, #708773 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          </div>
          
          {/* Nodes */}
          {EVENTS.map(event => {
            const isSelected = event.id === selectedEventId;
            return (
              <button
                key={event.id}
                onClick={() => setSelectedEventId(event.id)}
                className={`absolute w-6 h-6 -ml-3 -mt-3 rounded-full flex items-center justify-center transition-all ${
                  isSelected ? "bg-primary text-primary-foreground z-20 scale-125 shadow-[0_0_15px_rgba(201,154,69,0.5)]" : "bg-muted text-muted-foreground hover:bg-primary/50 z-10"
                }`}
                style={{ left: `${event.coordinates.x}%`, top: `${event.coordinates.y}%` }}
              >
                <span className="sr-only">{event.title}</span>
                {isSelected && (
                  <motion.div
                    layoutId="pulse"
                    className="absolute inset-0 border border-primary rounded-full"
                    animate={{ scale: [1, 1.5, 2], opacity: [1, 0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                <MapPin className="w-3 h-3" />
              </button>
            );
          })}
          
          {/* Map Overlay Text */}
          <div className="absolute bottom-4 left-4 text-xs text-muted-foreground/50 tracking-widest">
            {selectedEvent.coordinates.x.toFixed(2)}° N / {selectedEvent.coordinates.y.toFixed(2)}° E
          </div>
        </div>

        {/* Dossier Area */}
        <div className="w-full lg:w-96 border-l border-border/40 bg-card/50 backdrop-blur flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedEvent.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="p-6 flex-1 overflow-y-auto"
            >
              <div className="text-xs text-primary mb-2 tracking-widest">{selectedEvent.date}</div>
              <h3 className="text-xl font-bold tracking-wider mb-4 uppercase">{selectedEvent.title}</h3>
              <p className="text-sm text-foreground/80 leading-relaxed mb-6">
                {selectedEvent.details}
              </p>
              
              <div className="space-y-4">
                <div className="p-3 border border-border/30 rounded bg-muted/20">
                  <div className="text-xs text-muted-foreground tracking-widest uppercase mb-1">Status</div>
                  <div className="text-sm font-bold text-destructive">CRITICAL</div>
                </div>
                
                <Link href="/history/kargil-1999" className="w-full py-2 flex items-center justify-between text-xs font-bold tracking-widest text-primary border border-primary/30 rounded px-4 hover:bg-primary/10 transition-colors">
                  VIEW FULL REPORT <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Timeline Strip */}
      <div className="h-24 border-t border-border/40 bg-muted/10 flex items-center px-4 overflow-x-auto">
        <div className="flex gap-2 min-w-max pb-2">
          {EVENTS.map(event => (
            <button
              key={event.id}
              onClick={() => setSelectedEventId(event.id)}
              className={`flex flex-col text-left px-4 py-2 rounded border transition-colors ${
                event.id === selectedEventId 
                  ? "border-primary bg-primary/10" 
                  : "border-border/30 hover:border-primary/50 bg-card"
              }`}
            >
              <span className="text-[10px] text-muted-foreground tracking-widest mb-1">{event.date}</span>
              <span className="text-xs font-bold truncate w-40">{event.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
