"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";
import type { AvancementPhase } from "@/lib/avancement";
import { registerGsap } from "@/lib/gsap/register";
import { EASE } from "@/lib/gsap/presets";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useLenis } from "@/components/layout/smooth-scroll-provider";

registerGsap();

type PhaseNavProps = {
  phases: AvancementPhase[];
};

/**
 * Rail sticky à droite — index + label, actif synchronisé au scroll.
 */
export function PhaseNav({ phases }: PhaseNavProps) {
  const navRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState(phases[0]?.id ?? "");
  const [visible, setVisible] = useState(false);
  const reduced = usePrefersReducedMotion();
  const lenis = useLenis();

  useEffect(() => {
    const section = document.getElementById("phases");
    if (!section) return;

    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "-10% 0px -15% 0px", threshold: 0 }
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const ratios = new Map<string, number>();

    const pickActive = () => {
      let bestId = phases[0]?.id ?? "";
      let best = -1;
      ratios.forEach((ratio, id) => {
        if (ratio > best) {
          best = ratio;
          bestId = id;
        }
      });
      if (best > 0) setActiveId(bestId);
    };

    const observers = phases.map((phase) => {
      const el = document.getElementById(phase.id);
      if (!el) return null;

      const io = new IntersectionObserver(
        ([entry]) => {
          ratios.set(
            phase.id,
            entry.isIntersecting ? entry.intersectionRatio : 0
          );
          pickActive();
        },
        {
          rootMargin: "-28% 0px -42% 0px",
          threshold: [0, 0.15, 0.35, 0.5, 0.75, 1],
        }
      );
      io.observe(el);
      return io;
    });

    return () => observers.forEach((io) => io?.disconnect());
  }, [phases]);

  useGSAP(
    () => {
      const nav = navRef.current;
      if (!nav || reduced === null) return;

      if (reduced === true) {
        gsap.set(nav, {
          autoAlpha: visible ? 1 : 0,
          x: 0,
          pointerEvents: visible ? "auto" : "none",
        });
        return;
      }

      gsap.to(nav, {
        autoAlpha: visible ? 1 : 0,
        x: visible ? 0 : 14,
        duration: 0.4,
        ease: EASE.out,
        pointerEvents: visible ? "auto" : "none",
      });
    },
    { dependencies: [visible, reduced] }
  );

  useGSAP(
    () => {
      const nav = navRef.current;
      if (!nav || reduced === true) return;

      const items = nav.querySelectorAll<HTMLElement>("[data-phase-item]");
      items.forEach((item) => {
        const active = item.dataset.phaseId === activeId;
        const index = item.querySelector<HTMLElement>("[data-phase-index]");
        const label = item.querySelector<HTMLElement>("[data-phase-label]");
        const mark = item.querySelector<HTMLElement>("[data-phase-mark]");

        gsap.to(item, {
          opacity: active ? 1 : 0.35,
          duration: 0.35,
          ease: EASE.soft,
        });
        if (index) {
          gsap.to(index, {
            scale: active ? 1.06 : 1,
            duration: 0.35,
            ease: EASE.out,
          });
        }
        if (label) {
          gsap.to(label, {
            autoAlpha: active ? 1 : 0.5,
            x: active ? 0 : 4,
            duration: 0.35,
            ease: EASE.out,
          });
        }
        if (mark) {
          gsap.to(mark, {
            scaleY: active ? 1 : 0,
            duration: 0.4,
            ease: EASE.out,
          });
        }
      });
    },
    { dependencies: [activeId, reduced] }
  );

  function goTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    setActiveId(id);
    if (lenis) {
      lenis.scrollTo(el, { offset: -96, duration: 1.1 });
    } else {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <nav
      ref={navRef}
      aria-label="Phases du chantier"
      className="pointer-events-none fixed top-1/2 right-2 z-40 -translate-y-1/2 opacity-0 sm:right-4 lg:right-7 xl:right-10"
    >
      <ul className="flex flex-col items-end gap-0.5 border-r border-allure-petrol/12 pr-2.5 sm:gap-1 sm:pr-3 dark:border-allure-sand/15">
        {phases.map((phase) => {
          const active = activeId === phase.id;
          return (
            <li key={phase.id} className="relative">
              <button
                type="button"
                data-phase-item
                data-phase-id={phase.id}
                onClick={() => goTo(phase.id)}
                aria-current={active ? "true" : undefined}
                aria-label={`Phase ${phase.index} — ${phase.label}`}
                className={cn(
                  "group relative flex cursor-pointer items-baseline gap-2 py-1.5 pl-1.5 text-right transition-colors duration-200 sm:gap-2.5 sm:pl-2",
                  active
                    ? "text-allure-gold"
                    : "text-allure-ink/45 hover:text-allure-petrol dark:text-allure-sand/40 dark:hover:text-allure-sand"
                )}
              >
                <span
                  data-phase-label
                  className="hidden max-w-[8rem] truncate font-sans text-[10px] uppercase tracking-[0.18em] lg:inline"
                >
                  {phase.label}
                </span>
                <span
                  data-phase-index
                  className="inline-block origin-right font-heading text-[13px] tabular-nums leading-none tracking-tight sm:text-sm lg:text-base"
                >
                  {phase.index}
                </span>
                <span
                  aria-hidden
                  data-phase-mark
                  className="absolute top-1/2 -right-2.5 h-3.5 w-0.5 origin-center -translate-y-1/2 scale-y-0 bg-allure-gold sm:-right-3 sm:h-4"
                />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
