"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useSyncExternalStore } from "react";
import { isTacticalSoundMuted, setTacticalSoundMuted } from "@/lib/tactical-audio";

export function TacticalSoundToggle() {
  const muted = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("storage", onStoreChange);
      return () => window.removeEventListener("storage", onStoreChange);
    },
    isTacticalSoundMuted,
    () => false,
  );
  const toggle = () => {
    const next = !muted;
    setTacticalSoundMuted(next);
    window.dispatchEvent(new StorageEvent("storage", { key: "sentinel.tactical-click-muted", newValue: String(next) }));
  };
  return (
    <button type="button" onClick={toggle} aria-label={muted ? "Enable tactical click sound" : "Mute tactical click sound"} title={muted ? "Enable tactical click sound" : "Mute tactical click sound"} className="rounded border border-border/40 p-2 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary">
      {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
    </button>
  );
}
