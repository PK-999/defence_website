"use client";

import dynamic from "next/dynamic";
import React from "react";

const DynamicMap = dynamic(() => import("./OperationMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-[#0a1017] text-primary/50 tracking-widest text-sm border border-border/40 rounded-lg">INITIALIZING TACTICAL MAP...</div>
});

export interface MapMarker {
  id: string;
  coordinates: [number, number];
  title: string;
}

interface Props {
  markers: MapMarker[];
  activeMarkerId?: string | null;
  defaultCenter?: [number, number];
}

export function ClientOperationMap({ markers, activeMarkerId, defaultCenter }: Props) {
  const [enabled, setEnabled] = React.useState(false);
  const [retryNonce, setRetryNonce] = React.useState(0);
  return <div className="space-y-3">
    <div className="rounded border border-border/60 bg-card/40 p-4 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-semibold">Documented locations</p><p className="text-xs text-muted-foreground">Coordinates are shown only when a reviewed record provides them.</p></div><button type="button" onClick={() => setEnabled(true)} className="rounded border border-primary/50 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/10">{enabled ? "Map shown" : "Show map"}</button></div>
      {markers.length > 0 ? <ul className="mt-3 space-y-1 text-xs text-muted-foreground">{markers.map((marker) => <li key={marker.id}>{marker.title}: {marker.coordinates[0].toFixed(4)}, {marker.coordinates[1].toFixed(4)}</li>)}</ul> : <p className="mt-3 text-xs text-muted-foreground">No documented coordinates are available.</p>}
    </div>
    {enabled && <div key={retryNonce} className="relative"><DynamicMap markers={markers} activeMarkerId={activeMarkerId} defaultCenter={defaultCenter} /><button type="button" onClick={() => setRetryNonce((value) => value + 1)} className="absolute bottom-3 right-3 z-[1000] rounded border border-border bg-background/90 px-2 py-1 text-xs text-muted-foreground hover:text-foreground">Retry map</button></div>}
  </div>;
}
