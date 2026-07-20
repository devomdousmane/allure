"use client";

import { useRef } from "react";
import { Quote } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/lib/gsap/register";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

registerGsap();

/** Giant quote mark — positioned with CSS, scrubbed on an inner wrapper. */
export function AnnexVoicesMark() {
  const markRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const mark = markRef.current;
      const section = document.getElementById("temoignages");
      if (!mark || !section || reduced !== false) return;

      gsap.fromTo(
        mark,
        { y: 32, opacity: 0.1, rotate: -6 },
        {
          y: -40,
          opacity: 0.28,
          rotate: 4,
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
      <div className="absolute top-[16%] right-[6%] sm:right-[10%]">
        <div
          ref={markRef}
          className="text-allure-petrol will-change-transform dark:text-allure-sand"
        >
          <Quote className="size-[clamp(4rem,14vw,9rem)] stroke-[1]" />
        </div>
      </div>
    </div>
  );
}
