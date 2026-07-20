import { SITE } from "@/lib/site";
import { APARTMENTS } from "@/lib/apartments";
import { FAQS } from "@/lib/faqs";

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

export function apartmentComplexJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ApartmentComplex",
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
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
    image: `${SITE.url}/hero-sequence/frame_024.webp`,
    offers: APARTMENTS.map((apt) => ({
      "@type": "Offer",
      name: apt.type,
      description: apt.desc,
      url: `${SITE.url}/les-appartements/${apt.slug}`,
      priceCurrency: "XOF",
      availability: "https://schema.org/InStock",
    })),
  };
}

export function faqPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
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
