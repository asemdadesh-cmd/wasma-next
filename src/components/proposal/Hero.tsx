"use client";

/**
 * Act 1, recognition. Layer contract (far to near):
 *   far   the visitor's kind of place, an Unsplash photograph, slow drift and scale
 *   air   a short ink falloff at the photo's foot, so the near planes sit on something
 *   mid   a phone running the matching live concept
 *   near  a table card with a real QR code
 * Copy rides at 1x on paper beside the stack and never moves.
 */
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { useReduced } from "@/hooks/useMedia";
import type { Dict } from "@/lib/dictionaries/ar";
import type { Locale } from "@/lib/i18n";
import { BusinessChips, proposalHref, useBusiness } from "./Business";
import { Phone, TableTent } from "./Device";
import { Photo } from "./Photo";

const SPRING = { stiffness: 120, damping: 24, mass: 0.6 };

export function Hero({ lang, t }: { lang: Locale; t: Dict }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReduced();
  const biz = useBusiness();
  const copy = t.biz.items[biz.id];

  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const farY = useTransform(p, [0, 1], [0, 140]);
  const farS = useTransform(p, [0, 1], [1.06, 1.16]);
  const midY = useTransform(p, [0, 1], [0, -90]);
  const nearY = useTransform(p, [0, 1], [0, -190]);

  // Pointer depth on fine pointers: each plane leans by its distance.
  const mx = useSpring(useMotionValue(0), SPRING);
  const my = useSpring(useMotionValue(0), SPRING);
  useEffect(() => {
    if (reduce || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX / innerWidth - 0.5);
      my.set(e.clientY / innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, mx, my]);
  const farX = useTransform(mx, (v) => v * -14);
  const midX = useTransform(mx, (v) => v * 18);
  const nearX = useTransform(mx, (v) => v * 34);
  const midTilt = useTransform(my, (v) => v * 4);
  const nearTilt = useTransform(mx, (v) => -3 + v * 4);

  const still = !!reduce;
  const tent = biz.id === "cafe" ? t.scan.tent : t.scan.tentOther;

  return (
    <section ref={ref} id="top" aria-labelledby="hero-title" className="relative overflow-clip bg-paper pt-[var(--nav-h)]" data-sc-act="parallax">
      <div className="wrap grid gap-10 pb-16 pt-8 lg:min-h-[calc(100svh-var(--nav-h))] lg:grid-cols-12 lg:gap-6 lg:pb-10 lg:pt-4">
        <div className="relative z-10 flex flex-col justify-center lg:col-span-5 lg:pe-6">
          <p className="text-sm font-semibold">{t.hero.kicker}</p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={biz.id}
              initial={still ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={still ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }}
            >
              <h1 id="hero-title" className="display mt-5 text-[clamp(2.6rem,5.4vw,5.6rem)]">
                {copy.title}
              </h1>
              <p className="pretty mt-6 max-w-[40ch] text-[1.15rem] leading-relaxed text-ink/80">{copy.sub}</p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-9">
            <BusinessChips t={t.biz} />
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#scan" className="btn btn-ink">
              <span className="btn-square" aria-hidden="true" />
              {t.hero.scan}
            </a>
            <a href={proposalHref(t, biz.id)} target="_blank" rel="noopener noreferrer" className="btn btn-line">
              {t.hero.whatsapp}
            </a>
          </div>
        </div>

        {/* The stack. Decorative here: the same demo is operable in the scan act. */}
        <div className="relative lg:col-span-7" aria-hidden="true">
          <div className="relative -me-[var(--gutter)] h-[min(118vw,34rem)] overflow-hidden sm:h-[38rem] lg:absolute lg:inset-y-0 lg:end-0 lg:start-[8%] lg:h-auto">
            {/* far */}
            <motion.div style={still ? undefined : { y: farY, scale: farS, x: farX }} className="absolute inset-0 overflow-hidden bg-ink-3">
              <AnimatePresence initial={false}>
                <motion.div key={biz.photo} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: still ? 0 : 0.6 }}>
                  <Photo photo={biz.photo} alt="" sizes="(min-width: 1024px) 60vw, 100vw" preload />
                </motion.div>
              </AnimatePresence>
            </motion.div>
            {/* air */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/45 to-transparent" />
          </div>

          {/* mid */}
          <motion.div
            style={still ? undefined : { y: midY, x: midX, rotate: midTilt }}
            className="absolute bottom-[-2.5rem] start-[2%] z-10 w-[min(56vw,15rem)] [--mini-zoom:0.78] sm:w-[16rem] lg:[--mini-zoom:0.86] lg:bottom-[9%] lg:start-[-4%] lg:w-[clamp(14rem,18vw,18.5rem)]"
          >
            <Phone key={biz.demo} slug={biz.demo} lang={lang} inert />
          </motion.div>

          {/* near */}
          <motion.div
            style={still ? { rotate: -3 } : { y: nearY, x: nearX, rotate: nearTilt }}
            className="absolute bottom-[-1rem] end-[4%] z-20 w-[min(36vw,10.5rem)] text-[0.85rem] sm:w-[12rem] lg:bottom-[4%] lg:end-[10%] lg:w-[clamp(10rem,12vw,13rem)]"
          >
            <TableTent slug={biz.demo} lang={lang} title={copy.label} caption={tent} table={t.scan.table} qrLabel="" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
