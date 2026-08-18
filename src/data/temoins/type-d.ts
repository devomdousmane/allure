import {
  TEMOIN_ROOMS,
  TYPE_D_MEDIA,
  type TemoinDetail,
} from "./shared-media";

export const TEMOIN_TYPE_D: TemoinDetail = {
  slug: "type-d",
  name: "Appartement témoin — Type D",
  typologyLabel: "Type D",
  mediaFinal: true,
  description:
    "Visitez l’appartement témoin Type D : volumes aménagés, finitions et lumière — en images et en visite 3D, avant la livraison.",
  heroImage: TYPE_D_MEDIA.hero,
  rooms: TEMOIN_ROOMS,
  gallery: TYPE_D_MEDIA.gallery,
  video: TYPE_D_MEDIA.video,
  interest: "type-d",
};
