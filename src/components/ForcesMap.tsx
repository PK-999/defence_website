import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Force, ServiceLevel, Command } from '@/app/forces/forcesData';
import type { GeoJsonObject } from 'geojson';

interface ForcesMapProps {
  forcesData: Force[];
  activeService: ServiceLevel;
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
        duration: 1.5
      });
    } else {
      map.flyTo([22.5937, 78.9629], 4.5, {
        duration: 1.5
      });
    }
  }, [selectedHQ, map]);

  return null;
}

export default function ForcesMap({ forcesData, activeService }: ForcesMapProps) {
  const [geoJsonData, setGeoJsonData] = useState<GeoJsonObject | null>(null);
  const [selectedHQ, setSelectedHQ] = useState<Command | null>(null);
  const [selectedForce, setSelectedForce] = useState<Force | null>(null);

  useEffect(() => {
    fetch('/india-states.geojson')
      .then(res => res.json())
      .then(data => setGeoJsonData(data))
      .catch(err => console.error("Error loading geojson", err));
  }, []);

  // Reset selected HQ when service filter changes
  useEffect(() => {
    // Service changes invalidate both selections; clear them before drawing the next map.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedHQ(null);
    setSelectedForce(null);
  }, [activeService]);

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
        weight: selectedHQ ? 2 : 1,
        opacity: 0.8,
        color: color,
        dashArray: selectedHQ ? '' : '3',
        fillOpacity: selectedHQ ? 0.25 : 0.15
      };
    }
    return {
      fillColor: '#1f2937',
      weight: 1,
      opacity: 0.2,
      color: '#374151',
      fillOpacity: 0.05
    };
  };

  const createNeonIcon = (color: string) => {
    return L.divIcon({
      className: 'custom-neon-marker',
      html: `<div style="width: 16px; height: 16px; background-color: ${color}; border-radius: 50%; box-shadow: 0 0 12px 3px ${color}; border: 2px solid white; cursor: pointer;"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
      popupAnchor: [0, -10]
    });
  };

  const createBaseIcon = (color: string) => {
    return L.divIcon({
      className: 'custom-neon-base-marker',
      html: `<div style="width: 10px; height: 10px; background-color: transparent; border-radius: 50%; box-shadow: 0 0 5px 1px ${color}; border: 2px solid ${color};"></div>`,
      iconSize: [10, 10],
      iconAnchor: [5, 5],
      popupAnchor: [0, -8]
    });
  };

  return (
    <div className="relative z-0 dark-map-tiles">
      <MapContainer center={[22.5937, 78.9629]} zoom={4.5} style={{ height: '600px', width: '100%', borderRadius: '0.5rem', backgroundColor: '#0a0a0a' }}>
        <MapController selectedHQ={selectedHQ} onReset={() => { setSelectedHQ(null); setSelectedForce(null); }} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geoJsonData && (
          <GeoJSON data={geoJsonData} style={getStyle} />
        )}
        
        {displayedForces.map(force => {
          const markerColor = getServiceColor(force.name);
          const hqIcon = createNeonIcon(markerColor);
          const baseIcon = createBaseIcon(markerColor);
          
          return force.commands.map(cmd => {
            const isSelected = selectedHQ?.name === cmd.name;

            return (
              <React.Fragment key={cmd.name}>
                <Marker 
                  position={cmd.hqCoordinates} 
                  icon={hqIcon} 
                  zIndexOffset={isSelected ? 1000 : 100}
                  eventHandlers={{
                    click: () => {
                      setSelectedHQ(cmd);
                      setSelectedForce(force);
                    }
                  }}
                >
                  <Popup className="hq-popup">
                    <div className="p-2">
                      <div className="mb-2 border-b border-gray-700 pb-2">
                        <strong className="text-lg text-white block leading-tight">{cmd.name}</strong>
                        <span className="text-sm text-gray-300 block">{cmd.hq}</span>
                        <span className="text-xs text-gray-400 font-mono mt-1 block">
                          Coords: {cmd.hqCoordinates[0].toFixed(4)}, {cmd.hqCoordinates[1].toFixed(4)}
                        </span>
                        <span className="text-xs font-bold mt-1 block uppercase tracking-wide" style={{ color: markerColor }}>{force.name}</span>
                      </div>
                      
                      {cmd.bases && cmd.bases.length > 0 && (
                        <div className="mt-2 max-h-32 overflow-y-auto pr-1">
                          <strong className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Major Bases ({cmd.bases.length})</strong>
                          <ul className="space-y-1">
                            {cmd.bases.map((base, idx) => (
                              <li key={idx} className="text-xs text-gray-200 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: markerColor }}></span>
                                {base.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
                
                {/* Only show bases if this HQ is selected */}
                {isSelected && cmd.bases?.map(base => (
                  <Marker key={base.name} position={base.coordinates} icon={baseIcon} zIndexOffset={90}>
                    <Popup className="hq-popup">
                      <div className="p-1">
                        <strong className="text-sm text-white block">{base.name}</strong>
                        <span className="text-xs text-gray-300">Strategic Base - {cmd.name}</span>
                        <span className="text-[10px] text-gray-400 font-mono mt-1 block">
                          {base.coordinates[0].toFixed(4)}, {base.coordinates[1].toFixed(4)}
                        </span>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </React.Fragment>
            );
          });
        })}
      </MapContainer>
    </div>
  );
}
