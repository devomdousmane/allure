/**
 * Contenu page La Résidence — adapté de residenceallure.com/residence/
 * Médias : public/appart-1, appart-2 (visite pièce à pièce) + témoins (hero marketing)
 * + video/compressed
 *
 * Vidéos compressed (web) :
 * - video-1 / video-2 → portrait 1280p (lifestyle) — résidence
 * - contruction.mp4 → 1280p paysage — page Avancement
 * - Allure-construction-15s → 1280p — bandeau home
 */

import { TEMOIN_MEDIA } from "@/lib/media";

export type ResidenceImage = {
  src: string;
  alt: string;
  category: ResidenceGalleryCategory;
  /** Dossier source (ex. cuisine, chambre-1) */
  folder: ResidenceFolderId;
  apt: "appart-1" | "appart-2";
};

export type ResidenceGalleryCategory =
  | "all"
  | "salon"
  | "cuisine"
  | "chambre"
  | "bain"
  | "couloir"
  | "divers";

/** Dossiers réels sous public/appart-1 et appart-2 */
export type ResidenceFolderId =
  | "salon-salle-a-manger"
  | "cuisine"
  | "chambre-1"
  | "chambre-2"
  | "salle-de-bain-1"
  | "salle-de-bain-2"
  | "couloir"
  | "divers";

export type ResidenceFolder = {
  id: ResidenceFolderId;
  label: string;
  shortLabel: string;
  description: string;
  category: Exclude<ResidenceGalleryCategory, "all">;
  cover: string;
  apts: ("appart-1" | "appart-2")[];
};

export const RESIDENCE_HERO = {
  image: TEMOIN_MEDIA.salon1,
  /** Lifestyle 1080p paysage */
  video: "/video/compressed/video-1.mp4",
} as const;

/** Seconde vidéo lifestyle — bande EXPLORE */
export const RESIDENCE_EXPLORE_VIDEO = {
  src: "/video/compressed/video-2.mp4",
  poster: TEMOIN_MEDIA.salon3,
} as const;

export const RESIDENCE_OG_IMAGE = TEMOIN_MEDIA.salon2;

export const RESIDENCE_COPY = {
  heroEyebrow: "La Résidence",
  heroTitle: "Un cadre de vie exclusif",
  heroDescription:
    "Architecture harmonieuse, prestations premium et proximité de la plage — Allure incarne un art de vivre aux Almadies.",
  exploreEyebrow: "Explore",
  exploreTitle: "La résidence, pièce par pièce",
  exploreBody:
    "Des volumes généreux, une lumière maîtrisée et des matières soignées — chaque espace est pensé pour le quotidien et la réception.",
  apartmentsEyebrow: "Appartements de luxe",
  apartmentsTitle: "Cinq typologies, un même niveau d’exigence",
  apartmentsBody:
    "Des appartements luxueux vous attendent au sein de la Résidence Allure. Spacieux et lumineux, profitez de larges espaces de vie pour un nouveau départ pour vous et votre famille.",
  apartmentsBodyAlt:
    "Découvrez cinq appartements à l’architecture élégante et aux espaces généreux. Un cadre de vie exclusif aux portes des Almadies.",
  neighborhoodEyebrow: "Avoisinages",
  neighborhoodTitle: "Un excellent positionnement",
  neighborhoodBody:
    "Les Almadies, quartier prospère à Dakar, est l’environnement idéal pour un nouveau départ. Si vous envisagez de déménager aux Almadies avec votre famille, vous allez aimer ce que ce quartier a à offrir — charme, services de proximité et une offre immobilière d’exception. Il fait indiscutablement partie des plus beaux quartiers de Dakar.",
  galleryEyebrow: "Galerie images",
  galleryTitle: "Un panorama de cadres de vie uniques",
  galleryBody:
    "Salons, cuisines, chambres et salles de bain — le détail des ambiances Allure.",
  guideEyebrow: "Visite guidée",
  guideTitle: "Parcourir pièce par pièce",
  guideBody:
    "Choisissez un dossier — salon, cuisine, chambres… — et déplacez-vous comme dans l’appartement.",
  amenitiesEyebrow: "Prestations",
  amenitiesTitle: "Tout pour votre quotidien",
  ctaTitle: "Vous avez des questions ?",
  ctaBody:
    "Nous serons heureux de vous accompagner — visite, plans ou projet diaspora.",
} as const;

