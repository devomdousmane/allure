import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CinematicHero } from "@/components/sections/cinematic-hero";
import { WhoWeAreSection } from "@/components/sections/who-we-are-section";
import { StatsBand } from "@/components/sections/stats-band";
import { AboutSection } from "@/components/sections/about-section";
import { OfferingsSection } from "@/components/sections/offerings-section";
import { ServicesSection } from "@/components/sections/services-section";
import { ConstructionVideoSection } from "@/components/sections/construction-video-section";
import { AmenitiesSection } from "@/components/sections/amenities-section";
import { CategoriesSection } from "@/components/sections/categories-section";
import { ApartmentsSection } from "@/components/sections/apartments-section";
import { NeighborhoodSection } from "@/components/sections/neighborhood-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { PartnersSection } from "@/components/sections/partners-section";
import { ContactSection } from "@/components/sections/contact-section";
import { FaqSection } from "@/components/sections/faq-section";
import {
  HomeScrollShell,
  SectionChapter,
  ScrollHint,
  ChapterScrollOrchestrator,
  AnnexStatement,
  AnnexOfferingsPin,
  AnnexVideoOverlay,
  AnnexGalleryBridge,
  AnnexTypesPin,
  AnnexPresenceLine,
  AnnexStatsRibbon,
  AnnexNeighborhoodRing,
  AnnexVoicesMark,
  AnnexFinale,
  AnnexPartnersDrift,
  AnnexServicesPulse,
} from "@/components/home-scroll";
import {
  JsonLd,
  apartmentComplexJsonLd,
  faqPageJsonLd,
} from "@/components/seo/json-ld";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `${SITE.name} — ${SITE.tagline}` },
  description: SITE.description,
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <JsonLd data={[apartmentComplexJsonLd(), faqPageJsonLd()]} />
      <SiteHeader />
      <HomeScrollShell>
        <ChapterScrollOrchestrator />
        <main className="w-full flex-1">
          <div className="relative">
            <CinematicHero />
            <ScrollHint />
          </div>

          <SectionChapter index="01" label="Présence" sectionId="qui-sommes-nous">
            <div className="relative">
              <AnnexPresenceLine />
              <WhoWeAreSection />
            </div>
          </SectionChapter>

          <SectionChapter index="02" label="Chiffres" hideChrome sectionId="stats">
            <div className="relative overflow-hidden">
              <AnnexStatsRibbon />
              <StatsBand />
            </div>
          </SectionChapter>

          <AnnexStatement />

          <SectionChapter index="03" label="Vision" sectionId="a-propos">
            <AboutSection />
          </SectionChapter>

          <div className="relative">
            <AnnexOfferingsPin />
            <SectionChapter index="04" label="Offre" sectionId="accompagnement">
              <OfferingsSection />
            </SectionChapter>
            <SectionChapter index="05" label="Services" sectionId="services">
              <AnnexServicesPulse />
              <ServicesSection />
            </SectionChapter>
          </div>

          <SectionChapter index="06" label="Chantier" hideChrome sectionId="chantier">
            <div className="relative">
              <ConstructionVideoSection />
              <AnnexVideoOverlay />
            </div>
          </SectionChapter>

          <SectionChapter index="07" label="Résidence" sectionId="residence">
            <AmenitiesSection />
          </SectionChapter>

          <AnnexGalleryBridge />

          <SectionChapter index="08" label="Galerie" sectionId="categories">
            <CategoriesSection />
          </SectionChapter>

          <div className="relative">
            <AnnexTypesPin />
            <SectionChapter index="09" label="Typologies" sectionId="appartements">
              <ApartmentsSection />
            </SectionChapter>
          </div>

          <SectionChapter index="10" label="Quartier" sectionId="quartier">
            <div className="relative">
              <AnnexNeighborhoodRing />
              <NeighborhoodSection />
            </div>
          </SectionChapter>

          <SectionChapter index="11" label="Voix" sectionId="temoignages">
            <div className="relative overflow-hidden">
              <AnnexVoicesMark />
              <TestimonialsSection />
            </div>
          </SectionChapter>

          <SectionChapter index="12" label="Partenaires" hideChrome sectionId="partenaires">
            <AnnexPartnersDrift />
            <PartnersSection />
          </SectionChapter>

          <AnnexFinale />

          <SectionChapter index="13" label="Contact" sectionId="contact">
            <ContactSection />
          </SectionChapter>

          <SectionChapter index="14" label="FAQ" hideChrome sectionId="faq">
            <FaqSection />
          </SectionChapter>
        </main>
      </HomeScrollShell>
      <SiteFooter />
    </>
  );
}
