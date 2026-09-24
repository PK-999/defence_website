"use client";

import type { ReactNode } from "react";

interface HUDFrameProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "gold" | "danger" | "cyan";
  label?: string;
  classification?: string;
  scanline?: boolean;
}

export function HUDFrame({
  children,
  className = "",
  variant = "default",
  label,
  classification,
  scanline = false,
}: HUDFrameProps) {
  const variantStyles = {
    default: {
      border: "border-primary/25 hover:border-primary/60",
      corner: "border-primary",
      glow: "hover:shadow-[0_0_20px_rgba(131,214,92,0.15)]",
      badge: "text-primary bg-primary/10 border-primary/30",
    },
    gold: {
      border: "border-accent-gold/25 hover:border-accent-gold/60",
      corner: "border-accent-gold",
      glow: "hover:shadow-[0_0_20px_rgba(229,169,60,0.15)]",
      badge: "text-accent-gold bg-accent-gold/10 border-accent-gold/30",
    },
    danger: {
      border: "border-accent-danger/25 hover:border-accent-danger/60",
      corner: "border-accent-danger",
      glow: "hover:shadow-[0_0_20px_rgba(255,51,68,0.15)]",
      badge: "text-accent-danger bg-accent-danger/10 border-accent-danger/30",
    },
    cyan: {
      border: "border-accent-cyan/25 hover:border-accent-cyan/60",
      corner: "border-accent-cyan",
      glow: "hover:shadow-[0_0_20px_rgba(0,229,255,0.15)]",
      badge: "text-accent-cyan bg-accent-cyan/10 border-accent-cyan/30",
    },
  }[variant];

  return (
    <div
      className={`group/card relative rounded-lg border bg-card/60 backdrop-blur-md transition-all duration-300 ${variantStyles.border} ${variantStyles.glow} ${className}`}
    >
      {/* Corner Brackets */}
      <span
        className={`absolute -top-px -left-px h-2.5 w-2.5 border-t-2 border-l-2 ${variantStyles.corner} pointer-events-none transition-transform group-hover/card:scale-110`}
        aria-hidden="true"
      />
      <span
        className={`absolute -top-px -right-px h-2.5 w-2.5 border-t-2 border-r-2 ${variantStyles.corner} pointer-events-none transition-transform group-hover/card:scale-110`}
        aria-hidden="true"
      />
      <span
        className={`absolute -bottom-px -left-px h-2.5 w-2.5 border-b-2 border-l-2 ${variantStyles.corner} pointer-events-none transition-transform group-hover/card:scale-110`}
        aria-hidden="true"
      />
      <span
        className={`absolute -bottom-px -right-px h-2.5 w-2.5 border-b-2 border-r-2 ${variantStyles.corner} pointer-events-none transition-transform group-hover/card:scale-110`}
        aria-hidden="true"
      />

      {/* Optional Top Telemetry / Header Line */}
      {(label || classification) && (
        <div className="flex items-center justify-between border-b border-border/40 px-4 py-2 text-[10px] font-mono tracking-widest uppercase">
          {label && <span className="text-muted-foreground flex items-center gap-1.5"><span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />{label}</span>}
          {classification && (
            <span className={`px-2 py-0.5 rounded border ${variantStyles.badge} font-bold`}>
              {classification}
            </span>
          )}
        </div>
      )}

      {/* Optional Scanline sweep on hover: restarts on each tile hover */}
      {scanline && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-lg z-20">
          <div className="hud-scanner" />
        </div>
      )}

      {/* Card Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
