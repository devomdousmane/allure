"use client";

import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { DURATION, EASE, STAGGER } from "@/lib/gsap/presets";

export type SplitKinds =
  | "lines"
  | "words"
  | "chars"
  | "lines,words"
  | "words,chars"
  | "lines,chars"
  | "lines,words,chars";

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

/** Normalise `lines,words` → type SplitText + mask overflow. */
function splitConfig(types: SplitKinds) {
  const parts: string[] = [];
  if (types.includes("lines")) parts.push("lines");
  if (types.includes("words")) parts.push("words");
  if (types.includes("chars")) parts.push("chars");

  const type = parts.join(",") || "words,lines";
  const mask = types.includes("lines")
    ? ("lines" as const)
    : types.includes("words")
      ? ("words" as const)
      : undefined;

  return { type, mask };
}

/**
 * Split text with GSAP SplitText (+ mask overflow),
 * return targets for GSAP + a revert() cleanup.
 */
export function prepareSplit(
  element: HTMLElement,
  types: SplitKinds = "lines,words"
) {
  const { type, mask } = splitConfig(types);

  const instance = SplitText.create(element, {
    type,
    mask,
    tag: "span",
    aria: "auto",
    linesClass: "split-line",
    wordsClass: "split-word",
    charsClass: "split-char",
  });

  return {
    instance,
    lines: instance.lines ?? [],
    words: instance.words ?? [],
    chars: instance.chars ?? [],
    revert: () => safeRevertSplit(instance, element),
  };
}

/**
 * SplitText.revert() throws NotFoundError when React already
 * replaced the wrapped nodes (Strict Mode, text updates, HMR).
 */
export function safeRevertSplit(
  instance: { revert: () => void } | null | undefined,
  element?: HTMLElement | null
) {
  if (!instance) return;
  try {
    instance.revert();
  } catch {
    restorePlainText(element);
  }
}

function restorePlainText(element?: HTMLElement | null) {
  if (!element || !element.isConnected) return;
  try {
    const text = element.textContent ?? "";
    element.replaceChildren(document.createTextNode(text));
  } catch {
    /* already detached */
  }
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

/**
 * Append a GSAP SplitText reveal to an existing timeline.
 * Returns revert() for cleanup.
 */
export function addSplitRevealToTimeline(
  tl: gsap.core.Timeline,
  element: HTMLElement,
  options: SplitRevealOptions & { position?: gsap.Position } = {}
) {
  const { position, ...splitOptions } = options;
  const { targets, revert, fromVars } = splitForReveal(
    element,
    splitOptions
  );

  if (!targets.length) {
    tl.fromTo(
      element,
      { autoAlpha: 0, y: 18 },
      {
        autoAlpha: 1,
        y: 0,
        duration: (fromVars.duration as number) ?? DURATION.base,
        ease: (fromVars.ease as string) ?? EASE.out,
      },
      position ?? ">"
    );
    return revert;
  }

  gsap.set(element, { autoAlpha: 1 });
  gsap.set(targets, {
    yPercent: (fromVars.yPercent as number) ?? 110,
    autoAlpha: 0,
  });

  tl.to(
    targets,
    {
      yPercent: 0,
      autoAlpha: 1,
      duration: fromVars.duration as number,
      stagger: fromVars.stagger as number,
      ease: fromVars.ease as string,
    },
    position ?? ">"
  );

  return revert;
}
