import { Link } from "@/lib/navigation";
import { PILLARS, type Offer, type PillarSlug } from "@/lib/offers";
import { ArrowRight } from "lucide-react";

interface OfferCardProps {
  offer: Offer;
  cta: string;
  locale?: string;
}

export default function OfferCard({ offer, cta, locale = "fr" }: OfferCardProps) {
  const pillar = PILLARS[offer.pillar];
  const pillarLabel = locale === "en" ? pillar.labelEn : pillar.label;
  return (
    <div className="flex flex-col rounded-2xl bg-white p-7 shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-md">
      <span className="mb-4 inline-flex self-start rounded-full bg-[#FFEED9] px-3 py-1 text-xs font-semibold text-[#A56B22]">
        {pillarLabel}
      </span>
      <h3 className="text-lg font-bold leading-snug text-[#222222]">
        {offer.title}
      </h3>
      <div className="mt-auto pt-6">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Link
          href={`/offres/${offer.slug}` as any}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#222222] transition-colors hover:text-[#E7A64F]"
        >
          {cta}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

interface PillarCardProps {
  pillarSlug: PillarSlug;
  offerCount: number;
  cta: string;
  locale?: string;
}

export function PillarCard({ pillarSlug, offerCount, cta, locale = "fr" }: PillarCardProps) {
  const pillar = PILLARS[pillarSlug];
  const isEn = locale === "en";
  const pillarLabel = isEn ? pillar.labelEn : pillar.label;
  const pillarDescription = isEn ? pillar.descriptionEn : pillar.description;
  const countLabel = isEn
    ? `${offerCount} offering${offerCount > 1 ? "s" : ""}`
    : `${offerCount} offre${offerCount > 1 ? "s" : ""}`;
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Link
      href={`/offres/${pillarSlug}` as any}
      className="group flex flex-col rounded-2xl bg-[#254770] p-8 text-white transition-colors hover:bg-[#1e3a5f]"
    >
      <span className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#E7A64F]">
        {countLabel}
      </span>
      <h3 className="text-xl font-bold leading-snug">{pillarLabel}</h3>
      <p className="mt-3 text-sm leading-relaxed text-white/65">
        {pillarDescription}
      </p>
      <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#E7A64F] transition-colors group-hover:text-[#C6A481]">
        {cta}
        <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}
