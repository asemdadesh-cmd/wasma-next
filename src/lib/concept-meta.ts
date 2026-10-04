import type { Metadata } from "next";
import { hasLocale, locales } from "./i18n";
import { getProject, type ProjectSlug } from "./projects";

export const conceptParams = () => locales.map((lang) => ({ lang }));

export async function conceptMetadata(params: Promise<{ lang: string }>, slug: ProjectSlug): Promise<Metadata> {
  const { lang } = await params;
  const p = getProject(slug)!;
  if (!hasLocale(lang)) return {};
  const fictional = lang === "ar" ? "مفهوم خيالي من وسمة" : "Fictional WASMA concept";
  return {
    title: `${p.name[lang]} · ${p.kind[lang]}`,
    description: `${fictional}. ${p.pitch[lang]}`,
    alternates: { canonical: `/${lang}/work/${slug}`, languages: { ar: `/ar/work/${slug}`, en: `/en/work/${slug}` } },
    openGraph: { title: `${p.name[lang]} · ${fictional}`, description: p.pitch[lang] },
  };
}
