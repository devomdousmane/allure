"use client";

import { useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/lib/gsap/register";
import { DURATION, EASE, STAGGER } from "@/lib/gsap/presets";
import { splitForReveal, type SplitKinds } from "@/lib/gsap/split-text";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

registerGsap();

export type UseSectionRevealOptions = {
  start?: string;
  onEnter?: (root: HTMLElement) => void | (() => void);
  skipDefaults?: boolean;
};

function isPastStart(el: HTMLElement, startPercent = 85) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight * (startPercent / 100);
}

/**
 * Reliable scroll reveal — never leaves content stuck at opacity 0.
 * Uses ScrollTrigger.onEnter + fromTo (not timeline.from + immediateRender).
 */
export function useSectionReveal(
  scopeRef: RefObject<HTMLElement | null>,
  options: UseSectionRevealOptions = {}
) {
  const reduced = usePrefersReducedMotion();
  const cleanups = useRef<Array<() => void>>([]);
  const played = useRef(false);

  useGSAP(
    () => {
      const root = scopeRef.current;
      if (!root || reduced === null) return;

      played.current = false;
      cleanups.current.forEach((fn) => fn());
      cleanups.current = [];

      const soft = reduced === true;
      const start = options.start ?? "top 85%";

      const play = () => {
        if (played.current) return;
        played.current = true;

        if (options.skipDefaults) {
          const extra = options.onEnter?.(root);
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

        const tl = gsap.timeline({ defaults: { ease: soft ? "none" : EASE.out } });

        if (eyebrow.length) {
          tl.fromTo(
            eyebrow,
            { autoAlpha: 0, y: soft ? 0 : 16 },
            { autoAlpha: 1, y: 0, duration: soft ? 0.35 : DURATION.fast },
            0
          );
        }

        root.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
          if (soft) {
            tl.fromTo(
              el,
              { autoAlpha: 0 },
              { autoAlpha: 1, duration: 0.35 },
              "-=0.15"
            );
            return;
          }

          const kinds = (el.dataset.split || "lines,words") as SplitKinds;
          const animateAttr = el.dataset.splitAnimate as
            | "lines"
            | "words"
            | "chars"
            | undefined;
          const { targets, revert } = splitForReveal(el, {
            types: kinds,
            animate: animateAttr,
          });
          cleanups.current.push(revert);

          if (targets.length) {
            gsap.set(targets, { yPercent: 110, autoAlpha: 0 });
            tl.to(
              targets,
              {
                yPercent: 0,
                autoAlpha: 1,
                duration: DURATION.base,
                stagger: animateAttr === "chars" ? STAGGER.chars : STAGGER.words,
                ease: EASE.out,
              },
              "-=0.25"
            );
          }
        });

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

        const extra = options.onEnter?.(root);
        if (typeof extra === "function") cleanups.current.push(extra);
      };

      const st = ScrollTrigger.create({
        trigger: root,
        start,
        once: true,
        onEnter: play,
        // If already scrolled past when ST is created / after refresh
        onRefresh: (self) => {
          if (self.progress > 0 || isPastStart(root)) play();
        },
      });

      // Immediate play if already in / past the trigger zone
      if (isPastStart(root)) {
        requestAnimationFrame(play);
      }

      // Absolute failsafe — never leave section content invisible
      const failsafe = window.setTimeout(() => {
        if (played.current) return;
        play();
        // If somehow still hidden, force visible
        root
          .querySelectorAll<HTMLElement>(
            '[data-reveal], [data-split], [data-reveal-media], .split-word, .split-char, .split-line'
          )
          .forEach((el) => {
            gsap.set(el, { clearProps: "opacity,visibility,transform" });
          });
      }, 2500);

      return () => {
        window.clearTimeout(failsafe);
        st.kill();
        cleanups.current.forEach((fn) => fn());
        cleanups.current = [];
      };
    },
    { scope: scopeRef, dependencies: [reduced, options.start] }
  );

  return { reducedMotion: reduced === true };
}
