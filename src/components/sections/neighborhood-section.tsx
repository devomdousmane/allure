"use client";

import dynamic from "next/dynamic";
import { useMemo, useRef, useState } from "react";
import { MediaImage } from "@/components/ui/media-image";
import { MapPin } from "lucide-react";
import { HeroExitFade, SectionSeam, SEAM } from "@/components/ui/section-seam";
import { HomeCtaRow } from "@/components/home-scroll/home-cta-row";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import { useCookieConsentOptional } from "@/components/legal/cookie-consent-provider";
import { Button } from "@/components/ui/button";
import {
  NEIGHBORHOOD_CATEGORIES,
  NEIGHBORHOOD_POIS,
  poisForCategory,
  type NeighborhoodCategory,
} from "@/lib/neighborhood";
import { cn } from "@/lib/utils";

const NeighborhoodMapbox = dynamic(
  () =>
    import("@/components/sections/neighborhood-mapbox").then(
      (m) => m.NeighborhoodMapbox
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[min(70vh,36rem)] w-full items-center justify-center rounded-[1.75rem] bg-allure-petrol/15 font-sans text-xs text-allure-ink/50 dark:bg-white/5 dark:text-allure-sand/50 lg:h-[min(75vh,42rem)]">
        Chargement de la carte…
      </div>
    ),
  }
);

