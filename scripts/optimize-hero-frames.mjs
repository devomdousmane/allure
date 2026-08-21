/**
 * Recompresse les frames hero déjà extraites (mobile scrub).
 *
 * - largeur max 960 (assez pour ≤768 CSS px × 1.5–2 dpr)
 * - WebP q=68
 * - optionnel : sous-échantillonner à 60 frames (--half)
 *
 * Usage:
 *   node scripts/optimize-hero-frames.mjs
 *   node scripts/optimize-hero-frames.mjs --half
 */
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "public", "media", "hero-cinematic");

const MAX_WIDTH = 960;
const WEBP_QUALITY = 68;
const half = process.argv.includes("--half");

async function main() {
  const files = (await fs.readdir(outDir))
    .filter((f) => /^frame_\d+\.webp$/i.test(f))
    .sort();

  if (!files.length) {
    console.error("Aucune frame_*.webp dans", outDir);
    process.exit(1);
  }

  const before = (
    await Promise.all(
      files.map(async (f) => (await fs.stat(path.join(outDir, f))).size)
    )
  ).reduce((a, b) => a + b, 0);

  console.log(
    `Avant: ${files.length} frames, ${(before / 1024 / 1024).toFixed(2)} Mo`
  );
  console.log(
    `Cible: max ${MAX_WIDTH}px, q=${WEBP_QUALITY}${half ? ", 60 frames (1/2)" : ""}`
  );

  const selected = half
    ? files.filter((_, i) => i % 2 === 0).slice(0, 60)
    : files;

  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "allure-hero-opt-"));

  try {
    const written = [];
    for (let i = 0; i < selected.length; i++) {
      const src = path.join(outDir, selected[i]);
      const name = `frame_${String(i + 1).padStart(3, "0")}.webp`;
      const staged = path.join(tmp, name);
      await sharp(src)
        .rotate()
        .resize({
          width: MAX_WIDTH,
          height: MAX_WIDTH,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: WEBP_QUALITY, effort: 5 })
        .toFile(staged);
      written.push(name);
      if (i === 0 || i === selected.length - 1 || (i + 1) % 30 === 0) {
        const meta = await sharp(staged).metadata();
        console.log(`  ${name} → ${meta.width}×${meta.height}`);
      }
    }

    for (const name of written) {
      const dest = path.join(outDir, name);
      const staged = path.join(tmp, name);
      try {
        await fs.copyFile(staged, dest);
      } catch {
        await fs.unlink(dest).catch(() => {});
        await fs.copyFile(staged, dest);
      }
    }

    const leftovers = (await fs.readdir(outDir)).filter((f) => {
      const m = /^frame_(\d+)\.webp$/i.exec(f);
      if (!m) return false;
      return Number(m[1]) > written.length;
    });
    for (const f of leftovers) {
      await fs.unlink(path.join(outDir, f));
      console.log(`  supprimé ${f}`);
    }

    const afterFiles = (await fs.readdir(outDir)).filter((f) =>
      /^frame_\d+\.webp$/i.test(f)
    );
    const after = (
      await Promise.all(
        afterFiles.map(async (f) => (await fs.stat(path.join(outDir, f))).size)
      )
    ).reduce((a, b) => a + b, 0);

    console.log(
      `\nOK — ${afterFiles.length} frames, ${(after / 1024 / 1024).toFixed(2)} Mo (−${(
        ((before - after) / before) *
        100
      ).toFixed(0)}%)`
    );
    if (half) {
      console.log(
        "Pense à mettre FRAME_COUNT = 60 dans cinematic-hero.tsx (si pas déjà fait)."
      );
    }
  } finally {
    await fs.rm(tmp, { recursive: true, force: true }).catch(() => {});
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
