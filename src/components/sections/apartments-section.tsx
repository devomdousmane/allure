"use client";

import { useMemo, useRef, useState } from "react";
import { MediaImage } from "@/components/ui/media-image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tilt3D } from "@/components/motion/tilt-3d";
import { SectionSeam, SEAM } from "@/components/ui/section-seam";
import { APARTMENTS, type Apartment } from "@/lib/apartments";
import { cn } from "@/lib/utils";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import { HomeCtaRow } from "@/components/home-scroll/home-cta-row";

const TABS = [
  { id: "all", label: "Tous" },
  { id: "studio", label: "Studio" },
  { id: "type-a", label: "Type A" },
  { id: "type-b", label: "Type B" },
  { id: "type-c", label: "Type C" },
  { id: "type-d", label: "Type D" },
] as const;

function shortTitle(apt: Apartment) {
  if (apt.slug === "studio") return "Studio";
  return apt.type.replace(/^Appartement\s+/i, "");
}

function Apartment3DCard({
  apt,
  featured = false,
}: {
  apt: Apartment;
  featured?: boolean;
}) {
  return (
    <Tilt3D
      maxDeg={featured ? 8 : 10}
      glare
      className="h-full rounded-[1.75rem]"
    >
      <Link
        href={`/les-appartements/${apt.slug}`}
        className={cn(
          "group relative block h-full overflow-hidden rounded-[1.75rem]",
          "shadow-[0_22px_48px_-28px_rgba(15,42,46,0.55)] transition-[box-shadow,transform] duration-500",
          "hover:shadow-[0_32px_64px_-24px_rgba(15,42,46,0.7)]",
          "dark:shadow-[0_22px_48px_-24px_rgba(0,0,0,0.55)] dark:hover:shadow-[0_32px_64px_-20px_rgba(0,0,0,0.7)]",
          featured
            ? "min-h-[28rem] sm:min-h-[32rem] lg:aspect-[5/4] lg:min-h-0"
            : "aspect-[4/5] min-h-[22rem] sm:min-h-[24rem] lg:min-h-[26rem]"
        )}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="absolute inset-0"
          style={{ transform: "translateZ(0px)" }}
        >
          <MediaImage
            src={apt.image}
            alt={apt.type}
            fill
            sizes={
              featured
                ? "(min-width: 1024px) 70vw, 100vw"
                : "(min-width: 1280px) 18vw, (min-width: 1024px) 20vw, (min-width: 640px) 45vw, 100vw"
            }
            loaderSize="sm"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
        </div>

        {/* Voile lisibilité — plus dense en bas */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-allure-petrol-deep via-allure-petrol-deep/55 to-allure-petrol-deep/10"
          style={{ transform: "translateZ(8px)" }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-transparent opacity-80"
          style={{ transform: "translateZ(8px)" }}
        />

        <div
          className="absolute left-4 top-4 flex flex-wrap gap-2 sm:left-5 sm:top-5"
          style={{ transform: "translateZ(32px)" }}
        >
          <span className="rounded-full border border-white/20 bg-black/35 px-3 py-1.5 font-sans text-[10px] uppercase tracking-[0.14em] text-white backdrop-blur-md">
            {apt.surface}
          </span>
          {apt.price ? (
            <span className="rounded-full border border-allure-gold/35 bg-allure-gold/15 px-3 py-1.5 font-sans text-[10px] uppercase tracking-[0.12em] text-allure-gold backdrop-blur-md">
              {apt.price}
            </span>
          ) : null}
        </div>

        <div
          className={cn(
            "absolute inset-x-0 bottom-0 flex flex-col",
            featured
              ? "items-start p-6 sm:p-8 lg:max-w-xl"
              : "items-stretch p-5 sm:p-6"
          )}
          style={{ transform: "translateZ(40px)" }}
        >
          <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-white/55">
            Typologie
          </p>
          <p
            className={cn(
              "mt-1.5 font-heading leading-tight text-white",
              featured ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl"
            )}
          >
            {shortTitle(apt)}
          </p>
          <p
            className={cn(
              "mt-2 font-sans leading-relaxed text-white/75",
              featured
                ? "line-clamp-3 text-sm sm:text-[0.95rem]"
                : "line-clamp-2 text-xs sm:text-[0.8rem]"
            )}
          >
            {apt.desc}
          </p>

          {featured && apt.highlights.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {apt.highlights.map((h) => (
                <li
                  key={h}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1 font-sans text-[10px] uppercase tracking-[0.12em] text-white/85"
                >
                  {h}
                </li>
              ))}
            </ul>
          ) : null}

          <span
            className={cn(
              "mt-5 inline-flex items-center gap-1.5 self-start rounded-full bg-white px-5 py-2.5 font-sans text-xs font-medium text-allure-petrol transition-colors",
              "group-hover:bg-[color-mix(in_oklab,var(--allure-gold)_78%,var(--allure-petrol-deep))] group-hover:text-allure-petrol-deep"
            )}
          >
            Découvrir
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>
    </Tilt3D>
  );
}

export function ApartmentsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("all");
  useSectionReveal(sectionRef, { debugId: "apartments" });

  const items = useMemo(() => {
    if (tab === "all") return APARTMENTS;
    return APARTMENTS.filter((a) => a.slug === tab);
  }, [tab]);

  const featured = tab !== "all" && items.length === 1;

  return (
    <section
      ref={sectionRef}
      id="appartements"
      className="relative bg-allure-sand py-24 lg:py-32 dark:bg-allure-petrol"
      style={{ perspective: "1400px" }}
    >
      <SectionSeam edges="top" from={SEAM.petrolDeep} fromDark={SEAM.petrolDeep} />
      <div className="relative z-[2] mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-10">
        <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end lg:mb-12">
          <div className="max-w-2xl">
            <p
              data-reveal="eyebrow"
              className="font-sans text-xs uppercase tracking-[0.3em] text-allure-gold"
            >
              Projets & typologies
            </p>
            <h2
              data-split="lines,words"
              data-split-animate="words"
              className="mt-4 font-heading text-3xl text-allure-petrol sm:text-4xl lg:text-[2.75rem] lg:leading-tight dark:text-allure-sand"
            >
              Un design unique, cinq façons d&rsquo;habiter Allure
            </h2>
          </div>
          <div
            data-reveal="item"
            className="flex flex-wrap items-center gap-x-5 gap-y-2"
          >
            <Button
              asChild
              variant="ghost"
              className="px-0 text-allure-petrol hover:bg-transparent hover:text-allure-gold dark:text-allure-sand"
            >
              <Link href="/les-appartements">
                Toutes les fiches
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="px-0 text-allure-petrol hover:bg-transparent hover:text-allure-gold dark:text-allure-sand"
            >
              <Link href="/appartements-temoins">
                Appartements témoins
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div
          data-reveal="item"
          className="mb-8 flex flex-wrap gap-2 lg:mb-10"
          role="tablist"
          aria-label="Filtrer les typologies"
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "rounded-full px-4 py-2.5 font-sans text-xs uppercase tracking-[0.12em] transition-colors",
                tab === t.id
                  ? "bg-allure-petrol text-white dark:bg-[color-mix(in_oklab,var(--allure-gold)_72%,var(--allure-petrol-deep))] dark:text-allure-petrol-deep"
                  : "bg-white/80 text-allure-ink/55 hover:text-allure-petrol dark:bg-allure-petrol-deep/55 dark:text-allure-sand/55 dark:hover:bg-allure-petrol-deep/80 dark:hover:text-allure-sand"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div
          className={cn(
            "grid gap-7 sm:gap-8 lg:gap-9 xl:gap-10",
            featured
              ? "mx-auto max-w-4xl grid-cols-1"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
          )}
        >
          <AnimatePresence mode="popLayout">
            {items.map((apt, i) => (
              <motion.div
                key={apt.id}
                layout
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.45, delay: (i % 5) * 0.05 }}
                className="min-w-0"
              >
                <Apartment3DCard apt={apt} featured={featured} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div data-reveal="item" className="mt-12 lg:mt-16">
          <HomeCtaRow
            primary={{
              label: "Planifier une visite",
              href: "/rendez-vous?interest=typologie",
            }}
            secondary={{
              label: "Appartements témoins",
              href: "/appartements-temoins",
            }}
            tertiary={{
              label: "Catalogue complet",
              href: "/les-appartements",
            }}
          />
        </div>
      </div>
    </section>
  );
}
