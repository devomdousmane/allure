import type { MetadataRoute } from "next";
import { getApartmentSlugs } from "@/data/apartments";
import { SITE } from "@/lib/site";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? SITE.url;

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/a-propos",
    "/residence",
    "/les-appartements",
    ...getApartmentSlugs().map((slug) => `/les-appartements/${slug}`),
    "/avancement",
    "/contact",
  ];

  const now = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.startsWith("/les-appartements/") ? 0.9 : 0.8,
  }));
}
