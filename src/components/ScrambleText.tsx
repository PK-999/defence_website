"use client";

import React from "react";
import { MorseText } from "./MorseText";

interface ScrambleTextProps {
  text: string;
  className?: string;
  triggerOnHover?: boolean;
  speed?: number;
  scrambleOnMount?: boolean;
}

/**
 * Replaced random glyph scrambling with tactical Morse code decode & audio transmission.
 */
export function ScrambleText({
  text,
  className = "",
  triggerOnHover = true,
  speed = 38,
}: ScrambleTextProps) {
  return (
    <MorseText
      text={text}
      className={className}
      triggerOnHover={triggerOnHover}
      speed={speed}
      playAudio={true}
    />
  );
}

export { MorseText };
