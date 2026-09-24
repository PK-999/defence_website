"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Box, Sparkles, Layers, RotateCw, Shield, Compass, Maximize2 } from "lucide-react";

export type ServiceBranch =
  | "INDIAN ARMY"
  | "INDIAN NAVY"
  | "INDIAN AIR FORCE"
  | "TRI-SERVICE COMMANDS";

interface EmblemMeta {
  name: string;
  hindi: string;
  motto: string;
  mottoEn: string;
  glb: string;
  preview: string;
  front: string;
  showcase: string;
  accent: string;
  accentBg: string;
  heraldry: string;
}

const EMBLEM_DATA: Record<ServiceBranch, EmblemMeta> = {
  "INDIAN ARMY": {
    name: "Indian Army",
    hindi: "भारतीय थल सेना",
    motto: "सेवा अस्माकं धर्मः",
    mottoEn: "Service Before Self",
    glb: "/models/indian-army.glb",
    preview: "/images/emblems/indian-army.png",
    front: "/images/emblems/army-emblem-front.png",
    showcase: "/images/emblems/army-showcase.png",
    accent: "#39ff14",
    accentBg: "rgba(57, 255, 20, 0.15)",
    heraldry: "Crossed scimitars surmounted by the Lion Capital of Ashoka with Satyameva Jayate pedestal.",
  },
  "INDIAN NAVY": {
    name: "Indian Navy",
    hindi: "भारतीय नौ सेना",
    motto: "शं नो वरुणः",
    mottoEn: "May the Lord of Oceans be Auspicious unto Us",
    glb: "/models/indian-navy.glb",
    preview: "/images/emblems/indian-navy.png",
    front: "/images/emblems/navy-emblem-front.png",
    showcase: "/images/emblems/navy-showcase.png",
    accent: "#00d4ff",
    accentBg: "rgba(0, 212, 255, 0.15)",
    heraldry: "Fouled Anchor enveloped by blue enamel shield and the Lion Capital of Ashoka.",
  },
  "INDIAN AIR FORCE": {
    name: "Indian Air Force",
    hindi: "भारतीय वायु सेना",
    motto: "नभः स्पृशं दीप्तम्",
    mottoEn: "Touch the Sky with Glory",
    glb: "/models/indian-air-force.glb",
    preview: "/images/emblems/indian-air-force.png",
    front: "/images/emblems/air-force-emblem-front.png",
    showcase: "/images/emblems/air-force-showcase.png",
    accent: "#ffffff",
    accentBg: "rgba(255, 255, 255, 0.12)",
    heraldry: "Himalayan Eagle ascending on azure roundel beneath the Lion Capital of Ashoka with banner.",
  },
  "TRI-SERVICE COMMANDS": {
    name: "Tri-Service Commands",
    hindi: "एकीकृत रक्षा स्टाफ",
    motto: "सदैव सजग",
    mottoEn: "Victory Through Jointness · Always Alert",
    glb: "/models/integrated-defence-staff.glb",
    preview: "/images/emblems/integrated-defence-staff.png",
    front: "/images/emblems/tri-service-emblem-front.png",
    showcase: "/images/emblems/tri-service-showcase.png",
    accent: "#e5a93c",
    accentBg: "rgba(229, 169, 60, 0.15)",
    heraldry: "Tri-service heraldry of crossed swords (Army), fouled anchor (Navy), and eagle wings (Air Force).",
  },
};

interface Emblem3DViewerProps {
  service: ServiceBranch;
  compact?: boolean;
}

