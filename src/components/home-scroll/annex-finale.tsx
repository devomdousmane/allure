"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/lib/gsap/register";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { splitForReveal } from "@/lib/gsap/split-text";

registerGsap();

/** Finale band before Contact — once-reveal SplitType (always shows). */
export function AnnexFinale() {
  const rootRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      const title = titleRef.current;
      if (!root || !title || reduced !== false) return;

      const { targets, revert } = splitForReveal(title, {
        types: "lines,words",
        animate: "words",
      });

      if (targets.length) {
        gsap.from(targets, {
          yPercent: 110,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.05,
          clearProps: "opacity,transform",
          scrollTrigger: {
            trigger: root,
            start: "top 78%",
            toggleActions: "play none none none",
          },
        });
      }

      const ticks = root.querySelectorAll<HTMLElement>("[data-finale-tick]");
      gsap.fromTo(
        ticks,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: root,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      );

      return () => revert();
    },
    { scope: rootRef, dependencies: [reduced] }
  );

  return (
    <div
      ref={rootRef}
      className="relative flex min-h-[32vh] flex-col items-center justify-center gap-8 bg-allure-sand px-6 py-16 lg:min-h-[40vh] lg:py-24 dark:bg-allure-petrol-deep"
    >
      <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-allure-gold">
        Prochaine étape
      </p>
      <h2
        ref={titleRef}
        className="max-w-3xl text-center font-heading text-3xl text-allure-petrol sm:text-4xl lg:text-5xl dark:text-allure-sand"
      >
        Votre adresse{" "}
        <span className="text-allure-gold">aux Almadies</span> commence ici.
      </h2>
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            data-finale-tick
            className="h-0.5 w-8 origin-left bg-allure-gold/70 sm:w-10"
          />
        ))}
      </div>
    </div>
  );
}
