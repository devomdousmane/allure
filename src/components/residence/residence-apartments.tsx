"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import { RESIDENCE_COPY } from "@/lib/residence";
import { TEMOIN_MEDIA } from "@/lib/media";

const TEASERS = [
  {
    src: TEMOIN_MEDIA.salon1,
    alt: "Salon lumineux",
    caption: "Volumes & lumière",
  },
  {
    src: TEMOIN_MEDIA.cuisine1,
    alt: "Cuisine contemporaine",
    caption: "Cuisine ouverte",
  },
  {
    src: TEMOIN_MEDIA.chambre1,
    alt: "Chambre",
    caption: "Suites calmes",
  },
] as const;

/** Appartements de luxe — teaser vers /les-appartements. */
export function ResidenceApartments() {
  const ref = useRef<HTMLElement>(null);
  useSectionReveal(ref, { threshold: 0.15 });

  return (
    <section
      ref={ref}
      id="appartements-luxe"
      className="bg-white py-16 dark:bg-allure-petrol-deep sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <p
              data-reveal="eyebrow"
              className="font-sans text-xs uppercase tracking-[0.3em] text-allure-gold"
            >
              {RESIDENCE_COPY.apartmentsEyebrow}
            </p>
            <h2
              data-split="lines,words"
              data-split-animate="words"
              className="mt-3 font-heading text-3xl text-allure-petrol dark:text-allure-sand sm:text-4xl"
            >
              {RESIDENCE_COPY.apartmentsTitle}
            </h2>
            <p
              data-reveal="text"
              className="mt-5 font-sans text-sm leading-relaxed text-allure-ink/65 dark:text-allure-sand/65"
            >
              {RESIDENCE_COPY.apartmentsBody}
            </p>
            <p
              data-reveal="text"
              className="mt-3 font-sans text-sm leading-relaxed text-allure-ink/55 dark:text-allure-sand/55"
            >
              {RESIDENCE_COPY.apartmentsBodyAlt}
            </p>
            <div data-reveal="item" className="mt-8">
              <Button asChild size="lg" className="btn-cta">
                <Link href="/les-appartements">
                  Voir les typologies
                  <ArrowUpRight className="size-4" aria-hidden />
                </Link>
              </Button>
            </div>
          </div>

          <div
            data-reveal="media"
            className="grid grid-cols-3 gap-2 sm:gap-3 lg:col-span-7"
          >
            {TEASERS.map((t, i) => (
              <div
                key={t.src}
                className={
                  i === 0
                    ? "relative col-span-2 aspect-[4/5] overflow-hidden bg-allure-petrol/5 sm:aspect-[5/6]"
                    : "relative aspect-[3/4] overflow-hidden bg-allure-petrol/5"
                }
              >
                <Image
                  src={t.src}
                  alt={t.alt}
                  fill
                  sizes="(min-width: 1024px) 28vw, 40vw"
                  className="object-cover"
                />
                <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-allure-petrol-deep/75 to-transparent px-3 py-3 font-sans text-[0.65rem] uppercase tracking-[0.16em] text-white">
                  {t.caption}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
