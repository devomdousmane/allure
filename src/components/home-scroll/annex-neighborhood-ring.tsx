"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/lib/gsap/register";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

registerGsap();

/** Neighborhood ring — animate inner node only (outer keeps CSS centering). */
export function AnnexNeighborhoodRing() {
  const ringRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const ring = ringRef.current;
      const section = document.getElementById("quartier");
      if (!ring || !section || reduced !== false) return;

      gsap.fromTo(
        ring,
        { rotate: -12, scale: 0.92, opacity: 0.2 },
        {
          rotate: 10,
          scale: 1,
          opacity: 0.45,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        }
      );
    },
    { dependencies: [reduced] }
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          ref={ringRef}
          className="flex h-[min(60vw,24rem)] w-[min(60vw,24rem)] items-center justify-center rounded-full border border-allure-gold/20 will-change-transform"
        >
          <span className="font-sans text-[10px] uppercase tracking-[0.45em] text-allure-gold/60">
            Almadies
          </span>
        </div>
      </div>
    </div>
  );
}
