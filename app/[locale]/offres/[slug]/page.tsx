import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
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
  const pillarSlugs = (Object.keys(PILLARS) as PillarSlug[]).map((slug) => ({
    slug,
  }));
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

/* ─── Pillar listing page ─── */
function PillarPage({ pillarSlug }: { pillarSlug: PillarSlug }) {
  const t = useTranslations("OffresPage");
  const pillar = PILLARS[pillarSlug];
  const offers = getOffersByPillar(pillarSlug);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#254770] px-6 py-24 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_80%_40%,_rgba(231,166,79,0.12),_transparent)]" />
        <div className="relative mx-auto max-w-6xl">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Link
            href={"/offres" as any}
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-[#E7A64F] transition-colors hover:text-[#C6A481]"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("backToOffres")}
          </Link>
          <div className="mb-4 inline-flex items-center rounded-full border border-[#E7A64F]/40 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#E7A64F]">
            {pillar.label}
          </div>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
            {pillar.label}
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/65">
            {pillar.description}
          </p>
        </div>
      </section>

      {/* Offers grid */}
      <section className="bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer) => (
              <OfferCard key={offer.slug} offer={offer} cta={t("offerCta")} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#254770] px-6 py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-4xl font-extrabold text-white">{t("ctaTitle")}</h2>
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

/* ─── Individual offer page ─── */
function OfferPage({ slug }: { slug: string }) {
  const t = useTranslations("OffresPage");
  const offer = getOfferBySlug(slug);
  if (!offer) notFound();

  const pillar = PILLARS[offer.pillar];

  return (
    <div className="flex flex-col">
      {/* Breadcrumb / back */}
      <div className="border-b border-gray-100 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center gap-2 text-sm text-gray-500">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Link href={"/offres" as any} className="hover:text-[#254770]">
            {t("breadcrumbOffres")}
          </Link>
          <span>/</span>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Link href={`/offres/${offer.pillar}` as any} className="hover:text-[#254770]">
            {pillar.label}
          </Link>
          <span>/</span>
          <span className="font-medium text-[#222222]">{offer.title}</span>
        </div>
      </div>

      {/* Content */}
      <article className="bg-white px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <span className="mb-6 inline-flex rounded-full bg-[#FFEED9] px-3 py-1 text-xs font-semibold text-[#A56B22]">
            {pillar.label}
          </span>
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="mb-4 mt-2 text-3xl font-extrabold leading-tight text-[#222222] md:text-4xl">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="mb-4 mt-12 text-2xl font-bold text-[#222222]">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="mb-3 mt-8 text-xl font-bold text-[#222222]">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="mb-4 leading-relaxed text-gray-600">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="mb-6 space-y-2 pl-6">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="mb-6 list-decimal space-y-2 pl-6">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="text-gray-600 before:mr-2 before:text-[#E7A64F] before:content-['–']">
                  {children}
                </li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="my-8 rounded-xl border-l-4 border-[#E7A64F] bg-[#FFEED9] px-6 py-5 italic text-gray-600">
                  {children}
                </blockquote>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-[#222222]">
                  {children}
                </strong>
              ),
              em: ({ children }) => (
                <em className="text-gray-500">{children}</em>
              ),
              hr: () => <hr className="my-10 border-gray-100" />,
            }}
          >
            {offer.content}
          </ReactMarkdown>
        </div>
      </article>

      {/* CTA */}
      <section className="bg-[#254770] px-6 py-24 text-center">
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

/* ─── Route entry point ─── */
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
