"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Download } from "lucide-react";
import { MediaImage } from "@/components/ui/media-image";
import { Button } from "@/components/ui/button";
import { SectionSeam, SEAM } from "@/components/ui/section-seam";
import { MediaLightbox } from "@/components/avancement/media-lightbox";
import type { TemoinDetail } from "@/data/temoins";

type TemoinPlanProps = {
  temoin: TemoinDetail;
};

export function TemoinPlan({ temoin }: TemoinPlanProps) {
  const [open, setOpen] = useState(false);
  if (!temoin.planImage && !temoin.planPdf) return null;

  const images = temoin.planImage
    ? [
        {
          src: temoin.planImage,
          alt: `Plan — ${temoin.typologyLabel}`,
        },
      ]
    : [];

  return (
    <section
      id="plan"
      className="relative overflow-hidden bg-allure-sand py-16 dark:bg-allure-petrol sm:py-24"
    >
      <SectionSeam edges="top" from={SEAM.white} fromDark={SEAM.petrolDeep} />

      <div className="relative z-[1] mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="font-sans text-xs uppercase tracking-[0.28em] text-allure-gold">
              Plan d’étage
            </p>
            <h2 className="mt-3 font-heading text-3xl text-allure-petrol dark:text-allure-sand sm:text-4xl">
              Lire le témoin au sol
            </h2>
            <p className="mt-3 font-sans text-base leading-relaxed text-allure-ink/75 dark:text-allure-sand/80">
              Plan Floor 1 du show flat Almadies — agrandissez pour les volumes,
              téléchargez le PDF, ou ouvrez le plan interactif de la typologie.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            {temoin.planPdf ? (
              <Button asChild size="lg" className="btn-cta">
                <a href={temoin.planPdf} download>
                  Télécharger le PDF
                  <Download className="size-4" aria-hidden />
                </a>
              </Button>
            ) : null}
            {temoin.planHref ? (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-allure-petrol/20 dark:border-allure-sand/25"
              >
                <Link href={temoin.planHref}>
                  Plan interactif
                  <ArrowUpRight className="size-4" aria-hidden />
                </Link>
              </Button>
            ) : null}
          </div>
        </div>

        {temoin.planImage ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="relative mt-10 block w-full overflow-hidden rounded-[1.75rem] bg-white ring-1 ring-allure-petrol/10 dark:bg-allure-petrol-deep dark:ring-white/10"
            aria-label="Agrandir le plan"
          >
            <div className="relative aspect-[4/3] min-h-[16rem] sm:aspect-[16/10]">
              <MediaImage
                src={temoin.planImage}
                alt={`Plan — ${temoin.typologyLabel}`}
                fill
                sizes="(min-width: 1024px) 80vw, 100vw"
                className="object-contain p-4 sm:p-8"
              />
            </div>
          </button>
        ) : null}
      </div>

      {images.length > 0 ? (
        <MediaLightbox
          images={images}
          index={0}
          open={open}
          onClose={() => setOpen(false)}
          onIndexChange={() => undefined}
        />
      ) : null}
    </section>
  );
}
