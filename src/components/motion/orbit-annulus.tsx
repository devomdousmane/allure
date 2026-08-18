"use client";

import { gsap } from "gsap";
import { cn } from "@/lib/utils";

export type OrbitAnnulusProps = {
  label?: string;
  className?: string;
  sizeClass?: string;
  outerRef?: React.RefObject<HTMLDivElement | null>;
  innerRef?: React.RefObject<HTMLDivElement | null>;
  markerRef?: React.RefObject<HTMLSpanElement | null>;
};

/**
 * Anneau double Allure — même langage visuel que la section Vision.
 */
export function OrbitAnnulus({
  label,
  className,
  sizeClass = "h-[min(52vw,20rem)] w-[min(52vw,20rem)]",
  outerRef,
  innerRef,
  markerRef,
}: OrbitAnnulusProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        sizeClass,
        className
      )}
      aria-hidden
    >
      <div
        ref={outerRef}
        data-orbit-outer
        className="absolute inset-0 will-change-transform"
      >
        <span className="absolute inset-0 rounded-full border border-dashed border-allure-gold/35" />
        <span className="absolute top-0 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-allure-gold/70" />
      </div>

      <div
        ref={innerRef}
        data-orbit-inner
        className="absolute inset-[14%] will-change-transform"
      >
        <span className="absolute inset-0 rounded-full border border-allure-gold/20" />
        <span className="absolute bottom-[12%] right-[10%] size-1.5 rounded-full bg-allure-gold/50" />
      </div>

      <span
        ref={markerRef}
        data-orbit-marker
        className="absolute inset-0 will-change-transform"
      >
        <span className="absolute top-[22%] right-[6%] size-1 rounded-full bg-allure-gold/40" />
      </span>

      {label ? (
        <span className="relative z-[1] font-sans text-[10px] uppercase tracking-[0.42em] text-allure-gold/55">
          {label}
        </span>
      ) : null}
    </div>
  );
}

export type OrbitAnimConfig = {
  outer: [number, number];
  inner: [number, number];
  marker: [number, number];
  outerScale: [number, number];
  innerScale: [number, number];
  opacity: [number, number];
};

export const ORBIT_ANIM = {
  vision: {
    outer: [-120, 120],
    inner: [90, -90],
    marker: [-200, 200],
    outerScale: [0.9, 1.04],
    innerScale: [0.94, 1],
    opacity: [0.18, 0.45],
  },
  chantier: {
    outer: [-70, 70],
    inner: [50, -50],
    marker: [-110, 110],
    outerScale: [0.86, 1],
    innerScale: [0.9, 0.98],
    opacity: [0.12, 0.32],
  },
  facade: {
    outer: [100, -100],
    inner: [-75, 75],
    marker: [160, -160],
    outerScale: [0.88, 1.06],
    innerScale: [0.92, 1.03],
    opacity: [0.16, 0.38],
  },
  livraison: {
    outer: [-160, 160],
    inner: [120, -120],
    marker: [-240, 240],
    outerScale: [0.92, 1.08],
    innerScale: [0.96, 1.05],
    opacity: [0.22, 0.5],
  },
} satisfies Record<string, OrbitAnimConfig>;

export function applyOrbitProgress(
  root: HTMLElement,
  progress: number,
  config: OrbitAnimConfig
) {
  const outer = root.querySelector<HTMLElement>("[data-orbit-outer]");
  const inner = root.querySelector<HTMLElement>("[data-orbit-inner]");
  const marker = root.querySelector<HTMLElement>("[data-orbit-marker]");
  const p = gsap.utils.clamp(0, 1, progress);

  if (outer) {
    gsap.set(outer, {
      rotate: gsap.utils.interpolate(config.outer[0], config.outer[1], p),
      scale: gsap.utils.interpolate(config.outerScale[0], config.outerScale[1], p),
      opacity: gsap.utils.interpolate(config.opacity[0], config.opacity[1], p),
    });
  }
  if (inner) {
    gsap.set(inner, {
      rotate: gsap.utils.interpolate(config.inner[0], config.inner[1], p),
      scale: gsap.utils.interpolate(config.innerScale[0], config.innerScale[1], p),
    });
  }
  if (marker) {
    gsap.set(marker, {
      rotate: gsap.utils.interpolate(config.marker[0], config.marker[1], p),
    });
  }
}

/** Inverse le sens / amplitude pour un anneau secondaire en contrepoint. */
export function invertOrbitConfig(config: OrbitAnimConfig): OrbitAnimConfig {
  return {
    outer: [config.outer[1], config.outer[0]],
    inner: [config.inner[1], config.inner[0]],
    marker: [config.marker[1], config.marker[0]],
    outerScale: [config.outerScale[1], config.outerScale[0]],
    innerScale: [config.innerScale[1], config.innerScale[0]],
    opacity: [
      Math.max(0.08, config.opacity[0] * 0.7),
      Math.max(0.14, config.opacity[1] * 0.65),
    ],
  };
}
