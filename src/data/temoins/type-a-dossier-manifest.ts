/**
 * Auto-généré par scripts/rasterize-flipbook.mjs — ne pas éditer à la main
 * sauf pour ajouter des calques V2 (layers supplémentaires).
 */

export type FlipBookBlendMode =
  | "normal"
  | "multiply"
  | "screen"
  | "overlay"
  | "soft-light";

export type FlipBookLayer = {
  id: string;
  src: string;
  parallax?: number;
  blend?: FlipBookBlendMode;
  opacity?: number;
};

export type FlipBookPage = {
  id: string;
  width: number;
  height: number;
  title?: string;
  layers: FlipBookLayer[];
};

export type FlipBookData = {
  pageWidth: number;
  pageHeight: number;
  pages: readonly FlipBookPage[];
};

export const TEMOIN_A_DOSSIER_PDF = "/media/appartements-temoins/type-a/dossier.pdf" as const;

export const TEMOIN_A_DOSSIER = {
  pageWidth: 1980,
  pageHeight: 1530,
  pages: [
    {
      id: "page-01",
      width: 1980,
      height: 1530,
      title: "Dossier Type A",
      layers: [
        {
          id: "base",
          src: "/media/appartements-temoins/type-a/dossier/page-01.webp",
          parallax: 0,
          blend: "normal",
        }
      ],
    },
    {
      id: "page-02",
      width: 1980,
      height: 1530,
      layers: [
        {
          id: "base",
          src: "/media/appartements-temoins/type-a/dossier/page-02.webp",
          parallax: 0,
          blend: "normal",
        }
      ],
    },
    {
      id: "page-03",
      width: 1980,
      height: 1530,
      layers: [
        {
          id: "base",
          src: "/media/appartements-temoins/type-a/dossier/page-03.webp",
          parallax: 0,
          blend: "normal",
        }
      ],
    },
    {
      id: "page-04",
      width: 1980,
      height: 1530,
      layers: [
        {
          id: "base",
          src: "/media/appartements-temoins/type-a/dossier/page-04.webp",
          parallax: 0,
          blend: "normal",
        }
      ],
    },
    {
      id: "page-05",
      width: 1980,
      height: 1530,
      layers: [
        {
          id: "base",
          src: "/media/appartements-temoins/type-a/dossier/page-05.webp",
          parallax: 0,
          blend: "normal",
        }
      ],
    }
  ] satisfies FlipBookPage[],
} as const satisfies FlipBookData;
