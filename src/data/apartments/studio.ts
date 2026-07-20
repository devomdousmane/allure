import type { ApartmentDetail } from "./types";

/**
 * Studio — données issues des plans WP
 * (dimenssions_studio, étages 1–14).
 * Plan interactif : SVG allure-studio-interactive.svg (9 zones .room).
 */
export const STUDIO: ApartmentDetail = {
  id: "studio",
  slug: "studio",
  name: "Studio",
  tagline: "L’élégance, même dans les détails",
  description:
    "Pied-à-terre premium aux Almadies : chambre séparée, salon, salle à manger, kitchenette et terrasse — un format optimisé sans compromis sur le standing.",
  floors: "Étages 1–14",
  surfaceTotal: 81.69,
  bedrooms: 1,
  bathrooms: 1,
  guestToilets: 1,
  terraces: 1,
  hasStaffRoom: false,
  price: "Sur demande",
  highlights: [
    "81,69 m² habitables",
    "Chambre séparée 19,79 m²",
    "Terrasse 13,52 m²",
    "Idéal investissement",
  ],
  heroImage: "/apartments/studio/gallery-liv.webp",
  planFace: "/apartments/studio/plan-face.webp",
  planHaut: "/apartments/studio/plan-haut.webp",
  dimensionsPlan: "/apartments/studio/dimensions-plan.webp",
  dimensionsListe: "/apartments/studio/dimensions-liste.webp",
  interactivePlan: "/apartments/studio/allure-studio-interactive.svg",
  brochure: "/apartments/brochure.pdf",
  gallery: [
    {
      src: "/apartments/studio/gallery-bed.webp",
      alt: "Chambre — Studio Allure",
    },
    {
      src: "/apartments/studio/gallery-liv.webp",
      alt: "Salon — Studio Allure",
    },
    {
      src: "/apartments/studio/gallery-bath.webp",
      alt: "Salle de bain — Studio Allure",
    },
    {
      src: "/apartments/studio/gallery-hall.webp",
      alt: "Hall — Studio Allure",
    },
  ],
  rooms: [
    {
      id: "degagement",
      label: "Dégagement",
      surface: 6.57,
      category: "circulation",
      hotspot: { x: 72, y: 72 },
    },
    {
      id: "wc-visiteur",
      label: "Toilettes Visiteur",
      surface: 2.83,
      category: "wet",
      hotspot: { x: 78, y: 28 },
    },
    {
      id: "sdb",
      label: "Salle de bain Chambre",
      surface: 6.35,
      category: "wet",
      hotspot: { x: 68, y: 28 },
    },
    {
      id: "chambre",
      label: "Chambre",
      surface: 19.79,
      category: "sleeping",
      hotspot: { x: 48, y: 28 },
    },
    {
      id: "terrasse",
      label: "Terrasse",
      surface: 13.52,
      category: "outdoor",
      hotspot: { x: 22, y: 45 },
    },
    {
      id: "clim",
      label: "Machine Climatisation",
      surface: 0.6,
      category: "technical",
      hotspot: { x: 18, y: 72 },
    },
    {
      id: "salon",
      label: "Salon",
      surface: 20.3,
      category: "living",
      hotspot: { x: 48, y: 68 },
    },
    {
      id: "sam",
      label: "Salle à manger",
      surface: 7.98,
      category: "living",
      hotspot: { x: 55, y: 52 },
    },
    {
      id: "kitchenette",
      label: "Kitchnette",
      surface: 3.75,
      category: "living",
      hotspot: { x: 72, y: 58 },
    },
  ],
};
