import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageHero } from "@/components/layout/page-hero";
import { Button } from "@/components/ui/button";
import { PartnersSection } from "@/components/sections/partners-section";
import {
  AboutChapterNav,
  AboutCtaBand,
  AboutStory,
} from "@/components/a-propos";
import {
  ABOUT_COPY,
  ABOUT_HERO_IMAGE,
  ABOUT_OG_IMAGE,
} from "@/lib/a-propos";
import { SITE } from "@/lib/site";
import { PageJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "À propos du projet Résidence Allure : situation aux Almadies, signification du nom, concept de développement et gestion immobilière.",
  alternates: { canonical: "/a-propos" },
  openGraph: {
    title: `À propos — ${SITE.name}`,
    description:
      "Développement immobilier de haute qualité au cœur des Almadies, Dakar.",
    images: [{ url: ABOUT_OG_IMAGE }],
  },
};

export default function AProposPage() {
  return (
    <>
      <PageJsonLd
        title="À propos"
        path="/a-propos"
        description="À propos du projet Résidence Allure : situation aux Almadies, signification du nom, concept de développement et gestion immobilière."
      />
      <SiteHeader />
      <main id="main-content" className="flex flex-1 flex-col">
        <PageHero
          eyebrow={ABOUT_COPY.heroEyebrow}
          title={ABOUT_COPY.heroTitle}
          description={ABOUT_COPY.heroDescription}
          image={ABOUT_HERO_IMAGE}
          actions={
            <Button asChild size="lg" className="btn-cta">
              <a href="#apercu">Découvrir le projet</a>
            </Button>
          }
        />

        <AboutChapterNav />
        <AboutStory />

        <div id="partenaires-about">
          <PartnersSection />
        </div>

        <AboutCtaBand />
      </main>
      <SiteFooter />
    </>
  );
}
