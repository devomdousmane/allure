export type JourneyPanelId = "chantier" | "facade" | "livraison";

/** Couleur de jointure claire / sombre (inline style ≠ `dark:`) */
export type ThemeJoin = {
  light: string;
  dark: string;
};

/**
 * primary — anneau principal (label d’étape)
 * echo — contrepoint près d’un bloc UI (sens inversé)
 * ghost — satellite discret (progress décalé)
 */
export type OrbitVariant = "primary" | "echo" | "ghost";

export type JourneyOrbitPlacement = {
  label?: string;
  position: string;
  size: string;
  variant: OrbitVariant;
};

export type JourneyPanelConfig = {
  id: JourneyPanelId;
  phase: string;
  headline: string;
  sub: string;
  bg: ThemeJoin;
  image: string;
  imageAlt: string;
  objectPosition: string;
  joinLeft: ThemeJoin;
  joinRight: ThemeJoin;
  orbits: readonly JourneyOrbitPlacement[];
};

/**
 * Fonds et jointures suivent le thème (sable / blanc en clair).
 * Le wash photo reste plus dense en sombre.
 */
export const JOURNEY_COLORS = {
  start: {
    light: "var(--allure-sand)",
    dark: "var(--allure-petrol-deep)",
  },
  ab: {
    light: "#ffffff",
    dark: "var(--allure-petrol-deep)",
  },
  bc: {
    light: "var(--allure-sand)",
    dark: "var(--allure-petrol)",
  },
  end: {
    light: "#ffffff",
    dark: "var(--allure-petrol)",
  },
  entry: {
    light: "var(--allure-sand)",
    dark: "var(--allure-petrol-deep)",
  },
  seamAB: {
    light: "#ffffff",
    dark: "var(--allure-petrol-deep)",
  },
  seamBC: {
    light: "var(--allure-sand)",
    dark: "var(--allure-petrol)",
  },
  exit: {
    light: "#ffffff",
    dark: "var(--allure-petrol)",
  },
  wash: {
    light: "var(--allure-sand)",
    dark: "var(--allure-petrol-deep)",
    opacityLight: 0.42,
    opacityDark: 0.36,
  },
} as const;

export const JOURNEY: readonly JourneyPanelConfig[] = [
  {
    id: "chantier",
    phase: "Chantier",
    headline: "Le gros œuvre",
    sub: "Structure béton, les fondations d’Allure",
    bg: JOURNEY_COLORS.start,
    image: "/frame/frame1.webp",
    imageAlt: "Chantier de la Résidence Allure — gros œuvre au crépuscule",
    objectPosition: "50% 45%",
    joinLeft: JOURNEY_COLORS.entry,
    joinRight: JOURNEY_COLORS.seamAB,
    orbits: [
      {
        label: "01",
        variant: "primary",
        position: "top-[10%] left-[6%] lg:left-[10%]",
        size: "h-[min(52vw,20rem)] w-[min(52vw,20rem)]",
      },
      {
        variant: "echo",
        position: "bottom-[18%] right-[6%] lg:right-[10%]",
        size: "h-[min(34vw,13rem)] w-[min(34vw,13rem)]",
      },
      {
        variant: "ghost",
        position: "top-[52%] left-[4%] lg:left-[8%]",
        size: "h-[min(26vw,9.5rem)] w-[min(26vw,9.5rem)]",
      },
    ],
  },
  {
    id: "facade",
    phase: "Façade",
    headline: "L’habillage prend forme",
    sub: "Verre et pétrole, l’identité d’Allure se dessine",
    bg: JOURNEY_COLORS.ab,
    image: "/frame/frame2.webp",
    imageAlt: "Façade illuminée de la Résidence Allure au crépuscule",
    objectPosition: "42% 50%",
    joinLeft: JOURNEY_COLORS.seamAB,
    joinRight: JOURNEY_COLORS.seamBC,
    orbits: [
      {
        label: "02",
        variant: "primary",
        position: "top-[16%] right-[6%] lg:right-[10%]",
        size: "h-[min(48vw,18rem)] w-[min(48vw,18rem)]",
      },
      {
        variant: "echo",
        position: "bottom-[16%] left-[6%] lg:left-[10%]",
        size: "h-[min(32vw,12rem)] w-[min(32vw,12rem)]",
      },
      {
        variant: "ghost",
        position: "top-[46%] left-[10%] lg:left-[14%]",
        size: "h-[min(24vw,9rem)] w-[min(24vw,9rem)]",
      },
    ],
  },
  {
    id: "livraison",
    phase: "Livraison",
    headline: "Résidence Allure",
    sub: "Almadies, Dakar — livraison 2026",
    bg: JOURNEY_COLORS.bc,
    image: "/frame/frame3.webp",
    imageAlt: "Remise des clés — livraison de la Résidence Allure",
    objectPosition: "50% 50%",
    joinLeft: JOURNEY_COLORS.seamBC,
    joinRight: JOURNEY_COLORS.end,
    orbits: [
      {
        label: "03",
        variant: "primary",
        position: "bottom-[28%] left-1/2 -translate-x-1/2 sm:bottom-[30%]",
        size: "h-[min(58vw,22rem)] w-[min(58vw,22rem)]",
      },
      {
        variant: "echo",
        position: "top-[12%] left-[6%] lg:left-[10%]",
        size: "h-[min(30vw,11rem)] w-[min(30vw,11rem)]",
      },
      {
        variant: "ghost",
        position: "top-[14%] right-[6%] lg:right-[10%]",
        size: "h-[min(28vw,10rem)] w-[min(28vw,10rem)]",
      },
    ],
  },
] as const;
