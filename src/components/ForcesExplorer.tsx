"use client";

import React, { useState } from "react";
import Image from "next/image";
import ForcesMapWrapper from "./ForcesMapWrapper";
import { RenownedUnitCard } from "./RenownedUnitCard";
import { HUDFrame } from "./HUDFrame";
import {
  Shield,
  Building2,
  ChevronRight,
  Award,
  Compass,
  Box,
  Layers,
  MapPin,
  Map as MapIcon,
  Maximize2,
  Columns,
} from "lucide-react";
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

const SERVICE_EMBLEM_THUMBS: Record<Exclude<ServiceLevel, "All">, string> = {
  "INDIAN ARMY": "/images/emblems/army-master-hd.jpg",
  "INDIAN NAVY": "/images/emblems/navy-master-hd.jpg",
  "INDIAN AIR FORCE": "/images/emblems/air-force-master-hd.jpg",
  "TRI-SERVICE COMMANDS": "/images/emblems/tri-service-master-hd.jpg",
};

export function ForcesExplorer({
  forces,
  renownedUnits,
  publicHeroSlugs,
}: ForcesExplorerProps) {
  const [activeService, setActiveService] = useState<ServiceLevel>("INDIAN ARMY");
  const [selectedCommand, setSelectedCommand] = useState<Command | null>(null);
  const [displayMode, setDisplayMode] = useState<"dual" | "map" | "emblem">("dual");

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
      {/* 1. Branch Selector Buttons with Master HD Thumbnails */}
      <div className="rounded-xl border border-primary/30 bg-[#06120b]/90 backdrop-blur-md p-3 shadow-lg">
        <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest px-2 pb-2 font-bold flex items-center justify-between border-b border-primary/20 mb-3">
          <span className="flex items-center gap-2 text-primary">
            <Box className="w-3.5 h-3.5" />
            ARMED FORCES BRANCH DIRECTIVES
          </span>
          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <span className="text-muted-foreground hidden sm:inline">VIEWPORT:</span>
            <div className="flex items-center gap-1 bg-black/60 p-0.5 rounded border border-border/60">
              <button
                type="button"
                onClick={() => setDisplayMode("dual")}
                className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold transition-colors flex items-center gap-1 ${
                  displayMode === "dual"
                    ? "bg-primary text-black"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Side-by-side Map & 3D Insignia"
              >
                <Columns className="w-3 h-3" />
                <span className="hidden sm:inline">DUAL</span>
              </button>
              <button
                type="button"
                onClick={() => setDisplayMode("map")}
                className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold transition-colors flex items-center gap-1 ${
                  displayMode === "map"
                    ? "bg-primary text-black"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Expanded Tactical Theatre Map"
              >
                <MapIcon className="w-3 h-3" />
                <span>MAP</span>
              </button>
              <button
                type="button"
                onClick={() => setDisplayMode("emblem")}
                className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold transition-colors flex items-center gap-1 ${
                  displayMode === "emblem"
                    ? "bg-primary text-black"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Expanded 3D Insignia Sculpt"
              >
                <Compass className="w-3 h-3" />
                <span>3D MESH</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {services.map((service) => {
            const isSelected = activeService === service;
            const color = getServiceColor(service);
            const meta = EMBLEM_DATA[service as ServiceBranch];
            const thumb = SERVICE_EMBLEM_THUMBS[service];

            return (
              <button
                key={service}
                type="button"
                onClick={() => {
                  setActiveService(service);
                  setSelectedCommand(null);
                }}
                className={`flex items-center gap-3 text-left p-3 rounded-lg border transition-all duration-200 relative overflow-hidden ${
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

                {/* Master Thumbnail */}
                <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-primary/30 bg-black">
                  <Image
                    src={thumb}
                    alt={service}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>

                <div className="min-w-0">
                  <span className="font-bold text-xs tracking-wide text-foreground line-clamp-1 block">
                    {meta?.name ?? service}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground block font-hindi line-clamp-1">
                    {meta?.hindi}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Interactive Main Stage: Map and/or 3D Emblem Mesh */}
      {displayMode === "dual" && (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT: Tactical Theatre Map */}
          <div className="w-full lg:w-7/12 xl:w-3/5 rounded-2xl border border-primary/40 bg-[#040e08]/95 overflow-hidden shadow-2xl">
            <div className="px-4 py-2.5 bg-[#06140b] border-b border-primary/25 font-mono text-xs text-foreground flex items-center justify-between">
              <span className="flex items-center gap-2 text-primary font-bold">
                <MapPin className="w-3.5 h-3.5" />
                TACTICAL THEATRE MAP · {activeService}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase">
                {activeForce.commands.length} COMMANDS DEPLOYED
              </span>
            </div>
            <div className="w-full h-[520px]">
              <ForcesMapWrapper
                forcesData={forces}
                activeService={activeService}
                selectedCommandName={selectedCommand?.name}
                onSelectCommand={(cmd) => setSelectedCommand(cmd)}
              />
            </div>
          </div>

          {/* RIGHT: 3D Insignia Mesh Viewer */}
          <div className="w-full lg:w-5/12 xl:w-2/5">
            <Emblem3DViewer
              service={activeService as ServiceBranch}
              showHeraldryDetails={false}
              className="h-full"
            />
          </div>
        </div>
      )}

      {displayMode === "map" && (
        <div className="w-full rounded-2xl border border-primary/40 bg-[#040e08]/95 overflow-hidden shadow-2xl">
          <div className="px-4 py-2.5 bg-[#06140b] border-b border-primary/25 font-mono text-xs text-foreground flex items-center justify-between">
            <span className="flex items-center gap-2 text-primary font-bold">
              <MapPin className="w-3.5 h-3.5" />
              EXPANDED TACTICAL THEATRE MAP · {activeService}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase">
              RADAR SWEEP ACTIVE · {activeForce.commands.length} THEATRES
            </span>
          </div>
          <div className="w-full h-[620px]">
            <ForcesMapWrapper
              forcesData={forces}
              activeService={activeService}
              selectedCommandName={selectedCommand?.name}
              onSelectCommand={(cmd) => setSelectedCommand(cmd)}
            />
          </div>
        </div>
      )}

      {displayMode === "emblem" && (
        <div className="w-full">
          <Emblem3DViewer
            service={activeService as ServiceBranch}
            showHeraldryDetails={true}
          />
        </div>
      )}

      {/* If dual mode or map mode, show full heraldic breakdown underneath */}
      {displayMode !== "emblem" && (
        <div className="rounded-xl border border-primary/30 bg-[#040f09]/90 p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-border/40 pb-2.5">
            <Award className="w-4 h-4 text-accent-gold" />
            <h3 className="font-mono text-xs font-bold text-accent-gold uppercase tracking-widest">
              OFFICIAL HERALDIC SPECIFICATION · {activeService}
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground font-sans">
            {EMBLEM_DATA[activeService as ServiceBranch]?.heraldrySummary}
          </p>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {EMBLEM_DATA[activeService as ServiceBranch]?.elements.map((item) => (
              <div
                key={item.element}
                className="rounded-lg border border-border/40 bg-black/40 p-3 space-y-1"
              >
                <div className="flex items-center gap-1.5 text-primary font-mono text-xs font-bold">
                  <Shield className="w-3 h-3" />
                  <span>{item.element}</span>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground font-sans">
                  {item.significance}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

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
