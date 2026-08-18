"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { DURATION, EASE, STAGGER } from "@/lib/gsap/presets";
import { SectionSeam, SEAM } from "@/components/ui/section-seam";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import { HomeCtaRow } from "@/components/home-scroll/home-cta-row";

const STATS = [
  { value: 5, suffix: "", label: "Typologies d'appartements" },
  { value: 300, suffix: " m", label: "De la plage des Almadies" },
  { value: 13, suffix: "", label: "Services & prestations" },
  { value: 2026, suffix: "", label: "Livraison prévue" },
] as const;

/**
 * Étape debug 2 — branché sur `useSectionReveal` (même IO + replay up/down).
 */
export function StatsBand() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState<number | null>(2);

  useSectionReveal(sectionRef, {
    debugId: "stats",
    skipDefaults: true,
    onEnter: (root) => {
      const soft = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const cards = root.querySelectorAll<HTMLElement>("[data-reveal='item']");
      const values = root.querySelectorAll<HTMLElement>("[data-count]");
      const labels = root.querySelectorAll<HTMLElement>("[data-stat-label]");

      const tl = gsap.timeline({
        defaults: { ease: soft ? "none" : EASE.out },
      });

      tl.fromTo(
        cards,
        { autoAlpha: 0, y: soft ? 0 : 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: soft ? 0.35 : DURATION.base,
          stagger: { amount: STAGGER.items * cards.length, from: "start" },
        }
      );

      if (!soft) {
        values.forEach((el, i) => {
          const end = Number(el.dataset.count ?? 0);
          const suffix = el.dataset.suffix ?? "";
          const obj = { n: 0 };
          el.textContent = `0${suffix}`;

          tl.to(
            obj,
            {
              n: end,
              duration: end >= 1000 ? 1.35 : 1,
              ease: EASE.soft,
              onUpdate: () => {
                el.textContent = `${Math.round(obj.n)}${suffix}`;
              },
            },
            i === 0 ? "-=0.4" : "<"
          );
        });

        labels.forEach((el, i) => {
          tl.fromTo(
            el,
            { autoAlpha: 0, y: 10 },
            { autoAlpha: 1, y: 0, duration: DURATION.fast },
            i === 0 ? "-=0.85" : "<"
          );
        });
      }

      return () => {
        tl.kill();
        values.forEach((el) => {
          const end = el.dataset.count ?? "0";
          const suffix = el.dataset.suffix ?? "";
          el.textContent = `${end}${suffix}`;
        });
      };
    },
  });

  return (
    <section
      ref={sectionRef}
      id="stats"
      className="relative overflow-hidden bg-white pb-16 pt-8 lg:pb-20 lg:pt-10 dark:bg-allure-petrol-deep"
    >
      <SectionSeam
        edges="top"
        from={SEAM.white}
        fromDark={SEAM.petrolDeep}
      />
      <div className="relative z-[2] mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {STATS.map((stat, i) => {
            const isActive = hovered === i;
            return (
              <div
                key={stat.label}
                data-reveal="item"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(2)}
                className={cn(
                  "rounded-2xl bg-allure-sand px-5 py-8 text-center transition-all duration-300 dark:bg-allure-petrol",
                  isActive
                    ? "ring-1 ring-allure-petrol/15 dark:ring-allure-gold/25"
                    : "opacity-80"
                )}
              >
                <div
                  data-count={stat.value}
                  data-suffix={stat.suffix}
                  className={cn(
                    "font-heading text-3xl transition-colors lg:text-4xl",
                    isActive
                      ? "text-allure-petrol dark:text-allure-gold"
                      : "text-allure-petrol/80 dark:text-allure-sand/80"
                  )}
                >
                  {stat.value}
                  {stat.suffix}
                </div>
                <p
                  data-stat-label
                  className="mt-2 font-sans text-xs text-allure-petrol/55 dark:text-allure-sand/55"
                >
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        <div data-reveal="item" className="mt-10 flex justify-center lg:mt-12">
          <HomeCtaRow
            primary={{
              label: "Découvrir les typologies",
              href: "/#appartements",
            }}
            secondary={{
              label: "Appartements témoins",
              href: "/appartements-temoins",
            }}
          />
        </div>
      </div>
    </section>
  );
}
