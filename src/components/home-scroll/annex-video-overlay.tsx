"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/lib/gsap/register";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

registerGsap();

/**
 * Video chapter overlay — GSAP on inner node so CSS centering stays intact.
 */
export function AnnexVideoOverlay() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || reduced !== false) return;

      const target = document.getElementById("chantier");
      if (!target) return;

      const word = root.querySelector<HTMLElement>("[data-scrub-word]");
      if (!word) return;

      gsap.fromTo(
        word,
        { y: 24, opacity: 0.08 },
        {
          y: -36,
          opacity: 0.26,
          ease: "none",
          scrollTrigger: {
            trigger: target,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        }
      );
    },
    { scope: rootRef, dependencies: [reduced] }
  );

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
    >
      <div className="absolute top-[14%] left-1/2 -translate-x-1/2">
        <p
          data-scrub-word
          className="whitespace-nowrap font-heading text-[clamp(3.5rem,14vw,10rem)] font-medium tracking-[0.14em] text-allure-sand/25 will-change-transform"
        >
          CHANTIER
        </p>
      </div>
    </div>
  );
}
