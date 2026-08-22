import {
  TEMOIN_ROOMS,
  TYPE_A_MEDIA,
  type TemoinDetail,
} from "./shared-media";
import {
  TEMOIN_A_DOSSIER,
  TEMOIN_A_DOSSIER_PDF,
} from "./type-a-dossier-manifest";

export const TEMOIN_TYPE_A: TemoinDetail = {
  slug: "type-a",
  name: "Appartement témoin — Type A",
  typologyLabel: "Type A",
  mediaFinal: true,
  description:
    "Visitez l’appartement témoin Type A : séjour ouvert, suite parentale avec dressing, deux chambres, deux balcons — en images, plan, dossier et visite virtuelle Matterport.",
  heroImage: TYPE_A_MEDIA.hero,
  rooms: TEMOIN_ROOMS,
  gallery: TYPE_A_MEDIA.gallery,
  matterport: TYPE_A_MEDIA.matterport,
  planImage: TYPE_A_MEDIA.planImage,
  planHref: "/les-appartements/type-a#plan",
  dossierPdf: TEMOIN_A_DOSSIER_PDF,
  dossierPages: TEMOIN_A_DOSSIER.pages.map((page, i) => ({
    src: page.layers.find((layer) => layer.id === "base")?.src ?? "",
    alt: `Dossier Type A — page ${String(i + 1).padStart(2, "0")}`,
  })),
  interest: "type-a",
};
