"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { SectionSeam, SEAM } from "@/components/ui/section-seam";
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
  const reducedMotion = usePrefersReducedMotion();

  useSectionReveal(sectionRef, {
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
      <SectionSeam from={SEAM.white} fromDark={SEAM.petrolDeep} />

      <div className="relative min-h-[min(72vh,560px)] w-full sm:min-h-[min(70vh,640px)] lg:min-h-[min(75vh,720px)]">
        <div data-ken-burns className="absolute inset-0 will-change-transform">
          <Image
            src={POSTER_SRC}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            priority={false}
          />
        </div>

        {shouldLoad && reducedMotion !== true ? (
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
          />
        ) : null}

        <div className="absolute inset-0 bg-gradient-to-t from-allure-petrol-deep via-allure-petrol-deep/45 to-allure-petrol/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-allure-petrol-deep/50 via-transparent to-allure-petrol-deep/30" />

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
                className="btn-3d-gold h-12 w-full rounded-full bg-allure-gold text-allure-petrol-deep hover:bg-allure-gold/90 sm:w-auto"
              >
                <Link href="/avancement">
                  Voir l&rsquo;avancement
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>

              {reducedMotion !== true ? (
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={playing ? "Mettre en pause" : "Lire la vidéo"}
                  className={cn(
                    "inline-flex h-12 items-center justify-center gap-2 rounded-full border border-allure-sand/30 bg-allure-petrol-deep/40 px-5 font-sans text-xs uppercase tracking-[0.16em] text-allure-sand backdrop-blur-sm transition-colors hover:border-allure-gold/50 hover:text-allure-gold sm:w-auto"
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
