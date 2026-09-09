export type TemoinRoomId =
  | "axo"
  | "salon"
  | "cuisine"
  | "chambre"
  | "sdb";

export type TemoinImage = {
  src: string;
  alt: string;
  room: TemoinRoomId;
};

export type TemoinRoom = {
  id: TemoinRoomId;
  label: string;
};

export type TemoinVideoSrc = {
  src720: string;
  src1080: string;
  poster: string;
};

/** Visite Matterport — chargée au clic (poster local). */
export type TemoinMatterport = {
  /** ID modèle Matterport (`m=` dans l’URL show). */
  modelId: string;
  poster: string;
  title?: string;
};

export type TemoinDossierPage = {
  src: string;
  alt: string;
};

export type TemoinDetail = {
  slug: string;
  name: string;
  typologyLabel: string;
  /** true = médias définitifs ; false = placeholder (mêmes vues qu’un autre) */
  mediaFinal: boolean;
  description: string;
  heroImage: string;
  rooms: TemoinRoom[];
  gallery: TemoinImage[];
  /** Absent si le témoin n’a pas encore de visite 3D vidéo. */
  video?: TemoinVideoSrc;
  /** Visite virtuelle Matterport (optionnel — non utilisé si plan PDF fourni). */
  matterport?: TemoinMatterport;
  planImage?: string;
  /** PDF plan d’étage (téléchargement). */
  planPdf?: string;
  /** Lien vers le plan interactif typologie (`/les-appartements/...#plan`). */
  planHref?: string;
  dossierPdf?: string;
  dossierPages?: TemoinDossierPage[];
  interest: string;
};

export const TEMOIN_ROOMS: TemoinRoom[] = [
  { id: "axo", label: "Axonométrie" },
  { id: "salon", label: "Salon" },
  { id: "cuisine", label: "Cuisine" },
  { id: "chambre", label: "Chambre" },
  { id: "sdb", label: "Salle de bain" },
];

/** Chemins WebP Type D (source réelle actuelle). */
export const TYPE_D_MEDIA = {
  hero: "/media/appartements-temoins/type-d/salon/liv01.webp",
  video: {
    src720: "/media/appartements-temoins/type-d/video/visite-3d-720.mp4",
    src1080: "/media/appartements-temoins/type-d/video/visite-3d-1080.mp4",
    poster: "/media/appartements-temoins/type-d/video/poster.webp",
  },
  gallery: [
    {
      src: "/media/appartements-temoins/type-d/axo/axo01.webp",
      alt: "Axonométrie — vue 01",
      room: "axo" as const,
    },
    {
      src: "/media/appartements-temoins/type-d/axo/axo02.webp",
      alt: "Axonométrie — vue 02",
      room: "axo" as const,
    },
    {
      src: "/media/appartements-temoins/type-d/salon/liv01.webp",
      alt: "Salon — vue 01",
      room: "salon" as const,
    },
    {
      src: "/media/appartements-temoins/type-d/salon/liv02.webp",
      alt: "Salon — vue 02",
      room: "salon" as const,
    },
    {
      src: "/media/appartements-temoins/type-d/salon/liv03.webp",
      alt: "Salon — vue 03",
      room: "salon" as const,
    },
    {
      src: "/media/appartements-temoins/type-d/salon/liv04.webp",
      alt: "Salon — vue 04",
      room: "salon" as const,
    },
    {
      src: "/media/appartements-temoins/type-d/salon/liv05.webp",
      alt: "Salon — vue 05",
      room: "salon" as const,
    },
    {
      src: "/media/appartements-temoins/type-d/salon/liv06.webp",
      alt: "Salon — vue 06",
      room: "salon" as const,
    },
    {
      src: "/media/appartements-temoins/type-d/cuisine/kitch01.webp",
      alt: "Cuisine — vue 01",
      room: "cuisine" as const,
    },
    {
      src: "/media/appartements-temoins/type-d/cuisine/kitch02.webp",
      alt: "Cuisine — vue 02",
      room: "cuisine" as const,
    },
    {
      src: "/media/appartements-temoins/type-d/cuisine/kitch03.webp",
      alt: "Cuisine — vue 03",
      room: "cuisine" as const,
    },
    {
      src: "/media/appartements-temoins/type-d/cuisine/kitch04.webp",
      alt: "Cuisine — vue 04",
      room: "cuisine" as const,
    },
    {
      src: "/media/appartements-temoins/type-d/chambre/bed01.webp",
      alt: "Chambre — vue 01",
      room: "chambre" as const,
    },
    {
      src: "/media/appartements-temoins/type-d/chambre/bed02.webp",
      alt: "Chambre — vue 02",
      room: "chambre" as const,
    },
    {
      src: "/media/appartements-temoins/type-d/chambre/bed03.webp",
      alt: "Chambre — vue 03",
      room: "chambre" as const,
    },
    {
      src: "/media/appartements-temoins/type-d/chambre/bed04.webp",
      alt: "Chambre — vue 04",
      room: "chambre" as const,
    },
    {
      src: "/media/appartements-temoins/type-d/sdb/bath01.webp",
      alt: "Salle de bain — vue 01",
      room: "sdb" as const,
    },
    {
      src: "/media/appartements-temoins/type-d/sdb/bath02.webp",
      alt: "Salle de bain — vue 02",
      room: "sdb" as const,
    },
    {
      src: "/media/appartements-temoins/type-d/sdb/bath03.webp",
      alt: "Salle de bain — vue 03",
      room: "sdb" as const,
    },
    {
      src: "/media/appartements-temoins/type-d/sdb/bath04.webp",
      alt: "Salle de bain — vue 04",
      room: "sdb" as const,
    },
  ] satisfies TemoinImage[],
};

