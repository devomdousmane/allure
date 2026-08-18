import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageHero } from "@/components/layout/page-hero";
import { TemoinCard } from "@/components/temoins";
import { Button } from "@/components/ui/button";
import { SectionSharp, SHARP } from "@/components/ui/section-sharp";
import { TEMOINS } from "@/data/temoins";
import { SITE } from "@/lib/site";
import { PageJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Appartements témoins",
  description:
    "Visitez les appartements témoins Allure en images et en visite 3D — avant l’achat et avant la fin des travaux.",
  alternates: { canonical: "/appartements-temoins" },
  openGraph: {
    title: `Appartements témoins — ${SITE.name}`,
    description:
      "Show flats immersifs : galeries pièce à pièce et visite 3D pour anticiper votre futur chez-vous.",
    images: [{ url: SITE.ogImage }],
  },
};

export default function AppartementsTemoinsPage() {
  return (
    <>
      <PageJsonLd
        title="Appartements témoins"
        path="/appartements-temoins"
        description="Visitez les appartements témoins Allure en images et en visite 3D — avant l’achat et avant la fin des travaux."
      />
      <SiteHeader />
      <main id="main-content" className="flex flex-1 flex-col">
        <PageHero
          eyebrow="Visite immersive"
          title="Appartements témoins"
          description="Découvrez le rendu réel des espaces aménagés — en galerie et en visite 3D — pour vous projeter avant la livraison."
          image={TEMOINS[0]?.heroImage}
          sharpTo={SHARP.sand}
          sharpToDark={SHARP.petrol}
          actions={
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="btn-cta">
                <Link href="/rendez-vous?type=showroom">
                  Planifier une visite
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white/30 bg-transparent text-white hover:bg-white/10"
              >
                <Link href="/les-appartements">Voir les typologies</Link>
              </Button>
            </div>
          }
        />

        <section className="relative bg-allure-sand py-16 dark:bg-allure-petrol sm:py-24">
          <SectionSharp
            edge="top"
            mode="line"
            variant="fold"
            className="h-8 sm:h-9 lg:h-10"
          />
          <div className="relative z-[2] mx-auto max-w-[90rem] px-5 pt-4 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-2xl text-center">
              <p className="font-sans text-xs uppercase tracking-[0.28em] text-allure-gold">
                Deux typologies
              </p>
              <h2 className="mt-3 font-heading text-3xl text-allure-petrol dark:text-allure-sand sm:text-4xl lg:text-5xl">
                Choisissez votre témoin
              </h2>
              <p className="mt-4 font-sans text-sm text-allure-ink/65 dark:text-allure-sand/65">
                Type D est disponible avec ses médias définitifs. Type A
                partage temporairement les mêmes vues — les assets dédiés
                suivront.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
              {TEMOINS.map((temoin, i) => (
                <TemoinCard
                  key={temoin.slug}
                  temoin={temoin}
                  offset={i === 1}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 dark:bg-allure-petrol-deep sm:py-20">
          <div className="mx-auto max-w-2xl px-5 text-center sm:px-8">
            <p className="font-sans text-xs uppercase tracking-[0.28em] text-allure-gold">
              Sur place
            </p>
            <h2 className="mt-3 font-heading text-3xl text-allure-petrol dark:text-allure-sand sm:text-4xl">
              Passez du virtuel au réel
            </h2>
            <p className="mt-4 font-sans text-sm text-allure-ink/65 dark:text-allure-sand/65">
              Après la galerie et la visite 3D, réservez un créneau showroom
              pour ressentir les volumes et les finitions.
            </p>
            <Button asChild size="lg" className="btn-cta mt-8">
              <Link href="/rendez-vous?type=showroom">
                Réserver une visite showroom
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
