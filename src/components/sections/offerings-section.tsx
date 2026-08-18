"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MediaImage } from "@/components/ui/media-image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { TEMOIN_MEDIA } from "@/lib/media";
import { SectionSeam, SEAM } from "@/components/ui/section-seam";
import { useSectionReveal } from "@/hooks/use-section-reveal";

type Offering = {
  id: string;
  title: string;
  description: string;
  href: string;
  image: string;
  imageAlt: string;
};

const OFFERINGS: Offering[] = [
  {
    id: "visite",
    title: "Visite sur rendez-vous",
    description: "Découvrez le showroom, les plans et les finitions sur place.",
    href: "/rendez-vous",
    image: TEMOIN_MEDIA.salon2,
    imageAlt: "Visite de la Résidence Allure",
  },
  {
    id: "diaspora",
    title: "Accompagnement diaspora",
    description: "Achat à distance, suivi et conseils jusqu’à la remise des clés.",
    href: "/rendez-vous?type=visio",
    image: TEMOIN_MEDIA.chambre2,
    imageAlt: "Accompagnement des acquéreurs diaspora",
  },
  {
    id: "chantier",
    title: "Suivi de chantier",
    description: "Photos et jalons réguliers pour suivre l’avancement en transparence.",
    href: "/avancement",
    image: "/Allure/HD_137.webp",
    imageAlt: "Avancement du chantier Allure",
  },
  {
    id: "conseil",
    title: "Conseil personnalisé",
    description: "Une équipe dédiée pour typologie, financement et formalités.",
    href: "/rendez-vous",
    image: TEMOIN_MEDIA.axo1,
    imageAlt: "Conseil commercial Résidence Allure",
  },
];

function PetalMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M32 8c4 8 4 16 0 24-4-8-4-16 0-24Z" />
      <path d="M32 8c4 8 4 16 0 24-4-8-4-16 0-24Z" transform="rotate(72 32 32)" />
      <path d="M32 8c4 8 4 16 0 24-4-8-4-16 0-24Z" transform="rotate(144 32 32)" />
      <path d="M32 8c4 8 4 16 0 24-4-8-4-16 0-24Z" transform="rotate(216 32 32)" />
      <path d="M32 8c4 8 4 16 0 24-4-8-4-16 0-24Z" transform="rotate(288 32 32)" />
      <circle cx="32" cy="32" r="4" />
    </svg>
  );
}

