/**
 * Médias marketing réutilisables — intérieurs témoin Almadies (+ Type D legacy).
 */
import { APPS_TEMOINS_MEDIA } from "@/lib/apps-temoins-media";

export const TEMOIN_MEDIA = {
  salon1: APPS_TEMOINS_MEDIA.salon,
  salon2: APPS_TEMOINS_MEDIA.livingRoom,
  salon3: APPS_TEMOINS_MEDIA.salonAlt,
  salon4: APPS_TEMOINS_MEDIA.livingRoomAlt,
  salon5: APPS_TEMOINS_MEDIA.volume04,
  salon6: APPS_TEMOINS_MEDIA.hero,
  chambre1: APPS_TEMOINS_MEDIA.bedroom,
  chambre2: APPS_TEMOINS_MEDIA.bedroomAlt,
  chambre3: APPS_TEMOINS_MEDIA.couloir,
  chambre4: APPS_TEMOINS_MEDIA.bedroom,
  sdb1: APPS_TEMOINS_MEDIA.bathroom,
  sdb2: APPS_TEMOINS_MEDIA.bathroomAlt,
  sdb3: APPS_TEMOINS_MEDIA.salleDeBain,
  sdb4: APPS_TEMOINS_MEDIA.bathroom,
  cuisine1: APPS_TEMOINS_MEDIA.cuisine,
  cuisine2: APPS_TEMOINS_MEDIA.cuisineAlt,
  cuisine3: APPS_TEMOINS_MEDIA.kitchen,
  axo1: APPS_TEMOINS_MEDIA.dollhouse,
  axo2: APPS_TEMOINS_MEDIA.volume01,
  poster: APPS_TEMOINS_MEDIA.hero,
  typeASalon: APPS_TEMOINS_MEDIA.hero,
  typeAChambre: APPS_TEMOINS_MEDIA.bedroom,
} as const;

/** Galerie locale (home) — chantier / maquette + intérieurs témoins. */
export const LOCAL_GALLERY = [
  { src: "/Allure/HD.webp", alt: "Résidence Allure — vue d’ensemble" },
  { src: "/Allure/HD_137.webp", alt: "Résidence Allure — chantier" },
  { src: "/Allure/HD_139.webp", alt: "Résidence Allure — structure" },
  { src: TEMOIN_MEDIA.salon1, alt: "Appartement témoin — salon" },
  { src: TEMOIN_MEDIA.typeASalon, alt: "Appartement témoin — séjour" },
  { src: TEMOIN_MEDIA.chambre1, alt: "Appartement témoin — chambre" },
  { src: TEMOIN_MEDIA.typeAChambre, alt: "Appartement témoin — chambre" },
  { src: TEMOIN_MEDIA.sdb1, alt: "Appartement témoin — salle de bain" },
  { src: TEMOIN_MEDIA.axo1, alt: "Appartement témoin — vue d’ensemble" },
  { src: TEMOIN_MEDIA.cuisine1, alt: "Appartement témoin — cuisine" },
  { src: APPS_TEMOINS_MEDIA.volume02, alt: "Appartement témoin — volumes" },
] as const;
