"use client";

import React, { useState } from "react";
import { RenownedUnitCard } from "./RenownedUnitCard";
import { HUDFrame } from "./HUDFrame";
import { Shield, Building2, ChevronRight, Award, Compass, Box, Layers, MapPin } from "lucide-react";
import { Force, ServiceLevel, Command, PublishedUnitDetail } from "@/app/forces/forcesData";
import { Emblem3DViewer, ServiceBranch, EMBLEM_DATA } from "./Emblem3DViewer";

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

  const currentServiceColor = getServiceColor(activeService);

  return (
    <div className="space-y-10 mt-4">
      {/* 1. Branch Selector Buttons with Active State Indicators */}
      <div className="rounded-xl border border-primary/30 bg-[#06120b]/90 backdrop-blur-md p-3 shadow-lg">
        <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest px-2 pb-2 font-bold flex items-center justify-between border-b border-primary/20 mb-3">
          <span className="flex items-center gap-2 text-primary">
            <Box className="w-3.5 h-3.5" />
            SELECT ARMED FORCES BRANCH · 3D INSIGNIA MESH
          </span>
          <span className="text-muted-foreground">{services.length} SERVICES AVAILABLE</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {services.map((service) => {
            const isSelected = activeService === service;
            const color = getServiceColor(service);
            const meta = EMBLEM_DATA[service as ServiceBranch];

            return (
              <button
                key={service}
                type="button"
                onClick={() => {
                  setActiveService(service);
                  setSelectedCommand(null);
                }}
                className={`flex flex-col text-left p-3.5 rounded-lg border transition-all duration-200 relative overflow-hidden ${
                  isSelected
                    ? "border-primary bg-primary/15 shadow-[0_0_20px_rgba(131,214,92,0.25)] ring-1 ring-primary/40"
                    : "border-border/60 bg-[#050e09]/80 hover:border-primary/50 hover:bg-[#081a10]"
                }`}
              >
                {/* Active Indicator Top Stripe */}
                {isSelected && (
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: color }}
                  />
                )}

                <div className="flex items-center justify-between w-full mb-1">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: color,
                      boxShadow: isSelected ? `0 0 8px ${color}` : "none",
                    }}
                  />
                  <span className="font-mono text-[9px] text-muted-foreground uppercase">
                    3D MESH
                  </span>
                </div>

                <span className="font-bold text-xs sm:text-sm tracking-wide text-foreground line-clamp-1">
                  {meta?.name ?? service}
                </span>

                <span className="text-[10px] font-mono text-muted-foreground mt-0.5 font-hindi line-clamp-1">
                  {meta?.hindi}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Flagship Centerpiece: The 3D Emblem Mesh Viewer */}
      <section aria-label="3D Armed Forces Emblem">
        <Emblem3DViewer
          service={activeService as ServiceBranch}
          showHeraldryDetails={true}
        />
      </section>

      {/* 3. Operational Command Structure & Headquarters Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
              THEATRE DIRECTORY
            </p>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-foreground mt-0.5">
              {activeForce.name} Commands & Formations
            </h2>
          </div>
          <span className="px-3 py-1 rounded bg-primary/10 border border-primary/30 font-mono text-xs text-primary font-bold">
            {activeForce.commands.length} THEATRES RECORDED
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeForce.commands.map((command) => {
            const isSelected = selectedCommand?.name === command.name;
            const baseCount = command.bases?.length ?? 0;

            return (
              <div
                key={command.name}
                onClick={() => setSelectedCommand(isSelected ? null : command)}
                className={`group cursor-pointer rounded-xl border p-5 transition-all duration-200 relative ${
                  isSelected
                    ? "border-primary bg-primary/15 shadow-[0_0_20px_rgba(131,214,92,0.25)] ring-1 ring-primary/40"
                    : "border-border/60 bg-[#07160e]/80 hover:border-primary/50 hover:bg-[#0a2014]"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] text-primary uppercase tracking-widest font-bold">
                    <Building2 className="w-3 h-3" />
                    HQ: {command.hq}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {baseCount} {baseCount === 1 ? "BASE" : "BASES"}
                  </span>
                </div>

                <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                  {command.name}
                </h3>

                <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                  <span className="text-foreground/80 font-medium">AOR:</span> {command.coverage}
                </p>

                {command.bases && command.bases.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-border/40 space-y-1.5">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block">
                      KEY OPERATIONAL STATIONS:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {command.bases.slice(0, 4).map((base) => (
                        <span
                          key={base.name}
                          className="px-2 py-0.5 rounded bg-black/40 border border-border/50 text-[10px] font-mono text-foreground/90"
                        >
                          {base.name}
                        </span>
                      ))}
                      {command.bases.length > 4 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-mono text-primary font-bold">
                          +{command.bases.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Renowned Regimental Units & Valour Traditions */}
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
