/** Types partagés pour les livres feuilletables (brochure, journal…). */

export type FlipBookBlendMode =
  | "normal"
  | "multiply"
  | "screen"
  | "overlay"
  | "soft-light";

export type FlipBookLayer = {
  id: string;
  src: string;
  /** Décalage parallaxe GSAP (0 = fixe, 1 = max) */
  parallax?: number;
  blend?: FlipBookBlendMode;
  opacity?: number;
};

export type FlipBookPage = {
  id: string;
  width: number;
  height: number;
  /** Titre overlay optionnel (reveal GSAP) */
  title?: string;
  layers: FlipBookLayer[];
};

export type FlipBookData = {
  pageWidth: number;
  pageHeight: number;
  pages: readonly FlipBookPage[];
};
