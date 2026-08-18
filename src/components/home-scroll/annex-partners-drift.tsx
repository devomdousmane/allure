"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/lib/gsap/register";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

registerGsap();

/** Mot géant « Réseau » qui dérive en opacity derrière Partenaires. */
export function AnnexPartnersDrift() {
  const wordRef = useRef<HTMLParagraphElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const word = wordRef.current;
      const section = document.getElementById("partenaires");
      if (!word || !section || reduced !== false) return;

      gsap.fromTo(
        word,
        { xPercent: -12, opacity: 0.04 },
        {
          xPercent: 10,
          opacity: 0.12,
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
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <p
          ref={wordRef}
          className="whitespace-nowrap font-heading text-[clamp(4rem,18vw,12rem)] font-medium tracking-[0.06em] text-allure-petrol will-change-transform dark:text-allure-sand"
        >
          Réseau
        </p>
      </div>
    </div>
  );
}
