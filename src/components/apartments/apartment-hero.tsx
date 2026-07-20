import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ApartmentDetail } from "@/data/apartments/types";
import {
  formatSurface,
  shortApartmentName,
} from "@/data/apartments/format";

type ApartmentHeroProps = {
  apartment: ApartmentDetail;
};

export function ApartmentHero({ apartment }: ApartmentHeroProps) {
  const shortName = shortApartmentName(apartment.name);

  return (
    <section className="relative flex min-h-[min(88vh,720px)] items-end overflow-hidden pb-10 pt-28 sm:pb-14 sm:pt-32 lg:min-h-[78vh] lg:pb-16">
      <Image
        src={apartment.heroImage}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-allure-petrol-deep via-allure-petrol-deep/55 to-allure-petrol/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-allure-petrol-deep/40 via-transparent to-transparent" />

      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-6">
        <Link
          href="/les-appartements"
          className="inline-flex items-center gap-1.5 font-sans text-xs uppercase tracking-[0.2em] text-white/55 transition-colors hover:text-allure-gold"
        >
          <ChevronLeft className="size-3.5" strokeWidth={1.75} />
          Les appartements
        </Link>

        <p className="mt-5 font-sans text-xs uppercase tracking-[0.3em] text-allure-gold">
          Typologie
        </p>
        <h1 className="mt-3 max-w-3xl font-heading text-[2.35rem] leading-[1.08] text-white sm:text-5xl lg:text-6xl">
          {shortName}
        </h1>

        <p className="mt-4 font-sans text-sm tracking-wide text-white/60 sm:text-base">
          <span className="text-allure-gold">
            {formatSurface(apartment.surfaceTotal)}
          </span>
          <span className="mx-2.5 text-white/30">·</span>
          {apartment.floors}
        </p>

        <p className="mt-5 max-w-lg font-sans text-sm leading-relaxed text-white/75 sm:text-[0.95rem]">
          {apartment.description}
        </p>

        {apartment.highlights.length > 0 ? (
          <ul className="mt-6 flex flex-wrap gap-2">
            {apartment.highlights.map((h, i) => (
              <li
                key={h}
                className={
                  i >= 2
                    ? "hidden rounded-full border border-white/20 bg-white/5 px-3 py-1.5 font-sans text-[0.7rem] text-white/75 backdrop-blur-sm sm:block"
                    : "rounded-full border border-white/20 bg-white/5 px-3 py-1.5 font-sans text-[0.7rem] text-white/75 backdrop-blur-sm"
                }
              >
                {h}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Button
            asChild
            size="lg"
            className="h-12 w-full rounded-full bg-allure-gold text-allure-petrol-deep hover:bg-allure-gold/90 sm:w-auto"
          >
            <Link href="/contact">Planifier une visite</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 w-full rounded-full border-white/35 bg-transparent text-white hover:bg-white/10 hover:text-white sm:w-auto"
          >
            <a
              href={apartment.brochure}
              target="_blank"
              rel="noopener noreferrer"
            >
              Brochure PDF
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
