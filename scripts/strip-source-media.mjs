/**
 * Retire les dumps photo bruts avant le build CI / Netlify.
 * En local, ne s’exécute que si STRIP_SOURCE_MEDIA=1.
 */
import { existsSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const shouldStrip =
  process.env.NETLIFY === "true" ||
  process.env.CI === "true" ||
  process.env.STRIP_SOURCE_MEDIA === "1";

const folders = [
  "public/appartement-temoins-1",
  "public/appatement-temoins",
];

if (!shouldStrip) {
  process.exit(0);
}

for (const rel of folders) {
  const dir = path.join(root, rel);
  if (!existsSync(dir)) continue;
  rmSync(dir, { recursive: true, force: true });
  console.log(`[strip-source-media] retiré ${rel}`);
}
