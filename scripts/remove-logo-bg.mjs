/**
 * Retire le fond uni des logos Allure (coins = couleur de fond)
 * et exporte des WebP/PNG transparents.
 *
 * Usage: node scripts/remove-logo-bg.mjs
 */
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logoDir = path.join(__dirname, "../public/logo");

const JOBS = [
  {
    src: "logo-allure-v1.jpeg",
    out: "logo-allure-light.webp",
    /** Fond blanc → transparence */
    mode: "light",
  },
  {
    src: "logo-allure-v2.jpeg",
    out: "logo-allure-dark.webp",
    /** Fond pétrole / teal → transparence */
    mode: "dark",
  },
];

function sampleCorner(data, w, h, channels) {
  const idx = (x, y) => (y * w + x) * channels;
  const pts = [
    idx(2, 2),
    idx(w - 3, 2),
    idx(2, h - 3),
    idx(w - 3, h - 3),
  ];
  let r = 0,
    g = 0,
    b = 0;
  for (const i of pts) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }
  return {
    r: Math.round(r / pts.length),
    g: Math.round(g / pts.length),
    b: Math.round(b / pts.length),
  };
}

function dist(r, g, b, ref) {
  const dr = r - ref.r;
  const dg = g - ref.g;
  const db = b - ref.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

/**
 * Soft chroma-key : alpha = 0 près du fond, 255 au-delà du seuil.
 */
function punchBg(data, w, h, channels, ref, soft = 18, hard = 42) {
  const out = Buffer.alloc(w * h * 4);
  for (let i = 0, p = 0; i < w * h; i++, p += channels) {
    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];
    const d = dist(r, g, b, ref);
    let a = 255;
    if (d <= soft) a = 0;
    else if (d < hard) a = Math.round(((d - soft) / (hard - soft)) * 255);

    const o = i * 4;
    out[o] = r;
    out[o + 1] = g;
    out[o + 2] = b;
    out[o + 3] = a;
  }
  return out;
}

async function processOne(job) {
  const input = path.join(logoDir, job.src);
  const output = path.join(logoDir, job.out);

  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width: w, height: h, channels } = info;
  const ref = sampleCorner(data, w, h, channels);
  console.log(`${job.src} bg ≈ rgb(${ref.r},${ref.g},${ref.b})`);

  // Seuils : blanc plus tolérant ; fond sombre un peu plus large (dégradés)
  const soft = job.mode === "light" ? 22 : 28;
  const hard = job.mode === "light" ? 55 : 70;

  const rgba = punchBg(data, w, h, channels, ref, soft, hard);

  await sharp(rgba, { raw: { width: w, height: h, channels: 4 } })
    .webp({ quality: 92, alphaQuality: 100 })
    .toFile(output);

  // PNG de secours (édition)
  const pngOut = output.replace(/\.webp$/, ".png");
  await sharp(rgba, { raw: { width: w, height: h, channels: 4 } })
    .png()
    .toFile(pngOut);

  console.log(`→ ${job.out} (+ png)`);
}

for (const job of JOBS) {
  await processOne(job);
}
console.log("Done.");
