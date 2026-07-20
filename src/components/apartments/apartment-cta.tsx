import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ShieldCheck } from "lucide-react";
import type { ApartmentDetail } from "@/data/apartments/types";
import {
  formatSurface,
  shortApartmentName,
} from "@/data/apartments/format";
import { SITE } from "@/lib/site";

type ApartmentCtaProps = {
  apartment: ApartmentDetail;
};

export function ApartmentCta({ apartment }: ApartmentCtaProps) {
  const shortName = shortApartmentName(apartment.name);

  return (
    <section className="bg-white py-16 dark:bg-allure-petrol-deep sm:py-20 lg:py-24">
      <div className="mx-auto max-w-2xl px-5 text-center sm:px-6">
        <p className="font-sans text-xs uppercase tracking-[0.28em] text-allure-gold">
          Prochaine étape
        </p>
        <h2 className="mt-4 font-heading text-3xl text-allure-petrol dark:text-allure-sand sm:text-4xl lg:text-[2.75rem]">
          Intéressé par le {shortName}&nbsp;?
        </h2>
        <p className="mx-auto mt-4 max-w-md font-sans text-sm leading-relaxed text-allure-ink/65 dark:text-allure-sand/65">
          {formatSurface(apartment.surfaceTotal)} · {apartment.floors}. Visite,
          plan détaillé ou offre personnalisée.
        </p>

        <ul className="mx-auto mt-7 flex max-w-md flex-col gap-2.5 text-left sm:flex-row sm:items-start sm:justify-center sm:gap-6 sm:text-center">
          <li className="flex items-center gap-2 font-sans text-xs text-allure-ink/60 sm:flex-col sm:gap-1.5 dark:text-allure-sand/60">
            <Calendar className="size-4 shrink-0 text-allure-gold" strokeWidth={1.75} />
            Livraison {SITE.delivery}
          </li>
          <li className="flex items-center gap-2 font-sans text-xs text-allure-ink/60 sm:flex-col sm:gap-1.5 dark:text-allure-sand/60">
            <Clock className="size-4 shrink-0 text-allure-gold" strokeWidth={1.75} />
            Réponse sous 24h
          </li>
          <li className="flex items-center gap-2 font-sans text-xs text-allure-ink/60 sm:flex-col sm:gap-1.5 dark:text-allure-sand/60">
            <ShieldCheck className="size-4 shrink-0 text-allure-gold" strokeWidth={1.75} />
            Accompagnement diaspora
          </li>
        </ul>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            asChild
            size="lg"
            className="h-12 w-full rounded-full bg-allure-petrol text-white hover:bg-allure-petrol-deep dark:bg-allure-gold dark:text-allure-petrol-deep dark:hover:bg-allure-gold/90 sm:w-auto"
          >
            <Link href="/contact">Planifier une visite</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 w-full rounded-full border-allure-petrol/25 bg-transparent text-allure-petrol hover:bg-allure-petrol/5 dark:border-allure-sand/30 dark:text-allure-sand dark:hover:bg-allure-sand/10 dark:hover:text-allure-sand sm:w-auto"
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

        <p className="mt-8 font-sans text-xs text-allure-ink/45 dark:text-allure-sand/45">
          <a
            href={SITE.phoneHref}
            className="transition-colors hover:text-allure-gold"
          >
            {SITE.phone}
          </a>
          <span className="mx-2 opacity-40">·</span>
          <a
            href={SITE.emailHref}
            className="transition-colors hover:text-allure-gold"
          >
            {SITE.email}
          </a>
        </p>
      </div>
    </section>
  );
}
