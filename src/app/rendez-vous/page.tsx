import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Mail, MapPin, Phone } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageHero } from "@/components/layout/page-hero";
import { AppointmentForm } from "@/components/forms/appointment-form";
import { SectionSharp, SHARP } from "@/components/ui/section-sharp";
import { INTEREST_OPTIONS, VISIT_TYPES } from "@/lib/appointment";
import { SITE } from "@/lib/site";
import { PageJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Planifier un rendez-vous",
  description:
    "Réservez une visite showroom, résidence ou chantier de la Résidence Allure aux Almadies. Confirmation sous 24h.",
  alternates: { canonical: "/rendez-vous" },
  openGraph: {
    title: `Planifier un rendez-vous — ${SITE.name}`,
    description:
      "Choisissez un créneau pour une visite accompagnée ou un entretien en visioconférence.",
    images: [{ url: SITE.ogImage }],
  },
};

type PageProps = {
  searchParams: Promise<{ type?: string; interest?: string }>;
};

function pickVisitType(value?: string) {
  if (value && VISIT_TYPES.some((t) => t.value === value)) return value;
  return "showroom";
}

function pickInterest(value?: string) {
  if (value && INTEREST_OPTIONS.some((o) => o.value === value)) return value;
  return "";
}

export default async function RendezVousPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const defaultVisitType = pickVisitType(params.type);
  const defaultInterest = pickInterest(params.interest);

  return (
    <>
      <PageJsonLd
        title="Planifier un rendez-vous"
        path="/rendez-vous"
        description="Réservez une visite showroom, résidence ou chantier de la Résidence Allure aux Almadies. Confirmation sous 24h."
      />
      <SiteHeader />
      <main id="main-content" className="flex flex-1 flex-col">
        <PageHero
          eyebrow="Rendez-vous"
          title="Planifier un rendez-vous"
          description="Showroom, résidence, chantier ou visioconférence — indiquez votre créneau préféré, nous confirmons sous 24h ouvrables."
          image="/media/hero-cinematic/frame_020.webp"
          sharpTo={SHARP.sand}
          sharpToDark={SHARP.petrol}
        />

        <section className="relative bg-allure-sand py-20 dark:bg-allure-petrol">
          <SectionSharp
            edge="top"
            mode="line"
            variant="fold"
            className="h-8 sm:h-9 lg:h-10"
          />
          <div className="relative z-[2] mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 pt-4 sm:pt-5 lg:grid-cols-2">
            <div>
              <p className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.25em] text-allure-gold">
                <CalendarDays className="size-3.5" aria-hidden />
                Sur rendez-vous
              </p>
              <h2 className="mt-4 font-heading text-3xl text-allure-petrol dark:text-allure-sand">
                Votre visite Allure
              </h2>
              <p className="mt-4 font-sans text-sm leading-relaxed text-allure-ink/65 dark:text-allure-sand/65">
                Un conseiller vous accueille pour présenter les plans, les
                typologies et l’avancement du chantier. Les créneaux sont
                confirmés manuellement — vous recevez un retour par téléphone
                ou email.
              </p>

              <ul className="mt-10 flex flex-col gap-5">
                <li>
                  <a
                    href={SITE.phoneHref}
                    className="flex items-center gap-4 font-sans text-sm text-allure-ink transition-colors hover:text-allure-petrol dark:text-allure-sand dark:hover:text-allure-gold"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-allure-petrol dark:bg-allure-petrol-deep dark:text-allure-gold">
                      <Phone className="h-4 w-4" />
                    </span>
                    {SITE.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={SITE.emailHref}
                    className="flex items-center gap-4 font-sans text-sm text-allure-ink transition-colors hover:text-allure-petrol dark:text-allure-sand dark:hover:text-allure-gold"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-allure-petrol dark:bg-allure-petrol-deep dark:text-allure-gold">
                      <Mail className="h-4 w-4" />
                    </span>
                    {SITE.email}
                  </a>
                </li>
                <li className="flex items-center gap-4 font-sans text-sm text-allure-ink dark:text-allure-sand">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-allure-petrol dark:bg-allure-petrol-deep dark:text-allure-gold">
                    <MapPin className="h-4 w-4" />
                  </span>
                  {SITE.address}
                </li>
              </ul>

              <p className="mt-10 font-sans text-sm text-allure-ink/55 dark:text-allure-sand/55">
                Une question sans créneau précis ?{" "}
                <Link
                  href="/contact"
                  className="text-allure-petrol underline-offset-4 hover:underline dark:text-allure-gold"
                >
                  Écrire via le formulaire contact
                </Link>
                .
              </p>
            </div>

            <div className="rounded-2xl border border-allure-petrol/10 bg-white p-8 shadow-sm dark:border-allure-sand/10 dark:bg-allure-petrol-deep">
              <h3 className="font-heading text-xl text-allure-petrol dark:text-allure-sand">
                Choisir un créneau
              </h3>
              <p className="mt-1 font-sans text-sm text-allure-ink/50 dark:text-allure-sand/50">
                Les champs requis sont indiqués dans le formulaire.
              </p>
              <AppointmentForm
                className="mt-6"
                source="rendez-vous-page"
                defaultVisitType={defaultVisitType}
                defaultInterest={defaultInterest}
              />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
