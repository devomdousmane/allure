import type { ApartmentDetail } from "./types";

/**
 * Appartement Type D — données issues des plans WP
 * (dimenssion-Type-D.jpg, étages 1–14).
 * Plan interactif : SVG allure-type-d-interactive.svg (15 zones .room).
 */
export const TYPE_D: ApartmentDetail = {
  id: "type-d",
  slug: "type-d",
  name: "Appartement Type D",
  tagline: "L’élégance, même dans les détails",
  description:
    "Typologie compacte et fluide : grand salon-salle à manger, trois chambres, arrière-cuisine, terrasse et balcon — idéale pour un quotidien sans superflu.",
  floors: "Étages 1–14",
  surfaceTotal: 164.07,
  bedrooms: 3,
  bathrooms: 3,
  guestToilets: 1,
  terraces: 1,
  hasStaffRoom: false,
  price: "Sur demande",
  highlights: [
    "164,07 m² habitables",
    "Salon 58,82 m²",
    "Terrasse + balcon",
    "Arrière-cuisine",
  ],
  heroImage: "/apartments/type-d/gallery-liv.webp",
  planFace: "/apartments/type-d/plan-face.webp",
  planHaut: "/apartments/type-d/plan-haut.webp",
  dimensionsPlan: "/apartments/type-d/dimensions-plan.webp",
  dimensionsListe: "/apartments/type-d/dimensions-liste.webp",
  interactivePlan: "/apartments/type-d/allure-type-d-interactive.svg",
  brochure: "/apartments/brochure.pdf",
  gallery: [
    {
      src: "/apartments/type-d/gallery-bed.webp",
      alt: "Chambre — Appartement Type D",
    },
    {
      src: "/apartments/type-d/gallery-liv.webp",
      alt: "Séjour — Appartement Type D",
    },
    {
      src: "/apartments/type-d/gallery-kitchen.webp",
      alt: "Cuisine — Appartement Type D",
    },
    {
      src: "/apartments/type-d/gallery-bath.webp",
      alt: "Salle de bain — Appartement Type D",
    },
  ],
  rooms: [
    {
      id: "wc-visiteur",
      label: "Toilettes Visiteur",
      surface: 2.6,
      category: "wet",
    },
    {
      id: "arriere-cuisine",
      label: "Arrière Cuisine",
      surface: 4.82,
      category: "service",
    },
    {
      id: "salon-sam",
      label: "Salon & Salle à manger",
      surface: 58.82,
      category: "living",
      hotspot: { x: 55, y: 55 },
    },
    {
      id: "sdb-parents",
      label: "Salle de bain Ch. Parents",
      surface: 5.57,
      category: "wet",
    },
    { id: "deg-1", label: "Dégagement", surface: 2.66, category: "circulation" },
    {
      id: "chambre-parents",
      label: "Chambre Parents",
      surface: 19.91,
      category: "sleeping",
      hotspot: { x: 68, y: 28 },
    },
    {
      id: "balcon",
      label: "Balcon",
      surface: 4.69,
      category: "outdoor",
      hotspot: { x: 78, y: 22 },
    },
    {
      id: "chambre-enfants-02",
      label: "Chambre Enfants 02",
      surface: 14.69,
      category: "sleeping",
      hotspot: { x: 28, y: 35 },
    },
    {
      id: "sdb-ch-02",
      label: "Salle de bain Ch. 02",
      surface: 3.9,
      category: "wet",
    },
    { id: "deg-2", label: "Dégagement", surface: 2.66, category: "circulation" },
    {
      id: "sdb-ch-01",
      label: "Salle de bain Ch. 01",
      surface: 7.38,
      category: "wet",
    },
    {
      id: "chambre-01",
      label: "Chambre 01",
      surface: 18.7,
      category: "sleeping",
      hotspot: { x: 28, y: 58 },
    },
    {
      id: "terrasse",
      label: "Terrasse",
      surface: 9.57,
      category: "outdoor",
      hotspot: { x: 85, y: 55 },
    },
    {
      id: "clim",
      label: "Machine Climatisation",
      surface: 0.82,
      category: "technical",
    },
    { id: "bac", label: "Bac à fleurs", surface: 7.28, category: "outdoor" },
  ],
};
