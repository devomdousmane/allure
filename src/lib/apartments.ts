import { APARTMENT_DETAILS } from "@/data/apartments";
import { formatSurface } from "@/data/apartments/format";
import type { ApartmentDetail } from "@/data/apartments/types";
import { TEMOIN_MEDIA } from "@/lib/media";

export type Apartment = {
  id: string;
  type: string;
  slug: string;
  desc: string;
  image: string;
  surface: string;
  price: string;
  highlights: string[];
};

/** Accroches courtes pour les cartes home (fiches = description complète). */
const HOME_DESCRIPTIONS: Record<string, string> = {
  studio:
    "Compact et optimisé, idéal premier investissement ou pied-à-terre aux Almadies.",
  "type-a":
    "La plus généreuse typologie : séjour ouvert, suite parentale et double terrasse.",
  "type-b":
    "Espaces généreux et double exposition pour un quotidien confortable.",
  "type-c":
    "Vue dégagée et prestations premium pour un art de vivre exigeant.",
  "type-d":
    "Typologie compacte et fluide, pensée pour un quotidien sans superflu.",
};

/** Visuels home — intérieurs témoins (plus lisibles / moins « dining »). */
const HOME_CARD_IMAGES: Record<string, string> = {
  studio: TEMOIN_MEDIA.salon4,
  "type-a": TEMOIN_MEDIA.typeASalon,
  "type-b": TEMOIN_MEDIA.chambre1,
  "type-c": TEMOIN_MEDIA.salon2,
  "type-d": TEMOIN_MEDIA.salon3,
};

function toApartmentCard(apt: ApartmentDetail): Apartment {
  return {
    id: apt.id,
    type: apt.slug === "studio" ? "Type Studio" : apt.name,
    slug: apt.slug,
    desc: HOME_DESCRIPTIONS[apt.slug] ?? apt.description,
    image: HOME_CARD_IMAGES[apt.slug] ?? apt.heroImage,
    surface: formatSurface(apt.surfaceTotal),
    price: apt.price,
    highlights: apt.highlights
      .filter((h) => !h.toLowerCase().includes("m²"))
      .slice(0, 3),
  };
}

export const APARTMENTS: Apartment[] = APARTMENT_DETAILS.map(toApartmentCard);
