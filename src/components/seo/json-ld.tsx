import { AMENITY_LABELS } from "@/lib/amenities";
import { APARTMENTS } from "@/lib/apartments";
import { FAQS } from "@/lib/faqs";
import { SITE, getSiteUrl } from "@/lib/site";
import type { ApartmentDetail } from "@/data/apartments";

type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function origin() {
  return getSiteUrl();
}

function absolute(path: string) {
  if (path.startsWith("http")) return path;
  return `${origin()}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Agence / promoteur */
export function organizationJsonLd() {
  const url = origin();
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${url}/#agence`,
    name: SITE.name,
    url,
    logo: absolute(SITE.logo),
    image: absolute(SITE.ogImage),
    description: SITE.description,
    telephone: SITE.phone,
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Route des Almadies",
      addressLocality: "Dakar",
      addressCountry: "SN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.coords.lat,
      longitude: SITE.coords.lng,
    },
    areaServed: {
      "@type": "Place",
      name: "Almadies, Dakar",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE.phone,
      email: SITE.email,
      contactType: "sales",
      availableLanguage: ["fr", "fr-SN"],
    },
    sameAs: SITE.socials.map((s) => s.href),
  };
}

/** Site web */
export function webSiteJsonLd() {
  const url = origin();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}/#site`,
    name: SITE.name,
    url,
    inLanguage: "fr-SN",
    description: SITE.description,
    publisher: { "@id": `${url}/#agence` },
    image: absolute(SITE.ogImage),
  };
}

/** Résidence / programme */
export function apartmentComplexJsonLd() {
  const url = origin();
  return {
    "@context": "https://schema.org",
    "@type": "ApartmentComplex",
    "@id": `${url}/#residence`,
    name: SITE.name,
    description: SITE.description,
    url,
    telephone: SITE.phone,
    email: SITE.email,
    slogan: SITE.tagline,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Route des Almadies",
      addressLocality: "Dakar",
      addressCountry: "SN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.coords.lat,
      longitude: SITE.coords.lng,
    },
    image: absolute(SITE.ogImage),
    numberOfAccommodationUnits: 70,
    numberOfAvailableAccommodationUnits: 70,
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Niveaux",
        value: SITE.levels,
      },
    ],
    amenityFeature: AMENITY_LABELS.map((name) => ({
      "@type": "LocationFeatureSpecification",
      name,
    })),
    offers: APARTMENTS.map((apt) => ({
      "@type": "Offer",
      name: apt.type,
      description: apt.desc,
      url: `${url}/les-appartements/${apt.slug}`,
      priceCurrency: "XOF",
      availability: "https://schema.org/PreOrder",
    })),
  };
}

export function faqPageJsonLd() {
  const url = origin();
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}/#faq`,
    inLanguage: "fr-SN",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

export function webPageJsonLd({
  name,
  path,
  description,
}: {
  name: string;
  path: string;
  description?: string;
}) {
  const url = origin();
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${absolute(path)}#webpage`,
    url: absolute(path),
    name,
    description: description ?? SITE.description,
    inLanguage: "fr-SN",
    isPartOf: { "@id": `${url}/#site` },
    about: { "@id": `${url}/#residence` },
    primaryImageOfPage: absolute(SITE.ogImage),
  };
}

export function apartmentJsonLd(apartment: ApartmentDetail) {
  const url = origin();
  const path = `/les-appartements/${apartment.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Apartment",
    "@id": `${absolute(path)}#apartment`,
    name: `${apartment.name} — ${SITE.name}`,
    description: apartment.description,
    url: absolute(path),
    image: absolute(apartment.heroImage),
    floorSize: {
      "@type": "QuantitativeValue",
      value: apartment.surfaceTotal,
      unitCode: "MTK",
    },
    numberOfRooms: apartment.bedrooms + 1,
    numberOfBedrooms: apartment.bedrooms,
    numberOfBathroomsTotal: apartment.bathrooms,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Route des Almadies",
      addressLocality: "Dakar",
      addressCountry: "SN",
    },
    isPartOf: { "@id": `${url}/#residence` },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}

/** Fil d’Ariane + WebPage — pages hub */
export function PageJsonLd({
  title,
  path,
  description,
  crumbs,
}: {
  title: string;
  path: string;
  description?: string;
  crumbs?: { name: string; path: string }[];
}) {
  const trail = crumbs ?? [
    { name: "Accueil", path: "/" },
    { name: title, path },
  ];
  return (
    <JsonLd data={[webPageJsonLd({ name: title, path, description }), breadcrumbJsonLd(trail)]} />
  );
}
