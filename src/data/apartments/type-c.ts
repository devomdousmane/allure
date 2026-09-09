import type { ApartmentDetail } from "./types";

/**
 * Appartement Type C — données issues des plans WP
 * (dimenssions_app_type-c.jpg, étages 1–11).
 * Plan interactif : SVG allure-type-c-interactive.svg (16 zones .room).
 */
export const TYPE_C: ApartmentDetail = {
  id: "type-c",
  slug: "type-c",
  name: "Appartement Type C",
  tagline: "L’élégance, même dans les détails",
  description:
    "Séjour monumental de près de 70 m², kitchenette et cuisine, suite parentale généreuse et chambre domestique — une typologie pensée pour recevoir.",
  floors: "Étages 1–11",
  surfaceTotal: 212.66,
  bedrooms: 3,
  bathrooms: 3,
  guestToilets: 1,
  terraces: 1,
  hasStaffRoom: true,
  price: "Sur demande",
  highlights: [
    "212,66 m² habitables",
    "Salon 69,60 m²",
    "Cuisine + kitchenette",
    "Chambre domestique",
  ],
  heroImage: "/apartments/type-c/gallery-liv-01.webp",
  planFace: "/apartments/type-c/plan-face.webp",
  planHaut: "/apartments/type-c/plan-haut.webp",
  dimensionsPlan: "/apartments/type-c/dimensions-plan.webp",
  dimensionsListe: "/apartments/type-c/dimensions-liste.webp",
  interactivePlan: "/apartments/type-c/allure-type-c-interactive.svg",
  brochure: "/apartments/brochure.pdf",
  gallery: [
    {
      src: "/apartments/type-c/gallery-bed.webp",
      alt: "Chambre — Appartement Type C",
    },
    {
      src: "/apartments/type-c/gallery-liv-01.webp",
      alt: "Séjour — Appartement Type C",
    },
    {
      src: "/apartments/type-c/gallery-liv-02.webp",
      alt: "Espace de vie — Appartement Type C",
    },
    {
      src: "/apartments/type-c/gallery-bath.webp",
      alt: "Salle de bain — Appartement Type C",
    },
  ],
  rooms: [
    {
      id: "wc-visiteur",
      label: "Toilettes Visiteur",
      surface: 3.01,
      category: "wet",
    },
    {
      id: "salon-sam",
      label: "Salon et Salle à manger",
      surface: 69.6,
      category: "living",
      hotspot: { x: 55, y: 58 },
    },
    {
      id: "kitchenette",
      label: "Kitchnette",
      surface: 10.09,
      category: "living",
      hotspot: { x: 38, y: 48 },
    },
    {
      id: "cuisine",
      label: "Cuisine",
      surface: 11.72,
      category: "living",
      hotspot: { x: 42, y: 58 },
    },
    { id: "buanderie", label: "Buanderie", surface: 3.17, category: "service" },
    {
      id: "chambre-domestique",
      label: "Chambre Domestique",
      surface: 3.7,
      category: "service",
      hotspot: { x: 32, y: 62 },
    },
    {
      id: "wc-dom",
      label: "Toilettes Domestiques",
      surface: 1.84,
      category: "wet",
    },
    {
      id: "chambre-enfants-02",
      label: "Chambre Enfants 02",
      surface: 17.41,
      category: "sleeping",
      hotspot: { x: 28, y: 35 },
    },
    {
      id: "sdb-ch-02",
      label: "Salle de bain Ch. 02",
      surface: 4.67,
      category: "wet",
    },
    {
      id: "sdb-ch-01",
      label: "Salle de bain Ch. 01",
      surface: 4.67,
      category: "wet",
    },
    {
      id: "chambre-enfants-01",
      label: "Chambre Enfants 01",
      surface: 17.41,
      category: "sleeping",
      hotspot: { x: 28, y: 52 },
    },
    {
      id: "sdb-parents",
      label: "Salle de bain Ch. Parents",
      surface: 11.25,
      category: "wet",
    },
    {
      id: "chambre-parents",
      label: "Chambre Parents",
      surface: 22.24,
      category: "sleeping",
      hotspot: { x: 68, y: 30 },
    },
    {
      id: "terrasse",
      label: "Terrasse",
      surface: 16.99,
      category: "outdoor",
      hotspot: { x: 85, y: 50 },
    },
    {
      id: "clim",
      label: "Machine Climatisation",
      surface: 0.71,
      category: "technical",
    },
    {
      id: "bac",
      label: "Bac à fleurs",
      surface: 14.18,
      category: "outdoor",
      hotspot: { x: 88, y: 72 },
    },
  ],
};
