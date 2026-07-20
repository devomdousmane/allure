"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/lib/gsap/register";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

registerGsap();

/** Gold horizontal rule that expands through WhoWeAre. */
export function AnnexPresenceLine() {
  const lineRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const line = lineRef.current;
      const section = document.getElementById("qui-sommes-nous");
      if (!line || !section || reduced === null) return;

      if (reduced === true) {
        gsap.set(line, { scaleX: 1 });
        return;
      }

      gsap.fromTo(
        line,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { dependencies: [reduced] }
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-[42%] z-[3] flex justify-center"
    >
      <div
        ref={lineRef}
        className="h-px w-[min(70%,36rem)] origin-center bg-gradient-to-r from-transparent via-allure-gold to-transparent will-change-transform"
      />
    </div>
  );
}
