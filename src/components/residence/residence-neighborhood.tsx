"use client";

import { useRef } from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { ScrollParallax } from "@/components/motion/scroll-parallax";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import { RESIDENCE_COPY } from "@/lib/residence";
import { SITE } from "@/lib/site";

const HIGHLIGHTS = [
  "Boutiques & boulangeries",
  "Banques & supermarchés",
  "Plages des Almadies",
  "Écoles internationales",
] as const;

/** Avoisinages — positionnement Almadies + parallax immersif. */
export function ResidenceNeighborhood() {
  const ref = useRef<HTMLElement>(null);
  useSectionReveal(ref, { threshold: 0.15 });

  return (
    <section
      ref={ref}
      id="voisinage"
      className="relative overflow-hidden bg-allure-petrol-deep py-16 sm:py-20 lg:py-24"
    >
      <ScrollParallax
        distance={72}
        className="pointer-events-none absolute inset-0"
      >
        <div className="relative h-[120%] min-h-full w-full -translate-y-[8%]">
          <Image
            src="/Allure/HD_172.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-35"
          />
        </div>
      </ScrollParallax>
      <div className="absolute inset-0 bg-gradient-to-r from-allure-petrol-deep via-allure-petrol-deep/90 to-allure-petrol-deep/55" />

      <div className="relative z-[2] mx-auto grid max-w-6xl grid-cols-1 gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:items-center">
        <div>
          <p
            data-reveal="eyebrow"
            className="flex items-center gap-2 font-sans text-xs uppercase tracking-[0.3em] text-allure-gold"
          >
            <MapPin className="size-3.5" aria-hidden />
            {RESIDENCE_COPY.neighborhoodEyebrow}
          </p>
          <h2
            data-split="lines,words"
            data-split-animate="words"
            className="mt-3 font-heading text-3xl text-allure-sand sm:text-4xl lg:text-5xl"
          >
            {RESIDENCE_COPY.neighborhoodTitle}
          </h2>
          <p
            data-reveal="text"
            className="mt-5 max-w-lg font-sans text-sm leading-relaxed text-allure-sand/70"
          >
            {RESIDENCE_COPY.neighborhoodBody}
          </p>
          <p
            data-reveal="text"
            className="mt-4 font-sans text-xs uppercase tracking-[0.2em] text-allure-sand/45"
          >
            {SITE.address}
          </p>
        </div>

        <ul
          data-reveal="item"
          className="grid grid-cols-1 gap-px overflow-hidden border border-allure-sand/15 sm:grid-cols-2"
        >
          {HIGHLIGHTS.map((label) => (
            <li
              key={label}
              className="bg-allure-petrol-deep/80 px-5 py-6 backdrop-blur-sm sm:px-6 sm:py-8"
            >
              <span className="mb-3 block h-px w-8 bg-allure-gold" />
              <p className="font-heading text-lg text-allure-sand sm:text-xl">
                {label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
