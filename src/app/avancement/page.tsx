import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { PhaseNav } from "@/components/avancement/phase-nav";
import { PhaseTimeline } from "@/components/avancement/phase-timeline";
import { EventBand } from "@/components/avancement/event-band";
import { ProgressVideo } from "@/components/avancement/progress-video";
import { ScrollExpandMedia } from "@/components/avancement/scroll-expand-media";
import { ZoomParallax } from "@/components/avancement/zoom-parallax";
import { SectionSharp } from "@/components/ui/section-sharp";
import {
  AVANCEMENT_EVENTS,
  AVANCEMENT_EXPAND,
  AVANCEMENT_OG_IMAGE,
  AVANCEMENT_PHASES,
  AVANCEMENT_ZOOM_IMAGES,
} from "@/lib/avancement";
import { BrochureSection } from "@/components/brochure";
import { SEAM } from "@/components/ui/section-seam";
import { JOURNAL, JOURNAL_PDF } from "@/data/avancement/journal-manifest";
import { SITE } from "@/lib/site";
import { PageJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Avancement",
  description:
    "Suivez l’avancement du chantier Résidence Allure : des fondations à l’achèvement des gros œuvres, jusqu’à la livraison 2026.",
  alternates: { canonical: "/avancement" },
  openGraph: {
    title: `Avancement — ${SITE.name}`,
    description:
      "Timeline des phases de construction et actualités du chantier aux Almadies.",
    images: [{ url: AVANCEMENT_OG_IMAGE }],
  },
};

export default function AvancementPage() {
  return (
    <>
      <PageJsonLd
        title="Avancement"
        path="/avancement"
        description="Suivez l’avancement du chantier Résidence Allure : des fondations à l’achèvement des gros œuvres, jusqu’à la livraison 2026."
      />
      <SiteHeader />
      <main id="main-content" className="flex flex-1 flex-col">
        <ScrollExpandMedia
          mediaType="image"
          mediaSrc={AVANCEMENT_EXPAND.media}
          bgImageSrc={AVANCEMENT_EXPAND.background}
          bgVideoSrc={AVANCEMENT_EXPAND.video}
          posterSrc={AVANCEMENT_EXPAND.poster}
          title="Avancement Allure"
          date={`Livraison ${SITE.delivery}`}
          scrollToExpand="Scroller pour explorer"
        >
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-allure-gold">
              Chantier
            </p>
            <h2 className="mt-3 font-heading text-2xl text-allure-sand sm:text-3xl">
              Suivez l’évolution du projet
            </h2>
            <p className="mt-4 font-sans text-sm leading-relaxed text-allure-sand/65">
              De la phase de terrassement à l’achèvement des gros œuvres — une
              transparence totale pour les acquéreurs résidents et diaspora.
            </p>
            <Button asChild size="lg" className="btn-cta mt-8">
              <a href="#phases">Voir la timeline</a>
            </Button>
          </div>
        </ScrollExpandMedia>

        <section
          aria-label="Galerie zoom chantier"
          className="bg-allure-petrol-deep"
        >
          <ZoomParallax images={[...AVANCEMENT_ZOOM_IMAGES]} />
        </section>

        <section
          id="phases"
          aria-label="Timeline des phases"
          className="relative scroll-mt-28 bg-white dark:bg-allure-petrol-deep"
        >
          <SectionSharp
            edge="top"
            mode="line"
            variant="fold"
            className="h-8 sm:h-9 lg:h-10"
          />
          <PhaseNav phases={AVANCEMENT_PHASES} />

          <div className="relative z-[2] mx-auto max-w-7xl px-5 pt-10 pr-12 pb-2 sm:px-6 sm:pr-16 sm:pt-12 lg:px-8 lg:pr-28 xl:pr-36">
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-allure-gold">
              Timeline
            </p>
            <h2 className="mt-2 max-w-xl font-heading text-2xl text-allure-petrol dark:text-allure-sand sm:text-3xl">
              Sept phases, une livraison {SITE.delivery}
            </h2>
          </div>

          <div className="relative z-[2] pr-10 sm:pr-14 lg:pr-24 xl:pr-32">
            <PhaseTimeline phases={AVANCEMENT_PHASES} />
          </div>
        </section>

        <section
          aria-labelledby="video-heading"
          className="bg-allure-sand py-16 dark:bg-allure-petrol sm:py-20 lg:py-24"
        >
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto mb-10 max-w-xl text-center">
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-allure-gold">
                En images animées
              </p>
              <h2
                id="video-heading"
                className="mt-3 font-heading text-2xl text-allure-petrol dark:text-allure-sand sm:text-3xl"
              >
                Le chantier en mouvement
              </h2>
            </div>
            <ProgressVideo className="mx-auto max-w-4xl" />
          </div>
        </section>

        <EventBand event={AVANCEMENT_EVENTS[0]} tone="white" />
        <EventBand event={AVANCEMENT_EVENTS[1]} tone="sand" />

        <BrochureSection
          id="journal"
          from={SEAM.sand}
          fromDark={SEAM.petrol}
          eyebrow="Journal"
          title="Le chantier en livre"
          description="Feuilletez le journal de construction Allure — ou ouvrez la page dédiée pour une lecture immersive."
          book={JOURNAL}
          pdfHref={JOURNAL_PDF}
        />

        <section className="bg-white py-16 dark:bg-allure-petrol-deep sm:py-20">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <h2 className="font-heading text-2xl text-allure-petrol dark:text-allure-sand sm:text-3xl">
              Visiter le chantier
            </h2>
            <p className="mx-auto mt-3 max-w-md font-sans text-sm text-allure-ink/60 dark:text-allure-sand/60">
              Planifiez une visite accompagnée pour suivre l’avancement et
              découvrir les typologies sur place.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="btn-cta">
                <Link href="/rendez-vous?type=chantier">
                  Demander une visite chantier
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-allure-petrol/20 dark:border-allure-sand/20"
              >
                <Link href="/avancement/journal">Ouvrir le journal</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
