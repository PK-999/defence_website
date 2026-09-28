"use client";

import React, { useState } from "react";
import Image from "next/image";
import ForcesMapWrapper from "./ForcesMapWrapper";
import { RenownedUnitCard } from "./RenownedUnitCard";
import { Shield, Building2, ChevronRight, Award, Compass, Box, MapPin } from "lucide-react";
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
        return "#83d65c";
      case "INDIAN NAVY":
        return "#00e5ff";
      case "INDIAN AIR FORCE":
        return "#ffffff";
      case "TRI-SERVICE COMMANDS":
        return "#e5a93c";
      default:
        return "#83d65c";
    }
  };

  return (
    <div className="space-y-8 mt-4">
      {/* 2-COLUMN DESKTOP LAYOUT */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT COLUMN: Interactive Tactical Theatre Map */}
        <div className="w-full lg:w-7/12 xl:w-3/5">
          <div className="rounded-xl border border-primary/30 bg-[#040e08]/95 overflow-hidden shadow-2xl h-full flex flex-col">
            <div className="px-4 py-2.5 bg-[#06140b] border-b border-primary/25 font-mono text-xs text-foreground flex items-center justify-between">
              <span className="flex items-center gap-2 text-primary font-bold">
                <MapPin className="w-3.5 h-3.5" />
                THEATRE MAP · {activeService}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase">
                {activeForce.commands.length} COMMANDS DEPLOYED
              </span>
            </div>
            <div className="w-full flex-1 min-h-[550px] lg:min-h-[640px]">
              <ForcesMapWrapper
                forcesData={forces}
                activeService={activeService}
                selectedCommandName={selectedCommand?.name}
                onSelectCommand={(cmd) => setSelectedCommand(cmd)}
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 4 Service Tabs + 3D Emblem Mesh + Commands Directory */}
        <div className="w-full lg:w-5/12 xl:w-2/5 space-y-5">
          {/* 4 Service Tabs with Official Emblem Thumbnails */}
          <div className="rounded-xl border border-primary/30 bg-[#06120b]/90 backdrop-blur-md p-2 shadow-lg">
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest px-2 pb-1.5 font-bold flex items-center justify-between">
              <span>BRANCH DIRECTIVES</span>
              <span className="text-primary">{services.length} SERVICES ACTIVE</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {services.map((service) => {
                const isSelected = activeService === service;
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
                    <div className="relative w-8 h-8 rounded-md overflow-hidden shrink-0 border border-primary/30 bg-black/40">
                      <Image
                        src={thumb}
                        alt={service}
                        fill
                        className="object-contain p-0.5"
                        sizes="32px"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold tracking-tight truncate">
                        {service}
                      </div>
                      <div className="text-[9px] text-muted-foreground">
                        {service === "INDIAN ARMY" ? "7 COMMANDS" :
                         service === "INDIAN NAVY" ? "3 COMMANDS" :
                         service === "INDIAN AIR FORCE" ? "7 COMMANDS" : "2 COMMANDS"}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3D Emblem Mesh Viewer */}
          <Emblem3DViewer
            service={activeService as ServiceBranch}
            compact={true}
          />

          {/* Commands Directory for Active Force */}
          <div className="rounded-xl border border-primary/25 bg-[#06120b]/80 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <span className="font-mono text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                {activeForce.name} THEATRES ({activeForce.commands.length})
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">
                SELECT TO HIGHLIGHT ON MAP
              </span>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {activeForce.commands.map((cmd) => {
                const isSelected = selectedCommand?.name === cmd.name;
                const baseCount = cmd.bases?.length ?? 0;

                return (
                  <button
                    key={cmd.name}
                    type="button"
                    onClick={() => setSelectedCommand(isSelected ? null : cmd)}
                    className={`w-full p-2.5 rounded-lg border text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary/20 text-foreground ring-1 ring-primary/40 shadow-sm"
                        : "border-border/50 bg-black/30 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-foreground line-clamp-1">
                        {cmd.name}
                      </span>
                      <span className="text-[10px] font-mono text-primary font-bold">
                        HQ: {cmd.hq}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono mt-1 text-muted-foreground">
                      <span className="truncate max-w-[200px]">AOR: {cmd.coverage}</span>
                      <span>{baseCount} {baseCount === 1 ? "Station" : "Stations"}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Regimental Formations & Valour Traditions */}
      {serviceRenownedUnits.length > 0 && (
        <section className="space-y-6 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
                VALOUR TRADITIONS
              </p>
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-foreground mt-0.5">
                Renowned Formations ({serviceRenownedUnits.length})
              </h2>
            </div>
            <span className="text-xs font-mono text-muted-foreground">
              HISTORIC REGIMENTS & BATTLE HONOURS
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {serviceRenownedUnits.map((unit) => (
              <RenownedUnitCard
                key={unit.name}
                unit={unit}
                publicHeroSlugs={publicHeroSlugs}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
