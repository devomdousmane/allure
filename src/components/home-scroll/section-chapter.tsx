"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/lib/gsap/register";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { DURATION, EASE } from "@/lib/gsap/presets";
import { cn } from "@/lib/utils";

registerGsap();

type SectionChapterProps = {
  index: string;
  label: string;
  children: ReactNode;
  className?: string;
  hideChrome?: boolean;
  sectionId?: string;
};

/**
 * Chapter wrapper: sticky index + progress.
 * Chrome starts visible (no stuck opacity-0).
 */
export function SectionChapter({
  index,
  label,
  children,
  className,
  hideChrome = false,
  sectionId,
}: SectionChapterProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const chromeRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || reduced === null) return;

      const trigger =
        (sectionId && document.getElementById(sectionId)) ||
        root.querySelector("section") ||
        root;

      const chrome = chromeRef.current;
      if (chrome && reduced === false) {
        gsap.from(chrome, {
          opacity: 0,
          x: -8,
          duration: DURATION.fast,
          ease: EASE.out,
          clearProps: "all",
          scrollTrigger: {
            trigger,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });
      }

      const progress = progressRef.current;
      if (progress && reduced === false) {
        gsap.fromTo(
          progress,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger,
              start: "top 60%",
              end: "bottom 40%",
              scrub: 0.35,
            },
          }
        );
      }
    },
    { scope: rootRef, dependencies: [reduced, sectionId, hideChrome] }
  );

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      {!hideChrome ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-2 z-[5] hidden w-14 select-none lg:left-3 lg:block xl:left-4"
        >
          <div
            ref={chromeRef}
            className="sticky top-32 flex flex-col gap-2 pt-10"
          >
            <span className="font-sans text-[10px] uppercase tracking-[0.35em] text-allure-gold">
              {index}
            </span>
            <span className="max-w-[3.5rem] font-heading text-xs leading-tight text-allure-petrol/35 dark:text-allure-sand/30">
              {label}
            </span>
            <div className="mt-2 h-14 w-px overflow-hidden bg-allure-petrol/10 dark:bg-allure-sand/10">
              <div
                ref={progressRef}
                className="h-full w-full origin-top bg-allure-gold will-change-transform"
              />
            </div>
          </div>
        </div>
      ) : null}
      {children}
    </div>
  );
}
