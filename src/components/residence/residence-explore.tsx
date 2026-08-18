"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import {
  RESIDENCE_COPY,
  RESIDENCE_EXPLORE_SHOTS,
  RESIDENCE_EXPLORE_VIDEO,
} from "@/lib/residence";
import { cn } from "@/lib/utils";

/** EXPLORE — mosaïque pièces + bande vidéo lifestyle (video-2, 1080p). */
export function ResidenceExplore() {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const reduced = usePrefersReducedMotion();
  useSectionReveal(ref, { threshold: 0.12 });

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduced === true) return;
    video
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, [reduced]);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setPlaying(true)).catch(() => undefined);
    } else {
      video.pause();
      setPlaying(false);
    }
  }

  return (
    <section
      ref={ref}
      id="explore"
      className="bg-white py-16 dark:bg-allure-petrol-deep sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="max-w-xl">
          <p
            data-reveal="eyebrow"
            className="font-sans text-xs uppercase tracking-[0.3em] text-allure-gold"
          >
            {RESIDENCE_COPY.exploreEyebrow}
          </p>
          <h2
            data-split="lines,words"
            data-split-animate="words"
            className="mt-3 font-heading text-3xl text-allure-petrol dark:text-allure-sand sm:text-4xl lg:text-[2.75rem]"
          >
            {RESIDENCE_COPY.exploreTitle}
          </h2>
          <p
            data-reveal="text"
            className="mt-4 font-sans text-sm leading-relaxed text-allure-ink/65 dark:text-allure-sand/65"
          >
            {RESIDENCE_COPY.exploreBody}
          </p>
        </div>

        {/* Mosaïque — lien vers la visite guidée par dossier */}
        <div
          data-reveal="media"
          className="mt-12 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4 lg:grid-rows-2 lg:gap-3"
        >
          {RESIDENCE_EXPLORE_SHOTS.map((shot) => (
            <a
              key={shot.src}
              href={`/residence?piece=${shot.folder}#visite-guidee`}
              className={cn(
                "group relative overflow-hidden bg-allure-petrol/10 dark:bg-allure-sand/5",
                shot.span === "wide" && "col-span-2 aspect-[2/1] lg:aspect-auto",
                shot.span === "tall" &&
                  "aspect-[3/4] lg:row-span-2 lg:aspect-auto lg:min-h-0",
                !shot.span && "aspect-[4/3] lg:aspect-auto",
                shot.span === "wide" && "lg:col-span-2",
                shot.span !== "tall" && "lg:min-h-[220px]",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-allure-gold"
              )}
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-allure-petrol-deep/70 to-transparent px-3 py-3 font-sans text-[0.65rem] uppercase tracking-[0.18em] text-white/90">
                {shot.label}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Vidéo lifestyle plein cadre */}
      <div
        data-reveal="media"
        className="relative mt-14 aspect-[16/9] w-full overflow-hidden bg-allure-petrol-deep sm:mt-16 lg:mt-20 lg:aspect-[21/9]"
      >
        <Image
          src={RESIDENCE_EXPLORE_VIDEO.poster}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        {reduced !== true ? (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            src={RESIDENCE_EXPLORE_VIDEO.src}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            poster={RESIDENCE_EXPLORE_VIDEO.poster}
            aria-label="Visite immersive — intérieurs Résidence Allure"
          />
        ) : null}
        <div className="pointer-events-none absolute inset-0 bg-allure-petrol-deep/25" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-8">
          <p className="font-heading text-2xl text-white sm:text-3xl lg:text-4xl">
            Allure, en mouvement
          </p>
          {reduced !== true ? (
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? "Mettre en pause" : "Lire la vidéo"}
              className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-allure-petrol-deep/40 text-white backdrop-blur-sm transition-colors hover:border-allure-gold/50 hover:text-allure-gold"
            >
              {playing ? (
                <Pause className="size-4" strokeWidth={1.75} aria-hidden />
              ) : (
                <Play className="size-4" strokeWidth={1.75} aria-hidden />
              )}
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
