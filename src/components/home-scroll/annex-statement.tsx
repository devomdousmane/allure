"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import { EASE } from "@/lib/gsap/presets";
import { SectionSeam, SEAM } from "@/components/ui/section-seam";

const LETTERS = ["A", "L", "L", "U", "R", "E"] as const;

/**
 * Bandeau « ALLURE » — build progressif :
 * A → AL → ALL → ALLU → ALLUR → ALLURE
 */
export function AnnexStatement() {
  const rootRef = useRef<HTMLElement>(null);

  useSectionReveal(rootRef, {
    debugId: "annexStatement",
    skipDefaults: true,
    onEnter: (root) => {
      const soft = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const chars = root.querySelectorAll<HTMLElement>("[data-letter]");
      const sub = root.querySelector<HTMLElement>("[data-statement-sub]");
      const word = root.querySelector<HTMLElement>("[data-statement-word]");

      if (!chars.length) return;

      if (soft) {
        gsap.set([word, ...chars, sub].filter(Boolean), {
          autoAlpha: 1,
          clearProps: "transform",
        });
        return;
      }

      gsap.set(word, { autoAlpha: 1 });
      gsap.set(chars, {
        autoAlpha: 0,
        yPercent: 110,
        rotateX: 35,
        transformOrigin: "50% 100%",
      });
      if (sub) gsap.set(sub, { autoAlpha: 0, y: 14 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Une lettre après l’autre — rythme serré
      chars.forEach((char, i) => {
        tl.to(
          char,
          {
            autoAlpha: 1,
            yPercent: 0,
            rotateX: 0,
            duration: 0.22,
          },
          i === 0 ? 0 : `+=0.04`
        );
      });

      if (sub) {
        tl.to(
          sub,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.35,
            ease: EASE.soft,
          },
          "-=0.05"
        );
      }

      return () => {
        tl.kill();
      };
    },
  });

  return (
    <section
      ref={rootRef}
      id="annex-statement"
      aria-label="Allure"
      className="relative overflow-hidden bg-allure-sand py-20 lg:py-28 dark:bg-allure-petrol-deep"
    >
      <SectionSeam
        edges="top"
        from={SEAM.white}
        fromDark={SEAM.petrolDeep}
      />

      <div className="relative z-[2] mx-auto flex max-w-6xl flex-col items-center justify-center px-6">
        <p
          data-statement-word
          data-reveal="title"
          className="flex overflow-hidden font-heading text-[clamp(3.5rem,14vw,11rem)] font-medium leading-none tracking-[0.1em] text-allure-petrol dark:text-allure-gold"
          style={{ perspective: "800px" }}
        >
          {LETTERS.map((letter, i) => (
            <span
              key={`${letter}-${i}`}
              data-letter
              className="inline-block will-change-transform"
            >
              {letter}
            </span>
          ))}
        </p>
        <p
          data-statement-sub
          data-reveal="text"
          className="mt-6 text-center font-sans text-[10px] uppercase tracking-[0.4em] text-allure-petrol/40 dark:text-allure-sand/40"
        >
          Almadies — Dakar
        </p>
      </div>
    </section>
  );
}
