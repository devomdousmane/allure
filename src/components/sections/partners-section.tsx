"use client";

import { useRef } from "react";
import Image from "next/image";
import { SectionSeam, SEAM } from "@/components/ui/section-seam";
import { PARTNERS } from "@/lib/partners";
import { useSectionReveal } from "@/hooks/use-section-reveal";

export function PartnersSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="partenaires"
      aria-labelledby="partners-heading"
      className="relative bg-white py-16 dark:bg-allure-petrol-deep sm:py-20 lg:py-24"
    >
      <SectionSeam from={SEAM.sand} fromDark={SEAM.petrol} />

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

        <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:mt-14 sm:grid-cols-4 sm:gap-x-8 lg:gap-x-12">
          {PARTNERS.map((partner) => (
            <li
              key={partner.id}
              data-reveal="item"
              className="group flex flex-col items-center text-center"
            >
              <div className="relative flex h-16 w-full max-w-[9rem] items-center justify-center sm:h-[4.5rem]">
                <Image
                  src={partner.logo}
                  alt={`Logo ${partner.name}`}
                  width={120}
                  height={120}
                  className="h-14 w-auto max-w-full object-contain opacity-65 grayscale transition duration-500 group-hover:opacity-100 group-hover:grayscale-0 sm:h-16 dark:opacity-75 dark:brightness-110 dark:group-hover:brightness-100"
                />
              </div>
              <p className="mt-4 font-sans text-[0.65rem] uppercase tracking-[0.16em] text-allure-ink/40 transition-colors group-hover:text-allure-gold dark:text-allure-sand/40">
                {partner.role}
              </p>
              <p className="mt-1 font-heading text-sm text-allure-petrol dark:text-allure-sand">
                {partner.name}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
