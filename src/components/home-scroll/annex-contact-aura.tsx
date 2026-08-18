"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/lib/gsap/register";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

registerGsap();

/** Aura douce + point pulsé sur Contact. */
export function AnnexContactAura() {
  const auraRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const aura = auraRef.current;
      const dot = dotRef.current;
      const section = document.getElementById("contact");
      if (!aura || !dot || !section || reduced !== false) return;

      gsap.fromTo(
        aura,
        { scale: 0.85, opacity: 0.15 },
        {
          scale: 1.15,
          opacity: 0.4,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.85,
          },
        }
      );

      gsap.to(dot, {
        scale: 1.6,
        opacity: 0.25,
        duration: 1.6,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
      });
    },
    { dependencies: [reduced] }
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
    >
      <div
        ref={auraRef}
        className="absolute top-1/2 left-1/2 h-[min(90vw,36rem)] w-[min(90vw,36rem)] -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--allure-gold) 22%, transparent) 0%, transparent 68%)",
        }}
      />
      <span
        ref={dotRef}
        className="absolute top-[22%] right-[14%] size-2.5 rounded-full bg-allure-gold will-change-transform sm:right-[18%]"
      />
    </div>
  );
}
