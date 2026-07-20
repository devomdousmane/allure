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

export const APARTMENTS: Apartment[] = [
  {
    id: "studio",
    type: "Type Studio",
    slug: "studio",
    desc: "Compact et optimisé, idéal premier investissement ou pied-à-terre aux Almadies.",
    image: "/hero-sequence/frame_008.webp",
    surface: "Sur demande",
    price: "Sur demande",
    highlights: ["Agencement optimisé", "Idéal investissement", "Lumineux"],
  },
  {
    id: "type-a",
    type: "Appartement Type A",
    slug: "type-a",
    desc: "Séjour lumineux, agencement fluide — l’entrée de gamme élégante d’Allure.",
    image: "/hero-sequence/frame_012.webp",
    surface: "Sur demande",
    price: "Sur demande",
    highlights: ["Séjour ouvert", "Exposition soignée", "Finitions premium"],
  },
  {
    id: "type-b",
    type: "Appartement Type B",
    slug: "type-b",
    desc: "Espaces généreux et double exposition pour un quotidien confortable.",
    image: "/hero-sequence/frame_016.webp",
    surface: "Sur demande",
    price: "Sur demande",
    highlights: ["Double exposition", "Espaces généreux", "Rangements"],
  },
  {
    id: "type-c",
    type: "Appartement Type C",
    slug: "type-c",
    desc: "Vue dégagée et prestations premium pour un art de vivre exigeant.",
    image: "/hero-sequence/frame_020.webp",
    surface: "Sur demande",
    price: "Sur demande",
    highlights: ["Vue dégagée", "Prestations premium", "Confort climatique"],
  },
  {
    id: "type-d",
    type: "Appartement Type D",
    slug: "type-d",
    desc: "La plus grande typologie, conçue pour les familles et les grands espaces.",
    image: "/hero-sequence/frame_024.webp",
    surface: "Sur demande",
    price: "Sur demande",
    highlights: ["Grande typologie", "Vie familiale", "Espaces de réception"],
  },
];
