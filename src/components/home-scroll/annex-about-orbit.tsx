"use client";

import { useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/lib/gsap/register";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import {
  OrbitAnnulus,
  ORBIT_ANIM,
  applyOrbitProgress,
} from "@/components/motion/orbit-annulus";

registerGsap();

/** Anneaux Vision — rotation scrub opposée (down / up). */
export function AnnexAboutOrbit() {
  const orbitRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const orbit = orbitRef.current;
      const section = document.getElementById("a-propos");
      if (!orbit || !section || reduced !== false) return;

      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.85,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          applyOrbitProgress(orbit, self.progress, ORBIT_ANIM.vision);
        },
      });
    },
    { dependencies: [reduced] }
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
    >
      <div className="absolute top-[18%] right-[-8%] sm:right-[4%] lg:right-[8%]">
        <div ref={orbitRef}>
          <OrbitAnnulus label="Vision" />
        </div>
      </div>
    </div>
  );
}
