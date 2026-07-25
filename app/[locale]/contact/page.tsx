import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import ContactForm from "./ContactForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ContactPage" });
  return buildMetadata({
    title: `${t("title")} - GBA Connect`,
    description: t("description"),
    path: "/contact",
    locale,
  });
}

export default function ContactPage() {
  return <ContactForm />;
}
