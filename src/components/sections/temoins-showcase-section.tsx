"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight, Play, Sparkles } from "lucide-react";
import { MediaImage } from "@/components/ui/media-image";
import { Button } from "@/components/ui/button";
import { Tilt3D } from "@/components/motion/tilt-3d";
import { SectionSeam, SEAM } from "@/components/ui/section-seam";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import { TEMOINS } from "@/data/temoins";
import { TEMOIN_MEDIA } from "@/lib/media";
import { cn } from "@/lib/utils";

const HIGHLIGHTS = [
  { label: "Galerie pièce à pièce", value: "20+" },
  { label: "Visite 3D", value: "HD" },
  { label: "Showroom", value: "RDV" },
] as const;

/**
 * Bandeau home — met en avant les appartements témoins (immersif + conversion).
 */
export function TemoinsShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  useSectionReveal(sectionRef, { debugId: "apartments" });

  const { scrollYProgress } = useScroll({
    target: mediaRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1, 1.04]);

  return (
    <section
      ref={sectionRef}
      id="appartements-temoins-home"
      className="relative overflow-hidden bg-allure-sand py-24 text-allure-petrol lg:py-32 dark:bg-allure-petrol-deep dark:text-allure-sand"
    >
      <SectionSeam edges="top" from={SEAM.white} fromDark={SEAM.petrol} />

      <div
        ref={mediaRef}
        className="pointer-events-none absolute inset-0 opacity-35 dark:opacity-40"
        aria-hidden
      >
        <motion.div style={{ y, scale }} className="absolute inset-0">
          <MediaImage
            src={TEMOIN_MEDIA.salon1}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            showLoader={false}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-allure-sand via-allure-sand/88 to-allure-sand dark:from-allure-petrol-deep dark:via-allure-petrol-deep/85 dark:to-allure-petrol-deep" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,color-mix(in_oklab,var(--allure-gold)_14%,transparent),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_30%_20%,color-mix(in_oklab,var(--allure-gold)_18%,transparent),transparent_55%)]" />
      </div>

      <div className="relative z-[2] mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-10">
        <div className="grid items-end gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <p
              data-reveal="eyebrow"
              className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.3em] text-allure-gold"
            >
              <Sparkles className="size-3.5" aria-hidden />
              Expérience immersive
            </p>
            <h2
              data-split="lines,words"
              data-split-animate="words"
              className="mt-5 max-w-xl font-heading text-3xl leading-tight text-allure-petrol sm:text-4xl lg:text-5xl dark:text-white"
            >
              Habitez Allure avant même la livraison
            </h2>
            <p
              data-split="lines,words"
              data-split-animate="words"
              className="mt-5 max-w-md font-sans text-sm leading-relaxed text-allure-ink/65 dark:text-white/65"
            >
              Les appartements témoins vous montrent les volumes, la lumière et
              les finitions — en galerie et en visite 3D. Le meilleur moyen de
              se projeter, puis de réserver une visite sur place.
            </p>

            <ul
              data-reveal="item"
              className="mt-8 flex flex-wrap gap-3"
            >
              {HIGHLIGHTS.map((h) => (
                <li
                  key={h.label}
                  className="rounded-full border border-allure-petrol/12 bg-white/70 px-4 py-2 backdrop-blur-sm dark:border-white/15 dark:bg-white/5"
                >
                  <span className="font-heading text-sm text-allure-gold">
                    {h.value}
                  </span>
                  <span className="ml-2 font-sans text-[10px] uppercase tracking-[0.14em] text-allure-ink/50 dark:text-white/55">
                    {h.label}
                  </span>
                </li>
              ))}
            </ul>

            <div data-reveal="item" className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="btn-cta">
                <Link href="/appartements-temoins">
                  Voir les témoins
                  <ArrowUpRight className="size-4" aria-hidden />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-allure-petrol/25 bg-transparent text-allure-petrol hover:bg-allure-petrol/5 dark:border-white/25 dark:text-white dark:hover:bg-white/10"
              >
                <Link href="/rendez-vous?type=showroom">
                  Planifier une visite
                </Link>
              </Button>
            </div>
          </div>

          <div
            data-reveal="media"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            {TEMOINS.map((temoin, i) => (
              <Tilt3D
                key={temoin.slug}
                maxDeg={9}
                glare
                className={cn(
                  "rounded-[1.5rem]",
                  i === 1 && "sm:mt-10"
                )}
              >
                <Link
                  href={`/appartements-temoins/${temoin.slug}`}
                  className="group relative block overflow-hidden rounded-[1.5rem] ring-1 ring-allure-petrol/10 dark:ring-white/10"
                >
                  <div className="relative aspect-[4/5] min-h-[16rem]">
                    <MediaImage
                      src={temoin.heroImage}
                      alt={temoin.name}
                      fill
                      sizes="(min-width: 1024px) 22vw, 45vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent dark:from-allure-petrol-deep dark:via-allure-petrol-deep/40" />
                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/20 bg-black/35 px-3 py-1 font-sans text-[10px] uppercase tracking-[0.14em] text-white backdrop-blur-md">
                        {temoin.typologyLabel}
                      </span>
                      {temoin.video ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-allure-gold/40 bg-allure-gold/15 px-2.5 py-1 font-sans text-[10px] uppercase tracking-[0.12em] text-allure-gold backdrop-blur-md">
                          <Play className="size-2.5 fill-current" aria-hidden />
                          3D
                        </span>
                      ) : temoin.mediaFinal ? null : (
                        <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 font-sans text-[10px] uppercase tracking-[0.12em] text-white/70 backdrop-blur-md">
                          Bientôt
                        </span>
                      )}
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p className="font-heading text-xl text-white">
                        {temoin.typologyLabel}
                      </p>
                      <p className="mt-1 line-clamp-2 font-sans text-xs text-white/65">
                        {temoin.description}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 font-sans text-xs uppercase tracking-[0.14em] text-allure-gold transition-transform group-hover:translate-x-0.5">
                        Explorer
                        <ArrowUpRight className="size-3.5" aria-hidden />
                      </span>
                    </div>
                  </div>
                </Link>
              </Tilt3D>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
