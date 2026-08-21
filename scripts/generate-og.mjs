/**
 * Génère public/og/og-default.webp (1200×630) depuis le still hero.
 * Usage: npm run og:generate
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const src = path.join(
  root,
  "public",
  "media",
  "hero-cinematic",
  "opening.webp"
);
const outDir = path.join(root, "public", "og");
const dest = path.join(outDir, "og-default.webp");

async function main() {
  await fs.access(src);
  await fs.mkdir(outDir, { recursive: true });
  const meta = await sharp(src)
    .rotate()
    .resize(1200, 630, { fit: "cover", position: "centre" })
    .webp({ quality: 82, effort: 5 })
    .toFile(dest);
  console.log(`OK — ${dest} (${meta.width}×${meta.height})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
