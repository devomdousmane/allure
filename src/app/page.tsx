import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { HeroModeSwitch } from "@/components/sections/hero-mode-switch";
import { WhoWeAreSection } from "@/components/sections/who-we-are-section";
import { StatsBand } from "@/components/sections/stats-band";
import { AboutSection } from "@/components/sections/about-section";
import { OrbitVideoSection } from "@/components/sections/orbit-video-section";
import { OfferingsSection } from "@/components/sections/offerings-section";
import { ServicesSection } from "@/components/sections/services-section";
import { ConstructionVideoSection } from "@/components/sections/construction-video-section";
import { AmenitiesSection } from "@/components/sections/amenities-section";
import { CategoriesSection } from "@/components/sections/categories-section";
import { TemoinsShowcaseSection } from "@/components/sections/temoins-showcase-section";
import { ApartmentsSection } from "@/components/sections/apartments-section";
import { HorizontalParallaxSection } from "@/components/sections/horizontal-parallax-section";
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
  AnnexChapterPin,
  AnnexPresenceLine,
  AnnexStatsRibbon,
  AnnexVoicesMark,
  AnnexFinale,
  AnnexPartnersDrift,
  AnnexServicesPulse,
  AnnexAboutOrbit,
  AnnexAmenitiesBloom,
  AnnexGalleryDrift,
  AnnexContactAura,
  AnnexFaqRail,
} from "@/components/home-scroll";
import {
  JsonLd,
  apartmentComplexJsonLd,
  faqPageJsonLd,
} from "@/components/seo/json-ld";
import { SITE, OG_IMAGE } from "@/lib/site";
import {
  isAnnexArmed,
  isShellArmed,
} from "@/lib/home-motion-debug";

export const metadata: Metadata = {
  title: { absolute: `${SITE.name} — ${SITE.tagline}` },
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    url: "/",
    images: [OG_IMAGE],
  },
};

function Chapter({
  index,
  label,
  sectionId,
  hideChrome,
  children,
}: {
  index: string;
  label: string;
  sectionId: string;
  hideChrome?: boolean;
  children: ReactNode;
}) {
  if (!isShellArmed("chapters")) {
    return <>{children}</>;
  }
  return (
    <SectionChapter
      index={index}
      label={label}
      sectionId={sectionId}
      hideChrome={hideChrome}
    >
      {children}
    </SectionChapter>
  );
}

export default function Home() {
  return (
    <>
      <JsonLd data={[apartmentComplexJsonLd(), faqPageJsonLd()]} />
      <SiteHeader />
      <HomeScrollShell>
        {isShellArmed("orchestrator") ? <ChapterScrollOrchestrator /> : null}
        <main id="main-content" className="w-full flex-1">
          <div className="relative">
            <HeroModeSwitch />
            {isShellArmed("scrollHint") ? <ScrollHint /> : null}
          </div>

          <Chapter index="01" label="Présence" sectionId="qui-sommes-nous">
            <div className="relative">
              {isAnnexArmed("presenceLine") ? <AnnexPresenceLine /> : null}
              <WhoWeAreSection />
            </div>
          </Chapter>

          <Chapter index="02" label="Chiffres" hideChrome sectionId="stats">
            <div className="relative overflow-hidden">
              {isAnnexArmed("statsRibbon") ? <AnnexStatsRibbon /> : null}
              <StatsBand />
            </div>
          </Chapter>

          {isAnnexArmed("statement") ? <AnnexStatement /> : null}

          <Chapter index="03" label="Vision" sectionId="a-propos">
            <div className="relative">
              {isAnnexArmed("aboutOrbit") ? <AnnexAboutOrbit /> : null}
              <AboutSection />
            </div>
          </Chapter>

          <Chapter index="04" label="Geste" hideChrome sectionId="orbite">
            <OrbitVideoSection />
          </Chapter>

          <div className="relative">
            {isAnnexArmed("offeringsPin") ? <AnnexOfferingsPin /> : null}
            <Chapter index="05" label="Offre" sectionId="accompagnement">
              <OfferingsSection />
            </Chapter>
            <Chapter index="06" label="Services" sectionId="services">
              <div className="relative">
                {isAnnexArmed("servicesPulse") ? <AnnexServicesPulse /> : null}
                <ServicesSection />
              </div>
            </Chapter>
          </div>

          <Chapter index="07" label="Chantier" hideChrome sectionId="chantier">
            <div className="relative">
              <ConstructionVideoSection />
              {isAnnexArmed("videoOverlay") ? <AnnexVideoOverlay /> : null}
            </div>
          </Chapter>

          <Chapter index="08" label="Prestations" sectionId="residence">
            <div className="relative overflow-hidden">
              {isAnnexArmed("amenitiesBloom") ? <AnnexAmenitiesBloom /> : null}
              <AmenitiesSection />
            </div>
          </Chapter>

          {isAnnexArmed("galleryBridge") ? <AnnexGalleryBridge /> : null}

          <Chapter index="09" label="Galerie" sectionId="categories">
            <div className="relative overflow-hidden">
              {isAnnexArmed("galleryDrift") ? <AnnexGalleryDrift /> : null}
              <CategoriesSection />
            </div>
          </Chapter>

          <Chapter
            index="10"
            label="Témoins"
            sectionId="appartements-temoins-home"
          >
            <TemoinsShowcaseSection />
          </Chapter>

          <div className="relative">
            <Chapter index="11" label="Typologies" sectionId="appartements">
              <ApartmentsSection />
            </Chapter>
          </div>

          <HorizontalParallaxSection />

          <Chapter index="12" label="Quartier" sectionId="quartier">
            <NeighborhoodSection />
          </Chapter>

          <Chapter index="13" label="Voix" sectionId="temoignages">
            <div className="relative overflow-hidden">
              {isAnnexArmed("voicesMark") ? <AnnexVoicesMark /> : null}
              <TestimonialsSection />
            </div>
          </Chapter>

          <Chapter
            index="14"
            label="Partenaires"
            hideChrome
            sectionId="partenaires"
          >
            <div className="relative overflow-hidden">
              {isAnnexArmed("partnersDrift") ? <AnnexPartnersDrift /> : null}
              <PartnersSection />
            </div>
          </Chapter>

          {isAnnexArmed("finale") ? <AnnexFinale /> : null}

          <Chapter index="15" label="Contact" sectionId="contact">
            <div className="relative overflow-hidden">
              {isAnnexArmed("contactAura") ? <AnnexContactAura /> : null}
              <ContactSection />
            </div>
          </Chapter>

          <Chapter index="16" label="FAQ" hideChrome sectionId="faq">
            <div className="relative">
              {isAnnexArmed("faqRail") ? <AnnexFaqRail /> : null}
              <FaqSection />
            </div>
          </Chapter>
        </main>
        {isAnnexArmed("typesPin") ? <AnnexChapterPin /> : null}
      </HomeScrollShell>
      <SiteFooter />
    </>
  );
}
