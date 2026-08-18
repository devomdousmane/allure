import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TemoinDetailView } from "../temoin-detail-view";
import { getTemoinBySlug, getTemoinSlugs } from "@/data/temoins";
import { SITE } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

/** Autorise les slugs hors generateStaticParams (dev Turbopack). */
export const dynamicParams = true;

export async function generateStaticParams() {
  return getTemoinSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const temoin = getTemoinBySlug(slug);
  if (!temoin) return { title: "Appartement témoin" };

  return {
    title: temoin.name,
    description: temoin.description,
    alternates: { canonical: `/appartements-temoins/${temoin.slug}` },
    openGraph: {
      title: `${temoin.name} — ${SITE.name}`,
      description: temoin.description,
      images: [{ url: temoin.heroImage }],
    },
  };
}

/**
 * Fallback dynamique — les fiches type-d / type-a ont aussi des pages
 * statiques explicites (évite un conflit public/ + bugs Turbopack [slug]).
 */
export default async function TemoinDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const temoin = getTemoinBySlug(slug);
  if (!temoin) notFound();

  return <TemoinDetailView temoin={temoin} />;
}
