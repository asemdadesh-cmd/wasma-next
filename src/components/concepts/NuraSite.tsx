"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Bricolage_Grotesque, Noto_Kufi_Arabic } from "next/font/google";
import { useCallback, useEffect, useRef, useState } from "react";
import { NuraObject } from "@/components/mini/NuraObject";
import { Scene } from "@/components/scenes/Scene";
import { products, type Product } from "@/lib/concept-data";
import { formatLYD, type Locale } from "@/lib/i18n";
import type { PhotoMap } from "@/lib/photos";

const grotesk = Bricolage_Grotesque({ subsets: ["latin"], variable: "--f-nura", display: "swap" });
const kufi = Noto_Kufi_Arabic({ subsets: ["arabic"], variable: "--f-nura-ar", display: "swap" });

type Props = { lang: Locale; photos: PhotoMap };
type Line = { key: string; pid: string; size: string; finish: string; qty: number };

const C = { bg: "#141618", bg2: "#1C1F22", ink: "#EDEBE4", soft: "#A8ABA6", forest: "#1F4D3A", cobalt: "#2F5BFF" };
const DELIVERY = 15;

const T = {
  nav: { ar: ["زجاج", "خزف", "ورق"], en: ["Glass", "Ceramic", "Paper"] },
  bag: { ar: "الحقيبة", en: "Bag" },
  hero: { ar: "أشياء لغرف هادئة.", en: "Objects for quiet rooms." },
  heroSub: { ar: "ثلاث قطع فقط، مصنوعة لتبقى. زجاج وخزف وورق، بألوان تهدأ مع الضوء.", en: "Only three pieces, made to last. Glass, ceramic and paper, in colours that settle with the light." },
  shop: { ar: "تسوّق القطع", en: "Shop the pieces" },
  finish: { ar: "اللون", en: "Finish" },
  size: { ar: "الحجم", en: "Size" },
  add: { ar: "أضف إلى الحقيبة", en: "Add to bag" },
  added: { ar: "أُضيف إلى الحقيبة", en: "Added to bag" },
  empty: { ar: "حقيبتك فارغة.", en: "Your bag is empty." },
  subtotal: { ar: "المجموع الفرعي", en: "Subtotal" },
  delivery: { ar: "التوصيل داخل طرابلس", en: "Delivery within Tripoli" },
  total: { ar: "الإجمالي", en: "Total" },
  checkout: { ar: "إتمام الطلب", en: "Checkout" },
  close: { ar: "إغلاق الحقيبة", en: "Close bag" },
  remove: { ar: "إزالة", en: "Remove" },
  placed: { ar: "طلب تجريبي مُسجّل", en: "Demo order recorded" },
  placedText: { ar: "لم يُدفع أي مبلغ ولن يُشحن شيء. هكذا تبدو صفحة التأكيد في متجر حقيقي.", en: "No payment was taken and nothing will ship. This is how the confirmation looks in a real shop." },
  materials: { ar: "المواد", en: "Materials" },
  mat: {
    ar: [
      ["زجاج منفوخ", "يُنفخ يدويًا، لذلك تختلف كل قطعة قليلًا في سماكتها ولونها."],
      ["خزف مزجّج", "يُحرق مرّتين على حرارة عالية، آمن للطعام وغسّالة الصحون."],
      ["ورق معاد تدويره", "ألياف معاد تدويرها بالكامل، تُطوى بلا غراء ولا أدوات."],
    ],
    en: [
      ["Blown glass", "Blown by hand, so every piece varies slightly in thickness and tone."],
      ["Glazed ceramic", "Fired twice at high temperature. Food-safe and dishwasher-safe."],
      ["Recycled board", "Fully recycled fibre. Folds without glue or tools."],
    ],
  },
  sample: { ar: "متجر تجريبي. المنتجات والأسعار خيالية.", en: "Demo shop. Products and prices are fictional." },
};

