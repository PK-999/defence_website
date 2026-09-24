"use client";

import React, { useState } from "react";
import Image from "next/image";
import { RotateCw, Shield, Sparkles, Award, Info } from "lucide-react";

export type GallantryAwardName =
  | "Param Vir Chakra"
  | "Maha Vir Chakra"
  | "Vir Chakra"
  | "Ashoka Chakra"
  | "Kirti Chakra"
  | "Shaurya Chakra";

interface MedalMeta {
  code: string;
  name: string;
  hindi: string;
  tier: string;
  category: "Wartime" | "Peacetime";
  metal: string;
  ribbon: string;
  obverseInsignia: string;
  reverseDetails: string;
  obverse: string;
  reverse: string;
  obverseDisc: string;
  reverseDisc: string;
  accent: string;
}

const MEDAL_DATA: Record<string, MedalMeta> = {
  "param vir chakra": {
    code: "pvc",
    name: "Param Vir Chakra",
    hindi: "परमवीर चक्र",
    tier: "India's Highest Wartime Gallantry Decoration",
    category: "Wartime",
    metal: "Circular Bronze · 1⅜ inch (34.9 mm) diameter",
    ribbon: "Plain purple ribbon · 32 mm width",
    obverseInsignia: "Four replicas of Indra's Vajra flanking the State Emblem of India in the center.",
    reverseDetails: "Embossed 'PARAM VIR CHAKRA' in Hindi and English separated by two sacred lotus flowers. Center plain.",
    obverse: "/images/medals/pvc-obverse.png",
    reverse: "/images/medals/pvc-reverse.png",
    obverseDisc: "/images/medals/pvc-obverse-disc.png",
    reverseDisc: "/images/medals/pvc-reverse-disc.png",
    accent: "#ff3344",
  },
  "maha vir chakra": {
    code: "mvc",
    name: "Maha Vir Chakra",
    hindi: "महावीर चक्र",
    tier: "Second Highest Wartime Gallantry Decoration",
    category: "Wartime",
    metal: "Standard Silver · 1⅜ inch (34.9 mm) diameter",
    ribbon: "Half white and half orange ribbon · 32 mm width",
    obverseInsignia: "Five-pointed heraldic star with circular center-piece bearing the gilded State Emblem.",
    reverseDetails: "Embossed 'MAHA VIR CHAKRA' in Hindi and English with two lotus flowers placed between inscriptions.",
    obverse: "/images/medals/mvc-obverse.png",
    reverse: "/images/medals/mvc-reverse.png",
    obverseDisc: "/images/medals/mvc-obverse-disc.png",
    reverseDisc: "/images/medals/mvc-reverse-disc.png",
    accent: "#e5a93c",
  },
  "vir chakra": {
    code: "vc",
    name: "Vir Chakra",
    hindi: "वीर चक्र",
    tier: "Third Highest Wartime Gallantry Decoration",
    category: "Wartime",
    metal: "Standard Silver · 1⅜ inch (34.9 mm) diameter",
    ribbon: "Half dark blue and half orange ribbon · 32 mm width",
    obverseInsignia: "Five-pointed star with Dharma Chakra in the center and a gilded State Emblem at the hub.",
    reverseDetails: "Embossed 'VIR CHAKRA' in Hindi and English with two sacred lotus flowers.",
    obverse: "/images/medals/vc-obverse.png",
    reverse: "/images/medals/vc-reverse.png",
    obverseDisc: "/images/medals/vc-obverse-disc.png",
    reverseDisc: "/images/medals/vc-reverse-disc.png",
    accent: "#00e5ff",
  },
  "ashoka chakra": {
    code: "ac",
    name: "Ashoka Chakra",
    hindi: "अशोक चक्र",
    tier: "India's Highest Peacetime Gallantry Decoration",
    category: "Peacetime",
    metal: "Gold Gilt with raised rims · 1⅜ inch (34.9 mm) diameter",
    ribbon: "Dark green ribbon divided into two equal parts by an orange vertical stripe (2 mm)",
    obverseInsignia: "Replica of the Ashoka Chakra surrounded by an imperial wreath of sacred lotus.",
    reverseDetails: "Embossed 'ASHOKA CHAKRA' in Hindi on the top arc and English on the bottom, with two lotus flowers on either side.",
    obverse: "/images/medals/ac-obverse.png",
    reverse: "/images/medals/ac-reverse.png",
    obverseDisc: "/images/medals/ac-obverse-disc.png",
    reverseDisc: "/images/medals/ac-reverse-disc.png",
    accent: "#e5a93c",
  },
  "kirti chakra": {
    code: "kc",
    name: "Kirti Chakra",
    hindi: "कीर्ति चक्र",
    tier: "Second Highest Peacetime Gallantry Decoration",
    category: "Peacetime",
    metal: "Standard Silver with raised rims · 1⅜ inch (34.9 mm) diameter",
    ribbon: "Dark green ribbon divided into three equal parts by two orange vertical stripes",
    obverseInsignia: "Ashoka Chakra encircled by sacred lotus wreath in standard silver relief.",
    reverseDetails: "Embossed 'KIRTI CHAKRA' in Hindi and English separated by two sacred lotus flowers.",
    obverse: "/images/medals/kc-obverse.png",
    reverse: "/images/medals/kc-reverse.png",
    obverseDisc: "/images/medals/kc-obverse-disc.png",
    reverseDisc: "/images/medals/kc-reverse-disc.png",
    accent: "#83d65c",
  },
  "shaurya chakra": {
    code: "sc",
    name: "Shaurya Chakra",
    hindi: "शौर्य चक्र",
    tier: "Third Highest Peacetime Gallantry Decoration",
    category: "Peacetime",
    metal: "Circular Bronze with raised rims · 1⅜ inch (34.9 mm) diameter",
    ribbon: "Dark green ribbon divided into four equal parts by three orange vertical stripes",
    obverseInsignia: "Ashoka Chakra encircled by lotus wreath in bronze relief.",
    reverseDetails: "Embossed 'SHAURYA CHAKRA' in Hindi and English separated by two sacred lotus flowers.",
    obverse: "/images/medals/sc-obverse.png",
    reverse: "/images/medals/sc-reverse.png",
    obverseDisc: "/images/medals/sc-obverse-disc.png",
    reverseDisc: "/images/medals/sc-reverse-disc.png",
    accent: "#b08d55",
  },
};

