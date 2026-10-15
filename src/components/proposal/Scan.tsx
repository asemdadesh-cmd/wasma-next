"use client";

/**
 * Act 3, the peak: "I scanned the menu on their site and it opened on my own phone."
 * On desktop the act pins. The phone glides over the table card, its camera finds the
 * code (a real one, pointing at the live demo), and the screen turns into the working
 * concept. Scanning the code with an actual phone opens that same demo.
 * Phones and reduced motion get the end state with no pinned travel.
 */
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";
import { useIsDesktop, useReduced } from "@/hooks/useMedia";
import type { Dict } from "@/lib/dictionaries/ar";
import type { Locale } from "@/lib/i18n";
import { projects } from "@/lib/projects";
import { useBusiness } from "./Business";
import { Phone, TableTent } from "./Device";
import { Photo } from "./Photo";
import { Qr, useOrigin } from "./Qr";

const TRAVEL_REM = 23.5; // card half-width + gap + phone half-width

export function Scan({ lang, t }: { lang: Locale; t: Dict }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReduced();
  const desktop = useIsDesktop();
  const pinned = desktop && !reduce;
  const biz = useBusiness();
  const project = projects.find((p) => p.slug === biz.demo)!;
  const copy = t.biz.items[biz.id];
  const href = `/${lang}/work/${biz.demo}`;
  const host = useOrigin().replace(/^https?:\/\//, "");
  const qrLabel = `${t.scan.qr} ${project.name[lang]}`;
  const tent = biz.id === "cafe" ? t.scan.tent : t.scan.tentOther;

  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const sign = lang === "ar" ? 1 : -1;
  const reach = useTransform(p, [0.06, 0.3, 0.48, 0.66], [0, 1, 1, 0]);
  const phoneX = useTransform(reach, (v) => `${v * sign * TRAVEL_REM}rem`);
  const phoneLift = useTransform(reach, [0, 1], [0, -18]);
  const wipe = useTransform(p, [0.46, 0.58], [0, 100]);
  const cameraClip = useTransform(wipe, (v) => `inset(0 0 ${v}% 0)`);
  const lock = useTransform(p, [0.2, 0.32], [1.3, 1]);
  const flash = useTransform(p, [0.42, 0.45, 0.5], [0, 0.85, 0]);
  const pill = useTransform(p, [0.32, 0.36, 0.44, 0.46], [0, 1, 1, 0]);

  const [step, setStep] = useState(pinned ? 0 : 2);
  const [live, setLive] = useState(!pinned);
  useMotionValueEvent(p, "change", (v) => {
    if (!pinned) return;
    setStep(v < 0.3 ? 0 : v < 0.6 ? 1 : 2);
    setLive(v > 0.56);
  });
  const shownStep = pinned ? step : 2;
  const operable = pinned ? live : true;

  const cameraScreen = pinned ? (
    <motion.div style={{ clipPath: cameraClip }} className="pointer-events-none absolute inset-0 overflow-hidden bg-ink">
      <div className="absolute inset-0 scale-125 opacity-50 blur-md">
        <Photo photo={biz.photo} alt="" sizes="18rem" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[58%] rotate-[-4deg] bg-paper p-[6%]">
          <Qr path={href} label="" className="block aspect-square w-full" />
          <motion.div style={{ scale: lock }} className="absolute -inset-[14%]">
            {["start-0 top-0 border-s-2 border-t-2", "end-0 top-0 border-e-2 border-t-2", "start-0 bottom-0 border-s-2 border-b-2", "end-0 bottom-0 border-e-2 border-b-2"].map((c) => (
              <span key={c} className={`absolute size-[22%] border-lime ${c}`} />
            ))}
          </motion.div>
        </div>
      </div>
      <motion.div style={{ opacity: pill }} className="absolute inset-x-[10%] bottom-[12%] flex items-center justify-center gap-2 bg-lime px-3 py-2 text-[0.7rem] font-semibold text-ink" dir="ltr">
        <span className="truncate">{host}{href}</span>
      </motion.div>
      <motion.div style={{ opacity: flash }} className="absolute inset-0 bg-paper" />
    </motion.div>
  ) : null;

  return (
    <section ref={ref} id="scan" aria-labelledby="scan-title" className="relative bg-paper-2" style={pinned ? { height: "340vh" } : undefined} data-sc-act="pin">
      <div className={pinned ? "sticky top-0 flex h-[100svh] items-center overflow-hidden pt-[var(--nav-h)]" : "py-[var(--section)]"}>
        <div className="wrap grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="scan-title" className="display text-[clamp(2.4rem,4.6vw,4.4rem)]">
              {t.scan.title}
            </h2>
            <p className="pretty mt-5 max-w-[34ch] text-lg leading-relaxed text-ink/80">{desktop ? t.scan.lead : t.scan.onPhone}</p>
            <ol className="mt-9 grid gap-4 border-t border-line pt-6">
              {t.scan.steps.map((s, i) => (
                <li key={s} className={`flex items-start gap-4 transition-colors duration-300 ${i <= shownStep ? "text-ink" : "text-ink/40"}`}>
                  <span aria-hidden="true" className={`mt-[0.55rem] size-2.5 shrink-0 transition-colors duration-300 ${i === shownStep ? "bg-lime outline outline-1 outline-ink" : i < shownStep ? "bg-ink" : "bg-ink/25"}`} />
                  <span className="text-[1.05rem] leading-relaxed">{s}</span>
                </li>
              ))}
            </ol>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href={href} className="btn btn-ink">
                <span className="btn-square" aria-hidden="true" />
                {t.scan.open}
              </Link>
              <span className="text-sm text-mute">{t.scan.fictional}</span>
            </div>
          </div>

          <div className="relative flex min-h-[32rem] items-center justify-center gap-[6rem] lg:col-span-8 lg:min-h-[min(78vh,46rem)]">
            {pinned ? (
              <>
                <div className="w-[17rem] shrink-0 text-[0.95rem]">
                  <TableTent slug={biz.demo} lang={lang} title={copy.label} caption={tent} table={t.scan.table} qrLabel={qrLabel} />
                </div>
                <motion.div style={{ x: phoneX, y: phoneLift }} className="relative z-10 w-[18rem] shrink-0">
                  <Phone key={biz.demo} slug={biz.demo} lang={lang} inert={!operable} screen={cameraScreen} />
                  <span className="sr-only" aria-live="polite">{live ? t.scan.live : ""}</span>
                </motion.div>
              </>
            ) : (
              <div className="relative mx-auto w-full max-w-[24rem] pb-10">
                <div className="mx-auto w-[min(72vw,17.5rem)]">
                  <Phone key={biz.demo} slug={biz.demo} lang={lang} />
                </div>
                <div className="absolute bottom-0 start-[-0.5rem] w-[min(30vw,8.5rem)] rotate-[-4deg] text-[0.68rem]">
                  <TableTent slug={biz.demo} lang={lang} title={copy.label} caption={tent} table={t.scan.table} qrLabel={qrLabel} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
