import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Waves,
  Dumbbell,
  ShieldCheck,
  Car,
  Wifi,
  Trees,
  Baby,
  Users,
  Zap,
  Camera,
  Wind,
  Sofa,
  ConciergeBell,
} from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageHero } from "@/components/layout/page-hero";
import { Button } from "@/components/ui/button";
import { AMENITY_LABELS } from "@/lib/amenities";
import { LOCAL_GALLERY } from "@/lib/media";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "La Résidence",
  description:
    "Prestations d’exception à la Résidence Allure : piscine, sport, sécurité 24h/24, parking et plus encore aux Almadies.",
  openGraph: {
    title: `La Résidence — ${SITE.name}`,
    description:
      "Un cadre de vie exclusif : 13 prestations pour un quotidien sans compromis.",
  },
};

const ICONS = [
  Waves,
  Dumbbell,
  ShieldCheck,
  Camera,
  Car,
  Zap,
  Wifi,
  Wind,
  Trees,
  Baby,
  Users,
  Sofa,
  ConciergeBell,
] as const;

export default function ResidencePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <PageHero
          eyebrow="La Résidence"
          title="Un cadre de vie exclusif"
          description="Architecture harmonieuse, prestations premium et proximité de la plage — Allure incarne un art de vivre aux Almadies."
          image="/Allure/HD.webp"
        />

        <section className="bg-white py-20 dark:bg-allure-petrol-deep">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-allure-gold">
                Prestations
              </p>
              <h2 className="mt-4 font-heading text-3xl text-allure-petrol dark:text-allure-sand">
                Tout pour votre quotidien
              </h2>
            </div>
            <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-allure-petrol/10 bg-allure-petrol/10 sm:grid-cols-3 lg:grid-cols-4 dark:border-allure-sand/10 dark:bg-allure-sand/10">
              {AMENITY_LABELS.map((label, i) => {
                const Icon = ICONS[i] ?? ConciergeBell;
                return (
                  <div
                    key={label}
                    className="flex flex-col items-center justify-center gap-3 bg-white px-4 py-10 text-center dark:bg-allure-petrol"
                  >
                    <Icon
                      className="h-6 w-6 text-allure-petrol dark:text-allure-gold"
                      strokeWidth={1.5}
                    />
                    <span className="font-sans text-xs uppercase tracking-[0.08em] text-allure-ink/70 dark:text-allure-sand/70">
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-allure-sand py-20 dark:bg-allure-petrol">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="font-sans text-xs uppercase tracking-[0.3em] text-allure-gold">
                  Galerie
                </p>
                <h2 className="mt-3 font-heading text-3xl text-allure-petrol dark:text-allure-sand">
                  La résidence en images
                </h2>
              </div>
              <Button
                asChild
                className="rounded-full bg-allure-petrol text-white dark:bg-allure-gold dark:text-allure-petrol-deep"
              >
                <Link href="/les-appartements">Voir les appartements</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {LOCAL_GALLERY.slice(0, 6).map((item) => (
                <div
                  key={item.src}
                  className="relative aspect-[4/3] overflow-hidden rounded-xl"
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
