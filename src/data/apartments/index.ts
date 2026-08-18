import { STUDIO } from "./studio";
import { TYPE_A } from "./type-a";
import { TYPE_B } from "./type-b";
import { TYPE_C } from "./type-c";
import { TYPE_D } from "./type-d";
import type { ApartmentDetail } from "./types";

export type {
  ApartmentDetail,
  ApartmentRoom,
  ApartmentRoomCategory,
  ApartmentGalleryImage,
} from "./types";
export { STUDIO } from "./studio";
export { TYPE_A } from "./type-a";
export { TYPE_B } from "./type-b";
export { TYPE_C } from "./type-c";
export { TYPE_D } from "./type-d";
export {
  BROCHURE,
  BROCHURE_PDF,
  type BrochurePage,
  type BrochureLayer,
} from "./brochure-manifest";
export type {
  FlipBookData,
  FlipBookPage,
  FlipBookLayer,
} from "@/data/flipbook-types";
export {
  withExtraLayers,
  brochureLayerSrc,
} from "./brochure-layers";

/** Registre des fiches détaillées (ordre hub). */
export const APARTMENT_DETAILS: ApartmentDetail[] = [
  STUDIO,
  TYPE_A,
  TYPE_B,
  TYPE_C,
  TYPE_D,
];

export function getApartmentBySlug(slug: string): ApartmentDetail | undefined {
  return APARTMENT_DETAILS.find((a) => a.slug === slug);
}

export function getApartmentSlugs(): string[] {
  return APARTMENT_DETAILS.map((a) => a.slug);
}
