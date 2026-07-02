"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import { supabase } from "@/lib/supabase";

export default function Contact() {
  const t = useTranslations("ContactPage");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    portable: "",
    email: "",
    motif: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.from("contacts").insert([form]);

    if (error) {
      setError(t("error"));
    } else {
      setSubmitted(true);
    }
    setLoading(false);
  }

  const inputClass =
    "rounded-full border border-black/[.08] bg-transparent px-5 py-3 text-sm text-black placeholder-zinc-400 outline-none transition-colors hover:border-black/20 focus:border-black dark:border-white/[.145] dark:text-zinc-50 dark:placeholder-zinc-600 dark:hover:border-white/30 dark:focus:border-white";

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col gap-12 py-32 px-16 bg-white dark:bg-black">
        <Link href="/">
          <Image
            src="/LogoGBA.png"
            alt="Logo GBA"
            width={437}
            height={150}
            priority
          />
        </Link>

        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            {t("title")}
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            {t("description")}
          </p>
        </div>

        {submitted ? (
          <div className="flex flex-col gap-4">
            <p className="text-lg font-medium text-black dark:text-zinc-50">
              {t("successMessage")}
            </p>
            <button
              onClick={() => { setSubmitted(false); setForm({ nom: "", prenom: "", portable: "", email: "", motif: "" }); }}
              className="w-fit rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
            >
              {t("sendAnother")}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-black dark:text-zinc-50">
                  {t("nom")} <span className="text-zinc-400">*</span>
                </label>
                <input
                  type="text"
                  name="nom"
                  value={form.nom}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  placeholder="Dupont"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-black dark:text-zinc-50">
                  {t("prenom")} <span className="text-zinc-400">*</span>
                </label>
                <input
                  type="text"
                  name="prenom"
                  value={form.prenom}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  placeholder="Jean"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-black dark:text-zinc-50">
                  {t("portable")} <span className="text-zinc-400">*</span>
                </label>
                <input
                  type="tel"
                  name="portable"
                  value={form.portable}
                  onChange={handleChange}
                  required
                  maxLength={30}
                  placeholder="06 00 00 00 00"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-black dark:text-zinc-50">
                  {t("email")} <span className="text-zinc-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  maxLength={254}
                  placeholder="jean.dupont@email.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-black dark:text-zinc-50">
                {t("motif")} <span className="text-zinc-400">*</span>
              </label>
              <select
                name="motif"
                value={form.motif}
                onChange={handleChange}
                required
                className="rounded-full border border-black/[.08] bg-white px-5 py-3 text-sm text-black outline-none transition-colors hover:border-black/20 focus:border-black dark:border-white/[.145] dark:bg-black dark:text-zinc-50 dark:hover:border-white/30 dark:focus:border-white"
              >
                <option value="" disabled>{t("motifPlaceholder")}</option>
                <option value="fleur">{t("motif1")}</option>
                <option value="papillon">{t("motif2")}</option>
                <option value="casquette">{t("motif3")}</option>
              </select>
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex h-12 items-center justify-center rounded-full bg-foreground px-8 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] disabled:opacity-50"
              >
                {loading ? t("submitting") : t("submit")}
              </button>
              <Link
                href="/"
                className="flex h-12 items-center justify-center rounded-full border border-solid border-black/[.08] px-8 text-sm font-medium transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:text-zinc-50 dark:hover:bg-[#1a1a1a]"
              >
                {t("back")}
              </Link>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
