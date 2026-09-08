"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix standard Leaflet icon paths in Next.js
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom icon using the theme's primary color (gold)
const customIcon = L.divIcon({
  className: "custom-leaflet-icon",
  html: `<div style="background-color: #c99a45; width: 16px; height: 16px; border-radius: 50%; border: 2px solid #000; box-shadow: 0 0 10px rgba(201,154,69,0.8);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const activeIcon = L.divIcon({
  className: "custom-leaflet-icon active-icon",
  html: `<div style="background-color: #c99a45; width: 24px; height: 24px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 20px rgba(201,154,69,1);"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

export type WarRoomEvent = {
  id: string;
  title: string;
  date: string;
  summary: string;
  coordinates: [number, number]; // [lat, lng]
  details: string;
};

// Component to recenter map when event is selected
function MapController({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

interface WarRoomMapProps {
  events: WarRoomEvent[];
  selectedEventId: string;
  onSelectEvent: (id: string) => void;
}

export default function WarRoomMap({ events, selectedEventId, onSelectEvent }: WarRoomMapProps) {
  const selectedEvent = events.find(e => e.id === selectedEventId) || events[0];
  const center = selectedEvent.coordinates;

  return (
    <MapContainer 
      center={center} 
      zoom={11} 
      style={{ height: "100%", width: "100%", background: "#0a1017" }}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
        attribution='Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap (CC-BY-SA)'
      />
      
      {/* Dark overlay to match our aesthetic */}
      <div className="absolute inset-0 pointer-events-none bg-[#0a1017]/30 z-[400]" />

      <MapController center={center} zoom={11} />
      
      {events.map((event) => (
        <Marker 
          key={event.id}
          position={event.coordinates}
          icon={event.id === selectedEventId ? activeIcon : customIcon}
          eventHandlers={{
            click: () => onSelectEvent(event.id)
          }}
        />
      ))}
    </MapContainer>
  );
}
