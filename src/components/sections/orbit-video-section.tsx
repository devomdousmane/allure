"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { MediaImage } from "@/components/ui/media-image";
import { HeroExitFade, SectionSeam, SEAM } from "@/components/ui/section-seam";
import { MediaLoader } from "@/components/ui/media-loader";
import { registerGsap } from "@/lib/gsap/register";
import { EASE } from "@/lib/gsap/presets";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

registerGsap();

const VIDEO_SRC = "/video/frame-videos/video-3.mp4";
const POSTER_SRC = "/media/hero-cinematic/frame_088.webp";

/**
 * Pont Vision → Offre : vidéo d’approche (comme le chantier),
 * panneau droit qui s’ouvre en rideau, puis parallax du texte.
 */
export function OrbitVideoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const asideRef = useRef<HTMLElement>(null);
  const ruleRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setInView(visible);
        if (visible) setShouldLoad(true);
      },
      { rootMargin: "160px 0px", threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad || reduced === true) return;

    if (inView) {
      video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [inView, shouldLoad, reduced]);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const stage = stageRef.current;
      const media = mediaRef.current;
      const aside = asideRef.current;
      const rule = ruleRef.current;
      const inner = innerRef.current;
      if (!section || !stage || !media || !aside || !rule || !inner || reduced === null) {
        return;
      }

      if (reduced === true) {
        gsap.set(aside, { clipPath: "none", clearProps: "transform" });
        gsap.set([rule, inner], { autoAlpha: 1, y: 0, scaleY: 1 });
        gsap.set(media, { scale: 1 });
        return;
      }

      gsap.set(media, { scale: 1.08 });
      gsap.set(aside, { clipPath: "inset(12% 0% 12% 0%)" });
      gsap.set(rule, { scaleY: 0, transformOrigin: "center" });
      gsap.set(inner, { autoAlpha: 0, y: 28 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      tl.to(media, { scale: 1, duration: 1 }, 0);
      tl.to(
        aside,
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.28, ease: EASE.soft },
        0.32
      );
      tl.to(rule, { scaleY: 1, duration: 0.2, ease: EASE.soft }, 0.36);
      tl.to(
        inner,
        { autoAlpha: 1, y: 0, duration: 0.2, ease: EASE.soft },
        0.42
      );
      tl.to(inner, { yPercent: -8, duration: 0.38 }, 0.62);

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { dependencies: [reduced] }
  );

  return (
    <section
      ref={sectionRef}
      id="orbite"
      aria-labelledby="orbit-video-heading"
      className="relative bg-allure-sand dark:bg-allure-petrol-deep"
    >
      <div className="relative h-[175vh] lg:h-[190vh]">
        <div
          ref={stageRef}
          className="sticky top-0 h-dvh overflow-hidden"
        >
          <div
            ref={mediaRef}
            className="absolute inset-0 origin-center will-change-transform"
          >
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

            {shouldLoad && reduced !== true ? (
              <>
                <video
                  ref={videoRef}
                  className="absolute inset-0 z-[1] h-full w-full object-cover"
                  src={VIDEO_SRC}
                  muted
                  loop
                  playsInline
                  preload="none"
                  poster={POSTER_SRC}
                  aria-label="Approche cinématique de la Résidence Allure"
                  onCanPlay={() => setVideoReady(true)}
                />
                {!videoReady ? (
                  <MediaLoader label="Chargement de la vidéo" />
                ) : null}
              </>
            ) : null}
          </div>

          <div
            aria-hidden
            className="absolute inset-0 z-[2] bg-gradient-to-t from-allure-sand/50 via-transparent to-allure-sand/15 dark:from-allure-petrol-deep/55 dark:to-allure-petrol-deep/20"
          />

          <SectionSeam
            edges="top"
            from={SEAM.white}
            fromDark={SEAM.petrolDeep}
            className="h-24 sm:h-32"
          />
          <HeroExitFade
            compact
            to={SEAM.white}
            toDark={SEAM.petrolDeep}
          />

          <div
            className={cn(
              "pointer-events-none absolute inset-0 z-[4] flex items-end justify-end",
              "lg:items-stretch"
            )}
          >
            <aside
              ref={asideRef}
              className={cn(
                "pointer-events-auto flex h-[58%] w-full will-change-[clip-path]",
                "bg-allure-sand/86 backdrop-blur-md dark:bg-allure-petrol-deep/72",
                "sm:h-[62%] lg:h-full lg:w-[min(42rem,46vw)] xl:w-[min(46rem,42vw)]"
              )}
            >
              <span
                ref={ruleRef}
                aria-hidden
                className="w-px shrink-0 origin-top bg-allure-gold/80"
              />
              <div
                ref={innerRef}
                className="flex flex-1 flex-col justify-end px-7 py-10 sm:px-10 sm:py-12 lg:justify-center lg:px-14 lg:py-20 xl:px-16"
              >
                <p className="font-sans text-[11px] uppercase tracking-[0.34em] text-allure-gold sm:text-xs">
                  Architecture
                </p>
                <h2
                  id="orbit-video-heading"
                  className="mt-5 max-w-lg font-heading text-4xl leading-[1.12] text-allure-petrol sm:text-5xl lg:text-6xl xl:text-[4.25rem] dark:text-allure-sand"
                >
                  Le geste
                </h2>
                <p className="mt-6 max-w-md font-sans text-base leading-relaxed text-allure-ink/70 sm:text-lg dark:text-allure-sand/75">
                  La silhouette se lit d’un seul regard — verticale, lumineuse,
                  ouverte sur le ciel des Almadies.
                </p>
                <dl className="mt-10 flex gap-12 sm:mt-12 sm:gap-16">
                  <div>
                    <dt className="font-sans text-[11px] uppercase tracking-[0.22em] text-allure-petrol/45 dark:text-allure-sand/45">
                      Niveaux
                    </dt>
                    <dd className="mt-2 font-heading text-4xl tabular-nums text-allure-petrol sm:text-5xl dark:text-allure-sand">
                      14
                    </dd>
                  </div>
                  <div>
                    <dt className="font-sans text-[11px] uppercase tracking-[0.22em] text-allure-petrol/45 dark:text-allure-sand/45">
                      Lieu
                    </dt>
                    <dd className="mt-2 font-heading text-4xl text-allure-petrol sm:text-5xl dark:text-allure-sand">
                      Almadies
                    </dd>
                  </div>
                </dl>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
