"use client";

import { useRef, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpDown,
  ArrowUpRight,
  Car,
  Lightbulb,
  MapPin,
  Shield,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionSharp } from "@/components/ui/section-sharp";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import {
  ABOUT_COPY,
  ABOUT_DISTANCES,
  ABOUT_MANAGEMENT,
  ABOUT_PILLARS,
} from "@/lib/a-propos";
import { cn } from "@/lib/utils";

const MANAGEMENT_ICONS = {
  vehicules: Car,
  ascenseurs: ArrowUpDown,
  ordures: Trash2,
  securite: Shield,
  eclairage: Lightbulb,
} as const;

function RevealSection({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  useSectionReveal(ref, { threshold: 0.18 });

  return (
    <section ref={ref} id={id} className={cn("scroll-mt-28", className)}>
      {children}
    </section>
  );
}

/** Récit À propos — scroll-telling éditorial. */
export function AboutStory() {
  return (
    <div id="about-story" className="relative">
      {/* 01 — Aperçu */}
      <RevealSection
        id="apercu"
        className="relative bg-white py-14 dark:bg-allure-petrol-deep sm:py-16 lg:py-20"
      >
        <SectionSharp
          edge="top"
          mode="line"
          variant="fold"
          className="h-8 sm:h-9 lg:h-10"
        />
        <div className="relative z-[2] mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 pt-4 sm:px-6 sm:pt-5 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <div>
            <p
              data-reveal="eyebrow"
              className="font-sans text-xs uppercase tracking-[0.3em] text-allure-gold"
            >
              {ABOUT_COPY.overviewEyebrow}
            </p>
            <h2
              data-split="lines,words"
              data-split-animate="words"
              className="mt-3 max-w-lg font-heading text-3xl text-allure-petrol dark:text-allure-sand sm:text-4xl"
            >
              {ABOUT_COPY.overviewTitle}
            </h2>
            <p
              data-reveal="text"
              className="mt-5 max-w-md font-sans text-sm leading-relaxed text-allure-ink/65 dark:text-allure-sand/65"
            >
              {ABOUT_COPY.overviewBody}
            </p>
            <div data-reveal="item" className="mt-8">
              <Button asChild size="lg" className="btn-cta">
                <Link href="/rendez-vous">
                  Parler à un conseiller
                  <ArrowUpRight className="size-4" aria-hidden />
                </Link>
              </Button>
            </div>
          </div>
          <div
            data-reveal="media"
            className="relative aspect-[4/3] overflow-hidden bg-allure-petrol/5 dark:bg-allure-sand/5"
          >
            <Image
              src="/Allure/HD.webp"
              alt="Résidence Allure — vue du projet"
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
          </div>
        </div>
      </RevealSection>

      {/* 02 — Situation */}
      <RevealSection
        id="situation"
        className="bg-allure-sand py-14 dark:bg-allure-petrol sm:py-16 lg:py-20"
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <p
                data-reveal="eyebrow"
                className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.3em] text-allure-gold"
              >
                <MapPin className="size-3.5" aria-hidden />
                {ABOUT_COPY.situationEyebrow}
              </p>
              <h2
                data-split="lines,words"
                data-split-animate="words"
                className="mt-3 font-heading text-3xl text-allure-petrol dark:text-allure-sand sm:text-4xl"
              >
                {ABOUT_COPY.situationTitle}
              </h2>
              <p
                data-reveal="text"
                className="mt-4 font-sans text-sm leading-relaxed text-allure-ink/65 dark:text-allure-sand/65"
              >
                {ABOUT_COPY.situationLead}
              </p>
              <p
                data-reveal="text"
                className="mt-3 font-sans text-sm leading-relaxed text-allure-ink/55 dark:text-allure-sand/55"
              >
                {ABOUT_COPY.situationBody}
              </p>
            </div>

            <div className="lg:col-span-7">
              <ul className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:gap-y-10">
                {ABOUT_DISTANCES.map((d) => (
                  <li key={d.label} data-reveal="item">
                    <p className="font-heading text-2xl tabular-nums text-allure-petrol dark:text-allure-sand sm:text-3xl">
                      {d.value}
                    </p>
                    <p className="mt-1 font-sans text-[11px] uppercase tracking-[0.16em] text-allure-ink/45 dark:text-allure-sand/45">
                      {d.label}
                    </p>
                  </li>
                ))}
              </ul>

              <div
                data-reveal="media"
                className="relative mt-10 aspect-[21/9] overflow-hidden bg-allure-petrol/5 dark:bg-allure-sand/5"
              >
                <Image
                  src="/Allure/DJI_0250.webp"
                  alt="Vue aérienne — Almadies"
                  fill
                  sizes="(min-width: 1024px) 55vw, 90vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* 03 — Le nom */}
      <RevealSection
        id="allure"
        className="relative overflow-hidden bg-allure-petrol-deep py-16 text-allure-sand sm:py-20 lg:py-24"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(224,191,137,0.12),transparent_55%)]"
        />
        <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-6">
          <p
            data-reveal="eyebrow"
            className="font-sans text-xs uppercase tracking-[0.3em] text-allure-gold"
          >
            {ABOUT_COPY.nameEyebrow}
          </p>
          <h2
            data-split="lines,words"
            data-split-animate="words"
            className="mt-4 font-heading text-[clamp(3.5rem,12vw,8rem)] leading-[0.9] tracking-tight text-allure-sand"
          >
            {ABOUT_COPY.nameTitle}
          </h2>
          <blockquote
            data-reveal="text"
            className="mx-auto mt-8 max-w-xl font-heading text-xl leading-snug text-allure-sand/90 sm:text-2xl"
          >
            {ABOUT_COPY.nameQuote}
          </blockquote>
          <p
            data-reveal="text"
            className="mx-auto mt-5 max-w-md font-sans text-sm leading-relaxed text-allure-sand/55"
          >
            {ABOUT_COPY.nameBody}
          </p>
        </div>
      </RevealSection>

      {/* 04 — Concept */}
      <RevealSection
        id="concept"
        className="bg-white py-14 dark:bg-allure-petrol-deep sm:py-16 lg:py-20"
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <p
              data-reveal="eyebrow"
              className="font-sans text-xs uppercase tracking-[0.3em] text-allure-gold"
            >
              {ABOUT_COPY.conceptEyebrow}
            </p>
            <h2
              data-split="lines,words"
              data-split-animate="words"
              className="mt-3 font-heading text-3xl text-allure-petrol dark:text-allure-sand sm:text-4xl"
            >
              {ABOUT_COPY.conceptTitle}
            </h2>
          </div>

          <ol className="mt-12 divide-y divide-allure-petrol/10 dark:divide-allure-sand/10">
            {ABOUT_PILLARS.map((pillar) => (
              <li
                key={pillar.index}
                data-reveal="item"
                className="grid grid-cols-1 gap-3 py-8 first:pt-0 last:pb-0 sm:grid-cols-[5rem_1fr] sm:gap-8"
              >
                <span className="font-heading text-3xl tabular-nums text-allure-petrol/20 dark:text-allure-sand/20">
                  {pillar.index}
                </span>
                <div>
                  <h3 className="font-heading text-xl text-allure-petrol dark:text-allure-sand sm:text-2xl">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 max-w-2xl font-sans text-sm leading-relaxed text-allure-ink/60 dark:text-allure-sand/60">
                    {pillar.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </RevealSection>

      {/* 05 — Gestion */}
      <RevealSection
        id="gestion"
        className="bg-allure-sand py-14 dark:bg-allure-petrol sm:py-16 lg:py-20"
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <p
              data-reveal="eyebrow"
              className="font-sans text-xs uppercase tracking-[0.3em] text-allure-gold"
            >
              {ABOUT_COPY.managementEyebrow}
            </p>
            <h2
              data-split="lines,words"
              data-split-animate="words"
              className="mt-3 font-heading text-3xl text-allure-petrol dark:text-allure-sand sm:text-4xl"
            >
              {ABOUT_COPY.managementTitle}
            </h2>
            <p
              data-reveal="text"
              className="mt-4 font-sans text-sm leading-relaxed text-allure-ink/60 dark:text-allure-sand/60"
            >
              {ABOUT_COPY.managementLead}
            </p>
          </div>

          <ul className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {ABOUT_MANAGEMENT.map((item) => {
              const Icon =
                MANAGEMENT_ICONS[item.id as keyof typeof MANAGEMENT_ICONS];
              return (
                <li key={item.id} data-reveal="item" className="group">
                  <span className="site-icon inline-flex size-10 items-center justify-center text-allure-gold">
                    {Icon ? (
                      <Icon className="size-5" strokeWidth={1.6} aria-hidden />
                    ) : null}
                  </span>
                  <h3 className="mt-4 font-heading text-lg text-allure-petrol dark:text-allure-sand">
                    {item.title}
                  </h3>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-allure-ink/60 dark:text-allure-sand/60">
                    {item.text}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </RevealSection>
    </div>
  );
}

export function AboutCtaBand() {
  const ref = useRef<HTMLElement>(null);
  useSectionReveal(ref, { threshold: 0.2 });

  return (
    <section
      ref={ref}
      className="bg-allure-petrol-deep py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-6">
        <h2
          data-split="lines,words"
          data-split-animate="words"
          className="font-heading text-3xl text-allure-sand sm:text-4xl"
        >
          {ABOUT_COPY.ctaTitle}
        </h2>
        <p
          data-reveal="text"
          className="mx-auto mt-4 max-w-md font-sans text-sm leading-relaxed text-allure-sand/60"
        >
          {ABOUT_COPY.ctaBody}
        </p>
        <div
          data-reveal="item"
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button asChild size="lg" className="btn-cta">
            <Link href="/rendez-vous">
              Nous contacter
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="btn-cta-outline border-allure-sand/25 text-allure-sand hover:bg-allure-sand/10"
          >
            <Link href="/brochure">Feuilleter la brochure</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="ghost"
            className="text-allure-sand/80 hover:bg-white/5 hover:text-allure-sand"
          >
            <Link href="/les-appartements">Voir les appartements</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
