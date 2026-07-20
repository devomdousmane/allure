"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionSeam, SEAM } from "@/components/ui/section-seam";
import { APARTMENTS } from "@/lib/apartments";
import { cn } from "@/lib/utils";
import { useSectionReveal } from "@/hooks/use-section-reveal";

const TABS = [
  { id: "all", label: "Tous" },
  { id: "studio", label: "Studio" },
  { id: "type-a", label: "Type A" },
  { id: "type-b", label: "Type B" },
  { id: "type-c", label: "Type C" },
  { id: "type-d", label: "Type D" },
] as const;

export function ApartmentsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("all");
  useSectionReveal(sectionRef);

  const items = useMemo(() => {
    if (tab === "all") return APARTMENTS;
    return APARTMENTS.filter((a) => a.slug === tab);
  }, [tab]);

  return (
    <section
      ref={sectionRef}
      id="appartements"
      className="relative bg-allure-sand py-24 lg:py-32 dark:bg-allure-petrol"
    >
      <SectionSeam from={SEAM.white} fromDark={SEAM.petrolDeep} />
      <div className="relative z-[2] mx-auto max-w-6xl px-6">
        <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p
              data-reveal="eyebrow"
              className="font-sans text-xs uppercase tracking-[0.3em] text-allure-gold"
            >
              Projets & typologies
            </p>
            <h2
              data-split="lines,words"
              data-split-animate="words"
              className="mt-4 max-w-lg font-heading text-3xl text-allure-petrol sm:text-4xl dark:text-allure-sand"
            >
              Un design unique, cinq façons d&rsquo;habiter Allure
            </h2>
          </div>
          <div data-reveal="item">
            <Button
              asChild
              variant="ghost"
              className="px-0 text-allure-petrol hover:bg-transparent hover:text-allure-gold dark:text-allure-sand"
            >
              <Link href="/les-appartements">
                Toutes les fiches
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div data-reveal="item" className="mb-10 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "rounded-full px-4 py-2 font-sans text-xs uppercase tracking-[0.1em] transition-colors",
                tab === t.id
                  ? "bg-allure-petrol text-white dark:bg-allure-gold dark:text-allure-petrol-deep"
                  : "bg-allure-sand text-allure-ink/55 hover:text-allure-petrol dark:bg-allure-petrol dark:text-allure-sand/55 dark:hover:text-allure-sand"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {items.map((apt, i) => (
              <motion.article
                key={apt.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.45, delay: (i % 4) * 0.05 }}
                className={cn(
                  "group relative overflow-hidden rounded-[1.5rem]",
                  tab === "all" && i === 0 ? "sm:col-span-2 lg:col-span-1" : ""
                )}
              >
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src={apt.image}
                    alt={apt.type}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-allure-petrol-deep/80 via-allure-petrol-deep/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="font-heading text-lg text-white">{apt.type}</p>
                    <p className="mt-1 line-clamp-2 font-sans text-xs text-white/70">
                      {apt.desc}
                    </p>
                    <Link
                      href={`/les-appartements#${apt.slug}`}
                      className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 font-sans text-xs font-medium text-allure-petrol transition-colors hover:bg-allure-gold"
                    >
                      Voir
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
