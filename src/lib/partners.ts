export type Partner = {
  id: string;
  name: string;
  role: string;
  logo: string;
};

/** Partenaires technique & conception — logos dans /public/partenaire */
export const PARTNERS: Partner[] = [
  {
    id: "aars",
    name: "AARS",
    role: "Architecture",
    logo: "/partenaire/AARS-Atelier-dArchitecture-Reda-Sleiman-150x150.webp",
  },
  {
    id: "etce",
    name: "ETCE",
    role: "Ingénierie",
    logo: "/partenaire/ETCE-150x150.webp",
  },
  {
    id: "simex",
    name: "Simex Africa",
    role: "Construction",
    logo: "/partenaire/logo-simex-retina-150x150.webp",
  },
  {
    id: "untec",
    name: "UNTEC",
    role: "Économie de la construction",
    logo: "/partenaire/UNTEC-150x150.webp",
  },
  {
    id: "vytimo",
    name: "Vytimo Listing",
    role: "Listing immobilier",
    logo: "/partenaire/vytimo-listing.webp",
  },
];
