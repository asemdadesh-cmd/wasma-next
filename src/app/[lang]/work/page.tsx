import { redirect } from "next/navigation";

export default async function WorkIndex({ params }: PageProps<"/[lang]/work">) {
  const { lang } = await params;
  redirect(`/${lang}#work`);
}
