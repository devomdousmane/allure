/**
 * Données page Avancement — médias locaux scrapés (pas d’URLs WP).
 * Thumbs -300x300 et assets UI exclus.
 */

export type AvancementStatus = "done" | "current" | "upcoming";

export type AvancementImage = {
  src: string;
  alt: string;
};

export type AvancementPhase = {
  id: string;
  index: string;
  label: string;
  title: string;
  subtitle: string;
  status: AvancementStatus;
  cover: string;
  images: AvancementImage[];
};

export type AvancementEvent = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  images: AvancementImage[];
};

const P = "/avancement/media";

function imgs(
  folder: string,
  files: string[],
  altPrefix: string
): AvancementImage[] {
  return files.map((file, i) => ({
    src: `${P}/${folder}/${file}`,
    alt: `${altPrefix} — vue ${i + 1}`,
  }));
}

const PHASE_1_FILES = [
  "terassement-Sous-Sol1.jpeg",
  "terassement-Sous-Sol2.jpeg",
  "terassement-Sous-Sol3.jpeg",
  "terassement-Sous-Sol4.jpeg",
  "terassement-Sous-Sol5.jpeg",
] as const;

const PHASE_2_FILES = [
  "terassement-Sous-Sol6-1.jpeg",
  "terassement-Sous-Sol7.jpeg",
  "terassement-Sous-Sol8.jpeg",
  "terassement-Sous-Sol9.jpeg",
] as const;

const PHASE_3_FILES = [
  "DJI_0244-scaled.jpg",
  "DJI_0246-scaled.jpg",
  "DJI_0247-scaled.jpg",
  "DJI_0250-scaled.jpg",
  "DJI_0253-scaled.jpg",
  "DJI_0259-scaled.jpg",
] as const;

const PHASE_4_FILES = [
  "1.jpg",
  "3.jpg",
  "4.jpg",
  "4-1.jpg",
  "5-1.jpg",
  "6.jpg",
  "7.jpg",
  "7-1.jpg",
  "8.jpg",
  "10.jpg",
  "12.jpg",
  "13.jpg",
] as const;

const PHASE_5_FILES = ["1.jpg", "2.jpg", "3.jpg", "4.jpg"] as const;

const PHASE_6_FILES = [
  "HD_42-scaled.jpg",
  "HD_63-scaled.jpg",
  "HD_77-scaled.jpg",
  "HD_86-scaled.jpg",
  "HD_89-scaled.jpg",
  "HD_114-scaled.jpg",
  "HD_127-scaled.jpg",
  "HD_135-scaled.jpg",
  "HD_161-scaled.jpg",
  "HD_172-scaled.jpg",
] as const;

const EVENT_FILES = [
  "WhatsApp-Image-2025-11-19-at-10.24.06.jpeg",
  "WhatsApp-Image-2025-11-19-at-10.24.06-1.jpeg",
  "WhatsApp-Image-2025-11-19-at-10.24.06-2.jpeg",
  "WhatsApp-Image-2025-11-19-at-10.24.06-3.jpeg",
  "WhatsApp-Image-2025-11-19-at-10.22.23-1.jpeg",
  "WhatsApp-Image-2025-11-19-at-10.22.23-2.jpeg",
  "WhatsApp-Image-2025-11-19-at-10.22.23-3.jpeg",
  "WhatsApp-Image-2025-11-19-at-10.22.24.jpeg",
] as const;

export const AVANCEMENT_HERO_IMAGE = `${P}/phase-6/HD_172-scaled.jpg`;
export const AVANCEMENT_OG_IMAGE = `${P}/phase-6/HD_86-scaled.jpg`;
/** Vidéo chantier — version compressée (1280p, sans audio). */
export const AVANCEMENT_HERO_VIDEO = "/video/compressed/contruction.mp4";

/** Scroll-expand hero — image qui s’agrandit + vidéo en fond */
export const AVANCEMENT_EXPAND = {
  media: `${P}/phase-6/HD_86-scaled.jpg`,
  background: `${P}/phase-6/HD_172-scaled.jpg`,
  poster: `${P}/phase-6/HD_172-scaled.jpg`,
  video: AVANCEMENT_HERO_VIDEO,
} as const;

/** Zoom parallax — 7 vues issues des phases (image centrale distincte du hero) */
export const AVANCEMENT_ZOOM_IMAGES = [
  {
    src: `${P}/phase-3/DJI_0250-scaled.jpg`,
    alt: "Vue aérienne — image principale",
  },
  {
    src: `${P}/phase-3/DJI_0246-scaled.jpg`,
    alt: "Vue aérienne — élévation",
  },
  {
    src: `${P}/phase-1-2/terassement-Sous-Sol1.jpeg`,
    alt: "Terrassement et sous-sol",
  },
  {
    src: `${P}/phase-6/HD_63-scaled.jpg`,
    alt: "Étages hauts",
  },
  {
    src: `${P}/phase-4/1.jpg`,
    alt: "3ème et 4ème étage",
  },
  {
    src: `${P}/phase-5/2.jpg`,
    alt: "5ème et 7ème étage",
  },
  {
    src: `${P}/phase-6/HD_86-scaled.jpg`,
    alt: "Chantier — structure",
  },
] as const;

