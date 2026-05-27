import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="bg-[#254770] text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-lg font-bold">GBA Connect</p>
            <p className="mt-3 text-sm leading-relaxed text-white/55">
              {t("brandDescription")}
            </p>
          </div>

          {/* Services */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-white/80">
              {t("servicesTitle")}
            </p>
            <ul className="mt-4 space-y-2.5">
              {(["service1", "service2", "service3", "service4"] as const).map((key) => (
                <li key={key}>
                  <Link href="/offres" className="text-sm text-white/55 transition-colors hover:text-white">
                    {t(key)}
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
              {(["info1", "info2", "info3", "info4"] as const).map((key) => (
                <li key={key}>
                  <Link href="/about" className="text-sm text-white/55 transition-colors hover:text-white">
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-white/80">
              {t("contactTitle")}
            </p>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-2 text-sm text-white/55">
                <Mail className="h-4 w-4 shrink-0 text-[#E7A64F]" />
                {t("contactEmail")}
              </li>
              <li className="flex items-center gap-2 text-sm text-white/55">
                <Phone className="h-4 w-4 shrink-0 text-[#E7A64F]" />
                {t("contactPhone")}
              </li>
              <li className="flex items-center gap-2 text-sm text-white/55">
                <MapPin className="h-4 w-4 shrink-0 text-[#E7A64F]" />
                {t("contactCity")}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-white/35">{t("copyright")}</p>
          <Link href="/privacy" className="text-xs text-white/35 transition-colors hover:text-white">
            {t("privacy")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
