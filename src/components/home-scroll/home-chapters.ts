export type HomeChapterCta = {
  label: string;
  href: string;
};

export type HomeChapter = {
  id: string;
  index: string;
  label: string;
  /** Titre court pour la carte pin latérale */
  pinTitle: string;
  /** Shown in the lateral rail (desktop) */
  rail?: boolean;
  /** CTA when this chapter is active */
  cta?: HomeChapterCta;
};

/**
 * Narrative chapters for the home scroll experience.
 * Section DOM ids must match `id` (except hero which has no chapter chrome).
 * CTAs flottants : pousser visite / témoins / typologies selon le chapitre.
 */
export const HOME_CHAPTERS: HomeChapter[] = [
  {
    id: "qui-sommes-nous",
    index: "01",
    label: "Présence",
    pinTitle: "Présence Allure",
    rail: true,
    cta: { label: "Planifier une visite", href: "/rendez-vous" },
  },
  {
    id: "stats",
    index: "02",
    label: "Chiffres",
    pinTitle: "Repères clés",
    rail: false,
    cta: { label: "Voir les typologies", href: "/#appartements" },
  },
  {
    id: "a-propos",
    index: "03",
    label: "Vision",
    pinTitle: "Notre vision",
    rail: true,
    cta: { label: "Visiter le témoin", href: "/appartements-temoins" },
  },
  {
    id: "orbite",
    index: "04",
    label: "Geste",
    pinTitle: "Le geste",
    rail: true,
    cta: { label: "Voir les typologies", href: "/#appartements" },
  },
  {
    id: "accompagnement",
    index: "05",
    label: "Offre",
    pinTitle: "Accompagnement",
    rail: true,
    cta: { label: "Prendre rendez-vous", href: "/rendez-vous" },
  },
  {
    id: "services",
    index: "06",
    label: "Services",
    pinTitle: "Nos services",
    rail: false,
    cta: { label: "Planifier une visite", href: "/rendez-vous" },
  },
  {
    id: "chantier",
    index: "07",
    label: "Chantier",
    pinTitle: "Le chantier",
    rail: true,
    cta: { label: "Voir l’avancement", href: "/avancement" },
  },
  {
    id: "residence",
    index: "08",
    label: "Prestations",
    pinTitle: "Prestations",
    rail: true,
    cta: {
      label: "Découvrir la résidence",
      href: "/residence",
    },
  },
  {
    id: "categories",
    index: "09",
    label: "Galerie",
    pinTitle: "Habiter Allure",
    rail: false,
    cta: {
      label: "Voir les témoins",
      href: "/appartements-temoins",
    },
  },
  {
    id: "appartements-temoins-home",
    index: "10",
    label: "Témoins",
    pinTitle: "Show flats",
    rail: true,
    cta: {
      label: "Voir les témoins",
      href: "/appartements-temoins",
    },
  },
  {
    id: "appartements",
    index: "11",
    label: "Typologies",
    pinTitle: "Les typologies",
    rail: true,
    cta: { label: "Planifier une visite", href: "/rendez-vous" },
  },
  {
    id: "quartier",
    index: "12",
    label: "Quartier",
    pinTitle: "Les Almadies",
    rail: true,
    cta: { label: "Réserver une visite", href: "/rendez-vous" },
  },
  {
    id: "temoignages",
    index: "13",
    label: "Voix",
    pinTitle: "Ils témoignent",
    rail: false,
    cta: { label: "Planifier une visite", href: "/rendez-vous" },
  },
  {
    id: "partenaires",
    index: "14",
    label: "Partenaires",
    pinTitle: "Ils nous accompagnent",
    rail: false,
    cta: { label: "Nous contacter", href: "/contact" },
  },
  {
    id: "contact",
    index: "15",
    label: "Contact",
    pinTitle: "Nous écrire",
    rail: true,
    cta: { label: "Prendre rendez-vous", href: "/rendez-vous" },
  },
  {
    id: "faq",
    index: "16",
    label: "FAQ",
    pinTitle: "Questions fréquentes",
    rail: false,
    cta: { label: "Planifier une visite", href: "/rendez-vous" },
  },
];

export const HOME_RAIL_CHAPTERS = HOME_CHAPTERS.filter((c) => c.rail);

/**
 * Chapitres pin (côtés alternés). Les ponts hors liste sont dans HOME_PIN_FLOW.
 * 15 stations → FAQ (index 14) à gauche. `stats` reste un pont (pas une station).
 */
export const HOME_PIN_SECTION_IDS = [
  "qui-sommes-nous",
  "a-propos",
  "orbite",
  "accompagnement",
  "services",
  "chantier",
  "residence",
  "categories",
  "appartements-temoins-home",
  "appartements",
  "quartier",
  "temoignages",
  "partenaires",
  "contact",
  "faq",
] as const;

export type HomePinSectionId = (typeof HOME_PIN_SECTION_IDS)[number];

export type HomePinFlowEntry = {
  id: string;
  kind: "chapter" | "bridge";
};

/**
 * Flux DOM complet pour la pin : chapitres + bandes « cachées »
 * (statement, gallery bridge, dakar, finale) qui ne doivent pas figer le dock.
 */
export const HOME_PIN_FLOW: readonly HomePinFlowEntry[] = [
  { id: "qui-sommes-nous", kind: "chapter" },
  { id: "stats", kind: "bridge" },
  { id: "annex-statement", kind: "bridge" },
  { id: "a-propos", kind: "chapter" },
  { id: "orbite", kind: "chapter" },
  { id: "accompagnement", kind: "chapter" },
  { id: "services", kind: "chapter" },
  { id: "chantier", kind: "chapter" },
  { id: "residence", kind: "chapter" },
  { id: "annex-gallery-bridge", kind: "bridge" },
  { id: "categories", kind: "chapter" },
  { id: "appartements-temoins-home", kind: "chapter" },
  { id: "appartements", kind: "chapter" },
  { id: "dakar", kind: "bridge" },
  { id: "quartier", kind: "chapter" },
  { id: "temoignages", kind: "chapter" },
  { id: "partenaires", kind: "chapter" },
  { id: "annex-finale", kind: "bridge" },
  { id: "contact", kind: "chapter" },
  { id: "faq", kind: "chapter" },
];

export function getChapterById(id: string) {
  return HOME_CHAPTERS.find((c) => c.id === id);
}
