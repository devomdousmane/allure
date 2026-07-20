"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { registerGsap } from "@/lib/gsap/register";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

registerGsap();

/** Thin gold progress bar fixed at the top of the viewport. */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const bar = barRef.current;
    if (!bar || reduced === null) return;

    if (reduced === true) {
      gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
      return;
    }

    gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });

    const tween = gsap.to(bar, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.35,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [reduced]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] bg-allure-petrol/10 dark:bg-allure-sand/10"
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-allure-gold will-change-transform"
      />
    </div>
  );
}
