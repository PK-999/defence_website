"use client";

import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crosshair, ChevronRight } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { WarRoomEvent } from "./WarRoomMap";

// Dynamically import the map to avoid SSR issues with Leaflet
const DynamicMap = dynamic(() => import("./WarRoomMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-[#0a1017] text-primary/50 tracking-widest text-sm">INITIALIZING TACTICAL MAP...</div>
});

// Kargil events with real GPS coordinates
const EVENTS: WarRoomEvent[] = [
  {
    id: "e1",
    title: "Infiltration Discovered",
    date: "May 3, 1999",
    summary: "Local shepherds report armed men on the heights.",
    coordinates: [34.6186, 76.1558], // Batalik Sector approx
    details: "Local shepherds in Batalik sector noticed unknown armed personnel constructing bunkers on the ridgelines. Initial patrols sent by the Indian Army are ambushed.",
  },
  {
    id: "e2",
    title: "Battle of Tololing",
    date: "June 13, 1999",
    summary: "Crucial victory secures the strategic peak.",
    coordinates: [34.4533, 76.0022], // Tololing Peak approx
    details: "After weeks of bitter fighting, the Rajputana Rifles capture the Tololing peak. This was the turning point of the war, providing a foothold for further assaults.",
  },
  {
    id: "e3",
    title: "Capture of Point 5140",
    date: "June 20, 1999",
    summary: "Capt. Vikram Batra leads the assault.",
    coordinates: [34.4550, 75.9900], // Near Tololing
    details: "Captured by 13 JAK RIF. Capt. Vikram Batra gave his famous victory signal 'Yeh Dil Maange More!' after successfully capturing this high-altitude feature.",
  },
  {
    id: "e4",
    title: "Capture of Tiger Hill",
    date: "July 4, 1999",
    summary: "The most prominent peak falls after a grueling assault.",
    coordinates: [34.4633, 75.9861], // Tiger Hill approx
    details: "The 18 Grenadiers, supported by artillery and the 8 Sikh, launch a multi-directional assault on Tiger Hill. The peak is captured after intense close-quarters combat.",
  },
  {
    id: "e5",
    title: "Operation Safed Sagar",
    date: "July 11, 1999",
    summary: "Air force strikes and Pakistani retreat.",
    coordinates: [34.5200, 75.8100], // Muntho Dhalo
    details: "Major logistics camps like Muntho Dhalo were destroyed by IAF airstrikes. Faced with overwhelming military pressure, the remaining infiltrators begin to retreat.",
  }
];

export function WarRoom() {
  const [selectedEventId, setSelectedEventId] = useState<string>(EVENTS[0].id);
  const selectedEvent = EVENTS.find(e => e.id === selectedEventId) || EVENTS[0];

  return (
    <div className="w-full h-[800px] bg-bg-2 border border-border/40 rounded-lg overflow-hidden flex flex-col font-mono relative">
      {/* Top Bar */}
      <div className="h-12 border-b border-border/40 flex items-center justify-between px-4 bg-muted/20 z-10">
        <div className="flex items-center gap-2 text-primary">
          <Crosshair className="w-4 h-4" />
          <span className="font-bold tracking-widest text-sm">WAR ROOM / TACTICAL OVERVIEW</span>
        </div>
        <div className="text-xs text-muted-foreground tracking-widest">OP VIJAY 1999</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row relative">
        {/* Map Area */}
        <div className="flex-1 relative bg-[#0a1017] overflow-hidden z-0">
          <DynamicMap
            events={EVENTS}
            selectedEventId={selectedEventId}
            onSelectEvent={setSelectedEventId}
          />
          
          {/* Map Overlay Text */}
          <div className="absolute bottom-4 left-4 text-xs text-muted-foreground/80 font-bold tracking-widest z-[500] drop-shadow-md">
            {selectedEvent.coordinates[0].toFixed(4)}° N / {selectedEvent.coordinates[1].toFixed(4)}° E
          </div>
        </div>

        {/* Dossier Area */}
        <div className="w-full lg:w-96 border-l border-border/40 bg-card/80 backdrop-blur flex flex-col z-10">
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
                
                <Link href="/conflicts/kargil-1999" className="w-full py-2 flex items-center justify-between text-xs font-bold tracking-widest text-primary border border-primary/30 rounded px-4 hover:bg-primary/10 transition-colors">
                  VIEW FULL REPORT <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Timeline Strip */}
      <div className="h-24 border-t border-border/40 bg-muted/10 flex items-center px-4 overflow-x-auto z-10">
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
