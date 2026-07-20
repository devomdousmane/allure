import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageHero } from "@/components/layout/page-hero";
import { ApartmentCatalog } from "@/components/apartments/apartment-catalog";
import { APARTMENT_DETAILS } from "@/data/apartments";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Les Appartements",
  description:
    "Découvrez les cinq typologies de la Résidence Allure aux Almadies : Studio et Types A à D. Surfaces, plans et disponibilités sur demande.",
  openGraph: {
    title: `Les Appartements — ${SITE.name}`,
    description:
      "Cinq façons d’habiter Allure. Surfaces, plans et disponibilités sur demande.",
  },
};

export default function LesAppartementsPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <PageHero
          eyebrow="Allure · Almadies"
          title="Les appartements"
          description="Cinq typologies pour un nouveau départ. Du studio au Type A, chaque plan est pensé pour la lumière, le confort et la vie aux Almadies."
          image="/hero-sequence/frame_016.webp"
          className="min-h-[44vh] lg:min-h-[50vh]"
        />
        <ApartmentCatalog apartments={APARTMENT_DETAILS} />
      </main>
      <SiteFooter />
    </>
  );
}
