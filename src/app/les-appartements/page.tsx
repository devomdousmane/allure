import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageHero } from "@/components/layout/page-hero";
import { ApartmentCatalog } from "@/components/apartments/apartment-catalog";
import { BrochureSection } from "@/components/brochure";
import { SEAM } from "@/components/ui/section-seam";
import { APARTMENT_DETAILS } from "@/data/apartments";
import { SITE } from "@/lib/site";
import { PageJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Les Appartements",
  description:
    "Découvrez les cinq typologies de la Résidence Allure aux Almadies : Studio et Types A à D. Surfaces, plans interactifs, à partir de 165M FCFA.",
  alternates: { canonical: "/les-appartements" },
  openGraph: {
    title: `Les Appartements — ${SITE.name}`,
    description:
      "Cinq façons d’habiter Allure. Surfaces, plans interactifs, à partir de 165M FCFA.",
    images: [{ url: SITE.ogImage }],
  },
};

export default function LesAppartementsPage() {
  return (
    <>
      <PageJsonLd
        title="Les Appartements"
        path="/les-appartements"
        description="Découvrez les cinq typologies de la Résidence Allure aux Almadies : Studio et Types A à D. Surfaces, plans interactifs, à partir de 165M FCFA."
      />
      <SiteHeader />
      <main id="main-content" className="flex flex-1 flex-col">
        <PageHero
          eyebrow="Allure · Almadies"
          title="Les appartements"
          description="Cinq typologies pour un nouveau départ. Du studio au Type A, chaque plan est pensé pour la lumière, le confort et la vie aux Almadies."
          image="/media/hero-cinematic/frame_016.webp"
        />
        <BrochureSection
          from={SEAM.white}
          fromDark={SEAM.petrolDeep}
          title="Feuilletez les typologies"
          description="Parcourez la brochure interactive avant de choisir votre appartement — Studio et Types A à D."
        />
        <ApartmentCatalog apartments={APARTMENT_DETAILS} />
      </main>
      <SiteFooter />
    </>
  );
}
