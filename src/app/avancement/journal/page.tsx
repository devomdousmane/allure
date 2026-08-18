import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageHero } from "@/components/layout/page-hero";
import { BrochureSection } from "@/components/brochure";
import { Button } from "@/components/ui/button";
import { SHARP } from "@/components/ui/section-sharp";
import { SEAM } from "@/components/ui/section-seam";
import { JOURNAL, JOURNAL_PDF } from "@/data/avancement/journal-manifest";
import { SITE } from "@/lib/site";
import { PageJsonLd } from "@/components/seo/json-ld";
import { ABOUT_HERO_IMAGE } from "@/lib/a-propos";

export const metadata: Metadata = {
  title: "Journal du chantier",
  description:
    "Feuilletez le journal de chantier de la Résidence Allure — photos, étapes et actualités de la construction aux Almadies.",
  alternates: { canonical: "/avancement/journal" },
  openGraph: {
    title: `Journal du chantier — ${SITE.name}`,
    description:
      "Le livre interactif du suivi de construction Résidence Allure.",
    images: [{ url: ABOUT_HERO_IMAGE }],
  },
};

export default function JournalChantierPage() {
  return (
    <>
      <PageJsonLd
        title="Journal du chantier"
        path="/avancement/journal"
        description="Feuilletez le journal de chantier de la Résidence Allure — photos, étapes et actualités de la construction aux Almadies."
        crumbs={[
          { name: "Accueil", path: "/" },
          { name: "Avancement", path: "/avancement" },
          { name: "Journal du chantier", path: "/avancement/journal" },
        ]}
      />
      <SiteHeader />
      <main id="main-content" className="flex flex-1 flex-col">
        <PageHero
          eyebrow="Chantier"
          title="Journal du chantier"
          description="Un livre interactif pour suivre l’évolution d’Allure — ou téléchargez le PDF complet."
          image={ABOUT_HERO_IMAGE}
          sharpTo={SHARP.sand}
          sharpToDark={SHARP.petrolDeep}
          actions={
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="btn-cta">
                <a href="#journal">Feuilleter</a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white/30 bg-transparent text-white hover:bg-white/10"
              >
                <Link
                  href={JOURNAL_PDF}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Télécharger le PDF
                </Link>
              </Button>
            </div>
          }
        />

        <BrochureSection
          id="journal"
          from={SEAM.sand}
          fromDark={SEAM.petrolDeep}
          eyebrow="Journal"
          title="Feuilletez le suivi"
          description="Photos et moments clés du chantier Allure — transparence pour résidents et diaspora."
          book={JOURNAL}
          pdfHref={JOURNAL_PDF}
        />

        <section className="bg-white py-14 dark:bg-allure-petrol-deep sm:py-16">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 text-center sm:flex-row sm:justify-center">
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <Link href="/avancement">Voir la timeline</Link>
            </Button>
            <Button asChild size="lg" className="btn-cta">
              <Link href="/rendez-vous?type=chantier">Visiter le chantier</Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
