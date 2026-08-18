/**
 * Contenu page À propos — adapté de residenceallure.com/a-propos-d-allure/
 */

export const ABOUT_HERO_IMAGE = "/Allure/HD_172.webp";
export const ABOUT_OG_IMAGE = "/Allure/DJI_0250.webp";

export const ABOUT_CHAPTERS = [
  { id: "apercu", index: "01", label: "Aperçu" },
  { id: "situation", index: "02", label: "Situation" },
  { id: "allure", index: "03", label: "Le nom" },
  { id: "concept", index: "04", label: "Concept" },
  { id: "gestion", index: "05", label: "Gestion" },
  { id: "partenaires-about", index: "06", label: "Partenaires" },
] as const;

export type AboutChapterId = (typeof ABOUT_CHAPTERS)[number]["id"];

export const ABOUT_DISTANCES = [
  { value: "500 m", label: "du littoral" },
  { value: "1,3 km", label: "King Fahd Palace" },
  { value: "1,6 km", label: "Ambassade des États-Unis" },
  { value: "2 km", label: "loisirs Cap Vert" },
  { value: "16 km", label: "centre-ville" },
] as const;

export const ABOUT_PILLARS = [
  {
    index: "01",
    title: "Immobilier de haute qualité",
    text: "Répondre au confort de vie des propriétaires et maximiser le retour sur investissement dans des biens durables et soignés.",
  },
  {
    index: "02",
    title: "Conception locale",
    text: "Agencement ingénieux et style digne, alignés sur les standards élevés de Dakar — pensés pour le climat et le mode de vie local.",
  },
  {
    index: "03",
    title: "Innovation constructive",
    text: "Technologies modernes : structure en murs de cisaillement, interphonie visuelle et équipements de sécurité avancés.",
  },
] as const;

export const ABOUT_MANAGEMENT = [
  {
    id: "vehicules",
    title: "Flux personnes & véhicules",
    text: "Résidence entièrement fermée avec circulation séparée piétons / véhicules pour un quotidien fluide et sécurisé.",
  },
  {
    id: "ascenseurs",
    title: "Ascenseurs suivis",
    text: "Inspections quotidiennes par le service immobilier, maintenance professionnelle bi-mensuelle pendant la garantie.",
  },
  {
    id: "ordures",
    title: "Ordures ménagères",
    text: "Points de dépôt dédiés, collectés et évacués par le service d’assainissement selon un protocole clair.",
  },
  {
    id: "securite",
    title: "Sécurité double",
    text: "Surveillance intelligente et prévention humaine — un double système pour la tranquillité des résidents.",
  },
  {
    id: "eclairage",
    title: "Éclairage partagé",
    text: "Éclairages publics, de cour et paysagers gérés comme équipements collectifs, selon le règlement de copropriété.",
  },
] as const;

export const ABOUT_COPY = {
  heroEyebrow: "À propos d’Allure",
  heroTitle: "Le projet Allure",
  heroDescription:
    "Un programme résidentiel de standing aux Almadies — gracieux, élégant, lumineux — conçu pour le confort, la sécurité et la valeur à long terme.",
  overviewEyebrow: "Aperçu général",
  overviewTitle: "Une expérience de vie à Dakar, pas comme les autres",
  overviewBody:
    "Nichée au cœur de l’espace résidentiel des Almadies, la Résidence Allure se distingue par ses formes harmonieuses — classiques dans l’esprit, résolument modernes dans l’exécution. Un habitat exigeant, proche de la mer, pensé pour les familles comme pour la diaspora.",
  situationEyebrow: "Situation",
  situationTitle: "Au cœur des Almadies",
  situationLead:
    "Le projet est situé au nord du secteur côtier de Dakar, extrêmement bien desservi par des voies sur trois côtés.",
  situationBody:
    "À l’est, la route principale (Route de la Corniche Ouest) ; au sud, une voie secondaire ; à l’ouest, la ruelle du quartier. Eau, électricité, drainage et infrastructures urbaines y sont complètes et accessibles.",
  nameEyebrow: "Le nom",
  nameTitle: "Allure",
  nameQuote:
    "Gracieux, élégant, lumineux — un sentiment ascendant qui reflète le standing du projet et l’image de ses acquéreurs.",
  nameBody:
    "C’est aussi un mot français à la belle prononciation, largement accepté, en accord avec l’identité du programme et de sa clientèle.",
  conceptEyebrow: "Développement",
  conceptTitle: "Trois piliers pour bâtir autrement",
  managementEyebrow: "Gestion immobilière",
  managementTitle: "Une résidence pensée pour durer",
  managementLead:
    "Au-delà de la livraison, Allure s’appuie sur une gestion rigoureuse — sécurité, maintenance et services du quotidien.",
  ctaTitle: "Vous avez des questions ?",
  ctaBody:
    "Notre équipe vous accompagne pour découvrir le projet, les typologies et les modalités d’acquisition.",
} as const;
