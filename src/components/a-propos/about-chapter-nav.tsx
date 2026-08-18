"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";
import { ABOUT_CHAPTERS, type AboutChapterId } from "@/lib/a-propos";
import { registerGsap } from "@/lib/gsap/register";
import { EASE } from "@/lib/gsap/presets";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useLenis } from "@/components/layout/smooth-scroll-provider";

registerGsap();

/** Rail sticky droit — chapitres de la page À propos. */
export function AboutChapterNav() {
  const navRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<AboutChapterId>(
    ABOUT_CHAPTERS[0].id
  );
  const [visible, setVisible] = useState(false);
  const reduced = usePrefersReducedMotion();
  const lenis = useLenis();

  useEffect(() => {
    const story = document.getElementById("about-story");
    if (!story) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "-8% 0px -12% 0px", threshold: 0 }
    );
    io.observe(story);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const ratios = new Map<AboutChapterId, number>();
    const pick = () => {
      let bestId: AboutChapterId = ABOUT_CHAPTERS[0].id;
      let best = -1;
      ratios.forEach((ratio, id) => {
        if (ratio > best) {
          best = ratio;
          bestId = id;
        }
      });
      if (best > 0) setActiveId(bestId);
    };

    const observers = ABOUT_CHAPTERS.map((ch) => {
      const el = document.getElementById(ch.id);
      if (!el) return null;
      const io = new IntersectionObserver(
        ([entry]) => {
          ratios.set(ch.id, entry.isIntersecting ? entry.intersectionRatio : 0);
          pick();
        },
        {
          rootMargin: "-30% 0px -45% 0px",
          threshold: [0, 0.2, 0.4, 0.6, 1],
        }
      );
      io.observe(el);
      return io;
    });

    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  useGSAP(
    () => {
      const nav = navRef.current;
      if (!nav || reduced === null) return;
      gsap.to(nav, {
        autoAlpha: visible ? 1 : 0,
        x: visible ? 0 : 12,
        duration: reduced ? 0 : 0.35,
        ease: EASE.out,
        pointerEvents: visible ? "auto" : "none",
      });
    },
    { dependencies: [visible, reduced] }
  );

  function goTo(id: AboutChapterId) {
    const el = document.getElementById(id);
    if (!el) return;
    setActiveId(id);
    if (lenis) lenis.scrollTo(el, { offset: -88, duration: 1.05 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav
      ref={navRef}
      aria-label="Sections À propos"
      className="pointer-events-none fixed top-1/2 right-2 z-40 hidden -translate-y-1/2 opacity-0 sm:right-4 md:block lg:right-7"
    >
      <ul className="flex flex-col items-end gap-1 border-r border-allure-petrol/12 pr-3 dark:border-allure-sand/15">
        {ABOUT_CHAPTERS.map((ch) => {
          const active = activeId === ch.id;
          return (
            <li key={ch.id}>
              <button
                type="button"
                onClick={() => goTo(ch.id)}
                aria-current={active ? "true" : undefined}
                aria-label={`${ch.index} — ${ch.label}`}
                className={cn(
                  "flex cursor-pointer items-baseline gap-2 py-1.5 text-right transition-colors duration-200",
                  active
                    ? "text-allure-gold"
                    : "text-allure-ink/40 hover:text-allure-petrol dark:text-allure-sand/35 dark:hover:text-allure-sand"
                )}
              >
                <span className="hidden max-w-[6.5rem] truncate font-sans text-[10px] uppercase tracking-[0.16em] xl:inline">
                  {ch.label}
                </span>
                <span className="font-heading text-sm tabular-nums">
                  {ch.index}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
