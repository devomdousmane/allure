/**
 * Rasterize public/apartments/brochure.pdf → WebP pages + TypeScript manifest.
 *
 * Usage: npm run brochure:rasterize
 *
 * Si le manifest existant contient des calques V2 (id ≠ "base"), ils sont
 * préservés et réinjectés après régénération des pages base.
 */
import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createCanvas } from "@napi-rs/canvas";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PDF_PATH = path.join(ROOT, "public/apartments/brochure.pdf");
const OUT_DIR = path.join(ROOT, "public/apartments/brochure/pages");
const MANIFEST_PATH = path.join(
  ROOT,
  "src/data/apartments/brochure-manifest.ts"
);

/** Max long-edge for web flipbook (perf). */
const MAX_LONG_EDGE = 2200;
const WEBP_QUALITY = 82;

/**
 * Extrait les calques non-base du manifest actuel (V2), indexés par page id.
 * @returns {Promise<Map<string, string>>}
 */
async function loadExtraLayersBlocks() {
  /** @type {Map<string, string>} */
  const map = new Map();
  try {
    const prev = await readFile(MANIFEST_PATH, "utf8");
    const pageBlocks = prev.matchAll(
      /\{\s*id:\s*"(page-\d+)"[\s\S]*?layers:\s*\[([\s\S]*?)\]\s*,?\s*\}/g
    );
    for (const m of pageBlocks) {
      const pageId = m[1];
      const layersBody = m[2];
      const layerObjs = [
        ...layersBody.matchAll(/\{[^{}]*id:\s*"(?!base")[^"]+"[^{}]*\}/g),
      ].map((x) => x[0]);
      if (layerObjs.length) {
        map.set(pageId, layerObjs.map((s) => `        ${s.trim()}`).join(",\n"));
      }
    }
  } catch {
    /* premier run */
  }
  return map;
}

async function main() {
  console.log("Reading PDF…", PDF_PATH);
  const data = new Uint8Array(await readFile(PDF_PATH));

  const extras = await loadExtraLayersBlocks();
  if (extras.size) {
    console.log(`Preserving V2 layers on ${extras.size} page(s)`);
  }

  const loadingTask = getDocument({
    data,
    disableFontFace: true,
    useSystemFonts: true,
  });
  const pdf = await loadingTask.promise;
  const pageCount = pdf.numPages;
  console.log(`Pages: ${pageCount}`);

  await mkdir(OUT_DIR, { recursive: true });

  /** @type {Array<{ id: string; src: string; width: number; height: number }>} */
  const pages = [];

  for (let i = 1; i <= pageCount; i++) {
    const page = await pdf.getPage(i);
    const base = page.getViewport({ scale: 1 });
    const longEdge = Math.max(base.width, base.height);
    const scale = Math.min(MAX_LONG_EDGE / longEdge, 2.5);
    const viewport = page.getViewport({ scale });

    const canvas = createCanvas(
      Math.ceil(viewport.width),
      Math.ceil(viewport.height)
    );
    const context = canvas.getContext("2d");

    await page.render({
      canvasContext: context,
      viewport,
      canvas,
    }).promise;

    const png = canvas.toBuffer("image/png");
    const id = `page-${String(i).padStart(2, "0")}`;
    const fileName = `${id}.webp`;
    const outPath = path.join(OUT_DIR, fileName);

    const webp = await sharp(png)
      .webp({ quality: WEBP_QUALITY, effort: 4 })
      .toBuffer({ resolveWithObject: true });

    await writeFile(outPath, webp.data);

    const meta = await sharp(webp.data).metadata();
    const width = meta.width ?? Math.ceil(viewport.width);
    const height = meta.height ?? Math.ceil(viewport.height);

    pages.push({
      id,
      src: `/apartments/brochure/pages/${fileName}`,
      width,
      height,
    });

    console.log(
      `  ${id} → ${fileName} (${width}×${height}, ${(webp.data.length / 1024).toFixed(0)} KB)`
    );

    page.cleanup();
  }

  const pageW = pages[0]?.width ?? 1200;
  const pageH = pages[0]?.height ?? 1600;

  const pagesTs = pages
    .map((p, idx) => {
      const extra = extras.get(p.id);
      const extraBlock = extra ? `,\n${extra}` : "";
      return `    {
      id: "${p.id}",
      width: ${p.width},
      height: ${p.height},${idx === 0 ? '\n      title: "Résidence Allure",' : ""}
      layers: [
        {
          id: "base",
          src: "${p.src}",
          parallax: 0,
          blend: "normal",
        }${extraBlock}
      ],
    }`;
    })
    .join(",\n");

  const manifest = `/**
 * Auto-généré par scripts/rasterize-brochure.mjs — ne pas éditer à la main
 * sauf pour ajouter des calques V2 (layers supplémentaires).
 * Relancer le script régénère les pages base et préserve les layers id ≠ "base".
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
  pageWidth: ${pageW},
  pageHeight: ${pageH},
  pages: [
${pagesTs}
  ] satisfies BrochurePage[],
} as const;

export type BrochureManifest = typeof BROCHURE;
`;

  await writeFile(MANIFEST_PATH, manifest, "utf8");
  console.log(`Manifest → ${MANIFEST_PATH}`);
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
