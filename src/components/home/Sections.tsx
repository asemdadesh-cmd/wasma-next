"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useIsDesktop } from "@/hooks/useMedia";
import type { Dict } from "@/lib/dictionaries/ar";
import type { Locale } from "@/lib/i18n";

const useIso = typeof window === "undefined" ? useEffect : useLayoutEffect;

/* ── Capabilities: editorial disclosures ───────────────────────────── */
export function Capabilities({ t }: { t: Dict["capabilities"] }) {
  return (
    <section id="capabilities" aria-labelledby="cap-title" className="grain bg-paper-2 py-[var(--section)]" data-sc-act="flow">
      <div className="wrap grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--nav-h)+2rem)]">
            <h2 id="cap-title" className="display text-[clamp(2.6rem,5.5vw,5rem)]">
              {t.title}
            </h2>
            <p className="pretty mt-6 max-w-[34ch] text-lg leading-relaxed text-mute">{t.lead}</p>
          </div>
        </div>
        <div className="border-t border-ink lg:col-span-8">
          {t.items.map((item, i) => (
            <details key={item.name} className="group border-b border-ink" open={i === 0}>
              <summary className="flex min-h-[5.5rem] items-center justify-between gap-6 py-6">
                <h3 className="text-[clamp(1.5rem,3.2vw,2.6rem)] font-semibold leading-tight">{item.name}</h3>
                <span aria-hidden="true" className="relative size-6 shrink-0">
                  <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-ink" />
                  <span className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-ink transition-transform duration-200 group-open:scale-y-0" />
                </span>
              </summary>
              <div className="grid gap-8 pb-10 md:grid-cols-2">
                <p className="pretty max-w-[46ch] text-lg leading-relaxed">{item.text}</p>
                <div>
                  <p className="text-sm text-mute">{t.deliver}</p>
                  <ul className="mt-3 grid gap-2">
                    {item.list.map((li) => (
                      <li key={li} className="flex items-start gap-3">
                        <span className="mt-[0.55em] size-2 shrink-0 bg-ink group-open:bg-ink" aria-hidden="true" />
                        {li}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Statement: one sentence travelling in the reading direction ──── */
export function Statement({ t, lang }: { t: Dict["statement"]; lang: Locale }) {
  const ref = useRef<HTMLElement>(null);
  const line = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();
  const desktop = useIsDesktop();
  const [travel, setTravel] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 200, damping: 40, mass: 0.4 });
  const dir = lang === "ar" ? 1 : -1;
  const x = useTransform(p, [0.05, 0.9], [0, dir * travel]);
  const subOpacity = useTransform(p, [0.55, 0.8], [0, 1]);

  useIso(() => {
    if (reduced) return;
    const measure = () => {
      if (!line.current) return;
      const over = line.current.scrollWidth - window.innerWidth;
      setTravel(Math.max(0, over + window.innerWidth * 0.08));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (line.current) ro.observe(line.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [reduced, desktop]);

  if (reduced) {
    return (
      <section aria-labelledby="statement" className="on-ink bg-ink py-[var(--section)] text-paper" data-sc-act="flow">
        <div className="wrap">
          <h2 id="statement" className="display text-[clamp(3rem,9vw,8rem)]">
            {t.line}
          </h2>
          <p className="pretty mt-10 max-w-[48ch] text-xl leading-relaxed text-mute-dark">{t.sub}</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} aria-labelledby="statement" className={`on-ink relative bg-ink text-paper ${desktop ? "h-[260vh]" : "h-[200vh]"}`} data-sc-act="pan">
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <motion.h2
          id="statement"
          ref={line}
          style={{ x }}
          className="display w-max whitespace-nowrap px-[var(--gutter)] text-[clamp(5.5rem,24vw,22rem)]"
        >
          {t.line}
        </motion.h2>
        <motion.div style={{ opacity: subOpacity }} className="wrap mt-[clamp(2rem,5vw,4rem)]">
          <div className="flex items-start gap-5">
            <span className="mt-2 size-3 shrink-0 bg-lime" aria-hidden="true" />
            <p className="pretty max-w-[48ch] text-[clamp(1.15rem,1.8vw,1.5rem)] leading-relaxed text-mute-dark">{t.sub}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Reasons: ruled entries that wipe in ─────────────────────────── */
export function Reasons({ t, lang }: { t: Dict["reasons"]; lang: Locale }) {
  const reduced = useReducedMotion();
  const from = lang === "ar" ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)";
  return (
    <section aria-labelledby="reasons-title" className="on-ink bg-ink pb-[var(--section)] text-paper" data-sc-act="reveal">
      <div className="wrap">
        <h2 id="reasons-title" className="display border-t border-line-dark pt-12 text-[clamp(2.4rem,5vw,4.6rem)]">
          {t.title}
        </h2>
        <ol className="mt-12">
          {t.items.map((r, i) => (
            <motion.li
              key={r.name}
              className="grid gap-4 border-t border-line-dark py-8 md:grid-cols-12 md:gap-8"
              initial={reduced ? { opacity: 0 } : { clipPath: from, opacity: 0.2 }}
              whileInView={reduced ? { opacity: 1 } : { clipPath: "inset(0 0% 0 0%)", opacity: 1 }}
              viewport={{ once: true, margin: "0px 0px -12% 0px" }}
              transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1], delay: reduced ? 0 : i * 0.04 }}
            >
              <div className="flex items-start gap-4 md:col-span-6">
                <span className={`mt-3 size-3 shrink-0 ${i === 0 ? "bg-lime" : "bg-paper/80"}`} aria-hidden="true" />
                <h3 className="text-[clamp(1.5rem,2.8vw,2.4rem)] font-semibold leading-tight">{r.name}</h3>
              </div>
              <p className="pretty max-w-[46ch] text-lg leading-relaxed text-mute-dark md:col-span-6 md:pt-1">{r.text}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── Process: a line drawn through the steps ─────────────────────── */
export function Process({ t }: { t: Dict["process"] }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const p = useSpring(scrollYProgress, { stiffness: 160, damping: 30 });
  const [reached, setReached] = useState(reduced ? t.steps.length : 0);
  useEffect(() => {
    if (reduced) return;
    return p.on("change", (v) => setReached(Math.min(t.steps.length, Math.floor(v * t.steps.length + 0.35))));
  }, [p, reduced, t.steps.length]);
  const n = reduced ? t.steps.length : reached;

  return (
    <section id="process" aria-labelledby="process-title" className="bg-paper py-[var(--section)]" data-sc-act="flow" data-sc-verify-state={n}>
      <div className="wrap grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 id="process-title" className="display text-[clamp(2.6rem,5.5vw,5rem)]">
            {t.title}
          </h2>
          <p className="pretty mt-6 max-w-[36ch] text-lg leading-relaxed text-mute">{t.lead}</p>
        </div>
        <ol ref={ref} className="relative lg:col-span-7">
          <span aria-hidden="true" className="absolute inset-y-0 start-[1.1rem] w-px bg-line" />
          <motion.span
            aria-hidden="true"
            className="absolute inset-y-0 start-[1.1rem] w-[3px] origin-top -translate-x-px bg-ink rtl:translate-x-px"
            style={{ scaleY: reduced ? 1 : p }}
          />
          {t.steps.map((s, i) => (
            <li key={s.name} className="relative grid grid-cols-[2.2rem_1fr] gap-6 pb-14 last:pb-0">
              <span
                className={`tabular relative z-10 flex size-[2.2rem] items-center justify-center text-sm font-bold transition-colors duration-300 ${
                  i < n ? "bg-ink text-paper" : "bg-paper text-mute ring-1 ring-line"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
                {i === n - 1 && <span className="absolute -end-1 -top-1 size-2 bg-lime" aria-hidden="true" />}
              </span>
              <div className={`transition-opacity duration-300 ${i < n ? "opacity-100" : "opacity-55"}`}>
                <h3 className="text-[clamp(1.4rem,2.4vw,2rem)] font-semibold leading-tight">{s.name}</h3>
                <p className="pretty mt-3 max-w-[48ch] text-lg leading-relaxed">{s.text}</p>
                <p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-mute">
                  <span className="h-px w-6 bg-mute" aria-hidden="true" />
                  {s.out}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── Featured: the courtyard window widens into SAHRA ─────────────── */
export function Featured({ t, lang, scene }: { t: Dict["featured"]; lang: Locale; scene: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const desktop = useIsDesktop();
  const pinned = desktop && !reduced;
  const { scrollYProgress } = useScroll({ target: ref, offset: pinned ? ["start start", "end end"] : ["start end", "center center"] });
  const p = useSpring(scrollYProgress, { stiffness: 200, damping: 40, mass: 0.4 });
  const clip = useTransform(p, pinned ? [0, 0.55] : [0, 1], pinned ? ["inset(18% 34% 18% 34%)", "inset(0% 0% 0% 0%)"] : ["inset(10% 14% 10% 14%)", "inset(0% 0% 0% 0%)"]);
  const scale = useTransform(p, [0, 0.7], [1.18, 1]);
  const copyY = useTransform(p, [0.45, 0.75], [60, 0]);
  const copyO = useTransform(p, [0.45, 0.7], [0, 1]);
  const labelO = useTransform(p, [0, 0.3], [1, 0]);

  const copy = (
    <div className="bg-paper p-6 text-ink shadow-[0_24px_48px_-24px_rgba(11,13,12,.5)] sm:p-8">
      <p className="text-sm font-medium text-mute">{t.kicker}</p>
      <h2 id="featured-title" className="display mt-4 text-[clamp(2rem,3.6vw,3.4rem)]">
        {t.title}
      </h2>
      <p className="pretty mt-5 text-lg leading-relaxed">{t.text}</p>
      <ul className="mt-6 grid gap-2 text-[0.95rem]">
        {t.points.map((pt) => (
          <li key={pt} className="flex gap-3">
            <span className="mt-[0.5em] size-2 shrink-0 bg-ink" aria-hidden="true" />
            {pt}
          </li>
        ))}
      </ul>
      <Link href={`/${lang}/work/sahra`} className="btn btn-ink mt-8">
        <span className="btn-square" aria-hidden="true" />
        {t.cta}
      </Link>
    </div>
  );

  if (!pinned) {
    return (
      <section ref={ref} aria-labelledby="featured-title" className="bg-ink py-[var(--section)]" data-sc-act="reveal">
        <div className="wrap">
          <motion.div className="relative aspect-[4/5] overflow-hidden sm:aspect-[3/2]" style={reduced ? undefined : { clipPath: clip }}>
            <motion.div className="absolute inset-0" style={reduced ? undefined : { scale }}>
              {scene}
            </motion.div>
          </motion.div>
          <div className="-mt-10 px-3 sm:-mt-16 sm:px-10">{copy}</div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} aria-labelledby="featured-title" className="relative h-[230vh] bg-ink" data-sc-act="reveal">
      <div className="sticky top-0 h-svh overflow-hidden">
        <motion.div className="absolute inset-0" style={{ clipPath: clip }}>
          <motion.div className="absolute inset-0" style={{ scale }}>
            {scene}
          </motion.div>
        </motion.div>
        <motion.p style={{ opacity: labelO }} className="absolute inset-x-0 bottom-[10%] text-center text-sm font-medium text-paper">
          SAHRA · {lang === "ar" ? "صحرا" : "Coastal retreat"}
        </motion.p>
        <div className="wrap relative flex h-full items-end pb-[6vh]">
          <motion.div style={{ y: copyY, opacity: copyO }} className="w-full max-w-[34rem]">
            {copy}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── Services: a dense, honest ledger ────────────────────────────── */
export function Services({ t }: { t: Dict["services"] }) {
  return (
    <section id="services" aria-labelledby="services-title" className="bg-paper py-[var(--section)]" data-sc-act="flow">
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-12">
          <h2 id="services-title" className="display text-[clamp(2.6rem,5.5vw,5rem)] lg:col-span-7">
            {t.title}
          </h2>
          <p className="pretty max-w-[44ch] self-end text-lg leading-relaxed text-mute lg:col-span-5">{t.lead}</p>
        </div>
        <ul className="mt-14 border-t-2 border-ink">
          {t.items.map((s) => (
            <li key={s.name} className="grid gap-3 border-b border-line py-6 md:grid-cols-12 md:items-baseline md:gap-8">
              <h3 className="text-[1.35rem] font-semibold leading-snug md:col-span-4">{s.name}</h3>
              <p className="text-mute md:col-span-3">{s.scope}</p>
              <p className="md:col-span-5">
                <span className="sr-only">{t.includes}: </span>
                {s.out.map((o, i) => (
                  <span key={o} className="inline-flex items-center">
                    {i > 0 && <span className="mx-3 size-1 bg-ink/40" aria-hidden="true" />}
                    {o}
                  </span>
                ))}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
