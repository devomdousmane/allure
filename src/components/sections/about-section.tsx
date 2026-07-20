"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Bath, BedDouble, Star } from "lucide-react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import { DURATION, EASE } from "@/lib/gsap/presets";

function SparkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2.5 13.8 9.2 20.5 11 13.8 12.8 12 19.5 10.2 12.8 3.5 11l6.7-1.8L12 2.5Z" />
    </svg>
  );
}

function MiniChart() {
  return (
    <svg viewBox="0 0 80 36" className="h-9 w-20" aria-hidden>
      <path
        d="M2 28 C14 26, 18 12, 30 16 S48 30, 58 14 S72 6, 78 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        className="text-allure-petrol dark:text-allure-gold"
      />
      <circle cx="78" cy="10" r="2.5" className="fill-allure-gold" />
    </svg>
  );
}

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useSectionReveal(sectionRef, {
    onEnter: (root) => {
      const clip = root.querySelector<HTMLElement>("[data-clip-reveal]");
      if (!clip) return;

      gsap.fromTo(
        clip,
        { clipPath: "inset(12% 12% 12% 12% round 2rem)", scale: 1.06 },
        {
          clipPath: "inset(0% 0% 0% 0% round 2rem)",
          scale: 1,
          duration: DURATION.slow,
          ease: EASE.out,
        }
      );
    },
  });

  return (
    <section
      ref={sectionRef}
      id="a-propos"
      className="relative bg-white pb-24 pt-8 lg:pb-32 lg:pt-12 dark:bg-allure-petrol-deep"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div
            data-clip-reveal
            className="relative aspect-[4/5] overflow-hidden rounded-[2rem] sm:aspect-[5/6]"
          >
            <Image
              src="/Allure/HD.webp"
              alt="Résidence Allure aux Almadies"
              fill
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-allure-petrol-deep/25 to-transparent" />
          </div>

          <div
            data-reveal="item"
            className="absolute left-3 top-[18%] z-10 w-[min(100%,240px)] rounded-2xl border border-allure-petrol/8 bg-white/95 p-3.5 backdrop-blur-sm dark:border-allure-sand/10 dark:bg-allure-petrol-deep/95 sm:left-[-8%] sm:w-[250px] sm:p-4"
          >
            <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-allure-ink/45 dark:text-allure-sand/45">
              Suivi du projet
            </p>
            <div className="mt-2 flex items-end justify-between gap-3">
              <div>
                <p className="font-sans text-xs text-allure-ink/55 dark:text-allure-sand/55">
                  Livraison
                </p>
                <p className="font-heading text-2xl text-allure-petrol dark:text-allure-sand">
                  {SITE.delivery}
                </p>
              </div>
              <div className="text-right">
                <MiniChart />
                <p className="mt-0.5 font-sans text-[10px] text-allure-gold">
                  Gros œuvre achevé
                </p>
              </div>
            </div>
          </div>

          <div
            data-reveal="item"
            className="absolute bottom-[12%] right-3 z-10 w-[min(100%,260px)] rounded-2xl border border-allure-petrol/8 bg-white/95 p-3 backdrop-blur-sm dark:border-allure-sand/10 dark:bg-allure-petrol-deep/95 sm:right-[-6%] sm:w-[280px] sm:p-3.5"
          >
            <div className="flex gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                <Image
                  src="/hero-sequence/frame_024.webp"
                  alt=""
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-allure-ink/45 dark:text-allure-sand/45">
                  Typologie phare
                </p>
                <p className="truncate font-heading text-sm text-allure-petrol dark:text-allure-sand">
                  Appartement Type A
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-[11px] text-allure-ink/55 dark:text-allure-sand/55">
                  <span className="inline-flex items-center gap-1">
                    <BedDouble className="h-3 w-3" />
                    Séjour
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Bath className="h-3 w-3" />
                    Premium
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-allure-petrol/8 pt-2.5 dark:border-allure-sand/10">
              <p className="font-heading text-sm text-allure-petrol dark:text-allure-gold">
                Dès {SITE.priceFrom}
              </p>
              <p className="inline-flex items-center gap-1 font-sans text-[11px] text-allure-ink/50 dark:text-allure-sand/50">
                <Star className="h-3 w-3 fill-allure-gold text-allure-gold" />
                Almadies
              </p>
            </div>
          </div>
        </div>

        <div>
          <span
            data-reveal="eyebrow"
            className="inline-flex items-center gap-2 rounded-full border border-allure-petrol/10 bg-allure-sand px-4 py-1.5 font-sans text-xs text-allure-petrol/70 dark:border-allure-sand/15 dark:bg-white/5 dark:text-allure-sand/70"
          >
            <span className="h-1 w-1 rounded-full bg-allure-gold" />
            À propos
          </span>

          <h2
            data-split="lines,words"
            data-split-animate="words"
            className="mt-6 font-heading text-3xl leading-[1.2] text-allure-petrol sm:text-4xl lg:text-[2.75rem] dark:text-allure-sand"
          >
            Plus qu&rsquo;une résidence, votre partenaire de confiance pour
            chaque décision
          </h2>

          <div
            data-reveal="item"
            className="mt-4 flex flex-wrap items-center gap-3"
            aria-hidden
          >
            <span className="inline-flex items-center -space-x-2">
              <span className="relative inline-block h-8 w-8 overflow-hidden rounded-full ring-2 ring-white dark:ring-allure-petrol-deep sm:h-9 sm:w-9">
                <Image
                  src="/Allure/HD_137.webp"
                  alt=""
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </span>
              <span className="relative inline-block h-8 w-8 overflow-hidden rounded-full ring-2 ring-white dark:ring-allure-petrol-deep sm:h-9 sm:w-9">
                <Image
                  src="/Allure/HD_172.webp"
                  alt=""
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 font-sans text-xs uppercase tracking-[0.16em] text-allure-gold">
              <SparkIcon className="h-4 w-4" />
              Confiance
            </span>
          </div>

          <p
            data-split="lines,words"
            data-split-animate="words"
            className="mt-6 max-w-md font-sans text-sm leading-relaxed text-allure-ink/60 dark:text-allure-sand/60"
          >
            Aux Almadies, Allure réunit architecture soignée, prestations
            d&rsquo;exception et accompagnement dédié — pour les familles
            résidentes comme pour la diaspora.
          </p>

          <div data-reveal="item">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="mt-8 rounded-full border-allure-petrol/20 bg-white text-allure-petrol hover:bg-allure-sand hover:text-allure-petrol dark:border-allure-sand/20 dark:bg-transparent dark:text-allure-sand dark:hover:bg-white/5"
            >
              <Link href="/a-propos">
                En savoir plus
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
