import type { Metadata } from "next";
import { APARTMENT_DETAILS } from "@/data/apartments";
import { TEMOINS } from "@/data/temoins";
import { AMENITY_LABELS } from "@/lib/amenities";
import { FAQS } from "@/lib/faqs";
import { LEGAL_DOCUMENTS, type LegalDocument } from "@/lib/legal";
import { OG_IMAGE, SITE, getSiteUrl } from "@/lib/site";

export { OG_IMAGE, getSiteUrl };

export function legalMetadata(doc: LegalDocument): Metadata {
  return {
    title: doc.title,
    description: doc.description,
    alternates: { canonical: `/${doc.slug}` },
    openGraph: {
      title: `${doc.title} — ${SITE.name}`,
      description: doc.description,
      url: `/${doc.slug}`,
      locale: "fr_SN",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: `${doc.title} — ${SITE.name}`,
      description: doc.description,
      images: [SITE.ogImage],
    },
  };
}

/** Index markdown pour les crawlers IA — servi sur /llms.txt */
export function buildLlmsTxt() {
  const origin = getSiteUrl();
  const pages = [
    ["/", "Accueil — programme, prestations, typologies et FAQ"],
    ["/a-propos", "À propos du projet et de la vision Allure"],
    ["/residence", "La résidence : cadre de vie, voisinage, galerie"],
    ["/brochure", "Brochure interactive du programme"],
    [
      "/appartements-temoins",
      "Appartements témoins — galeries et visites 3D",
    ],
    [
      "/les-appartements",
      `Typologies — Studio à Type D, dès ${SITE.priceFrom}`,
    ],
    ["/avancement", "Avancement du chantier jusqu’à la livraison 2026"],
    ["/avancement/journal", "Journal de chantier"],
    ["/rendez-vous", "Planifier une visite (showroom, résidence, chantier)"],
    ["/contact", "Contact commercial"],
  ] as const;

  const apartments = APARTMENT_DETAILS.map((apt) => {
    const surface = apt.surfaceTotal.toFixed(2).replace(".", ",");
    return `- [${apt.name}](${origin}/les-appartements/${apt.slug}): ${surface} m², ${apt.price}. ${apt.tagline}`;
  }).join("\n");

  const temoins = TEMOINS.map(
    (t) =>
      `- [${t.name}](${origin}/appartements-temoins/${t.slug}): ${t.description}`
  ).join("\n");

  const faqs = FAQS.map((f) => `### ${f.q}\n${f.a}`).join("\n\n");

  const legal = Object.values(LEGAL_DOCUMENTS)
    .map((d) => `- [${d.title}](${origin}/${d.slug}): ${d.description}`)
    .join("\n");

  const amenities = AMENITY_LABELS.map((label) => `- ${label}`).join("\n");

  return `# ${SITE.name}

> ${SITE.description}

Site officiel du programme immobilier **${SITE.name}**, aux Almadies (Dakar, Sénégal). Livraison ${SITE.delivery}. Prix d’entrée : ${SITE.priceFrom}.

- Langue : fr-SN
- Contact : ${SITE.email} — ${SITE.phone}
- Adresse : ${SITE.address}
- Image de partage : ${origin}${SITE.ogImage}

## Pages

${pages.map(([path, label]) => `- [${label}](${origin}${path})`).join("\n")}

## Typologies

${apartments}

## Appartements témoins

${temoins}

## Prestations

${amenities}

## FAQ

${faqs}

## Optional

${legal}

## Indexation

- Sitemap : ${origin}/sitemap.xml
- Robots : ${origin}/robots.txt
`;
}
