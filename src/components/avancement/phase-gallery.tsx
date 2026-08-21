"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Expand } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerGsap } from "@/lib/gsap/register";
import { DURATION, EASE, STAGGER } from "@/lib/gsap/presets";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import type { AvancementImage } from "@/lib/avancement";
import { cn } from "@/lib/utils";

registerGsap();

const MediaLightbox = dynamic(
  () =>
    import("@/components/avancement/media-lightbox").then(
      (m) => m.MediaLightbox
    ),
  { ssr: false }
);

type PhaseGalleryProps = {
  images: AvancementImage[];
  className?: string;
  /** Priorité sur la première vignette (phase 1) */
  priorityFirst?: boolean;
  /**
   * `faces` : remplit la box (`cover`) ancré en haut — têtes / visages
   * visibles sans lightbox, sans letterbox ni zoom/parallax.
   * (`contain` conservé en alias pour rétrocompat.)
   */
  fit?: "cover" | "faces" | "contain";
};

/** Placement bento (grille 6 colonnes desktop) */
function tilePlacement(index: number, total: number): string {
  if (total <= 1) return "col-span-6 aspect-[16/10]";
  if (total === 2) {
    return "col-span-6 sm:col-span-3 aspect-[16/11]";
  }
  if (total === 3) {
    if (index === 0)
      return "col-span-6 sm:col-span-4 sm:row-span-2 aspect-[4/3] sm:aspect-auto sm:min-h-[22rem]";
    return "col-span-3 sm:col-span-2 aspect-[4/3] sm:aspect-auto sm:min-h-[10.5rem]";
  }
  if (index === 0) {
    return "col-span-6 sm:col-span-4 sm:row-span-2 aspect-[4/3] sm:aspect-auto sm:min-h-[22rem]";
  }
  if (index === 1 || index === 2) {
    return "col-span-3 sm:col-span-2 aspect-[4/3] sm:aspect-auto sm:min-h-[10.5rem]";
  }
  const rest = total - 3;
  if (rest === 1) return "col-span-6 aspect-[16/9] sm:aspect-[21/9]";
  if (rest === 2) return "col-span-3 aspect-[4/3] sm:aspect-[16/10]";
  return "col-span-2 aspect-[4/3] sm:aspect-[16/11]";
}

/**
 * Galerie bento Avancement — reveal clip + stagger batch + parallax scrub.
 * Patterns : gsap-react (useGSAP) + gsap-scrolltrigger (batch / scrub).
 */
