import { NotFoundBody } from "@/components/site/NotFoundBody";
import ar from "@/lib/dictionaries/ar";
import en from "@/lib/dictionaries/en";

export default function NotFound() {
  return (
    <NotFoundBody
      copy={{
        ar: { nav: ar.nav, notFound: ar.notFound },
        en: { nav: en.nav, notFound: en.notFound },
      }}
    />
  );
}
