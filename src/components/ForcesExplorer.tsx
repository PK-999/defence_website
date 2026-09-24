"use client";

import React, { useState } from "react";
import Image from "next/image";
import ForcesMapWrapper from "./ForcesMapWrapper";
import { RenownedUnitCard } from "./RenownedUnitCard";
import { HUDFrame } from "./HUDFrame";
import { Shield, MapPin, Building2, ChevronRight, Award, Compass, Box } from "lucide-react";
import { Force, ServiceLevel, Command, PublishedUnitDetail } from "@/app/forces/forcesData";
import { Emblem3DViewer, ServiceBranch } from "./Emblem3DViewer";

interface ForcesExplorerProps {
  forces: Force[];
  renownedUnits: PublishedUnitDetail[];
  publicHeroSlugs: string[];
}

const services: Exclude<ServiceLevel, "All">[] = [
  "INDIAN ARMY",
  "INDIAN NAVY",
  "INDIAN AIR FORCE",
  "TRI-SERVICE COMMANDS",
];

const SERVICE_EMBLEM_THUMBS: Record<Exclude<ServiceLevel, "All">, string> = {
  "INDIAN ARMY": "/images/emblems/indian-army.png",
  "INDIAN NAVY": "/images/emblems/indian-navy.png",
  "INDIAN AIR FORCE": "/images/emblems/indian-air-force.png",
  "TRI-SERVICE COMMANDS": "/images/emblems/integrated-defence-staff.png",
};

export function ForcesExplorer({
  forces,
  renownedUnits,
  publicHeroSlugs,
}: ForcesExplorerProps) {
  const [activeService, setActiveService] = useState<ServiceLevel>("INDIAN ARMY");
  const [selectedCommand, setSelectedCommand] = useState<Command | null>(null);

  const activeForce = forces.find((f) => f.name === activeService) || forces[0];
  const serviceRenownedUnits = renownedUnits.filter(
    (u) => u.service === activeService
  );

  const getServiceColor = (serviceName: string) => {
    switch (serviceName) {
      case "INDIAN ARMY":
        return "#39ff14";
      case "INDIAN NAVY":
        return "#00d4ff";
      case "INDIAN AIR FORCE":
        return "#ffffff";
      case "TRI-SERVICE COMMANDS":
        return "#ff9900";
      default:
        return "#39ff14";
    }
  };

  const handleCommandClick = (command: Command) => {
    setSelectedCommand(command);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 xl:gap-8 items-start relative mt-4">
      
      {/* LEFT COLUMN: Map Fixed on the Left */}
      <div className="w-full lg:w-7/12 xl:w-3/5 h-[600px] lg:h-[calc(100vh-140px)] lg:sticky lg:top-24 rounded-xl overflow-hidden shrink-0 shadow-2xl border border-primary/30">
        <ForcesMapWrapper
          forcesData={forces}
          activeService={activeService}
          selectedCommandName={selectedCommand?.name}
          onSelectCommand={(cmd) => setSelectedCommand(cmd)}
        />
      </div>

      {/* RIGHT COLUMN: 4 Service Tabs + 3D Emblem + Commands Directory */}
      <div className="w-full lg:w-5/12 xl:w-2/5 space-y-5">
        
        {/* 4 Service Tabs with 3D Shiny Emblem Thumbnails */}
        <div className="rounded-xl border border-primary/30 bg-[#06120b]/90 backdrop-blur-md p-2 shadow-lg">
          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest px-2 pb-1.5 font-bold flex items-center justify-between">
            <span>BRANCH DIRECTIVES</span>
            <span className="text-primary">{services.length} SERVICES ACTIVE</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {services.map((service) => {
              const isSelected = activeService === service;
              const color = getServiceColor(service);
              const thumb = SERVICE_EMBLEM_THUMBS[service];

              return (
                <button
                  key={service}
                  type="button"
                  onClick={() => {
                    setActiveService(service);
                    setSelectedCommand(null);
                  }}
                  className={`flex items-center gap-2.5 p-2 rounded-lg border text-left font-mono transition-all duration-200 ${
                    isSelected
                      ? "border-primary bg-primary/20 text-white shadow-[0_0_12px_rgba(131,214,92,0.3)] ring-1 ring-primary/50"
                      : "border-border/60 bg-card/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  <div className="relative w-6 h-6 shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    <Image
                      src={thumb}
                      alt={service}
                      fill
                      className={`object-contain transition-transform ${isSelected ? "scale-110" : "opacity-80"}`}
                    />
                  </div>
                  <span className="text-xs font-bold truncate tracking-wider">
                    {service}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive 3D Emblem Artifact Viewer */}
        <Emblem3DViewer service={activeService as ServiceBranch} compact={true} />

        {/* Selected Service Telemetry & Commands List */}
        <div className="space-y-4">
          
          {/* Header of Active Service */}
          <div className="flex items-center justify-between border-b border-primary/20 pb-2">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">
                COMMAND THEATRE DIRECTORY
              </p>
              <h2 className="text-xl font-bold uppercase tracking-tight text-foreground">
                {activeForce.name}
              </h2>
            </div>
            <span className="px-2.5 py-1 rounded bg-primary/10 border border-primary/30 font-mono text-xs text-primary font-bold">
              {activeForce.commands.length} COMMANDS
            </span>
          </div>

          {/* Commands List (Clicking focuses map and highlights bases) */}
          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {activeForce.commands.map((command) => {
              const isSelected = selectedCommand?.name === command.name;
              const baseCount = command.bases?.length ?? 0;

              return (
                <div
                  key={command.name}
                  onClick={() => handleCommandClick(command)}
                  className={`group cursor-pointer rounded-lg border p-4 transition-all duration-200 relative ${
                    isSelected
                      ? "border-primary bg-primary/15 shadow-[0_0_15px_rgba(131,214,92,0.25)] ring-1 ring-primary/40"
                      : "border-border/60 bg-[#07160e]/80 hover:border-primary/50 hover:bg-[#0a2014]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="block font-mono text-[10px] text-primary uppercase tracking-widest font-semibold">
                        HQ: {command.hq}
                      </span>
                      <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-tight mt-0.5">
                        {command.name}
                      </h3>
                    </div>

                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-muted/60 border border-border/80 font-mono text-[10px] text-muted-foreground group-hover:text-primary group-hover:border-primary/40 shrink-0">
                      <span>MAP FOCUS</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>

                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                    AOR: {command.coverage}
                  </p>

                  {/* Bases Highlight Indicator */}
                  <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Compass className="w-3 h-3 text-primary" />
                      {baseCount > 0 ? `${baseCount} Operational Bases` : "Headquarters Station"}
                    </span>
                    <span className="text-[10px] text-primary uppercase">
                      {isSelected ? "ACTIVE ON MAP" : "CLICK TO ZOOM"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Renowned Units & Regimental Traditions for this Service */}
          {serviceRenownedUnits.length > 0 && (
            <div className="pt-6 border-t border-border/60 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">
                    VALOUR TRADITIONS
                  </p>
                  <h3 className="text-lg font-bold uppercase tracking-tight text-foreground">
                    Renowned Formations ({serviceRenownedUnits.length})
                  </h3>
                </div>
              </div>

              <div className="space-y-3">
                {serviceRenownedUnits.slice(0, 6).map((unit) => (
                  <RenownedUnitCard
                    key={unit.name}
                    unit={unit}
                    publicHeroSlugs={publicHeroSlugs}
                  />
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
