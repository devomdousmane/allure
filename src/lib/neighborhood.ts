import type { LucideIcon } from "lucide-react";
import {
  Building2,
  GraduationCap,
  Hospital,
  ShoppingBag,
  TrainFront,
  UtensilsCrossed,
  Waves,
} from "lucide-react";

/** Résidence Allure — Route des Almadies (géocodage Nominatim). */
export const ALLURE_RESIDENCE: [number, number] = [-17.519, 14.744];

export type NeighborhoodCategory =
  | "all"
  | "beach"
  | "school"
  | "health"
  | "restaurant"
  | "transport"
  | "shopping";

export type NeighborhoodPoi = {
  id: string;
  category: Exclude<NeighborhoodCategory, "all">;
  label: string;
  detail: string;
  distance: string;
  /** [lng, lat] */
  coords: [number, number];
  /** Zoom cible au focus */
  zoom?: number;
};

export const NEIGHBORHOOD_CATEGORIES: {
  id: NeighborhoodCategory;
  label: string;
  icon: LucideIcon;
}[] = [
  { id: "all", label: "Tout", icon: Building2 },
  { id: "beach", label: "Plage", icon: Waves },
  { id: "school", label: "Écoles", icon: GraduationCap },
  { id: "health", label: "Santé", icon: Hospital },
  { id: "restaurant", label: "Restos", icon: UtensilsCrossed },
  { id: "transport", label: "Transport", icon: TrainFront },
  { id: "shopping", label: "Commerces", icon: ShoppingBag },
];

/**
 * Points d’intérêt Almadies / Ngor — distances approximatives à pied ou en voiture.
 * Coordonnées orientatives pour la démo carte (affinage GPS possible plus tard).
 */
export const NEIGHBORHOOD_POIS: NeighborhoodPoi[] = [
  {
    id: "plage-almadies",
    category: "beach",
    label: "Plage des Almadies",
    detail: "Sable fin, restaurants de bord de mer",
    distance: "300 m",
    coords: [-17.5287, 14.7449],
    zoom: 15.2,
  },
  {
    id: "plage-ngor",
    category: "beach",
    label: "Plage de Ngor",
    detail: "Spot surf & village de pêcheurs",
    distance: "8 min",
    coords: [-17.5128, 14.7502],
    zoom: 14.8,
  },
  {
    id: "ecole-int",
    category: "school",
    label: "Écoles internationales",
    detail: "Campus & établissements bilingues",
    distance: "5 min",
    coords: [-17.5155, 14.7395],
    zoom: 14.6,
  },
  {
    id: "universite",
    category: "school",
    label: "Pôle universitaire",
    detail: "Écoles & formations à proximité",
    distance: "12 min",
    coords: [-17.468, 14.692],
    zoom: 13.2,
  },
  {
    id: "clinique",
    category: "health",
    label: "Cliniques & centres de santé",
    detail: "Soins de proximité Almadies / Ngor",
    distance: "7 min",
    coords: [-17.5085, 14.7418],
    zoom: 14.4,
  },
  {
    id: "pharmacie",
    category: "health",
    label: "Pharmacies de garde",
    detail: "Services de santé du quotidien",
    distance: "4 min",
    coords: [-17.5172, 14.7428],
    zoom: 15,
  },
  {
    id: "restos-virage",
    category: "restaurant",
    label: "Restaurants & terrasses",
    detail: "Adresse gastronomique des Almadies",
    distance: "3 min",
    coords: [-17.5225, 14.7462],
    zoom: 15,
  },
  {
    id: "cafe-lounge",
    category: "restaurant",
    label: "Cafés & lounges",
    detail: "Ambiances jour / soir",
    distance: "5 min",
    coords: [-17.5208, 14.7415],
    zoom: 15,
  },
  {
    id: "taxi-yango",
    category: "transport",
    label: "Mobility & taxis",
    detail: "Yango, taxis, VTC — accès direct",
    distance: "2 min",
    coords: [-17.5178, 14.7435],
    zoom: 15.2,
  },
  {
    id: "airport",
    category: "transport",
    label: "Aéroport AIBD",
    detail: "Liaison autoroutière",
    distance: "35 min",
    coords: [-17.0735, 14.665],
    zoom: 11.2,
  },
  {
    id: "supermarche",
    category: "shopping",
    label: "Supermarchés & commerces",
    detail: "Courses et services du quotidien",
    distance: "4 min",
    coords: [-17.5135, 14.7425],
    zoom: 14.8,
  },
  {
    id: "banques",
    category: "shopping",
    label: "Banques & services",
    detail: "Agences et distributeurs",
    distance: "6 min",
    coords: [-17.5168, 14.7402],
    zoom: 14.8,
  },
];

export const CATEGORY_COLORS: Record<
  Exclude<NeighborhoodCategory, "all">,
  string
> = {
  beach: "#3B8EA5",
  school: "#C4A35A",
  health: "#C45C5C",
  restaurant: "#D4A574",
  transport: "#5B7C99",
  shopping: "#E0BF89",
};

export function poisForCategory(category: NeighborhoodCategory) {
  if (category === "all") return NEIGHBORHOOD_POIS;
  return NEIGHBORHOOD_POIS.filter((p) => p.category === category);
}

/** Icône SVG path pour pins Mapbox (viewBox approx 0 0 14 14). */
export const POI_PIN_PATHS: Record<
  Exclude<NeighborhoodCategory, "all"> | "home" | "plane",
  string
> = {
  home: '<path d="M1 6.5 7 1.5l6 5V13a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1Z"/><path d="M5 14V9h4v5"/>',
  beach:
    '<path d="M0 6c1.2-1.2 2.5-1.2 3.7 0 1.2 1.2 2.5 1.2 3.7 0 1.2-1.2 2.5-1.2 3.7 0 1.2 1.2 2.5 1.2 3.7 0"/><path d="M0 11c1.2-1.2 2.5-1.2 3.7 0 1.2 1.2 2.5 1.2 3.7 0 1.2-1.2 2.5-1.2 3.7 0 1.2 1.2 2.5 1.2 3.7 0"/>',
  school:
    '<path d="M7 1 1 4.2 7 7.4 13 4.2Z"/><path d="M3 6v4c0 .8 1.8 1.6 4 1.6s4-.8 4-1.6V6"/>',
  health: '<path d="M5.5 2h3v3.5H12v3H8.5V12h-3V8.5H2v-3h3.5Z"/>',
  restaurant:
    '<path d="M3.5 1.5v7M3.5 9.5v3.5M2 1.5v3.5a1.5 1.5 0 0 0 3 0V1.5M9 1.5v5a2 2 0 0 0 2 2V13"/>',
  transport:
    '<rect x="2" y="3.5" width="10" height="6.5" rx="1"/><path d="M4.5 10v2.5M9.5 10v2.5M2 7h10"/>',
  shopping:
    '<path d="M1.5 4.5h11l-1 8.5H2.5Z"/><path d="M4.5 4.5V3A2.5 2.5 0 0 1 7 .5 2.5 2.5 0 0 1 9.5 3v1.5"/>',
  plane:
    '<path d="M7 1v12M1.5 5 12.5 8.5M1.5 8.5 12.5 5M4.5 11l2.5 2 2.5-2"/>',
};

