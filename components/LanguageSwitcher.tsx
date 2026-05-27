"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/lib/navigation";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(next: string) {
    router.replace(pathname, { locale: next });
  }

  return (
    <div className="flex items-center gap-1 text-sm font-medium">
      <button
        onClick={() => switchLocale("fr")}
        className={locale === "fr" ? "text-foreground" : "text-muted-foreground hover:text-foreground transition-colors"}
      >
        FR
      </button>
      <span className="text-muted-foreground">|</span>
      <button
        onClick={() => switchLocale("en")}
        className={locale === "en" ? "text-foreground" : "text-muted-foreground hover:text-foreground transition-colors"}
      >
        EN
      </button>
    </div>
  );
}
