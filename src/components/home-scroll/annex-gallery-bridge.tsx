"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/lib/gsap/register";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { splitForReveal } from "@/lib/gsap/split-text";

registerGsap();

/** Bridge Prestations → Galerie with reliable once-reveal. */
export function AnnexGalleryBridge() {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      const track = trackRef.current;
      if (!root || !track || reduced !== false) return;

      const cleanups: Array<() => void> = [];

      track.querySelectorAll<HTMLElement>("[data-bridge-label]").forEach((el) => {
        const { targets, revert } = splitForReveal(el, {
          types: "chars",
          animate: "chars",
        });
        cleanups.push(revert);
        if (!targets.length) return;

        gsap.from(targets, {
          yPercent: 110,
          opacity: 0,
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.03,
          clearProps: "opacity,transform",
          scrollTrigger: {
            trigger: root,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        });
      });

      return () => cleanups.forEach((fn) => fn());
    },
    { scope: rootRef, dependencies: [reduced] }
  );

  return (
    <div
      ref={rootRef}
      className="relative bg-allure-sand py-16 lg:py-24 dark:bg-allure-petrol"
    >
      <div className="relative flex min-h-[28vh] items-center overflow-hidden lg:min-h-[36vh]">
        <div
          ref={trackRef}
          className="flex w-full items-center justify-center gap-8 px-6 sm:gap-14 lg:gap-24"
        >
          <BridgeMarker index="07" label="Prestations" />
          <span
            className="h-px w-16 bg-allure-gold/50 sm:w-24 lg:w-40"
            aria-hidden
          />
          <BridgeMarker index="08" label="Galerie" accent />
        </div>
      </div>
    </div>
  );
}

function BridgeMarker({
  index,
  label,
  accent = false,
}: {
  index: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className="text-center">
      <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-allure-gold">
        {index}
      </p>
      <p
        data-bridge-label
        className={
          accent
            ? "mt-3 font-heading text-3xl text-allure-petrol sm:text-4xl lg:text-5xl dark:text-allure-sand"
            : "mt-3 font-heading text-2xl text-allure-petrol/55 sm:text-3xl dark:text-allure-sand/55"
        }
      >
        {label}
      </p>
    </div>
  );
}
