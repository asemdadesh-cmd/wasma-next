"use client";

import { MINIS } from "@/components/mini/Minis";
import type { Locale } from "@/lib/i18n";
import type { ProjectSlug } from "@/lib/projects";
import { Qr } from "./Qr";

/** A phone with a live concept inside. The screen is real HTML, never a picture. */
export function Phone({ slug, lang, live = true, inert, className = "", screen }: { slug: ProjectSlug; lang: Locale; live?: boolean; inert?: boolean; className?: string; screen?: React.ReactNode }) {
  const Mini = MINIS[slug];
  return (
    <div className={`relative aspect-[9/18.5] rounded-[2.4rem] bg-ink p-[0.55rem] shadow-[0_40px_80px_-30px_rgb(11_13_12/0.55),0_0_0_1px_rgb(244_241_232/0.08)_inset] ${className}`}>
      <div className="relative h-full overflow-hidden rounded-[1.9rem] bg-paper" inert={inert}>
        {live && (
          <div className="h-full overflow-hidden text-[0.86rem] [zoom:var(--mini-zoom,1)]" dir={lang === "ar" ? "rtl" : "ltr"}>
            <Mini lang={lang} compact />
          </div>
        )}
        {screen}
      </div>
      <span aria-hidden="true" className="absolute left-1/2 top-[1.05rem] h-[0.32rem] w-[22%] -translate-x-1/2 rounded-full bg-ink/80" />
    </div>
  );
}

/** A folded table card with a real QR code on it. */
export function TableTent({ slug, lang, title, caption, table, qrLabel, className = "" }: { slug: ProjectSlug; lang: Locale; title: string; caption: string; table: string; qrLabel: string; className?: string }) {
  return (
    <div className={`bg-paper p-[8%] text-ink shadow-[0_30px_60px_-28px_rgb(11_13_12/0.6)] ${className}`}>
      <div className="flex items-center justify-between gap-2 text-[0.7em]">
        <span className="font-semibold">{title}</span>
        <span className="tabular text-mute">{table}</span>
      </div>
      <Qr path={`/${lang}/work/${slug}`} label={qrLabel} className="mt-[8%] block aspect-square w-full" />
      <div className="mt-[8%] flex items-center gap-2 text-[0.8em] font-semibold">
        <span aria-hidden="true" className="size-[0.6em] shrink-0 bg-lime" />
        {caption}
      </div>
    </div>
  );
}
