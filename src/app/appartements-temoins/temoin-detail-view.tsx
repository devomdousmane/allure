import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageHero } from "@/components/layout/page-hero";
import {
  TemoinCta,
  TemoinDossier,
  TemoinGallery,
  TemoinPlan,
  TemoinVideo,
} from "@/components/temoins";
import { Button } from "@/components/ui/button";
import { SHARP } from "@/components/ui/section-sharp";
import type { TemoinDetail } from "@/data/temoins";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";

type TemoinDetailViewProps = {
  temoin: TemoinDetail;
};

function heroPrimary(temoin: TemoinDetail) {
  if (temoin.video) {
    return { href: "#visite-3d", label: "Visite 3D" };
  }
  if (temoin.planImage) {
    return { href: "#plan", label: "Voir le plan" };
  }
  return { href: "#galerie", label: "Galerie" };
}

/** Contenu fiche témoin (partagé pages statiques + [slug]). */
export function TemoinDetailView({ temoin }: TemoinDetailViewProps) {
  const primary = heroPrimary(temoin);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Accueil", path: "/" },
          { name: "Appartements témoins", path: "/appartements-temoins" },
          { name: temoin.name, path: `/appartements-temoins/${temoin.slug}` },
        ])}
      />
      <SiteHeader />
      <main id="main-content" className="flex flex-1 flex-col">
        <PageHero
          eyebrow="Appartement témoin"
          title={temoin.typologyLabel}
          description={temoin.description}
          image={temoin.heroImage}
          sharpTo={SHARP.white}
          sharpToDark={SHARP.petrolDeep}
          actions={
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="btn-cta">
                <a href={primary.href}>{primary.label}</a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white/30 bg-transparent text-white hover:bg-white/10"
              >
                <Link
                  href={`/rendez-vous?type=showroom&interest=${temoin.interest}`}
                >
                  Prendre rendez-vous
                </Link>
              </Button>
            </div>
          }
        />

        {!temoin.mediaFinal ? (
          <p className="bg-allure-gold/15 px-5 py-3 text-center font-sans text-xs text-allure-petrol dark:bg-allure-gold/10 dark:text-allure-gold sm:px-6">
            Médias provisoires — les vues et la vidéo définitives du Type A
            seront ajoutées prochainement.
          </p>
        ) : null}

        <TemoinGallery temoin={temoin} />
        <TemoinPlan temoin={temoin} />
        <TemoinDossier temoin={temoin} />
        {temoin.video ? (
          <div id="visite-3d">
            <TemoinVideo temoin={temoin} />
          </div>
        ) : null}
        <TemoinCta temoin={temoin} />
      </main>
      <SiteFooter />
    </>
  );
}
