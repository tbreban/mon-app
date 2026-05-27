import fs from "fs";
import path from "path";
import matter from "gray-matter";

export const PILLARS = {
  "conseil-strategie": {
    label: "Conseil & Stratégie",
    labelEn: "Consulting & Strategy",
    description:
      "Sécuriser vos décisions SIRH/Paie avant d'engager le projet.",
    descriptionEn: "Secure your SIRH/Payroll decisions before starting the project.",
  },
  "amoa-projets": {
    label: "AMOA Projets",
    labelEn: "Project AMOA",
    description:
      "Piloter vos projets SIRH, Paie et GTA du côté métier.",
    descriptionEn: "Drive your SIRH, Payroll and Time Management projects from the business side.",
  },
  "paie-conformite": {
    label: "Paie & Conformité",
    labelEn: "Payroll & Compliance",
    description:
      "Fiabiliser, contrôler et sécuriser votre paie au quotidien.",
    descriptionEn: "Strengthen, control and secure your payroll on a daily basis.",
  },
  "etudes-rh-donnees": {
    label: "Études RH & Données",
    labelEn: "HR Studies & Data",
    description:
      "Transformer vos données sociales en outil de pilotage.",
    descriptionEn: "Turn your social data into a management tool.",
  },
} as const;

export type PillarSlug = keyof typeof PILLARS;

export interface Offer {
  slug: string;
  title: string;
  pillar: PillarSlug;
  variant: string;
  content: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "offres");

export function getOfferBySlug(slug: string): Offer | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title as string,
    pillar: data.pillar as PillarSlug,
    variant: data.variant as string,
    content,
  };
}

export function getAllOffers(): Offer[] {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));
  return files
    .map((f) => getOfferBySlug(f.replace(".md", "")))
    .filter((o): o is Offer => o !== null);
}

export function getOffersByPillar(pillar: PillarSlug): Offer[] {
  return getAllOffers().filter((o) => o.pillar === pillar);
}

export function isPillarSlug(slug: string): slug is PillarSlug {
  return slug in PILLARS;
}
