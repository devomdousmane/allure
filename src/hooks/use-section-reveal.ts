"use client";

import { useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/lib/gsap/register";
import { DURATION, EASE } from "@/lib/gsap/presets";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import {
  isRevealArmed,
  type HomeRevealId,
} from "@/lib/home-motion-debug";

registerGsap();

export type UseSectionRevealOptions = {
  /** Unused by IO trigger — kept for API compat with callers */
  start?: string;
  onEnter?: (root: HTMLElement) => void | (() => void);
  skipDefaults?: boolean;
  /** Id debug — requis en mode HOME_MOTION_DEBUG pour autoriser l’anim */
  debugId?: HomeRevealId;
  /** Portion visible requise (0–1). Défaut 0.22 */
  threshold?: number;
};

const HIDE_SEL =
  "[data-reveal], [data-split], [data-reveal-media], [data-presence-frame], [data-presence-divider], [data-clip-reveal], [data-about-card], [data-about-title], [data-about-trust], [data-about-body], [data-about-cta], [data-statement-word], [data-statement-sub], [data-letter]";

/**
 * True when the section is meaningfully on screen — not a 1px peek
 * under a pinned hero. Works for scroll-down and scroll-up entry.
 */
function isMeaningfullyVisible(el: HTMLElement, minRatio = 0.22) {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight;
  if (rect.height <= 0) return false;

  const visible = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
  if (visible <= 0) return false;

  const ratio = visible / Math.min(rect.height, vh);
  // Entered from below (scroll down) or from above (scroll up)
  const inBand = rect.top < vh * 0.85 && rect.bottom > vh * 0.15;
  return inBand && ratio >= minRatio;
}

function isFullyGone(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight;
  return rect.bottom < 8 || rect.top > vh - 8;
}

/**
 * Scroll reveal — plays on enter (down or up), resets when fully left,
 * so scrolling back up replays the animation.
 */
export function useSectionReveal(
  scopeRef: RefObject<HTMLElement | null>,
  options: UseSectionRevealOptions = {}
) {
  const reduced = usePrefersReducedMotion();
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const cleanups = useRef<Array<() => void>>([]);
  const played = useRef(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const root = scopeRef.current;
      if (!root || reduced === null) return;

      if (!isRevealArmed(optionsRef.current.debugId)) {
        gsap.set(root.querySelectorAll<HTMLElement>(HIDE_SEL), {
          autoAlpha: 1,
          clearProps: "transform",
        });
        return;
      }

      played.current = false;
      timelineRef.current?.kill();
      timelineRef.current = null;

      const soft = reduced === true;
      const minRatio = optionsRef.current.threshold ?? 0.22;

      const hideables = () =>
        root.querySelectorAll<HTMLElement>(HIDE_SEL);

      if (!soft) {
        gsap.set(hideables(), { autoAlpha: 0 });
      }

      const runCleanups = () => {
        const fns = cleanups.current.splice(0);
        fns.forEach((fn) => {
          try {
            fn();
          } catch {
            /* SplitText vs React DOM race */
          }
        });
      };

      const reset = () => {
        if (!played.current) return;
        played.current = false;

        timelineRef.current?.kill();
        timelineRef.current = null;
        gsap.killTweensOf(root.querySelectorAll(".split-word, .split-char, .split-line"));

        runCleanups();

        const nodes = hideables();
        gsap.killTweensOf(nodes);

        if (!soft) {
          gsap.set(nodes, { autoAlpha: 0, clearProps: "transform" });
        }
      };

      const play = () => {
        if (played.current) return;
        if (!soft && !isMeaningfullyVisible(root, minRatio)) return;

        played.current = true;

        const opts = optionsRef.current;

        if (opts.skipDefaults) {
          const extra = opts.onEnter?.(root);
          if (typeof extra === "function") cleanups.current.push(extra);
          return;
        }

        const eyebrow = root.querySelectorAll<HTMLElement>(
          '[data-reveal="eyebrow"]'
        );
        const title = root.querySelectorAll<HTMLElement>(
          '[data-reveal="title"]'
        );
        const text = root.querySelectorAll<HTMLElement>(
          '[data-reveal="text"]'
        );
        const media = root.querySelectorAll<HTMLElement>(
          '[data-reveal="media"]'
        );
        const items = root.querySelectorAll<HTMLElement>(
          '[data-reveal="item"]'
        );
        const revealMedia = root.querySelectorAll<HTMLElement>(
          "[data-reveal-media]"
        );

        const tl = gsap.timeline({
          defaults: { ease: soft ? "none" : EASE.out },
        });
        timelineRef.current = tl;

        if (eyebrow.length) {
          tl.fromTo(
            eyebrow,
            { autoAlpha: 0, y: soft ? 0 : 16 },
            { autoAlpha: 1, y: 0, duration: soft ? 0.35 : DURATION.fast },
            0
          );
        }

        const splits = root.querySelectorAll<HTMLElement>("[data-split]");
        if (splits.length) {
          tl.fromTo(
            splits,
            { autoAlpha: 0, y: soft ? 0 : 18 },
            {
              autoAlpha: 1,
              y: 0,
              duration: soft ? 0.35 : DURATION.base,
              stagger: 0.06,
            },
            "-=0.15"
          );
        }

        if (title.length) {
          tl.fromTo(
            title,
            { autoAlpha: 0, y: soft ? 0 : 24 },
            { autoAlpha: 1, y: 0, duration: soft ? 0.35 : DURATION.base },
            "-=0.4"
          );
        }

        if (text.length) {
          tl.fromTo(
            text,
            { autoAlpha: 0, y: soft ? 0 : 18 },
            { autoAlpha: 1, y: 0, duration: soft ? 0.35 : DURATION.base },
            "-=0.35"
          );
        }

        const mediaNodes = [...media, ...revealMedia];
        if (mediaNodes.length) {
          tl.fromTo(
            mediaNodes,
            { autoAlpha: 0, y: soft ? 0 : 32 },
            {
              autoAlpha: 1,
              y: 0,
              duration: soft ? 0.35 : DURATION.slow,
              stagger: 0.08,
            },
            "-=0.4"
          );
        }

        if (items.length) {
          tl.fromTo(
            items,
            { autoAlpha: 0, y: soft ? 0 : 22 },
            {
              autoAlpha: 1,
              y: 0,
              duration: soft ? 0.35 : DURATION.base,
              stagger: 0.07,
            },
            "-=0.35"
          );
        }

        const extra = opts.onEnter?.(root);
        if (typeof extra === "function") cleanups.current.push(extra);
      };

      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;

          if (!entry.isIntersecting || isFullyGone(root)) {
            reset();
            return;
          }

          if (entry.intersectionRatio < minRatio) return;
          if (!isMeaningfullyVisible(root, minRatio)) return;
          play();
        },
        {
          threshold: [0, 0.05, 0.1, 0.2, 0.25, 0.35, 0.5, 0.75, 1],
          rootMargin: "0px 0px -10% 0px",
        }
      );

      observer.observe(root);

      requestAnimationFrame(() => {
        if (isMeaningfullyVisible(root, minRatio)) play();
      });

      return () => {
        observer.disconnect();
        timelineRef.current?.kill();
        timelineRef.current = null;
        runCleanups();
      };
    },
    {
      dependencies: [
        reduced,
        options.start,
        options.skipDefaults,
        options.debugId,
        options.threshold,
      ],
    }
  );

  return { reducedMotion: reduced === true };
}
