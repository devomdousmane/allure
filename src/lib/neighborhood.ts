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

/** Résidence Allure — Rue NG-132 / Route des Almadies (géocodage site). */
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
 * Points d’intérêt autour de Résidence Allure (Almadies / Ngor).
 * Coordonnées OSM (Overpass, rayon ~1–2 km) — distances approximatives à pied.
 */
export const NEIGHBORHOOD_POIS: NeighborhoodPoi[] = [
  // —— Plages ——
  {
    id: "plage-almadies",
    category: "beach",
    label: "Plage des Almadies",
    detail: "Corniche — restos pieds dans le sable",
    distance: "5 min",
    coords: [-17.5214, 14.7409],
    zoom: 15.2,
  },
  {
    id: "plage-ngor",
    category: "beach",
    label: "Plage de Ngor",
    detail: "Spot surf & village de pêcheurs",
    distance: "10 min",
    coords: [-17.5128, 14.7502],
    zoom: 14.8,
  },
  {
    id: "pointe-almadies",
    category: "beach",
    label: "Pointe des Almadies",
    detail: "Point le plus à l’ouest du continent",
    distance: "12 min",
    coords: [-17.5282, 14.7454],
    zoom: 15,
  },

  // —— Écoles ——
  {
    id: "ipp-almadies",
    category: "school",
    label: "Institut Polytechnique Panafricain",
    detail: "Campus Almadies — ~450 m",
    distance: "6 min",
    coords: [-17.5149, 14.74424],
    zoom: 15,
  },
  {
    id: "lucie-leclerc",
    category: "school",
    label: "École Lucie Leclerc",
    detail: "Établissement de proximité",
    distance: "10 min",
    coords: [-17.51158, 14.74239],
    zoom: 14.8,
  },
  {
    id: "ort-ngor",
    category: "school",
    label: "ORT Sen Ngor",
    detail: "Formation & campus Ngor",
    distance: "8 min",
    coords: [-17.51335, 14.74676],
    zoom: 14.8,
  },

  // —— Santé ——
  {
    id: "pharmacie-almadies-ngor",
    category: "health",
    label: "Pharmacie Almadies Ngor",
    detail: "Pharmacie de proximité",
    distance: "9 min",
    coords: [-17.51284, 14.7464],
    zoom: 15,
  },
  {
    id: "pharmacie-seydina",
    category: "health",
    label: "Pharmacie Seydina Mouhamed",
    detail: "Route de la Mosquée de Ngor",
    distance: "9 min",
    coords: [-17.5147, 14.74916],
    zoom: 15,
  },
  {
    id: "clinique-knox",
    category: "health",
    label: "Cabinet Dr Knox",
    detail: "Soins de proximité Almadies",
    distance: "12 min",
    coords: [-17.51144, 14.73899],
    zoom: 14.8,
  },

  // —— Restaurants (adresses réelles OSM) ——
  {
    id: "maison-celine",
    category: "restaurant",
    label: "La Maison de Céline",
    detail: "Restaurant — à 200 m de la résidence",
    distance: "3 min",
    coords: [-17.51805, 14.74566],
    zoom: 15.4,
  },
  {
    id: "kotao",
    category: "restaurant",
    label: "Kotao",
    detail: "Cuisine internationale — Route de King Fahd",
    distance: "3 min",
    coords: [-17.52096, 14.74334],
    zoom: 15.4,
  },
  {
    id: "poesia",
    category: "restaurant",
    label: "Poesia",
    detail: "Adresse Almadies — terrasse",
    distance: "5 min",
    coords: [-17.52052, 14.74111],
    zoom: 15.2,
  },
  {
    id: "chez-fatou",
    category: "restaurant",
    label: "Chez Fatou",
    detail: "Fruits de mer — Corniche des Almadies",
    distance: "6 min",
    coords: [-17.52137, 14.74093],
    zoom: 15.2,
  },
  {
    id: "3-flamingos",
    category: "restaurant",
    label: "3 Flamingos",
    detail: "Terrasse face à la mer",
    distance: "6 min",
    coords: [-17.51996, 14.74041],
    zoom: 15.2,
  },
  {
    id: "prainha",
    category: "restaurant",
    label: "Crêperie Prainha",
    detail: "Crêpes — Corniche des Almadies",
    distance: "5 min",
    coords: [-17.51825, 14.74055],
    zoom: 15.2,
  },
  {
    id: "sharkys",
    category: "restaurant",
    label: "Sharkys",
    detail: "Sushi & bord de mer",
    distance: "6 min",
    coords: [-17.52034, 14.74055],
    zoom: 15.2,
  },
  {
    id: "bahia",
    category: "restaurant",
    label: "Bahia Beach Club",
    detail: "Beach club — Corniche",
    distance: "6 min",
    coords: [-17.52175, 14.74105],
    zoom: 15.2,
  },
  {
    id: "cabanon",
    category: "restaurant",
    label: "Le Cabanon",
    detail: "Adresse prisée des Almadies",
    distance: "8 min",
    coords: [-17.51698, 14.73906],
    zoom: 15,
  },
  {
    id: "ngor-pieds-eau",
    category: "restaurant",
    label: "Le Ngor, Pieds dans l’eau",
    detail: "Fruits de mer — vue océan",
    distance: "9 min",
    coords: [-17.52481, 14.74116],
    zoom: 15,
  },
  {
    id: "la-pointe",
    category: "restaurant",
    label: "La Pointe des Almadies",
    detail: "Restaurant multi-cuisines — Pointe",
    distance: "12 min",
    coords: [-17.52799, 14.74535],
    zoom: 15,
  },

  // —— Transport ——
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
    id: "corniche-ouest",
    category: "transport",
    label: "Corniche Ouest",
    detail: "Axe principal — Est de la résidence",
    distance: "4 min",
    coords: [-17.5145, 14.744],
    zoom: 14.6,
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

  // —— Commerces ——
  {
    id: "american-food",
    category: "shopping",
    label: "American Food Store",
    detail: "Épicerie — Route de King Fahd",
    distance: "3 min",
    coords: [-17.52111, 14.74345],
    zoom: 15.2,
  },
  {
    id: "casino",
    category: "shopping",
    label: "Casino",
    detail: "Supermarché Almadies",
    distance: "11 min",
    coords: [-17.51141, 14.74114],
    zoom: 14.8,
  },
  {
    id: "credit-mutuel",
    category: "shopping",
    label: "Crédit Mutuel",
    detail: "Banque — Route de Ngor",
    distance: "9 min",
    coords: [-17.51381, 14.7477],
    zoom: 15,
  },
  {
    id: "fbnbank",
    category: "shopping",
    label: "FBNBank",
    detail: "Agence & distributeur — Route de Ngor",
    distance: "11 min",
    coords: [-17.51114, 14.74238],
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
