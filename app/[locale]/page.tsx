import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import Image from "next/image";
import { Compass, ClipboardList, ShieldCheck, BarChart2, Check } from "lucide-react";
import { PILLARS, getOffersByPillar } from "@/lib/offers";

export default function Home() {
  const t = useTranslations("HomePage");

  const stats = [
    { value: t("stat1Value"), label: t("stat1Label") },
    { value: t("stat2Value"), label: t("stat2Label") },
    { value: t("stat3Value"), label: t("stat3Label") },
    { value: t("stat4Value"), label: t("stat4Label") },
  ];

  const whyFeatures = [
    { title: t("why1Title"), description: t("why1Description") },
    { title: t("why2Title"), description: t("why2Description") },
    { title: t("why3Title"), description: t("why3Description") },
  ];

  return (
    <div className="flex flex-col">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#254770] px-6 py-44 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_80%_40%,_rgba(231,166,79,0.12),_transparent)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_10%_80%,_rgba(231,166,79,0.08),_transparent)]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="mb-6 inline-flex items-center rounded-full border border-[#E7A64F]/40 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#E7A64F]">
            {t("heroBadge")}
          </div>
          <h1 className="max-w-3xl text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">
            {t.rich("heroTitle", {
              highlight: (chunks) => (
                <span className="text-[#E7A64F]">{chunks}</span>
              ),
            })}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/65">
            {t("heroDescription")}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/offres"
              className="rounded-full border-2 border-white px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#254770]"
            >
              {t("ctaServices")}
            </Link>
            <Link
              href="/contact"
              className="rounded-full border-2 border-white/30 px-8 py-3 text-sm font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/10"
            >
              {t("ctaContact")}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-white px-6 py-16">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-2">
              <span className="text-5xl font-extrabold text-[#254770]">{stat.value}</span>
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Services ── */}
      <section className="bg-gray-50 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-[#222222]">{t("servicesTitle")}</h2>
            <p className="mt-2 max-w-lg text-sm text-gray-500">{t("servicesDescription")}</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Conseil & Stratégie */}
            <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
              <Compass className="mb-6 h-8 w-8 text-[#E7A64F]" />
              <h3 className="text-xl font-bold text-[#222222]">{PILLARS["conseil-strategie"].label}</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">{PILLARS["conseil-strategie"].description}</p>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <Link href={"/offres/conseil-strategie" as any} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#222222] transition-colors hover:text-[#E7A64F]">
                {t("servicesLearnMore")} →
              </Link>
            </div>

            {/* AMOA Projets — highlighted */}
            <div className="rounded-2xl bg-[#254770] p-8 text-white">
              <ClipboardList className="mb-6 h-8 w-8 text-[#E7A64F]" />
              <h3 className="text-xl font-bold">{PILLARS["amoa-projets"].label}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/75">{PILLARS["amoa-projets"].description}</p>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <Link href={"/offres/amoa-projets" as any} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-white transition-colors hover:text-[#E7A64F]">
                {t("servicesLearnMore")} →
              </Link>
            </div>

            {/* Paie & Conformité */}
            <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
              <ShieldCheck className="mb-6 h-8 w-8 text-[#E7A64F]" />
              <h3 className="text-xl font-bold text-[#222222]">{PILLARS["paie-conformite"].label}</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">{PILLARS["paie-conformite"].description}</p>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <Link href={"/offres/paie-conformite" as any} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#222222] transition-colors hover:text-[#E7A64F]">
                {t("servicesLearnMore")} →
              </Link>
            </div>

            {/* Études RH & Données */}
            <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
              <BarChart2 className="mb-6 h-8 w-8 text-[#E7A64F]" />
              <h3 className="text-xl font-bold text-[#222222]">{PILLARS["etudes-rh-donnees"].label}</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">{PILLARS["etudes-rh-donnees"].description}</p>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <Link href={"/offres/etudes-rh-donnees" as any} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#222222] transition-colors hover:text-[#E7A64F]">
                {t("servicesLearnMore")} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why GBA ── */}
      <section className="bg-white px-6 py-24">
        <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-2">
          {/* Left */}
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#E7A64F]">
              {t("whyBadge")}
            </span>
            <h2 className="mt-4 max-w-sm text-3xl font-bold leading-tight text-[#222222]">
              {t("whyTitle")}
            </h2>
            <ul className="mt-10 space-y-7">
              {whyFeatures.map((f) => (
                <li key={f.title} className="flex gap-4">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E7A64F]">
                    <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                  </div>
                  <div>
                    <p className="font-semibold text-[#222222]">{f.title}</p>
                    <p className="mt-1 text-sm text-gray-500">{f.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — image + testimonial */}
          <div className="relative">
            <div className="relative h-80 overflow-hidden rounded-2xl md:h-[360px]">
              <Image
                src="https://picsum.photos/seed/gba-team/800/600"
                alt="Équipe GBA Connect"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-6 left-6 right-6 rounded-xl bg-white p-5 shadow-xl">
              <p className="text-sm italic leading-relaxed text-gray-600">{t("testimonial")}</p>
              <p className="mt-3 text-xs font-bold text-[#222222]">{t("testimonialAuthor")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
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
