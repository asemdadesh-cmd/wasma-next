"use client";

/**
 * Act 5, curiosity. Lateral travel reads as "options": the five working concepts
 * pan past while the page scrolls. The visitor's own kind leads the rail.
 * Phones and reduced motion get a native swipe rail with snap points instead.
 */
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useIsDesktop, useReduced } from "@/hooks/useMedia";
import type { Dict } from "@/lib/dictionaries/ar";
import type { Locale } from "@/lib/i18n";
import { projects, type ProjectSlug } from "@/lib/projects";
import type { PhotoKey } from "@/lib/unsplash";
import { useBusiness } from "./Business";
import { Photo } from "./Photo";

const SAMPLE_PHOTO: Record<ProjectSlug, PhotoKey> = { note: "latte", sanad: "clinic", nura: "shop", sahra: "courtyard", madar: "arch" };
const SAMPLE_ALT: Record<ProjectSlug, { ar: string; en: string }> = {
  note: { ar: "فنجان قهوة على طاولة بيضاء في الشمس", en: "A cup of coffee on a white table in the sun" },
  sanad: { ar: "غرفة علاج أسنان نظيفة ومضيئة", en: "A bright, clean dental treatment room" },
  nura: { ar: "رفوف محل صغير بإضاءة دافئة", en: "Shelves of a small shop in warm light" },
  sahra: { ar: "فناء بأقواس بيضاء ونافورة", en: "A courtyard with white arches and a fountain" },
  madar: { ar: "قوس ماركوس أوريليوس في طرابلس ومئذنة جامع قرجي خلفه", en: "The Arch of Marcus Aurelius in Tripoli, with the Gurgi Mosque minaret behind" },
};

export function Samples({ lang, t }: { lang: Locale; t: Dict }) {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const reduce = useReduced();
  const desktop = useIsDesktop();
  const pinned = desktop && !reduce;
  const biz = useBusiness();
  const ordered = [...projects].sort((a, b) => (a.slug === biz.demo ? -1 : b.slug === biz.demo ? 1 : 0));

  const [distance, setDistance] = useState(0);
  useEffect(() => {
    if (!pinned) return;
    const measure = () => {
      const el = track.current;
      if (el) setDistance(Math.max(0, el.scrollWidth - el.clientWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [pinned]);

  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const sign = lang === "ar" ? 1 : -1;
  const x = useTransform(p, [0.05, 0.95], [0, sign * distance]);

  const header = (
    <div className="wrap grid gap-6 lg:grid-cols-12">
      <h2 id="samples-title" className="display text-[clamp(2.3rem,4.6vw,4.4rem)] lg:col-span-7">
        {t.samples.title}
      </h2>
      <p className="pretty max-w-[46ch] text-lg leading-relaxed text-paper/80 lg:col-span-5 lg:self-end">{t.samples.intro}</p>
    </div>
  );

  const items = ordered.map((p) => {
    const mine = p.slug === biz.demo;
    return (
      <li key={p.slug} id={`sample-${p.slug}`} className="w-[min(82vw,22rem)] shrink-0 snap-start lg:w-[clamp(22rem,30vw,30rem)]">
        <Link href={`/${lang}/work/${p.slug}`} className="group block">
          <div className="relative aspect-[4/3] overflow-hidden bg-ink-3">
            <Photo photo={SAMPLE_PHOTO[p.slug]} alt={SAMPLE_ALT[p.slug][lang]} sizes="(min-width: 1024px) 30vw, 82vw" className="transition-transform duration-700 ease-[var(--ease-out-quint)] group-hover:scale-[1.03]" />
            <div className="absolute inset-x-0 bottom-0 flex h-1.5" aria-hidden="true">
              {p.palette.map((c) => (
                <span key={c} className="flex-1" style={{ background: c }} />
              ))}
            </div>
          </div>
          <div className="mt-5 flex items-baseline justify-between gap-4">
            <h3 className="text-[1.6rem] font-semibold">{p.name[lang]}</h3>
            <span className="text-sm text-mute-dark">{p.kind[lang]}</span>
          </div>
          <p className="pretty mt-2 text-[1rem] leading-relaxed text-paper/75">{p.pitch[lang]}</p>
          <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <span className="inline-flex min-h-11 items-center font-semibold">
              <span className="link-u">{t.samples.open}</span>
            </span>
            {mine && (
              <span className="inline-flex items-center gap-2 text-paper">
                <span aria-hidden="true" className="size-2 bg-lime" />
                {t.samples.yours}
              </span>
            )}
            <span className="text-mute-dark">{t.samples.fictional}</span>
          </p>
        </Link>
      </li>
    );
  });

  if (pinned) {
    return (
      <section ref={ref} id="samples" aria-labelledby="samples-title" className="on-ink relative bg-ink text-paper" style={{ height: "220vh" }} data-sc-act="pan">
        <div className="sticky top-0 flex h-[100svh] flex-col justify-center gap-[clamp(2rem,5vh,4rem)] overflow-hidden pt-[var(--nav-h)]">
          {header}
          <div className="wrap overflow-visible">
            <motion.ul ref={track} style={{ x }} className="flex gap-[clamp(1.5rem,3vw,3rem)]">
              {items}
            </motion.ul>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} id="samples" aria-labelledby="samples-title" className="on-ink relative bg-ink py-[var(--section)] text-paper" data-sc-act="pan">
      {header}
      <ul ref={track} tabIndex={0} aria-label={t.samples.title} className="rail mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[var(--gutter)] pb-6 scroll-px-[var(--gutter)]">
        {items}
      </ul>
    </section>
  );
}
