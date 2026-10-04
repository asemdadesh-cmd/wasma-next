import { notFound } from "next/navigation";
import { Contact } from "@/components/home/Contact";
import { Hero } from "@/components/home/Hero";
import { Capabilities, Featured, Process, Reasons, Services, Statement } from "@/components/home/Sections";
import { SelectionProvider } from "@/components/home/Selection";
import { WorkGallery } from "@/components/home/WorkGallery";
import { Scene } from "@/components/scenes/Scene";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale } from "@/lib/i18n";
import { getPhotos } from "@/lib/photos";
import { SITE } from "@/lib/site";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);
  const photos = getPhotos();
  const ar = lang === "ar";

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
      <Nav lang={lang} t={t.nav} />
      <SelectionProvider>
        <main id="main">
          <Hero
            lang={lang}
            t={t.hero}
            nav={t.nav}
            surface={<Scene name="studio-surface" photo={photos["studio-surface"]} alt="" priority position={ar ? "left center" : "center"} />}
          />
          <WorkGallery lang={lang} t={t.work} />
          <Capabilities t={t.capabilities} />
          <Statement t={t.statement} lang={lang} />
          <Reasons t={t.reasons} lang={lang} />
          <Process t={t.process} />
          <Featured
            t={t.featured}
            lang={lang}
            scene={
              <Scene
                name="sahra-retreat"
                photo={photos["sahra-retreat"]}
                alt={ar ? "منتجع صحرا الخيالي: فناء حجري ومسبح أزرق والبحر خلف ستارة كتّان" : "The fictional SAHRA retreat: a limestone courtyard, a cobalt pool and the sea beyond a linen curtain"}
                position="56% 50%"
                idPrefix="featured-sahra"
              />
            }
          />
          <Services t={t.services} />
          <Contact lang={lang} t={t.contact} services={t.services.items} />
        </main>
      </SelectionProvider>
      <Footer lang={lang} t={t} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
