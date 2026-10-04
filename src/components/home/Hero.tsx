"use client";

import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { STROKE_A, STROKE_B, MARK_VIEWBOX } from "@/components/brand/Mark";
import { MINIS } from "@/components/mini/Minis";
import { useIsDesktop } from "@/hooks/useMedia";
import { useVerifyState } from "@/hooks/useVerifyState";
import type { Dict } from "@/lib/dictionaries/ar";
import type { Locale } from "@/lib/i18n";
import { projects } from "@/lib/projects";
import { useSelection } from "./Selection";

type Props = { lang: Locale; t: Dict["hero"]; nav: Dict["nav"]; surface: React.ReactNode };

// Panel geometry relative to the mark's width (see Mark.tsx for the square).
// Desktop: a window over the strokes. Phone: a full-width band below them.
const GEOMETRY = { desktop: { w: 0.72, h: 0.8 }, phone: { w: 1, h: 1.42 } };
const SQ = 62 / MARK_VIEWBOX.w; // square size as a fraction of mark width

/** clip-path that starts exactly on the lime square (top-right) and opens to the full panel. */
function useOpening(p: MotionValue<number>, fx: number, fy: number) {
  return useTransform(p, (v) => {
    const k = Math.min(1, Math.max(0, v));
    const e = 1 - Math.pow(1 - k, 3);
    const bottom = (1 - fy) * (1 - e) * 100;
    const left = (1 - fx) * (1 - e) * 100;
    return `inset(0% 0% ${bottom.toFixed(2)}% ${left.toFixed(2)}%)`;
  });
}

function Viewfinder({ lang, t, open, geo, className = "" }: { lang: Locale; t: Dict["hero"]; open: MotionValue<number>; geo: { w: number; h: number }; className?: string }) {
  const { active, setActive } = useSelection();
  const PANEL_W = geo.w;
  const PANEL_H = geo.h;
  const clip = useOpening(open, SQ / PANEL_W, SQ / PANEL_H);
  const veil = useTransform(open, [0.1, 0.55], [1, 0]);
  const [usable, setUsable] = useState(open.get() > 0.85);
  useMotionValueEvent(open, "change", (v) => setUsable(v > 0.85));
  const Mini = MINIS[active];
  return (
    <motion.div
      className={`absolute right-0 top-0 ${className}`}
      style={{ width: `${PANEL_W * 100}%`, aspectRatio: `${PANEL_W} / ${PANEL_H}`, clipPath: clip }}
      // Keep the hidden interface out of the tab order until it has opened.
      inert={!usable}
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
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

export function Hero({ lang, t, nav, surface }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const desktop = useIsDesktop();
  const sticky = desktop && !reduced;
  const { scrollYProgress } = useScroll({ target: ref, offset: sticky ? ["start start", "end end"] : ["start start", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 220, damping: 40, mass: 0.4 });

  // Desktop: the square opens over the first 55% of the pinned travel.
  const openDesktop = useTransform(p, [0.04, 0.55], [0, 1]);
  const farY = useTransform(p, [0, 1], ["0%", "-4%"]);
  const farS = useTransform(p, [0, 1], [1.06, 1]);
  const markY = useTransform(p, [0, 1], [0, -70]);
  const strokesX = useTransform(p, [0, 1], [0, -26]);
  const panelY = useTransform(p, [0, 1], [0, -24]);
  const copyY = useTransform(p, [0, 1], [0, -48]);

  // Mobile: the viewfinder opens as it rises into view.
  const mRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: mProg } = useScroll({ target: mRef, offset: ["start 72%", "start 25%"] });
  const openMobile = useSpring(useTransform(mProg, [0, 1], [0, 1]), { stiffness: 200, damping: 36 });
  const one = useTransform(p, () => 1);

  // Pointer depth on fine pointers only. Additive: nothing depends on it.
  const px = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 120, damping: 20 });
  const markPX = useTransform(sx, (v) => v * 12);
  const markRot = useTransform(sx, (v) => v * 0.5);
  const panelPX = useTransform(sx, (v) => v * -18);
  useEffect(() => {
    if (!sticky || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => px.set(e.clientX / window.innerWidth - 0.5);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [sticky, px]);

  const open = reduced ? one : desktop ? openDesktop : openMobile;
  const geo = desktop ? GEOMETRY.desktop : GEOMETRY.phone;
  const stageRef = useRef<HTMLDivElement>(null);
  useVerifyState(stageRef, sticky ? p : open);

  return (
    <section
      ref={ref}
      id="top"
      aria-labelledby="hero-title"
      className={`relative ${sticky ? "h-[185vh]" : ""}`}
      data-sc-act={sticky ? "pin" : "flow"}
    >
      <div ref={stageRef} className={`${sticky ? "sticky top-0 h-svh" : "lg:min-h-svh"} relative grid overflow-hidden`}>
        {/* Far plane: plaster surface, smallest displacement */}
        <motion.div aria-hidden="true" className="absolute inset-0 -z-10 rtl:-scale-x-100" style={sticky ? { y: farY, scale: farS } : undefined}>
          {surface}
        </motion.div>

        <div className="wrap grid h-full items-center gap-10 pb-12 pt-[calc(var(--nav-h)+2.5rem)] lg:grid-cols-12 lg:gap-6 lg:pb-0 lg:pt-[var(--nav-h)]">
          {/* Copy plane */}
          <motion.div className="relative z-10 lg:col-span-6" style={sticky ? { y: copyY } : undefined}>
            <p className="text-sm font-medium text-mute sm:text-base">{t.kicker}</p>
            <h1 id="hero-title" className="display mt-5 text-[clamp(3.1rem,13vw,4.6rem)] sm:text-[clamp(4rem,9vw,6.2rem)] lg:text-[clamp(4.4rem,6.6vw,7.4rem)]">
              <span className="block">{t.title[0]}</span>
              <span className="block">{t.title[1]}</span>
            </h1>
            <p className="pretty mt-6 max-w-[34ch] text-lg leading-relaxed text-mute sm:text-xl">{t.sub}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href={`/${lang}#work`} className="btn btn-ink">
                <span className="btn-square" aria-hidden="true" />
                {t.primary}
              </Link>
              <Link href={`/${lang}#contact`} className="btn btn-line">
                {nav.contact}
              </Link>
            </div>
          </motion.div>

          {/* Focal plane: the exact mark. Near plane: the live viewfinder. */}
          <div className="relative lg:col-span-6 lg:ps-6" ref={mRef}>
            <motion.div
              className="relative mx-auto w-full max-w-[34rem] lg:max-w-none"
              style={sticky ? { y: markY, x: markPX, rotate: markRot } : undefined}
              dir="ltr"
            >
              <div className="grid-lines pointer-events-none absolute -inset-6 opacity-60 [mask-image:radial-gradient(closest-side,black,transparent)]" aria-hidden="true" />
              <div className="relative" style={{ paddingBottom: `${geo.h * 100}%` }}>
                <motion.svg
                  viewBox={`0 0 ${MARK_VIEWBOX.w} ${MARK_VIEWBOX.h}`}
                  className="absolute inset-x-0 top-0 h-auto w-full"
                  style={sticky ? { x: strokesX } : undefined}
                  role="img"
                  aria-label="WASMA"
                >
                  <path d={STROKE_A} className="fill-ink" />
                  <path d={STROKE_B} className="fill-ink" />
                </motion.svg>
                <motion.div className="absolute inset-0" style={sticky ? { y: panelY, x: panelPX } : undefined}>
                  <Viewfinder lang={lang} t={t} open={open} geo={geo} />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
