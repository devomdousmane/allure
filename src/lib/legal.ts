import { SITE } from "@/lib/site";

export type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type LegalDocument = {
  slug: "mentions-legales" | "cgu" | "confidentialite" | "cookies";
  title: string;
  eyebrow: string;
  description: string;
  updatedAt: string;
  sections: LegalSection[];
};

export const LEGAL_LINKS = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/cgu", label: "CGU" },
  { href: "/confidentialite", label: "Confidentialité" },
  { href: "/cookies", label: "Cookies" },
] as const;

const UPDATED = "18 août 2026";

export const LEGAL_DOCUMENTS: Record<LegalDocument["slug"], LegalDocument> = {
  "mentions-legales": {
    slug: "mentions-legales",
    title: "Mentions légales",
    eyebrow: "Informations",
    description:
      "Éditeur du site, hébergement et coordonnées de la Résidence Allure.",
    updatedAt: UPDATED,
    sections: [
      {
        id: "editeur",
        title: "1. Éditeur du site",
        paragraphs: [
          `Le site ${SITE.url.replace("https://", "")} est édité dans le cadre de la promotion du programme immobilier « ${SITE.name} », situé ${SITE.address}.`,
          "Directeur de la publication : l’équipe commerciale Résidence Allure.",
          `Contact : ${SITE.email} — ${SITE.phone}.`,
        ],
      },
      {
        id: "objet",
        title: "2. Objet du site",
        paragraphs: [
          "Ce site présente le programme Résidence Allure (typologies, prestations, avancement du chantier, informations de contact). Les informations commerciales (prix, surfaces, délais) sont fournies à titre indicatif et peuvent évoluer.",
        ],
      },
      {
        id: "hebergement",
        title: "3. Hébergement",
        paragraphs: [
          "Le site est hébergé par Netlify, Inc., 44 Montgomery Street, Suite 300, San Francisco, CA 94104, États-Unis.",
          "Site de l’hébergeur : https://www.netlify.com — pour toute question d’accessibilité du service, vous pouvez aussi nous écrire à l’adresse indiquée ci-dessus.",
        ],
      },
      {
        id: "propriete",
        title: "4. Propriété intellectuelle",
        paragraphs: [
          "L’ensemble des contenus (textes, photographies, vidéos, plans, logos, charte graphique) est protégé. Toute reproduction, représentation ou diffusion non autorisée est interdite, sauf usage privé et non commercial dans le respect des droits d’auteur.",
        ],
      },
      {
        id: "responsabilite",
        title: "5. Responsabilité",
        paragraphs: [
          "Nous nous efforçons d’assurer l’exactitude des informations publiées. Des erreurs ou omissions peuvent toutefois subsister. L’éditeur ne saurait être tenu responsable des dommages liés à l’utilisation du site ou à l’impossibilité d’y accéder.",
        ],
      },
      {
        id: "lien",
        title: "6. Liens externes",
        paragraphs: [
          "Le site peut contenir des liens vers des sites tiers (réseaux sociaux, cartographie, partenaires). Nous n’exerçons aucun contrôle sur ces contenus et déclinons toute responsabilité à leur égard.",
        ],
      },
    ],
  },

  cgu: {
    slug: "cgu",
    title: "Conditions générales d’utilisation",
    eyebrow: "CGU",
    description:
      "Règles d’accès et d’usage du site Résidence Allure.",
    updatedAt: UPDATED,
    sections: [
      {
        id: "acceptation",
        title: "1. Acceptation",
        paragraphs: [
          `L’accès et l’utilisation du site ${SITE.name} impliquent l’acceptation pleine et entière des présentes conditions générales d’utilisation (CGU). Si vous n’acceptez pas ces conditions, veuillez ne pas utiliser le site.`,
        ],
      },
      {
        id: "acces",
        title: "2. Accès au service",
        paragraphs: [
          "Le site est accessible gratuitement à tout utilisateur disposant d’un accès Internet. Les coûts de connexion restent à la charge de l’utilisateur. Nous pouvons suspendre ou modifier l’accès pour maintenance, mise à jour ou cas de force majeure.",
        ],
      },
      {
        id: "usage",
        title: "3. Usage loyal",
        paragraphs: [
          "Vous vous engagez à utiliser le site de manière licite et loyale, notamment à ne pas :",
        ],
        bullets: [
          "Porter atteinte au bon fonctionnement du site (intrusion, surcharge, scripts malveillants)",
          "Collecter des données personnelles d’autres utilisateurs sans droit",
          "Usurper une identité ou diffuser des informations trompeuses via les formulaires",
          "Reproduire les contenus protégés hors du cadre autorisé",
        ],
      },
      {
        id: "formulaires",
        title: "4. Formulaires de contact",
        paragraphs: [
          "Les demandes envoyées via le formulaire de contact ou la newsletter sont traitées afin de vous répondre ou de vous tenir informé du programme. Les informations doivent être exactes. Le traitement des données est décrit dans la politique de confidentialité.",
        ],
      },
      {
        id: "disponibilite",
        title: "5. Disponibilité & évolutions",
        paragraphs: [
          "Nous pouvons faire évoluer les contenus, la structure du site ou les présentes CGU à tout moment. La date de mise à jour figurant en tête de page fait foi. L’utilisation continue du site après modification vaut acceptation des nouvelles conditions.",
        ],
      },
      {
        id: "droit",
        title: "6. Droit applicable",
        paragraphs: [
          "Les présentes CGU sont régies par le droit sénégalais. En cas de litige, et à défaut de résolution amiable, les tribunaux compétents de Dakar seront saisis.",
        ],
      },
    ],
  },

  confidentialite: {
    slug: "confidentialite",
    title: "Politique de confidentialité",
    eyebrow: "Données personnelles",
    description:
      "Comment nous collectons, utilisons et protégeons vos données.",
    updatedAt: UPDATED,
    sections: [
      {
        id: "responsable",
        title: "1. Responsable du traitement",
        paragraphs: [
          `Le responsable du traitement des données collectées via le site est l’éditeur de ${SITE.name}, joignable à ${SITE.email} ou au ${SITE.phone}.`,
        ],
      },
      {
        id: "donnees",
        title: "2. Données collectées",
        paragraphs: [
          "Selon vos interactions, nous pouvons collecter :",
        ],
        bullets: [
          "Identité et coordonnées (nom, téléphone, e-mail) via le formulaire de contact ou la newsletter",
          "Contenu du message et motif de la demande",
          "Données techniques de navigation (adresse IP, type d’appareil, pages consultées) via cookies ou journaux serveur",
          "Préférences éventuelles (ex. thème d’affichage stocké localement sur votre appareil)",
        ],
      },
      {
        id: "finalites",
        title: "3. Finalités",
        paragraphs: [
          "Ces données sont utilisées pour :",
        ],
        bullets: [
          "Répondre à vos demandes d’information, de visite ou de suivi commercial",
          "Vous adresser, avec votre accord, des actualités sur le programme Allure",
          "Assurer la sécurité, la performance et l’amélioration du site",
          "Respecter nos obligations légales et réglementaires",
        ],
      },
      {
        id: "base",
        title: "4. Base légale & durée",
        paragraphs: [
          "Le traitement repose sur votre consentement (formulaires, cookies non essentiels), l’intérêt légitime (sécurité du site, statistiques agrégées) ou l’exécution de mesures précontractuelles à votre demande.",
          "Les données de contact sont conservées le temps nécessaire au traitement de votre demande, puis archivées pour une durée limitée compatible avec nos obligations (généralement jusqu’à 3 ans à compter du dernier échange, sauf délai légal plus long).",
        ],
      },
      {
        id: "destinataires",
        title: "5. Destinataires",
        paragraphs: [
          "Les données sont destinées aux équipes commerciales et techniques Allure, ainsi qu’à nos prestataires techniques (hébergement Netlify, e-mail Resend, cartographie Mapbox si vous l’avez acceptée) agissant selon nos instructions. Elles ne sont pas vendues à des tiers.",
        ],
      },
      {
        id: "droits",
        title: "6. Vos droits",
        paragraphs: [
          "Conformément à la réglementation applicable en matière de protection des données personnelles, vous disposez notamment des droits d’accès, de rectification, d’effacement, de limitation, d’opposition et de portabilité, dans les conditions prévues par la loi.",
          `Pour exercer vos droits : ${SITE.email}. Une pièce d’identité pourra être demandée en cas de doute raisonnable sur votre identité.`,
        ],
      },
      {
        id: "securite",
        title: "7. Sécurité",
        paragraphs: [
          "Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données. Aucun système n’étant infaillible, nous vous invitons à nous signaler toute suspicion d’incident.",
        ],
      },
    ],
  },

  cookies: {
    slug: "cookies",
    title: "Politique de cookies",
    eyebrow: "Cookies",
    description:
      "Types de cookies utilisés sur le site et comment les gérer.",
    updatedAt: UPDATED,
    sections: [
      {
        id: "quoi",
        title: "1. Qu’est-ce qu’un cookie ?",
        paragraphs: [
          "Un cookie est un petit fichier déposé sur votre terminal lors de la visite d’un site. Il permet de mémoriser des informations relatives à la navigation ou à vos préférences.",
        ],
      },
      {
        id: "types",
        title: "2. Cookies utilisés",
        paragraphs: [
          "Selon la configuration du site, peuvent être utilisés :",
        ],
        bullets: [
          "Essentiels (sans consentement) : mémorisation du thème d’affichage et de votre choix cookies (stockage local sur votre appareil)",
          "Carte Mapbox (optionnelle) : chargée uniquement si vous acceptez les cookies non essentiels — tuiles, traces techniques et éventuels cookies du prestataire Mapbox",
          "Journaux d’hébergement : Netlify peut traiter des données de connexion (IP, navigateur) pour la sécurité et le bon fonctionnement du service",
        ],
      },
      {
        id: "consentement",
        title: "3. Consentement",
        paragraphs: [
          "Les cookies et stockages strictement nécessaires au service ne requièrent pas de consentement. La carte interactive Mapbox n’est chargée qu’après votre accord, via le bandeau affiché lors de la première visite ou depuis cette page.",
        ],
      },
      {
        id: "gestion",
        title: "4. Gérer vos cookies",
        paragraphs: [
          "Vous pouvez à tout moment supprimer ou bloquer les cookies via les paramètres de votre navigateur. Le refus de certains cookies peut limiter certaines fonctionnalités (par exemple l’affichage d’une carte interactive).",
        ],
      },
      {
        id: "duree",
        title: "5. Durée de conservation",
        paragraphs: [
          "La durée de vie des cookies varie selon leur finalité (session ou durée limitée, en général au maximum 13 mois pour les cookies de mesure d’audience, sauf disposition contraire).",
        ],
      },
      {
        id: "plus",
        title: "6. En savoir plus",
        paragraphs: [
          `Pour toute question relative aux cookies ou à vos données personnelles, consultez également la politique de confidentialité ou écrivez à ${SITE.email}.`,
        ],
      },
    ],
  },
};
