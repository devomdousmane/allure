/**
 * Concatène video-1/2/3 et encode le hero scrubbable (WebM VP9 + MP4 H.264).
 * Une passe — pas de MP4 fusionné intermédiaire.
 *
 * Usage: npm run hero:webm
 *
 * Keyframes ~1 s (-g 24) : seek encore net, fichier bien plus léger qu’un GOP 0,5 s.
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
const VIDEOS = ["video-1.mp4", "video-2.mp4", "video-3.mp4"];
/** 1 s à 24 fps — assez pour le scrub, beaucoup moins d’I-frames. */
const GOP = "24";
const SCALE = "960:-2";

function run(cmd, args, { cwd, capture = false } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd,
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

async function main() {
  for (const name of VIDEOS) {
    await fs.access(path.join(videoDir, name));
  }

  await fs.mkdir(outDir, { recursive: true });

  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "allure-hero-webm-"));
  const listPath = path.join(tmp, "concat.txt");
  const list = VIDEOS.map((name) => {
    const abs = path.join(videoDir, name).replaceAll("\\", "/");
    return `file '${abs.replace(/'/g, "'\\''")}'`;
  }).join("\n");
  await fs.writeFile(listPath, `${list}\n`, "utf8");

  const webm = path.join(outDir, "hero.webm");
  const mp4 = path.join(outDir, "hero.mp4");
  const posterPng = path.join(tmp, "opening.png");
  const posterWebp = path.join(outDir, "opening.webp");

  console.log("WebM VP9 (960p, CRF 36, keyint 24)…");
  await run(
    "ffmpeg",
    [
      "-y",
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      listPath,
      "-an",
      "-vf",
      `scale=${SCALE}`,
      "-c:v",
      "libvpx-vp9",
      "-b:v",
      "0",
      "-crf",
      "36",
      "-row-mt",
      "1",
      "-deadline",
      "good",
      "-cpu-used",
      "3",
      "-g",
      GOP,
      "-keyint_min",
      GOP,
      webm,
    ],
    { cwd: videoDir }
  );

  console.log("MP4 H.264 fallback (960p, CRF 28)…");
  await run(
    "ffmpeg",
    [
      "-y",
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      listPath,
      "-an",
      "-vf",
      `scale=${SCALE}`,
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-preset",
      "medium",
      "-crf",
      "28",
      "-g",
      GOP,
      "-keyint_min",
      GOP,
      "-movflags",
      "+faststart",
      mp4,
    ],
    { cwd: videoDir }
  );

  console.log("Poster = 1re frame du concat (video-1)…");
  await run(
    "ffmpeg",
    [
      "-y",
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      listPath,
      "-frames:v",
      "1",
      "-update",
      "1",
      posterPng,
    ],
    { cwd: videoDir }
  );

  const staged = path.join(tmp, "opening.webp");
  const meta = await sharp(posterPng)
    .rotate()
    .resize({ width: 1920, height: 1080, fit: "cover" })
    .webp({ quality: 86 })
    .toFile(staged);

  try {
    await fs.copyFile(staged, posterWebp);
  } catch {
    await fs.unlink(posterWebp).catch(() => {});
    await fs.copyFile(staged, posterWebp);
  }

  const webmStat = await fs.stat(webm);
  const mp4Stat = await fs.stat(mp4);
  console.log(
    `\nOK — hero.webm ${(webmStat.size / 1e6).toFixed(2)} Mo · hero.mp4 ${(mp4Stat.size / 1e6).toFixed(2)} Mo · opening.webp ${meta.width}×${meta.height}`
  );

  await fs.rm(tmp, { recursive: true, force: true });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
