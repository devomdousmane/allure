import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageHero } from "@/components/layout/page-hero";
import { BrochureSection } from "@/components/brochure";
import { Button } from "@/components/ui/button";
import { SHARP } from "@/components/ui/section-sharp";
import { SEAM } from "@/components/ui/section-seam";
import { BROCHURE_PDF } from "@/data/apartments/brochure-manifest";
import { SITE } from "@/lib/site";
import { PageJsonLd } from "@/components/seo/json-ld";
import { TEMOIN_MEDIA } from "@/lib/media";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Brochure",
  description:
    "Feuilletez la brochure interactive de la Résidence Allure — typologies, prestations et vision du programme aux Almadies.",
  alternates: { canonical: "/brochure" },
  openGraph: {
    title: `Brochure — ${SITE.name}`,
    description:
      "Un livre interactif pour découvrir le programme Résidence Allure.",
    images: [{ url: SITE.ogImage }],
  },
};

export default function BrochurePage() {
  return (
    <>
      <PageJsonLd
        title="Brochure"
        path="/brochure"
        description="Feuilletez la brochure interactive de la Résidence Allure — typologies, prestations et vision du programme aux Almadies."
      />
      <SiteHeader />
      <main id="main-content" className="flex flex-1 flex-col">
        <PageHero
          eyebrow="Programme"
          title="La brochure Allure"
          description="Parcourez le livre interactif du programme — ou téléchargez le PDF pour le partager."
          image={TEMOIN_MEDIA.salon1}
          sharpTo={SHARP.sand}
          sharpToDark={SHARP.petrolDeep}
          actions={
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="btn-cta">
                <a href="#brochure">Feuilleter</a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white/30 bg-transparent text-white hover:bg-white/10"
              >
                <Link href={BROCHURE_PDF} target="_blank" rel="noopener noreferrer">
                  Télécharger le PDF
                </Link>
              </Button>
            </div>
          }
        />

        <BrochureSection
          from={SEAM.sand}
          fromDark={SEAM.petrolDeep}
          title="Feuilletez le programme"
          description="Un livre interactif de la Résidence Allure — plans, prestations et atmosphère des Almadies."
        />
      </main>
      <SiteFooter />
    </>
  );
}
