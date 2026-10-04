import { notFound } from "next/navigation";
import { ConceptShell } from "@/components/concepts/ConceptShell";
import { NoteSite } from "@/components/concepts/NoteSite";
import { conceptMetadata, conceptParams } from "@/lib/concept-meta";
import { hasLocale } from "@/lib/i18n";
import { getPhotos } from "@/lib/photos";

export const generateStaticParams = conceptParams;
export const generateMetadata = ({ params }: PageProps<"/[lang]/work/note">) => conceptMetadata(params, "note");

export default async function Page({ params }: PageProps<"/[lang]/work/note">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const photos = getPhotos();
  return (
    <ConceptShell lang={lang} slug="note">
      <NoteSite lang={lang} photos={photos} />
    </ConceptShell>
  );
}
