"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { MINIS } from "@/components/mini/Minis";
import { useIsDesktop } from "@/hooks/useMedia";
import type { Dict } from "@/lib/dictionaries/ar";
import type { Locale } from "@/lib/i18n";
import { projects, type Project, type ProjectSlug } from "@/lib/projects";
import { useSelection } from "./Selection";

type Props = { lang: Locale; t: Dict["work"] };

/** Each concept's name is set in that concept's own type voice. */
const VOICE: Record<ProjectSlug, React.CSSProperties & { className: string }> = {
  sahra: { className: "font-normal", fontFamily: 'ui-serif, "Iowan Old Style", "Noto Naskh Arabic", Georgia, serif', letterSpacing: "0.18em" },
  nura: { className: "font-bold uppercase", fontStretch: "125%", letterSpacing: "0.08em" },
  note: { className: "italic font-normal", fontFamily: 'ui-serif, "Iowan Old Style", "Noto Naskh Arabic", Georgia, serif' },
  madar: { className: "font-bold", fontStretch: "70%" },
  sanad: { className: "font-medium", fontFamily: "var(--font-readex), var(--font-archivo), sans-serif" },
};

function ConceptName({ p, lang, as: Tag = "h3", size, id }: { p: Project; lang: Locale; as?: "h3" | "span"; size: string; id?: string }) {
  const { className, ...style } = VOICE[p.slug];
  return (
    <Tag id={id} className={`${size} ${className} leading-none`} style={lang === "ar" ? { ...style, letterSpacing: 0 } : style}>
      {p.name[lang]}
    </Tag>
  );
}

function Palette({ colors }: { colors: string[] }) {
  return (
    <span className="flex h-3 w-36" aria-hidden="true">
      {colors.map((c) => (
        <span key={c} className="flex-1" style={{ background: c }} />
      ))}
    </span>
  );
}

function ChapterInfo({ p, lang, t, index }: { p: Project; lang: Locale; t: Props["t"]; index: number }) {
  const { setLiked } = useSelection();
  return (
    <div>
      <div className="flex items-center gap-4 text-sm text-mute">
        <span className="tabular font-semibold text-ink">{String(index + 1).padStart(2, "0")}</span>
        <span>{p.kind[lang]}</span>
        <span className="h-px flex-1 bg-line" aria-hidden="true" />
        <span className="text-xs">{t.fictional}</span>
      </div>
      <ConceptName p={p} lang={lang} id={`name-${p.slug}`} size="mt-6 text-[clamp(3rem,7vw,5.6rem)]" />
      <p className="pretty mt-6 max-w-[44ch] text-lg leading-relaxed">{p.pitch[lang]}</p>
      <dl className="mt-8 grid max-w-[44ch] gap-4 border-t border-line pt-5 text-[0.95rem]">
        <div className="grid grid-cols-[7rem_1fr] gap-4">
          <dt className="text-mute">{t.builtWith}</dt>
          <dd>{p.features[lang].join(lang === "ar" ? "، " : ", ")}</dd>
        </div>
        <div className="grid grid-cols-[7rem_1fr] gap-4">
          <dt className="text-mute">{t.motion}</dt>
          <dd>{p.motion[lang]}</dd>
        </div>
        <div className="grid grid-cols-[7rem_1fr] items-center gap-4">
          <dt className="text-mute">{lang === "ar" ? "الألوان" : "Palette"}</dt>
          <dd>
            <Palette colors={p.palette} />
          </dd>
        </div>
      </dl>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={`/${lang}/work/${p.slug}`} className="btn btn-ink">
          <span className="btn-square" aria-hidden="true" />
          {t.open}
        </Link>
        <a
          href="#contact"
          onClick={() => setLiked(p.slug)}
          className="btn btn-line"
        >
          {t.like}
        </a>
      </div>
    </div>
  );
}

