"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  RotateCw,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Shield,
  Compass,
  Award,
  Sun,
  Layers,
  Sparkles,
  Search,
} from "lucide-react";

export type ServiceBranch =
  | "INDIAN ARMY"
  | "INDIAN NAVY"
  | "INDIAN AIR FORCE"
  | "TRI-SERVICE COMMANDS";

interface EmblemHeraldryItem {
  element: string;
  significance: string;
}

interface EmblemMeta {
  name: string;
  hindi: string;
  motto: string;
  mottoEn: string;
  mottoSource: string;
  established: string;
  glb: string;
  masterImage: string;
  accent: string;
  accentBg: string;
  heraldrySummary: string;
  elements: EmblemHeraldryItem[];
  colorCodes: { name: string; hex: string }[];
  commandCount: number;
}

export const EMBLEM_DATA: Record<ServiceBranch, EmblemMeta> = {
  "INDIAN ARMY": {
    name: "Indian Army",
    hindi: "भारतीय थल सेना",
    motto: "सेवा अस्माकं धर्मः",
    mottoEn: "Service Before Self",
    mottoSource: "Ancient Indian martial tradition",
    established: "15 January 1949 (Field Marshal K. M. Cariappa assumed command as first Indian C-in-C)",
    glb: "/models/indian-army.glb",
    masterImage: "/images/emblems/army-master-hd.jpg",
    accent: "#83d65c",
    accentBg: "rgba(131, 214, 92, 0.15)",
    heraldrySummary:
      "The State Emblem of India (Ashoka Lion Capital with Satyameva Jayate) surmounting two crossed Indian Army military swords on martial scarlet backing.",
    elements: [
      {
        element: "Ashoka Lion Capital",
        significance:
          "Four Asiatic lions standing back-to-back atop an abacus with the Ashoka Dharma Chakra wheel, horse, bull, and lion, symbolizing supreme constitutional sovereignty, righteousness, and vigilance.",
      },
      {
        element: "Satyameva Jayate Inscription",
        significance:
          "Devanagari script beneath the abacus proclaiming 'Truth Alone Triumphs' (Mundaka Upanishad), the ethical foundation of the Republic of India.",
      },
      {
        element: "Crossed Military Swords",
        significance:
          "Two traditional straight pattern Indian military swords crossed at 45 degrees with circular pommels and guards, symbolizing offensive tactical readiness and resolute territorial defense.",
      },
      {
        element: "Gilded Gold & Martial Scarlet",
        significance:
          "Burnished gold relief on military scarlet backing, celebrating seven decades of sacrifice from the Siachen Glacier to the Thar Desert.",
      },
    ],
    colorCodes: [
      { name: "Gold / Brass", hex: "#e5a93c" },
      { name: "Martial Scarlet", hex: "#a81d24" },
      { name: "Army Olive", hex: "#4b5320" },
    ],
    commandCount: 7,
  },
  "INDIAN NAVY": {
    name: "Indian Navy",
    hindi: "भारतीय नौसेना",
    motto: "शं नो वरुणः",
    mottoEn: "May the Lord of the Oceans be Auspicious Unto Us",
    mottoSource: "Rigveda (Hymn 1.25.19 invoking Lord Varuna, deity of oceans)",
    established: "26 January 1950 (Navy Day observed on 4 December commemorating Operation Trident, 1971)",
    glb: "/models/indian-navy.glb",
    masterImage: "/images/emblems/navy-master-hd.jpg",
    accent: "#00e5ff",
    accentBg: "rgba(0, 229, 255, 0.15)",
    heraldrySummary:
      "Official 2022 Crest: The Ashoka Lion Capital atop a gilded fouled anchor inside an octagonal golden border inspired by the Rajmudra naval seal of Chhatrapati Shivaji Maharaj.",
    elements: [
      {
        element: "Chhatrapati Shivaji Octagonal Shield",
        significance:
          "Adopted in 2022 to honour the father of modern Indian naval warfare. The twin golden octagonal borders represent the eight cardinal directions (Ashta Dishas), signifying multidirectional blue-water reach.",
      },
      {
        element: "Gilded Fouled Anchor",
        significance:
          "Solid golden maritime anchor encircled by a nautical rope cable, symbolizing steadfast marine endurance, seamanship, and maritime command.",
      },
      {
        element: "Ashoka Lion Capital Crown",
        significance:
          "Surmounting the naval shield, representing the supreme authority under the President of India as Supreme Commander of the Armed Forces.",
      },
      {
        element: "Rigvedic Devanagari Motto",
        significance:
          "Golden Devanagari inscription 'शं नो वरुणः' (Shaṁ No Varuṇaḥ) invoking oceanic peace and divine victory.",
      },
    ],
    colorCodes: [
      { name: "Naval Gold", hex: "#f0b429" },
      { name: "Oceanic Navy Blue", hex: "#0c2340" },
      { name: "Electric Cyan", hex: "#00e5ff" },
    ],
    commandCount: 3,
  },
  "INDIAN AIR FORCE": {
    name: "Indian Air Force",
    hindi: "भारतीय वायु सेना",
    motto: "नभः स्पृशं दीप्तम्",
    mottoEn: "Touch the Sky with Glory",
    mottoSource: "Bhagavad Gita (Chapter 11, Verse 24 - Lord Krishna's Vishwaroopa)",
    established: "8 October 1932 (Celebrated annually as Air Force Day)",
    glb: "/models/indian-air-force.glb",
    masterImage: "/images/emblems/air-force-master-hd.jpg",
    accent: "#ffffff",
    accentBg: "rgba(255, 255, 255, 0.15)",
    heraldrySummary:
      "Official IAF Crest: Ashoka Lion Capital crest at apex, soaring golden Himalayan Eagle on an azure roundel with national tricolour cockade, surrounded by golden lotus wreath and Devanagari motto scroll.",
    elements: [
      {
        element: "Himalayan Eagle (हिमालयी चील)",
        significance:
          "Golden eagle with expansive outspread wings ascending vertically, symbolizing supreme aerial vigilance, supersonic strike capability, and fearless dominance of the skies.",
      },
      {
        element: "Ashoka Lion Capital Apex",
        significance:
          "Positioned directly at the top of the roundel with Satyameva Jayate, symbolizing total national devotion and constitutional loyalty.",
      },
      {
        element: "Azure Roundel & Golden Lotus Wreath",
        significance:
          "Sky-blue circular disk bordered by golden lotus petals, housing the national tricolour cockade (saffron, white, green) with Ashoka Chakra.",
      },
      {
        element: "Devanagari Motto Ribbon Scroll",
        significance:
          "Curving golden scroll inscribed 'भारतीय वायु सेना' and Gita motto 'नभः स्पृशं दीप्तम्' framing the base of the emblem.",
      },
    ],
    colorCodes: [
      { name: "Sky Azure", hex: "#5d9cec" },
      { name: "Imperial Gold", hex: "#d4af37" },
      { name: "Tricolour White", hex: "#ffffff" },
    ],
    commandCount: 7,
  },
  "TRI-SERVICE COMMANDS": {
    name: "Integrated Defence Staff & Tri-Service Commands",
    hindi: "एकीकृत रक्षा स्टाफ",
    motto: "Victory Through Jointness",
    mottoEn: "Victory Through Jointness · सदैव सजग",
    mottoSource: "Joint Doctrine of the Indian Armed Forces (HQ IDS)",
    established: "1 October 2001 (Post-Kargil Review Committee; unified under Chief of Defence Staff)",
    glb: "/models/integrated-defence-staff.glb",
    masterImage: "/images/emblems/tri-service-master-hd.jpg",
    accent: "#e5a93c",
    accentBg: "rgba(229, 169, 60, 0.15)",
    heraldrySummary:
      "Official IDS Crest: Tri-service joint heraldry unifying crossed Army swords, Naval fouled anchor, and Air Force eagle wings, crowned by the Ashoka Lion Capital and encircled by a golden laurel wreath.",
    elements: [
      {
        element: "Crossed Swords (Land Power)",
        significance:
          "Representing the Indian Army's boots on the ground, mountain warfare divisions, and armored combat power across all border theatres.",
      },
      {
        element: "Naval Anchor (Sea Power)",
        significance:
          "Representing the Indian Navy's aircraft carrier battle groups, guided-missile destroyers, and blue-water maritime deterrence.",
      },
      {
        element: "Eagle Wings (Air Power)",
        significance:
          "Flanking the anchor, representing the Indian Air Force's precision strikes, multi-role air superiority, and strategic airlift capabilities.",
      },
      {
        element: "Unified Ashoka Capital & Laurel",
        significance:
          "Unifies the tri-service commands (including Andaman & Nicobar Command and Strategic Forces Command) under unified joint theatre doctrine.",
      },
    ],
    colorCodes: [
      { name: "Tri-Service Maroon", hex: "#800020" },
      { name: "Joint Tri-Gold", hex: "#e5a93c" },
      { name: "Naval Navy Blue", hex: "#0b1c3d" },
      { name: "Air Force Blue", hex: "#4a90e2" },
    ],
    commandCount: 2,
  },
};

