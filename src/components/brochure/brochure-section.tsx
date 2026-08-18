"use client";

import { useRef } from "react";
import { BrochureFlipBook } from "@/components/brochure/brochure-flip-book";
import { SectionSeam, SEAM } from "@/components/ui/section-seam";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import type { FlipBookData } from "@/data/flipbook-types";
import { cn } from "@/lib/utils";

type BrochureSectionProps = {
  /** Couleur de la section précédente (seam haut) */
  from?: string;
  fromDark?: string;
  className?: string;
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  book?: FlipBookData;
  pdfHref?: string;
};

/**
 * Section marketing autour d’un livre feuilletable.
 */
export function BrochureSection({
  from = SEAM.white,
  fromDark = SEAM.petrolDeep,
  className,
  id = "brochure",
  eyebrow = "Brochure",
  title = "Feuilletez le programme",
  description = "Un livre interactif de la Résidence Allure — plans, prestations et atmosphère des Almadies.",
  book,
  pdfHref,
}: BrochureSectionProps) {
  const ref = useRef<HTMLElement>(null);
  useSectionReveal(ref, { threshold: 0.08 });

  return (
    <section
      ref={ref}
      id={id}
      className={cn(
        "relative overflow-hidden bg-allure-sand py-20 dark:bg-allure-petrol-deep lg:py-28",
        className
      )}
    >
      <SectionSeam edges="top" from={from} fromDark={fromDark} />

      <div className="relative z-[2] mx-auto max-w-6xl px-5 sm:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
          <p
            data-reveal="eyebrow"
            className="font-sans text-xs uppercase tracking-[0.3em] text-allure-gold"
          >
            {eyebrow}
          </p>
          <h2
            data-split="lines,words"
            data-split-animate="words"
            className="mt-3 font-heading text-3xl text-allure-petrol sm:text-4xl dark:text-allure-sand"
          >
            {title}
          </h2>
          <p
            data-split="lines,words"
            data-split-animate="words"
            className="mt-4 font-sans text-sm text-allure-ink/65 dark:text-allure-sand/65"
          >
            {description}
          </p>
        </div>

        <BrochureFlipBook book={book} pdfHref={pdfHref} />
      </div>
    </section>
  );
}
