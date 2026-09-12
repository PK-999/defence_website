"use client";

import React, { useState, useEffect } from "react";
import { ClientOperationMap, MapMarker } from "./ClientOperationMap";
import { Timeline, TimelineEvent } from "./ui/Timeline";

interface InteractiveMapLayoutProps {
  children: React.ReactNode;
  markers: MapMarker[];
  defaultCenter?: [number, number];
  extraSidebarContent?: React.ReactNode;
  timelineEvents?: TimelineEvent[];
  mapCompact?: boolean;
  showActiveCoordinates?: boolean;
}

export function InteractiveMapLayout({ children, markers, defaultCenter, extraSidebarContent, timelineEvents = [], mapCompact = false, showActiveCoordinates = true }: InteractiveMapLayoutProps) {
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(timelineEvents[0]?.id ?? null);

  useEffect(() => {
    const handleScrollSpy = (e: CustomEvent) => {
      if (markers.some((marker) => marker.id === e.detail)) setActiveMarkerId(e.detail);
    };
    window.addEventListener('scroll-spy-active', handleScrollSpy as EventListener);
    return () => window.removeEventListener('scroll-spy-active', handleScrollSpy as EventListener);
  }, [markers]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
      <div className="lg:col-span-2 space-y-12">
        {children}
      </div>
      
      <div className="lg:col-span-1 border-l border-border/40 pl-8">
        <div className="sticky top-24 space-y-12">
          <section>
            <h2 className="text-xl font-bold tracking-wider mb-4 border-l-2 border-primary pl-4 uppercase">Tactical Map</h2>
            <div className="h-[400px] w-full border border-border/40 rounded overflow-hidden">
              <ClientOperationMap 
                markers={markers} 
                activeMarkerId={activeMarkerId} 
                defaultCenter={defaultCenter} 
                compact={mapCompact}
                showActiveCoordinates={showActiveCoordinates}
              />
            </div>
          </section>
          
          {extraSidebarContent}
        </div>
      </div>

      {timelineEvents.length > 0 && (
        <div className="lg:col-span-2">
          <Timeline
            events={timelineEvents}
            activeEventId={activeMarkerId}
            onSelect={(event) => setActiveMarkerId(event.id)}
          />
        </div>
      )}
    </div>
  );
}

export function ScrollSpySection({ id, children, className }: { id: string, children: React.ReactNode, className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.dispatchEvent(new CustomEvent('scroll-spy-active', { detail: id }));
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [id]);

  return <div ref={ref} className={className}>{children}</div>;
}