function normalizeKey(str: string): string {
  return str.toLowerCase().trim();
}

interface Medal3DViewerProps {
  awardName: string;
  variant?: "card" | "full" | "disc" | "compact";
  className?: string;
}

export function Medal3DViewer({
  awardName,
  variant = "card",
  className = "",
}: Medal3DViewerProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const key = normalizeKey(awardName);
  const data = MEDAL_DATA[key] || MEDAL_DATA["param vir chakra"];

  // 1. DISC ONLY COMPACT BADGE
  if (variant === "disc") {
    return (
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className={`group relative cursor-pointer select-none ${className}`}
        style={{ perspective: "600px" }}
        title={`${data.name} (Click to flip front/back)`}
      >
        <div
          className="relative transition-transform duration-500 ease-out"
          style={{
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Front (Obverse) */}
          <div
            className="w-12 h-12 relative rounded-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]"
            style={{ backfaceVisibility: "hidden" }}
          >
            <Image
              src={data.obverseDisc}
              alt={`${data.name} Obverse`}
              fill
              className="object-contain"
            />
          </div>

          {/* Back (Reverse) */}
          <div
            className="w-12 h-12 absolute inset-0 rounded-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]"
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
            }}
          >
            <Image
              src={data.reverseDisc}
              alt={`${data.name} Reverse`}
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    );
  }

  // 2. COMPACT TILE FOR CATEGORY / INDEX LISTS
  if (variant === "compact") {
    return (
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className={`group relative flex items-center gap-3 p-2 rounded-lg border border-primary/20 bg-[#06120b]/80 hover:border-primary/50 transition-all cursor-pointer select-none ${className}`}
        style={{ perspective: "800px" }}
      >
        <div
          className="relative w-12 h-24 shrink-0 transition-transform duration-500"
          style={{
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="absolute inset-0"
            style={{ backfaceVisibility: "hidden" }}
          >
            <Image
              src={data.obverse}
              alt={`${data.name} Obverse`}
              fill
              className="object-contain"
            />
          </div>
          <div
            className="absolute inset-0"
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
            }}
          >
            <Image
              src={data.reverse}
              alt={`${data.name} Reverse`}
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1 font-mono text-[10px]">
            <span
              className="font-bold uppercase tracking-wider"
              style={{ color: data.accent }}
            >
              {data.category} VALOUR
            </span>
            <span className="text-muted-foreground flex items-center gap-0.5 group-hover:text-primary">
              <RotateCw className="w-2.5 h-2.5" />
              <span>{isFlipped ? "REVERSE" : "OBVERSE"}</span>
            </span>
          </div>
          <h4 className="text-xs font-bold text-foreground truncate mt-0.5">
            {data.name}
          </h4>
          <p className="text-[10px] text-muted-foreground truncate">
            {data.hindi}
          </p>
        </div>
      </div>
    );
  }

  // 3. FULL DOSSIER CARD (Default)
  return (
    <div
      className={`relative rounded-xl border border-primary/30 bg-[#06120b]/90 backdrop-blur-md overflow-hidden shadow-2xl ${className}`}
    >
      {/* Top Telemetry Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-primary/20 bg-background/50 font-mono text-[11px]">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: data.accent,
              boxShadow: `0 0 8px ${data.accent}`,
            }}
          />
          <span className="font-bold text-foreground tracking-wider uppercase">
            {data.category.toUpperCase()} GALLANTRY MEDAL
          </span>
        </div>

        {/* 3D Flip Toggle Button */}
        <button
          type="button"
          onClick={() => setIsFlipped(!isFlipped)}
          className="px-2.5 py-1 rounded border border-primary/40 bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
        >
          <RotateCw className="w-3 h-3" />
          <span>FLIP TO {isFlipped ? "OBVERSE (FRONT)" : "REVERSE (BACK)"}</span>
        </button>
      </div>

      {/* Main 3D Stage */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="relative h-[280px] sm:h-[320px] flex items-center justify-center cursor-pointer select-none bg-gradient-to-b from-[#0a1811] via-[#050e09] to-[#020604] overflow-hidden"
        style={{ perspective: "1000px" }}
      >
        {/* Ambient Light Halo */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none transition-all duration-500"
          style={{
            background: `radial-gradient(circle at 50% 60%, ${data.accent} 0%, transparent 65%)`,
          }}
        />

        {/* 3D Flipping Medal Container */}
        <div
          className="relative w-44 h-64 sm:w-52 sm:h-72 transition-transform duration-700 ease-out"
          style={{
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* OBVERSE SIDE */}
          <div
            className="absolute inset-0 drop-shadow-[0_20px_30px_rgba(0,0,0,0.85)] filter contrast-110"
            style={{ backfaceVisibility: "hidden" }}
          >
            <Image
              src={data.obverse}
              alt={`${data.name} Obverse (Front)`}
              fill
              className="object-contain"
              priority
            />
            {/* Metallic Specular Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none rounded-2xl" />
          </div>

          {/* REVERSE SIDE */}
          <div
            className="absolute inset-0 drop-shadow-[0_20px_30px_rgba(0,0,0,0.85)] filter contrast-110"
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
            }}
          >
            <Image
              src={data.reverse}
              alt={`${data.name} Reverse (Back)`}
              fill
              className="object-contain"
            />
            {/* Metallic Specular Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none rounded-2xl" />
          </div>
        </div>

        {/* Status Badge Overlays */}
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 border border-primary/20 font-mono text-[9px] text-primary">
          <span>{isFlipped ? "REVERSE / BACK VIEW" : "OBVERSE / FRONT VIEW"}</span>
        </div>

        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 border border-primary/20 font-mono text-[9px] text-muted-foreground">
          <span>CLICK MEDAL TO FLIP 360°</span>
        </div>

        {/* Corner Brackets */}
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-primary/40 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-primary/40 pointer-events-none" />
      </div>

      {/* Official Heraldic Specifications Breakdown */}
      <div className="p-3.5 border-t border-primary/20 bg-[#040c07]/90 space-y-2 font-mono text-[11px]">
        <div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">
              {data.name}
            </h3>
            <span className="text-xs text-primary font-bold">{data.hindi}</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {data.tier}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-primary/10 text-[10px]">
          <div className="space-y-0.5">
            <span className="text-muted-foreground block font-semibold">METALLURGY:</span>
            <span className="text-foreground block">{data.metal}</span>
          </div>

          <div className="space-y-0.5">
            <span className="text-muted-foreground block font-semibold">RIBBON:</span>
            <span className="text-foreground block">{data.ribbon}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-primary/10 text-[10px]">
          <span className="text-primary block font-semibold mb-0.5">
            {isFlipped ? "REVERSE EMBOSSING:" : "OBVERSE EMBOSSING:"}
          </span>
          <p className="text-muted-foreground leading-relaxed">
            {isFlipped ? data.reverseDetails : data.obverseInsignia}
          </p>
        </div>
      </div>
    </div>
  );
}
