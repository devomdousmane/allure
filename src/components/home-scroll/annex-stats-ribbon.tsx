"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/lib/gsap/register";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

registerGsap();

/** Oversized year scrub behind stats — GSAP on inner node (keeps CSS centering stable). */
export function AnnexStatsRibbon() {
  const wordRef = useRef<HTMLParagraphElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const word = wordRef.current;
      const section = document.getElementById("stats");
      if (!word || !section || reduced !== false) return;

      gsap.fromTo(
        word,
        { x: -40, opacity: 0.06 },
        {
          x: 40,
          opacity: 0.18,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.7,
          },
        }
      );
    },
    { dependencies: [reduced] }
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <p
          ref={wordRef}
          className="whitespace-nowrap font-heading text-[clamp(5rem,22vw,16rem)] font-medium tracking-[0.08em] text-allure-petrol will-change-transform dark:text-allure-sand"
        >
          2026
        </p>
      </div>
    </div>
  );
}
