"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import { RESIDENCE_COPY } from "@/lib/residence";

export function ResidenceCta() {
  const ref = useRef<HTMLElement>(null);
  useSectionReveal(ref, { threshold: 0.2 });

  return (
    <section
      ref={ref}
      className="bg-allure-sand py-16 dark:bg-allure-petrol sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-6">
        <h2
          data-split="lines,words"
          data-split-animate="words"
          className="font-heading text-3xl text-allure-petrol dark:text-allure-sand sm:text-4xl"
        >
          {RESIDENCE_COPY.ctaTitle}
        </h2>
        <p
          data-reveal="text"
          className="mx-auto mt-4 max-w-md font-sans text-sm leading-relaxed text-allure-ink/60 dark:text-allure-sand/60"
        >
          {RESIDENCE_COPY.ctaBody}
        </p>
        <div
          data-reveal="item"
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button asChild size="lg" className="btn-cta">
            <Link href="/rendez-vous">
              Planifier un rendez-vous
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </Button>
          <Button asChild size="lg" className="btn-cta-outline">
            <Link href="/brochure">Feuilleter la brochure</Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="text-allure-petrol dark:text-allure-sand">
            <Link href="/les-appartements">Voir les appartements</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
