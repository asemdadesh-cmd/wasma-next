"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mark } from "@/components/brand/Mark";
import type { Dict } from "@/lib/dictionaries/ar";
import { hasLocale, type Locale } from "@/lib/i18n";
import { Nav } from "./Nav";

type Copy = { nav: Dict["nav"]; notFound: Dict["notFound"] };

/** not-found.tsx receives no params, so the locale is read from the path. */
export function NotFoundBody({ copy }: { copy: Record<Locale, Copy> }) {
  const seg = (usePathname() ?? "").split("/")[1] ?? "";
  const lang: Locale = hasLocale(seg) ? seg : "ar";
  const t = copy[lang];
  return (
    <div lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
      <Nav lang={lang} t={t.nav} />
      <main id="main" className="grain flex min-h-svh items-center pt-[var(--nav-h)]">
        <div className="wrap grid items-center gap-12 py-20 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="tabular text-sm font-semibold text-mute">404</p>
            <h1 className="display mt-4 text-[clamp(2.8rem,7vw,6rem)]">{t.notFound.title}</h1>
            <p className="pretty mt-6 max-w-[42ch] text-lg leading-relaxed text-mute">{t.notFound.text}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href={`/${lang}`} className="btn btn-ink">
                <span className="btn-square" aria-hidden="true" />
                {t.notFound.home}
              </Link>
              <Link href={`/${lang}#work`} className="btn btn-line">
                {t.notFound.work}
              </Link>
            </div>
          </div>
          {/* The square has drifted outside the frame of the mark. */}
          <div className="relative lg:col-span-5" dir="ltr" aria-hidden="true">
            <div className="grid-lines relative aspect-square border border-line">
              <Mark hideSquare className="absolute left-[12%] top-[34%] w-[62%]" />
              <span className="absolute bottom-[8%] right-[6%] size-[10%] bg-lime" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
