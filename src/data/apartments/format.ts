import type { ApartmentDetail } from "@/data/apartments/types";

/** Format m² à la française (247.44 → "247,44 m²"). */
export function formatSurface(m2: number): string {
  return `${m2.toFixed(2).replace(".", ",")} m²`;
}

export function shortApartmentName(name: string): string {
  return name.replace(/^Appartement\s+/i, "");
}

export function getApartmentStats(apartment: ApartmentDetail) {
  return [
    { label: "Surface", value: formatSurface(apartment.surfaceTotal) },
    {
      label: "Chambres",
      value: apartment.hasStaffRoom
        ? `${apartment.bedrooms} + serv.`
        : String(apartment.bedrooms),
    },
    { label: "SDB", value: String(apartment.bathrooms) },
    {
      label: apartment.terraces > 1 ? "Terrasses" : "Terrasse",
      value: String(apartment.terraces),
    },
    { label: "Étages", value: apartment.floors.replace(/^Étages?\s*/i, "") },
  ];
}
