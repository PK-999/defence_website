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

export function MorseText({
  text,
  className = "",
  as: Component = "span",
  triggerOnHover = true,
  speed = 55,
  playAudio = true,
  revealDelay = 60,
}: MorseTextProps) {
  const [displayText, setDisplayText] = useState<string>(text);
  const [isDecoding, setIsDecoding] = useState<boolean>(false);
  const [activeMorseStream, setActiveMorseStream] = useState<string>("");
  const isDecodingRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  const startDecode = useCallback(() => {
    if (isDecodingRef.current) return;

    // Respect reduced motion preference
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
    let charIdx = 0;
    let morseSubIdx = 0;

    const tick = () => {
      if (charIdx >= totalChars) {
        // Transmission fully decoded
        setDisplayText(text);
        setActiveMorseStream("");
        isDecodingRef.current = false;
        setIsDecoding(false);
        if (playAudio) {
          playDecryptionComplete();
        }
        return;
      }

      const currentChar = chars[charIdx];

      // Automatically skip whitespace immediately
      if (currentChar === " " || currentChar === "\n" || currentChar === "\t") {
        charIdx++;
        morseSubIdx = 0;
        timerRef.current = window.setTimeout(tick, speed / 2);
        return;
      }

      const morsePattern = charToMorse(currentChar) || "·";
      const currentElement = morsePattern[morseSubIdx] || "·";
      const isDah = currentElement === "-" || currentElement === "−" || currentElement === "—";

      // Play authentic ITU Morse tone corresponding to this exact character element
      if (playAudio) {
        playMorseBeep(isDah ? "dah" : "dit");
      }

      // Render the string: resolved characters stay verbatim,
      // active character displays its active Morse element,
      // pending characters display subtle Morse dots/dashes
      const rendered = chars
        .map((c, i) => {
          if (i < charIdx) {
            return c; // Already locked in with original styling
          }
          if (c === " " || c === "\n" || c === "\t") {
            return c;
          }
          if (i === charIdx) {
            // Actively decoding: display current dit or dah
            return isDah ? "−" : "·";
          }
          // Pending character: authentic Morse placeholder
          return (i + morseSubIdx) % 2 === 0 ? "·" : "−";
        })
        .join("");

      setDisplayText(rendered);
      setActiveMorseStream(morsePattern);

      morseSubIdx++;

      // When all dits & dahs of this character are complete, lock in this character
      if (morseSubIdx >= morsePattern.length) {
        charIdx++;
        morseSubIdx = 0;
        // Inter-character gap before next letter
        const charGap = speed * 1.2;
        timerRef.current = window.setTimeout(tick, charGap);
      } else {
        // Intra-character gap between dits/dahs (dahs take slightly longer)
        const elementDelay = isDah ? speed * 1.5 : speed;
        timerRef.current = window.setTimeout(tick, elementDelay);
      }
    };

    timerRef.current = window.setTimeout(tick, revealDelay);
  }, [text, speed, playAudio, revealDelay]);

  useEffect(() => {
    const initTimer = window.setTimeout(() => {
      startDecode();
    }, 20);
    return () => {
      window.clearTimeout(initTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [startDecode]);

  return (
    <Component
      // CRITICAL: NEVER mutate font family, tracking, line-height or layout properties!
      // Inherit the exact parent styling at all times.
      className={`inline-block select-none transition-opacity duration-150 ${className}`}
      aria-label={text}
      onMouseEnter={triggerOnHover ? startDecode : undefined}
      title={isDecoding ? `Decrypting CW Morse Transmission: ${activeMorseStream}` : undefined}
    >
      {displayText}
    </Component>
  );
}
