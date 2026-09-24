"use client";

import { useState, useEffect } from "react";
import { Terminal, ShieldAlert, Check } from "lucide-react";

interface BootSequenceProps {
  onComplete: () => void;
}

const BOOT_LOGS = [
  "SENTINEL SYSTEM v5.1 // INITIATING DEFENCE ARCHIVE...",
  "ESTABLISHING SECURE PROTOCOL [TLS 1.3 · SHA-256]... READY",
  "VERIFYING INTEGRITY OF 6 DOMAIN REPOSITORIES... OK",
  "MOUNTING THEATRE ASSETS & ARMED FORCES REGISTRY... OK",
  "DECRYPTING 4,300+ HERO DOSSIERS & MINISTRY OF DEFENCE RECORDS... OK",
  "CLEARANCE LEVEL: UNCLASSIFIED / PUBLIC EDUCATIONAL ARCHIVE",
  "ACCESS GRANTED. INITIALIZING COMMAND CONSOLE...",
];

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const skip = () => {
    sessionStorage.setItem("sentinel_booted", "true");
    setIsCompleted(true);
    setTimeout(onComplete, 300);
  };

  useEffect(() => {
    if (sessionStorage.getItem("sentinel_booted")) {
      onComplete();
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sessionStorage.setItem("sentinel_booted", "true");
      onComplete();
      return;
    }

    let lineIndex = 0;
    const interval = setInterval(() => {
      if (lineIndex < BOOT_LOGS.length) {
        setLines((prev) => [...prev, BOOT_LOGS[lineIndex]]);
        lineIndex++;
      } else {
        clearInterval(interval);
        setTimeout(skip, 400);
      }
    }, 280);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        skip();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (isCompleted) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030805] text-foreground font-mono p-6 select-none animate-in fade-in duration-300">
      <div className="w-full max-w-2xl rounded-lg border border-primary/40 bg-card/80 p-6 backdrop-blur-xl shadow-[0_0_50px_rgba(131,214,92,0.15)] relative overflow-hidden">
        {/* Top Scanline */}
        <div className="animate-scanline" />

        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-primary/20 pb-4 mb-4 text-xs">
          <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase">
            <Terminal className="w-4 h-4 text-primary animate-pulse" />
            <span>SENTINEL COMMAND INTERFACE</span>
          </div>
          <button
            type="button"
            onClick={skip}
            className="text-[11px] uppercase tracking-wider text-muted-foreground hover:text-primary hover:underline"
          >
            [ESC to Skip]
          </button>
        </div>

        {/* Boot Lines */}
        <div className="space-y-2 text-xs sm:text-sm min-h-[180px] leading-relaxed">
          {lines.map((line, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-primary font-bold">{">"}</span>
              <span className={idx === lines.length - 1 ? "text-primary glow-text-primary" : "text-foreground/80"}>
                {line}
              </span>
              {idx < lines.length - 1 && (
                <Check className="w-3.5 h-3.5 text-primary ml-auto shrink-0" />
              )}
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-6 border-t border-primary/20 pt-4">
          <div className="flex justify-between text-[11px] text-muted-foreground mb-1.5 uppercase tracking-wider">
            <span>Authentication</span>
            <span>{Math.min(100, Math.floor((lines.length / BOOT_LOGS.length) * 100))}%</span>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 ease-out shadow-[0_0_10px_#83d65c]"
              style={{ width: `${Math.min(100, (lines.length / BOOT_LOGS.length) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
