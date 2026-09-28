"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { charToMorse } from "@/lib/morse";
import { playMorseBeep, playDecryptionComplete } from "@/lib/tactical-audio";

interface MorseTextProps {
  text: string;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3" | "p" | "div";
  triggerOnHover?: boolean;
  speed?: number;
  playAudio?: boolean;
  revealDelay?: number;
}

const MORSE_GLYPHS = [".", "-", "·", "—", "•", "−"];

export function MorseText({
  text,
  className = "",
  as: Component = "span",
  triggerOnHover = true,
  speed = 42,
  playAudio = true,
  revealDelay = 80,
}: MorseTextProps) {
  const [displayText, setDisplayText] = useState<string>(text);
  const [isDecoding, setIsDecoding] = useState<boolean>(false);
  const isDecodingRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  const startDecode = useCallback(() => {
    if (isDecodingRef.current) return;

    // Accessibility: respect reduced motion preference
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setDisplayText(text);
      return;
    }

    isDecodingRef.current = true;
    setIsDecoding(true);

    const chars = text.split("");
    const totalChars = chars.length;
    let step = 0;
    // Each character gets ~2-3 telegraph iterations before resolving
    const totalSteps = totalChars * 2 + 4;

    const tick = () => {
      step++;
      const resolvedCount = Math.floor(step / 2);

      // Play authentic Morse tone during active transmission
      if (playAudio && step % 2 === 0 && resolvedCount < totalChars) {
        const targetChar = chars[resolvedCount];
        const morse = charToMorse(targetChar);
        const toneType = morse.startsWith("-") ? "dah" : "dit";
        playMorseBeep(toneType);
      }

      const rendered = chars
        .map((char, idx) => {
          if (idx < resolvedCount) {
            return char;
          }
          if (char === " " || char === "\n" || char === "\t") {
            return char;
          }
          if (idx === resolvedCount) {
            // Active decipher slot: display character's Morse or active dot/dash
            const morse = charToMorse(char);
            if (morse) {
              const subIndex = step % morse.length;
              return morse[subIndex] === "-" ? "—" : "•";
            }
            return MORSE_GLYPHS[Math.floor(Math.random() * MORSE_GLYPHS.length)];
          }
          // Pending character in transmission
          return MORSE_GLYPHS[(idx + step) % MORSE_GLYPHS.length];
        })
        .join("");

      setDisplayText(rendered);

      if (step < totalSteps) {
        timerRef.current = window.setTimeout(tick, speed);
      } else {
        setDisplayText(text);
        isDecodingRef.current = false;
        setIsDecoding(false);
        if (playAudio) {
          playDecryptionComplete();
        }
      }
    };

    timerRef.current = window.setTimeout(tick, revealDelay);
  }, [text, speed, playAudio, revealDelay]);

  useEffect(() => {
    startDecode();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [startDecode]);

  return (
    <Component
      className={`inline-block select-none transition-colors duration-200 ${
        isDecoding ? "font-mono tracking-widest text-primary/95" : ""
      } ${className}`}
      aria-label={text}
      onMouseEnter={triggerOnHover ? startDecode : undefined}
      title={isDecoding ? "Decrypting Morse Transmission..." : undefined}
    >
      {displayText}
    </Component>
  );
}
