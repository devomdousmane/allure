"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RefObject } from "react";
import { registerGsap } from "@/lib/gsap/register";
import {
  ORBIT_ANIM,
  applyOrbitProgress,
  invertOrbitConfig,
  type OrbitAnimConfig,
} from "@/components/motion/orbit-annulus";
import type { JourneyPanelId, OrbitVariant } from "./journey-data";

registerGsap();

const ORBIT_BY_ID: Record<JourneyPanelId, OrbitAnimConfig> = {
  chantier: ORBIT_ANIM.chantier,
  facade: ORBIT_ANIM.facade,
  livraison: ORBIT_ANIM.livraison,
};

type RevealMode = "none" | "wipe-y" | "iris";

/**
 * Fenêtre de scrub du reveal dans l’entrée du panel.
 * Démarre tard pour que le voile / iris soit visible une fois le panel engagé.
 */
const REVEAL_WINDOW: Record<Exclude<RevealMode, "none">, { start: number; end: number }> = {
  "wipe-y": { start: 0.52, end: 0.96 },
  iris: { start: 0.48, end: 0.92 },
};

function clipForReveal(mode: RevealMode, eased: number): string | null {
  if (mode === "wipe-y") {
    // Haut → bas : masque le bas jusqu’à ce que eased → 1
    const bottom = (1 - eased) * 100;
    return `inset(0% 0% ${bottom}% 0%)`;
  }
  if (mode === "iris") {
    // Rayon un peu plus lent au début pour garder l’effet lisible
    const r = Math.max(0, eased * 145);
    return `circle(${r}% at 50% 50%)`;
  }
  return null;
}

/** Mappe l’entrée 0→1 vers une fenêtre tardive (évite reveal déjà fini à mi-slide). */
function revealFromEntrance(entrance: number, mode: Exclude<RevealMode, "none">) {
  const { start, end } = REVEAL_WINDOW[mode];
  const span = Math.max(0.01, end - start);
  return gsap.utils.clamp(0, 1, (entrance - start) / span);
}

type UseHorizonScrollArgs = {
  sectionRef: RefObject<HTMLElement | null>;
  viewportRef: RefObject<HTMLDivElement | null>;
  trackRef: RefObject<HTMLDivElement | null>;
  enabled: boolean;
};

/**
 * Pin + scrub horizontal + anneaux OrbitAnnulus + reveals média (panels 2–3).
 *
 * Important : pas d’`anticipatePin` — il avance le pin et fait apparaître
 * Journey pendant encore Typologies (calcul / overlap).
 * Travel = clientWidth × (n − 1), créé seulement après layout stable.
 */