export const AVANCEMENT_YOUTUBE = {
  id: "7ul0rdPHFS8",
  url: "https://www.youtube.com/watch?v=7ul0rdPHFS8",
  /** Poster local pour la facade (pas d’appel YouTube avant clic) */
  poster: `${P}/phase-6/HD_127-scaled.jpg`,
} as const;

export const AVANCEMENT_PHASES: AvancementPhase[] = [
  {
    id: "phase-1",
    index: "01",
    label: "Terrassement",
    title: "Terrassement & sous-sol",
    subtitle: "Fondations et infrastructures techniques du programme.",
    status: "done",
    cover: `${P}/phase-1-2/${PHASE_1_FILES[0]}`,
    images: imgs("phase-1-2", [...PHASE_1_FILES], "Terrassement et sous-sol"),
  },
  {
    id: "phase-2",
    index: "02",
    label: "RDC",
    title: "Rez-de-chaussée",
    subtitle: "Structure du RDC et emprise des locaux communs.",
    status: "done",
    cover: `${P}/phase-1-2/${PHASE_2_FILES[2]}`,
    images: imgs("phase-1-2", [...PHASE_2_FILES], "Rez-de-chaussée"),
  },
  {
    id: "phase-3",
    index: "03",
    label: "1er & 2e",
    title: "1er & 2ème étage",
    subtitle: "Élévation des premiers niveaux résidentiels.",
    status: "done",
    cover: `${P}/phase-3/${PHASE_3_FILES[1]}`,
    images: imgs("phase-3", [...PHASE_3_FILES], "1er et 2ème étage"),
  },
  {
    id: "phase-4",
    index: "04",
    label: "3e & 4e",
    title: "3ème & 4ème étage",
    subtitle: "Poursuite du gros œuvre en élévation.",
    status: "done",
    cover: `${P}/phase-4/${PHASE_4_FILES[0]}`,
    images: imgs("phase-4", [...PHASE_4_FILES], "3ème et 4ème étage"),
  },
  {
    id: "phase-5",
    index: "05",
    label: "5e & 7e",
    title: "5ème & 7ème étage",
    subtitle: "Montée en hauteur de la structure béton.",
    status: "done",
    cover: `${P}/phase-5/${PHASE_5_FILES[0]}`,
    images: imgs("phase-5", [...PHASE_5_FILES], "5ème et 7ème étage"),
  },
  {
    id: "phase-6",
    index: "06",
    label: "8e & 11e",
    title: "8ème & 11ème étage",
    subtitle:
      "Derniers niveaux du gros œuvre — visite contrôle qualité et sécurité.",
    status: "done",
    cover: `${P}/phase-6/${PHASE_6_FILES[0]}`,
    images: imgs("phase-6", [...PHASE_6_FILES], "8ème et 11ème étage"),
  },
  {
    id: "phase-7",
    index: "07",
    label: "Achèvement",
    title: "Achèvement des gros œuvres",
    subtitle:
      "Cérémonie officielle et bascule vers le second œuvre, livraison 2026.",
    status: "current",
    cover: `${P}/phase-6/HD_172-scaled.jpg`,
    images: imgs(
      "evenements",
      [...EVENT_FILES].slice(0, 4),
      "Achèvement des gros œuvres"
    ),
  },
];

export const AVANCEMENT_EVENTS: AvancementEvent[] = [
  {
    id: "ceremonie",
    eyebrow: "Moment clé",
    title: "Cérémonie d’achèvement des gros œuvres",
    body: "Retour en images sur le cocktail d’inauguration marquant l’achèvement des gros œuvres. Un moment symbolique partagé avec partenaires, invités et acteurs du projet.",
    images: imgs(
      "evenements",
      [...EVENT_FILES].slice(0, 4),
      "Cérémonie d’achèvement"
    ),
  },
  {
    id: "forum-2025",
    eyebrow: "Forum 2025",
    title: "Allure au Forum Invest in Senegal",
    body: "À 500 m du littoral, dans l’un des quartiers les plus prisés de Dakar, Résidence Allure offre un cadre de vie haut standing — emplacement stratégique, architecture raffinée, gestion sécurisée.",
    images: imgs(
      "evenements",
      [...EVENT_FILES].slice(4),
      "Forum Invest in Senegal 2025"
    ),
  },
];

export const AVANCEMENT_STATUS_LABEL: Record<AvancementStatus, string> = {
  done: "Terminé",
  current: "En cours",
  upcoming: "À venir",
};