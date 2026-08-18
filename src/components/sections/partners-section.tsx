"use client";

import { useRef } from "react";
import { SectionSeam, SEAM } from "@/components/ui/section-seam";
import { PartnersLogoMarquee } from "@/components/sections/partners-logo-marquee";
import { useSectionReveal } from "@/hooks/use-section-reveal";

export function PartnersSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef, { debugId: "partners" });

  return (
    <section
      ref={sectionRef}
      id="partenaires"
      aria-labelledby="partners-heading"
      className="relative overflow-hidden bg-white py-16 dark:bg-allure-petrol-deep sm:py-20 lg:py-24"
    >
      <SectionSeam
        edges="top"
        from={SEAM.sand}
        fromDark={SEAM.petrol}
      />

      <div className="relative z-[2] mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-lg text-center">
          <p
            data-reveal="eyebrow"
            className="font-sans text-xs uppercase tracking-[0.3em] text-allure-gold"
          >
            Confiance
          </p>
          <h2
            id="partners-heading"
            data-split="lines,words"
            data-split-animate="words"
            className="mt-3 font-heading text-2xl text-allure-petrol dark:text-allure-sand sm:text-3xl"
          >
            Nos partenaires
          </h2>
          <p
            data-split="lines,words"
            data-split-animate="words"
            className="mt-3 font-sans text-sm leading-relaxed text-allure-ink/60 dark:text-allure-sand/60"
          >
            Une équipe pluridisciplinaire pour concevoir et livrer Allure.
          </p>
        </div>
      </div>

      <div data-reveal="media" className="relative z-[2]">
        <PartnersLogoMarquee />
      </div>
    </section>
  );
}
