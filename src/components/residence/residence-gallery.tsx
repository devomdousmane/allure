"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { MediaLightbox } from "@/components/avancement/media-lightbox";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import {
  filterResidenceGallery,
  RESIDENCE_COPY,
  RESIDENCE_GALLERY_FILTERS,
  type ResidenceGalleryCategory,
  type ResidenceImage,
} from "@/lib/residence";
import { cn } from "@/lib/utils";

const PREVIEW = 12;

/** Galerie filtrable par type de pièce (appart-1 / appart-2). */
export function ResidenceGallery() {
  const ref = useRef<HTMLElement>(null);
  useSectionReveal(ref, { threshold: 0.1 });

  const [category, setCategory] =
    useState<ResidenceGalleryCategory>("all");
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const images = useMemo(
    () => filterResidenceGallery(category),
    [category]
  );
  const visible = expanded ? images : images.slice(0, PREVIEW);

  function openAt(img: ResidenceImage) {
    const i = images.findIndex((x) => x.src === img.src);
    setIndex(i >= 0 ? i : 0);
    setOpen(true);
  }

  return (
    <section
      ref={ref}
      id="galerie"
      className="bg-white py-16 dark:bg-allure-petrol-deep sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="max-w-xl">
          <p
            data-reveal="eyebrow"
            className="font-sans text-xs uppercase tracking-[0.3em] text-allure-gold"
          >
            {RESIDENCE_COPY.galleryEyebrow}
          </p>
          <h2
            data-split="lines,words"
            data-split-animate="words"
            className="mt-3 font-heading text-3xl text-allure-petrol dark:text-allure-sand sm:text-4xl"
          >
            {RESIDENCE_COPY.galleryTitle}
          </h2>
          <p
            data-reveal="text"
            className="mt-4 font-sans text-sm text-allure-ink/65 dark:text-allure-sand/65"
          >
            {RESIDENCE_COPY.galleryBody}
          </p>
        </div>

        <div
          data-reveal="item"
          className="mt-8 flex gap-1 overflow-x-auto pb-1 sm:flex-wrap sm:justify-start sm:gap-2"
          role="tablist"
          aria-label="Filtrer la galerie"
        >
          {RESIDENCE_GALLERY_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={category === f.id}
              onClick={() => {
                setCategory(f.id);
                setExpanded(false);
              }}
              className={cn(
                "shrink-0 cursor-pointer px-3 py-2 font-sans text-[0.7rem] uppercase tracking-[0.16em] transition-colors duration-200",
                category === f.id
                  ? "bg-allure-petrol text-white dark:bg-allure-gold dark:text-allure-petrol-deep"
                  : "text-allure-ink/50 hover:text-allure-petrol dark:text-allure-sand/50 dark:hover:text-allure-sand"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <ul
          data-reveal="media"
          className="mt-8 columns-1 gap-2 sm:columns-2 sm:gap-3 lg:columns-3"
        >
          {visible.map((img, i) => (
            <li key={img.src} className="mb-2 break-inside-avoid sm:mb-3">
              <button
                type="button"
                onClick={() => openAt(img)}
                className="group relative block w-full cursor-pointer overflow-hidden bg-allure-petrol/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-allure-gold dark:bg-allure-sand/5"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={800}
                  height={i % 3 === 0 ? 1000 : 600}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
                <span className="pointer-events-none absolute inset-0 bg-allure-petrol-deep/0 transition-colors duration-300 group-hover:bg-allure-petrol-deep/15" />
              </button>
            </li>
          ))}
        </ul>

        {images.length > PREVIEW ? (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="cursor-pointer font-sans text-xs uppercase tracking-[0.22em] text-allure-petrol underline-offset-4 transition-colors hover:text-allure-gold hover:underline dark:text-allure-sand"
            >
              {expanded
                ? "Réduire"
                : `Voir les ${images.length} photos`}
            </button>
          </div>
        ) : null}
      </div>

      <MediaLightbox
        images={images}
        index={index}
        open={open}
        onClose={() => setOpen(false)}
        onIndexChange={setIndex}
      />
    </section>
  );
}
