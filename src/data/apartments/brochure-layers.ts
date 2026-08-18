/**
 * Helpers V2 — fusion de calques PNG additionnels dans le manifest.
 * Convention :
 *   public/apartments/brochure/pages/page-XX/layers/{id}.png
 */
import type { FlipBookLayer, FlipBookPage } from "@/data/flipbook-types";

const DEFAULT_PARALLAX: Record<string, number> = {
  sky: 0.18,
  architecture: 0.08,
  furniture: 0.12,
  light: 0.28,
  dust: 0.4,
  pollen: 0.35,
  "ui-text": 0.05,
  reflection: 0.22,
};

const DEFAULT_BLEND: Record<string, FlipBookLayer["blend"]> = {
  sky: "screen",
  light: "soft-light",
  dust: "screen",
  pollen: "screen",
  reflection: "overlay",
};

/**
 * Ajoute des calques à une page (sans dupliquer un `id` existant).
 * Utilisable côté data pour enrichir manuellement le manifest.
 */
export function withExtraLayers(
  page: FlipBookPage,
  extras: Array<Omit<FlipBookLayer, "parallax" | "blend"> & Partial<FlipBookLayer>>
): FlipBookPage {
  const existing = new Set(page.layers.map((l) => l.id));
  const merged = [...page.layers];

  for (const extra of extras) {
    if (existing.has(extra.id)) continue;
    merged.push({
      parallax: DEFAULT_PARALLAX[extra.id] ?? 0.1,
      blend: DEFAULT_BLEND[extra.id] ?? "normal",
      opacity: 1,
      ...extra,
    });
  }

  return { ...page, layers: merged };
}

/**
 * Chemin conventionnel d’un calque PNG V2.
 */
export function brochureLayerSrc(pageId: string, layerId: string) {
  return `/apartments/brochure/pages/${pageId}/layers/${layerId}.png`;
}
