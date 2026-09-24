"use client";

import { useEffect, useState, useRef } from "react";

const GLYPHS = "0123456789ABCDEF$#%&*<>[]_/{}+=?~^!";

interface ScrambleTextProps {
  text: string;
  className?: string;
  triggerOnHover?: boolean;
  speed?: number;
  scrambleOnMount?: boolean;
}

export function ScrambleText({
  text,
  className = "",
  triggerOnHover = true,
  speed = 30,
  scrambleOnMount = true,
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(scrambleOnMount ? "" : text);
  const isScrambling = useRef(false);
  const frameRef = useRef<number | null>(null);

  const startScramble = () => {
    if (isScrambling.current) return;
    isScrambling.current = true;

    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayText(text);
      isScrambling.current = false;
      return;
    }

    const chars = text.split("");
    const length = chars.length;
    let iteration = 0;
    const maxIterations = length * 3;

    const step = () => {
      iteration++;
      const resolvedCount = Math.floor(iteration / 3);

      const current = chars.map((char, index) => {
        if (index < resolvedCount) {
          return char;
        }
        if (char === " " || char === "\n" || char === "\t") {
          return char;
        }
        return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }).join("");

      setDisplayText(current);

      if (iteration < maxIterations) {
        frameRef.current = window.setTimeout(step, speed);
      } else {
        setDisplayText(text);
        isScrambling.current = false;
      }
    };

    step();
  };

  useEffect(() => {
    if (scrambleOnMount) {
      startScramble();
    } else {
      setDisplayText(text);
    }
    return () => {
      if (frameRef.current) clearTimeout(frameRef.current);
    };
  }, [text, scrambleOnMount]);

  return (
    <span
      className={`font-mono tracking-wider inline-block cursor-default select-none ${className}`}
      onMouseEnter={triggerOnHover ? startScramble : undefined}
    >
      {displayText || text}
    </span>
  );
}
