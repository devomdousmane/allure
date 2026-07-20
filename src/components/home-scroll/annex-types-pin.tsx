"use client";

import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerGsap } from "@/lib/gsap/register";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { APARTMENTS } from "@/lib/apartments";
import { cn } from "@/lib/utils";

registerGsap();

/** Sticky typology counter — appears / disappears with the apartments section. */
export function AnnexTypesPin() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced === null) return;

    const section = document.getElementById("appartements");
    if (!section) return;

    const triggers: ScrollTrigger[] = [];

    const show = ScrollTrigger.create({
      trigger: section,
      start: "top 75%",
      end: "bottom 30%",
      onToggle: (self) => setVisible(self.isActive),
    });
    triggers.push(show);
    setVisible(show.isActive);

    section.querySelectorAll("article").forEach((card, i) => {
      triggers.push(
        ScrollTrigger.create({
          trigger: card,
          start: "top 55%",
          end: "bottom 45%",
          onToggle: (self) => {
            if (self.isActive) setActive(i);
          },
        })
      );
    });

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => triggers.forEach((t) => t.kill());
  }, [reduced]);

  const apt = APARTMENTS[active] ?? APARTMENTS[0];

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 right-0 z-[6] hidden w-36 lg:block"
    >
      <div
        className={cn(
          "sticky top-[38%] mr-3 max-w-[8.5rem] rounded-2xl border border-allure-petrol/10 bg-white/90 px-3 py-4 shadow-sm backdrop-blur-sm transition-all duration-500 dark:border-allure-sand/10 dark:bg-allure-petrol-deep/90 xl:mr-6",
          visible
            ? "translate-x-0 opacity-100"
            : "translate-x-3 opacity-0"
        )}
      >
        <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-allure-gold">
          Typologie
        </p>
        <p className="mt-2 font-heading text-3xl text-allure-petrol dark:text-allure-sand">
          {String(active + 1).padStart(2, "0")}
        </p>
        <p className="mt-1 font-heading text-sm leading-tight text-allure-petrol/80 dark:text-allure-sand/80">
          {apt.type}
        </p>
      </div>
    </div>
  );
}
