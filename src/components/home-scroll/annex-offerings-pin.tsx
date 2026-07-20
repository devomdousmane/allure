"use client";

import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerGsap } from "@/lib/gsap/register";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

registerGsap();

const CAPTIONS = [
  { id: "accompagnement", line: "Un parcours clair, de la visite à la remise des clés." },
  { id: "services", line: "Showroom, diaspora, suivi chantier — à votre rythme." },
];

/** Sticky caption — appears with Offerings, updates through Services, then hides. */
export function AnnexOfferingsPin() {
  const [caption, setCaption] = useState(CAPTIONS[0].line);
  const [visible, setVisible] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced === null) return;

    const triggers: ScrollTrigger[] = [];

    const show = ScrollTrigger.create({
      trigger: "#accompagnement",
      endTrigger: "#services",
      start: "top 75%",
      end: "bottom 25%",
      onToggle: (self) => setVisible(self.isActive),
    });
    triggers.push(show);
    setVisible(show.isActive);

    CAPTIONS.forEach((item) => {
      const el = document.getElementById(item.id);
      if (!el) return;
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 45%",
          onToggle: (self) => {
            if (self.isActive) setCaption(item.line);
          },
        })
      );
    });

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => triggers.forEach((t) => t.kill());
  }, [reduced]);

  return (
    <div
      className="pointer-events-none absolute inset-y-0 right-0 z-[6] hidden w-44 lg:block"
      aria-hidden
    >
      <div
        className={cn(
          "sticky top-[42%] mr-3 max-w-[10.5rem] border-l border-allure-gold/40 pl-3 transition-all duration-500 xl:mr-6",
          visible
            ? "translate-x-0 opacity-100"
            : "translate-x-3 opacity-0"
        )}
      >
        <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-allure-gold">
          Fil narratif
        </p>
        <p
          key={caption}
          className="mt-3 font-heading text-xs leading-snug text-allure-petrol/70 dark:text-allure-sand/70"
        >
          {caption}
        </p>
      </div>
    </div>
  );
}
