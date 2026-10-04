import { notFound } from "next/navigation";
import { ConceptShell } from "@/components/concepts/ConceptShell";
import { SahraSite } from "@/components/concepts/SahraSite";
import { conceptMetadata, conceptParams } from "@/lib/concept-meta";
import { hasLocale } from "@/lib/i18n";
import { getPhotos } from "@/lib/photos";

export const generateStaticParams = conceptParams;
export const generateMetadata = ({ params }: PageProps<"/[lang]/work/sahra">) => conceptMetadata(params, "sahra");

export default async function Page({ params }: PageProps<"/[lang]/work/sahra">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const photos = getPhotos();
  return (
    <ConceptShell lang={lang} slug="sahra">
      <SahraSite lang={lang} photos={photos} />
    </ConceptShell>
  );
}