export function NeighborhoodSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [category, setCategory] = useState<NeighborhoodCategory>("all");
  const [activePoiId, setActivePoiId] = useState<string | null>(null);

  const cookies = useCookieConsentOptional();
  const mapEnabled = cookies?.ready === true && cookies.consent?.mapbox === true;

  useSectionReveal(sectionRef, { debugId: "neighborhood" });

  const visiblePois = useMemo(() => poisForCategory(category), [category]);

  function selectCategory(next: NeighborhoodCategory) {
    setCategory(next);
    setActivePoiId(null);
  }

  function selectPoi(id: string) {
    const poi = NEIGHBORHOOD_POIS.find((p) => p.id === id);
    if (!poi) return;
    if (category !== "all" && poi.category !== category) {
      setCategory(poi.category);
    }
    setActivePoiId((cur) => (cur === id ? null : id));
  }

  return (
    <section
      id="quartier"
      ref={sectionRef}
      className="relative overflow-hidden py-24 lg:py-32"
    >
      <MediaImage
        src="/Allure/DJI_0250.webp"
        alt=""
        fill
        sizes="100vw"
        loaderTone="gold"
        loaderSize="md"
        className="object-cover object-center"
        priority={false}
      >
        <div className="absolute inset-0 bg-allure-sand/78 dark:bg-allure-petrol-deep/82" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-allure-sand/40 via-transparent to-allure-sand/55 dark:from-allure-petrol-deep/50 dark:via-transparent dark:to-allure-petrol-deep/60" />
      </MediaImage>

      <SectionSeam edges="top" from={SEAM.white} fromDark={SEAM.petrol} />
      <HeroExitFade
        to={SEAM.sand}
        toDark={SEAM.petrol}
        className="h-[36%] min-h-36 sm:min-h-44"
      />

      <div className="relative z-[2] mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-10">
        <div className="mx-auto mb-10 max-w-2xl text-center lg:mb-12">
          <p
            data-reveal="eyebrow"
            className="flex items-center justify-center gap-2 font-sans text-xs uppercase tracking-[0.3em] text-allure-gold"
          >
            <MapPin className="h-3.5 w-3.5" />
            Les Almadies, Dakar
          </p>
          <h2
            data-split="lines,words"
            data-split-animate="words"
            className="mt-4 font-heading text-3xl text-allure-petrol sm:text-4xl lg:text-5xl dark:text-white"
          >
            Tout à portée de main
          </h2>
          <p
            data-split="lines,words"
            data-split-animate="words"
            className="mt-5 font-sans text-sm text-allure-ink/60 dark:text-white/60"
          >
            Plage, écoles, santé, restaurants et transports — explorez le
            quartier autour d&rsquo;Allure. Cliquez une catégorie, puis un lieu
            sur la carte.
          </p>
        </div>

        {/* Filtres catégories */}
        <div
          data-reveal="item"
          className="mb-6 flex flex-wrap items-center justify-center gap-2"
          role="tablist"
          aria-label="Catégories du quartier"
        >
          {NEIGHBORHOOD_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const active = category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => selectCategory(cat.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-sans text-xs uppercase tracking-[0.1em] transition-colors",
                  active
                    ? "bg-allure-petrol text-white shadow-md dark:bg-[color-mix(in_oklab,var(--allure-gold)_72%,var(--allure-petrol-deep))] dark:text-allure-petrol-deep"
                    : "bg-white/80 text-allure-ink/60 ring-1 ring-allure-petrol/10 hover:text-allure-petrol dark:bg-allure-petrol-deep/70 dark:text-allure-sand/65 dark:ring-white/10 dark:hover:text-allure-sand"
                )}
              >
                <Icon className="size-3.5" strokeWidth={1.75} aria-hidden />
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div data-reveal="media" className="min-w-0">
            {mapEnabled ? (
              <NeighborhoodMapbox
                category={category}
                activePoiId={activePoiId}
                onSelectPoi={setActivePoiId}
              />
            ) : (
              <div className="flex h-[min(70vh,36rem)] w-full flex-col items-center justify-center gap-4 rounded-[1.75rem] border border-allure-petrol/10 bg-allure-petrol/10 px-6 text-center dark:border-white/10 dark:bg-white/5 lg:h-[min(75vh,42rem)]">
                <MapPin className="size-8 text-allure-gold" aria-hidden />
                <p className="max-w-sm font-sans text-sm leading-relaxed text-allure-ink/65 dark:text-allure-sand/65">
                  La carte interactive Mapbox n’est affichée qu’avec votre
                  accord (cookies non essentiels).
                </p>
                <Button
                  type="button"
                  size="sm"
                  className="min-h-11"
                  onClick={() => cookies?.enableMapbox()}
                >
                  Activer la carte
                </Button>
              </div>
            )}
            <p className="mt-4 text-center font-sans text-[11px] uppercase tracking-[0.18em] text-allure-petrol/45 dark:text-white/40 lg:text-left">
              {mapEnabled
                ? `Vue carte sombre · bâtiments 3D · ${visiblePois.length} lieu${visiblePois.length > 1 ? "x" : ""}`
                : "Carte en attente de consentement"}
            </p>
          </div>

          <div
            data-reveal="item"
            className="flex max-h-[min(75vh,42rem)] flex-col gap-2 overflow-y-auto rounded-[1.5rem] border border-allure-petrol/10 bg-white/85 p-3 backdrop-blur-md dark:border-white/10 dark:bg-allure-petrol-deep/75 sm:p-4"
          >
            <p className="px-2 pb-1 font-sans text-[10px] uppercase tracking-[0.22em] text-allure-gold">
              À proximité
            </p>
            <ul className="flex flex-col gap-1.5">
              {visiblePois.map((poi) => {
                const active = activePoiId === poi.id;
                const CatIcon =
                  NEIGHBORHOOD_CATEGORIES.find((c) => c.id === poi.category)
                    ?.icon ?? MapPin;
                return (
                  <li key={poi.id}>
                    <button
                      type="button"
                      onClick={() => selectPoi(poi.id)}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition-colors",
                        active
                          ? "bg-allure-petrol text-white dark:bg-allure-gold/20 dark:text-allure-sand"
                          : "hover:bg-allure-sand/80 dark:hover:bg-white/5"
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full",
                          active
                            ? "bg-white/15 text-allure-gold dark:bg-allure-gold/25"
                            : "bg-allure-sand text-allure-petrol dark:bg-white/10 dark:text-allure-gold"
                        )}
                      >
                        <CatIcon className="size-4" strokeWidth={1.75} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-baseline justify-between gap-2">
                          <span
                            className={cn(
                              "font-heading text-sm",
                              active
                                ? "text-white dark:text-allure-sand"
                                : "text-allure-petrol dark:text-allure-sand"
                            )}
                          >
                            {poi.label}
                          </span>
                          <span
                            className={cn(
                              "shrink-0 font-sans text-[11px] tabular-nums",
                              active
                                ? "text-allure-gold"
                                : "text-allure-gold dark:text-allure-gold"
                            )}
                          >
                            {poi.distance}
                          </span>
                        </span>
                        <span
                          className={cn(
                            "mt-0.5 block font-sans text-xs leading-snug",
                            active
                              ? "text-white/70 dark:text-allure-sand/65"
                              : "text-allure-ink/50 dark:text-allure-sand/50"
                          )}
                        >
                          {poi.detail}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div data-reveal="item" className="mt-12 lg:mt-16">
          <HomeCtaRow
            primary={{
              label: "Réserver une visite",
              href: "/rendez-vous",
            }}
            secondary={{
              label: "Voir les typologies",
              href: "/#appartements",
            }}
          />
        </div>
      </div>
    </section>
  );
}