/** Ordre de visite = parcours intuitif dans l’appartement */
export const RESIDENCE_FOLDERS: ResidenceFolder[] = [
  {
    id: "salon-salle-a-manger",
    label: "Salon & salle à manger",
    shortLabel: "Salon",
    description: "Volumes ouverts, lumière et espaces de réception.",
    category: "salon",
    cover: TEMOIN_MEDIA.salon1,
    apts: ["appart-1", "appart-2"],
  },
  {
    id: "cuisine",
    label: "Cuisine",
    shortLabel: "Cuisine",
    description: "Cuisine équipée, pensée pour le quotidien.",
    category: "cuisine",
    cover: TEMOIN_MEDIA.cuisine1,
    apts: ["appart-1", "appart-2"],
  },
  {
    id: "chambre-1",
    label: "Chambre 1",
    shortLabel: "Ch. 1",
    description: "Suite calme et lumineuse.",
    category: "chambre",
    cover: TEMOIN_MEDIA.chambre1,
    apts: ["appart-1", "appart-2"],
  },
  {
    id: "chambre-2",
    label: "Chambre 2",
    shortLabel: "Ch. 2",
    description: "Seconde chambre, volumes généreux.",
    category: "chambre",
    cover: TEMOIN_MEDIA.chambre2,
    apts: ["appart-1", "appart-2"],
  },
  {
    id: "salle-de-bain-1",
    label: "Salle de bain 1",
    shortLabel: "SDB 1",
    description: "Salle d’eau soignée, matériaux nobles.",
    category: "bain",
    cover: TEMOIN_MEDIA.sdb1,
    apts: ["appart-1", "appart-2"],
  },
  {
    id: "salle-de-bain-2",
    label: "Salle de bain 2",
    shortLabel: "SDB 2",
    description: "Seconde salle de bain.",
    category: "bain",
    cover: TEMOIN_MEDIA.sdb2,
    apts: ["appart-1"],
  },
  {
    id: "couloir",
    label: "Circulation",
    shortLabel: "Couloir",
    description: "Dessertes et transitions entre les pièces.",
    category: "couloir",
    cover: "/appart-1/couloir/couloir-01.webp",
    apts: ["appart-1", "appart-2"],
  },
  {
    id: "divers",
    label: "Détails",
    shortLabel: "Détails",
    description: "Finitions, matières et détails Allure.",
    category: "divers",
    cover: "/appart-1/divers/divers-01.webp",
    apts: ["appart-1", "appart-2"],
  },
];

export const RESIDENCE_GALLERY_FILTERS: {
  id: ResidenceGalleryCategory;
  label: string;
}[] = [
  { id: "all", label: "Tout" },
  { id: "salon", label: "Salon" },
  { id: "cuisine", label: "Cuisine" },
  { id: "chambre", label: "Chambres" },
  { id: "bain", label: "Salles de bain" },
  { id: "couloir", label: "Circulation" },
  { id: "divers", label: "Détails" },
];

function seq(
  apt: "appart-1" | "appart-2",
  folder: ResidenceFolderId,
  filePrefix: string,
  count: number,
  category: ResidenceGalleryCategory,
  alt: string
): ResidenceImage[] {
  return Array.from({ length: count }, (_, i) => {
    const n = String(i + 1).padStart(2, "0");
    return {
      src: `/${apt}/${folder}/${filePrefix}-${n}.webp`,
      alt: `${alt} — ${apt === "appart-1" ? "vue A" : "vue B"} ${n}`,
      category,
      folder,
      apt,
    };
  });
}

