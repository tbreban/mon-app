"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import { ChevronDown } from "lucide-react";
import { PILLARS, type PillarSlug } from "@/lib/pillars";

type NavOffer = { slug: string; title: string; pillar: PillarSlug };

const PILLAR_ORDER: PillarSlug[] = [
  "conseil-strategie",
  "amoa-projets",
  "paie-conformite",
  "etudes-rh-donnees",
];

export default function OffresMenu({ offers }: { offers: NavOffer[] }) {
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [activePillar, setActivePillar] = useState<PillarSlug>(PILLAR_ORDER[0]);

  const pillarLabel = (slug: PillarSlug) =>
    locale === "en" ? PILLARS[slug].labelEn : PILLARS[slug].label;

  const activeOffers = offers.filter((o) => o.pillar === activePillar);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className="flex items-center gap-1 text-lg font-medium text-gray-600 transition-colors hover:text-[#254770]"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {t("solutions")}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-1/2 top-full w-[580px] -translate-x-1/2 pt-2">
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
          <div className="flex">
            {/* Pillar column */}
            <div className="w-52 shrink-0 border-r border-gray-100 bg-gray-50 p-2">
              {PILLAR_ORDER.map((slug) => (
                <Link
                  key={slug}
                  href={`/offres#${slug}` as "/offres"}
                  onMouseEnter={() => setActivePillar(slug)}
                  onClick={() => setIsOpen(false)}
                  className={`block w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-all ${
                    activePillar === slug
                      ? "bg-[#254770] text-white shadow-sm"
                      : "text-gray-700 hover:bg-white hover:shadow-sm"
                  }`}
                >
                  {pillarLabel(slug)}
                </Link>
              ))}
            </div>

            {/* Offers column */}
            <div className="flex-1 p-3">
              <div className="max-h-72 space-y-0.5 overflow-y-auto">
                {activeOffers.map((offer) => (
                  <Link
                    key={offer.slug}
                    href={`/offres/${offer.slug}` as "/offres/[slug]"}
                    onClick={() => setIsOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#254770]"
                  >
                    {offer.title}
                  </Link>
                ))}
              </div>
              <div className="mt-3 border-t border-gray-100 px-3 pt-3">
                <Link
                  href="/offres"
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-semibold text-[#E7A64F] transition-colors hover:text-[#D4913A]"
                >
                  {t("viewAll")} →
                </Link>
              </div>
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}
