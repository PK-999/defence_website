"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, GeoJSON, useMapEvents, useMap } from 'react-leaflet';
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
          setInternalSelectedHQ(found);
          setInternalSelectedForce(force);
          return;
        }
      }
    }
  }, [selectedCommandName, forcesData]);

  // When activeService changes, reset if current HQ doesn't belong to the active service
  useEffect(() => {
    if (activeService !== 'All' && internalSelectedForce && internalSelectedForce.name !== activeService) {
      setInternalSelectedHQ(null);
      setInternalSelectedForce(null);
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
      html: `<div style="width: ${size}px; height: ${size}px; background-color: ${color}; border-radius: 50%; box-shadow: 0 0 ${isSelected ? '16px 4px' : '10px 2px'} ${color}; border: 2px solid white; cursor: pointer; transition: all 0.3s ease;"></div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -12]
    });
  };

  const createBaseIcon = (color: string) => {
    return L.divIcon({
      className: 'custom-base-marker',
      html: `<div style="width: 9px; height: 9px; background-color: ${color}; border-radius: 50%; box-shadow: 0 0 8px ${color}; border: 1.5px solid #ffffff; cursor: pointer;"></div>`,
      iconSize: [9, 9],
      iconAnchor: [4.5, 4.5]
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
                  {/* Clean, Non-Redundant HQ Dialog Box as Requested in Pic 3 */}
                  <Popup className="hq-popup">
                    <div className="p-3 max-w-[280px] font-sans">
                      <div className="mb-2.5 border-b border-gray-700/80 pb-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider block" style={{ color: markerColor }}>
                          {force.name}
                        </span>
                        <strong className="text-base font-bold text-white block leading-tight mt-0.5">
                          {cmd.name}
                        </strong>
                        <span className="text-xs text-primary font-mono block mt-1">
                          Headquarters: {cmd.hq}
                        </span>
                      </div>

                      {/* Prominently Mention and Highlight Operational Bases Under Command */}
                      {cmd.bases && cmd.bases.length > 0 ? (
                        <div className="mt-2">
                          <strong className="text-[10px] text-gray-300 uppercase tracking-wider font-mono block mb-1.5">
                            Major Bases Under Command ({cmd.bases.length}):
                          </strong>
                          <ul className="space-y-1 max-h-36 overflow-y-auto pr-1 text-xs text-gray-200 font-mono">
                            {cmd.bases.map((base) => (
                              <li key={base.name} className="flex items-center gap-1.5 text-[11px]">
                                <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: markerColor }} />
                                <span className="truncate">{base.name}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 mt-1">
                          Coverage: {cmd.coverage}
                        </p>
                      )}

                      <div className="mt-2.5 pt-2 border-t border-gray-700/60 flex items-center justify-between text-[10px] font-mono text-gray-400">
                        <span>AOR: {cmd.coverage}</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>

                {/* When this command is selected, also render all its major operational bases as markers on the map! */}
                {isSelected && cmd.bases && cmd.bases.map((base) => {
                  const baseIcon = createBaseIcon(markerColor);
                  return (
                    <Marker
                      key={`${cmd.name}-${base.name}`}
                      position={base.coordinates}
                      icon={baseIcon}
                      zIndexOffset={900}
                    >
                      <Tooltip direction="top" offset={[0, -6]} opacity={0.9} permanent={false}>
                        <div className="font-mono text-xs text-black">
                          <strong>{base.name}</strong>
                          <span className="block text-[10px] text-gray-600">Base · {cmd.name}</span>
                        </div>
                      </Tooltip>
                    </Marker>
                  );
                })}
              </React.Fragment>
            );
          });
        })}
      </MapContainer>
    </div>
  );
}
