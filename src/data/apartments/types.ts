export type ApartmentRoomCategory =
  | "circulation"
  | "living"
  | "sleeping"
  | "wet"
  | "service"
  | "outdoor"
  | "technical";

export type ApartmentRoom = {
  id: string;
  label: string;
  surface: number;
  category: ApartmentRoomCategory;
  /** Optional hotspot on interactive plan (0–100 %) */
  hotspot?: { x: number; y: number };
};

export type ApartmentGalleryImage = {
  src: string;
  alt: string;
};

export type ApartmentDetail = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  floors: string;
  surfaceTotal: number;
  bedrooms: number;
  bathrooms: number;
  guestToilets: number;
  terraces: number;
  hasStaffRoom: boolean;
  price: string;
  highlights: string[];
  heroImage: string;
  planFace: string;
  planHaut: string;
  dimensionsPlan: string;
  dimensionsListe: string;
  /** SVG interactif (.room / data-room) — prioritaire sur le plan JPG + hotspots */
  interactivePlan?: string;
  brochure: string;
  gallery: ApartmentGalleryImage[];
  rooms: ApartmentRoom[];
};
