"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ApartmentDetail } from "@/data/apartments/types";
import { shortApartmentName } from "@/data/apartments/format";

type ApartmentGalleryProps = {
  apartment: ApartmentDetail;
};

export function ApartmentGallery({ apartment }: ApartmentGalleryProps) {
  const [active, setActive] = useState(0);
  const images = apartment.gallery;
  if (!images.length) return null;

  const current = images[active] ?? images[0];
  const shortName = shortApartmentName(apartment.name);

  return (
    <section className="bg-white py-14 dark:bg-allure-petrol-deep sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div className="max-w-lg">
            <p className="font-sans text-xs uppercase tracking-[0.28em] text-allure-gold">
              Ambiances
            </p>
            <h2 className="mt-3 font-heading text-3xl text-allure-petrol dark:text-allure-sand sm:text-4xl">
              L’intérieur en images
            </h2>
            <p className="mt-3 hidden font-sans text-sm leading-relaxed text-allure-ink/65 dark:text-allure-sand/65 sm:block">
              Lumière, matières et volumes du {shortName}.
            </p>
          </div>
          <p className="shrink-0 font-sans text-xs tabular-nums text-allure-ink/40 dark:text-allure-sand/40">
            {String(active + 1).padStart(2, "0")}
            <span className="mx-1 text-allure-ink/20 dark:text-allure-sand/20">
              /
            </span>
            {String(images.length).padStart(2, "0")}
          </p>
        </div>

        <div className="mt-8 sm:mt-10">
          <div className="relative aspect-[4/3] overflow-hidden bg-allure-petrol/5 dark:bg-allure-sand/5 sm:aspect-[16/10]">
            <Image
              src={current.src}
              alt={current.alt}
              fill
              sizes="(min-width: 1024px) 72rem, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-allure-petrol-deep/75 to-transparent px-4 py-4 sm:px-6 sm:py-5">
              <p className="font-sans text-sm text-white/90">{current.alt}</p>
            </div>
          </div>

          <ul
            className={cn(
              "mt-3 grid gap-2 sm:mt-4 sm:gap-3",
              images.length <= 3
                ? "grid-cols-3"
                : "grid-cols-4"
            )}
          >
            {images.map((img, i) => (
              <li key={img.src}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={img.alt}
                  aria-pressed={i === active}
                  className={cn(
                    "relative aspect-[4/3] w-full overflow-hidden transition-opacity",
                    i === active
                      ? "opacity-100 ring-1 ring-allure-gold ring-offset-2 ring-offset-white dark:ring-offset-allure-petrol-deep"
                      : "opacity-50 hover:opacity-90"
                  )}
                >
                  <Image
                    src={img.src}
                    alt=""
                    fill
                    sizes="25vw"
                    className="object-cover"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
