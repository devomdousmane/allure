/**
 * Médias marketing réutilisables — intérieurs des appartements témoins
 * (évite l’effet « resto / salle à manger » des anciennes vues dining).
 */
export const TEMOIN_MEDIA = {
  salon1: "/media/appartements-temoins/type-d/salon/liv01.webp",
  salon2: "/media/appartements-temoins/type-d/salon/liv02.webp",
  salon3: "/media/appartements-temoins/type-d/salon/liv03.webp",
  salon4: "/media/appartements-temoins/type-d/salon/liv04.webp",
  salon5: "/media/appartements-temoins/type-d/salon/liv05.webp",
  salon6: "/media/appartements-temoins/type-d/salon/liv06.webp",
  chambre1: "/media/appartements-temoins/type-d/chambre/bed01.webp",
  chambre2: "/media/appartements-temoins/type-d/chambre/bed02.webp",
  chambre3: "/media/appartements-temoins/type-d/chambre/bed03.webp",
  chambre4: "/media/appartements-temoins/type-d/chambre/bed04.webp",
  sdb1: "/media/appartements-temoins/type-d/sdb/bath01.webp",
  sdb2: "/media/appartements-temoins/type-d/sdb/bath02.webp",
  sdb3: "/media/appartements-temoins/type-d/sdb/bath03.webp",
  sdb4: "/media/appartements-temoins/type-d/sdb/bath04.webp",
  cuisine1: "/media/appartements-temoins/type-d/cuisine/kitch01.webp",
  cuisine2: "/media/appartements-temoins/type-d/cuisine/kitch02.webp",
  cuisine3: "/media/appartements-temoins/type-d/cuisine/kitch03.webp",
  axo1: "/media/appartements-temoins/type-d/axo/axo01.webp",
  axo2: "/media/appartements-temoins/type-d/axo/axo02.webp",
  poster: "/media/appartements-temoins/type-d/video/poster.webp",
  typeASalon: "/media/appartements-temoins/type-a/salon/salon-et-salle-a-manger.webp",
  typeAChambre:
    "/media/appartements-temoins/type-a/chambre/chambre-parent.webp",
} as const;

/** Galerie locale (home) — chantier / maquette + intérieurs témoins. */
export const LOCAL_GALLERY = [
  { src: "/Allure/HD.webp", alt: "Résidence Allure — vue d’ensemble" },
  { src: "/Allure/HD_137.webp", alt: "Résidence Allure — chantier" },
  { src: "/Allure/HD_139.webp", alt: "Résidence Allure — structure" },
  { src: TEMOIN_MEDIA.salon1, alt: "Appartement témoin — salon" },
  { src: TEMOIN_MEDIA.typeASalon, alt: "Appartement témoin Type A — séjour" },
  { src: TEMOIN_MEDIA.chambre1, alt: "Appartement témoin — chambre" },
  { src: TEMOIN_MEDIA.typeAChambre, alt: "Appartement témoin Type A — chambre parentale" },
  { src: TEMOIN_MEDIA.sdb1, alt: "Appartement témoin — salle de bain" },
  { src: TEMOIN_MEDIA.axo1, alt: "Appartement témoin — axonométrie" },
  { src: "/media/hero-cinematic/frame_012.webp", alt: "Résidence Allure — volumes" },
  { src: "/media/hero-cinematic/opening.webp", alt: "Résidence Allure — projet achevé" },
] as const;
