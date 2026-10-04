import { notFound } from "next/navigation";
import { ConceptShell } from "@/components/concepts/ConceptShell";
import { MadarSite } from "@/components/concepts/MadarSite";
import { conceptMetadata, conceptParams } from "@/lib/concept-meta";
import { hasLocale } from "@/lib/i18n";
import { getPhotos } from "@/lib/photos";

export const generateStaticParams = conceptParams;
export const generateMetadata = ({ params }: PageProps<"/[lang]/work/madar">) => conceptMetadata(params, "madar");

export default async function Page({ params }: PageProps<"/[lang]/work/madar">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const photos = getPhotos();
  return (
    <ConceptShell lang={lang} slug="madar">
      <MadarSite lang={lang} photos={photos} />
    </ConceptShell>
  );
}
