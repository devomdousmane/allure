"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerGsap } from "@/lib/gsap/register";
import { useLenis } from "@/components/layout/smooth-scroll-provider";
import { HOME_RAIL_CHAPTERS } from "@/components/home-scroll/home-chapters";
import { HERO_PIN_EVENT } from "@/lib/hero-pin";
import { cn } from "@/lib/utils";

registerGsap();

/** Desktop — serpent de chapitres (dots + filet) à droite. */
export function SectionRail() {
  const lenis = useLenis();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dakarActive, setDakarActive] = useState(false);
  const [heroPinned, setHeroPinned] = useState(false);
  const triggers = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    const onHero = (event: Event) => {
      const active = Boolean(
        (event as CustomEvent<{ active: boolean }>).detail?.active
      );
      setHeroPinned(active);
    };
    window.addEventListener(HERO_PIN_EVENT, onHero);
    return () => window.removeEventListener(HERO_PIN_EVENT, onHero);
  }, []);

  useEffect(() => {
    triggers.current.forEach((t) => t.kill());
    triggers.current = [];

    HOME_RAIL_CHAPTERS.forEach((chapter) => {
      const el = document.getElementById(chapter.id);
      if (!el) return;

      const st = ScrollTrigger.create({
        trigger: el,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          if (self.isActive) setActiveId(chapter.id);
        },
      });
      triggers.current.push(st);
    });

    const dakar = document.getElementById("dakar");
    if (dakar) {
      triggers.current.push(
        ScrollTrigger.create({
          trigger: dakar,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => setDakarActive(self.isActive),
        })
      );
    }

    return () => {
      triggers.current.forEach((t) => t.kill());
      triggers.current = [];
    };
  }, []);

  function goTo(id: string) {
    const target = `#${id}`;
    if (lenis) {
      lenis.scrollTo(target, { offset: -24, duration: 1.2 });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  }

  const activeIndex = Math.max(
    0,
    HOME_RAIL_CHAPTERS.findIndex((c) => c.id === activeId)
  );
  const fillPct =
    HOME_RAIL_CHAPTERS.length < 2
      ? 0
      : (activeIndex / (HOME_RAIL_CHAPTERS.length - 1)) * 100;
  const isRailVisible = !dakarActive && !heroPinned;

  return (
    <nav
      aria-label="Navigation des chapitres"
      className={cn(
        "pointer-events-none fixed top-1/2 right-4 z-40 w-[7.5rem] -translate-y-1/2 transition-opacity duration-500 max-xl:invisible xl:block 2xl:right-6",
        isRailVisible ? "opacity-100" : "opacity-0"
      )}
    >
      <div className="relative pr-1">
        <span
          aria-hidden
          className="absolute top-1.5 right-[5px] bottom-1.5 w-px bg-allure-petrol/18 dark:bg-allure-sand/18"
        >
          <span
            className="absolute inset-x-0 top-0 origin-top bg-allure-gold transition-[height] duration-500"
            style={{ height: `${fillPct}%` }}
          />
        </span>

        <ul
          className={cn(
            "flex flex-col gap-3",
            isRailVisible ? "pointer-events-auto" : "pointer-events-none"
          )}
        >
          {HOME_RAIL_CHAPTERS.map((chapter) => {
            const active = activeId === chapter.id;
            return (
              <li key={chapter.id}>
                <button
                  type="button"
                  onClick={() => goTo(chapter.id)}
                  aria-label={chapter.label}
                  aria-current={active ? "true" : undefined}
                  className="group flex w-full cursor-pointer items-center justify-end gap-2.5"
                >
                  <span
                    className={cn(
                      "max-w-[6.25rem] truncate text-right font-sans text-[10px] uppercase tracking-[0.18em] transition-all duration-300",
                      active
                        ? "opacity-100 text-allure-gold"
                        : "opacity-0 text-allure-petrol/65 group-hover:opacity-80 dark:text-allure-sand/50"
                    )}
                  >
                    {chapter.label}
                  </span>
                  <span
                    className={cn(
                      "relative z-[1] block h-1.5 w-1.5 shrink-0 rounded-full ring-2 ring-white transition-all duration-300 dark:ring-allure-petrol-deep",
                      active
                        ? "scale-125 bg-allure-gold"
                        : "bg-allure-petrol/45 group-hover:bg-allure-gold/80 dark:bg-allure-sand/30"
                    )}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
