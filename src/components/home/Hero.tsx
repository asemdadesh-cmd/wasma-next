"use client";

import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { MARK_VIEWBOX, SQUARE, STROKE_A, STROKE_B } from "@/components/brand/Mark";
import { MINIS } from "@/components/mini/Minis";
import { MovingScene } from "@/components/scenes/MovingScene";
import { useIsDesktop } from "@/hooks/useMedia";
import { useVerifyState } from "@/hooks/useVerifyState";
import type { Dict } from "@/lib/dictionaries/ar";
import type { Locale } from "@/lib/i18n";
import { projects } from "@/lib/projects";
import { useSelection } from "./Selection";

type Props = { lang: Locale; t: Dict["hero"]; nav: Dict["nav"]; surfacePhoto: boolean };

const SPRING = { stiffness: 260, damping: 42, mass: 0.35 };
const DESKTOP = { w: 0.72, h: 0.8 }; // viewfinder size as a fraction of the mark's width
const SQ = SQUARE.size / MARK_VIEWBOX.w;
const useIso = typeof window === "undefined" ? useEffect : useLayoutEffect;
const ease = (v: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, v)), 3);

type Inset = { t: number; r: number; b: number; l: number };

/** A clip-path that starts on the square's rectangle (closed) and opens to the full panel. */
function useClip(open: MotionValue<number>, inset: Inset) {
  return useTransform(open, (v) => {
    const k = 1 - ease(v);
    return `inset(${(inset.t * k).toFixed(2)}% ${(inset.r * k).toFixed(2)}% ${(inset.b * k).toFixed(2)}% ${(inset.l * k).toFixed(2)}%)`;
  });
}

function Viewfinder({ lang, t, open, clip, className, style }: { lang: Locale; t: Dict["hero"]; open: MotionValue<number>; clip: MotionValue<string>; className: string; style?: React.CSSProperties }) {
  const { active, setActive } = useSelection();
  const veil = useTransform(open, [0.1, 0.55], [1, 0]);
  const [usable, setUsable] = useState(open.get() > 0.85);
  useMotionValueEvent(open, "change", (v) => setUsable(v > 0.85));
  const Mini = MINIS[active];
  return (
    <motion.div className={className} style={{ ...style, clipPath: clip }} inert={!usable} dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="flex h-full flex-col bg-ink shadow-[0_30px_60px_-30px_rgba(11,13,12,.55)]">
        <div className="flex items-center justify-between gap-3 px-3 py-2 text-paper">
          <span className="flex shrink-0 items-center gap-2 text-xs font-medium">
            <span className="size-2 bg-lime" aria-hidden="true" />
            <span className="hidden sm:inline">{t.viewfinder}</span>
          </span>
          <div className="rail flex gap-0.5 overflow-x-auto" role="group" aria-label={t.viewfinderHint}>
            {projects.map((p) => (
              <button
                key={p.slug}
                type="button"
                aria-pressed={active === p.slug}
                onClick={() => setActive(p.slug)}
                className={`min-h-9 shrink-0 px-2 text-[0.72rem] font-semibold transition-colors ${active === p.slug ? "bg-lime text-ink" : "text-paper/75 hover:text-paper"}`}
              >
                {p.name[lang]}
              </button>
            ))}
          </div>
        </div>
        <div className="relative min-h-0 flex-1 overflow-hidden">
          <Mini lang={lang} compact />
        </div>
      </div>
      <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-lime" style={{ opacity: veil }} />
    </motion.div>
  );
}

function Copy({ lang, t, nav, className = "" }: { lang: Locale; t: Dict["hero"]; nav: Dict["nav"]; className?: string }) {
  return (
    <div className={className}>
      <p className="text-sm font-medium text-mute sm:text-base">{t.kicker}</p>
      <h1
        id="hero-title"
        className={`display mt-4 text-[clamp(2.9rem,13vw,4.6rem)] sm:mt-5 sm:text-[clamp(4rem,9vw,6.2rem)] [@media(max-height:700px)]:text-[clamp(2.5rem,11vw,3.6rem)] ${lang === "ar" ? "lg:text-[clamp(4.4rem,6.6vw,7.4rem)]" : "lg:text-[clamp(3.8rem,5.1vw,6.2rem)]"}`}
      >
        <span className="block">{t.title[0]}</span>
        <span className="block">{t.title[1]}</span>
      </h1>
      <p className="pretty mt-5 max-w-[34ch] text-lg leading-relaxed text-mute sm:mt-6 sm:text-xl">{t.sub}</p>
      <div className="mt-7 flex flex-wrap items-center gap-3 sm:mt-8">
        <Link href={`/${lang}#work`} className="btn btn-ink">
          <span className="btn-square" aria-hidden="true" />
          {t.primary}
        </Link>
        <Link href={`/${lang}#contact`} className="btn btn-line">
          {nav.contact}
        </Link>
      </div>
    </div>
  );
}

