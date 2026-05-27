import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import { getOffersByPillar, PILLARS, type PillarSlug } from "@/lib/offers";
import OfferCard, { PillarCard } from "@/components/OfferCard";

export default function OffresPage() {
  const locale = useLocale();
  const t = useTranslations("OffresPage");
  const pillarSlugs = Object.keys(PILLARS) as PillarSlug[];

  return (
    <div className="flex flex-col">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#254770] py-24 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_80%_40%,_rgba(231,166,79,0.12),_transparent)]" />
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="mb-6 inline-flex items-center rounded-full border border-[#E7A64F]/40 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#E7A64F]">
            {t("badge")}
          </div>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/65">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* ── Piliers ── */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-10 text-2xl font-bold text-[#222222]">{t("pillarsTitle")}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pillarSlugs.map((slug) => (
              <PillarCard
                key={slug}
                pillarSlug={slug}
                offerCount={getOffersByPillar(slug, locale).length}
                cta={t("pillarCta")}
                locale={locale}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Toutes les offres par pilier ── */}
      {pillarSlugs.map((pillarSlug) => {
        const offers = getOffersByPillar(pillarSlug, locale);
        const pillar = PILLARS[pillarSlug];
        const pillarLabel = locale === "en" ? pillar.labelEn : pillar.label;
        const pillarDesc = locale === "en" ? pillar.descriptionEn : pillar.description;
        return (
          <section key={pillarSlug} className="bg-white py-16 border-b border-gray-100 last:border-0">
            <div className="mx-auto max-w-7xl px-4">
              <div className="mb-8 flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#E7A64F]">
                    {pillarLabel}
                  </span>
                  <p className="mt-1 text-sm text-gray-500">{pillarDesc}</p>
                </div>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <Link
                  href={`/offres/${pillarSlug}` as any}
                  className="hidden text-sm font-semibold text-[#222222] transition-colors hover:text-[#E7A64F] sm:block"
                >
                  {t("seeAll")} →
                </Link>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {offers.map((offer) => (
                  <OfferCard key={offer.slug} offer={offer} cta={t("offerCta")} locale={locale} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* ── CTA ── */}
      <section className="bg-[#254770] py-24 text-center">
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
