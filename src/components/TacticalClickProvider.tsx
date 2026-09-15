"use client";

import { useEffect, type ReactNode } from "react";
import { playTacticalClick } from "@/lib/tactical-audio";

const INTERACTIVE_SELECTOR = "button, a, summary, [role='button'], input, select, textarea, [data-tactical-click]";

function interactiveTarget(target: EventTarget | null): Element | null {
  return target instanceof Element ? target.closest(INTERACTIVE_SELECTOR) : null;
}

export function TacticalClickProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (interactiveTarget(event.target)) playTacticalClick();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.key === "Enter" || event.key === " ") && !event.repeat && interactiveTarget(event.target)) playTacticalClick();
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, []);

  return children;
}
