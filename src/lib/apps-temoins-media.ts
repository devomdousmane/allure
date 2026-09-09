/**
 * Médias optimisés — appartement témoin Almadies
 * Source : public/apps-temoins-almadies → public/media/apps-temoins-almadies
 */
const BASE = "/media/apps-temoins-almadies";

export const APPS_TEMOINS_MEDIA = {
  hero: `${BASE}/salon-salle-a-manger.webp`,
  salon: `${BASE}/salon.webp`,
  salonAlt: `${BASE}/salon-1.webp`,
  livingRoom: `${BASE}/living-room.webp`,
  livingRoomAlt: `${BASE}/living-room-1.webp`,
  cuisine: `${BASE}/cuisine.webp`,
  cuisineAlt: `${BASE}/cuisine-1.webp`,
  kitchen: `${BASE}/kitchen.webp`,
  kitchenAlt: `${BASE}/kitchen-1.webp`,
  bedroom: `${BASE}/bedroom.webp`,
  bedroomAlt: `${BASE}/bedroom-1.webp`,
  bathroom: `${BASE}/bathroom.webp`,
  bathroomAlt: `${BASE}/bathroom-1.webp`,
  salleDeBain: `${BASE}/salle-de-bain.webp`,
  couloir: `${BASE}/couloir.webp`,
  dollhouse: `${BASE}/dollhouse-view.webp`,
  /** Vues numériques horodatées (ambiance / volumes) */
  volume01: `${BASE}/09042026_213848.webp`,
  volume02: `${BASE}/09042026_214041.webp`,
  volume03: `${BASE}/09042026_214324.webp`,
  volume04: `${BASE}/09042026_214828.webp`,
  planImage: `${BASE}/plan/floor-1-p1.webp`,
  planPdf: `${BASE}/plan/floor-1.pdf`,
} as const;

export type AppsTemoinsMediaKey = keyof typeof APPS_TEMOINS_MEDIA;
