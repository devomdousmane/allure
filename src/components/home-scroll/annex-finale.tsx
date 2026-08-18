"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/lib/gsap/register";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { Button } from "@/components/ui/button";
import { SectionSeam, SEAM } from "@/components/ui/section-seam";

registerGsap();

/** Finale band before Contact — once-reveal (always shows). */
export function AnnexFinale() {
  const rootRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      const title = titleRef.current;
      if (!root || !title || reduced !== false) return;

      gsap.from(title, {
        y: 22,
        opacity: 0,
        duration: 0.85,
        ease: "power3.out",
        clearProps: "opacity,transform",
        scrollTrigger: {
          trigger: root,
          start: "top 78%",
          toggleActions: "play none none none",
        },
      });

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

    },
    { dependencies: [reduced] }
  );

  return (
    <div
      ref={rootRef}
      id="annex-finale"
      className="relative flex min-h-[32vh] flex-col items-center justify-center gap-8 overflow-hidden bg-allure-sand px-6 py-16 lg:min-h-[40vh] lg:py-24 dark:bg-allure-petrol-deep"
    >
      <SectionSeam
        edges="top"
        from={SEAM.white}
        fromDark={SEAM.petrolDeep}
      />
      <p className="relative z-[2] font-sans text-[10px] uppercase tracking-[0.4em] text-allure-gold">
        Prochaine étape
      </p>
      <h2
        ref={titleRef}
        className="relative z-[2] max-w-3xl text-center font-heading text-3xl text-allure-petrol sm:text-4xl lg:text-5xl dark:text-allure-sand"
      >
        Votre adresse{" "}
        <span className="text-allure-gold">aux Almadies</span> commence ici.
      </h2>
      <div className="relative z-[2] flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            data-finale-tick
            className="h-0.5 w-8 origin-left bg-allure-gold/70 sm:w-10"
          />
        ))}
      </div>
      <div className="relative z-[2] mt-10 flex flex-col items-center gap-3 sm:flex-row">
        <Button asChild size="lg" className="btn-cta">
          <Link href="/rendez-vous">Planifier une visite</Link>
        </Button>
        <Button asChild size="lg" className="btn-cta-outline">
          <Link href="/appartements-temoins">Appartements témoins</Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          size="lg"
          className="rounded-full text-allure-petrol dark:text-allure-sand"
        >
          <Link href="/brochure">Feuilleter la brochure</Link>
        </Button>
      </div>
    </div>
  );
}
