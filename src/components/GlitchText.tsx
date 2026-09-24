"use client";

import { useState, useEffect } from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
  interval?: number;
}

export function GlitchText({ text, className = "", interval = 8000 }: GlitchTextProps) {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const timer = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 400);
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);

  return (
    <span
      className={`relative inline-block cursor-default ${className}`}
      onMouseEnter={() => {
        setGlitching(true);
        setTimeout(() => setGlitching(false), 500);
      }}
    >
      <span className="relative z-10">{text}</span>
      {glitching && (
        <>
          <span
            aria-hidden="true"
            className="absolute top-0 left-0 -translate-x-[2px] text-accent-cyan opacity-80 select-none pointer-events-none z-0 mix-blend-screen"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)" }}
          >
            {text}
          </span>
          <span
            aria-hidden="true"
            className="absolute top-0 left-0 translate-x-[2px] text-accent-danger opacity-80 select-none pointer-events-none z-0 mix-blend-screen"
            style={{ clipPath: "polygon(0 55%, 100% 55%, 100% 100%, 0 100%)" }}
          >
            {text}
          </span>
        </>
      )}
    </span>
  );
}