function ProductSection({ p, lang, onAdd, selection, setSelection, index }: {
  p: Product;
  lang: Locale;
  index: number;
  onAdd: (l: Omit<Line, "qty" | "key">) => void;
  selection: { size: string; finish: string };
  setSelection: (s: { size: string; finish: string }) => void;
}) {
  const [flash, setFlash] = useState(false);
  const size = p.sizes.find((s) => s.id === selection.size)!;
  return (
    <article id={`p-${p.id}`} data-product={index} className="flex min-h-[88svh] flex-col justify-center border-t border-white/10 py-16" aria-labelledby={`pn-${p.id}`}>
      <p className="text-sm" style={{ color: C.soft }}>
        {String(index + 1).padStart(2, "0")} · {p.kind[lang]}
      </p>
      <h2 id={`pn-${p.id}`} className="mt-4 text-[clamp(2.6rem,5vw,4.6rem)] font-semibold leading-[0.95]">{p.name[lang]}</h2>
      <p className="mt-5 max-w-[40ch] text-lg leading-relaxed" style={{ color: C.soft }}>{p.text[lang]}</p>

      {/* On phones the object sits inside the section; on desktop it is pinned beside it. */}
      <div className="relative my-8 flex h-64 items-center justify-center lg:hidden" style={{ background: C.bg2 }}>
        <NuraObject kind={p.id} color={p.finishes.find((f) => f.id === selection.finish)!.hex} className="h-56 w-56" />
      </div>

      <fieldset className="mt-8">
        <legend className="text-sm" style={{ color: C.soft }}>
          {T.finish[lang]}: <span style={{ color: C.ink }}>{p.finishes.find((f) => f.id === selection.finish)!.name[lang]}</span>
        </legend>
        <div className="mt-3 flex gap-3">
          {p.finishes.map((f) => (
            <label key={f.id} className="cursor-pointer">
              <input type="radio" name={`finish-${p.id}`} checked={selection.finish === f.id} onChange={() => setSelection({ ...selection, finish: f.id })} className="peer sr-only" />
              <span className="block size-11 ring-offset-4 ring-offset-[#141618] peer-checked:ring-2 peer-checked:ring-[#EDEBE4] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-8 peer-focus-visible:outline-[#2F5BFF]" style={{ background: f.hex }}>
                <span className="sr-only">{f.name[lang]}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="mt-6">
        <legend className="text-sm" style={{ color: C.soft }}>{T.size[lang]}</legend>
        <div className="mt-3 inline-flex border border-white/20">
          {p.sizes.map((s) => (
            <label key={s.id} className="cursor-pointer">
              <input type="radio" name={`size-${p.id}`} checked={selection.size === s.id} onChange={() => setSelection({ ...selection, size: s.id })} className="peer sr-only" />
              <span dir="ltr" className="tabular flex min-h-12 items-center px-4 text-[0.95rem] peer-checked:bg-[#EDEBE4] peer-checked:text-[#141618] peer-focus-visible:outline-2 peer-focus-visible:outline-[#2F5BFF]">
                {s.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => {
            onAdd({ pid: p.id, size: selection.size, finish: selection.finish });
            setFlash(true);
            setTimeout(() => setFlash(false), 1600);
          }}
          className="flex min-h-14 min-w-64 items-center justify-between gap-6 px-6 text-lg font-semibold text-white transition-transform active:translate-y-px"
          style={{ background: C.cobalt }}
        >
          <span>{T.add[lang]}</span>
          <span className="tabular">{formatLYD(size.price, lang)}</span>
        </button>
        <span role="status" className="text-sm" style={{ color: C.soft }}>{flash ? T.added[lang] : ""}</span>
      </div>
    </article>
  );
}

function BagDrawer({ lang, open, onClose, lines, setLines }: { lang: Locale; open: boolean; onClose: () => void; lines: Line[]; setLines: (l: Line[]) => void }) {
  const panel = useRef<HTMLDivElement>(null);
  const [placed, setPlaced] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    panel.current?.querySelector<HTMLElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        const els = Array.from(panel.current.querySelectorAll<HTMLElement>("button:not([disabled])"));
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus();
    };
  }, [open, onClose]);

  const subtotal = lines.reduce((a, l) => a + (products.find((p) => p.id === l.pid)!.sizes.find((s) => s.id === l.size)!.price) * l.qty, 0);
  const total = subtotal + (lines.length ? DELIVERY : 0);
  const side = lang === "ar" ? "-100%" : "100%";

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70]">
          <motion.button type="button" aria-label={T.close[lang]} tabIndex={-1} onClick={onClose} className="absolute inset-0 bg-black/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="bag-title"
            className="absolute inset-y-0 end-0 flex w-full max-w-md flex-col"
            style={{ background: C.bg2, color: C.ink }}
            initial={reduced ? { opacity: 0 } : { x: side }}
            animate={reduced ? { opacity: 1 } : { x: 0 }}
            exit={reduced ? { opacity: 0 } : { x: side }}
            transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <h2 id="bag-title" className="text-2xl font-semibold">{T.bag[lang]}</h2>
              <button type="button" onClick={onClose} className="min-h-11 px-2 underline underline-offset-4">{T.close[lang]}</button>
            </div>
            {placed ? (
              <div className="flex-1 p-6" role="status">
                <p className="text-2xl font-semibold">{T.placed[lang]}</p>
                <p className="mt-3 leading-relaxed" style={{ color: C.soft }}>{T.placedText[lang]}</p>
                <button type="button" onClick={() => { setPlaced(false); setLines([]); onClose(); }} className="mt-8 min-h-12 px-5 font-semibold text-white" style={{ background: C.cobalt }}>
                  {T.close[lang]}
                </button>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-white/10 overflow-y-auto px-6">
                  {lines.length === 0 && <li className="py-10" style={{ color: C.soft }}>{T.empty[lang]}</li>}
                  {lines.map((l) => {
                    const p = products.find((x) => x.id === l.pid)!;
                    const s = p.sizes.find((x) => x.id === l.size)!;
                    const f = p.finishes.find((x) => x.id === l.finish)!;
                    return (
                      <li key={l.key} className="flex gap-4 py-5">
                        <div className="flex size-20 shrink-0 items-center justify-center" style={{ background: C.bg }}>
                          <NuraObject kind={p.id} color={f.hex} className="size-16" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{p.name[lang]}</p>
                          <p className="text-sm" style={{ color: C.soft }}>
                            {f.name[lang]} · <span dir="ltr">{s.label}</span>
                          </p>
                          <div className="mt-2 flex items-center gap-2" role="group" aria-label={p.name[lang]}>
                            <button type="button" aria-label={`${p.name[lang]} −`} onClick={() => setLines(lines.map((x) => (x.key === l.key ? { ...x, qty: Math.max(1, x.qty - 1) } : x)))} disabled={l.qty <= 1} className="size-9 border border-white/20 disabled:opacity-30">−</button>
                            <output aria-live="polite" className="tabular w-6 text-center">{l.qty}</output>
                            <button type="button" aria-label={`${p.name[lang]} +`} onClick={() => setLines(lines.map((x) => (x.key === l.key ? { ...x, qty: Math.min(9, x.qty + 1) } : x)))} className="size-9 border border-white/20">+</button>
                            <button type="button" onClick={() => setLines(lines.filter((x) => x.key !== l.key))} className="ms-auto min-h-9 text-sm underline underline-offset-4" style={{ color: C.soft }}>{T.remove[lang]}</button>
                          </div>
                        </div>
                        <p className="tabular">{formatLYD(s.price * l.qty, lang)}</p>
                      </li>
                    );
                  })}
                </ul>
                <div className="border-t border-white/10 p-6">
                  <dl className="grid gap-2 text-[0.95rem]">
                    <div className="flex justify-between"><dt style={{ color: C.soft }}>{T.subtotal[lang]}</dt><dd className="tabular">{formatLYD(subtotal, lang)}</dd></div>
                    <div className="flex justify-between"><dt style={{ color: C.soft }}>{T.delivery[lang]}</dt><dd className="tabular">{formatLYD(lines.length ? DELIVERY : 0, lang)}</dd></div>
                    <div className="mt-2 flex justify-between text-xl font-semibold"><dt>{T.total[lang]}</dt><dd className="tabular" aria-live="polite">{formatLYD(total, lang)}</dd></div>
                  </dl>
                  <button type="button" disabled={!lines.length} onClick={() => setPlaced(true)} className="mt-5 min-h-14 w-full text-lg font-semibold text-white disabled:opacity-40" style={{ background: C.cobalt }}>
                    {T.checkout[lang]}
                  </button>
                  <p className="mt-3 text-xs" style={{ color: C.soft }}>{T.sample[lang]}</p>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function NuraSite({ lang, photos }: Props) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [bagOpen, setBagOpen] = useState(false);
  const closeBag = useCallback(() => setBagOpen(false), []);
  const [lines, setLines] = useState<Line[]>([]);
  const [sel, setSel] = useState<Record<string, { size: string; finish: string }>>(
    Object.fromEntries(products.map((p) => [p.id, { size: "m", finish: p.finishes[0].id }])),
  );

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.product))),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    document.querySelectorAll("[data-product]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const add = (l: Omit<Line, "qty" | "key">) => {
    const key = `${l.pid}-${l.size}-${l.finish}`;
    setLines((cur) => (cur.some((x) => x.key === key) ? cur.map((x) => (x.key === key ? { ...x, qty: Math.min(9, x.qty + 1) } : x)) : [...cur, { ...l, key, qty: 1 }]));
  };
  const count = lines.reduce((a, l) => a + l.qty, 0);
  const ap = products[active];
  const apSel = sel[ap.id];
  const apSize = apSel.size === "s" ? 0.82 : apSel.size === "l" ? 1.12 : 0.96;

  return (
    <div className={`${grotesk.variable} ${kufi.variable} min-h-screen`} style={{ background: C.bg, color: C.ink, fontFamily: "var(--f-nura), var(--f-nura-ar), sans-serif" }}>
      <header className="sticky top-0 z-40 border-b border-white/10" style={{ background: `${C.bg}f2` }}>
        <div className="flex h-16 items-center justify-between gap-6 px-[var(--gutter)]">
          <a href="#" className="text-xl font-extrabold tracking-[0.3em]" aria-label="NURA">NURA</a>
          <nav aria-label="NURA" className="hidden gap-8 text-[0.95rem] sm:flex">
            {T.nav[lang].map((n, i) => (
              <a key={n} href={`#p-${products[i].id}`} style={{ color: C.soft }} className="hover:text-white">{n}</a>
            ))}
          </nav>
          <button type="button" onClick={() => setBagOpen(true)} className="flex min-h-11 items-center gap-2 border border-white/25 px-4 text-[0.95rem]" aria-haspopup="dialog">
            {T.bag[lang]}
            <span className="tabular inline-flex size-6 items-center justify-center text-xs font-bold text-white" style={{ background: count ? C.cobalt : "transparent" }} aria-live="polite">
              {count}
            </span>
          </button>
        </div>
      </header>

      <main>
        <section className="relative min-h-[88svh] overflow-hidden" aria-labelledby="nura-title">
          <div className="absolute inset-0">
            <Scene name="nura-objects" photo={photos["nura-objects"]} alt={lang === "ar" ? "قارورة خضراء وبرطمان عاجي وعلبة ورقية على سطح معدني" : "A green bottle, an ivory jar and a paper carton on brushed metal"} position="68% 55%" priority idPrefix="nura-hero" />
          </div>
          {/* Contrast surface sized to the copy, over the dark upper-left wall */}
          <div className="relative flex min-h-[88svh] items-start px-[var(--gutter)] pt-[12vh]">
            <div className="max-w-xl ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-[#141618] via-[#141618]/85 to-transparent p-0 pe-16">
              <h1 id="nura-title" className="text-[clamp(3rem,7.5vw,6.8rem)] font-semibold leading-[0.92]">{T.hero[lang]}</h1>
              <p className="mt-6 max-w-[34ch] text-lg leading-relaxed" style={{ color: "#C9CCC6" }}>{T.heroSub[lang]}</p>
              <a href={`#p-${products[0].id}`} className="mt-8 inline-flex min-h-12 items-center px-6 font-semibold text-white" style={{ background: C.cobalt }}>{T.shop[lang]}</a>
            </div>
          </div>
        </section>

        {/* Split stage: the object holds while its product section scrolls */}
        <div className="grid lg:grid-cols-2" data-sc-act="pin">
          <div className="hidden lg:block">
            <div className="sticky top-16 flex h-[calc(100svh-4rem)] items-center justify-center overflow-hidden" style={{ background: C.bg2 }}>
              <div aria-hidden="true" className="absolute inset-y-0 end-0 w-1/2 ltr:bg-gradient-to-l rtl:bg-gradient-to-r from-[#2F5BFF]/25 to-transparent" />
              <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-b from-[#6B7075] to-[#3E4246]" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={ap.id}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 30, rotate: -3 }}
                  animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, rotate: 0 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, y: -30, rotate: 3 }}
                  transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
                  className="relative"
                >
                  <NuraObject kind={ap.id} color={ap.finishes.find((f) => f.id === apSel.finish)!.hex} scale={apSize} className="relative h-[52vh] w-[52vh] transition-transform duration-300" />
                </motion.div>
              </AnimatePresence>
              <p className="absolute bottom-6 start-6 text-sm text-white/80">
                {ap.name[lang]} · {ap.finishes.find((f) => f.id === apSel.finish)!.name[lang]} · <span dir="ltr">{ap.sizes.find((s) => s.id === apSel.size)!.label}</span>
              </p>
            </div>
          </div>
          <div className="px-[var(--gutter)] lg:px-16">
            {products.map((p, i) => (
              <ProductSection key={p.id} p={p} lang={lang} index={i} onAdd={add} selection={sel[p.id]} setSelection={(s) => setSel({ ...sel, [p.id]: s })} />
            ))}
          </div>
        </div>

        <section aria-labelledby="mat-title" className="border-t border-white/10 px-[var(--gutter)] py-24" data-sc-act="flow">
          <h2 id="mat-title" className="text-sm tracking-[0.3em]" style={{ color: C.soft }}>{T.materials[lang]}</h2>
          <dl className="mt-8">
            {T.mat[lang].map(([k, v]) => (
              <div key={k} className="grid gap-2 border-t border-white/10 py-6 md:grid-cols-2">
                <dt className="text-[clamp(1.8rem,3.4vw,3rem)] font-semibold leading-none">{k}</dt>
                <dd className="max-w-[44ch] text-lg leading-relaxed" style={{ color: C.soft }}>{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-10 text-sm" style={{ color: C.soft }}>{T.sample[lang]}</p>
        </section>
      </main>

      <BagDrawer lang={lang} open={bagOpen} onClose={closeBag} lines={lines} setLines={setLines} />
    </div>
  );
}
