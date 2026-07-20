"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/lib/gsap/register";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { splitForReveal } from "@/lib/gsap/split-text";

registerGsap();

/**
 * Oversized « ALLURE » — once reveal (reliable) + light scrub polish.
 */
export function AnnexStatement() {
  const rootRef = useRef<HTMLElement>(null);
  const wordRef = useRef<HTMLParagraphElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      const word = wordRef.current;
      if (!root || !word || reduced !== false) return;

      const { targets, revert } = splitForReveal(word, {
        types: "chars",
        animate: "chars",
      });

      if (!targets.length) return revert;

      let played = false;
      const play = () => {
        if (played) return;
        played = true;
        gsap.fromTo(
          targets,
          { yPercent: 110, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.045,
          }
        );
      };

      const st = ScrollTrigger.create({
        trigger: root,
        start: "top 80%",
        once: true,
        onEnter: play,
        onRefresh: (self) => {
          if (self.progress > 0) play();
        },
      });

      const failsafe = window.setTimeout(() => {
        if (!played) play();
      }, 2500);

      return () => {
        window.clearTimeout(failsafe);
        st.kill();
        revert();
      };
    },
    { scope: rootRef, dependencies: [reduced] }
  );

  return (
    <section
      ref={rootRef}
      aria-hidden
      className="relative overflow-hidden bg-allure-sand py-20 lg:py-28 dark:bg-allure-petrol-deep"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-center px-6">
        <p
          ref={wordRef}
          className="font-heading text-[clamp(3.5rem,14vw,11rem)] font-medium leading-none tracking-[0.1em] text-allure-petrol dark:text-allure-gold"
        >
          ALLURE
        </p>
      </div>
      <p className="mt-6 text-center font-sans text-[10px] uppercase tracking-[0.4em] text-allure-petrol/40 dark:text-allure-sand/40">
        Almadies — Dakar
      </p>
    </section>
  );
}
