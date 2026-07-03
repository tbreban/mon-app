import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "RgpdPage" });
  return { title: `${t("title")} — GBA Connect` };
}

const SECTION_KEYS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export default function RgpdPage() {
  const t = useTranslations("RgpdPage");

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-[#254770] py-24 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_80%_40%,_rgba(231,166,79,0.12),_transparent)]" />
        <div className="relative mx-auto max-w-3xl px-4">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
            {t("title")}
          </h1>
        </div>
      </section>

      <article className="bg-white py-14">
        <div className="mx-auto max-w-3xl px-4">
          <p className="mb-5 leading-relaxed text-[#5A6172]">{t("intro")}</p>

          {SECTION_KEYS.map((n) => (
            <section key={n}>
              <h2 className="mb-5 mt-14 flex items-start gap-3 text-xl font-bold text-[#222222] first:mt-0">
                <span className="mt-1 h-5 w-1 shrink-0 rounded-full bg-[#E7A64F]" />
                <span>{t(`section${n}Title`)}</span>
              </h2>
              <p className="mb-5 whitespace-pre-line leading-relaxed text-[#5A6172]">
                {t(`section${n}Body`)}
              </p>
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
