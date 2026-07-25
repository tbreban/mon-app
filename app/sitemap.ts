import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getAllOffers, PILLARS, type PillarSlug } from "@/lib/offers";
import { absoluteUrl } from "@/lib/seo";

interface RouteDef {
  path: string;
  priority: number;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pillarSlugs = Object.keys(PILLARS) as PillarSlug[];
  const offerSlugs = getAllOffers().map((offer) => offer.slug);

  const routes: RouteDef[] = [
    { path: "/", priority: 1, changeFrequency: "monthly" },
    { path: "/offres", priority: 0.9, changeFrequency: "weekly" },
    ...pillarSlugs.map((slug) => ({
      path: `/offres/${slug}`,
      priority: 0.8,
      changeFrequency: "monthly" as const,
    })),
    ...offerSlugs.map((slug) => ({
      path: `/offres/${slug}`,
      priority: 0.7,
      changeFrequency: "monthly" as const,
    })),
    { path: "/about", priority: 0.5, changeFrequency: "yearly" },
    { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
    { path: "/mentions-legales", priority: 0.1, changeFrequency: "yearly" },
    { path: "/rgpd", priority: 0.1, changeFrequency: "yearly" },
  ];

  return routes.flatMap((route) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(locale, route.path),
      priority: route.priority,
      changeFrequency: route.changeFrequency,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, absoluteUrl(l, route.path)])
        ),
      },
    }))
  );
}
