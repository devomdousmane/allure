/**
 * Optimise les assets appartements témoins :
 * - Type D : JPG → WebP (max 1600px) + vidéo 720/1080
 * - Type A : drop `appartement-temoins-1` → WebP + plan + dossier.pdf
 *
 * Usage: npm run temoins:optimize
 */
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const srcRootD = path.join(root, "public", "appatement-temoins");
const srcRootA = path.join(root, "public", "appartement-temoins-1");
const outRoot = path.join(root, "public", "media", "appartements-temoins");
const typeDOut = path.join(outRoot, "type-d");
const typeAOut = path.join(outRoot, "type-a");
const videoOut = path.join(typeDOut, "video");

const ROOM_MAP_D = [
  { test: /^axo/i, folder: "axo" },
  { test: /^bath/i, folder: "sdb" },
  { test: /^bed/i, folder: "chambre" },
  { test: /^kitch/i, folder: "cuisine" },
  { test: /^liv/i, folder: "salon" },
];

const TYPE_A_PREFIX = /^wanfang-immobilier-residence-allure-f4-almadies-/i;

function roomForD(name) {
  const base = path.parse(name).name;
  return ROOM_MAP_D.find((r) => r.test.test(base))?.folder ?? "autres";
}

/** Pièce Type A à partir du nom de fichier (FR, plus spécifique d’abord). */
function roomForA(slug) {
  if (/salle-de-bain|toilette/.test(slug)) return "sdb";
  if (/cuisine/.test(slug)) return "cuisine";
  if (/plan-3d/.test(slug)) return "axo";
  if (/salon|salle-a-manger/.test(slug)) return "salon";
  if (
    /chambre|dressing|balcon-chambre|acces-chambre|couloir/.test(slug)
  ) {
    return "chambre";
  }
  return "autres";
}

function slugifyTypeA(filename) {
  const base = path.parse(filename).name;
  return base
    .replace(TYPE_A_PREFIX, "")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit", shell: false });
    child.on("error", reject);
    child.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(`${cmd} exit ${code}`))
    );
  });
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function findFiles(dir, re) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...(await findFiles(full, re)));
    else if (re.test(e.name)) files.push(full);
  }
  return files;
}

async function toWebp(src, dest) {
  await ensureDir(path.dirname(dest));
  await sharp(src)
    .rotate()
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(dest);
}

async function optimizeTypeDImages() {
  const jpgRoot = path.join(srcRootD, "app-D");
  if (!(await exists(jpgRoot))) {
    console.log("Type D : pas de sources app-D — skip images.");
    return;
  }
  const jpgs = await findFiles(jpgRoot, /\.jpe?g$/i);
  console.log(`Type D images: ${jpgs.length} JPG…`);
  for (const file of jpgs) {
    const base = path.parse(file).name.toLowerCase();
    const room = roomForD(base);
    const dest = path.join(typeDOut, room, `${base}.webp`);
    await toWebp(file, dest);
    console.log(`  ${room}/${base}.webp`);
  }
}

async function optimizeVideo() {
  const srcVideo = path.join(srcRootD, "video-3.mp4");
  if (!(await exists(srcVideo))) {
    console.log("Type D : pas de video-3.mp4 — skip vidéo.");
    return;
  }

  await ensureDir(videoOut);
  const out720 = path.join(videoOut, "visite-3d-720.mp4");
  const out1080 = path.join(videoOut, "visite-3d-1080.mp4");
  const poster = path.join(videoOut, "poster.webp");
  const posterPng = path.join(videoOut, "poster-temp.png");

  console.log("Vidéo 720p…");
  await run("ffmpeg", [
    "-y",
    "-i",
    srcVideo,
    "-vf",
    "scale=-2:720",
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-crf",
    "28",
    "-c:a",
    "aac",
    "-b:a",
    "96k",
    "-movflags",
    "+faststart",
    out720,
  ]);

  console.log("Vidéo 1080p…");
  await run("ffmpeg", [
    "-y",
    "-i",
    srcVideo,
    "-vf",
    "scale=-2:1080",
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-crf",
    "28",
    "-c:a",
    "aac",
    "-b:a",
    "128k",
    "-movflags",
    "+faststart",
    out1080,
  ]);

  console.log("Poster…");
  await run("ffmpeg", [
    "-y",
    "-ss",
    "2",
    "-i",
    srcVideo,
    "-frames:v",
    "1",
    posterPng,
  ]);
  await sharp(posterPng)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(poster);
  await fs.unlink(posterPng).catch(() => undefined);
}

async function optimizeTypeA() {
  if (!(await exists(srcRootA))) {
    console.warn("Type A : dossier appartement-temoins-1 introuvable — skip.");
    return;
  }

  const images = await findFiles(srcRootA, /\.(jpe?g|png)$/i);
  const pdfs = await findFiles(srcRootA, /\.pdf$/i);

  console.log(`Type A : ${images.length} images…`);
  for (const file of images) {
    const slug = slugifyTypeA(path.basename(file));
    const isPlan = /floor-1|floor 1/.test(slug) || /floor 1/i.test(path.basename(file));
    const room = isPlan ? "plan" : roomForA(slug);
    const destName = isPlan ? "floor-1.webp" : `${slug}.webp`;
    const dest = path.join(typeAOut, room, destName);
    await toWebp(file, dest);
    console.log(`  ${room}/${destName}`);
  }

  if (pdfs[0]) {
    await ensureDir(typeAOut);
    const destPdf = path.join(typeAOut, "dossier.pdf");
    await fs.copyFile(pdfs[0], destPdf);
    console.log("  dossier.pdf");
  }
}

async function rasterizeDossier() {
  const pdf = path.join(typeAOut, "dossier.pdf");
  if (!(await exists(pdf))) {
    console.log("Type A : pas de dossier.pdf — skip rasterize.");
    return;
  }
  console.log("Type A : rasterize dossier PDF…");
  await run(process.execPath, [
    path.join(root, "scripts", "rasterize-flipbook.mjs"),
    "temoin-a",
  ]);
}

async function writeReadme() {
  await ensureDir(outRoot);
  await fs.writeFile(
    path.join(outRoot, "README.md"),
    `# Appartements témoins — médias web

- Sources Type D : \`public/appatement-temoins/\` (ne pas servir \`video-3.mp4\` en runtime).
- Sources Type A : \`public/appartement-temoins-1/\` (JPG bruts — ne pas lier dans l’UI).
- Régénérer : \`npm run temoins:optimize\`
- Runtime Type D : WebP + \`type-d/video/visite-3d-{720,1080}.mp4\` + \`poster.webp\`
- Runtime Type A : WebP pièces + \`type-a/plan/floor-1.webp\` + \`type-a/dossier.pdf\` + pages dossier
- Servis sous \`/media/appartements-temoins/\` (pas \`/appartements-temoins/\` — conflit avec les pages Next).
`,
    "utf8"
  );
}

console.log("→ Optimisation appartements témoins");
await writeReadme();
await optimizeTypeDImages();
await optimizeVideo();
await optimizeTypeA();
await rasterizeDossier();
console.log("Done.");
