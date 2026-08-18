"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/lib/gsap/register";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

registerGsap();

const CHIPS = ["Piscine", "Sport", "Lounge", "Sécurité", "Concierge"];

/** Halo + pastilles prestations qui dérivent au scroll sur Résidence. */
export function AnnexAmenitiesBloom() {
  const bloomRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLUListElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const bloom = bloomRef.current;
      const chips = chipsRef.current;
      const section = document.getElementById("residence");
      if (!bloom || !chips || !section || reduced !== false) return;

      gsap.fromTo(
        bloom,
        { scale: 0.7, opacity: 0.12 },
        {
          scale: 1.25,
          opacity: 0.35,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.9,
          },
        }
      );

      gsap.fromTo(
        chips.children,
        { y: 40, opacity: 0 },
        {
          y: (i) => -24 - i * 10,
          opacity: 0.55,
          ease: "none",
          stagger: 0.04,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "center top",
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
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
    >
      <div
        ref={bloomRef}
        className="absolute top-[30%] left-[-10%] h-[min(70vw,28rem)] w-[min(70vw,28rem)] rounded-full will-change-transform dark:opacity-80"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--allure-gold) 28%, transparent) 0%, transparent 70%)",
        }}
      />
      <ul
        ref={chipsRef}
        className="absolute top-[22%] right-6 hidden flex-col items-end gap-3 lg:flex xl:right-10"
      >
        {CHIPS.map((chip) => (
          <li
            key={chip}
            className="rounded-full border border-allure-gold/25 bg-white/40 px-3 py-1 font-sans text-[10px] uppercase tracking-[0.2em] text-allure-petrol/55 backdrop-blur-sm will-change-transform dark:border-allure-gold/20 dark:bg-allure-petrol-deep/40 dark:text-allure-sand/50"
          >
            {chip}
          </li>
        ))}
      </ul>
    </div>
  );
}
