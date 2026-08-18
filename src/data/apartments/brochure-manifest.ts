/**
 * Auto-généré par scripts/rasterize-brochure.mjs — ne pas éditer à la main
 * sauf pour ajouter des calques V2 (layers supplémentaires).
 * Relancer le script écrase les pages / dimensions ; préserver les layers custom.
 */

export type BrochureBlendMode =
  | "normal"
  | "multiply"
  | "screen"
  | "overlay"
  | "soft-light";

export type BrochureLayer = {
  id: string;
  src: string;
  /** Décalage parallaxe GSAP (0 = fixe, 1 = max) */
  parallax?: number;
  blend?: BrochureBlendMode;
  opacity?: number;
};

export type BrochurePage = {
  id: string;
  width: number;
  height: number;
  /** Titre overlay optionnel (reveal GSAP) */
  title?: string;
  layers: BrochureLayer[];
};

export const BROCHURE_PDF = "/apartments/brochure.pdf" as const;

export const BROCHURE = {
  pageWidth: 2200,
  pageHeight: 1588,
  pages: [
    {
      id: "page-01",
      width: 2200,
      height: 1588,
      title: "Résidence Allure",
      layers: [
        {
          id: "base",
          src: "/apartments/brochure/pages/page-01.webp",
          parallax: 0,
          blend: "normal",
        },
      ],
    },
    {
      id: "page-02",
      width: 2200,
      height: 1588,
      layers: [
        {
          id: "base",
          src: "/apartments/brochure/pages/page-02.webp",
          parallax: 0,
          blend: "normal",
        },
      ],
    },
    {
      id: "page-03",
      width: 2200,
      height: 1588,
      layers: [
        {
          id: "base",
          src: "/apartments/brochure/pages/page-03.webp",
          parallax: 0,
          blend: "normal",
        },
      ],
    },
    {
      id: "page-04",
      width: 2200,
      height: 1588,
      layers: [
        {
          id: "base",
          src: "/apartments/brochure/pages/page-04.webp",
          parallax: 0,
          blend: "normal",
        },
      ],
    },
    {
      id: "page-05",
      width: 2200,
      height: 1588,
      layers: [
        {
          id: "base",
          src: "/apartments/brochure/pages/page-05.webp",
          parallax: 0,
          blend: "normal",
        },
      ],
    },
    {
      id: "page-06",
      width: 2200,
      height: 1588,
      layers: [
        {
          id: "base",
          src: "/apartments/brochure/pages/page-06.webp",
          parallax: 0,
          blend: "normal",
        },
      ],
    },
    {
      id: "page-07",
      width: 2200,
      height: 1588,
      layers: [
        {
          id: "base",
          src: "/apartments/brochure/pages/page-07.webp",
          parallax: 0,
          blend: "normal",
        },
      ],
    },
    {
      id: "page-08",
      width: 2200,
      height: 1588,
      layers: [
        {
          id: "base",
          src: "/apartments/brochure/pages/page-08.webp",
          parallax: 0,
          blend: "normal",
        },
      ],
    },
    {
      id: "page-09",
      width: 2200,
      height: 1588,
      layers: [
        {
          id: "base",
          src: "/apartments/brochure/pages/page-09.webp",
          parallax: 0,
          blend: "normal",
        },
      ],
    },
    {
      id: "page-10",
      width: 2200,
      height: 1588,
      layers: [
        {
          id: "base",
          src: "/apartments/brochure/pages/page-10.webp",
          parallax: 0,
          blend: "normal",
        },
      ],
    },
    {
      id: "page-11",
      width: 2200,
      height: 1588,
      layers: [
        {
          id: "base",
          src: "/apartments/brochure/pages/page-11.webp",
          parallax: 0,
          blend: "normal",
        },
      ],
    },
    {
      id: "page-12",
      width: 2200,
      height: 1588,
      layers: [
        {
          id: "base",
          src: "/apartments/brochure/pages/page-12.webp",
          parallax: 0,
          blend: "normal",
        },
      ],
    },
    {
      id: "page-13",
      width: 2200,
      height: 1588,
      layers: [
        {
          id: "base",
          src: "/apartments/brochure/pages/page-13.webp",
          parallax: 0,
          blend: "normal",
        },
      ],
    },
    {
      id: "page-14",
      width: 2200,
      height: 1588,
      layers: [
        {
          id: "base",
          src: "/apartments/brochure/pages/page-14.webp",
          parallax: 0,
          blend: "normal",
        },
      ],
    },
    {
      id: "page-15",
      width: 2200,
      height: 1588,
      layers: [
        {
          id: "base",
          src: "/apartments/brochure/pages/page-15.webp",
          parallax: 0,
          blend: "normal",
        },
      ],
    },
    {
      id: "page-16",
      width: 2200,
      height: 1588,
      layers: [
        {
          id: "base",
          src: "/apartments/brochure/pages/page-16.webp",
          parallax: 0,
          blend: "normal",
        },
      ],
    },
    {
      id: "page-17",
      width: 2200,
      height: 1588,
      layers: [
        {
          id: "base",
          src: "/apartments/brochure/pages/page-17.webp",
          parallax: 0,
          blend: "normal",
        },
      ],
    }
  ] satisfies BrochurePage[],
} as const;

export type BrochureManifest = typeof BROCHURE;
