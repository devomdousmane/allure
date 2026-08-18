"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/lib/gsap/register";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

registerGsap();

/** Traits diagonaux qui dérivent derrière la mosaïque Galerie. */
export function AnnexGalleryDrift() {
  const linesRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const lines = linesRef.current;
      const section = document.getElementById("categories");
      if (!lines || !section || reduced !== false) return;

      gsap.fromTo(
        lines,
        { xPercent: -8, yPercent: 4 },
        {
          xPercent: 8,
          yPercent: -6,
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
      <div
        ref={linesRef}
        className="absolute inset-[-20%] will-change-transform"
      >
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 h-px w-[140%] origin-center -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-allure-gold/25 to-transparent"
            style={{
              transform: `translate(-50%, -50%) rotate(${-18 + i * 12}deg) translateY(${(i - 1.5) * 4.5}rem)`,
            }}
          />
        ))}
      </div>
      <p className="absolute bottom-10 left-6 hidden font-heading text-[clamp(3rem,10vw,7rem)] leading-none tracking-[0.04em] text-allure-petrol/[0.04] dark:text-allure-sand/[0.05] sm:block lg:left-10">
        ALLURE
      </p>
    </div>
  );
}
