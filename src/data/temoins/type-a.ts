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
    "Visitez l’appartement témoin Type A aux Almadies : séjour ouvert, volumes lumineux, cuisine et suites — en galerie et plan d’étage, avant la livraison.",
  heroImage: TYPE_A_MEDIA.hero,
  rooms: TEMOIN_ROOMS,
  gallery: TYPE_A_MEDIA.gallery,
  planImage: TYPE_A_MEDIA.planImage,
  planPdf: TYPE_A_MEDIA.planPdf,
  planHref: "/les-appartements/type-a#plan",
  dossierPdf: TEMOIN_A_DOSSIER_PDF,
  dossierPages: TEMOIN_A_DOSSIER.pages.map((page, i) => ({
    src: page.layers.find((layer) => layer.id === "base")?.src ?? "",
    alt: `Dossier Type A — page ${String(i + 1).padStart(2, "0")}`,
  })),
  interest: "type-a",
};