export function Emblem3DViewer({ service, compact = false }: Emblem3DViewerProps) {
  const data = EMBLEM_DATA[service] || EMBLEM_DATA["INDIAN ARMY"];
  const [mode, setMode] = useState<"3d" | "holo" | "multi">("3d");
  const [modelViewerLoaded, setModelViewerLoaded] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // Load @google/model-viewer module on client
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (customElements.get("model-viewer")) {
      setModelViewerLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
    script.onload = () => setModelViewerLoaded(true);
    script.onerror = () => {
      // If CDN fails, fallback to holo mode
      setMode("holo");
    };
    document.head.appendChild(script);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mode !== "holo" || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -(y * 22), y: x * 22 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div className="relative rounded-xl border border-primary/30 bg-[#06120b]/90 backdrop-blur-md overflow-hidden shadow-2xl">
      {/* Top Telemetry Bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-primary/20 bg-background/50 font-mono text-[11px]">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: data.accent, boxShadow: `0 0 8px ${data.accent}` }}
          />
          <span className="font-bold text-foreground tracking-wider uppercase">
            3D INSIGNIA ARTIFACT
          </span>
          <span className="text-muted-foreground hidden sm:inline">· PBR GOLD RELIEF</span>
        </div>

        {/* View Mode Selector */}
        <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded border border-border/60">
          <button
            type="button"
            onClick={() => setMode("3d")}
            className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold transition-all flex items-center gap-1 ${
              mode === "3d"
                ? "bg-primary text-black shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Interactive 3D WebGL Model"
          >
            <Box className="w-3 h-3" />
            <span>3D Mesh</span>
          </button>

          <button
            type="button"
            onClick={() => setMode("holo")}
            className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold transition-all flex items-center gap-1 ${
              mode === "holo"
                ? "bg-primary text-black shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Shiny 3D Holographic Perspective"
          >
            <Sparkles className="w-3 h-3" />
            <span>Holo</span>
          </button>

          <button
            type="button"
            onClick={() => setMode("multi")}
            className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold transition-all flex items-center gap-1 ${
              mode === "multi"
                ? "bg-primary text-black shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Multi-Angle CAD Breakdown (Front, Top, Left, Right, Back)"
          >
            <Layers className="w-3 h-3" />
            <span>Angles</span>
          </button>
        </div>
      </div>

      {/* Main Display Canvas */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`relative ${
          compact ? "h-[240px]" : "h-[320px] sm:h-[360px]"
        } flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0a1811] via-[#050e09] to-[#020604] select-none`}
      >
        {/* Background Radial Glow */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none transition-all duration-500"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${data.accent} 0%, transparent 70%)`,
          }}
        />

        {/* MODE 1: Interactive Full 3D GLB Model */}
        {mode === "3d" && (
          <div className="w-full h-full relative">
            {modelViewerLoaded ? (
              <model-viewer
                src={data.glb}
                alt={`${data.name} 3D Emblem`}
                camera-controls
                auto-rotate
                auto-rotate-delay={1000}
                rotation-per-second="18deg"
                shadow-intensity="1.2"
                shadow-softness="0.8"
                exposure="1.15"
                style={{ width: "100%", height: "100%", outline: "none" }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 font-mono text-xs text-muted-foreground">
                <RotateCw className="w-6 h-6 animate-spin text-primary" />
                <span>INITIALIZING WEBGL 3D RUNTIME...</span>
              </div>
            )}

            {/* Instruction Overlay */}
            <div className="absolute bottom-2 right-2 pointer-events-none px-2 py-1 rounded bg-black/70 border border-primary/20 font-mono text-[9px] text-primary/80">
              <span>DRAG TO ROTATE · PINCH TO ZOOM</span>
            </div>
          </div>
        )}

        {/* MODE 2: Shiny 3D Holographic Perspective Tilt */}
        {mode === "holo" && (
          <div
            className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing p-6"
            style={{
              perspective: "1000px",
            }}
          >
            <div
              className="relative transition-transform duration-100 ease-out"
              style={{
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.05)`,
                transformStyle: "preserve-3d",
              }}
            >
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]">
                <Image
                  src={data.front}
                  alt={`${data.name} Shiny 3D Crest`}
                  fill
                  className="object-contain filter contrast-125"
                  priority
                />
                {/* Diagonal Specular Sheen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none rounded-full" />
              </div>
            </div>

            <div className="absolute bottom-2 right-2 pointer-events-none px-2 py-1 rounded bg-black/70 border border-primary/20 font-mono text-[9px] text-muted-foreground">
              <span>MOVE CURSOR TO TILT HOLOGRAPH</span>
            </div>
          </div>
        )}

        {/* MODE 3: Multi-Angle CAD Showcase */}
        {mode === "multi" && (
          <div className="w-full h-full relative p-2 flex items-center justify-center">
            <div className="relative w-full h-full">
              <Image
                src={data.showcase}
                alt={`${data.name} Multi-Angle CAD Views`}
                fill
                className="object-contain"
              />
            </div>
            <div className="absolute bottom-2 right-2 pointer-events-none px-2 py-1 rounded bg-black/70 border border-primary/20 font-mono text-[9px] text-muted-foreground">
              <span>FRONT · LEFT · RIGHT · BACK · TOP VIEWS</span>
            </div>
          </div>
        )}

        {/* Corner HUD Brackets */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-primary/60 pointer-events-none" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-primary/60 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-primary/60 pointer-events-none" />
      </div>

      {/* Emblem Motto & Heraldic Spec Footer */}
      <div className="p-3 border-t border-primary/20 bg-[#040c07]/90 space-y-1.5">
        <div className="flex items-baseline justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <span>{data.name}</span>
              <span className="text-xs text-muted-foreground font-normal">({data.hindi})</span>
            </h3>
            <p className="text-[11px] font-mono text-primary font-semibold mt-0.5">
              &ldquo;{data.motto}&rdquo; · <span className="text-muted-foreground italic font-sans">{data.mottoEn}</span>
            </p>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground leading-relaxed font-sans line-clamp-2">
          {data.heraldry}
        </p>
      </div>
    </div>
  );
}
