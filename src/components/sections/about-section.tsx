"use client";

import { useRef } from "react";
import { MediaImage } from "@/components/ui/media-image";
import { Bath, BedDouble, Star } from "lucide-react";
import { gsap } from "gsap";
import { SectionSeam, SEAM } from "@/components/ui/section-seam";
import { HomeCtaRow } from "@/components/home-scroll/home-cta-row";
import { SITE } from "@/lib/site";
import { TEMOIN_MEDIA } from "@/lib/media";
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
        data-chart-line
        d="M2 28 C14 26, 18 12, 30 16 S48 30, 58 14 S72 6, 78 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        className="text-allure-petrol dark:text-allure-gold"
      />
      <circle
        data-chart-dot
        cx="78"
        cy="10"
        r="2.5"
        className="fill-allure-gold"
      />
    </svg>
  );
}

/**
 * Section Vision / À propos — choreography after the ALLURE statement band.
 */
export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cleanups = useRef<Array<() => void>>([]);

  useSectionReveal(sectionRef, {
    debugId: "about",
    start: "top 68%",
    skipDefaults: true,
    onEnter: (root) => {
      cleanups.current.forEach((fn) => fn());
      cleanups.current = [];

      const soft = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const clip = root.querySelector<HTMLElement>("[data-clip-reveal]");
      const cards = root.querySelectorAll<HTMLElement>("[data-about-card]");
      const eyebrow = root.querySelector<HTMLElement>('[data-reveal="eyebrow"]');
      const title = root.querySelector<HTMLElement>("[data-about-title]");
      const trust = root.querySelector<HTMLElement>("[data-about-trust]");
      const body = root.querySelector<HTMLElement>("[data-about-body]");
      const cta = root.querySelector<HTMLElement>("[data-about-cta]");
      const chartLine = root.querySelector<SVGPathElement>("[data-chart-line]");
      const chartDot = root.querySelector<SVGCircleElement>("[data-chart-dot]");

      const all = [clip, ...cards, eyebrow, title, trust, body, cta].filter(
        Boolean
      ) as HTMLElement[];

      if (soft) {
        gsap.set(all, { autoAlpha: 1, clearProps: "transform,clipPath" });
        if (chartLine) gsap.set(chartLine, { clearProps: "strokeDashoffset,strokeDasharray" });
        if (chartDot) gsap.set(chartDot, { autoAlpha: 1 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: EASE.out } });

      if (clip) {
        tl.fromTo(
          clip,
          {
            autoAlpha: 0,
            clipPath: "inset(14% 14% 14% 14% round 2rem)",
            scale: 1.08,
          },
          {
            autoAlpha: 1,
            clipPath: "inset(0% 0% 0% 0% round 2rem)",
            scale: 1,
            duration: DURATION.slow,
          },
          0
        );
      }

      if (cards.length) {
        tl.fromTo(
          cards,
          { autoAlpha: 0, y: 28, scale: 0.94 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: DURATION.base,
            stagger: 0.14,
          },
          0.35
        );
      }

      if (chartLine) {
        const length = chartLine.getTotalLength();
        gsap.set(chartLine, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
        if (chartDot) gsap.set(chartDot, { autoAlpha: 0, scale: 0 });

        tl.to(
          chartLine,
          {
            strokeDashoffset: 0,
            duration: 1.1,
            ease: EASE.soft,
          },
          0.55
        );

        if (chartDot) {
          tl.to(
            chartDot,
            { autoAlpha: 1, scale: 1, duration: 0.35, ease: EASE.out },
            "-=0.25"
          );
        }
      }

      if (eyebrow) {
        tl.fromTo(
          eyebrow,
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: DURATION.fast },
          0.2
        );
      }

      if (title) {
        tl.fromTo(
          title,
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: DURATION.reveal },
          0.32
        );
      }

      if (trust) {
        tl.fromTo(
          trust,
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: DURATION.fast },
          "-=0.35"
        );
      }

      if (body) {
        tl.fromTo(
          body,
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: DURATION.reveal },
          "-=0.2"
        );
      }

      if (cta) {
        tl.fromTo(
          cta,
          { autoAlpha: 0, y: 16, scale: 0.96 },
          { autoAlpha: 1, y: 0, scale: 1, duration: DURATION.base },
          "-=0.25"
        );

        const arrow = cta.querySelector<HTMLElement>("[data-cta-arrow]");
        const enter = () => {
          gsap.to(cta, { y: -2, duration: 0.25, ease: EASE.out });
          if (arrow) {
            gsap.to(arrow, { x: 3, y: -3, duration: 0.25, ease: EASE.out });
          }
        };
        const leave = () => {
          gsap.to(cta, { y: 0, duration: 0.3, ease: EASE.soft });
          if (arrow) {
            gsap.to(arrow, { x: 0, y: 0, duration: 0.3, ease: EASE.soft });
          }
        };
        cta.addEventListener("pointerenter", enter);
        cta.addEventListener("pointerleave", leave);
        cleanups.current.push(() => {
          cta.removeEventListener("pointerenter", enter);
          cta.removeEventListener("pointerleave", leave);
        });
      }

      return () => {
        tl.kill();
        cleanups.current.forEach((fn) => fn());
        cleanups.current = [];
      };
    },
  });

  return (
    <section
      ref={sectionRef}
      id="a-propos"
      className="relative bg-white pb-24 pt-8 lg:pb-32 lg:pt-12 dark:bg-allure-petrol-deep"
    >
      <SectionSeam
        edges="top"
        from={SEAM.sand}
        fromDark={SEAM.petrolDeep}
      />

      <div className="relative z-[2] mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div
            data-clip-reveal
            className="relative aspect-[4/5] overflow-hidden rounded-[2rem] will-change-transform sm:aspect-[5/6]"
          >
            <MediaImage
              src={TEMOIN_MEDIA.salon1}
              alt="Résidence Allure aux Almadies"
              fill
              sizes="(min-width: 1024px) 45vw, 90vw"
              loaderSize="md"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-allure-petrol-deep/25 to-transparent" />
          </div>

          <div
            data-about-card
            className="absolute left-3 top-[18%] z-10 w-[min(100%,240px)] rounded-2xl border border-allure-petrol/8 bg-white/95 p-3.5 backdrop-blur-sm will-change-transform dark:border-allure-sand/10 dark:bg-allure-petrol-deep/95 sm:left-[-8%] sm:w-[250px] sm:p-4"
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
            data-about-card
            className="absolute bottom-[12%] right-3 z-10 w-[min(100%,260px)] rounded-2xl border border-allure-petrol/8 bg-white/95 p-3 backdrop-blur-sm will-change-transform dark:border-allure-sand/10 dark:bg-allure-petrol-deep/95 sm:right-[-6%] sm:w-[280px] sm:p-3.5"
          >
            <div className="flex gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                <MediaImage
                  src={TEMOIN_MEDIA.chambre1}
                  alt=""
                  fill
                  sizes="56px"
                  loaderSize="sm"
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
            data-about-title
            data-split="lines,words"
            data-split-animate="words"
            className="mt-6 font-heading text-3xl leading-[1.2] text-allure-petrol sm:text-4xl lg:text-[2.75rem] dark:text-allure-sand"
          >
            Plus qu&rsquo;une résidence, votre partenaire de confiance pour
            chaque décision
          </h2>

          <div
            data-about-trust
            className="mt-4 flex flex-wrap items-center gap-3"
            aria-hidden
          >
            <span className="inline-flex items-center -space-x-2">
              <span className="relative inline-block h-8 w-8 overflow-hidden rounded-full ring-2 ring-white dark:ring-allure-petrol-deep sm:h-9 sm:w-9">
                <MediaImage
                  src={TEMOIN_MEDIA.salon6}
                  alt=""
                  fill
                  sizes="36px"
                  showLoader={false}
                  className="object-cover"
                />
              </span>
              <span className="relative inline-block h-8 w-8 overflow-hidden rounded-full ring-2 ring-white dark:ring-allure-petrol-deep sm:h-9 sm:w-9">
                <MediaImage
                  src={TEMOIN_MEDIA.cuisine1}
                  alt=""
                  fill
                  sizes="36px"
                  showLoader={false}
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
            data-about-body
            data-split="lines,words"
            data-split-animate="words"
            className="mt-6 max-w-md font-sans text-sm leading-relaxed text-allure-ink/60 dark:text-allure-sand/60"
          >
            Aux Almadies, Allure réunit architecture soignée, prestations
            d&rsquo;exception et accompagnement dédié — pour les familles
            résidentes comme pour la diaspora.
          </p>

          <div
            data-about-cta
            className="mt-8 will-change-transform"
          >
            <HomeCtaRow
              align="start"
              primary={{
                label: "Planifier une visite",
                href: "/rendez-vous",
              }}
              secondary={{
                label: "Appartements témoins",
                href: "/appartements-temoins",
              }}
              tertiary={{
                label: "Notre histoire",
                href: "/a-propos",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
