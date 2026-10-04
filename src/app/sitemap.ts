import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { projects } from "@/lib/projects";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", ...projects.map((p) => `/work/${p.slug}`)];
  return paths.flatMap((p) =>
    locales.map((lang) => ({
      url: `${SITE.url}/${lang}${p}`,
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : 0.7,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${SITE.url}/${l}${p}`])) },
    })),
  );
}
