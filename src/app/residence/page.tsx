import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageHero } from "@/components/layout/page-hero";
import { Button } from "@/components/ui/button";
import { SHARP } from "@/components/ui/section-sharp";
import Link from "next/link";
import {
  ResidenceAmenities,
  ResidenceApartments,
  ResidenceCta,
  ResidenceExplore,
  ResidenceFolderGuide,
  ResidenceGallery,
  ResidenceNeighborhood,
} from "@/components/residence";
import { BrochureSection } from "@/components/brochure";
import {
  RESIDENCE_COPY,
  RESIDENCE_HERO,
  RESIDENCE_OG_IMAGE,
} from "@/lib/residence";
import { SITE } from "@/lib/site";
import { SEAM } from "@/components/ui/section-seam";
import { PageJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "La Résidence",
  description:
    "Prestations d’exception à la Résidence Allure : appartements de luxe, voisinage Almadies et galerie des cadres de vie.",
  alternates: { canonical: "/residence" },
  openGraph: {
    title: `La Résidence — ${SITE.name}`,
    description: RESIDENCE_COPY.heroDescription,
    images: [{ url: RESIDENCE_OG_IMAGE }],
  },
};

export default function ResidencePage() {
  return (
    <>
      <PageJsonLd
        title="La Résidence"
        path="/residence"
        description="Prestations d’exception à la Résidence Allure : appartements de luxe, voisinage Almadies et galerie des cadres de vie."
      />
      <SiteHeader />
      <main id="main-content" className="flex flex-1 flex-col">
        <PageHero
          eyebrow={RESIDENCE_COPY.heroEyebrow}
          title={RESIDENCE_COPY.heroTitle}
          description={RESIDENCE_COPY.heroDescription}
          image={RESIDENCE_HERO.image}
          videoSrc={RESIDENCE_HERO.video}
          sharpTo={SHARP.white}
          sharpToDark={SHARP.petrolDeep}
          actions={
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="btn-cta">
                <a href="#visite-guidee">Visite guidée</a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white/30 bg-transparent text-white hover:bg-white/10"
              >
                <Link href="/brochure">Brochure</Link>
              </Button>
            </div>
          }
        />

        <ResidenceAmenities />
        <BrochureSection
          from={SEAM.white}
          fromDark={SEAM.petrolDeep}
          title="La brochure Allure"
          description="Feuilletez le programme comme un livre — typologies, prestations et vision du projet aux Almadies."
        />
        <ResidenceFolderGuide />
        <ResidenceExplore />
        <ResidenceApartments />
        <ResidenceNeighborhood />
        <ResidenceGallery />
        <ResidenceCta />
      </main>
      <SiteFooter />
    </>
  );
}
