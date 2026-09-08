"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";

export type TimelineEvent = {
  id: string;
  date: string;
  title: string;
  description?: string;
};

interface TimelineProps {
  events: TimelineEvent[];
}

export function Timeline({ events }: TimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (!events || events.length === 0) return null;

  return (
    <div className="relative w-full py-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold tracking-widest text-primary uppercase border-l-2 border-primary pl-4">Chronology</h3>
        <div className="flex gap-2">
          <button onClick={scrollLeft} className="p-2 border border-border/40 hover:bg-primary/10 hover:text-primary transition-colors rounded">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={scrollRight} className="p-2 border border-border/40 hover:bg-primary/10 hover:text-primary transition-colors rounded">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="relative flex items-center">
        {/* Horizontal Line connecting nodes */}
        <div className="absolute left-0 right-0 h-0.5 bg-border/40 top-[1.375rem] -z-10" />

        <div 
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto pb-8 pt-2 px-2 scrollbar-hide snap-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {events.map((ev, i) => (
            <motion.div 
              key={ev.id} 
              className="flex flex-col min-w-[280px] max-w-[320px] snap-start"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.5, margin: "0px -20px" }}
              transition={{ delay: i * 0.1 }}
              onViewportEnter={() => {
                window.dispatchEvent(new CustomEvent('scroll-spy-active', { detail: ev.id }));
              }}
            >
              {/* Timeline Node */}
              <div className="w-4 h-4 rounded-full bg-primary/20 border-2 border-primary shadow-[0_0_10px_rgba(201,154,69,0.5)] mb-6 mx-auto relative">
                {/* Connector line to the box */}
                <div className="absolute w-px h-6 bg-border/40 left-1/2 -bottom-6 -translate-x-1/2" />
              </div>
              
              {/* Event Content Box */}
              <div className="bg-card border border-border/50 p-5 rounded-lg hover:border-primary/50 transition-colors h-full flex flex-col">
                <div className="text-xs font-bold tracking-widest text-muted-foreground mb-2 font-mono">
                  {ev.date}
                </div>
                <h4 className="text-lg font-bold tracking-wider text-foreground mb-3">
                  {ev.title}
                </h4>
                {ev.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
                    {ev.description}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
