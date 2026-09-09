/**
 * Optimise public/apps-temoins-almadies → public/media/apps-temoins-almadies (WebP)
 * + rend le plan PDF en image(s) WebP.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import sharp from "sharp";

const require = createRequire(import.meta.url);
const root = process.cwd();
const srcDir = path.join(root, "public", "apps-temoins-almadies");
const outDir = path.join(root, "public", "media", "apps-temoins-almadies");

function slugify(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/^Route-de-la-Corniche-Almadies-Dakar-?/i, "")
    .replace(/^Route de la Corniche Almadies Dakar -?/i, "")
    .replace(/\.(jpe?g|png|pdf)$/i, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase() || "asset";
}

async function optimizeImages() {
  await fs.mkdir(outDir, { recursive: true });
  const entries = await fs.readdir(srcDir);
  const images = entries.filter((f) => /\.(jpe?g|png)$/i.test(f));
  const manifest = [];

  for (const file of images) {
    const src = path.join(srcDir, file);
    const id = slugify(file);
    const out = path.join(outDir, `${id}.webp`);
    const meta = await sharp(src).metadata();
    const maxW = meta.width && meta.width > 1920 ? 1920 : meta.width || 1920;
    await sharp(src)
      .rotate()
      .resize({ width: maxW, withoutEnlargement: true })
      .webp({ quality: 78, effort: 5 })
      .toFile(out);
    const st = await fs.stat(out);
    manifest.push({
      id,
      src: `/media/apps-temoins-almadies/${id}.webp`,
      bytes: st.size,
      from: file,
    });
    console.log(
      `ok ${id}.webp (${Math.round(st.size / 1024)} KB) ← ${file}`
    );
  }
  return manifest;
}

async function optimizePdf() {
  const pdfName =
    entriesFindPdf(await fs.readdir(srcDir)) ||
    "Route de la Corniche Almadies Dakar - Floor 1.pdf";
  const pdfSrc = path.join(srcDir, pdfName);
  const pdfOutDir = path.join(outDir, "plan");
  await fs.mkdir(pdfOutDir, { recursive: true });

  // Copie PDF allégée (déjà petit) vers media
  const pdfDest = path.join(pdfOutDir, "floor-1.pdf");
  await fs.copyFile(pdfSrc, pdfDest);

  // Rendu PDF → WebP via pdf-to-img si dispo, sinon sharp ne lit pas PDF.
  let planImage = null;
  try {
    const { pdf } = await import("pdf-to-img");
    const doc = await pdf(pdfSrc, { scale: 2 });
    let page = 0;
    for await (const image of doc) {
      page += 1;
      const out = path.join(pdfOutDir, `floor-1-p${page}.webp`);
      await sharp(image).webp({ quality: 82, effort: 5 }).toFile(out);
      if (page === 1) {
        planImage = `/media/apps-temoins-almadies/plan/floor-1-p${page}.webp`;
      }
      const st = await fs.stat(out);
      console.log(`ok plan p${page} (${Math.round(st.size / 1024)} KB)`);
    }
  } catch (err) {
    console.warn("pdf-to-img indisponible:", err?.message ?? err);
  }

  // Si rendu déjà présent
  try {
    await fs.access(path.join(pdfOutDir, "floor-1-p1.webp"));
    planImage = "/media/apps-temoins-almadies/plan/floor-1-p1.webp";
  } catch {
    /* ignore */
  }

  return {
    pdf: "/media/apps-temoins-almadies/plan/floor-1.pdf",
    planImage,
  };
}

function entriesFindPdf(entries) {
  return entries.find((f) => /\.pdf$/i.test(f));
}

const images = await optimizeImages();
const plan = await optimizePdf();
await fs.writeFile(
  path.join(outDir, "manifest.json"),
  JSON.stringify({ images, plan, generatedAt: new Date().toISOString() }, null, 2)
);
console.log("done", images.length, "images", plan);
