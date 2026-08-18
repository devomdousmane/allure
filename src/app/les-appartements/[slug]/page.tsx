import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ApartmentHero } from "@/components/apartments/apartment-hero";
import { ApartmentStats } from "@/components/apartments/apartment-stats";
import { ApartmentPlan } from "@/components/apartments/apartment-plan";
import { ApartmentGallery } from "@/components/apartments/apartment-gallery";
import { ApartmentTypeNav } from "@/components/apartments/apartment-type-nav";
import { ApartmentCta } from "@/components/apartments/apartment-cta";
import { ApartmentStickyCta } from "@/components/apartments/apartment-sticky-cta";
import {
  APARTMENT_DETAILS,
  getApartmentBySlug,
  getApartmentSlugs,
} from "@/data/apartments";
import { formatSurface } from "@/data/apartments/format";
import { SITE } from "@/lib/site";
import { JsonLd, apartmentJsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getApartmentSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const apartment = getApartmentBySlug(slug);
  if (!apartment) return { title: "Appartement" };

  const surface = formatSurface(apartment.surfaceTotal);
  const description = `${apartment.name} — ${surface}. ${apartment.description}`;

  return {
    title: apartment.name,
    description,
    alternates: { canonical: `/les-appartements/${apartment.slug}` },
    openGraph: {
      title: `${apartment.name} — ${SITE.name}`,
      description,
      images: [{ url: apartment.heroImage }],
    },
  };
}

export default async function ApartmentDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const apartment = getApartmentBySlug(slug);
  if (!apartment) notFound();

  return (
    <>
      <JsonLd
        data={[
          apartmentJsonLd(apartment),
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "Les appartements", path: "/les-appartements" },
            { name: apartment.name, path: `/les-appartements/${apartment.slug}` },
          ]),
        ]}
      />
      <SiteHeader />
      <main id="main-content" className="flex flex-1 flex-col">
        <ApartmentHero apartment={apartment} />
        <ApartmentStats apartment={apartment} />
        <ApartmentPlan apartment={apartment} />
        <ApartmentGallery apartment={apartment} />
        <ApartmentTypeNav
          currentSlug={apartment.slug}
          apartments={APARTMENT_DETAILS}
        />
        <ApartmentCta apartment={apartment} />
      </main>
      <SiteFooter />
      <ApartmentStickyCta apartment={apartment} />
    </>
  );
}