export function useHorizonScroll({
  sectionRef,
  viewportRef,
  trackRef,
  enabled,
}: UseHorizonScrollArgs) {
  useGSAP(
    () => {
      const section = sectionRef.current;
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!section || !viewport || !track || !enabled) return;

      const panels = gsap.utils.toArray<HTMLElement>(
        track.querySelectorAll("[data-journey-panel]")
      );
      if (panels.length < 2) return;

      const count = panels.length;
      let tween: gsap.core.Tween | null = null;
      let cancelled = false;
      // inOut : scrub lisible sur toute la fenêtre (évite open flash au début)
      const revealEase = gsap.parseEase("power1.inOut");

      const getTravel = () =>
        Math.max(0, Math.round(viewport.clientWidth) * (count - 1));

      const syncLayout = () => {
        gsap.set(track, { width: `${count * 100}%`, force3D: true });
        gsap.set(panels, {
          width: `${100 / count}%`,
          flexShrink: 0,
          height: "100%",
        });
      };

      const panelLocal = (p: number, i: number) => {
        const step = 1 / (count - 1);
        return gsap.utils.clamp(0, 1, (p - i * step) / step);
      };

      const syncOrbits = (p: number) => {
        panels.forEach((panel, i) => {
          const id = panel.dataset.journeyId as JourneyPanelId | undefined;
          const base = (id && ORBIT_BY_ID[id]) || ORBIT_ANIM.chantier;
          const local = panelLocal(p, i);

          panel
            .querySelectorAll<HTMLElement>("[data-journey-orbit]")
            .forEach((orbit) => {
              const variant = (orbit.dataset.orbitVariant ??
                "primary") as OrbitVariant;
              if (variant === "primary") {
                applyOrbitProgress(orbit, local, base);
                return;
              }
              if (variant === "echo") {
                applyOrbitProgress(orbit, local, invertOrbitConfig(base));
                return;
              }
              // ghost — progress décalé + sens inversé
              const shifted = gsap.utils.clamp(0, 1, local * 0.85 + 0.08);
              applyOrbitProgress(
                orbit,
                1 - shifted,
                invertOrbitConfig(base)
              );
            });
        });
      };

      /** Progress d’entrée du panel i (scrub pendant le slide depuis i−1). */
      const entranceLocal = (p: number, i: number) => {
        if (i === 0) return 1;
        const step = 1 / (count - 1);
        return gsap.utils.clamp(0, 1, (p - (i - 1) * step) / step);
      };

      const syncReveals = (p: number) => {
        panels.forEach((panel, i) => {
          const mode = (panel.dataset.reveal ?? "none") as RevealMode;
          const media = panel.querySelector<HTMLElement>("[data-journey-media]");
          const copy = panel.querySelector<HTMLElement>("[data-journey-copy]");
          if (!media || mode === "none") {
            if (media) gsap.set(media, { clearProps: "clipPath" });
            if (copy) gsap.set(copy, { clearProps: "opacity,y" });
            return;
          }

          const entrance = entranceLocal(p, i);
          const local = revealFromEntrance(entrance, mode);
          const eased = revealEase(local);
          const clip = clipForReveal(mode, eased);
          if (clip) gsap.set(media, { clipPath: clip });

          // Copy après ~35 % du reveal média
          const copyT = gsap.utils.clamp(0, 1, (local - 0.35) / 0.65);
          const copyEased = revealEase(copyT);
          gsap.set(copy, {
            opacity: copyEased,
            y: (1 - copyEased) * 18,
          });
        });
      };

      const syncAll = (p: number) => {
        syncOrbits(p);
        syncReveals(p);
      };

      const mount = () => {
        if (cancelled) return;

        ScrollTrigger.refresh();
        syncLayout();
        gsap.set(track, { x: 0 });
        syncAll(0);

        tween?.scrollTrigger?.kill();
        tween?.kill();

        tween = gsap.to(track, {
          x: () => -getTravel(),
          ease: "none",
          force3D: true,
          scrollTrigger: {
            id: "horizon-journey",
            trigger: section,
            start: "top top",
            end: () => `+=${getTravel()}`,
            pin: true,
            pinSpacing: true,
            scrub: true,
            invalidateOnRefresh: true,
            fastScrollEnd: true,
            refreshPriority: -1,
            onUpdate: (self) => {
              syncAll(self.progress);
            },
            onRefresh: (self) => {
              syncAll(self.progress);
            },
            onEnter: () => {
              gsap.set(section, { zIndex: 30 });
            },
            onEnterBack: () => {
              gsap.set(section, { zIndex: 30 });
            },
            onLeave: () => {
              gsap.set(section, { zIndex: "auto" });
            },
            onLeaveBack: () => {
              gsap.set(section, { zIndex: "auto" });
            },
          },
        });
      };

      let tDelay: number | undefined;
      const raf1 = requestAnimationFrame(() => {
        const raf2 = requestAnimationFrame(() => {
          tDelay = window.setTimeout(mount, 50);
        });
        void raf2;
      });

      const tRefresh = window.setTimeout(() => {
        if (!cancelled) ScrollTrigger.refresh();
      }, 600);

      return () => {
        cancelled = true;
        cancelAnimationFrame(raf1);
        if (tDelay) clearTimeout(tDelay);
        clearTimeout(tRefresh);
        tween?.scrollTrigger?.kill();
        tween?.kill();
        gsap.set(section, { clearProps: "zIndex" });
      };
    },
    { scope: sectionRef, dependencies: [enabled] }
  );
}
