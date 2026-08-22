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
  /** Visite virtuelle Matterport (prioritaire sur la vidéo si les deux existent). */
  matterport?: TemoinMatterport;
  planImage?: string;
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

const TYPE_A_BASE = "/media/appartements-temoins/type-a";

function typeAImg(
  room: TemoinRoomId,
  file: string,
  alt: string
): TemoinImage {
  return { src: `${TYPE_A_BASE}/${room}/${file}.webp`, alt, room };
}

/** Chemins WebP Type A (drop appartement-temoins-1). */
export const TYPE_A_MEDIA = {
  hero: `${TYPE_A_BASE}/salon/salon-et-salle-a-manger.webp`,
  planImage: `${TYPE_A_BASE}/plan/floor-1.webp`,
  /** Visite Matterport F4 Almadies — poster salon fourni. */
  matterport: {
    modelId: "ctqSSwX97oz",
    poster:
      "/media/appartements-temoins/visite-virtuelle/matterport-poster.webp",
    title: "Visite virtuelle — appartement témoin F4",
  },
  gallery: [
    typeAImg("axo", "plan-3d", "Axonométrie 3D — Type A"),
    typeAImg("salon", "salon", "Salon"),
    typeAImg("salon", "salon-et-salle-a-manger", "Salon et salle à manger"),
    typeAImg("salon", "salon-et-salle-a-manger-1", "Salon et salle à manger — vue 02"),
    typeAImg("salon", "salon-et-salle-a-manger-2", "Salon et salle à manger — vue 03"),
    typeAImg("salon", "salon-et-salle-a-manger-3", "Salon et salle à manger — vue 04"),
    typeAImg("salon", "salon-et-salle-a-manger-4", "Salon et salle à manger — vue 05"),
    typeAImg("salon", "balcon-salon", "Balcon du salon"),
    typeAImg("salon", "balcon-salon-1", "Balcon du salon — vue 02"),
    typeAImg("cuisine", "cuisine", "Cuisine"),
    typeAImg("cuisine", "cuisine-1", "Cuisine — vue 02"),
    typeAImg("chambre", "chambre-parent", "Chambre parentale"),
    typeAImg("chambre", "chambre-parent-1", "Chambre parentale — vue 02"),
    typeAImg("chambre", "chambre-parent-2", "Chambre parentale — vue 03"),
    typeAImg("chambre", "chambre-parent-3", "Chambre parentale — vue 04"),
    typeAImg("chambre", "chambre-parent-4", "Chambre parentale — vue 05"),
    typeAImg("chambre", "chambre-parent-dressing", "Dressing — chambre parentale"),
    typeAImg("chambre", "balcon-chambre-parent", "Balcon — chambre parentale"),
    typeAImg("chambre", "balcon-chambre-parent-1", "Balcon — chambre parentale, vue 02"),
    typeAImg("chambre", "chambre-1", "Chambre 1"),
    typeAImg("chambre", "chambre-1-1", "Chambre 1 — vue 02"),
    typeAImg("chambre", "chambre-2", "Chambre 2"),
    typeAImg("chambre", "chambre-2-1", "Chambre 2 — vue 02"),
    typeAImg("chambre", "chambre-2-2", "Chambre 2 — vue 03"),
    typeAImg("chambre", "chambre-2-3", "Chambre 2 — vue 04"),
    typeAImg("chambre", "acces-chambre-1-et-2", "Accès chambres 1 et 2"),
    typeAImg("chambre", "couloir-entre", "Couloir"),
    typeAImg("sdb", "chambre-parent-salle-de-bain", "Salle de bain parentale"),
    typeAImg(
      "sdb",
      "chambre-parent-salle-de-bain-1",
      "Salle de bain parentale — vue 02"
    ),
    typeAImg(
      "sdb",
      "chambre-parent-salle-de-bain-2",
      "Salle de bain parentale — vue 03"
    ),
    typeAImg(
      "sdb",
      "chambre-parent-salle-de-bain-3",
      "Salle de bain parentale — vue 04"
    ),
    typeAImg("sdb", "salle-de-bain-chambre-1", "Salle de bain — chambre 1"),
    typeAImg("sdb", "salle-de-bain-chambre-1-1", "Salle de bain — chambre 1, vue 02"),
    typeAImg("sdb", "chambre-2-salle-de-bain", "Salle de bain — chambre 2"),
    typeAImg("sdb", "chambre-2-salle-de-bain-1", "Salle de bain — chambre 2, vue 02"),
    typeAImg("sdb", "toilette-visiteur", "Toilette visiteur"),
  ] satisfies TemoinImage[],
};
