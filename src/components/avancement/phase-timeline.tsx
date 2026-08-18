"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/lib/gsap/register";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import {
  AVANCEMENT_STATUS_LABEL,
  type AvancementPhase,
} from "@/lib/avancement";
import { PhaseGallery } from "@/components/avancement/phase-gallery";
import { cn } from "@/lib/utils";

registerGsap();

type PhaseTimelineProps = {
  phases: AvancementPhase[];
};

/**
 * Timeline scroll-telling — zigzag L/R, ligne scrubbée,
 * révélation séquencée des éléments au scroll.
 */
export function PhaseTimeline({ phases }: PhaseTimelineProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      const line = lineRef.current;
      if (!root || !line || reduced === null) return;

      const chapters = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll("[data-timeline-chapter]")
      );

      if (reduced) {
        gsap.set(line, { scaleY: 1 });
        gsap.set(
          root.querySelectorAll(
            "[data-story-index], [data-story-meta], [data-story-title], [data-story-text], [data-story-media], [data-story-gallery], [data-timeline-dot]"
          ),
          { clearProps: "all", autoAlpha: 1, x: 0, y: 0 }
        );
        return;
      }

      gsap.set(line, { scaleY: 0, transformOrigin: "top center" });

      gsap.to(line, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top 65%",
          end: "bottom 35%",
          scrub: 0.55,
        },
      });

      chapters.forEach((chapter, i) => {
        const fromLeft = i % 2 === 0;
        const copyX = fromLeft ? -72 : 72;
        const mediaX = fromLeft ? 72 : -72;

        const indexEl = chapter.querySelector<HTMLElement>("[data-story-index]");
        const meta = chapter.querySelectorAll<HTMLElement>("[data-story-meta]");
        const title = chapter.querySelector<HTMLElement>("[data-story-title]");
        const text = chapter.querySelector<HTMLElement>("[data-story-text]");
        const media = chapter.querySelector<HTMLElement>("[data-story-media]");
        const mediaImg = chapter.querySelector<HTMLElement>(
          "[data-story-media-img]"
        );
        const gallery = chapter.querySelector<HTMLElement>("[data-story-gallery]");
        const dot = chapter.querySelector<HTMLElement>("[data-timeline-dot]");

        gsap.set([indexEl, ...meta, title, text].filter(Boolean), {
          autoAlpha: 0,
          x: copyX,
        });
        gsap.set(media, {
          autoAlpha: 0,
          x: mediaX,
          clipPath: fromLeft
            ? "inset(0 0 0 18%)"
            : "inset(0 18% 0 0)",
        });
        if (mediaImg) gsap.set(mediaImg, { scale: 1.12 });
        gsap.set(gallery, { autoAlpha: 0, y: 48 });
        gsap.set(dot, { scale: 0.35, autoAlpha: 0.3 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: chapter,
            start: "top 78%",
            end: "top 18%",
            scrub: 0.75,
          },
        });

        if (dot) {
          tl.to(dot, { scale: 1, autoAlpha: 1, ease: "none", duration: 0.2 }, 0);
        }
        if (indexEl) {
          tl.to(
            indexEl,
            { autoAlpha: 1, x: 0, ease: "none", duration: 0.35 },
            0.05
          );
        }
        if (meta.length) {
          tl.to(
            meta,
            { autoAlpha: 1, x: 0, ease: "none", duration: 0.3, stagger: 0.04 },
            0.12
          );
        }
        if (title) {
          tl.to(
            title,
            { autoAlpha: 1, x: 0, ease: "none", duration: 0.4 },
            0.18
          );
        }
        if (text) {
          tl.to(
            text,
            { autoAlpha: 1, x: 0, ease: "none", duration: 0.35 },
            0.28
          );
        }
        if (media) {
          tl.to(
            media,
            {
              autoAlpha: 1,
              x: 0,
              clipPath: "inset(0 0% 0 0%)",
              ease: "none",
              duration: 0.5,
            },
            0.15
          );
        }
        if (mediaImg) {
          tl.to(
            mediaImg,
            { scale: 1, ease: "none", duration: 0.55 },
            0.15
          );
        }
        if (gallery) {
          tl.to(
            gallery,
            { autoAlpha: 1, y: 0, ease: "none", duration: 0.4 },
            0.55
          );
        }

        // Léger parallax image pendant le passage du chapitre
        if (mediaImg) {
          gsap.to(mediaImg, {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: chapter,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        }
      });
    },
    { scope: rootRef, dependencies: [reduced, phases] }
  );

  return (
    <div
      ref={rootRef}
      className="relative mx-auto max-w-7xl px-5 pb-6 pt-0 sm:px-6 lg:px-8"
    >
      {/* Axe central */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-5 w-px bg-allure-petrol/10 sm:left-6 lg:left-1/2 lg:-translate-x-px dark:bg-allure-sand/15"
      >
        <div
          ref={lineRef}
          className="h-full w-full origin-top bg-gradient-to-b from-allure-gold via-allure-petrol to-allure-gold dark:via-allure-sand/65"
        />
      </div>

      <ol className="relative">
        {phases.map((phase, index) => {
          const copyLeft = index % 2 === 0;

          return (
            <li
              key={phase.id}
              id={phase.id}
              data-timeline-chapter
              className="relative scroll-mt-36 py-8 sm:py-10 lg:py-12"
            >
              <span
                data-timeline-dot
                aria-hidden
                className="absolute top-10 left-5 z-[2] size-3 -translate-x-1/2 rounded-full bg-allure-gold ring-[5px] ring-white sm:left-6 lg:top-12 lg:left-1/2 dark:ring-allure-petrol-deep"
              />

              {/* Zigzag : copy ↔ média */}
              <div className="grid grid-cols-1 items-center gap-5 lg:grid-cols-2 lg:gap-10 xl:gap-12">
                {/* Colonne texte */}
                <div
                  className={cn(
                    "relative pl-8 sm:pl-10 lg:pl-0",
                    copyLeft
                      ? "lg:order-1 lg:pr-6 xl:pr-8 lg:text-right"
                      : "lg:order-2 lg:pl-6 xl:pl-8 lg:text-left"
                  )}
                >
                  <p
                    data-story-index
                    className="font-heading text-4xl tabular-nums leading-none text-allure-petrol/15 sm:text-5xl lg:text-6xl dark:text-allure-sand/15"
                  >
                    {phase.index}
                  </p>

                  <div
                    className={cn(
                      "mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1",
                      copyLeft ? "lg:justify-end" : "lg:justify-start"
                    )}
                  >
                    <p
                      data-story-meta
                      className="font-sans text-[10px] uppercase tracking-[0.28em] text-allure-gold"
                    >
                      Phase {phase.index}
                    </p>
                    <span
                      aria-hidden
                      className="hidden h-px w-6 bg-allure-gold/40 sm:block"
                    />
                    <p
                      data-story-meta
                      className="font-sans text-[10px] uppercase tracking-[0.22em] text-allure-ink/45 dark:text-allure-sand/45"
                    >
                      {AVANCEMENT_STATUS_LABEL[phase.status]}
                    </p>
                  </div>

                  <h3
                    data-story-title
                    className="mt-2 font-heading text-xl text-allure-petrol sm:text-2xl lg:text-[1.85rem] dark:text-allure-sand"
                  >
                    {phase.title}
                  </h3>
                  <p
                    data-story-text
                    className={cn(
                      "mt-2 max-w-md font-sans text-sm leading-relaxed text-allure-ink/60 dark:text-allure-sand/60",
                      copyLeft ? "lg:ml-auto" : "lg:mr-auto"
                    )}
                  >
                    {phase.subtitle}
                  </p>
                </div>

                {/* Colonne média */}
                <div
                  className={cn(
                    "relative pl-8 sm:pl-10 lg:pl-0",
                    copyLeft ? "lg:order-2" : "lg:order-1"
                  )}
                >
                  <div
                    data-story-media
                    className="relative aspect-[16/11] overflow-hidden bg-allure-petrol/5 dark:bg-allure-sand/5"
                  >
                    <div
                      data-story-media-img
                      className="absolute inset-0 will-change-transform"
                    >
                      <Image
                        src={phase.cover}
                        alt={phase.title}
                        fill
                        priority={index === 0}
                        sizes="(min-width: 1024px) 40vw, 90vw"
                        className="object-cover"
                      />
                    </div>
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-allure-petrol-deep/35 via-transparent to-transparent"
                    />
                    <span className="absolute bottom-4 left-4 font-sans text-[10px] uppercase tracking-[0.26em] text-white/85">
                      {phase.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Galerie — pleine largeur sous le duo */}
              <div
                data-story-gallery
                className="mt-5 pl-8 sm:mt-6 sm:pl-10 lg:mt-7 lg:pl-0"
              >
                <PhaseGallery
                  images={phase.images}
                  priorityFirst={index === 0}
                />
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
