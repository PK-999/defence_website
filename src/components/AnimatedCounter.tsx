"use client";

import { useEffect, useState, useRef } from "react";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedCounter({
  value,
  duration = 1500,
  prefix = "",
  suffix = "",
  className = "",
}: AnimatedCounterProps) {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;

          // Respect reduced motion
          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setCurrent(value);
            return;
          }

          const start = performance.now();
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCurrent(Math.floor(eased * value));

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setCurrent(value);
            }
          };

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span ref={containerRef} className={`font-mono tabular-nums ${className}`}>
      {prefix}
      {current.toLocaleString()}
      {suffix}
    </span>
  );
}
