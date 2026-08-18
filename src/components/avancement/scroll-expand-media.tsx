"use client";

import { useRef, type ReactNode } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/lib/gsap/register";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { SectionSharp, SHARP } from "@/components/ui/section-sharp";
import { HeroExitFade } from "@/components/ui/section-seam";
import { cn } from "@/lib/utils";

registerGsap();

type ScrollExpandMediaProps = {
  mediaType?: "video" | "image";
  mediaSrc: string;
  posterSrc?: string;
  /** Image de fond (ou poster sous la vidéo de fond) */
  bgImageSrc: string;
  /** Vidéo plein écran en fond — le média expansible reste au-dessus */
  bgVideoSrc?: string;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  children?: ReactNode;
  className?: string;
  /** Distance de scroll pendant le pin */
  pinDistance?: string;
  /** Jonction bas → section suivante */
  sharpTo?: string;
  sharpToDark?: string;
  sharpVariant?: "chevron" | "angle" | "fold";
};

/**
 * Scroll-to-expand média — adapté Allure (GSAP pin/scrub, compatible Lenis).
 * Le média grandit du centre vers le plein cadre ; le titre se sépare latéralement.
 * Option : vidéo en fond d’écran, image expansible par-dessus.
 */
export function ScrollExpandMedia({
  mediaType = "image",
  mediaSrc,
  posterSrc = "",
  bgImageSrc,
  bgVideoSrc = "",
  title = "",
  date,
  scrollToExpand = "Scroller pour explorer",
  textBlend = false,
  children,
  className,
  pinDistance = "+=115%",
  sharpTo = SHARP.petrolDeep,
  sharpToDark = SHARP.petrolDeep,
  sharpVariant = "fold",
}: ScrollExpandMediaProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const words = title.trim().split(/\s+/).filter(Boolean);
  const firstWord = words[0] ?? "";
  const restOfTitle = words.slice(1).join(" ");

  // Toujours la même longueur — évite l’erreur useLayoutEffect au HMR
  const motionKey = `${reduced}|${mediaType}|${mediaSrc}|${bgImageSrc}|${bgVideoSrc}|${posterSrc}|${pinDistance}|${title}`;

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || reduced === null) return;

      const stage = root.querySelector<HTMLElement>("[data-expand-stage]");
      const media = root.querySelector<HTMLElement>("[data-expand-media]");
      const bg = root.querySelector<HTMLElement>("[data-expand-bg]");
      const bgDim = root.querySelector<HTMLElement>("[data-expand-bg-dim]");
      const veil = root.querySelector<HTMLElement>("[data-expand-veil]");
      const titleL = root.querySelector<HTMLElement>("[data-expand-title-l]");
      const titleR = root.querySelector<HTMLElement>("[data-expand-title-r]");
      const dateEl = root.querySelector<HTMLElement>("[data-expand-date]");
      const hint = root.querySelector<HTMLElement>("[data-expand-hint]");
      const content = root.querySelector<HTMLElement>("[data-expand-content]");

      if (!stage || !media) return;

      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      const startW = isMobile ? 220 : 300;
      const startH = isMobile ? 300 : 400;
      const endW = isMobile ? Math.min(window.innerWidth * 0.95, 700) : Math.min(window.innerWidth * 0.92, 1280);
      const endH = isMobile
        ? Math.min(window.innerHeight * 0.62, 520)
        : Math.min(window.innerHeight * 0.78, 720);
      const splitX = isMobile ? "42vw" : "28vw";

      if (reduced === true) {
        gsap.set(media, {
          width: endW,
          height: endH,
          borderRadius: 0,
        });
        // Vidéo de fond : on la garde visible ; sinon on masque l’image de fond
        if (!bgVideoSrc) gsap.set(bg, { autoAlpha: 0 });
        else gsap.set(bgDim, { autoAlpha: 0.55 });
        gsap.set(veil, { autoAlpha: 0.15 });
        gsap.set([titleL, titleR, dateEl, hint], { autoAlpha: 0 });
        gsap.set(content, { autoAlpha: 1 });
        return;
      }

      gsap.set(media, {
        width: startW,
        height: startH,
        borderRadius: 4,
      });
      gsap.set(bg, { autoAlpha: 1 });
      gsap.set(bgDim, { autoAlpha: 0.35 });
      gsap.set(veil, { autoAlpha: 0.45 });
      gsap.set(content, { autoAlpha: 0, y: 28 });
      gsap.set([titleL, titleR, dateEl, hint], { x: 0, autoAlpha: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: pinDistance,
          pin: stage,
          scrub: 0.65,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(
        media,
        {
          width: endW,
          height: endH,
          borderRadius: 0,
          ease: "none",
          duration: 1,
        },
        0
      );
      // Fond image : fade out. Fond vidéo : reste, on assombrit un peu.
      if (bgVideoSrc) {
        if (bgDim) {
          tl.to(bgDim, { autoAlpha: 0.55, ease: "none", duration: 1 }, 0);
        }
      } else if (bg) {
        tl.to(bg, { autoAlpha: 0, ease: "none", duration: 0.85 }, 0);
      }
      if (veil) tl.to(veil, { autoAlpha: 0.12, ease: "none", duration: 1 }, 0);
      if (titleL) {
        tl.to(
          titleL,
          { x: `-${splitX}`, autoAlpha: 0.15, ease: "none", duration: 1 },
          0
        );
      }
      if (titleR) {
        tl.to(
          titleR,
          { x: splitX, autoAlpha: 0.15, ease: "none", duration: 1 },
          0
        );
      }
      if (dateEl) {
        tl.to(
          dateEl,
          { x: `-${splitX}`, autoAlpha: 0, ease: "none", duration: 0.9 },
          0
        );
      }
      if (hint) {
        tl.to(
          hint,
          { x: splitX, autoAlpha: 0, ease: "none", duration: 0.9 },
          0
        );
      }
      if (content) {
        tl.to(
          content,
          { autoAlpha: 1, y: 0, ease: "none", duration: 0.35 },
          0.72
        );
      }
    },
    {
      scope: rootRef,
      dependencies: [motionKey],
    }
  );

  return (
    <div
      ref={rootRef}
      className={cn("relative overflow-x-hidden bg-allure-petrol-deep", className)}
    >
      <div
        data-expand-stage
        className="relative flex min-h-[100dvh] flex-col items-center justify-start"
      >
        <div className="relative flex min-h-[100dvh] w-full flex-col items-center">
          {/* Fond — vidéo plein écran ou image */}
          <div
            data-expand-bg
            className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
          >
            <Image
              src={bgImageSrc}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            {bgVideoSrc && reduced !== true ? (
              <video
                src={bgVideoSrc}
                poster={bgImageSrc || posterSrc || undefined}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="absolute inset-0 h-full w-full object-cover"
                aria-hidden
              />
            ) : null}
            <div
              data-expand-bg-dim
              className="absolute inset-0 bg-allure-petrol-deep/35"
            />
          </div>

          <div className="relative z-10 flex w-full max-w-[100rem] flex-col items-center px-4">
            <div className="relative flex h-[100dvh] w-full items-center justify-center">
              {/* Média expansible */}
              <div
                data-expand-media
                className="absolute top-1/2 left-1/2 z-[1] -translate-x-1/2 -translate-y-1/2 overflow-hidden will-change-[width,height]"
                style={{
                  boxShadow: "0 24px 60px -28px rgba(0,0,0,0.55)",
                }}
              >
                {mediaType === "video" ? (
                  <video
                    src={mediaSrc}
                    poster={posterSrc}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover"
                    controls={false}
                    disablePictureInPicture
                    aria-label={title ?? "Vidéo chantier"}
                  />
                ) : (
                  <Image
                    src={mediaSrc}
                    alt={title ?? "Chantier Résidence Allure"}
                    fill
                    priority
                    sizes="(min-width: 768px) 90vw, 95vw"
                    className="object-cover"
                  />
                )}
                <div
                  data-expand-veil
                  className="pointer-events-none absolute inset-0 bg-allure-petrol-deep/40"
                />
              </div>

              {/* Titre split */}
              <div
                className={cn(
                  "pointer-events-none relative z-10 flex w-full flex-col items-center justify-center gap-2 text-center sm:gap-3",
                  textBlend ? "mix-blend-difference" : "mix-blend-normal"
                )}
              >
                {(date || scrollToExpand) && (
                  <div className="mb-2 flex w-full flex-col items-center gap-1 sm:mb-4">
                    {date ? (
                      <p
                        data-expand-date
                        className="font-sans text-xs uppercase tracking-[0.28em] text-allure-gold sm:text-sm"
                      >
                        {date}
                      </p>
                    ) : null}
                    {scrollToExpand ? (
                      <p
                        data-expand-hint
                        className="font-sans text-[10px] uppercase tracking-[0.22em] text-allure-sand/70 sm:text-xs"
                      >
                        {scrollToExpand}
                      </p>
                    ) : null}
                  </div>
                )}

                {firstWord ? (
                  <h1 className="flex w-full flex-col items-center gap-1 sm:gap-2">
                    <span
                      data-expand-title-l
                      className="font-heading text-4xl leading-none text-allure-sand sm:text-5xl lg:text-6xl xl:text-7xl"
                    >
                      {firstWord}
                    </span>
                    {restOfTitle ? (
                      <span
                        data-expand-title-r
                        className="font-heading text-4xl leading-none text-allure-sand sm:text-5xl lg:text-6xl xl:text-7xl"
                      >
                        {restOfTitle}
                      </span>
                    ) : null}
                  </h1>
                ) : null}
              </div>
            </div>

            {/* Contenu sous le pin (révélé en fin d’expand) */}
            <div
              data-expand-content
              className="relative z-10 w-full px-2 pb-16 opacity-0 sm:px-6 sm:pb-20 lg:pb-24"
            >
              {children}
            </div>
          </div>

          <HeroExitFade
            to={sharpTo}
            toDark={sharpToDark}
            className="h-24 min-h-0 sm:h-32 sm:min-h-0 dark:h-[22%] dark:min-h-24 dark:sm:min-h-32"
          />
          <SectionSharp
            edge="bottom"
            fill={sharpTo}
            fillDark={sharpToDark}
            variant={sharpVariant}
          />
        </div>
      </div>
    </div>
  );
}
