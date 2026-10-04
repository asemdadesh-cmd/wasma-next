import { notFound } from "next/navigation";
import { ConceptShell } from "@/components/concepts/ConceptShell";
import { SanadSite } from "@/components/concepts/SanadSite";
import { conceptMetadata, conceptParams } from "@/lib/concept-meta";
import { hasLocale } from "@/lib/i18n";
import { getPhotos } from "@/lib/photos";

export const generateStaticParams = conceptParams;
export const generateMetadata = ({ params }: PageProps<"/[lang]/work/sanad">) => conceptMetadata(params, "sanad");

export default async function Page({ params }: PageProps<"/[lang]/work/sanad">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const photos = getPhotos();
  return (
    <ConceptShell lang={lang} slug="sanad">
      <SanadSite lang={lang} photos={photos} />
    </ConceptShell>
  );
}
