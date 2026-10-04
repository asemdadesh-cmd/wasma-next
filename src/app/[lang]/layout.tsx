import type { Metadata, Viewport } from "next";
import { Archivo, Readex_Pro } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { dirOf, hasLocale, locales } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { SITE } from "@/lib/site";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const readex = Readex_Pro({
  subsets: ["arabic", "latin"],
  variable: "--font-readex",
  display: "swap",
});

export const generateStaticParams = () => locales.map((lang) => ({ lang }));

export const viewport: Viewport = {
  themeColor: "#0B0D0C",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang);
  return {
    metadataBase: new URL(SITE.url),
    title: { default: t.meta.title, template: lang === "ar" ? "%s | وسمة" : "%s | WASMA" },
    description: t.meta.description,
    applicationName: "WASMA",
    alternates: {
      canonical: `/${lang}`,
      languages: { ar: "/ar", en: "/en", "x-default": "/ar" },
    },
    openGraph: {
      type: "website",
      siteName: lang === "ar" ? "وسمة WASMA" : "WASMA وسمة",
      locale: lang === "ar" ? "ar_LY" : "en_GB",
      alternateLocale: lang === "ar" ? ["en_GB"] : ["ar_LY"],
      title: t.meta.title,
      description: t.meta.description,
    },
    twitter: { card: "summary_large_image", title: t.meta.title, description: t.meta.description },
    formatDetection: { telephone: false },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return (
    <html lang={lang} dir={dirOf(lang)} className={`${archivo.variable} ${readex.variable}`}>
      <body>{children}</body>
    </html>
  );
}
