import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/lib/navigation";
import { Mail, MapPin } from "lucide-react";
import { PILLARS, type PillarSlug } from "@/lib/pillars";

export default function Footer() {
  const t = useTranslations("Footer");
  const locale = useLocale();
  const isEn = locale === "en";
  const pillarSlugs = Object.keys(PILLARS) as PillarSlug[];

  return (
    <footer className="bg-[#254770] text-white">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-lg font-bold">GBA Connect</p>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-white/55">
              {t("brandDescription")}
            </p>
          </div>

          {/* Services */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-white/80">
              {t("servicesTitle")}
            </p>
            <ul className="mt-4 space-y-2.5">
              {pillarSlugs.map((slug) => (
                <li key={slug}>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <Link href={`/offres/${slug}` as any} className="text-sm text-white/55 transition-colors hover:text-white">
                    {isEn ? PILLARS[slug].labelEn : PILLARS[slug].label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Informations */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-white/80">
              {t("infoTitle")}
            </p>
            <ul className="mt-4 space-y-2.5">
              {(
                [
                  { key: "info2", href: "/about" },
                  { key: "info3", href: "/rgpd" },
                  { key: "info4", href: "/mentions-legales" },
                ] as const
              ).map(({ key, href }) => (
                <li key={key}>
                  <Link href={href} className="text-sm text-white/55 transition-colors hover:text-white">
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <Link
              href="/contact"
              className="text-sm font-semibold uppercase tracking-wider text-white/80 transition-colors hover:text-white"
            >
              {t("contactTitle")}
            </Link>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-2 text-sm text-white/55">
                <Mail className="h-4 w-4 shrink-0 text-[#E7A64F]" />
                {t("contactEmail")}
              </li>
              <li className="flex items-start gap-2 text-sm text-white/55">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#E7A64F]" />
                <span className="whitespace-pre-line">{t("contactCity")}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 border-t border-white/10 pt-6 text-center sm:text-left">
          <p className="text-xs text-white/35">{t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
