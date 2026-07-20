# Résidence Allure — site vitrine

Next.js 16 · React 19 · Tailwind CSS 4

## Démarrage

```bash
cd allure-web
npm install
cp .env.example .env.local
# Renseigner NEXT_PUBLIC_MAPBOX_TOKEN et RESEND_API_KEY
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Variables d’environnement

Voir [`.env.example`](.env.example) :

- `NEXT_PUBLIC_MAPBOX_TOKEN` — carte quartier
- `RESEND_API_KEY` — envoi du formulaire contact
- `CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL`
- `NEXT_PUBLIC_SITE_URL` — URL canonique SEO

## Routes

| Route | Page |
|-------|------|
| `/` | Accueil one-page |
| `/a-propos` | À propos |
| `/residence` | La Résidence |
| `/les-appartements` | Typologies |
| `/avancement` | Chantier |
| `/contact` | Contact + formulaire |
| `/api/contact` | API email (Resend) |
