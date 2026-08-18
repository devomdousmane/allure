# Appartements témoins — médias web

- Sources Type D : `public/appatement-temoins/` (ne pas servir `video-3.mp4` en runtime).
- Sources Type A : `public/appartement-temoins-1/` (JPG bruts — ne pas lier dans l’UI).
- Régénérer : `npm run temoins:optimize`
- Runtime Type D : WebP + `type-d/video/visite-3d-{720,1080}.mp4` + `poster.webp`
- Runtime Type A : WebP pièces + `type-a/plan/floor-1.webp` + `type-a/dossier.pdf` + pages dossier
- Servis sous `/media/appartements-temoins/` (pas `/appartements-temoins/` — conflit avec les pages Next).
