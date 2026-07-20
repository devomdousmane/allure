"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";
import { registerGsap } from "@/lib/gsap/register";
import { DURATION, EASE, STAGGER } from "@/lib/gsap/presets";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

registerGsap();

const STATS = [
  { value: 5, suffix: "", label: "Typologies d'appartements" },
  { value: 300, suffix: " m", label: "De la plage des Almadies" },
  { value: 13, suffix: "", label: "Services & prestations" },
  { value: 2026, suffix: "", label: "Livraison prévue" },
] as const;

export function StatsBand() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState<number | null>(2);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root || reduced === null) return;

      const soft = reduced === true;
      const cards = root.querySelectorAll<HTMLElement>("[data-reveal='item']");
      const values = root.querySelectorAll<HTMLElement>("[data-count]");
      let played = false;

      const play = () => {
        if (played) return;
        played = true;

        const tl = gsap.timeline({ defaults: { ease: soft ? "none" : EASE.out } });

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

        if (soft) return;

        values.forEach((el, i) => {
          const end = Number(el.dataset.count ?? 0);
          const suffix = el.dataset.suffix ?? "";
          const obj = { n: 0 };

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
      };

      const st = ScrollTrigger.create({
        trigger: root,
        start: "top 82%",
        once: true,
        onEnter: play,
        onRefresh: (self) => {
          if (self.progress > 0) play();
        },
      });

      const rect = root.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.82) {
        requestAnimationFrame(play);
      }

      const failsafe = window.setTimeout(() => {
        if (!played) play();
      }, 2500);

      return () => {
        window.clearTimeout(failsafe);
        st.kill();
      };
    },
    { scope: sectionRef, dependencies: [reduced] }
  );

  return (
    <section
      ref={sectionRef}
      id="stats"
      className="relative bg-white pb-16 pt-8 lg:pb-20 lg:pt-10 dark:bg-allure-petrol-deep"
    >
      <div className="mx-auto max-w-6xl px-6">
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
                <p className="mt-2 font-sans text-xs text-allure-petrol/55 dark:text-allure-sand/55">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
