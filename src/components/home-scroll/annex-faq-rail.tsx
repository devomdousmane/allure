"use client";

import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerGsap } from "@/lib/gsap/register";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

registerGsap();

/** Rail sticky — compteur de questions pendant le scroll FAQ. */
export function AnnexFaqRail() {
  const [active, setActive] = useState(0);
  const [total, setTotal] = useState(0);
  const [visible, setVisible] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced === null) return;

    const section = document.getElementById("faq");
    if (!section) return;

    const items = section.querySelectorAll<HTMLElement>(
      "[data-faq-item], details, [data-slot='accordion-item']"
    );
    const count = items.length || 6;
    setTotal(count);

    const triggers: ScrollTrigger[] = [];

    const show = ScrollTrigger.create({
      trigger: section,
      start: "top 70%",
      end: "bottom 30%",
      onToggle: (self) => setVisible(self.isActive),
    });
    triggers.push(show);
    setVisible(show.isActive);

    if (items.length) {
      items.forEach((item, i) => {
        triggers.push(
          ScrollTrigger.create({
            trigger: item,
            start: "top 55%",
            end: "bottom 45%",
            onToggle: (self) => {
              if (self.isActive) setActive(i);
            },
          })
        );
      });
    } else {
      triggers.push(
        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          onUpdate: (self) => {
            setActive(Math.min(count - 1, Math.floor(self.progress * count)));
          },
        })
      );
    }

    return () => triggers.forEach((t) => t.kill());
  }, [reduced]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-0 z-[6] hidden w-28 lg:block"
    >
      <div
        className={cn(
          "sticky top-[40%] ml-4 max-w-[5.5rem] transition-all duration-500 xl:ml-8",
          visible
            ? "translate-x-0 opacity-100"
            : "-translate-x-3 opacity-0"
        )}
      >
        <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-allure-gold">
          FAQ
        </p>
        <p className="mt-2 font-heading text-3xl tabular-nums text-allure-petrol dark:text-allure-sand">
          {String(active + 1).padStart(2, "0")}
          <span className="ml-1 text-base text-allure-petrol/35 dark:text-allure-sand/35">
            /{String(Math.max(total, 1)).padStart(2, "0")}
          </span>
        </p>
        <div className="mt-4 flex flex-col gap-1.5">
          {Array.from({ length: Math.max(total, 1) }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-0.5 origin-left rounded-full transition-all duration-300",
                i === active
                  ? "w-8 bg-allure-gold"
                  : "w-4 bg-allure-petrol/15 dark:bg-allure-sand/15"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