/** Chemins WebP Type A — apps-temoins-almadies (optimisés). */
export const TYPE_A_MEDIA = {
  hero: "/media/apps-temoins-almadies/salon-salle-a-manger.webp",
  planImage: "/media/apps-temoins-almadies/plan/floor-1-p1.webp",
  planPdf: "/media/apps-temoins-almadies/plan/floor-1.pdf",
  gallery: [
    {
      src: "/media/apps-temoins-almadies/dollhouse-view.webp",
      alt: "Vue d’ensemble 3D — appartement témoin",
      room: "axo" as const,
    },
    {
      src: "/media/apps-temoins-almadies/salon-salle-a-manger.webp",
      alt: "Salon et salle à manger",
      room: "salon" as const,
    },
    {
      src: "/media/apps-temoins-almadies/salon.webp",
      alt: "Salon",
      room: "salon" as const,
    },
    {
      src: "/media/apps-temoins-almadies/salon-1.webp",
      alt: "Salon — vue 02",
      room: "salon" as const,
    },
    {
      src: "/media/apps-temoins-almadies/living-room.webp",
      alt: "Living room",
      room: "salon" as const,
    },
    {
      src: "/media/apps-temoins-almadies/living-room-1.webp",
      alt: "Living room — vue 02",
      room: "salon" as const,
    },
    {
      src: "/media/apps-temoins-almadies/cuisine.webp",
      alt: "Cuisine",
      room: "cuisine" as const,
    },
    {
      src: "/media/apps-temoins-almadies/cuisine-1.webp",
      alt: "Cuisine — vue 02",
      room: "cuisine" as const,
    },
    {
      src: "/media/apps-temoins-almadies/kitchen.webp",
      alt: "Cuisine — détail",
      room: "cuisine" as const,
    },
    {
      src: "/media/apps-temoins-almadies/bedroom.webp",
      alt: "Chambre",
      room: "chambre" as const,
    },
    {
      src: "/media/apps-temoins-almadies/bedroom-1.webp",
      alt: "Chambre — vue 02",
      room: "chambre" as const,
    },
    {
      src: "/media/apps-temoins-almadies/couloir.webp",
      alt: "Couloir",
      room: "chambre" as const,
    },
    {
      src: "/media/apps-temoins-almadies/bathroom.webp",
      alt: "Salle de bain",
      room: "sdb" as const,
    },
    {
      src: "/media/apps-temoins-almadies/bathroom-1.webp",
      alt: "Salle de bain — vue 02",
      room: "sdb" as const,
    },
    {
      src: "/media/apps-temoins-almadies/salle-de-bain.webp",
      alt: "Salle de bain — vue 03",
      room: "sdb" as const,
    },
    {
      src: "/media/apps-temoins-almadies/09042026_214828.webp",
      alt: "Volumes — vue immersive",
      room: "salon" as const,
    },
  ] satisfies TemoinImage[],
};

