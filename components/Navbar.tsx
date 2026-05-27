import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const t = useTranslations("Navbar");

  const links = [
    { href: "/expertise" as const, label: t("expertise") },
    { href: "/offres" as const, label: t("solutions") },
    { href: "/actualites" as const, label: t("news") },
    { href: "/about" as const, label: t("about") },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/">
          <Image
            src="/LogoGBA.png"
            alt="GBA Connect"
            width={140}
            height={48}
            priority
          />
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-[#254770]"
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
