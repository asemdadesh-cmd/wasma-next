import { notFound } from "next/navigation";
import { Contact } from "@/components/home/Contact";
import { SelectionProvider } from "@/components/home/Selection";
import { BusinessProvider } from "@/components/proposal/Business";
import { Friction } from "@/components/proposal/Friction";
import { Hero } from "@/components/proposal/Hero";
import { Packages } from "@/components/proposal/Packages";
import { Process } from "@/components/proposal/Process";
import { Samples } from "@/components/proposal/Samples";
import { Scan } from "@/components/proposal/Scan";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale } from "@/lib/i18n";
import { SITE } from "@/lib/site";

/**
 * Grammar: tailored proposal. The page is a proposal written to the visitor's
 * kind of business; picking one in the bar or the hero regrades every act.
 * Plan: docs/SCROLL-SCORE.md.
 */
export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "WASMA وسمة",
    description: t.meta.description,
    url: `${SITE.url}/${lang}`,
    email: SITE.email,
    telephone: `+${SITE.whatsapp}`,
    areaServed: "LY",
    address: { "@type": "PostalAddress", addressCountry: "LY" },
    knowsLanguage: ["ar", "en"],
  };

  return (
    <>
      <a href="#main" className="skip-link">{t.skip}</a>
      <BusinessProvider>
        <Nav lang={lang} t={t.nav} dict={t} />
        <SelectionProvider>
          <main id="main">
            <Hero lang={lang} t={t} />
            <Friction t={t} />
            <Scan lang={lang} t={t} />
            <Packages lang={lang} t={t} />
            <Samples lang={lang} t={t} />
            <Process t={t.process} />
            <Contact lang={lang} dict={t} />
          </main>
        </SelectionProvider>
      </BusinessProvider>
      <Footer lang={lang} t={t} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
