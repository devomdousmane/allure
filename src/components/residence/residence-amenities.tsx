"use client";

import { useRef } from "react";
import Image from "next/image";
import { SectionSharp } from "@/components/ui/section-sharp";
import { Tilt3D } from "@/components/motion/tilt-3d";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import {
  RESIDENCE_AMENITIES,
  RESIDENCE_COPY,
} from "@/lib/residence";
import { cn } from "@/lib/utils";

/** Prestations — bandeau photo + tilt 3D léger. */
export function ResidenceAmenities() {
  const ref = useRef<HTMLElement>(null);
  useSectionReveal(ref, { threshold: 0.15 });

  return (
    <section
      ref={ref}
      id="prestations"
      className="relative bg-white py-16 dark:bg-allure-petrol-deep sm:py-20 lg:py-24"
    >
      <SectionSharp edge="top" mode="line" variant="fold" className="h-8 sm:h-9" />
      <div className="relative z-[2] mx-auto max-w-6xl px-5 pt-4 sm:px-6 sm:pt-5">
        <div className="mx-auto max-w-2xl text-center">
          <p
            data-reveal="eyebrow"
            className="font-sans text-xs uppercase tracking-[0.3em] text-allure-gold"
          >
            {RESIDENCE_COPY.amenitiesEyebrow}
          </p>
          <h2
            data-split="lines,words"
            data-split-animate="words"
            className="mt-3 font-heading text-3xl text-allure-petrol dark:text-allure-sand sm:text-4xl"
          >
            {RESIDENCE_COPY.amenitiesTitle}
          </h2>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
          {RESIDENCE_AMENITIES.map((item, i) => (
            <li
              key={item.label}
              data-reveal="item"
              className={cn(i === 0 && "md:col-span-1")}
            >
              <Tilt3D maxDeg={7} className="h-full">
                <div className="group relative aspect-[3/4] overflow-hidden bg-allure-petrol/5 dark:bg-allure-sand/5">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-allure-petrol-deep/85 via-allure-petrol-deep/20 to-transparent" />
                  <p className="absolute inset-x-0 bottom-0 p-3 font-sans text-[0.65rem] uppercase leading-snug tracking-[0.14em] text-white sm:p-4 sm:text-xs">
                    {item.label}
                  </p>
                </div>
              </Tilt3D>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
