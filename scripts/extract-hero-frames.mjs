/**
 * Extrait 120 frames WebP depuis video-1/2/3 pour le hero cinématique.
 *
 * Usage: npm run hero:frames
 *
 * Les MP4 actuels sont en 1280×720 — on n’agrandit pas (withoutEnlargement).
 * Sortie : public/media/hero-cinematic (évite le lock OneDrive/Next sur l’ancien dossier).
 */
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const videoDir = path.join(root, "public", "video", "frame-videos");
const outDir = path.join(root, "public", "media", "hero-cinematic");

/** Mobile scrub — moins de frames / moins de pixels = moins de RAM & data. */
const TOTAL_FRAMES = 60;
const MAX_WIDTH = 960;
const WEBP_QUALITY = 68;
const VIDEOS = ["video-1.mp4", "video-2.mp4", "video-3.mp4"];

function run(cmd, args, { capture = false } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: capture ? ["ignore", "pipe", "pipe"] : "inherit",
      shell: false,
    });
    let out = "";
    let err = "";
    if (capture) {
      child.stdout.on("data", (d) => {
        out += d.toString();
      });
      child.stderr.on("data", (d) => {
        err += d.toString();
      });
    }
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve(out.trim());
      else reject(new Error(`${cmd} exit ${code}${err ? `\n${err}` : ""}`));
    });
  });
}

async function probeDuration(file) {
  const raw = await run(
    "ffprobe",
    [
      "-v",
      "error",
      "-select_streams",
      "v:0",
      "-show_entries",
      "stream=width,height,duration",
      "-of",
      "csv=p=0",
      file,
    ],
    { capture: true }
  );
  const [w, h, d] = raw.split(",");
  return {
    width: Number(w),
    height: Number(h),
    duration: Number(d),
  };
}

async function resolveOpeningSource() {
  const video = path.join(videoDir, "video-3.mp4");
  await fs.access(video);
  return video;
}

async function exportOpeningStill(tmpDir) {
  const png = path.join(tmpDir, "opening.png");
  const dest = path.join(outDir, "opening.webp");
  let input;
  try {
    input = await resolveOpeningSource();
  } catch {
    console.log("Pas de video-3.mp4 — opening.webp inchangé.");
    return;
  }
  console.log(`Plan d’ouverture — 1re frame de video-3 (${path.basename(input)})…`);
  await run("ffmpeg", [
    "-y",
    "-i",
    input,
    "-frames:v",
    "1",
    "-update",
    "1",
    png,
  ]);
  const staged = path.join(tmpDir, "opening.webp");
  const meta = await sharp(png)
    .rotate()
    .resize({ width: 1920, height: 1080, fit: "cover" })
    .webp({ quality: 86 })
    .toFile(staged);
  try {
    await fs.copyFile(staged, dest);
  } catch {
    await fs.unlink(dest).catch(() => {});
    await fs.copyFile(staged, dest);
  }
  console.log(`  opening.webp → ${meta.width}×${meta.height}`);
}

async function logExistingSample() {
  const sample = path.join(outDir, "frame_001.webp");
  try {
    const meta = await sharp(sample).metadata();
    console.log(
      `Frames actuelles (échantillon frame_001): ${meta.width}×${meta.height}`
    );
  } catch {
    console.log("Pas de frame_001.webp existante.");
  }
}

function allocateCounts(durations, total) {
  const sum = durations.reduce((a, b) => a + b, 0);
  const counts = durations.map((d) =>
    Math.max(1, Math.round((d / sum) * total))
  );
  let diff = total - counts.reduce((a, b) => a + b, 0);
  let i = counts.length - 1;
  while (diff !== 0) {
    const next = counts[i] + Math.sign(diff);
    if (next >= 1) {
      counts[i] = next;
      diff -= Math.sign(diff);
    }
    i = (i + counts.length - 1) % counts.length;
  }
  return counts;
}

async function main() {
  await logExistingSample();

  const infos = [];
  for (const name of VIDEOS) {
    const file = path.join(videoDir, name);
    await fs.access(file);
    const info = await probeDuration(file);
    infos.push({ name, file, ...info });
    console.log(
      `  ${name}: ${info.width}×${info.height}, ${info.duration.toFixed(2)}s`
    );
  }

  if (infos.some((v) => v.width < MAX_WIDTH)) {
    console.log(
      `\nSources < ${MAX_WIDTH}px — export à la largeur native (pas d’upscale).`
    );
  }

  const counts = allocateCounts(
    infos.map((v) => v.duration),
    TOTAL_FRAMES
  );
  console.log(`Répartition: ${counts.join(" + ")} = ${TOTAL_FRAMES} frames\n`);

  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "allure-hero-"));
  const extracted = [];

  try {
    for (let v = 0; v < infos.length; v++) {
      const info = infos[v];
      const n = counts[v];
      const fps = n / info.duration;
      const pattern = path.join(tmp, `v${v + 1}_%03d.png`);
      console.log(`ffmpeg ${info.name} → ${n} png (fps=${fps.toFixed(3)})…`);
      await run("ffmpeg", [
        "-y",
        "-i",
        info.file,
        "-vf",
        `fps=${fps.toFixed(4)}`,
        "-frames:v",
        String(n),
        pattern,
      ]);

      const files = (await fs.readdir(tmp))
        .filter((f) => f.startsWith(`v${v + 1}_`) && f.endsWith(".png"))
        .sort();
      extracted.push(...files.map((f) => path.join(tmp, f)));
    }

    if (extracted.length !== TOTAL_FRAMES) {
      console.warn(
        `Attendu ${TOTAL_FRAMES} png, obtenu ${extracted.length} — on continue.`
      );
    }

    await fs.mkdir(outDir, { recursive: true });
    await exportOpeningStill(tmp);

    let index = 1;
    for (const png of extracted) {
      const name = `frame_${String(index).padStart(3, "0")}.webp`;
      const staged = path.join(tmp, name);
      const dest = path.join(outDir, name);
      const meta = await sharp(png)
        .rotate()
        .resize({
          width: MAX_WIDTH,
          height: MAX_WIDTH,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: WEBP_QUALITY })
        .toFile(staged);

      try {
        await fs.copyFile(staged, dest);
      } catch {
        await fs.unlink(dest).catch(() => {});
        await fs.copyFile(staged, dest);
      }

      if (index === 1 || index === extracted.length) {
        console.log(`  ${name} → ${meta.width}×${meta.height}`);
      }
      index += 1;
    }

    const leftovers = (await fs.readdir(outDir)).filter((f) => {
      const m = /^frame_(\d+)\.webp$/i.exec(f);
      if (!m) return false;
      return Number(m[1]) >= index;
    });
    for (const f of leftovers) {
      await fs.unlink(path.join(outDir, f));
      console.log(`  supprimé surplus ${f}`);
    }

    console.log(`\nOK — ${index - 1} frames dans ${outDir}`);
  } finally {
    await fs.rm(tmp, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
