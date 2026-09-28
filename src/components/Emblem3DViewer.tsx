"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  RotateCw,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Sparkles,
  Shield,
  Compass,
  Layers,
  Award,
  Sun,
  Eye,
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
    mottoSource: "Ancient Indian philosophical tradition",
    established: "15 January 1949 (Field Marshal Cariappa assumed command)",
    glb: "/models/indian-army.glb",
    accent: "#83d65c",
    accentBg: "rgba(131, 214, 92, 0.15)",
    heraldrySummary:
      "The State Emblem of India (Ashoka Lion Capital with Satyameva Jayate) resting upon two crossed traditional Indian curved scimitars (Talwars).",
    elements: [
      {
        element: "Ashoka Lion Capital",
        significance:
          "Four Asiatic lions standing back-to-back atop an abacus adorned with the Dharma Chakra wheel, elephant, horse, bull, and lion, symbolizing supreme national sovereignty, vigilance, and moral righteousness.",
      },
      {
        element: "Satyameva Jayate Inscription",
        significance:
          "Devanagari script beneath the abacus proclaiming 'Truth Alone Triumphs' (Mundaka Upanishad), the foundational bedrock of the Republic.",
      },
      {
        element: "Crossed Scimitars (Talwars)",
        significance:
          "Two traditional curved blades crossed at 45 degrees, signifying ancient Indian martial heritage, resolute territorial defence, and readiness for offensive battle.",
      },
      {
        element: "Burnished Gold & Olive Patina",
        significance:
          "High-relief gilded relief celebrating seven decades of sacrifice from the heights of the Himalayas to the Thar Desert.",
      },
    ],
    colorCodes: [
      { name: "Gold / Brass", hex: "#e5a93c" },
      { name: "Army Olive", hex: "#4b5320" },
      { name: "Martial Scarlet", hex: "#cc1122" },
    ],
    commandCount: 7,
  },
  "INDIAN NAVY": {
    name: "Indian Navy",
    hindi: "भारतीय नौसेना",
    motto: "शं नो वरुणः",
    mottoEn: "May the Lord of the Oceans be Auspicious Unto Us",
    mottoSource: "Rigveda, Hymn 1.25.19 invoking Lord Varuna",
    established: "4 December (Celebrated as Navy Day commemorating Operation Trident, 1971)",
    glb: "/models/indian-navy.glb",
    accent: "#00e5ff",
    accentBg: "rgba(0, 229, 255, 0.15)",
    heraldrySummary:
      "A gilded Fouled Naval Anchor encased by an azure shield crowned by the State Emblem of India, reflecting oceanic supremacy across the Indo-Pacific.",
    elements: [
      {
        element: "Fouled Anchor (नौसेना लंगर)",
        significance:
          "Solid brass maritime anchor encircled by a rope cable, traditional symbol of marine endurance, oceanic command, and safe harbour for the nation.",
      },
      {
        element: "Chhatrapati Shivaji Shield",
        significance:
          "The octagonal golden border and azure enamel field inspired by the Rajmudra naval seal of Chhatrapati Shivaji Maharaj, the father of modern Indian naval warfare.",
      },
      {
        element: "Ashoka Lion Capital Crown",
        significance:
          "Surmounting the naval shield, representing the supreme constitutional authority under the President of India as Supreme Commander of the Armed Forces.",
      },
      {
        element: "Deep Marine Azure Field",
        significance:
          "Reflects the vast expanse of the Indian Ocean, Arabian Sea, and Bay of Bengal protected by the blue-water fleet.",
      },
    ],
    colorCodes: [
      { name: "Naval Gold", hex: "#f0b429" },
      { name: "Oceanic Navy", hex: "#0c2340" },
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
    accent: "#ffffff",
    accentBg: "rgba(255, 255, 255, 0.15)",
    heraldrySummary:
      "A soaring golden Himalayan Eagle ascending on an azure roundel with national tricolour cockade, crowned by the Ashoka Lion Capital above a Devanagari motto scroll.",
    elements: [
      {
        element: "Himalayan Eagle (हिमालयी चील)",
        significance:
          "Golden eagle with outspread wings ascending vertically, symbolizing supreme aerial vigilance, supersonic strike capability, and fearless dominance of the skies.",
      },
      {
        element: "Azure Roundel & Golden Laurel",
        significance:
          "Sky-blue circular disk bordered by golden lotus petals, housing the sacred symbol of victory and eternal vigilance.",
      },
      {
        element: "Ashoka Lion Capital Crest",
        significance:
          "Positioned directly at the apex above the eagle, symbolizing national devotion and loyalty to the Republic.",
      },
      {
        element: "Devanagari Ribbon Scroll",
        significance:
          "Curving golden scroll inscribed 'भारतीय वायु सेना' framing the base of the emblem with national honour.",
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
    motto: "सदैव सजग",
    mottoEn: "Victory Through Jointness · Always Alert",
    mottoSource: "Joint Doctrine of the Indian Armed Forces",
    established: "1 October 2001 (Formed post-Kargil Review Committee recommendations)",
    glb: "/models/integrated-defence-staff.glb",
    accent: "#e5a93c",
    accentBg: "rgba(229, 169, 60, 0.15)",
    heraldrySummary:
      "Tri-service jointness heraldry uniting crossed Army swords, naval fouled anchor, and Air Force eagle wings surmounted by the Ashoka Lion Capital.",
    elements: [
      {
        element: "Crossed Swords (Land Force)",
        significance:
          "Represent the Indian Army's resolute boots on the ground and ground combat power across all border theatres.",
      },
      {
        element: "Naval Anchor (Sea Power)",
        significance:
          "Represents the Indian Navy's maritime strike carrier battle groups and submarine sea deterrence.",
      },
      {
        element: "Eagle Wings (Air Power)",
        significance:
          "Flanking the anchor, representing the Indian Air Force's precision strikes and strategic airlift capabilities.",
      },
      {
        element: "Unified Ashoka Capital",
        significance:
          "Unifies the tri-service commands (including Andaman & Nicobar Command and Strategic Forces Command) under unified theatre doctrine.",
      },
    ],
    colorCodes: [
      { name: "Joint Tri-Gold", hex: "#e5a93c" },
      { name: "Army Red", hex: "#a81d24" },
      { name: "Navy Dark Blue", hex: "#0b1c3d" },
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
  const [modelViewerLoaded, setModelViewerLoaded] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [exposure, setExposure] = useState<number>(1.25);
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
      const newRadius = Math.max(1.0, Math.min(4.5, current.radius * factor));
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
            3D MESH ARTIFACT · {data.name.toUpperCase()}
          </span>
          <span className="text-muted-foreground hidden sm:inline">|</span>
          <span className="text-primary hidden sm:inline">PBR GLB RELIEF</span>
        </div>

        {/* Tactical 3D HUD Canvas Controls */}
        <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-lg border border-primary/30">
          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-2.5 py-1 rounded text-[10px] uppercase font-mono font-bold transition-all flex items-center gap-1.5 ${
              autoRotate
                ? "bg-primary text-black shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-white/10"
            }`}
            title="Toggle 3D Turntable Auto-Rotation"
          >
            <RotateCw className={`w-3 h-3 ${autoRotate ? "animate-spin" : ""}`} />
            <span>{autoRotate ? "ROTATING" : "PAUSED"}</span>
          </button>

          <button
            type="button"
            onClick={handleResetCamera}
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
            title="Reset Camera Orientation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => handleZoom("in")}
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => handleZoom("out")}
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setExposure(exposure === 1.25 ? 1.55 : 1.25)}
            className={`p-1 rounded transition-colors ${
              exposure > 1.3 ? "text-accent-gold" : "text-muted-foreground hover:text-foreground"
            }`}
            title="Toggle High-Dynamic Specular Illumination"
          >
            <Sun className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors hidden sm:inline-flex"
            title="Toggle Fullscreen Inspection"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Chamber */}
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

        {/* Interactive 3D Model Viewer */}
        {modelViewerLoaded ? (
          <model-viewer
            ref={viewerRef as React.RefObject<HTMLElement>}
            src={data.glb}
            alt={`${data.name} 3D Master Emblem`}
            camera-controls
            auto-rotate={autoRotate ? true : undefined}
            auto-rotate-delay={600}
            rotation-per-second="20deg"
            camera-orbit="0deg 75deg 105%"
            min-camera-orbit="auto auto 65%"
            max-camera-orbit="auto auto 180%"
            shadow-intensity="1.8"
            shadow-softness="0.35"
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
              INITIALIZING WEBGL 3D RELIEF PIPELINE...
            </span>
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
          <span>DRAG 360° ORBIT · PINCH / SCROLL ZOOM · PBR LIGHTING ACTIVE</span>
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
                HERALDIC SPECIFICATION & CARVING ANATOMY
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
