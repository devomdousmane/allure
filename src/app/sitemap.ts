import type { MetadataRoute } from "next";
import { getApartmentSlugs } from "@/data/apartments";
import { getTemoinSlugs } from "@/data/temoins";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const routes: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }> = [
    { path: "", changeFrequency: "weekly", priority: 1 },
    { path: "/a-propos", changeFrequency: "monthly", priority: 0.8 },
    { path: "/residence", changeFrequency: "monthly", priority: 0.8 },
    { path: "/brochure", changeFrequency: "monthly", priority: 0.8 },
    { path: "/appartements-temoins", changeFrequency: "monthly", priority: 0.85 },
    ...getTemoinSlugs().map((slug) => ({
      path: `/appartements-temoins/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    { path: "/les-appartements", changeFrequency: "monthly", priority: 0.85 },
    ...getApartmentSlugs().map((slug) => ({
      path: `/les-appartements/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    { path: "/avancement", changeFrequency: "weekly", priority: 0.8 },
    { path: "/avancement/journal", changeFrequency: "monthly", priority: 0.7 },
    { path: "/rendez-vous", changeFrequency: "monthly", priority: 0.8 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
    { path: "/mentions-legales", changeFrequency: "yearly", priority: 0.3 },
    { path: "/cgu", changeFrequency: "yearly", priority: 0.3 },
    { path: "/confidentialite", changeFrequency: "yearly", priority: 0.3 },
    { path: "/cookies", changeFrequency: "yearly", priority: 0.3 },
    { path: "/llms.txt", changeFrequency: "monthly", priority: 0.2 },
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
