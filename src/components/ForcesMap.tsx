"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, GeoJSON, Polyline, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Force, ServiceLevel, Command } from '@/app/forces/forcesData';
import type { GeoJsonObject } from 'geojson';

interface ForcesMapProps {
  forcesData: Force[];
  activeService: ServiceLevel;
  selectedCommandName?: string | null;
  onSelectCommand?: (command: Command | null, force: Force | null) => void;
}

function formatCoordinates([lat, lng]: [number, number]): string {
  const latStr = `${Math.abs(lat).toFixed(2)}° ${lat >= 0 ? 'N' : 'S'}`;
  const lngStr = `${Math.abs(lng).toFixed(2)}° ${lng >= 0 ? 'E' : 'W'}`;
  return `${latStr}, ${lngStr}`;
}

function formatCoordinatesDetailed([lat, lng]: [number, number]): string {
  const latStr = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}`;
  const lngStr = `${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}`;
  return `${latStr}, ${lngStr}`;
}

function MapController({ 
  selectedHQ, 
  onReset 
}: { 
  selectedHQ: Command | null; 
  onReset: () => void;
}) {
  const map = useMap();
  
  useMapEvents({
    click() {
      onReset();
    }
  });

  useEffect(() => {
    if (selectedHQ) {
      map.flyTo(selectedHQ.hqCoordinates, 6.5, {
        duration: 1.2
      });
    } else {
      map.flyTo([22.5937, 78.9629], 4.5, {
        duration: 1.2
      });
    }
  }, [selectedHQ, map]);

  return null;
}

export default function ForcesMap({ 
  forcesData, 
  activeService, 
  selectedCommandName, 
  onSelectCommand 
}: ForcesMapProps) {
  const [geoJsonData, setGeoJsonData] = useState<GeoJsonObject | null>(null);
  const [internalSelectedHQ, setInternalSelectedHQ] = useState<Command | null>(null);
  const [internalSelectedForce, setInternalSelectedForce] = useState<Force | null>(null);

  useEffect(() => {
    fetch('/india-states.geojson')
      .then(res => res.json())
      .then(data => setGeoJsonData(data))
      .catch(err => console.error("Error loading geojson", err));
  }, []);

  // Sync external selectedCommandName with internal state
  useEffect(() => {
    if (selectedCommandName) {
      for (const force of forcesData) {
        const found = force.commands.find(c => c.name === selectedCommandName);
        if (found) {
          const timer = setTimeout(() => {
            setInternalSelectedHQ(found);
            setInternalSelectedForce(force);
          }, 0);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [selectedCommandName, forcesData]);

  // When activeService changes, reset if current HQ doesn't belong to the active service
  useEffect(() => {
    if (activeService !== 'All' && internalSelectedForce && internalSelectedForce.name !== activeService) {
      const timer = setTimeout(() => {
        setInternalSelectedHQ(null);
        setInternalSelectedForce(null);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [activeService, internalSelectedForce]);

  const selectedHQ = internalSelectedHQ;
  const selectedForce = internalSelectedForce;

  const handleSelect = (cmd: Command | null, force: Force | null) => {
    setInternalSelectedHQ(cmd);
    setInternalSelectedForce(force);
    if (onSelectCommand) {
      onSelectCommand(cmd, force);
    }
  };

  const displayedForces = activeService === 'All' 
    ? forcesData 
    : forcesData.filter(f => f.name === activeService);

  const getServiceColor = (serviceName: string) => {
    switch (serviceName) {
      case 'INDIAN ARMY': return '#39ff14'; // Neon Green
      case 'INDIAN NAVY': return '#00d4ff'; // Neon Blue
      case 'INDIAN AIR FORCE': return '#ffffff'; // Neon White
      case 'TRI-SERVICE COMMANDS': return '#ff9900'; // Neon Orange
      default: return '#39ff14';
    }
  };

  const stateColorMap = new Map<string, string>();
  
  if (selectedHQ && selectedForce) {
    const forceColor = getServiceColor(selectedForce.name);
    selectedHQ.coverageStates.forEach(state => {
      stateColorMap.set(state, forceColor);
    });
  } else {
    displayedForces.forEach(force => {
      const forceColor = getServiceColor(force.name);
      force.commands.forEach((cmd) => {
        cmd.coverageStates.forEach(state => {
          if (!stateColorMap.has(state)) {
            stateColorMap.set(state, forceColor);
          }
        });
      });
    });
  }

  const getStyle = (feature: { properties?: { NAME_1?: string } } | undefined) => {
    const stateName = feature?.properties?.NAME_1;
    const color = stateName ? stateColorMap.get(stateName) : undefined;
    
    if (color) {
      return {
        fillColor: color,
        weight: selectedHQ ? 2.5 : 1,
        opacity: 0.9,
        color: color,
        dashArray: selectedHQ ? '' : '3',
        fillOpacity: selectedHQ ? 0.3 : 0.12
      };
    }
    return {
      fillColor: '#121e16',
      weight: 1,
      opacity: 0.25,
      color: '#1f3d2b',
      fillOpacity: 0.05
    };
  };

  const createNeonIcon = (color: string, isSelected: boolean) => {
    const size = isSelected ? 20 : 14;
    return L.divIcon({
      className: 'custom-neon-marker',
      html: `<div style="width: ${size}px; height: ${size}px; background-color: ${color}; border-radius: 50%; box-shadow: 0 0 ${isSelected ? '18px 5px' : '10px 2px'} ${color}; border: 2px solid white; cursor: pointer; transition: all 0.3s ease;"></div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -12]
    });
  };

  const createBaseIcon = (color: string) => {
    return L.divIcon({
      className: 'custom-base-marker',
      html: `<div style="width: 10px; height: 10px; background-color: ${color}; border-radius: 50%; box-shadow: 0 0 10px 2px ${color}; border: 2px solid #ffffff; cursor: pointer; transition: transform 0.2s;"></div>`,
      iconSize: [10, 10],
      iconAnchor: [5, 5],
      popupAnchor: [0, -8]
    });
  };

  return (
    <div className="relative z-0 w-full h-full min-h-[500px] dark-map-tiles rounded-xl overflow-hidden border border-primary/30">
      <MapContainer 
        center={[22.5937, 78.9629]} 
        zoom={4.5} 
        style={{ height: '100%', width: '100%', minHeight: '550px', backgroundColor: '#050c08' }}
      >
        <MapController selectedHQ={selectedHQ} onReset={() => handleSelect(null, null)} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geoJsonData && (
          <GeoJSON data={geoJsonData} style={getStyle} />
        )}
        
        {/* Render HQ Markers */}
        {displayedForces.map(force => {
          const markerColor = getServiceColor(force.name);
          
          return force.commands.map(cmd => {
            const isSelected = selectedHQ?.name === cmd.name;
            const hqIcon = createNeonIcon(markerColor, isSelected);

            return (
              <React.Fragment key={cmd.name}>
                <Marker 
                  position={cmd.hqCoordinates} 
                  icon={hqIcon} 
                  zIndexOffset={isSelected ? 1000 : 100}
                  eventHandlers={{
                    click: () => handleSelect(cmd, force)
                  }}
                >
                  <Popup className="hq-popup">
                    <div className="p-3 max-w-[290px] font-sans">
                      <div className="mb-2.5 border-b border-gray-700/80 pb-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider" style={{ color: markerColor }}>
                            {force.name}
                          </span>
                          <span className="text-[9px] font-mono text-gray-400">
                            THEATRE HQ
                          </span>
                        </div>
                        <strong className="text-base font-bold text-white block leading-tight mt-0.5">
                          {cmd.name}
                        </strong>
                        <div className="flex items-center justify-between text-xs text-primary font-mono mt-1.5 pt-1 border-t border-gray-800">
                          <span>HQ: {cmd.hq}</span>
                          <span className="text-[10px] text-gray-200 font-mono bg-black/70 px-1.5 py-0.5 rounded border border-gray-700">
                            {formatCoordinatesDetailed(cmd.hqCoordinates)}
                          </span>
                        </div>
                      </div>

                      {/* Operational Stations Status Badge - List Removed, Bases Highlighted on Map */}
                      {cmd.bases && cmd.bases.length > 0 ? (
                        <div className="mt-2.5 p-2 rounded-lg bg-black/60 border border-gray-700/70 font-mono">
                          <div className="flex items-center justify-between text-[11px] text-gray-200 font-bold mb-1">
                            <span className="flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full animate-ping" style={{ backgroundColor: markerColor }} />
                              <span>OPERATIONAL BASES</span>
                            </span>
                            <span className="text-primary">{cmd.bases.length} STATIONS</span>
                          </div>
                          <p className="text-[10px] text-gray-400 leading-snug">
                            Highlighted on tactical map with real-time positional vectors &amp; telemetry.
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 mt-1 font-mono">
                          Coverage: {cmd.coverage}
                        </p>
                      )}

                      <div className="mt-2.5 pt-2 border-t border-gray-700/60 flex items-center justify-between text-[10px] font-mono text-gray-400">
                        <span className="truncate max-w-[190px]">AOR: {cmd.coverage}</span>
                        <span className="text-primary/90 font-bold">ACTIVE</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>

                {/* When this command is selected, highlight all its operational bases directly on the map with permanent name labels and coordinates! */}
                {isSelected && cmd.bases && (
                  <>
                    {/* Tactical Vector link lines from HQ to Bases */}
                    {cmd.bases.map((base) => (
                      <Polyline
                        key={`vector-${cmd.name}-${base.name}`}
                        positions={[cmd.hqCoordinates, base.coordinates]}
                        pathOptions={{
                          color: markerColor,
                          weight: 1.5,
                          dashArray: '4, 6',
                          opacity: 0.65,
                        }}
                      />
                    ))}

                    {/* Operational Base Markers with Permanent Labels */}
                    {cmd.bases.map((base) => {
                      const baseIcon = createBaseIcon(markerColor);
                      return (
                        <Marker
                          key={`${cmd.name}-${base.name}`}
                          position={base.coordinates}
                          icon={baseIcon}
                          zIndexOffset={950}
                        >
                          <Tooltip
                            direction="top"
                            offset={[0, -10]}
                            opacity={0.96}
                            permanent={true}
                            className="tactical-base-tooltip"
                          >
                            <div className="font-mono text-[11px] leading-tight flex flex-col items-center">
                              <span className="font-bold text-white tracking-wide flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: markerColor }} />
                                {base.name}
                              </span>
                              <span className="text-[9px] text-gray-300 font-mono mt-0.5 font-normal">
                                {formatCoordinates(base.coordinates)}
                              </span>
                            </div>
                          </Tooltip>
                          <Popup className="hq-popup">
                            <div className="p-2.5 max-w-[240px] font-mono text-xs space-y-1.5">
                              <div className="flex items-center justify-between border-b border-gray-700/70 pb-1">
                                <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: markerColor }}>
                                  OPERATIONAL STATION
                                </span>
                                <span className="text-[9px] text-gray-400">{force.name}</span>
                              </div>
                              <strong className="text-sm font-bold text-white block">
                                {base.name}
                              </strong>
                              <div className="text-[10px] text-gray-300 pt-1 border-t border-gray-800 flex items-center justify-between">
                                <span className="text-gray-400">COMMAND:</span>
                                <span className="text-white truncate max-w-[130px]">{cmd.name}</span>
                              </div>
                              <div className="text-[10px] text-gray-300 flex items-center justify-between">
                                <span className="text-gray-400">COORDINATES:</span>
                                <span className="text-primary font-bold">{formatCoordinatesDetailed(base.coordinates)}</span>
                              </div>
                            </div>
                          </Popup>
                        </Marker>
                      );
                    })}
                  </>
                )}
              </React.Fragment>
            );
          });
        })}
      </MapContainer>
    </div>
  );
}