/** Catalogue complet classé par type de pièce (appart-1 + appart-2) */
export const RESIDENCE_GALLERY: ResidenceImage[] = [
  ...seq(
    "appart-1",
    "salon-salle-a-manger",
    "salon-salle-a-manger",
    17,
    "salon",
    "Salon & salle à manger"
  ),
  ...seq(
    "appart-2",
    "salon-salle-a-manger",
    "salon-salle-a-manger",
    21,
    "salon",
    "Salon & salle à manger"
  ),
  ...seq("appart-1", "cuisine", "cuisine", 3, "cuisine", "Cuisine"),
  ...seq("appart-2", "cuisine", "cuisine", 3, "cuisine", "Cuisine"),
  ...seq("appart-1", "chambre-1", "chambre-1", 2, "chambre", "Chambre"),
  ...seq("appart-1", "chambre-2", "chambre-2", 6, "chambre", "Chambre"),
  ...seq("appart-2", "chambre-1", "chambre-1", 5, "chambre", "Chambre"),
  ...seq("appart-2", "chambre-2", "chambre-2", 4, "chambre", "Chambre"),
  ...seq(
    "appart-1",
    "salle-de-bain-1",
    "salle-de-bain-1",
    4,
    "bain",
    "Salle de bain"
  ),
  ...seq(
    "appart-1",
    "salle-de-bain-2",
    "salle-de-bain-2",
    3,
    "bain",
    "Salle de bain"
  ),
  ...seq(
    "appart-2",
    "salle-de-bain-1",
    "salle-de-bain-1",
    4,
    "bain",
    "Salle de bain"
  ),
  ...seq("appart-1", "couloir", "couloir", 4, "couloir", "Couloir"),
  ...seq("appart-2", "couloir", "couloir", 2, "couloir", "Couloir"),
  ...seq("appart-1", "divers", "divers", 5, "divers", "Détail résidence"),
  ...seq("appart-2", "divers", "divers", 2, "divers", "Détail résidence"),
];

/** Sélection éditoriale pour la mosaïque EXPLORE (pas toute la galerie) */
export const RESIDENCE_EXPLORE_SHOTS: {
  src: string;
  alt: string;
  label: string;
  folder: ResidenceFolderId;
  span?: "wide" | "tall" | "normal";
}[] = [
  {
    src: TEMOIN_MEDIA.salon2,
    alt: "Grand salon Allure",
    label: "Salon",
    folder: "salon-salle-a-manger",
    span: "wide",
  },
  {
    src: TEMOIN_MEDIA.cuisine1,
    alt: "Cuisine équipée",
    label: "Cuisine",
    folder: "cuisine",
  },
  {
    src: TEMOIN_MEDIA.chambre2,
    alt: "Suite parentale",
    label: "Chambre",
    folder: "chambre-1",
    span: "tall",
  },
  {
    src: TEMOIN_MEDIA.sdb1,
    alt: "Salle de bain",
    label: "Salle de bain",
    folder: "salle-de-bain-1",
  },
  {
    src: TEMOIN_MEDIA.salon5,
    alt: "Séjour ouvert",
    label: "Séjour",
    folder: "salon-salle-a-manger",
    span: "wide",
  },
  {
    src: TEMOIN_MEDIA.axo1,
    alt: "Volumes de l’appartement",
    label: "Volumes",
    folder: "divers",
  },
];

export const RESIDENCE_AMENITIES: {
  label: string;
  src: string;
  alt: string;
}[] = [
  {
    label: "Piscine à débordement",
    src: "/appart-1/divers/divers-01.webp",
    alt: "Espaces de détente Allure",
  },
  {
    label: "Salle de sport",
    src: "/appart-2/divers/divers-01.webp",
    alt: "Espaces sportifs",
  },
  {
    label: "Sécurité 24h/24",
    src: "/appart-1/couloir/couloir-01.webp",
    alt: "Circulation sécurisée",
  },
  {
    label: "Espace lounge",
    src: TEMOIN_MEDIA.salon4,
    alt: "Lounge résidence",
  },
  {
    label: "Salle polyvalente",
    src: TEMOIN_MEDIA.salon6,
    alt: "Espace polyvalent",
  },
  {
    label: "Cadre Almadies",
    src: "/Allure/HD.webp",
    alt: "Résidence Allure aux Almadies",
  },
];

export function filterResidenceGallery(
  category: ResidenceGalleryCategory
): ResidenceImage[] {
  if (category === "all") return RESIDENCE_GALLERY;
  return RESIDENCE_GALLERY.filter((img) => img.category === category);
}

export type ResidenceAptFilter = "all" | "appart-1" | "appart-2";

export function getFolderImages(
  folderId: ResidenceFolderId,
  apt: ResidenceAptFilter = "all"
): ResidenceImage[] {
  return RESIDENCE_GALLERY.filter((img) => {
    if (img.folder !== folderId) return false;
    if (apt === "all") return true;
    return img.apt === apt;
  });
}

export function getFolderById(id: ResidenceFolderId): ResidenceFolder | undefined {
  return RESIDENCE_FOLDERS.find((f) => f.id === id);
}
