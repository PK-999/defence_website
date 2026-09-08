"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronRight, ChevronDown } from "lucide-react";

export type VerticalTimelineEvent = {
  id: string;
  title: string;
  dateStr: string;
  summary: string;
  slug: string;
  type: 'history' | 'operations';
};

interface VerticalTimelineProps {
  events: VerticalTimelineEvent[];
}

export function VerticalTimeline({ events }: VerticalTimelineProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div className="relative border-l border-border/40 ml-4 pl-8 py-4 space-y-12">
      {events.map((event, i) => {
        const isExpanded = expandedId === event.id;
        
        return (
          <div key={event.id} className="relative group">
            {/* Timeline Node */}
            <div 
              className={`absolute -left-[39px] w-4 h-4 rounded-full border-2 transition-all cursor-pointer ${
                isExpanded 
                  ? "bg-primary border-primary shadow-[0_0_10px_rgba(201,154,69,0.8)]" 
                  : "bg-background border-primary/50 group-hover:border-primary group-hover:bg-primary/20"
              }`}
              onClick={() => toggleExpand(event.id)}
            />
            
            <div className="cursor-pointer" onClick={() => toggleExpand(event.id)}>
              <div className="text-sm font-bold tracking-widest text-muted-foreground font-mono mb-2">
                {event.dateStr}
              </div>
              <h3 className={`text-2xl font-bold tracking-wider uppercase transition-colors ${isExpanded ? "text-primary" : "group-hover:text-primary/80"}`}>
                {event.title}
              </h3>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 pb-2">
                    <p className="text-lg text-foreground/80 leading-relaxed mb-6 max-w-3xl">
                      {event.summary}
                    </p>
                    <Link 
                      href={`/${event.type}/${event.slug}`} 
                      className="inline-flex items-center gap-2 px-6 py-3 border border-primary/30 rounded bg-primary/5 hover:bg-primary/10 text-primary font-bold tracking-widest text-sm transition-colors uppercase"
                    >
                      {event.type === 'history' ? "ENTER WAR ROOM" : "VIEW DETAILS"}
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
