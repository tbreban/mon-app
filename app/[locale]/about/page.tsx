import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/lib/navigation";
import { ShieldCheck, Users, Target, Award } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AboutPage" });
  return { title: `${t("title")} - GBA Connect` };
}

export default function AboutPage() {
  const t = useTranslations("AboutPage");
  const tHome = useTranslations("HomePage");

  const stats = [
    { value: tHome("stat1Value"), label: tHome("stat1Label") },
    { value: tHome("stat2Value"), label: tHome("stat2Label") },
    { value: tHome("stat3Value"), label: tHome("stat3Label") },
    { value: tHome("stat4Value"), label: tHome("stat4Label") },
  ];

  const values = [
    { icon: ShieldCheck, title: t("value1Title"), description: t("value1Description") },
    { icon: Target, title: t("value2Title"), description: t("value2Description") },
    { icon: Users, title: t("value3Title"), description: t("value3Description") },
    { icon: Award, title: t("value4Title"), description: t("value4Description") },
  ];

  return (
    <div className="flex flex-col">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#254770] py-28 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_80%_40%,_rgba(231,166,79,0.12),_transparent)]" />
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="mb-6 inline-flex items-center rounded-full border border-[#E7A64F]/40 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#E7A64F]">
            {t("badge")}
          </div>
          <h1 className="max-w-3xl text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">
            {t("title")}
          </h1>
          <p className="mt-6 max-w-2xl whitespace-pre-line text-lg leading-relaxed text-white/65">
            {t("intro")}
          </p>
        </div>
      </section>

      {/* ── Notre histoire ── */}
      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl px-4 gap-16 md:grid-cols-2">
          <div className="order-2 md:order-1 relative min-h-[320px] overflow-hidden rounded-2xl">
            <Image
              src="/team-meeting-smile.jpg"
              alt="Équipe GBA Connect"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>
          <div className="order-1 md:order-2 flex flex-col justify-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E7A64F]">
              {t("storyBadge")}
            </span>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-[#222222]">
              {t("storyTitle")}
            </h2>
            <p className="mt-6 whitespace-pre-line leading-relaxed text-gray-500">
              {t("storyBody")}
            </p>
          </div>
        </div>
      </section>

      {/* ── Nos valeurs ── */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 max-w-lg">
            <h2 className="text-3xl font-bold text-[#222222]">{t("valuesTitle")}</h2>
            <p className="mt-2 text-sm text-gray-500">{t("valuesDescription")}</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex flex-col overflow-hidden rounded-2xl shadow-sm ring-1 ring-gray-100">
                <div className="h-3 shrink-0 bg-[#254770]" />
                <div className="flex-1 bg-white p-8">
                  <Icon className="mb-6 h-8 w-8 text-[#E7A64F]" />
                  <h3 className="text-lg font-bold text-[#222222]">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-500">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Chiffres clés ── */}
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 sm:grid-cols-4 px-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-2">
              <span className="text-5xl font-extrabold text-[#254770]">{stat.value}</span>
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#254770] py-24 text-center">
        <div className="mx-auto max-w-3xl px-4">
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
