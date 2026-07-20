import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ApartmentDetail } from "@/data/apartments/types";
import {
  formatSurface,
  shortApartmentName,
} from "@/data/apartments/format";
import { cn } from "@/lib/utils";

type ApartmentCatalogProps = {
  apartments: ApartmentDetail[];
};

function catalogStats(apartment: ApartmentDetail) {
  return [
    { label: "Surface", value: formatSurface(apartment.surfaceTotal) },
    {
      label: "Chambres",
      value: apartment.hasStaffRoom
        ? `${apartment.bedrooms} + serv.`
        : String(apartment.bedrooms),
    },
    { label: "SDB", value: String(apartment.bathrooms) },
    {
      label: apartment.terraces > 1 ? "Terrasses" : "Terrasse",
      value: String(apartment.terraces),
    },
  ];
}

export function ApartmentCatalog({ apartments }: ApartmentCatalogProps) {
  return (
    <>
      {/* Navigation rapide */}
      <nav
        aria-label="Typologies"
        className="sticky top-16 z-20 border-b border-allure-petrol/10 bg-white/90 backdrop-blur-md dark:border-allure-sand/10 dark:bg-allure-petrol-deep/90 lg:top-[4.5rem]"
      >
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-5 py-3 sm:px-6 sm:justify-center sm:gap-2">
          {apartments.map((apt) => (
            <a
              key={apt.id}
              href={`#${apt.slug}`}
              className="shrink-0 rounded-full px-3.5 py-2 font-sans text-[0.65rem] uppercase tracking-[0.14em] text-allure-ink/50 transition-colors hover:bg-allure-sand hover:text-allure-petrol dark:text-allure-sand/50 dark:hover:bg-allure-petrol dark:hover:text-allure-sand"
            >
              {shortApartmentName(apt.name)}
              <span className="ml-1.5 hidden text-allure-ink/30 tabular-nums dark:text-allure-sand/30 sm:inline">
                {formatSurface(apt.surfaceTotal).replace(" m²", "")}
              </span>
            </a>
          ))}
        </div>
      </nav>

      {/* Intro + aperçu surfaces */}
      <section className="bg-white py-12 dark:bg-allure-petrol-deep sm:py-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="max-w-2xl">
            <p className="font-sans text-xs uppercase tracking-[0.28em] text-allure-gold">
              Cinq typologies
            </p>
            <h2 className="mt-3 font-heading text-2xl text-allure-petrol dark:text-allure-sand sm:text-3xl">
              Du studio au Type A — choisissez votre façon d’habiter Allure
            </h2>
            <p className="mt-3 font-sans text-sm leading-relaxed text-allure-ink/65 dark:text-allure-sand/65">
              Surfaces réelles, plans interactifs et ambiances intérieures.
              Prix et disponibilités sur demande.
            </p>
          </div>

          <ul className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-allure-petrol/10 bg-allure-petrol/10 sm:grid-cols-5 dark:border-allure-sand/10 dark:bg-allure-sand/10">
            {apartments.map((apt) => (
              <li key={apt.id} className="bg-white dark:bg-allure-petrol-deep">
                <a
                  href={`#${apt.slug}`}
                  className="group flex h-full flex-col px-4 py-5 transition-colors hover:bg-allure-sand/40 dark:hover:bg-allure-petrol sm:px-5 sm:py-6"
                >
                  <span className="font-sans text-[0.6rem] uppercase tracking-[0.18em] text-allure-ink/40 transition-colors group-hover:text-allure-gold dark:text-allure-sand/40">
                    {shortApartmentName(apt.name)}
                  </span>
                  <span className="mt-2 font-heading text-lg text-allure-petrol dark:text-allure-sand sm:text-xl">
                    {formatSurface(apt.surfaceTotal)}
                  </span>
                  <span className="mt-1 font-sans text-[0.7rem] text-allure-ink/40 dark:text-allure-sand/40">
                    {apt.floors.replace(/^Étages?\s*/i, "Ét. ")}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Fiches typologies */}
      <section className="bg-allure-sand/50 py-6 dark:bg-allure-petrol sm:py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-16 px-5 py-10 sm:gap-24 sm:px-6 sm:py-16 lg:gap-28">
          {apartments.map((apt, index) => {
            const shortName = shortApartmentName(apt.name);
            const stats = catalogStats(apt);
            const reversed = index % 2 === 1;
            const previewHighlights = apt.highlights
              .filter((h) => !h.toLowerCase().includes("m²"))
              .slice(0, 3);

            return (
              <article
                key={apt.id}
                id={apt.slug}
                className="scroll-mt-36 grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-14"
              >
                <div
                  className={cn(
                    "relative aspect-[4/3] overflow-hidden bg-allure-petrol/5 sm:aspect-[5/4]",
                    reversed && "lg:order-2"
                  )}
                >
                  <Image
                    src={apt.heroImage}
                    alt={apt.name}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                    priority={index === 0}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-allure-petrol-deep/70 to-transparent px-4 py-4 sm:px-5">
                    <p className="font-heading text-xl text-white sm:text-2xl">
                      {shortName}
                    </p>
                    <p className="mt-0.5 font-sans text-xs text-allure-gold">
                      {formatSurface(apt.surfaceTotal)}
                    </p>
                  </div>
                </div>

                <div className={cn(reversed && "lg:order-1")}>
                  <p className="font-sans text-xs uppercase tracking-[0.28em] text-allure-gold">
                    Typologie {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-3 font-heading text-3xl text-allure-petrol dark:text-allure-sand sm:text-4xl">
                    {shortName}
                  </h2>
                  <p className="mt-2 font-sans text-sm text-allure-ink/45 dark:text-allure-sand/45">
                    {apt.tagline}
                  </p>
                  <p className="mt-4 max-w-md font-sans text-sm leading-relaxed text-allure-ink/70 dark:text-allure-sand/70">
                    {apt.description}
                  </p>

                  <dl className="mt-7 grid grid-cols-2 gap-x-4 gap-y-5 border-y border-allure-petrol/10 py-6 sm:grid-cols-4 dark:border-allure-sand/10">
                    {stats.map((stat) => (
                      <div key={stat.label}>
                        <dt className="font-sans text-[0.6rem] uppercase tracking-[0.18em] text-allure-ink/40 dark:text-allure-sand/40">
                          {stat.label}
                        </dt>
                        <dd className="mt-1.5 font-heading text-base text-allure-petrol dark:text-allure-sand sm:text-lg">
                          {stat.value}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  {previewHighlights.length > 0 ? (
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {previewHighlights.map((h) => (
                        <li
                          key={h}
                          className="font-sans text-xs text-allure-ink/55 before:mr-2 before:text-allure-gold before:content-['·'] dark:text-allure-sand/55"
                        >
                          {h}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button
                      asChild
                      size="lg"
                      className="h-12 w-full rounded-full bg-allure-petrol text-white hover:bg-allure-petrol-deep dark:bg-allure-gold dark:text-allure-petrol-deep dark:hover:bg-allure-gold/90 sm:w-auto"
                    >
                      <Link href={`/les-appartements/${apt.slug}`}>
                        Découvrir
                        <ArrowUpRight className="size-4" />
                      </Link>
                    </Button>
                    <Link
                      href={`/les-appartements/${apt.slug}#plan`}
                      className="text-center font-sans text-xs uppercase tracking-[0.16em] text-allure-ink/45 transition-colors hover:text-allure-gold dark:text-allure-sand/45 sm:text-left"
                    >
                      Voir le plan
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* CTA catalogue */}
      <section className="bg-white py-16 dark:bg-allure-petrol-deep sm:py-20">
        <div className="mx-auto max-w-2xl px-5 text-center sm:px-6">
          <p className="font-sans text-xs uppercase tracking-[0.28em] text-allure-gold">
            Accompagnement
          </p>
          <h2 className="mt-4 font-heading text-3xl text-allure-petrol dark:text-allure-sand sm:text-4xl">
            Besoin d’aide pour choisir&nbsp;?
          </h2>
          <p className="mx-auto mt-4 max-w-md font-sans text-sm leading-relaxed text-allure-ink/65 dark:text-allure-sand/65">
            Nos conseillers vous orientent selon votre usage, votre budget et
            vos priorités — visite ou brochure sur demande.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="h-12 w-full rounded-full bg-allure-petrol text-white hover:bg-allure-petrol-deep dark:bg-allure-gold dark:text-allure-petrol-deep dark:hover:bg-allure-gold/90 sm:w-auto"
            >
              <Link href="/contact">Nous contacter</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 w-full rounded-full border-allure-petrol/25 bg-transparent text-allure-petrol hover:bg-allure-petrol/5 dark:border-allure-sand/30 dark:text-allure-sand dark:hover:bg-allure-sand/10 dark:hover:text-allure-sand sm:w-auto"
            >
              <a
                href="/apartments/brochure.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Brochure PDF
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
