import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { PILLARS, type PillarSlug } from "@/lib/pillars";

export { PILLARS, type PillarSlug } from "@/lib/pillars";

export interface Offer {
  slug: string;
  title: string;
  pillar: PillarSlug;
  variant: string;
  order: number;
  content: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "offres");

export function getOfferBySlug(slug: string, locale = "fr"): Offer | null {
  const localePath = path.join(CONTENT_DIR, locale, `${slug}.md`);
  const defaultPath = path.join(CONTENT_DIR, `${slug}.md`);
  const filePath = locale !== "fr" && fs.existsSync(localePath) ? localePath : defaultPath;
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title as string,
    pillar: data.pillar as PillarSlug,
    variant: data.variant as string,
    order: typeof data.order === "number" ? data.order : 999,
    content,
  };
}

export function getAllOffers(locale = "fr"): Offer[] {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));
  return files
    .map((f) => getOfferBySlug(f.replace(".md", ""), locale))
    .filter((o): o is Offer => o !== null);
}

export function getOffersByPillar(pillar: PillarSlug, locale = "fr"): Offer[] {
  return getAllOffers(locale)
    .filter((o) => o.pillar === pillar)
    .sort((a, b) => a.order - b.order);
}

export function isPillarSlug(slug: string): slug is PillarSlug {
  return slug in PILLARS;
}