export function PhaseGallery({
  images,
  className,
  priorityFirst = false,
  fit = "cover",
}: PhaseGalleryProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const reduced = usePrefersReducedMotion();
  /** Événements / portraits : fill + ancrage haut, pas de crop agressif */
  const facesFit = fit === "faces" || fit === "contain";

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || reduced === null) return;

      const head = root.querySelector<HTMLElement>("[data-gallery-head]");
      const tiles = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll("[data-gallery-tile]")
      );
      const imgs = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll("[data-gallery-img]")
      );

      if (tiles.length === 0) return;

      if (reduced) {
        gsap.set([head, ...tiles, ...imgs].filter(Boolean), {
          clearProps: "all",
        });
        return;
      }

      const isNarrow = window.matchMedia("(max-width: 639px)").matches;

      if (head) {
        gsap.from(head, {
          autoAlpha: 0,
          y: 16,
          duration: DURATION.fast,
          ease: EASE.out,
          scrollTrigger: {
            trigger: root,
            start: "top 92%",
            toggleActions: "play none none reverse",
          },
        });
      }

      gsap.set(tiles, {
        autoAlpha: 0,
        y: isNarrow ? 24 : 40,
        clipPath: isNarrow ? "inset(6% 4% 6% 4%)" : "inset(14% 10% 14% 10%)",
      });
      // Faces : pas de zoom qui coupe le haut du cadre
      gsap.set(imgs, {
        scale: facesFit ? 1 : 1.16,
        transformOrigin: facesFit ? "50% 0%" : "50% 50%",
      });

      // Entrée orchestrée : batch ScrollTrigger (skill gsap-scrolltrigger)
      ScrollTrigger.batch(tiles, {
        start: "top 91%",
        interval: 0.12,
        batchMax: isNarrow ? 2 : 4,
        onEnter: (batch) => {
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: DURATION.base,
            stagger: STAGGER.items,
            ease: EASE.out,
            overwrite: "auto",
          });
          batch.forEach((tile) => {
            const img = tile.querySelector<HTMLElement>("[data-gallery-img]");
            if (!img || facesFit) return;
            gsap.to(img, {
              scale: 1,
              duration: DURATION.slow,
              ease: EASE.soft,
              overwrite: "auto",
            });
          });
        },
        onLeaveBack: (batch) => {
          gsap.to(batch, {
            autoAlpha: 0,
            y: 28,
            clipPath: "inset(10% 8% 10% 8%)",
            duration: 0.35,
            stagger: 0.04,
            ease: EASE.soft,
            overwrite: "auto",
          });
          batch.forEach((tile) => {
            const img = tile.querySelector<HTMLElement>("[data-gallery-img]");
            if (img && !facesFit) {
              gsap.to(img, { scale: 1.1, duration: 0.35, overwrite: "auto" });
            }
          });
        },
      });

      // Parallax scrub — désactivé en faces (évite de couper les têtes)
      if (!facesFit) {
        const parallaxAmp = isNarrow ? 6 : 12;
        imgs.forEach((img) => {
          const tile = img.closest<HTMLElement>("[data-gallery-tile]");
          if (!tile) return;
          gsap.fromTo(
            img,
            { yPercent: -parallaxAmp },
            {
              yPercent: parallaxAmp,
              ease: "none",
              scrollTrigger: {
                trigger: tile,
                start: "top bottom",
                end: "bottom top",
                scrub: isNarrow ? 0.9 : 0.55,
              },
            }
          );
        });
      }
    },
    {
      scope: rootRef,
      dependencies: [reduced, images, facesFit],
      revertOnUpdate: true,
    }
  );

  if (images.length === 0) return null;

  const total = images.length;

  return (
    <>
      <div ref={rootRef} className={cn("relative", className)}>
        <div
          data-gallery-head
          className="mb-3 flex items-baseline justify-between gap-3"
        >
          <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-allure-gold">
            Galerie chantier
          </p>
          <p className="font-sans text-[10px] tabular-nums tracking-[0.18em] text-allure-ink/40 dark:text-allure-sand/40">
            {String(total).padStart(2, "0")} vues
          </p>
        </div>

        <ul className="grid grid-cols-6 gap-2 sm:gap-3">
          {images.map((image, i) => {
            const featured = i === 0 && total >= 3;
            return (
              <li
                key={image.src}
                data-gallery-tile
                className={cn(
                  "relative min-h-0 overflow-hidden",
                  tilePlacement(i, total)
                )}
              >
                <button
                  type="button"
                  onClick={() => {
                    setIndex(i);
                    setOpen(true);
                  }}
                  className="group relative h-full min-h-[7.5rem] w-full cursor-pointer overflow-hidden bg-allure-petrol/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-allure-gold dark:bg-allure-sand/5"
                  aria-label={`Agrandir : ${image.alt}`}
                >
                  <span className="absolute inset-0 overflow-hidden">
                    <span
                      data-gallery-img
                      className={cn(
                        "absolute will-change-transform",
                        facesFit ? "inset-0" : "inset-[-12%]"
                      )}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes={
                          featured
                            ? "(min-width: 640px) 40vw, 90vw"
                            : "(min-width: 640px) 20vw, 45vw"
                        }
                        priority={priorityFirst && i === 0}
                        className={cn(
                          "object-cover object-top transition-transform duration-700 ease-out motion-reduce:transition-none",
                          !facesFit &&
                            "group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
                        )}
                      />
                    </span>
                  </span>

                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-allure-petrol-deep/70 via-allure-petrol-deep/10 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-95"
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-allure-petrol-deep/0 transition-colors duration-300 group-hover:bg-allure-petrol-deep/20"
                  />

                  <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 sm:p-3.5">
                    <span className="font-sans text-[10px] tabular-nums tracking-[0.2em] text-white/75">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="inline-flex size-8 translate-y-1 items-center justify-center rounded-full bg-white/10 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100">
                      <Expand className="size-3.5" aria-hidden />
                    </span>
                  </span>

                  {featured ? (
                    <span className="pointer-events-none absolute top-3 left-3 max-w-[70%] truncate font-sans text-[10px] uppercase tracking-[0.22em] text-allure-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:opacity-100 sm:opacity-90">
                      Vue principale
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <MediaLightbox
        images={images}
        index={index}
        open={open}
        onClose={() => setOpen(false)}
        onIndexChange={setIndex}
      />
    </>
  );
}
