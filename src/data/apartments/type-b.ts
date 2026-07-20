import type { ApartmentDetail } from "./types";

/**
 * Appartement Type B — données issues des plans WP
 * (dimmenssion_app-Type-B.jpg, étages 1–14).
 * Plan interactif : SVG allure-type-b-interactive.svg (zones .room).
 */
export const TYPE_B: ApartmentDetail = {
  id: "type-b",
  slug: "type-b",
  name: "Appartement Type B",
  tagline: "L’élégance, même dans les détails",
  description:
    "Typologie familiale équilibrée : grand séjour, espace familial dédié, suite parentale avec dressing, et terrasse prolongée d’un balcon.",
  floors: "Étages 1–14",
  surfaceTotal: 203.75,
  bedrooms: 3,
  bathrooms: 3,
  guestToilets: 1,
  terraces: 1,
  hasStaffRoom: false,
  price: "Sur demande",
  highlights: [
    "203,75 m² habitables",
    "Espace familial 12,22 m²",
    "Terrasse + balcon",
    "Suite parentale avec dressing",
  ],
  heroImage: "/apartments/type-b/gallery-liv.webp",
  planFace: "/apartments/type-b/plan-face.webp",
  planHaut: "/apartments/type-b/plan-haut.webp",
  dimensionsPlan: "/apartments/type-b/dimensions-plan.webp",
  dimensionsListe: "/apartments/type-b/dimensions-liste.webp",
  interactivePlan: "/apartments/type-b/allure-type-b-interactive.svg",
  brochure: "/apartments/brochure.pdf",
  gallery: [
    {
      src: "/apartments/type-b/gallery-bed.webp",
      alt: "Chambre — Appartement Type B",
    },
    {
      src: "/apartments/type-b/gallery-liv.webp",
      alt: "Séjour — Appartement Type B",
    },
    {
      src: "/apartments/type-b/gallery-kitchen.webp",
      alt: "Cuisine — Appartement Type B",
    },
    {
      src: "/apartments/type-b/gallery-balc.webp",
      alt: "Balcon — Appartement Type B",
    },
  ],
  rooms: [
    { id: "hall", label: "Hall Entrée", surface: 4.77, category: "circulation" },
    {
      id: "sejour",
      label: "Salle de Séjour",
      surface: 48.51,
      category: "living",
      hotspot: { x: 55, y: 55 },
    },
    {
      id: "terrasse",
      label: "Terrasse",
      surface: 13.36,
      category: "outdoor",
      hotspot: { x: 82, y: 48 },
    },
    { id: "wc-dom", label: "WC Domestiques", surface: 1.53, category: "wet" },
    { id: "buanderie", label: "Buanderie", surface: 5.73, category: "service" },
    {
      id: "cuisine",
      label: "Cuisine",
      surface: 17.15,
      category: "living",
      hotspot: { x: 42, y: 48 },
    },
    {
      id: "wc-visiteur",
      label: "Toilettes Visiteurs",
      surface: 2.6,
      category: "wet",
    },
    { id: "deg-1", label: "Dégagement", surface: 3.33, category: "circulation" },
    {
      id: "espace-familial",
      label: "Espace familial",
      surface: 12.22,
      category: "living",
      hotspot: { x: 48, y: 35 },
    },
    { id: "deg-2", label: "Dégagement", surface: 2.67, category: "circulation" },
    {
      id: "sdb-ch-02",
      label: "Salle de bain Ch 02",
      surface: 5.53,
      category: "wet",
    },
    {
      id: "chambre-enfants-02",
      label: "Chambre Enfants 02",
      surface: 15.56,
      category: "sleeping",
      hotspot: { x: 28, y: 30 },
    },
    {
      id: "chambre-enfants-01",
      label: "Chambre Enfants 01",
      surface: 15.56,
      category: "sleeping",
      hotspot: { x: 28, y: 55 },
    },
    { id: "deg-3", label: "Dégagement", surface: 2.67, category: "circulation" },
    {
      id: "sdb-ch-01",
      label: "Salle de bain Ch 01",
      surface: 5.53,
      category: "wet",
    },
    {
      id: "sdb-parents",
      label: "Salle de bain Ch. parents",
      surface: 7.86,
      category: "wet",
    },
    { id: "deg-4", label: "Dégagement", surface: 5.77, category: "circulation" },
    {
      id: "dressing",
      label: "Dressing",
      surface: 6.12,
      category: "sleeping",
      hotspot: { x: 62, y: 22 },
    },
    {
      id: "chambre-parents",
      label: "Chambre Parents",
      surface: 17.27,
      category: "sleeping",
      hotspot: { x: 70, y: 28 },
    },
    {
      id: "balcon",
      label: "Balcon",
      surface: 5.81,
      category: "outdoor",
      hotspot: { x: 78, y: 22 },
    },
    { id: "bac", label: "Bac à fleurs", surface: 3.6, category: "outdoor" },
    {
      id: "clim",
      label: "Machine Climatisation",
      surface: 0.6,
      category: "technical",
    },
  ],
};
