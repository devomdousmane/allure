import { TEMOIN_TYPE_A } from "./type-a";
import { TEMOIN_TYPE_D } from "./type-d";
import type { TemoinDetail } from "./shared-media";

export type {
  TemoinDetail,
  TemoinDossierPage,
  TemoinImage,
  TemoinRoom,
  TemoinRoomId,
  TemoinVideoSrc,
} from "./shared-media";
export { TEMOIN_ROOMS, TYPE_A_MEDIA, TYPE_D_MEDIA } from "./shared-media";
export { TEMOIN_TYPE_A } from "./type-a";
export { TEMOIN_TYPE_D } from "./type-d";

export const TEMOINS: TemoinDetail[] = [TEMOIN_TYPE_D, TEMOIN_TYPE_A];

export function getTemoinBySlug(slug: string): TemoinDetail | undefined {
  return TEMOINS.find((t) => t.slug === slug);
}

export function getTemoinSlugs(): string[] {
  return TEMOINS.map((t) => t.slug);
}
