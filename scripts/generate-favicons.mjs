/**
 * Génère les favicons Allure à partir du logo home (thème sombre),
 * fond pétrole de marque (plus de noir générique).
 *
 * Usage: node scripts/generate-favicons.mjs
 */
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { writeFileSync } from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const logoPath = path.join(root, "public/logo/logo-allure-dark.webp");
const outDir = path.join(root, "public/favicon");

/** Pétrole Allure #1E4B5D */
const PETROL = { r: 30, g: 75, b: 93, alpha: 1 };
const PETROL_HEX = "#1E4B5D";

async function squareIcon(size, padRatio = 0.14) {
  const pad = Math.round(size * padRatio);
  const inner = size - pad * 2;

  const logo = await sharp(logoPath)
    .ensureAlpha()
    .resize(inner, inner, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: PETROL,
    },
  })
    .composite([{ input: logo, gravity: "centre" }])
    .png()
    .toBuffer();
}

async function main() {
  const png96 = await squareIcon(96, 0.12);
  const png180 = await squareIcon(180, 0.12);
  const png192 = await squareIcon(192, 0.1);
  const png512 = await squareIcon(512, 0.1);

  await sharp(png96).toFile(path.join(outDir, "favicon-96x96.png"));
  await sharp(png180).toFile(path.join(outDir, "apple-touch-icon.png"));
  await sharp(png192).toFile(path.join(outDir, "web-app-manifest-192x192.png"));
  await sharp(png512).toFile(path.join(outDir, "web-app-manifest-512x512.png"));

  // ICO — sharp écrit un PNG valide ; la plupart des navigateurs l’acceptent
  // comme favicon.ico. On génère aussi un 48px de secours.
  const ico32 = await squareIcon(32, 0.1);
  const ico48 = await squareIcon(48, 0.1);
  await sharp(ico32).toFile(path.join(outDir, "favicon.ico"));
  await sharp(ico48).png().toFile(path.join(outDir, "favicon-48x48.png"));

  // SVG léger : fond pétrole + PNG 192 embarqué
  const b64 = png192.toString("base64");
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${PETROL_HEX}"/>
  <image width="512" height="512" xlink:href="data:image/png;base64,${b64}"/>
</svg>
`;
  writeFileSync(path.join(outDir, "favicon.svg"), svg);

  console.log("Favicons générés (logo home + fond pétrole) → public/favicon/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
