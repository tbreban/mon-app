import { notFound } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/navigation";
import ReactMarkdown from "react-markdown";
import {
  getAllOffers,
  getOfferBySlug,
  getOffersByPillar,
  isPillarSlug,
  PILLARS,
  type PillarSlug,
} from "@/lib/offers";
import OfferCard from "@/components/OfferCard";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const offerSlugs = getAllOffers().map((o) => ({ slug: o.slug }));
  const pillarSlugs = (Object.keys(PILLARS) as PillarSlug[]).map((slug) => ({ slug }));
  return [...pillarSlugs, ...offerSlugs];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  if (isPillarSlug(slug)) {
    const pillar = PILLARS[slug];
    return { title: `${locale === "en" ? pillar.labelEn : pillar.label} — GBA Connect` };
  }
  const offer = getOfferBySlug(slug);
  if (!offer) return {};
  return { title: `${offer.title} — GBA Connect` };
}

/* ─── Composants Markdown ─── */
const mdComponents: React.ComponentProps<typeof ReactMarkdown>["components"] = {
  // Titre H1 masqué — affiché dans le hero au-dessus
  h1: () => null,

  // Section H2 avec barre or
  h2: ({ children }) => (
    <h2 className="mb-5 mt-14 flex items-start gap-3 text-xl font-bold text-[#222222] first:mt-0">
      <span className="mt-1 h-5 w-1 shrink-0 rounded-full bg-[#E7A64F]" />
      <span>{children}</span>
    </h2>
  ),

  // H3
  h3: ({ children }) => (
    <h3 className="mb-3 mt-8 text-lg font-bold text-[#222222]">{children}</h3>
  ),

  // Paragraphes
  p: ({ children }) => (
    <p className="mb-5 leading-relaxed text-[#5A6172]">{children}</p>
  ),

  // Listes non ordonnées
  ul: ({ children }) => (
    <ul className="mb-6 space-y-3">{children}</ul>
  ),

  // Listes ordonnées
  ol: ({ children }) => (
    <ol className="mb-6 space-y-3 list-none">{children}</ol>
  ),

  // Item de liste avec point or
  li: ({ children }) => (
    <li className="flex gap-3">
      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E7A64F]" />
      <span className="leading-relaxed text-[#5A6172]">{children}</span>
    </li>
  ),

  // Blockquote — style verbatim premium
  blockquote: ({ children }) => (
    <div className="my-10 rounded-2xl border border-[#E7A64F]/20 bg-[#FFEED9]/40 px-8 py-7">
      <div className="mb-3 font-serif text-5xl leading-none text-[#E7A64F]">"</div>
      <div className="space-y-3 text-[#5A6172] [&>p]:mb-0 [&>p]:italic [&>p]:leading-relaxed">
        {children}
      </div>
    </div>
  ),

  // Gras
  strong: ({ children }) => (
    <strong className="font-semibold text-[#222222]">{children}</strong>
  ),

  // Italique
  em: ({ children }) => (
    <em className="italic text-[#5A6172]">{children}</em>
  ),

  // Séparateur
  hr: () => <hr className="my-12 border-gray-100" />,
};

/* ─── Page pilier ─── */
function PillarPage({ pillarSlug }: { pillarSlug: PillarSlug }) {
  const locale = useLocale();
  const t = useTranslations("OffresPage");
  const pillar = PILLARS[pillarSlug];
  const pillarLabel = locale === "en" ? pillar.labelEn : pillar.label;
  const pillarDesc = locale === "en" ? pillar.descriptionEn : pillar.description;
  const offers = getOffersByPillar(pillarSlug, locale);

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-[#254770] py-24 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_80%_40%,_rgba(231,166,79,0.12),_transparent)]" />
        <div className="relative mx-auto max-w-7xl px-4">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Link href={"/offres" as any} className="mb-8 inline-flex items-center gap-1.5 text-sm text-[#E7A64F] transition-colors hover:text-[#C6A481]">
            <ArrowLeft className="h-4 w-4" />
            {t("backToOffres")}
          </Link>
          <div className="mb-4 inline-flex items-center rounded-full border border-[#E7A64F]/40 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#E7A64F]">
            {pillarLabel}
          </div>
          <h1 className="mt-2 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
            {pillarLabel}
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/65">
            {pillarDesc}
          </p>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer) => (
              <OfferCard key={offer.slug} offer={offer} cta={t("offerCta")} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#254770] py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-4xl font-extrabold text-white">{t("ctaTitle")}</h2>
          <p className="mt-4 text-white/60">{t("ctaDescription")}</p>
          <Link href="/contact" className="mt-10 inline-flex items-center justify-center rounded-full bg-[#E7A64F] px-10 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#D4913A]">
            {t("ctaButton")}
          </Link>
        </div>
      </section>
    </div>
  );
}

/* ─── Page fiche individuelle ─── */
function OfferPage({ slug }: { slug: string }) {
  const locale = useLocale();
  const t = useTranslations("OffresPage");
  const offer = getOfferBySlug(slug, locale);
  if (!offer) notFound();

  const pillar = PILLARS[offer.pillar];
  const pillarLabel = locale === "en" ? pillar.labelEn : pillar.label;

  return (
    <div className="flex flex-col">

      {/* Hero avec breadcrumb intégré + titre */}
      <section className="relative overflow-hidden bg-[#254770] pb-14 pt-8 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_90%_50%,_rgba(231,166,79,0.10),_transparent)]" />
        <div className="relative mx-auto max-w-3xl">

          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-white/50">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Link href={"/offres" as any} className="transition-colors hover:text-white">
              {t("breadcrumbOffres")}
            </Link>
            <span>/</span>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Link href={`/offres/${offer.pillar}` as any} className="transition-colors hover:text-white">
              {pillarLabel}
            </Link>
          </nav>

          {/* Badge pilier */}
          <span className="inline-flex items-center rounded-full border border-[#E7A64F]/40 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#E7A64F]">
            {pillarLabel}
          </span>

          {/* Titre */}
          <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-white md:text-4xl">
            {offer.title}
          </h1>
        </div>
      </section>

      {/* Contenu Markdown */}
      <article className="bg-white py-14">
        <div className="mx-auto max-w-3xl">
          <ReactMarkdown components={mdComponents}>
            {offer.content}
          </ReactMarkdown>
        </div>
      </article>

      {/* CTA */}
      <section className="bg-[#254770] py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-extrabold text-white">{t("ctaTitle")}</h2>
          <p className="mt-4 text-white/60">{t("ctaDescription")}</p>
          <Link
            href="/contact"
            className="mt-10 inline-flex items-center justify-center rounded-full bg-[#E7A64F] px-10 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#D4913A]"
          >
            {t("ctaButton")}
          </Link>
        </div>
      </section>
    </div>
  );
}

/* ─── Point d'entrée de la route ─── */
export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (isPillarSlug(slug)) {
    return <PillarPage pillarSlug={slug} />;
  }

  const offer = getOfferBySlug(slug);
  if (!offer) notFound();

  return <OfferPage slug={slug} />;
}
