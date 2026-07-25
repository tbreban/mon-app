import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

export const SITE_URL = "https://gba-connect.fr";
export const SITE_NAME = "GBA Connect";

// Mirrors next-intl's `localePrefix: 'as-needed'` (i18n/routing.ts): the
// default locale (fr) is unprefixed, every other locale is prefixed.
export function localizedPath(locale: string, path: string): string {
  if (locale === routing.defaultLocale) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

export function absoluteUrl(locale: string, path: string): string {
  return `${SITE_URL}${localizedPath(locale, path)}`;
}

export function languageAlternates(path: string): Record<string, string> {
  const alternates: Record<string, string> = {};
  for (const locale of routing.locales) {
    alternates[locale] = absoluteUrl(locale, path);
  }
  alternates["x-default"] = absoluteUrl(routing.defaultLocale, path);
  return alternates;
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/LogoGBA.png`,
    email: "contact@gba-connect.fr",
    address: {
      "@type": "PostalAddress",
      streetAddress: "18B, rue de Villiers",
      postalCode: "92300",
      addressLocality: "Levallois-Perret",
      addressCountry: "FR",
    },
  };
}

export function breadcrumbSchema(
  items: { name: string; path: string }[],
  locale: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(locale, item.path),
    })),
  };
}

export function serviceSchema({
  name,
  description,
  path,
  locale,
}: {
  name: string;
  description: string;
  path: string;
  locale: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: absoluteUrl(locale, path),
    areaServed: "FR",
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function buildMetadata({
  title,
  description,
  path,
  locale,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  locale: string;
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(locale, path);
  // Referenced explicitly rather than relying on Next's opengraph-image
  // file-convention auto-inheritance, which doesn't reliably cross the
  // app/ -> app/[locale]/ segment boundary on this Next.js branch.
  const ogImage = {
    url: `${SITE_URL}/opengraph-image`,
    width: 1200,
    height: 630,
    alt: SITE_NAME,
  };
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: locale === "en" ? "en_US" : "fr_FR",
      type: "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
