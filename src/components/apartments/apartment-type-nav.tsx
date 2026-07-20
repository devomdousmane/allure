import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ApartmentDetail } from "@/data/apartments/types";
import {
  formatSurface,
  shortApartmentName,
} from "@/data/apartments/format";

type ApartmentTypeNavProps = {
  currentSlug: string;
  apartments: ApartmentDetail[];
};

export function ApartmentTypeNav({
  currentSlug,
  apartments,
}: ApartmentTypeNavProps) {
  const others = apartments.filter((a) => a.slug !== currentSlug);

  return (
    <section className="border-t border-allure-petrol/8 bg-allure-sand/40 py-14 dark:border-allure-sand/10 dark:bg-allure-petrol sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.28em] text-allure-gold">
              Typologies
            </p>
            <h2 className="mt-3 font-heading text-3xl text-allure-petrol dark:text-allure-sand sm:text-4xl">
              Autres types
            </h2>
          </div>
          <Link
            href="/les-appartements"
            className="font-sans text-xs uppercase tracking-[0.18em] text-allure-ink/40 transition-colors hover:text-allure-gold dark:text-allure-sand/40"
          >
            Catalogue complet
          </Link>
        </div>

        {/* Pastilles — navigation rapide, scroll horizontal mobile */}
        <div className="-mx-5 mt-8 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {apartments.map((apt) => {
            const isActive = apt.slug === currentSlug;
            return (
              <Link
                key={apt.id}
                href={`/les-appartements/${apt.slug}`}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 font-sans text-[0.65rem] uppercase tracking-[0.14em] transition-colors",
                  isActive
                    ? "bg-allure-petrol text-white dark:bg-allure-gold dark:text-allure-petrol-deep"
                    : "border border-allure-petrol/12 text-allure-ink/50 hover:border-allure-petrol/35 hover:text-allure-petrol dark:border-allure-sand/20 dark:text-allure-sand/50 dark:hover:text-allure-sand"
                )}
              >
                {shortApartmentName(apt.name)}
              </Link>
            );
          })}
        </div>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((apt) => (
            <li key={apt.id}>
              <Link
                href={`/les-appartements/${apt.slug}`}
                className="group block"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-allure-petrol/5">
                  <Image
                    src={apt.heroImage}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-3 flex items-baseline justify-between gap-2">
                  <p className="font-heading text-lg text-allure-petrol transition-colors group-hover:text-allure-gold dark:text-allure-sand">
                    {shortApartmentName(apt.name)}
                  </p>
                  <p className="shrink-0 font-sans text-xs tabular-nums text-allure-ink/40 dark:text-allure-sand/40">
                    {formatSurface(apt.surfaceTotal)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
