# Résidence Allure — site vitrine

Site Next.js de la [Résidence Allure](https://residence-allure.com) — programme immobilier de standing aux Almadies, Dakar.

Next.js 16 · React 19 · Tailwind CSS 4 · GSAP · Lenis · Mapbox · Resend

## Démarrage

```bash
npm install
cp .env.example .env.local
# Renseigner NEXT_PUBLIC_MAPBOX_TOKEN (RESEND_API_KEY peut attendre)
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Déploiement Netlify

1. Créer un site depuis le dépôt Git (base directory : `allure-web` si le repo contient plusieurs dossiers).
2. Build : `node scripts/strip-source-media.mjs && npm run build` — publish : `.next` (déjà dans `netlify.toml`).
3. Node 20.
4. Variables d’environnement (Production **et** Builds pour les `NEXT_PUBLIC_*`) :

| Variable | Obligatoire au go-live |
|----------|------------------------|
| `NEXT_PUBLIC_SITE_URL` | `https://residence-allure.com` (déjà dans `netlify.toml`) |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Oui pour la carte (après consentement cookies) |
| `RESEND_API_KEY` | Peut être ajoutée ensuite |
| `CONTACT_TO_EMAIL` | `office@residence-allure.com` |
| `CONTACT_FROM_EMAIL` | Adresse d’un domaine **vérifié** Resend |

5. Domaine : `residence-allure.com` + alias `www` (redirection 301 prévue).
6. Dans Mapbox, limiter l’URL du token à `https://residence-allure.com` et `http://localhost:3000`.

Sans `RESEND_API_KEY`, contact / RDV / newsletter restent visibles mais répondent que le service n’est pas encore configuré.

Analytics : activer [Netlify Analytics](https://docs.netlify.com/manage/monitoring/analytics/) dans le dashboard si besoin (pas de script tiers dans le code).

## Variables d’environnement

Voir [`.env.example`](.env.example) :

| Variable | Rôle |
|----------|------|
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Carte quartier |
| `RESEND_API_KEY` | Envoi contact, RDV, newsletter |
| `CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL` | Destinataire / expéditeur |
| `NEXT_PUBLIC_SITE_URL` | URL canonique SEO |

## Routes

| Route | Page |
|-------|------|
| `/` | Accueil |
| `/a-propos` | À propos |
| `/residence` | La Résidence |
| `/brochure` | Brochure interactive |
| `/les-appartements` | Typologies |
| `/les-appartements/[slug]` | Fiche (surfaces, plans) |
| `/appartements-temoins` | Show flats |
| `/avancement` | Chantier |
| `/avancement/journal` | Journal de chantier |
| `/rendez-vous` | Prise de rendez-vous |
| `/contact` | Contact |
| `/api/contact` | Email contact (Resend) |
| `/api/appointment` | Email rendez-vous |
| `/api/newsletter` | Email inscription footer |

## Scripts

```bash
npm run hero:frames        # Extraire les frames du hero cinématique
npm run temoins:optimize   # Optimiser les visuels témoins
npm run brochure:rasterize
npm run journal:rasterize
npm run favicons:generate
```
