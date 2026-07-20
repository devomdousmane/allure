"use client";

import SplitType from "split-type";
import gsap from "gsap";
import { DURATION, EASE, STAGGER } from "@/lib/gsap/presets";

export type SplitKinds = "lines" | "words" | "chars" | "lines,words" | "words,chars";

export type SplitRevealOptions = {
  types?: SplitKinds;
  /** Animate lines | words | chars (defaults to most granular in types) */
  animate?: "lines" | "words" | "chars";
  y?: number;
  duration?: number;
  stagger?: number;
  ease?: string;
};

type TweenVars = gsap.TweenVars;

function pickAnimate(
  types: SplitKinds,
  animate?: SplitRevealOptions["animate"]
): "lines" | "words" | "chars" {
  if (animate) return animate;
  if (types.includes("chars")) return "chars";
  if (types.includes("words")) return "words";
  return "lines";
}

function defaultStagger(unit: "lines" | "words" | "chars") {
  if (unit === "chars") return STAGGER.chars;
  if (unit === "words") return STAGGER.words;
  return STAGGER.lines;
}

/**
 * Split text with SplitType, prepare overflow masks on lines,
 * return targets for GSAP + a revert() cleanup.
 */
export function prepareSplit(
  element: HTMLElement,
  types: SplitKinds = "lines,words"
) {
  const instance = new SplitType(element, {
    types,
    tagName: "span",
    lineClass: "split-line",
    wordClass: "split-word",
    charClass: "split-char",
  });

  instance.lines?.forEach((line) => {
    line.style.overflow = "hidden";
    line.style.display = "block";
  });

  return {
    instance,
    lines: instance.lines ?? [],
    words: instance.words ?? [],
    chars: instance.chars ?? [],
    revert: () => instance.revert(),
  };
}

/** Build from-vars for a split reveal (use with timeline.from). */
export function splitRevealFrom(
  unit: "lines" | "words" | "chars",
  options: Omit<SplitRevealOptions, "types" | "animate"> = {}
): TweenVars {
  return {
    yPercent: options.y ?? 110,
    opacity: 0,
    duration: options.duration ?? DURATION.base,
    ease: options.ease ?? EASE.out,
    stagger: options.stagger ?? defaultStagger(unit),
  };
}

/**
 * Split + return GSAP-ready targets and cleanup.
 * Prefer animating words inside masked lines for premium reveals.
 */
export function splitForReveal(
  element: HTMLElement,
  options: SplitRevealOptions = {}
) {
  const types = options.types ?? "lines,words";
  const unit = pickAnimate(types, options.animate);
  const prepared = prepareSplit(element, types);

  const targets =
    unit === "chars"
      ? prepared.chars
      : unit === "words"
        ? prepared.words
        : prepared.lines;

  return {
    ...prepared,
    targets,
    unit,
    fromVars: splitRevealFrom(unit, options),
  };
}
