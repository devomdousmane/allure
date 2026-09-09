export const SITE = {
  name: "Résidence Allure",
  tagline: "L'élégance aux Almadies",
  url: "https://residence-allure.com",
  description:
    "Programme immobilier de standing au cœur des Almadies, Dakar. Appartements lumineux, prestations d'exception, livraison 2026.",
  keywords: [
    "Résidence Allure",
    "appartements Almadies",
    "immobilier Dakar",
    "acheter appartement Dakar",
    "programme immobilier Almadies",
    "appartements témoins Dakar",
    "diaspora Sénégal immobilier",
    "appartement neuf Dakar 2026",
    "résidence standing Almadies",
    "investissement immobilier Sénégal",
    "studio Almadies",
    "visite 3D appartement Dakar",
  ],
  ogImage: "/og/og-default.webp",
  ogImageWidth: 1200,
  ogImageHeight: 630,
  phone: "+221 78 595 66 66",
  phoneHref: "tel:+221785956666",
  email: "office@residence-allure.com",
  emailHref: "mailto:office@residence-allure.com",
  address: "Route des Almadies, Dakar, Sénégal",
  priceFrom: "165M FCFA",
  delivery: "2026",
  /** Immeuble résidentiel */
  levels: "R+11",
  floorsLabel: "Étages 1–11",
  /** Logo clair — texte sombre, fond transparent */
  logoLight: "/logo/logo-allure-light.webp",
  /** Logo sombre — texte argenté, fond transparent */
  logoDark: "/logo/logo-allure-dark.webp",
  /** Alias — version claire (rétrocompat) */
  logo: "/logo/logo-allure-light.webp",
  logoMark: "/logo/allure-mark.webp",
  coords: {
    lng: -17.519,
    lat: 14.744,
  },
  socials: [
    {
      href: "https://www.facebook.com/profile.php?id=100094669390322",
      label: "Facebook",
    },
    {
      href: "https://www.instagram.com/residencesallure/",
      label: "Instagram",
    },
    {
      href: "https://twitter.com/Allurewanfang",
      label: "Twitter",
    },
  ],
} as const;

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? SITE.url;
}

export const OG_IMAGE = {
  url: SITE.ogImage,
  width: SITE.ogImageWidth,
  height: SITE.ogImageHeight,
  alt: `${SITE.name} — ${SITE.tagline}`,
} as const;
