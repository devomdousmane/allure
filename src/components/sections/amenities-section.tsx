"use client";

import { useRef } from "react";
import { MediaImage } from "@/components/ui/media-image";
import Link from "next/link";
import {
  Waves,
  Dumbbell,
  ShieldCheck,
  Car,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionSeam, SEAM } from "@/components/ui/section-seam";
import { useSectionReveal } from "@/hooks/use-section-reveal";

/** Atouts résidence — 4 max, un job clair avant la galerie / témoins. */
const REASONS = [
  {
    icon: Waves,
    title: "Cadre Almadies",
    text: "À ~300 m de la plage, dans l’un des quartiers les plus recherchés de Dakar.",
  },
  {
    icon: ShieldCheck,
    title: "Sécurité 24h/24",
    text: "Gardiennage, vidéosurveillance et accès contrôlé au quotidien.",
  },
  {
    icon: Dumbbell,
    title: "Prestations premium",
    text: "Piscine, salle de sport, lounge et espaces verts dans la résidence.",
  },
  {
    icon: Car,
    title: "Confort technique",
    text: "Parking privé, groupe électrogène, fibre et climatisation.",
  },
] as const;

export function AmenitiesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useSectionReveal(sectionRef, { debugId: "amenities" });

  return (
    <section
      ref={sectionRef}
      id="residence"
      className="relative bg-allure-sand py-24 lg:py-32 dark:bg-allure-petrol"
    >
      <SectionSeam
        edges="top"
        from={SEAM.sand}
        fromDark={SEAM.petrol}
        className="h-24 sm:h-32"
      />
      <div className="relative z-[2] mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
        <div>
          <p
            data-reveal="eyebrow"
            className="font-sans text-xs uppercase tracking-[0.3em] text-allure-gold"
          >
            La résidence
          </p>
          <h2
            data-split="lines,words"
            data-split-animate="words"
            className="mt-4 font-heading text-3xl text-allure-petrol sm:text-4xl dark:text-allure-sand"
          >
            Prestations et cadre de vie
          </h2>
          <p
            data-split="lines,words"
            data-split-animate="words"
            className="mt-4 max-w-md font-sans text-sm leading-relaxed text-allure-ink/60 dark:text-allure-sand/60"
          >
            Quatre repères pour comprendre ce qui fait Allure au quotidien —
            avant de découvrir les intérieurs.
          </p>
          <ul className="mt-10 flex flex-col gap-5">
            {REASONS.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.title} data-reveal="item" className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-allure-petrol dark:bg-allure-petrol-deep dark:text-allure-gold">
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                  <div>
                    <p className="font-heading text-base text-allure-petrol dark:text-allure-sand">
                      {item.title}
                    </p>
                    <p className="mt-1 font-sans text-sm text-allure-ink/60 dark:text-allure-sand/60">
                      {item.text}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
          <div
            data-reveal="item"
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button asChild size="lg" className="btn-cta">
              <Link href="/rendez-vous">Planifier une visite</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="rounded-full text-allure-petrol dark:text-allure-sand"
            >
              <Link href="/residence">
                Découvrir la résidence
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div
          data-reveal="media"
          className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] lg:max-w-none"
        >
          <MediaImage
            src="/Allure/facade-chantier.webp"
            alt="Résidence Allure — façade en construction aux Almadies"
            fill
            sizes="(min-width: 1024px) 45vw, 90vw"
            loaderSize="md"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-allure-petrol-deep/50 via-transparent to-transparent" />
          <p className="absolute inset-x-0 bottom-0 p-6 font-sans text-xs uppercase tracking-[0.18em] text-white/80">
            Almadies · Dakar
          </p>
        </div>
      </div>
    </section>
  );
}
