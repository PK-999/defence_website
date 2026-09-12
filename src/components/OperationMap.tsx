"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix standard Leaflet icon paths in Next.js
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const customIcon = L.divIcon({
  className: "custom-leaflet-icon",
  html: `<div style="background-color: #c99a45; width: 24px; height: 24px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 20px rgba(201,154,69,1);"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const activeIcon = L.divIcon({
  className: "custom-leaflet-icon",
  html: `<div style="background-color: #fca5a5; width: 32px; height: 32px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 24px rgba(252,165,165,1); display: flex; align-items: center; justify-content: center;"><div style="width: 12px; height: 12px; background: white; border-radius: 50%;"></div></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

function MapController({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

export interface MapMarker {
  id: string;
  coordinates: [number, number];
  title: string;
}

interface OperationMapProps {
  markers: MapMarker[];
  activeMarkerId?: string | null;
  defaultCenter?: [number, number];
  showActiveCoordinates?: boolean;
}

export default function OperationMap({ markers, activeMarkerId, defaultCenter, showActiveCoordinates = true }: OperationMapProps) {
  const activeMarker = markers.find(m => m.id === activeMarkerId) || markers[0];
  const center = activeMarker ? activeMarker.coordinates : (defaultCenter || [20.5937, 78.9629] as [number, number]);
  const currentZoom = activeMarkerId ? 12 : 11;

  return (
    <div data-map-active-marker={activeMarker?.id ?? ""} className="w-full h-full min-h-[400px] bg-[#0a1017] border border-border/40 rounded-lg overflow-hidden relative">
      <MapContainer 
        center={center} 
        zoom={currentZoom} 
        style={{ height: "100%", width: "100%", background: "#0a1017", position: "absolute", inset: 0 }}
        zoomControl={true}
        attributionControl={true}
      >
        <TileLayer
          url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          attribution='Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap (CC-BY-SA)'
        />
        
        {/* Dark overlay to match aesthetic */}
        <div className="absolute inset-0 pointer-events-none bg-[#0a1017]/30 z-[400]" />

        <MapController center={center} zoom={currentZoom} />
        
        {markers.map(marker => {
          const isActive = marker.id === activeMarkerId;
          return (
            <Marker 
              key={marker.id}
              position={marker.coordinates}
              icon={isActive ? activeIcon : customIcon}
              zIndexOffset={isActive ? 1000 : 0}
            >
              <Popup className="text-black">
                <strong>{marker.title}</strong>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      {activeMarker && showActiveCoordinates && (
        <div className="absolute bottom-4 left-4 text-xs text-muted-foreground/80 font-bold tracking-widest z-[500] drop-shadow-md bg-black/50 p-2 rounded pointer-events-none">
          COORD: {activeMarker.coordinates[0].toFixed(4)}° N / {activeMarker.coordinates[1].toFixed(4)}° E
        </div>
      )}
    </div>
  );
}
