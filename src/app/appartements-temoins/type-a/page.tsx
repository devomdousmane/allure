import type { Metadata } from "next";
import { TemoinDetailView } from "../temoin-detail-view";
import { TEMOIN_TYPE_A } from "@/data/temoins";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: TEMOIN_TYPE_A.name,
  description: TEMOIN_TYPE_A.description,
  alternates: { canonical: `/appartements-temoins/${TEMOIN_TYPE_A.slug}` },
  openGraph: {
    title: `${TEMOIN_TYPE_A.name} — ${SITE.name}`,
    description: TEMOIN_TYPE_A.description,
    images: [{ url: TEMOIN_TYPE_A.heroImage }],
  },
};

export default function TemoinTypeAPage() {
  return <TemoinDetailView temoin={TEMOIN_TYPE_A} />;
}