/* Desktop: copy beside the mark; the square opens into a window over the strokes. */
function HeroDesktop({ lang, t, nav, surfacePhoto }: Props) {
  const ref = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, SPRING);
  useVerifyState(stage, p);
  const open = useTransform(p, [0.04, 0.55], [0, 1]);
  const markY = useTransform(p, [0, 1], [0, -70]);
  const strokesX = useTransform(p, [0, 1], [0, -26]);
  const panelY = useTransform(p, [0, 1], [0, -24]);
  const copyY = useTransform(p, [0, 1], [0, -48]);
  const clip = useClip(open, { t: 0, r: 0, b: (1 - SQ / DESKTOP.h) * 100, l: (1 - SQ / DESKTOP.w) * 100 });

  // Pointer depth on fine pointers: additive, nothing depends on it.
  const px = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 120, damping: 20 });
  const markPX = useTransform(sx, (v) => v * 12);
  const markRot = useTransform(sx, (v) => v * 0.5);
  const panelPX = useTransform(sx, (v) => v * -18);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => px.set(e.clientX / window.innerWidth - 0.5);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [px]);

  return (
    <section ref={ref} id="top" aria-labelledby="hero-title" className="relative h-[185vh]" data-sc-act="pin">
      <div ref={stage} className="sticky top-0 grid h-svh overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 -z-10 rtl:-scale-x-100">
          <MovingScene name="studio-surface" progress={p} photo={surfacePhoto} alt="" travel={90} priority />
        </div>
        <div className="wrap grid h-full grid-cols-12 items-center gap-6 pt-[var(--nav-h)]">
          <motion.div className="relative z-10 col-span-6" style={{ y: copyY }}>
            <Copy lang={lang} t={t} nav={nav} />
          </motion.div>
          <div className="relative col-span-6 ps-6">
            <motion.div className="relative w-full" style={{ y: markY, x: markPX, rotate: markRot }} dir="ltr">
              <div className="grid-lines pointer-events-none absolute -inset-6 opacity-60 [mask-image:radial-gradient(closest-side,black,transparent)]" aria-hidden="true" />
              <div className="relative" style={{ paddingBottom: `${DESKTOP.h * 100}%` }}>
                <motion.svg viewBox={`0 0 ${MARK_VIEWBOX.w} ${MARK_VIEWBOX.h}`} className="absolute inset-x-0 top-0 h-auto w-full" style={{ x: strokesX }} role="img" aria-label="WASMA">
                  <path d={STROKE_A} className="fill-ink" />
                  <path d={STROKE_B} className="fill-ink" />
                </motion.svg>
                <motion.div className="absolute inset-0" style={{ y: panelY, x: panelPX }}>
                  <Viewfinder
                    lang={lang}
                    t={t}
                    open={open}
                    clip={clip}
                    className="absolute right-0 top-0"
                    style={{ width: `${DESKTOP.w * 100}%`, aspectRatio: `${DESKTOP.w} / ${DESKTOP.h}` }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/*
 * Phone: its own choreography, not a shrunk desktop. The headline lifts away,
 * the two strokes part to either side, and the lime square grows until the
 * live interface fills the screen. Native scroll drives it (sticky, no hijack).
 */
function HeroPhone({ lang, t, nav, surfacePhoto }: Props) {
  const ref = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const square = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // Touch already has native momentum: keep the spring tight so it never feels floaty.
  const p = useSpring(scrollYProgress, { stiffness: 340, damping: 44, mass: 0.3 });
  useVerifyState(stage, p);

  const copyY = useTransform(p, [0, 0.5], ["0%", "-38%"]);
  const copyO = useTransform(p, [0.04, 0.3], [1, 0]);
  const aX = useTransform(p, [0.05, 0.6], ["0%", "-62%"]);
  const bX = useTransform(p, [0.05, 0.6], ["0%", "48%"]);
  const aR = useTransform(p, [0.05, 0.6], [0, -8]);
  const bR = useTransform(p, [0.05, 0.6], [0, 6]);
  const strokesO = useTransform(p, [0.4, 0.62], [1, 0]);
  const open = useTransform(p, [0.12, 0.66], [0, 1]);

  // The clip starts on the measured square and ends on the full panel.
  const [inset, setInset] = useState<Inset>({ t: 70, r: 0, b: 10, l: 80 });
  useIso(() => {
    const measure = () => {
      const a = panel.current?.getBoundingClientRect();
      const s = square.current?.getBoundingClientRect();
      if (!a || !s || !a.width || !a.height) return;
      setInset({
        t: ((s.top - a.top) / a.height) * 100,
        r: ((a.right - s.right) / a.width) * 100,
        b: ((a.bottom - s.bottom) / a.height) * 100,
        l: ((s.left - a.left) / a.width) * 100,
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (stage.current) ro.observe(stage.current);
    return () => ro.disconnect();
  }, []);
  const clip = useClip(open, inset);

  return (
    <section ref={ref} id="top" aria-labelledby="hero-title" className="relative h-[190vh]" data-sc-act="pin">
      <div ref={stage} className="sticky top-0 h-svh overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 -z-10 rtl:-scale-x-100">
          <MovingScene name="studio-surface" progress={p} photo={surfacePhoto} alt="" travel={70} priority />
        </div>
        <motion.div className="wrap relative z-10 pt-[calc(var(--nav-h)+1.25rem)]" style={{ y: copyY, opacity: copyO }}>
          <Copy lang={lang} t={t} nav={nav} />
        </motion.div>

        {/* The mark sits low in the opening frame. The strokes move; the square stays put. */}
        <div className="absolute inset-x-[var(--gutter)] bottom-[max(1.25rem,4svh)]" dir="ltr">
          <div className="relative w-full" style={{ aspectRatio: `${MARK_VIEWBOX.w} / ${MARK_VIEWBOX.h}` }}>
            <motion.svg
              viewBox={`0 0 ${MARK_VIEWBOX.w} ${MARK_VIEWBOX.h}`}
              className="absolute inset-0 h-full w-full"
              style={{ x: aX, rotate: aR, opacity: strokesO, transformOrigin: "20% 100%" }}
              role="img"
              aria-label="WASMA"
            >
              <path d={STROKE_A} className="fill-ink" />
            </motion.svg>
            <motion.svg viewBox={`0 0 ${MARK_VIEWBOX.w} ${MARK_VIEWBOX.h}`} className="absolute inset-0 h-full w-full" style={{ x: bX, rotate: bR, opacity: strokesO, transformOrigin: "60% 100%" }} aria-hidden="true">
              <path d={STROKE_B} className="fill-ink" />
            </motion.svg>
            <span ref={square} aria-hidden="true" className="absolute top-0 bg-lime" style={{ left: `${(SQUARE.x / MARK_VIEWBOX.w) * 100}%`, width: `${SQ * 100}%`, aspectRatio: "1" }} />
          </div>
        </div>

        <div ref={panel} className="absolute inset-x-[var(--gutter)] bottom-4 top-[calc(var(--nav-h)+0.75rem)] z-20" dir="ltr">
          <Viewfinder lang={lang} t={t} open={open} clip={clip} className="absolute inset-0" />
        </div>
      </div>
    </section>
  );
}

/* Reduced motion: the complete composition, open, with no pinned travel. */
function HeroStill({ lang, t, nav, surfacePhoto }: Props) {
  const one = useMotionValue(1);
  const clip = useTransform(one, () => "inset(0% 0% 0% 0%)");
  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden" data-sc-act="flow">
      <div aria-hidden="true" className="absolute inset-0 -z-10 rtl:-scale-x-100">
        <MovingScene name="studio-surface" progress={one} photo={surfacePhoto} alt="" travel={0} />
      </div>
      <div className="wrap grid items-center gap-10 pb-14 pt-[calc(var(--nav-h)+2.5rem)] lg:min-h-svh lg:grid-cols-12">
        <Copy lang={lang} t={t} nav={nav} className="lg:col-span-6" />
        <div className="relative lg:col-span-6" dir="ltr">
          <svg viewBox={`0 0 ${MARK_VIEWBOX.w} ${MARK_VIEWBOX.h}`} className="mb-4 h-auto w-1/2" role="img" aria-label="WASMA">
            <path d={STROKE_A} className="fill-ink" />
            <path d={STROKE_B} className="fill-ink" />
            <rect x={SQUARE.x} y={SQUARE.y} width={SQUARE.size} height={SQUARE.size} className="fill-lime" />
          </svg>
          <div className="relative h-[min(34rem,120vw)]">
            <Viewfinder lang={lang} t={t} open={one} clip={clip} className="absolute inset-0" />
          </div>
        </div>
      </div>
    </section>
  );
}

const noop = () => () => {};

/**
 * The server cannot know the screen, so it renders all three compositions and
 * CSS shows the right one on first paint. After hydration only the matching
 * one stays mounted (keyed, so it is not remounted).
 */
export function Hero(props: Props) {
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  const reduced = useReducedMotion();
  const desktop = useIsDesktop();
  const show = { d: !hydrated || (!reduced && desktop), p: !hydrated || (!reduced && !desktop), s: !hydrated || !!reduced };
  return (
    <>
      {show.d && (
        <div key="d" className="hidden lg:block motion-reduce:!hidden">
          <HeroDesktop {...props} />
        </div>
      )}
      {show.p && (
        <div key="p" className="lg:hidden motion-reduce:hidden">
          <HeroPhone {...props} />
        </div>
      )}
      {show.s && (
        <div key="s" className="hidden motion-reduce:block">
          <HeroStill {...props} />
        </div>
      )}
    </>
  );
}