function FloatingOfferCard({
  offering,
  y,
}: {
  offering: Offering;
  y: number;
}) {
  return (
    <motion.div
      className="pointer-events-none absolute right-2 top-0 z-20 hidden w-[200px] lg:block xl:right-0 xl:w-[220px]"
      initial={false}
      animate={{ y: Math.max(0, y - 90) }}
      transition={{ type: "spring", stiffness: 340, damping: 30, mass: 0.65 }}
      style={{ willChange: "transform" }}
    >
      <div className="relative rotate-[8deg]">
        <div className="relative aspect-[5/4] overflow-hidden rounded-xl bg-allure-sand ring-1 ring-allure-petrol/10 dark:bg-allure-petrol dark:ring-allure-sand/15">
          <AnimatePresence initial={false} mode="sync">
            <motion.div
              key={offering.image}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <MediaImage
                src={offering.image}
                alt={offering.imageAlt}
                fill
                sizes="220px"
                quality={85}
                loaderSize="sm"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-allure-petrol-deep/55 via-allure-petrol-deep/15 to-transparent" />
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={offering.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              className="absolute bottom-2.5 left-3 right-3 font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-white/95"
            >
              {offering.title}
            </motion.p>
          </AnimatePresence>
        </div>

        <div
          aria-hidden
          className="absolute -inset-px -z-10 translate-x-1.5 translate-y-2.5 rounded-xl bg-allure-petrol/12 blur-[1.5px] dark:bg-black/35"
        />
      </div>
    </motion.div>
  );
}

export function OfferingsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState(OFFERINGS[1]?.id ?? OFFERINGS[0].id);
  const active = OFFERINGS.find((o) => o.id === activeId) ?? OFFERINGS[0];
  const listRef = useRef<HTMLUListElement>(null);
  const rowRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [cardY, setCardY] = useState(0);

  useSectionReveal(sectionRef, { debugId: "offerings" });

  const updateCardY = () => {
    const idx = OFFERINGS.findIndex((o) => o.id === activeId);
    const row = rowRefs.current[idx];
    const list = listRef.current;
    if (!row || !list) return;
    const listTop = list.getBoundingClientRect().top;
    const rowRect = row.getBoundingClientRect();
    setCardY(rowRect.top - listTop + rowRect.height / 2);
  };

  useLayoutEffect(() => {
    updateCardY();
  }, [activeId]);

  useEffect(() => {
    const onResize = () => updateCardY();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeId]);

  return (
    <section
      ref={sectionRef}
      id="accompagnement"
      className="relative overflow-hidden bg-white py-24 lg:py-32 dark:bg-allure-petrol-deep"
    >
      <SectionSeam
        edges="top"
        from={SEAM.white}
        fromDark={SEAM.petrolDeep}
      />
      <PetalMark className="pointer-events-none absolute -left-8 top-16 z-[1] h-56 w-56 text-allure-petrol/[0.04] dark:text-allure-gold/[0.06]" />

      <div className="relative z-[2] mx-auto max-w-5xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span
            data-reveal="eyebrow"
            className="inline-flex items-center gap-2 rounded-full border border-allure-petrol/10 bg-allure-sand px-4 py-1.5 font-sans text-xs text-allure-petrol/70 dark:border-allure-sand/15 dark:bg-white/5 dark:text-allure-sand/70"
          >
            <span className="h-1 w-1 rounded-full bg-allure-gold" />
            Accompagnement
          </span>
          <h2
            data-split="lines,words"
            data-split-animate="words"
            className="mt-6 font-heading text-3xl text-allure-petrol sm:text-4xl lg:text-5xl dark:text-allure-sand"
          >
            Que proposons-nous&nbsp;?
          </h2>
          <p
            data-split="lines,words"
            data-split-animate="words"
            className="mt-4 font-sans text-sm text-allure-ink/55 dark:text-allure-sand/55"
          >
            De la première visite à la remise des clés — un parcours clair,
            pour résidents comme pour la diaspora.
          </p>
        </div>

        <div className="relative">
          <FloatingOfferCard offering={active} y={cardY} />

          <ul
            ref={listRef}
            className="relative z-10 divide-y divide-allure-petrol/10 lg:pr-[240px] xl:pr-[260px] dark:divide-allure-sand/10"
          >
            {OFFERINGS.map((item, index) => {
              const isActive = item.id === activeId;
              const num = String(index + 1).padStart(2, "0");

              return (
                <li
                  key={item.id}
                  data-reveal="item"
                  ref={(el) => {
                    rowRefs.current[index] = el;
                  }}
                >
                  <div
                    role="button"
                    tabIndex={0}
                    onMouseEnter={() => setActiveId(item.id)}
                    onFocus={() => setActiveId(item.id)}
                    onClick={() => setActiveId(item.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActiveId(item.id);
                      }
                    }}
                    className={cn(
                      "group grid cursor-pointer grid-cols-1 items-center gap-3 py-7 transition-colors duration-300 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,1.35fr)_5.5rem] sm:gap-6",
                      isActive
                        ? "text-allure-petrol dark:text-allure-sand"
                        : "text-allure-ink/35 dark:text-allure-sand/35"
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <PetalMark
                        className={cn(
                          "h-5 w-5 shrink-0 transition-all duration-300",
                          isActive
                            ? "scale-100 opacity-100 text-allure-gold"
                            : "scale-75 opacity-0"
                        )}
                      />
                      <span
                        className={cn(
                          "truncate font-heading text-xl transition-all duration-300 sm:text-2xl",
                          isActive && "font-semibold"
                        )}
                      >
                        {item.title}
                      </span>
                    </div>

                    <p
                      className={cn(
                        "min-w-0 font-sans text-sm leading-snug transition-colors duration-300 sm:truncate",
                        isActive
                          ? "text-allure-ink/70 dark:text-allure-sand/70"
                          : "text-inherit"
                      )}
                    >
                      {item.description}
                    </p>

                    <div className="flex h-5 items-center justify-start sm:justify-end">
                      {isActive ? (
                        <Link
                          href={item.href}
                          className="relative z-30 font-sans text-sm font-medium text-allure-petrol underline-offset-4 transition-colors hover:text-allure-gold hover:underline dark:text-allure-gold"
                          onClick={(e) => e.stopPropagation()}
                        >
                          En savoir plus
                        </Link>
                      ) : (
                        <span className="font-sans text-sm tracking-wide tabular-nums">
                          {num}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div data-reveal="media" className="mt-8 lg:hidden">
            <div className="relative mx-auto aspect-[5/4] max-w-sm overflow-hidden rounded-xl ring-1 ring-allure-petrol/10 dark:ring-allure-sand/15">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0"
                >
                  <MediaImage
                    src={active.image}
                    alt={active.imageAlt}
                    fill
                    sizes="400px"
                    loaderSize="sm"
                    className="object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-allure-petrol-deep/55 to-transparent" />
                  <p className="absolute bottom-3 left-4 font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-white">
                    {active.title}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <p
          data-reveal="text"
          className="relative mt-16 flex items-center justify-center gap-2 text-center font-sans text-xs text-allure-petrol/50 dark:text-allure-sand/50"
        >
          <PetalMark className="h-4 w-4 text-allure-gold" />
          Des acquéreurs satisfaits, à Dakar comme depuis la diaspora.
        </p>
      </div>
    </section>
  );
}
