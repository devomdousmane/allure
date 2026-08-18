"use client";

import { useCallback, useState } from "react";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { MediaImage } from "@/components/ui/media-image";
import { Button } from "@/components/ui/button";
import { SectionSeam, SEAM } from "@/components/ui/section-seam";
import type { TemoinDetail } from "@/data/temoins";
import { cn } from "@/lib/utils";

type TemoinDossierProps = {
  temoin: TemoinDetail;
};

export function TemoinDossier({ temoin }: TemoinDossierProps) {
  const pages = temoin.dossierPages?.filter((p) => p.src) ?? [];
  const [active, setActive] = useState(0);

  const count = pages.length;
  const current = pages[active];

  const go = useCallback(
    (delta: number) => {
      if (!count) return;
      setActive((i) => (i + delta + count) % count);
    },
    [count]
  );

  if (!current || !temoin.dossierPdf) return null;

  return (
    <section
      id="dossier"
      className="relative overflow-hidden bg-white py-16 dark:bg-allure-petrol-deep sm:py-24"
    >
      <SectionSeam edges="top" from={SEAM.sand} fromDark={SEAM.petrol} />

      <div className="relative z-[1] mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="font-sans text-xs uppercase tracking-[0.28em] text-allure-gold">
              Dossier
            </p>
            <h2 className="mt-3 font-heading text-3xl text-allure-petrol dark:text-allure-sand sm:text-4xl">
              Feuilleter le rapport
            </h2>
            <p className="mt-3 font-sans text-sm text-allure-ink/55 dark:text-allure-sand/55">
              Aperçu du dossier Type A — téléchargez le PDF pour l’envoyer ou
              l’imprimer.
            </p>
          </div>
          <Button asChild size="lg" className="btn-cta">
            <a href={temoin.dossierPdf} download>
              Télécharger le PDF
              <Download className="size-4" aria-hidden />
            </a>
          </Button>
        </div>

        <div className="relative mt-10 overflow-hidden rounded-[1.75rem] bg-allure-sand/60 ring-1 ring-allure-petrol/10 dark:bg-allure-petrol dark:ring-white/10">
          <div className="relative aspect-[4/3] min-h-[18rem] sm:aspect-[11/8.5]">
            <MediaImage
              src={current.src}
              alt={current.alt}
              fill
              sizes="(min-width: 1024px) 80vw, 100vw"
              className="object-contain p-3 sm:p-6"
              priority={active === 0}
            />
          </div>

          {count > 1 ? (
            <>
              <button
                type="button"
                aria-label="Page précédente"
                onClick={() => go(-1)}
                className="absolute left-3 top-1/2 z-[2] flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-allure-petrol/15 bg-white/90 text-allure-petrol backdrop-blur-md transition hover:border-allure-gold/50 hover:text-allure-gold dark:border-white/20 dark:bg-allure-petrol-deep/80 dark:text-white sm:left-5"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                aria-label="Page suivante"
                onClick={() => go(1)}
                className="absolute right-3 top-1/2 z-[2] flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-allure-petrol/15 bg-white/90 text-allure-petrol backdrop-blur-md transition hover:border-allure-gold/50 hover:text-allure-gold dark:border-white/20 dark:bg-allure-petrol-deep/80 dark:text-white sm:right-5"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          ) : null}
        </div>

        <p className="mt-4 font-sans text-xs uppercase tracking-[0.16em] text-allure-ink/40 dark:text-allure-sand/40">
          {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          <span className="mx-2 text-allure-gold">·</span>
          {current.alt}
        </p>

        {count > 1 ? (
          <div className="mt-5 flex gap-2.5 overflow-x-auto pb-1">
            {pages.map((page, i) => (
              <button
                key={page.src}
                type="button"
                onClick={() => setActive(i)}
                aria-label={page.alt}
                aria-current={i === active}
                className={cn(
                  "relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-allure-sand/80 transition duration-300 dark:bg-allure-petrol sm:h-24 sm:w-36",
                  i === active
                    ? "ring-2 ring-allure-gold ring-offset-2 ring-offset-white dark:ring-offset-allure-petrol-deep"
                    : "opacity-65 ring-1 ring-allure-petrol/10 hover:opacity-100 dark:ring-allure-sand/15"
                )}
              >
                <MediaImage
                  src={page.src}
                  alt=""
                  fill
                  sizes="144px"
                  loaderSize="sm"
                  className="object-contain p-1"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
