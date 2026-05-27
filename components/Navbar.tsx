import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const t = useTranslations("Navbar");

  const links = [
    { href: "/offres" as const, label: t("solutions") },
    { href: "/actualites" as const, label: t("news") },
    { href: "/about" as const, label: t("about") },
  ];

  return (
    <header className="sticky top-0 z-50 w-full shadow-md">

      {/* ── Ligne logo ── */}
      <div className="flex justify-center bg-white px-6 py-4">
        <Link href="/">
          <Image
            src="/LogoGBA.png"
            alt="GBA Connect"
            width={320}
            height={110}
            priority
            style={{ width: "auto", maxWidth: "320px", height: "110px" }}
          />
        </Link>
      </div>

      {/* ── Ligne navigation ── */}
      <div className="bg-[#254770] px-6">
        <div className="mx-auto flex h-12 max-w-6xl items-center justify-between">
          <nav className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white/80 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link
              href="/contact"
              className="rounded-full bg-[#E7A64F] px-5 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-[#D4913A]"
            >
              {t("contact")}
            </Link>
          </div>
        </div>
      </div>

    </header>
  );
}
