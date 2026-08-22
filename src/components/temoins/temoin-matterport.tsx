"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Box, Expand, Play } from "lucide-react";
import { MediaImage } from "@/components/ui/media-image";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import type { TemoinDetail } from "@/data/temoins";
import { cn } from "@/lib/utils";

type TemoinMatterportProps = {
  temoin: TemoinDetail;
  className?: string;
};

function matterportEmbedUrl(modelId: string) {
  const params = new URLSearchParams({
    m: modelId,
    play: "1",
    qs: "1",
    hr: "0",
  });
  return `https://my.matterport.com/show/?${params.toString()}`;
}

/**
 * Visite virtuelle Matterport — poster local + iframe au clic
 * (évite de charger Matterport tant que l’utilisateur n’a pas demandé).
 */
export function TemoinMatterportTour({
  temoin,
  className,
}: TemoinMatterportProps) {
  const tour = temoin.matterport;
  const [started, setStarted] = useState(false);
  const reduced = usePrefersReducedMotion();

  if (!tour) return null;

  const title =
    tour.title ?? `Visite virtuelle — ${temoin.typologyLabel}`;

  function start() {
    setStarted(true);
  }

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-allure-sand py-16 dark:bg-allure-petrol sm:py-24",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] dark:opacity-[0.12]"
        aria-hidden
      >
        <div className="absolute -left-1/4 top-0 size-[50%] rounded-full bg-allure-gold blur-3xl" />
        <div className="absolute -right-1/4 bottom-0 size-[40%] rounded-full bg-allure-petrol blur-3xl dark:bg-allure-sand" />
      </div>

      <div className="relative z-[1] mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-10">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
          <div className="max-w-md">
            <p className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.28em] text-allure-gold">
              <Box className="size-3.5" aria-hidden />
              Visite virtuelle
            </p>
            <h2 className="mt-3 font-heading text-3xl text-allure-petrol dark:text-allure-sand sm:text-4xl">
              Parcourir l’appartement en immersion
            </h2>
            <p className="mt-4 font-sans text-base leading-relaxed text-allure-ink/75 dark:text-allure-sand/80">
              Déplacez-vous librement dans le témoin — volumes, lumière et
              finitions, comme si vous y étiez. Idéal avant une visite sur
              place.
            </p>
            {started ? (
              <a
                href={matterportEmbedUrl(tour.modelId)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.18em] text-allure-gold transition-colors hover:text-allure-petrol dark:hover:text-allure-sand"
              >
                Ouvrir en plein écran
                <Expand className="size-3.5" aria-hidden />
              </a>
            ) : null}
          </div>

          <div className="relative aspect-video overflow-hidden rounded-[1.75rem] bg-allure-petrol-deep shadow-[0_32px_64px_-36px_rgba(30,75,93,0.55)] ring-1 ring-allure-petrol/10 dark:ring-white/10">
            {!started ? (
              <>
                <MediaImage
                  src={tour.poster}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover object-center"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-allure-petrol-deep/75 via-allure-petrol-deep/25 to-allure-petrol-deep/15" />
                <button
                  type="button"
                  onClick={start}
                  className="absolute inset-0 z-[2] flex cursor-pointer flex-col items-center justify-center gap-4 text-white"
                >
                  <span className="relative inline-flex size-20 items-center justify-center">
                    {reduced !== true ? (
                      <>
                        <motion.span
                          className="absolute inset-0 rounded-full border border-allure-gold/40"
                          animate={{ scale: [1, 1.35], opacity: [0.55, 0] }}
                          transition={{
                            duration: 2.2,
                            repeat: Infinity,
                            ease: "easeOut",
                          }}
                          aria-hidden
                        />
                        <motion.span
                          className="absolute inset-2 rounded-full border border-white/25"
                          animate={{ scale: [1, 1.2], opacity: [0.4, 0] }}
                          transition={{
                            duration: 2.2,
                            repeat: Infinity,
                            ease: "easeOut",
                            delay: 0.35,
                          }}
                          aria-hidden
                        />
                      </>
                    ) : null}
                    <span className="relative inline-flex size-16 items-center justify-center rounded-full border border-white/35 bg-allure-petrol-deep/70 text-white backdrop-blur-md transition hover:border-allure-gold/70 hover:text-allure-gold">
                      <Play
                        className="size-6 translate-x-0.5 fill-current"
                        strokeWidth={1.5}
                      />
                    </span>
                  </span>
                  <span className="font-sans text-xs uppercase tracking-[0.22em]">
                    Lancer la visite virtuelle
                  </span>
                </button>
              </>
            ) : (
              <iframe
                title={title}
                src={matterportEmbedUrl(tour.modelId)}
                className="absolute inset-0 h-full w-full border-0"
                allow="autoplay; fullscreen; web-share; xr-spatial-tracking"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
