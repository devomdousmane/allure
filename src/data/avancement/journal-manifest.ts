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

export const JOURNAL_PDF = "/avancement/journal.pdf" as const;

export const JOURNAL = {
  pageWidth: 2200,
  pageHeight: 1238,
  pages: [
    {
      id: "page-01",
      width: 2200,
      height: 1238,
      title: "Journal du chantier",
      layers: [
        {
          id: "base",
          src: "/avancement/journal/pages/page-01.webp",
          parallax: 0,
          blend: "normal",
        }
      ],
    },
    {
      id: "page-02",
      width: 2200,
      height: 1238,
      layers: [
        {
          id: "base",
          src: "/avancement/journal/pages/page-02.webp",
          parallax: 0,
          blend: "normal",
        }
      ],
    },
    {
      id: "page-03",
      width: 2200,
      height: 1238,
      layers: [
        {
          id: "base",
          src: "/avancement/journal/pages/page-03.webp",
          parallax: 0,
          blend: "normal",
        }
      ],
    },
    {
      id: "page-04",
      width: 2200,
      height: 1238,
      layers: [
        {
          id: "base",
          src: "/avancement/journal/pages/page-04.webp",
          parallax: 0,
          blend: "normal",
        }
      ],
    },
    {
      id: "page-05",
      width: 2200,
      height: 1238,
      layers: [
        {
          id: "base",
          src: "/avancement/journal/pages/page-05.webp",
          parallax: 0,
          blend: "normal",
        }
      ],
    },
    {
      id: "page-06",
      width: 2200,
      height: 1238,
      layers: [
        {
          id: "base",
          src: "/avancement/journal/pages/page-06.webp",
          parallax: 0,
          blend: "normal",
        }
      ],
    },
    {
      id: "page-07",
      width: 2200,
      height: 1238,
      layers: [
        {
          id: "base",
          src: "/avancement/journal/pages/page-07.webp",
          parallax: 0,
          blend: "normal",
        }
      ],
    },
    {
      id: "page-08",
      width: 2200,
      height: 1238,
      layers: [
        {
          id: "base",
          src: "/avancement/journal/pages/page-08.webp",
          parallax: 0,
          blend: "normal",
        }
      ],
    },
    {
      id: "page-09",
      width: 2200,
      height: 1238,
      layers: [
        {
          id: "base",
          src: "/avancement/journal/pages/page-09.webp",
          parallax: 0,
          blend: "normal",
        }
      ],
    },
    {
      id: "page-10",
      width: 2200,
      height: 1238,
      layers: [
        {
          id: "base",
          src: "/avancement/journal/pages/page-10.webp",
          parallax: 0,
          blend: "normal",
        }
      ],
    },
    {
      id: "page-11",
      width: 2200,
      height: 1238,
      layers: [
        {
          id: "base",
          src: "/avancement/journal/pages/page-11.webp",
          parallax: 0,
          blend: "normal",
        }
      ],
    },
    {
      id: "page-12",
      width: 2200,
      height: 1238,
      layers: [
        {
          id: "base",
          src: "/avancement/journal/pages/page-12.webp",
          parallax: 0,
          blend: "normal",
        }
      ],
    },
    {
      id: "page-13",
      width: 2200,
      height: 1238,
      layers: [
        {
          id: "base",
          src: "/avancement/journal/pages/page-13.webp",
          parallax: 0,
          blend: "normal",
        }
      ],
    },
    {
      id: "page-14",
      width: 2200,
      height: 1238,
      layers: [
        {
          id: "base",
          src: "/avancement/journal/pages/page-14.webp",
          parallax: 0,
          blend: "normal",
        }
      ],
    },
    {
      id: "page-15",
      width: 2200,
      height: 1238,
      layers: [
        {
          id: "base",
          src: "/avancement/journal/pages/page-15.webp",
          parallax: 0,
          blend: "normal",
        }
      ],
    },
    {
      id: "page-16",
      width: 2200,
      height: 1238,
      layers: [
        {
          id: "base",
          src: "/avancement/journal/pages/page-16.webp",
          parallax: 0,
          blend: "normal",
        }
      ],
    },
    {
      id: "page-17",
      width: 2200,
      height: 1238,
      layers: [
        {
          id: "base",
          src: "/avancement/journal/pages/page-17.webp",
          parallax: 0,
          blend: "normal",
        }
      ],
    },
    {
      id: "page-18",
      width: 2200,
      height: 1238,
      layers: [
        {
          id: "base",
          src: "/avancement/journal/pages/page-18.webp",
          parallax: 0,
          blend: "normal",
        }
      ],
    },
    {
      id: "page-19",
      width: 2200,
      height: 1238,
      layers: [
        {
          id: "base",
          src: "/avancement/journal/pages/page-19.webp",
          parallax: 0,
          blend: "normal",
        }
      ],
    },
    {
      id: "page-20",
      width: 2200,
      height: 1238,
      layers: [
        {
          id: "base",
          src: "/avancement/journal/pages/page-20.webp",
          parallax: 0,
          blend: "normal",
        }
      ],
    },
    {
      id: "page-21",
      width: 2200,
      height: 1238,
      layers: [
        {
          id: "base",
          src: "/avancement/journal/pages/page-21.webp",
          parallax: 0,
          blend: "normal",
        }
      ],
    },
    {
      id: "page-22",
      width: 2200,
      height: 1240,
      layers: [
        {
          id: "base",
          src: "/avancement/journal/pages/page-22.webp",
          parallax: 0,
          blend: "normal",
        }
      ],
    },
    {
      id: "page-23",
      width: 2200,
      height: 1240,
      layers: [
        {
          id: "base",
          src: "/avancement/journal/pages/page-23.webp",
          parallax: 0,
          blend: "normal",
        }
      ],
    }
  ] satisfies FlipBookPage[],
} as const satisfies FlipBookData;
