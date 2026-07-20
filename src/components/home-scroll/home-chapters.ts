export type HomeChapterCta = {
  label: string;
  href: string;
};

export type HomeChapter = {
  id: string;
  index: string;
  label: string;
  /** Shown in the lateral rail (desktop) */
  rail?: boolean;
  /** CTA when this chapter is active */
  cta?: HomeChapterCta;
};

/**
 * Narrative chapters for the home scroll experience.
 * Section DOM ids must match `id` (except hero which has no chapter chrome).
 */
export const HOME_CHAPTERS: HomeChapter[] = [
  {
    id: "qui-sommes-nous",
    index: "01",
    label: "Présence",
    rail: true,
    cta: { label: "Planifier une visite", href: "/contact" },
  },
  {
    id: "stats",
    index: "02",
    label: "Chiffres",
    rail: false,
    cta: { label: "Planifier une visite", href: "/contact" },
  },
  {
    id: "a-propos",
    index: "03",
    label: "Vision",
    rail: true,
    cta: { label: "Découvrir Allure", href: "/a-propos" },
  },
  {
    id: "accompagnement",
    index: "04",
    label: "Offre",
    rail: true,
    cta: { label: "Voir l’accompagnement", href: "/#accompagnement" },
  },
  {
    id: "services",
    index: "05",
    label: "Services",
    rail: false,
    cta: { label: "Planifier une visite", href: "/contact" },
  },
  {
    id: "chantier",
    index: "06",
    label: "Chantier",
    rail: true,
    cta: { label: "Voir l’avancement", href: "/avancement" },
  },
  {
    id: "residence",
    index: "07",
    label: "Résidence",
    rail: true,
    cta: { label: "Découvrir la résidence", href: "/residence" },
  },
  {
    id: "categories",
    index: "08",
    label: "Galerie",
    rail: false,
    cta: { label: "Voir la galerie", href: "/#categories" },
  },
  {
    id: "appartements",
    index: "09",
    label: "Typologies",
    rail: true,
    cta: { label: "Voir les types", href: "/les-appartements" },
  },
  {
    id: "quartier",
    index: "10",
    label: "Quartier",
    rail: true,
    cta: { label: "Explorer le quartier", href: "/#quartier" },
  },
  {
    id: "temoignages",
    index: "11",
    label: "Voix",
    rail: false,
    cta: { label: "Nous contacter", href: "/contact" },
  },
  {
    id: "partenaires",
    index: "12",
    label: "Partenaires",
    rail: false,
    cta: { label: "Nous contacter", href: "/contact" },
  },
  {
    id: "contact",
    index: "13",
    label: "Contact",
    rail: true,
    cta: { label: "Nous écrire", href: "/contact" },
  },
  {
    id: "faq",
    index: "14",
    label: "FAQ",
    rail: false,
    cta: { label: "Nous contacter", href: "/contact" },
  },
];

export const HOME_RAIL_CHAPTERS = HOME_CHAPTERS.filter((c) => c.rail);

export function getChapterById(id: string) {
  return HOME_CHAPTERS.find((c) => c.id === id);
}
