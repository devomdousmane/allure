"use client";

import { useEffect, useRef, useState } from "react";
import { MediaImage } from "@/components/ui/media-image";
import Link from "next/link";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { HeroExitFade, SectionSeam, SEAM } from "@/components/ui/section-seam";
import { MediaLoader } from "@/components/ui/media-loader";
import { cn } from "@/lib/utils";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const VIDEO_SRC = "/video/Allure-construction-15s.mp4";
const POSTER_SRC = "/Allure/HD_137.webp";

export function ConstructionVideoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useSectionReveal(sectionRef, {
    debugId: "constructionVideo",
    onEnter: (root) => {
      if (reducedMotion === true) return;
      const poster = root.querySelector<HTMLElement>("[data-ken-burns]");
      if (!poster) return;
      gsap.fromTo(
        poster,
        { scale: 1.08 },
        { scale: 1, duration: 1.6, ease: "power2.out" }
      );
    },
  });

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setInView(visible);
        if (visible) setShouldLoad(true);
      },
      { rootMargin: "120px 0px", threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad || reducedMotion === true) return;

    if (inView) {
      video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      video.pause();
      setPlaying(false);
    }
  }, [inView, shouldLoad, reducedMotion]);

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
      ref={sectionRef}
      id="chantier"
      aria-labelledby="construction-video-heading"
      className="relative overflow-hidden bg-allure-petrol-deep"
    >
      <div className="relative min-h-[min(72vh,560px)] w-full sm:min-h-[min(70vh,640px)] lg:min-h-[min(75vh,720px)]">
        <div data-ken-burns className="absolute inset-0 will-change-transform">
          <MediaImage
            src={POSTER_SRC}
            alt=""
            fill
            sizes="100vw"
            loaderTone="gold"
            loaderSize="md"
            className="object-cover"
            priority={false}
          />
        </div>

        {shouldLoad && reducedMotion !== true ? (
          <>
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              src={VIDEO_SRC}
              muted
              loop
              playsInline
              preload="none"
              poster={POSTER_SRC}
              aria-label="Vidéo du chantier Résidence Allure"
              onCanPlay={() => setVideoReady(true)}
            />
            {!videoReady ? (
              <MediaLoader label="Chargement de la vidéo" />
            ) : null}
          </>
        ) : null}

        {/* Wash vidéo — bas opaque pour le texte ; haut transparent pour le fondu thème */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-allure-petrol-deep via-allure-petrol-deep/45 to-transparent dark:from-allure-petrol-deep dark:via-allure-petrol-deep/55 dark:to-allure-petrol-deep/30"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-allure-petrol-deep/35 via-transparent to-allure-petrol-deep/20 dark:from-allure-petrol-deep/50 dark:to-allure-petrol-deep/30"
        />

        {/* Haut : blanc ← services (clair) / pétrole ← services (sombre) */}
        <SectionSeam
          edges="top"
          from={SEAM.white}
          fromDark={SEAM.petrolDeep}
          className="h-28 sm:h-36"
        />
        {/* Bas : sable → amenities — fondu court en clair pour éviter le voile */}
        <HeroExitFade
          to={SEAM.sand}
          toDark={SEAM.petrol}
          className="h-20 min-h-0 sm:h-28 sm:min-h-0 dark:h-[28%] dark:min-h-32 dark:sm:min-h-40"
        />

        <div className="absolute inset-0 z-[2] mx-auto flex max-w-6xl flex-col justify-end px-5 pb-14 pt-24 sm:px-6 sm:pb-16 lg:pb-20">
          <div className="max-w-xl">
            <p
              data-reveal="eyebrow"
              className="font-sans text-xs uppercase tracking-[0.3em] text-allure-gold"
            >
              Chantier
            </p>
            <h2
              id="construction-video-heading"
              data-split="lines,words"
              data-split-animate="words"
              className="mt-3 font-heading text-3xl text-allure-sand sm:text-4xl lg:text-5xl"
            >
              Allure prend forme aux Almadies
            </h2>
            <p
              data-split="lines,words"
              data-split-animate="words"
              className="mt-4 max-w-md font-sans text-sm leading-relaxed text-allure-sand/70"
            >
              Un aperçu du chantier en images — transparence et suivi pour
              résidents comme pour la diaspora.
            </p>

            <div
              data-reveal="item"
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Button
                asChild
                size="lg"
                className="btn-cta w-full sm:w-auto"
              >
                <Link href="/avancement">
                  Voir l&rsquo;avancement
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full border-allure-sand/35 bg-transparent text-allure-sand hover:bg-white/10 hover:text-allure-sand sm:w-auto"
              >
                <Link href="/rendez-vous">Planifier une visite</Link>
              </Button>

              {reducedMotion !== true ? (
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={playing ? "Mettre en pause" : "Lire la vidéo"}
                  className={cn(
                    "inline-flex h-10 items-center justify-center gap-2 rounded-full border border-allure-sand/30 bg-allure-petrol-deep/40 px-5 font-sans text-xs uppercase tracking-[0.16em] text-allure-sand backdrop-blur-sm transition-colors hover:border-allure-gold/50 hover:text-allure-gold sm:h-11 sm:w-auto"
                  )}
                >
                  {playing ? (
                    <Pause className="size-3.5" strokeWidth={1.75} />
                  ) : (
                    <Play className="size-3.5" strokeWidth={1.75} />
                  )}
                  {playing ? "Pause" : "Lecture"}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