function Stage({ lang, t }: Props) {
  const { active, setActive } = useSelection();
  const reduced = useReducedMotion();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const Mini = MINIS[active];
  const idx = projects.findIndex((p) => p.slug === active);

  const go = (slug: ProjectSlug, focus = false) => {
    setActive(slug);
    const el = document.getElementById(`chapter-${slug}`);
    el?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    if (focus) tabs.current[projects.findIndex((p) => p.slug === slug)]?.focus();
  };

  const onKey = (e: React.KeyboardEvent) => {
    const rtl = lang === "ar";
    const next = e.key === (rtl ? "ArrowLeft" : "ArrowRight");
    const prev = e.key === (rtl ? "ArrowRight" : "ArrowLeft");
    if (!next && !prev && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    const n = projects.length;
    const to = e.key === "Home" ? 0 : e.key === "End" ? n - 1 : (idx + (next ? 1 : -1) + n) % n;
    go(projects[to].slug, true);
  };

  return (
    <div className="flex h-full flex-col">
      <div role="tablist" aria-label={t.tablist} className="flex border-b border-ink" onKeyDown={onKey}>
        {projects.map((p, i) => (
          <button
            key={p.slug}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            role="tab"
            id={`tab-${p.slug}`}
            aria-selected={active === p.slug}
            aria-controls="work-stage"
            tabIndex={active === p.slug ? 0 : -1}
            onClick={() => go(p.slug)}
            className={`relative min-h-12 flex-1 px-2 text-sm font-semibold transition-colors ${active === p.slug ? "bg-ink text-paper" : "hover:bg-paper-2"}`}
          >
            {p.name[lang]}
            {active === p.slug && <span className="absolute end-1.5 top-1.5 size-1.5 bg-lime" aria-hidden="true" />}
          </button>
        ))}
      </div>
      <div
        id="work-stage"
        role="tabpanel"
        aria-labelledby={`tab-${active}`}
        className="relative min-h-0 flex-1 overflow-hidden border-x border-b border-ink"
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={active}
            className="absolute inset-0"
            initial={reduced ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, transition: { duration: reduced ? 0.01 : 0.25, delay: reduced ? 0 : 0.2 } }}
            transition={{ duration: reduced ? 0.01 : 0.45, ease: [0.23, 1, 0.32, 1] }}
          >
            <Mini lang={lang} />
          </motion.div>
        </AnimatePresence>
        {/* The lime square marks the viewfinder corner. */}
        <span className="pointer-events-none absolute end-0 top-0 z-10 size-5 bg-lime" aria-hidden="true" />
      </div>
      <div className="flex items-center justify-between gap-3 pt-3 text-sm">
        <span className="text-mute">{t.stage} · {t.fictional}</span>
        <Link href={`/${lang}/work/${active}`} className="font-semibold">
          <span className="link-u">{t.open}</span>
        </Link>
      </div>
    </div>
  );
}

export function WorkGallery({ lang, t }: Props) {
  const desktop = useIsDesktop();
  const { active, setActive } = useSelection();

  // On desktop the chapter crossing the middle of the viewport drives the stage.
  useEffect(() => {
    if (!desktop) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.getAttribute("data-slug") as ProjectSlug);
        });
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    document.querySelectorAll("[data-chapter]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [desktop, setActive]);

  return (
    <section id="work" aria-labelledby="work-title" className="relative border-t border-line bg-paper py-[var(--section)]" data-sc-act={desktop ? "pin" : "flow"}>
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-12">
          <h2 id="work-title" className="display text-[clamp(2.6rem,6.4vw,6rem)] lg:col-span-8">
            {t.title}
          </h2>
          <p className="pretty max-w-[46ch] self-end text-lg leading-relaxed text-mute lg:col-span-4">{t.intro}</p>
        </div>

        {desktop ? (
          <div className="mt-[clamp(3rem,6vw,6rem)] grid grid-cols-12 gap-10">
            <div className="col-span-5 pb-[22vh]">
              {projects.map((p, i) => (
                <article
                  key={p.slug}
                  id={`chapter-${p.slug}`}
                  data-chapter
                  data-slug={p.slug}
                  aria-labelledby={`name-${p.slug}`}
                  className="flex min-h-[82vh] items-center border-t border-line py-16 first:border-t-0 first:pt-0"
                >
                  <div className="w-full">
                    <ChapterInfo p={p} lang={lang} t={t} index={i} />
                  </div>
                </article>
              ))}
            </div>
            <div className="col-span-7">
              <div data-sc-verify-state={active} className="sticky top-[calc(var(--nav-h)+1.5rem)] h-[calc(100svh-var(--nav-h)-3rem)] max-h-[52rem] min-h-[34rem]">
                <Stage lang={lang} t={t} />
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-12">
            {projects.map((p, i) => {
              const Mini = MINIS[p.slug];
              return (
                <article key={p.slug} id={`chapter-${p.slug}`} aria-labelledby={`name-${p.slug}`} className="border-t border-line py-12">
                  <div>
                    <ChapterInfo p={p} lang={lang} t={t} index={i} />
                  </div>
                  <div className="relative mt-8 h-[min(34rem,125vw)] overflow-hidden border border-ink">
                    <Mini lang={lang} />
                    <span className="pointer-events-none absolute end-0 top-0 size-4 bg-lime" aria-hidden="true" />
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