interface Emblem3DViewerProps {
  service: ServiceBranch;
  className?: string;
  showHeraldryDetails?: boolean;
}

export function Emblem3DViewer({
  service,
  className = "",
  showHeraldryDetails = true,
}: Emblem3DViewerProps) {
  const data = EMBLEM_DATA[service] || EMBLEM_DATA["INDIAN ARMY"];
  const [viewMode, setViewMode] = useState<"3d" | "macro">("3d");
  const [modelViewerLoaded, setModelViewerLoaded] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [exposure, setExposure] = useState<number>(1.35);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLElement | null>(null);

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
    document.head.appendChild(script);
  }, []);

  const handleResetCamera = () => {
    if (!viewerRef.current) return;
    const mv = viewerRef.current as unknown as {
      cameraOrbit?: string;
      resetTurntableRotation?: () => void;
      jumpCameraToGoal?: () => void;
    };
    mv.cameraOrbit = "0deg 75deg 105%";
    mv.resetTurntableRotation?.();
    mv.jumpCameraToGoal?.();
  };

  const handleZoom = (direction: "in" | "out") => {
    if (!viewerRef.current) return;
    const mv = viewerRef.current as unknown as {
      cameraOrbit?: string;
      getCameraOrbit?: () => { theta: number; phi: number; radius: number };
    };
    try {
      const current = mv.getCameraOrbit ? mv.getCameraOrbit() : { radius: 2.2 };
      const factor = direction === "in" ? 0.8 : 1.25;
      const newRadius = Math.max(0.9, Math.min(4.5, current.radius * factor));
      mv.cameraOrbit = `auto auto ${newRadius}m`;
    } catch {
      // Fallback
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative rounded-2xl border-2 border-primary/40 bg-[#040e08]/95 backdrop-blur-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] ${className}`}
    >
      {/* HUD Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 border-b border-primary/25 bg-[#06140b]/90 font-mono text-xs">
        <div className="flex items-center gap-2.5">
          <span
            className="w-2.5 h-2.5 rounded-full animate-ping"
            style={{ backgroundColor: data.accent }}
          />
          <span className="font-bold text-foreground tracking-wider uppercase">
            {data.name.toUpperCase()} · INSIGNIA ARTIFACT
          </span>
          <span className="text-muted-foreground hidden sm:inline">|</span>
          <span className="text-primary hidden sm:inline">VOLUMETRIC PBR RELIEF</span>
        </div>

        {/* View Mode & Tactical Controls */}
        <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-lg border border-primary/30">
          <button
            type="button"
            onClick={() => setViewMode("3d")}
            className={`px-2.5 py-1 rounded text-[10px] uppercase font-mono font-bold transition-all flex items-center gap-1.5 ${
              viewMode === "3d"
                ? "bg-primary text-black shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-white/10"
            }`}
          >
            <Compass className="w-3 h-3" />
            <span>3D MESH</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("macro")}
            className={`px-2.5 py-1 rounded text-[10px] uppercase font-mono font-bold transition-all flex items-center gap-1.5 ${
              viewMode === "macro"
                ? "bg-primary text-black shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-white/10"
            }`}
          >
            <Search className="w-3 h-3" />
            <span>MACRO DETAIL</span>
          </button>

          {viewMode === "3d" && (
            <>
              <button
                type="button"
                onClick={() => setAutoRotate(!autoRotate)}
                className={`p-1.5 rounded transition-all ${
                  autoRotate ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
                title="Toggle Turntable Auto-Rotate"
              >
                <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? "animate-spin" : ""}`} />
              </button>

              <button
                type="button"
                onClick={handleResetCamera}
                className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
                title="Reset Camera"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => handleZoom("in")}
                className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => handleZoom("out")}
                className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setExposure(exposure === 1.35 ? 1.65 : 1.35)}
                className={`p-1.5 rounded transition-colors ${
                  exposure > 1.4 ? "text-accent-gold" : "text-muted-foreground hover:text-foreground"
                }`}
                title="Toggle High-Dynamic Specular Lighting"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors hidden sm:inline-flex"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Visual Chamber */}
      <div className="relative h-[440px] sm:h-[520px] lg:h-[580px] w-full flex items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,_#0a2215_0%,_#030b06_70%,_#010503_100%)] select-none">
        {/* Subtle Background Polar Grid */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, ${data.accent} 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />

        {/* Ambient Branch Glow Pulse */}
        <div
          className="absolute inset-0 opacity-25 pointer-events-none transition-all duration-700"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${data.accent} 0%, transparent 65%)`,
          }}
        />

        {viewMode === "3d" ? (
          modelViewerLoaded ? (
            <model-viewer
              ref={viewerRef as React.RefObject<HTMLElement>}
              src={data.glb}
              alt={`${data.name} 3D Master Emblem`}
              camera-controls
              auto-rotate={autoRotate ? true : undefined}
              auto-rotate-delay={500}
              rotation-per-second="22deg"
              camera-orbit="0deg 75deg 105%"
              min-camera-orbit="auto auto 60%"
              max-camera-orbit="auto auto 180%"
              shadow-intensity="1.6"
              shadow-softness="0.4"
              exposure={String(exposure)}
              tone-mapping="aces"
              environment-image="neutral"
              interaction-prompt="none"
              style={{ width: "100%", height: "100%", outline: "none" }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 font-mono text-xs text-muted-foreground">
              <RotateCw className="w-8 h-8 animate-spin text-primary" />
              <span className="tracking-widest uppercase text-primary font-bold">
                INITIALIZING 3D VOLUMETRIC SCULPT...
              </span>
            </div>
          )
        ) : (
          <div className="relative w-full h-full flex items-center justify-center p-6">
            <div className="relative w-full max-w-[480px] aspect-square rounded-2xl overflow-hidden border-2 border-primary/40 shadow-[0_0_50px_rgba(0,0,0,0.9)] bg-black">
              <Image
                src={data.masterImage}
                alt={`${data.name} Master Insignia Detailing`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 480px"
                priority
              />
              <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded bg-black/80 border border-primary/40 text-[9px] font-mono text-primary font-bold">
                1024×1024 MASTER HERALDIC RELIEF
              </div>
            </div>
          </div>
        )}

        {/* Corner HUD Reticles */}
        <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-primary/70 pointer-events-none" />
        <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-primary/70 pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-primary/70 pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-primary/70 pointer-events-none" />

        {/* Interactive Instructions Overlay */}
        <div className="absolute bottom-3 left-4 pointer-events-none px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-primary/30 font-mono text-[10px] text-primary flex items-center gap-2">
          <Compass className="w-3.5 h-3.5 animate-spin" />
          <span>
            {viewMode === "3d"
              ? "DRAG 360° ORBIT · PINCH / SCROLL ZOOM · VOLUMETRIC 3D SCULPT"
              : "1024×1024 MACRO RELIEF · RAZOR-SHARP HERALDIC ENGRAVING"}
          </span>
        </div>
      </div>

      {/* Motto & Canonical Specification Banner */}
      <div className="px-5 py-4 border-t border-primary/30 bg-[#051109] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground uppercase tracking-wider">
              {data.name}
            </h2>
            <span className="text-sm font-hindi text-primary font-semibold">({data.hindi})</span>
          </div>
          <p className="mt-1 font-mono text-xs text-primary flex flex-wrap items-center gap-2">
            <span className="font-bold tracking-wide">&ldquo;{data.motto}&rdquo;</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-foreground italic font-sans">{data.mottoEn}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <div className="px-3 py-1.5 rounded border border-border/60 bg-black/50">
            <span className="text-muted-foreground block text-[9px] uppercase">CREED SOURCE</span>
            <span className="text-foreground text-[11px] font-semibold">{data.mottoSource}</span>
          </div>
          <div className="px-3 py-1.5 rounded border border-border/60 bg-black/50">
            <span className="text-muted-foreground block text-[9px] uppercase">OPERATIONAL COMMANDS</span>
            <span className="text-primary text-[11px] font-bold">{data.commandCount} THEATRES</span>
          </div>
        </div>
      </div>

      {/* Comprehensive Heraldic & Symbology Breakdown */}
      {showHeraldryDetails && (
        <div className="p-5 sm:p-6 border-t border-primary/20 bg-[#030c06]/90 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-accent-gold" />
              <h3 className="font-mono text-xs font-bold text-accent-gold uppercase tracking-widest">
                OFFICIAL HERALDIC SPECIFICATION & EMBLEM ANATOMY
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground font-sans">
              {data.heraldrySummary}
            </p>
          </div>

          {/* Detailed Symbological Element Breakdown */}
          <div className="grid gap-3 sm:grid-cols-2">
            {data.elements.map((item) => (
              <div
                key={item.element}
                className="rounded-lg border border-border/50 bg-[#06140b]/70 p-3.5 space-y-1"
              >
                <div className="flex items-center gap-1.5 text-primary font-mono text-xs font-bold">
                  <Shield className="w-3.5 h-3.5" />
                  <span>{item.element}</span>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground font-sans">
                  {item.significance}
                </p>
              </div>
            ))}
          </div>

          {/* Color Standards & Adoption Metadata */}
          <div className="pt-3 border-t border-border/30 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider">HERALDIC PALETTE:</span>
              <div className="flex items-center gap-2">
                {data.colorCodes.map((c) => (
                  <span key={c.name} className="inline-flex items-center gap-1.5 text-[11px] text-foreground">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/40"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </span>
                ))}
              </div>
            </div>

            <span className="text-primary text-[11px]">
              ESTABLISHED: {data.established}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
