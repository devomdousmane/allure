import gsap from "gsap";

export const EASE = {
  out: "power3.out",
  soft: "power2.out",
} as const;

export const DURATION = {
  fast: 0.55,
  base: 0.85,
  reveal: 0.95,
  slow: 1.1,
} as const;

export const STAGGER = {
  chars: 0.02,
  words: 0.04,
  lines: 0.08,
  items: 0.09,
} as const;

type TweenVars = gsap.TweenVars;

/** Fade + rise from below (use with timeline.from). */
export function fadeUp(vars: TweenVars = {}): TweenVars {
  return {
    opacity: 0,
    y: 28,
    duration: DURATION.base,
    ease: EASE.out,
    ...vars,
  };
}

/** Stagger children with fadeUp defaults. */
export function staggerFrom(
  amount = STAGGER.items
): { amount: number; from: "start" } {
  return { amount, from: "start" };
}

/** Soft vertical parallax scrub. */
export function parallaxY(distance = 48): TweenVars {
  return {
    y: distance,
    ease: "none",
  };
}

/** Perspective 3D légère pour cartes / dossiers (CSS transform). */
export const TILT_3D = {
  maxDeg: 8,
  scale: 1.02,
  perspective: 900,
  spring: { type: "spring" as const, stiffness: 260, damping: 22 },
} as const;

/** Durées micro-UI Motion (ms) — alignées skill UX 150–300. */
export const MOTION_UI = {
  fast: 0.18,
  base: 0.28,
  soft: 0.4,
} as const;
