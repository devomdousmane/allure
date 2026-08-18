"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/lib/gsap/register";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

registerGsap();

/**
 * Pulse décoratif coin Services — n’anime pas le texte SplitText.
 * Cercle + index qui respire au scrub.
 */
export function AnnexServicesPulse() {
  const ringRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const ring = ringRef.current;
      const section = document.getElementById("services");
      if (!ring || !section || reduced !== false) return;

      gsap.fromTo(
        ring,
        { scale: 0.9, opacity: 0.2, rotate: -8 },
        {
          scale: 1.08,
          opacity: 0.5,
          rotate: 12,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.75,
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
      <div className="absolute bottom-[12%] left-[4%] sm:left-[6%]">
        <div
          ref={ringRef}
          className="flex size-24 items-center justify-center rounded-full border border-allure-gold/30 will-change-transform sm:size-28"
        >
          <span className="font-sans text-[10px] uppercase tracking-[0.35em] text-allure-gold/60">
            05
          </span>
        </div>
      </div>
    </div>
  );
}
