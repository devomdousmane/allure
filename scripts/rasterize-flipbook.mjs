/**
 * Rasterize a PDF → WebP pages + TypeScript manifest.
 *
 * Usage:
 *   node scripts/rasterize-flipbook.mjs brochure
 *   node scripts/rasterize-flipbook.mjs journal
 *
 * Ou args manuels :
 *   node scripts/rasterize-flipbook.mjs --pdf=... --outDir=... --publicPrefix=... --manifest=... --constName=JOURNAL --pdfConst=JOURNAL_PDF --coverTitle="..."
 */
import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createCanvas } from "@napi-rs/canvas";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const PRESETS = {
  brochure: {
    pdf: path.join(ROOT, "public/apartments/brochure.pdf"),
    outDir: path.join(ROOT, "public/apartments/brochure/pages"),
    publicPrefix: "/apartments/brochure/pages",
    manifest: path.join(ROOT, "src/data/apartments/brochure-manifest.ts"),
    constName: "BROCHURE",
    pdfConst: "BROCHURE_PDF",
    pdfPublic: "/apartments/brochure.pdf",
    coverTitle: "Résidence Allure",
  },
  journal: {
    pdf: path.join(ROOT, "public/avancement/journal.pdf"),
    outDir: path.join(ROOT, "public/avancement/journal/pages"),
    publicPrefix: "/avancement/journal/pages",
    manifest: path.join(ROOT, "src/data/avancement/journal-manifest.ts"),
    constName: "JOURNAL",
    pdfConst: "JOURNAL_PDF",
    pdfPublic: "/avancement/journal.pdf",
    coverTitle: "Journal du chantier",
  },
  "temoin-a": {
    pdf: path.join(ROOT, "public/media/appartements-temoins/type-a/dossier.pdf"),
    outDir: path.join(ROOT, "public/media/appartements-temoins/type-a/dossier"),
    publicPrefix: "/media/appartements-temoins/type-a/dossier",
    manifest: path.join(ROOT, "src/data/temoins/type-a-dossier-manifest.ts"),
    constName: "TEMOIN_A_DOSSIER",
    pdfConst: "TEMOIN_A_DOSSIER_PDF",
    pdfPublic: "/media/appartements-temoins/type-a/dossier.pdf",
    coverTitle: "Dossier Type A",
  },
};

const MAX_LONG_EDGE = 2200;
const WEBP_QUALITY = 82;

function parseArgs(argv) {
  const positional = argv.find((a) => !a.startsWith("--") && PRESETS[a]);
  if (positional) return { ...PRESETS[positional] };

  /** @type {Record<string, string>} */
  const flags = {};
  for (const arg of argv) {
    if (!arg.startsWith("--")) continue;
    const [k, ...rest] = arg.slice(2).split("=");
    flags[k] = rest.join("=");
  }
  if (!flags.pdf || !flags.outDir || !flags.manifest) {
    console.error(
      "Usage: node scripts/rasterize-flipbook.mjs <brochure|journal|temoin-a>"
    );
    process.exit(1);
  }
  return {
    pdf: path.resolve(ROOT, flags.pdf),
    outDir: path.resolve(ROOT, flags.outDir),
    publicPrefix: flags.publicPrefix ?? "/media/pages",
    manifest: path.resolve(ROOT, flags.manifest),
    constName: flags.constName ?? "BOOK",
    pdfConst: flags.pdfConst ?? "BOOK_PDF",
    pdfPublic: flags.pdfPublic ?? "/book.pdf",
    coverTitle: flags.coverTitle ?? "Allure",
  };
}

/**
 * @param {string} manifestPath
 * @returns {Promise<Map<string, string>>}
 */
async function loadExtraLayersBlocks(manifestPath) {
  /** @type {Map<string, string>} */
  const map = new Map();
  try {
    const prev = await readFile(manifestPath, "utf8");
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
  const cfg = parseArgs(process.argv.slice(2));
  console.log("Reading PDF…", cfg.pdf);
  const data = new Uint8Array(await readFile(cfg.pdf));

  const extras = await loadExtraLayersBlocks(cfg.manifest);
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

  await mkdir(cfg.outDir, { recursive: true });
  await mkdir(path.dirname(cfg.manifest), { recursive: true });

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
    const outPath = path.join(cfg.outDir, fileName);

    const webp = await sharp(png)
      .webp({ quality: WEBP_QUALITY, effort: 4 })
      .toBuffer({ resolveWithObject: true });

    await writeFile(outPath, webp.data);

    const meta = await sharp(webp.data).metadata();
    const width = meta.width ?? Math.ceil(viewport.width);
    const height = meta.height ?? Math.ceil(viewport.height);

    pages.push({
      id,
      src: `${cfg.publicPrefix}/${fileName}`,
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
      height: ${p.height},${idx === 0 ? `\n      title: ${JSON.stringify(cfg.coverTitle)},` : ""}
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

export const ${cfg.pdfConst} = ${JSON.stringify(cfg.pdfPublic)} as const;

export const ${cfg.constName} = {
  pageWidth: ${pageW},
  pageHeight: ${pageH},
  pages: [
${pagesTs}
  ] satisfies FlipBookPage[],
} as const satisfies FlipBookData;
`;

  await writeFile(cfg.manifest, manifest, "utf8");
  console.log(`Manifest → ${cfg.manifest}`);
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
