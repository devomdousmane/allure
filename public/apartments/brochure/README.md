# Brochure — calques V2

Chaque page WebP de base est générée par `npm run brochure:rasterize`.

Pour ajouter 5–8 calques PNG transparents par page :

1. Créer `public/apartments/brochure/pages/page-XX/layers/`
2. Ex. `sky.png`, `architecture.png`, `furniture.png`, `light.png`, `dust.png`, `ui-text.png`
3. Enrichir `layers` dans `src/data/apartments/brochure-manifest.ts` :

```ts
layers: [
  { id: "base", src: "/apartments/brochure/pages/page-01.webp", parallax: 0 },
  { id: "sky", src: "/apartments/brochure/pages/page-01/layers/sky.png", parallax: 0.15, blend: "screen" },
  { id: "architecture", src: "...", parallax: 0.08 },
  // …
]
```

Le composant `BrochurePage` empile déjà tous les `layers` + un halo CSS procédural.
Attention : relancer `brochure:rasterize` régénère le manifest — réinjecter les calques custom après, ou patcher le script pour merger.
