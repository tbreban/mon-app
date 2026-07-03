import Image from "next/image";
import { useTranslations } from "next-intl";
import { getLocale } from "next-intl/server";
import { Link } from "@/lib/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import OffresMenu from "./OffresMenu";
import { getAllOffers } from "@/lib/offers";

export default async function Navbar() {
  const t = useTranslations("Navbar");
  const locale = await getLocale();

  const allOffers = getAllOffers(locale);
  const navOffers = allOffers
    .sort((a, b) => a.order - b.order)
    .map(({ slug, title, pillar }) => ({ slug, title, pillar }));

  const staticLinks = [{ href: "/about" as const, label: t("about") }];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white shadow-sm">
      <div className="mx-auto flex h-28 max-w-7xl items-center justify-between px-4">
        <Link href="/">
          <Image
            src="/LogoGBA.png"
            alt="GBA Connect"
            width={300}
            height={103}
            priority
          />
        </Link>
        <nav className="hidden items-center gap-10 md:flex">
          <Link
            href="/"
            className="text-lg font-medium text-gray-600 transition-colors hover:text-[#254770]"
          >
            {t("home")}
          </Link>
          <OffresMenu offers={navOffers} />
          {staticLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-lg font-medium text-gray-600 transition-colors hover:text-[#254770]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Link
            href="/contact"
            className="rounded-full bg-[#E7A64F] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#D4913A]"
          >
            {t("contact")}
          </Link>
        </div>
      </div>
    </header>
  );
}
