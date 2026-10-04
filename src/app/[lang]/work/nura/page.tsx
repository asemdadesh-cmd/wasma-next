import { notFound } from "next/navigation";
import { ConceptShell } from "@/components/concepts/ConceptShell";
import { NuraSite } from "@/components/concepts/NuraSite";
import { conceptMetadata, conceptParams } from "@/lib/concept-meta";
import { hasLocale } from "@/lib/i18n";
import { getPhotos } from "@/lib/photos";

export const generateStaticParams = conceptParams;
export const generateMetadata = ({ params }: PageProps<"/[lang]/work/nura">) => conceptMetadata(params, "nura");

export default async function Page({ params }: PageProps<"/[lang]/work/nura">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const photos = getPhotos();
  return (
    <ConceptShell lang={lang} slug="nura">
      <NuraSite lang={lang} photos={photos} />
    </ConceptShell>
  );
}
