"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin } from "lucide-react";
import { SectionSeam, SEAM } from "@/components/ui/section-seam";
import { NeighborhoodMap } from "@/components/sections/neighborhood-map";
import { useSectionReveal } from "@/hooks/use-section-reveal";

const NeighborhoodMapbox = dynamic(
  () =>
    import("@/components/sections/neighborhood-mapbox").then(
      (m) => m.NeighborhoodMapbox
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[280px] items-center justify-center rounded-2xl bg-allure-petrol/10 font-sans text-xs text-allure-ink/50 dark:text-allure-sand/50">
        Chargement de la carte…
      </div>
    ),
  }
);

gsap.registerPlugin(ScrollTrigger);

export function NeighborhoodSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useSectionReveal(sectionRef);

  useEffect(() => {
    if (
      !sectionRef.current ||
      !bgRef.current ||
      !midRef.current ||
      !cardsRef.current
    )
      return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        yPercent: 18,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });
      gsap.to(midRef.current, {
        yPercent: -12,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      gsap.fromTo(
        cardsRef.current,
        { xPercent: 6 },
        {
          xPercent: -6,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="quartier"
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-24 lg:py-32 dark:bg-allure-petrol-deep"
    >
      <div
        ref={bgRef}
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-allure-sand/40 to-white dark:from-allure-petrol-deep dark:via-allure-petrol dark:to-allure-petrol-deep"
      />
      <div
        ref={midRef}
        className="pointer-events-none absolute inset-0 opacity-[0.05] dark:opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, var(--allure-petrol) 0, transparent 40%), radial-gradient(circle at 80% 70%, var(--allure-petrol) 0, transparent 35%)",
        }}
      />
      <SectionSeam from={SEAM.sand} fromDark={SEAM.petrol} />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p
            data-reveal="eyebrow"
            className="flex items-center justify-center gap-2 font-sans text-xs uppercase tracking-[0.3em] text-allure-gold"
          >
            <MapPin className="h-3.5 w-3.5" />
            Les Almadies, Dakar
          </p>
          <h2
            data-split="lines,words"
            data-split-animate="words"
            className="mt-4 font-heading text-3xl text-allure-petrol sm:text-4xl dark:text-white"
          >
            Un panorama de cadres de vie uniques
          </h2>
          <p
            data-split="lines,words"
            data-split-animate="words"
            className="mt-5 font-sans text-sm text-allure-ink/60 dark:text-white/60"
          >
            Route des Almadies — l&rsquo;adresse la plus recherchée de Dakar,
            entre mer, écoles internationales et vie de quartier.
          </p>
        </div>

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8">
          <div ref={cardsRef} data-reveal="media">
            <NeighborhoodMap />
            <p className="mt-8 text-center font-sans text-xs uppercase tracking-[0.2em] text-allure-petrol/40 dark:text-white/40">
              Survolez ou touchez un point pour voir la distance
            </p>
          </div>

          <div data-reveal="media" className="flex justify-center">
            <NeighborhoodMapbox />
          </div>
        </div>
      </div>
    </section>
  );
}
