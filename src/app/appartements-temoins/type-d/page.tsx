import type { Metadata } from "next";
import { TemoinDetailView } from "../temoin-detail-view";
import { TEMOIN_TYPE_D } from "@/data/temoins";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: TEMOIN_TYPE_D.name,
  description: TEMOIN_TYPE_D.description,
  alternates: { canonical: `/appartements-temoins/${TEMOIN_TYPE_D.slug}` },
  openGraph: {
    title: `${TEMOIN_TYPE_D.name} — ${SITE.name}`,
    description: TEMOIN_TYPE_D.description,
    images: [{ url: TEMOIN_TYPE_D.heroImage }],
  },
};

export default function TemoinTypeDPage() {
  return <TemoinDetailView temoin={TEMOIN_TYPE_D} />;
}
