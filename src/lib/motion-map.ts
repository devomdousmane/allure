/**
 * Carte motion Allure — source de vérité pour adapter le type d’animation
 * à chaque page. Complète `.cursor/rules/allure-motion.mdc`.
 *
 * Libs : GSAP + ScrollTrigger + Lenis + motion/react + SplitText.
 */

export type MotionKind =
  | "cinematic-scrub"
  | "scroll-telling"
  | "parallax"
  | "pin-expand"
  | "zoom-parallax"
  | "reveal"
  | "split-type"
  | "tilt-3d"
  | "presence"
  | "horizontal-journey"
  | "micro";

export type PageMotionProfile = {
  path: string;
  intent: string;
  primary: MotionKind[];
  secondary: MotionKind[];
  /** Intensité relative 1–5 (5 = le plus immersif) */
  intensity: 1 | 2 | 3 | 4 | 5;
  mobileSimplify: boolean;
  notes: string;
};

export const PAGE_MOTION_MAP: PageMotionProfile[] = [
  {
    path: "/",
    intent: "Immersion cinematic — construction → résidence",
    primary: ["cinematic-scrub", "pin-expand", "reveal", "split-type"],
    secondary: ["parallax", "horizontal-journey", "presence"],
    intensity: 5,
    mobileSimplify: true,
    notes: "HomeScrollShell + CinematicHero ; annexes armables via home-motion-debug.",
  },
  {
    path: "/residence",
    intent: "Visite immersive pièce à pièce",
    primary: ["tilt-3d", "parallax", "reveal", "presence"],
    secondary: ["split-type", "micro"],
    intensity: 4,
    mobileSimplify: true,
    notes: "ResidenceFolderGuide = cœur interactif ; vidéos lifestyle en fond/bande.",
  },
  {
    path: "/avancement",
    intent: "Scroll-telling chantier chronologique",
    primary: ["pin-expand", "zoom-parallax", "scroll-telling"],
    secondary: ["reveal", "parallax"],
    intensity: 5,
    mobileSimplify: true,
    notes: "ScrollExpandMedia + ZoomParallax + PhaseTimeline ; vidéo construction.",
  },
  {
    path: "/a-propos",
    intent: "Récit éditorial chapitré",
    primary: ["scroll-telling", "split-type", "reveal"],
    secondary: ["parallax", "micro"],
    intensity: 3,
    mobileSimplify: true,
    notes: "AboutStory + AboutChapterNav sync Lenis.",
  },
  {
    path: "/les-appartements",
    intent: "Catalogue lisible, motion sobre",
    primary: ["reveal", "micro"],
    secondary: ["presence"],
    intensity: 2,
    mobileSimplify: false,
    notes: "Éviter pin ; focus clarté typologies.",
  },
  {
    path: "/les-appartements/[slug]",
    intent: "Fiche immersive légère",
    primary: ["reveal", "micro", "presence"],
    secondary: ["parallax"],
    intensity: 3,
    mobileSimplify: true,
    notes: "Hero + plan sync ; galerie lightbox.",
  },
  {
    path: "/contact",
    intent: "Conversion — friction minimale",
    primary: ["reveal", "micro"],
    secondary: [],
    intensity: 1,
    mobileSimplify: false,
    notes: "Pas d’immersion lourde ni pin.",
  },
  {
    path: "/rendez-vous",
    intent: "Conversion rendez-vous — formulaire créneau",
    primary: ["reveal", "micro"],
    secondary: [],
    intensity: 1,
    mobileSimplify: false,
    notes: "Même sobriété que /contact ; préremplissage via ?type=&interest=.",
  },
  {
    path: "/appartements-temoins",
    intent: "Hub show flats — conversion visite",
    primary: ["reveal", "micro"],
    secondary: ["presence"],
    intensity: 2,
    mobileSimplify: false,
    notes: "Cartes témoins ; pas de pin.",
  },
  {
    path: "/appartements-temoins/[slug]",
    intent: "Fiche témoin — galerie + vidéo lazy",
    primary: ["reveal", "micro"],
    secondary: ["presence"],
    intensity: 2,
    mobileSimplify: true,
    notes: "Vidéo 3D au clic ; preload none.",
  },
] as const;

export function getPageMotion(path: string): PageMotionProfile | undefined {
  if (path.startsWith("/les-appartements/") && path !== "/les-appartements") {
    return PAGE_MOTION_MAP.find((p) => p.path === "/les-appartements/[slug]");
  }
  if (
    path.startsWith("/appartements-temoins/") &&
    path !== "/appartements-temoins"
  ) {
    return PAGE_MOTION_MAP.find((p) => p.path === "/appartements-temoins/[slug]");
  }
  return PAGE_MOTION_MAP.find((p) => p.path === path);
}
