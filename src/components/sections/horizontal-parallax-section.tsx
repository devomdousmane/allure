"use client";

import { useRef } from "react";
import { MediaImage } from "@/components/ui/media-image";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { SectionSeam, SEAM } from "@/components/ui/section-seam";
import {
  JOURNEY,
  PanelChantier,
  PanelFacade,
  PanelLivraison,
  useHorizonScroll,
} from "@/components/sections/journey";

function renderPanel(panel: (typeof JOURNEY)[number]) {
  switch (panel.id) {
    case "chantier":
      return <PanelChantier key={panel.id} panel={panel} />;
    case "facade":
      return <PanelFacade key={panel.id} panel={panel} />;
    case "livraison":
      return <PanelLivraison key={panel.id} panel={panel} />;
  }
}

/**
 * Horizon Journey — pin/scroll + panels (recréés un à un).
 * Pas de chrome orphelin : uniquement le contenu des panels.
 */
export function HorizontalParallaxSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useHorizonScroll({
    sectionRef,
    viewportRef,
    trackRef,
    enabled: reduced === false,
  });

  if (reduced === true) {
    return (
      <section
        id="dakar"
        aria-label="Chantier Allure — gros œuvre, façade, livraison"
        className="relative bg-allure-sand py-16 sm:py-24 dark:bg-allure-petrol-deep"
      >
        <div className="mx-auto max-w-6xl px-6">
          <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-allure-gold">
            L’avancement en trois temps
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {JOURNEY.map((m) => (
              <li
                key={m.id}
                className="relative min-h-[9rem] overflow-hidden rounded-2xl p-5"
              >
                <div
                  aria-hidden
                  className="absolute inset-0 dark:hidden"
                  style={{ backgroundColor: m.bg.light }}
                />
                <div
                  aria-hidden
                  className="absolute inset-0 hidden dark:block"
                  style={{ backgroundColor: m.bg.dark }}
                />
                <MediaImage
                  src={m.image}
                  alt=""
                  fill
                  sizes="33vw"
                  loaderTone="gold"
                  loaderSize="sm"
                  className="object-cover opacity-40"
                />
                <div className="relative">
                  <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-allure-gold">
                    {m.phase}
                  </p>
                  <p className="mt-1 font-heading text-lg text-allure-petrol dark:text-allure-sand">
                    {m.headline}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  if (reduced !== false) {
    return (
      <section
        id="dakar"
        aria-hidden
        className="relative h-[100svh] bg-allure-sand dark:bg-allure-petrol-deep"
      />
    );
  }

  return (
    <section
      ref={sectionRef}
      id="dakar"
      aria-label="Chantier Allure — du gros œuvre à la livraison"
      className="relative z-10 overflow-hidden bg-allure-sand dark:bg-allure-petrol-deep"
    >
      <SectionSeam
        edges="top"
        from={SEAM.sand}
        fromDark={SEAM.petrol}
      />

      <div
        ref={viewportRef}
        className="relative h-[100svh] w-full overflow-hidden"
      >
        <div ref={trackRef} className="flex h-full will-change-transform">
          {JOURNEY.map((panel) => renderPanel(panel))}
        </div>
      </div>
    </section>
  );
}
