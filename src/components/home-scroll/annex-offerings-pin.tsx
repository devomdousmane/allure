"use client";

import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerGsap } from "@/lib/gsap/register";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

registerGsap();

const CAPTIONS = [
  {
    id: "accompagnement",
    line: "Un parcours clair, de la visite à la remise des clés.",
  },
  {
    id: "services",
    line: "Showroom, diaspora, suivi chantier — à votre rythme.",
  },
] as const;

function syncCaption(
  accompagnement: HTMLElement,
  services: HTMLElement,
  setCaption: (line: string) => void
) {
  const mid = window.innerHeight * 0.55;
  const servicesRect = services.getBoundingClientRect();
  const servicesInView =
    servicesRect.top < mid && servicesRect.bottom > mid * 0.85;

  if (servicesInView) {
    setCaption(CAPTIONS[1].line);
    return;
  }

  const accRect = accompagnement.getBoundingClientRect();
  const accInView = accRect.top < mid && accRect.bottom > mid * 0.85;
  if (accInView) {
    setCaption(CAPTIONS[0].line);
  }
}

/** Sticky caption — visible sur Offre + Services, rejoue au scroll up. */
export function AnnexOfferingsPin() {
  const [caption, setCaption] = useState<string>(CAPTIONS[0].line);
  const [visible, setVisible] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced === null) return;

    const accompagnement = document.getElementById("accompagnement");
    const services = document.getElementById("services");
    if (!accompagnement || !services) return;

    const triggers: ScrollTrigger[] = [];

    const show = ScrollTrigger.create({
      trigger: accompagnement,
      endTrigger: services,
      start: "top 75%",
      end: "bottom 25%",
      invalidateOnRefresh: true,
      onEnter: () => setVisible(true),
      onLeave: () => setVisible(false),
      onEnterBack: () => setVisible(true),
      onLeaveBack: () => setVisible(false),
    });
    triggers.push(show);

    const track = ScrollTrigger.create({
      trigger: accompagnement,
      endTrigger: services,
      start: "top bottom",
      end: "bottom top",
      invalidateOnRefresh: true,
      onUpdate: () => syncCaption(accompagnement, services, setCaption),
    });
    triggers.push(track);

    const refresh = () => {
      ScrollTrigger.refresh();
      setVisible(show.isActive);
      syncCaption(accompagnement, services, setCaption);
    };

    setVisible(show.isActive);
    syncCaption(accompagnement, services, setCaption);
    requestAnimationFrame(refresh);
    const t1 = window.setTimeout(refresh, 400);
    const t2 = window.setTimeout(refresh, 1200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      triggers.forEach((t) => t.kill());
    };
  }, [reduced]);

  return (
    <div
      className="pointer-events-none absolute inset-y-0 right-0 z-[6] hidden w-44 overflow-hidden lg:block"
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
        <p className="mt-3 font-heading text-xs leading-snug text-allure-petrol/70 dark:text-allure-sand/70">
          {caption}
        </p>
      </div>
    </div>
  );
}
