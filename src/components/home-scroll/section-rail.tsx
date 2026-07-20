"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerGsap } from "@/lib/gsap/register";
import { useLenis } from "@/components/layout/smooth-scroll-provider";
import { HOME_RAIL_CHAPTERS } from "@/components/home-scroll/home-chapters";
import { cn } from "@/lib/utils";

registerGsap();

/** Desktop lateral dots + labels — active chapter via ScrollTrigger. */
export function SectionRail() {
  const lenis = useLenis();
  const [activeId, setActiveId] = useState<string | null>(null);
  const triggers = useRef<ScrollTrigger[]>([]);

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

    ScrollTrigger.refresh();

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

  return (
    <nav
      aria-label="Navigation des chapitres"
      className="pointer-events-none fixed top-1/2 right-3 z-50 hidden -translate-y-1/2 xl:block 2xl:right-5"
    >
      <ul className="pointer-events-auto flex flex-col gap-3">
        {HOME_RAIL_CHAPTERS.map((chapter) => {
          const active = activeId === chapter.id;
          return (
            <li key={chapter.id}>
              <button
                type="button"
                onClick={() => goTo(chapter.id)}
                aria-label={chapter.label}
                aria-current={active ? "true" : undefined}
                className="group flex cursor-pointer items-center justify-end gap-3"
              >
                <span
                  className={cn(
                    "font-sans text-[10px] uppercase tracking-[0.2em] transition-all duration-300",
                    active
                      ? "translate-x-0 opacity-100 text-allure-gold"
                      : "translate-x-2 opacity-0 text-allure-petrol/50 group-hover:translate-x-0 group-hover:opacity-70 dark:text-allure-sand/50"
                  )}
                >
                  {chapter.label}
                </span>
                <span
                  className={cn(
                    "block h-1.5 w-1.5 rounded-full transition-all duration-300",
                    active
                      ? "scale-125 bg-allure-gold"
                      : "bg-allure-petrol/30 group-hover:bg-allure-gold/70 dark:bg-allure-sand/30"
                  )}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
