export type NavChild = {
  href: string;
  label: string;
  meta: string;
};

export const RESIDENCE_NAV = [
  {
    href: "/residence",
    label: "Découvrir",
    meta: "Visite",
  },
  {
    href: "/brochure",
    label: "Brochure",
    meta: "Livre",
  },
] as const satisfies readonly NavChild[];

/** Sous-liens typologies — labels courts pour le menu. */
export const APARTMENT_NAV = [
  {
    href: "/appartements-temoins",
    label: "Témoins",
    meta: "Visite 3D",
  },
  {
    href: "/brochure",
    label: "Brochure",
    meta: "Livre",
  },
  {
    href: "/les-appartements/studio",
    label: "Studio",
    meta: "81 m²",
  },
  {
    href: "/les-appartements/type-a",
    label: "Type A",
    meta: "247 m²",
  },
  {
    href: "/les-appartements/type-b",
    label: "Type B",
    meta: "203 m²",
  },
  {
    href: "/les-appartements/type-c",
    label: "Type C",
    meta: "212 m²",
  },
  {
    href: "/les-appartements/type-d",
    label: "Type D",
    meta: "164 m²",
  },
] as const satisfies readonly NavChild[];

export const CHANTIER_NAV = [
  {
    href: "/avancement",
    label: "Avancement",
    meta: "Timeline",
  },
  {
    href: "/avancement/journal",
    label: "Journal",
    meta: "Livre",
  },
] as const satisfies readonly NavChild[];

export const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/a-propos", label: "À propos" },
  {
    href: "/residence",
    label: "La Résidence",
    hasChildren: true,
    children: RESIDENCE_NAV,
    overviewLabel: "Voir la résidence",
    menuAriaLabel: "La Résidence",
  },
  {
    href: "/les-appartements",
    label: "Appartements",
    hasChildren: true,
    children: APARTMENT_NAV,
    overviewLabel: "Voir tous",
    menuAriaLabel: "Types d’appartements",
  },
  {
    href: "/avancement",
    label: "Chantier",
    hasChildren: true,
    children: CHANTIER_NAV,
    overviewLabel: "Voir le suivi",
    menuAriaLabel: "Chantier Allure",
  },
  { href: "/contact", label: "Contact" },
] as const;

export const HOME_ANCHORS = [
  { href: "/#accueil", label: "Introduction" },
  { href: "/#qui-sommes-nous", label: "Présence" },
  { href: "/#a-propos", label: "Vision" },
  { href: "/#orbite", label: "Le geste" },
  { href: "/#accompagnement", label: "Offre" },
  { href: "/#chantier", label: "Chantier" },
  { href: "/#residence", label: "Prestations" },
  { href: "/#categories", label: "Cadre de vie" },
  { href: "/#appartements-temoins-home", label: "Témoins" },
  { href: "/#appartements", label: "Typologies" },
  { href: "/#quartier", label: "Les Almadies" },
  { href: "/#contact", label: "Contact" },
  { href: "/#faq", label: "FAQ" },
] as const;

/** Livres interactifs — CTA / footer. */
export const BOOK_LINKS = [
  { href: "/brochure", label: "Brochure" },
  { href: "/avancement/journal", label: "Journal chantier" },
] as const;

export function isNavActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Actif si la route ou un enfant du sous-menu correspond. */
export function isNavBranchActive(
  pathname: string,
  href: string,
  children?: readonly NavChild[]
) {
  if (isNavActive(pathname, href)) return true;
  return Boolean(children?.some((child) => isNavActive(pathname, child.href)));
}
