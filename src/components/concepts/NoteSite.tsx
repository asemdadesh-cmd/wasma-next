"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { El_Messiri, Fraunces } from "next/font/google";
import { useCallback, useEffect, useRef, useState } from "react";
import { Scene } from "@/components/scenes/Scene";
import { dietNames, menu, menuCats, type Diet, type MenuItem } from "@/lib/concept-data";
import { formatLYD, type Locale } from "@/lib/i18n";
import type { PhotoMap } from "@/lib/photos";

const fraunces = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], variable: "--f-note", display: "swap" });
const messiri = El_Messiri({ subsets: ["arabic"], variable: "--f-note-ar", display: "swap" });

type Props = { lang: Locale; photos: PhotoMap };
type Line = { key: string; id: string; qty: number; size: "single" | "double"; milk: "regular" | "oat" | null };

const C = { red: "#B4432C", cream: "#FBF4EA", sand: "#EFE1CC", bean: "#3A2219", soft: "#6E5446", saffron: "#F2B33D" };
const DOUBLE = 2;
const OAT = 2;

const T = {
  hours: { ar: "مفتوح يوميًا 7:00 إلى 23:00", en: "Open daily 7:00 to 23:00" },
  table: { ar: "الطاولة", en: "Table" },
  hello: { ar: "صباح الخير.", en: "Good morning." },
  intro: { ar: "اختر ما تحب، وأرِ النادل طلبك من هاتفك. لا تطبيق، لا تسجيل.", en: "Pick what you like, then show your server the order on your phone. No app, no sign-up." },
  filters: { ar: "فلاتر", en: "Filters" },
  clear: { ar: "مسح", en: "Clear" },
  add: { ar: "أضف", en: "Add" },
  addTo: { ar: "أضف إلى الطلب", en: "Add to order" },
  details: { ar: "التفاصيل", en: "Details" },
  size: { ar: "الحجم", en: "Size" },
  single: { ar: "عادي", en: "Single" },
  double: { ar: "مزدوج", en: "Double" },
  milk: { ar: "الحليب", en: "Milk" },
  regular: { ar: "حليب بقري", en: "Dairy" },
  oat: { ar: "شوفان", en: "Oat" },
  qty: { ar: "الكمية", en: "Quantity" },
  order: { ar: "طلبك", en: "Your order" },
  empty: { ar: "لم تُضف شيئًا بعد.", en: "Nothing added yet." },
  items: { ar: "أصناف", en: "items" },
  note: { ar: "ملاحظة للمطبخ", en: "Note for the kitchen" },
  notePh: { ar: "بدون سكر، ساخن جدًا...", en: "No sugar, extra hot..." },
  show: { ar: "أرِه للنادل", en: "Show to staff" },
  view: { ar: "عرض الطلب", en: "View order" },
  close: { ar: "إغلاق", en: "Close" },
  total: { ar: "الإجمالي", en: "Total" },
  none: { ar: "لا أصناف تطابق الفلاتر في هذا القسم.", en: "Nothing in this section matches your filters." },
  staffNote: { ar: "قائمة تجريبية. لا يُرسل الطلب إلى أي مطبخ.", en: "Demo menu. The order is not sent to any kitchen." },
};

const priceOf = (l: Line) => {
  const m = menu.find((x) => x.id === l.id)!;
  return (m.price + (l.size === "double" ? DOUBLE : 0) + (l.milk === "oat" ? OAT : 0)) * l.qty;
};
const hasOptions = (m: MenuItem) => m.cat === "coffee" && m.id !== "cold";
const takesMilk = (m: MenuItem) => ["mac", "flat", "oat"].includes(m.id);

function useDialog(open: boolean, onClose: () => void, ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const t = setTimeout(() => ref.current?.querySelector<HTMLElement>("[data-autofocus], button")?.focus(), 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && ref.current) {
        const els = Array.from(ref.current.querySelectorAll<HTMLElement>("button:not([disabled]), textarea, input"));
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
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus();
    };
  }, [open, onClose, ref]);
}

function Sheet({ open, onClose, label, children }: { open: boolean; onClose: () => void; label: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useDialog(open, onClose, ref);
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
          <motion.button type="button" tabIndex={-1} aria-label={T.close.en} onClick={onClose} className="absolute inset-0 bg-[#3A2219]/55" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            className="relative max-h-[88svh] w-full overflow-y-auto rounded-t-[1.75rem] p-6 sm:max-w-lg sm:rounded-[1.75rem]"
            style={{ background: C.cream, color: C.bean }}
            initial={reduced ? { opacity: 0 } : { y: "100%" }}
            animate={reduced ? { opacity: 1 } : { y: 0 }}
            exit={reduced ? { opacity: 0 } : { y: "100%" }}
            transition={{ duration: 0.34, ease: [0.23, 1, 0.32, 1] }}
          >
            <span className="mx-auto mb-4 block h-1.5 w-12 rounded-full bg-[#3A2219]/20 sm:hidden" aria-hidden="true" />
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Choice<V extends string>({ legend, value, options, onChange }: { legend: string; value: V; options: { v: V; label: string; extra?: string }[]; onChange: (v: V) => void }) {
  return (
    <fieldset className="mt-5">
      <legend className="text-sm" style={{ color: C.soft }}>{legend}</legend>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {options.map((o) => (
          <label key={o.v} className="cursor-pointer">
            <input type="radio" checked={value === o.v} onChange={() => onChange(o.v)} className="peer sr-only" name={legend} />
            <span className="flex min-h-12 items-center justify-between rounded-full border-2 px-4 peer-checked:border-[#B4432C] peer-checked:bg-[#B4432C] peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2" style={{ borderColor: `${C.bean}30` }}>
              {o.label}
              {o.extra && <span className="tabular text-sm opacity-80">{o.extra}</span>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function OrderList({ lang, lines, setLines, note, setNote, onShow }: { lang: Locale; lines: Line[]; setLines: (l: Line[]) => void; note: string; setNote: (s: string) => void; onShow: () => void }) {
  const total = lines.reduce((a, l) => a + priceOf(l), 0);
  return (
    <div>
      {lines.length === 0 ? (
        <p className="py-6 italic" style={{ color: C.soft }}>{T.empty[lang]}</p>
      ) : (
        <ul className="divide-y" style={{ borderColor: `${C.bean}1a` }}>
          {lines.map((l) => {
            const m = menu.find((x) => x.id === l.id)!;
            return (
              <li key={l.key} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{m.name[lang]}</p>
                  <p className="text-sm" style={{ color: C.soft }}>
                    {[hasOptions(m) && (l.size === "double" ? T.double[lang] : T.single[lang]), l.milk && T[l.milk][lang]].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <div className="flex items-center" role="group" aria-label={m.name[lang]}>
                  <button type="button" className="size-10 rounded-full text-xl" aria-label={`${m.name[lang]} −`} onClick={() => setLines(l.qty <= 1 ? lines.filter((x) => x.key !== l.key) : lines.map((x) => (x.key === l.key ? { ...x, qty: x.qty - 1 } : x)))}>−</button>
                  <output aria-live="polite" className="tabular w-6 text-center">{l.qty}</output>
                  <button type="button" className="size-10 rounded-full text-xl" aria-label={`${m.name[lang]} +`} onClick={() => setLines(lines.map((x) => (x.key === l.key ? { ...x, qty: Math.min(9, x.qty + 1) } : x)))}>+</button>
                </div>
                <span className="tabular w-20 text-end">{formatLYD(priceOf(l), lang)}</span>
              </li>
            );
          })}
        </ul>
      )}
      <label className="mt-4 block">
        <span className="text-sm" style={{ color: C.soft }}>{T.note[lang]}</span>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder={T.notePh[lang]} className="mt-1 block w-full rounded-2xl border-2 bg-transparent p-3 outline-none focus:border-[#B4432C]" style={{ borderColor: `${C.bean}26` }} />
      </label>
      <div className="mt-4 flex items-center justify-between text-xl font-semibold">
        <span>{T.total[lang]}</span>
        <output aria-live="polite" className="tabular">{formatLYD(total, lang)}</output>
      </div>
      <button type="button" disabled={!lines.length} onClick={onShow} className="mt-4 min-h-14 w-full rounded-full text-lg font-semibold text-white disabled:opacity-40" style={{ background: C.red }}>
        {T.show[lang]}
      </button>
      <p className="mt-3 text-center text-xs" style={{ color: C.soft }}>{T.staffNote[lang]}</p>
    </div>
  );
}

export function NoteSite({ lang, photos }: Props) {
  const [active, setActive] = useState(menuCats[0].id);
  const [diets, setDiets] = useState<Diet[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [note, setNote] = useState("");
  const [table, setTable] = useState(4);
  const [item, setItem] = useState<MenuItem | null>(null);
  const [opt, setOpt] = useState<{ size: "single" | "double"; milk: "regular" | "oat"; qty: number }>({ size: "single", milk: "regular", qty: 1 });
  const [orderOpen, setOrderOpen] = useState(false);
  const [staff, setStaff] = useState(false);
  const reduced = useReducedMotion();
  const staffRef = useRef<HTMLDivElement>(null);
  const closeItem = useCallback(() => setItem(null), []);
  const closeOrder = useCallback(() => setOrderOpen(false), []);
  const closeStaff = useCallback(() => setStaff(false), []);
  useDialog(staff, closeStaff, staffRef);

  // Scroll-spy: the category bar follows your reading.
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive((e.target as HTMLElement).dataset.cat!)),
      { rootMargin: "-30% 0px -65% 0px" },
    );
    document.querySelectorAll("[data-cat]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.getElementById(`tab-${active}`)?.scrollIntoView({ block: "nearest", inline: "center", behavior: reduced ? "auto" : "smooth" });
  }, [active, reduced]);

  const addLine = (m: MenuItem, size: Line["size"], milk: Line["milk"], qty: number) => {
    const key = `${m.id}-${size}-${milk ?? "none"}`;
    setLines((cur) => (cur.some((x) => x.key === key) ? cur.map((x) => (x.key === key ? { ...x, qty: Math.min(9, x.qty + qty) } : x)) : [...cur, { key, id: m.id, qty, size, milk }]));
  };
  const quickAdd = (m: MenuItem) => (hasOptions(m) ? openItem(m) : addLine(m, "single", null, 1));
  const openItem = (m: MenuItem) => {
    setOpt({ size: "single", milk: m.id === "oat" ? "oat" : "regular", qty: 1 });
    setItem(m);
  };
  const count = lines.reduce((a, l) => a + l.qty, 0);
  const total = lines.reduce((a, l) => a + priceOf(l), 0);
  const visible = (m: MenuItem) => diets.every((d) => m.diet.includes(d));

  return (
    <div className={`${fraunces.variable} ${messiri.variable} min-h-screen pb-28 lg:pb-0`} style={{ background: C.cream, color: C.bean, fontFamily: "var(--f-note), var(--f-note-ar), Georgia, serif" }}>
      <header className="px-[var(--gutter)] pb-6 pt-6" style={{ background: C.red, color: C.cream }}>
        <div className="flex items-center justify-between gap-4">
          <a href="#" className="text-[2.2rem] italic leading-none">{lang === "ar" ? "نوتة" : "nōte"}</a>
          <label className="flex items-center gap-2 text-sm">
            {T.table[lang]}
            <select value={table} onChange={(e) => setTable(Number(e.target.value))} className="tabular min-h-10 rounded-full border border-white/40 bg-transparent px-3 text-base">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n} className="text-black">{n}</option>
              ))}
            </select>
          </label>
        </div>
        <p className="mt-2 text-sm">{T.hours[lang]}</p>
      </header>

      <div className="lg:grid lg:grid-cols-[1fr_24rem] lg:gap-10 lg:px-[var(--gutter)]">
        <main>
          <section className="grid gap-6 px-[var(--gutter)] py-8 md:grid-cols-2 md:items-center lg:px-0" aria-labelledby="note-hello">
            <div>
              <h1 id="note-hello" className="text-[clamp(2.8rem,7vw,5rem)] italic leading-none">{T.hello[lang]}</h1>
              <p className="mt-4 max-w-[34ch] text-lg leading-relaxed" style={{ color: C.soft }}>{T.intro[lang]}</p>
            </div>
            <div className="relative aspect-[3/2] overflow-hidden rounded-[1.75rem]">
              <Scene name="note-cafe" photo={photos["note-cafe"]} alt={lang === "ar" ? "إسبريسو وكعكة مزجّجة على سطح أحمر طيني" : "Espresso and a glazed pastry on a terracotta surface"} priority idPrefix="note-hero" />
            </div>
          </section>

          {/* Sticky category bar with scroll-spy and diet filters */}
          <div className="sticky top-0 z-30 border-y" style={{ background: C.cream, borderColor: `${C.bean}1a` }} data-sc-act="pin">
            <nav aria-label={lang === "ar" ? "أقسام القائمة" : "Menu sections"} className="rail flex gap-1 overflow-x-auto px-[var(--gutter)] py-2 lg:px-0">
              {menuCats.map((c) => (
                <a
                  key={c.id}
                  id={`tab-${c.id}`}
                  href={`#cat-${c.id}`}
                  aria-current={active === c.id ? "true" : undefined}
                  className="relative shrink-0 rounded-full px-4 py-2.5 text-[1.05rem]"
                >
                  {active === c.id && <motion.span layoutId="note-pill" className="absolute inset-0 -z-0 rounded-full" style={{ background: C.bean }} transition={{ duration: reduced ? 0 : 0.3, ease: [0.23, 1, 0.32, 1] }} />}
                  <span className="relative" style={{ color: active === c.id ? C.cream : C.bean }}>{c.name[lang]}</span>
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-2 overflow-x-auto px-[var(--gutter)] pb-2 text-sm lg:px-0" role="group" aria-label={T.filters[lang]}>
              {(Object.keys(dietNames) as Diet[]).map((d) => {
                const on = diets.includes(d);
                return (
                  <button key={d} type="button" aria-pressed={on} onClick={() => setDiets(on ? diets.filter((x) => x !== d) : [...diets, d])} className="min-h-9 shrink-0 rounded-full border-2 px-3" style={{ borderColor: on ? C.red : `${C.bean}30`, background: on ? C.red : "transparent", color: on ? "#fff" : C.bean }}>
                    {dietNames[d][lang]}
                  </button>
                );
              })}
              {diets.length > 0 && (
                <button type="button" onClick={() => setDiets([])} className="min-h-9 px-2 underline underline-offset-4">{T.clear[lang]}</button>
              )}
            </div>
          </div>

          {menuCats.map((c) => {
            const items = menu.filter((m) => m.cat === c.id);
            const shown = items.filter(visible);
            return (
              <section key={c.id} id={`cat-${c.id}`} data-cat={c.id} aria-labelledby={`h-${c.id}`} className="scroll-mt-28 px-[var(--gutter)] pt-10 lg:px-0">
                <h2 id={`h-${c.id}`} className="text-[2rem] italic">{c.name[lang]}</h2>
                {shown.length === 0 && <p className="py-4 italic" style={{ color: C.soft }}>{T.none[lang]}</p>}
                <ul>
                  {shown.map((m) => (
                    <li key={m.id} className="flex items-start gap-4 border-b py-4" style={{ borderColor: `${C.bean}1a` }}>
                      <button type="button" onClick={() => openItem(m)} className="min-w-0 flex-1 text-start">
                        <span className="block text-[1.2rem] font-semibold">{m.name[lang]}</span>
                        <span className="mt-0.5 block" style={{ color: C.soft }}>{m.text[lang]}</span>
                        {m.diet.length > 0 && (
                          <span className="mt-2 flex flex-wrap gap-1.5 text-xs">
                            {m.diet.map((d) => (
                              <span key={d} className="rounded-full px-2 py-0.5" style={{ background: C.sand }}>{dietNames[d][lang]}</span>
                            ))}
                          </span>
                        )}
                      </button>
                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <span className="tabular text-lg">{formatLYD(m.price, lang)}</span>
                        <button type="button" onClick={() => quickAdd(m)} aria-label={`${T.add[lang]} ${m.name[lang]}`} className="flex min-h-10 items-center gap-1 rounded-full px-4 text-sm font-semibold text-white active:scale-95" style={{ background: C.red }}>
                          + {T.add[lang]}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
          <div className="h-16" />
        </main>

        {/* Desktop: the order lives beside the menu */}
        <aside className="hidden lg:block" aria-labelledby="order-side">
          <div className="sticky top-6 mt-8 rounded-[1.75rem] p-6" style={{ background: C.sand }}>
            <h2 id="order-side" className="text-2xl italic">
              {T.order[lang]} · {T.table[lang]} {table}
            </h2>
            <OrderList lang={lang} lines={lines} setLines={setLines} note={note} setNote={setNote} onShow={() => setStaff(true)} />
          </div>
        </aside>
      </div>

      {/* Phone: a floating order bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 p-3 lg:hidden">
        <button type="button" onClick={() => setOrderOpen(true)} className="flex min-h-14 w-full items-center justify-between rounded-full px-6 text-white shadow-[0_12px_30px_-10px_rgba(58,34,25,.6)]" style={{ background: C.bean }} aria-haspopup="dialog">
          <span aria-live="polite">{count ? `${T.view[lang]} · ${count} ${T.items[lang]}` : T.order[lang]}</span>
          <span className="tabular">{formatLYD(total, lang)}</span>
        </button>
      </div>

      <Sheet open={!!item} onClose={closeItem} label={item ? item.name[lang] : T.details[lang]}>
        {item && (
          <div>
            <h2 className="text-[2rem] italic leading-tight">{item.name[lang]}</h2>
            <p className="mt-2" style={{ color: C.soft }}>{item.text[lang]}</p>
            {hasOptions(item) && (
              <Choice legend={T.size[lang]} value={opt.size} onChange={(v) => setOpt({ ...opt, size: v })} options={[{ v: "single", label: T.single[lang] }, { v: "double", label: T.double[lang], extra: `+${DOUBLE}` }]} />
            )}
            {takesMilk(item) && (
              <Choice legend={T.milk[lang]} value={opt.milk} onChange={(v) => setOpt({ ...opt, milk: v })} options={[{ v: "regular", label: T.regular[lang] }, { v: "oat", label: T.oat[lang], extra: `+${OAT}` }]} />
            )}
            <div className="mt-6 flex items-center justify-between">
              <span className="text-sm" style={{ color: C.soft }}>{T.qty[lang]}</span>
              <div className="flex items-center gap-2" role="group" aria-label={T.qty[lang]}>
                <button type="button" className="size-11 rounded-full border-2 text-xl disabled:opacity-30" style={{ borderColor: `${C.bean}30` }} disabled={opt.qty <= 1} onClick={() => setOpt({ ...opt, qty: opt.qty - 1 })} aria-label={`${T.qty[lang]} −`}>−</button>
                <output aria-live="polite" className="tabular w-8 text-center text-xl">{opt.qty}</output>
                <button type="button" className="size-11 rounded-full border-2 text-xl" style={{ borderColor: `${C.bean}30` }} onClick={() => setOpt({ ...opt, qty: Math.min(9, opt.qty + 1) })} aria-label={`${T.qty[lang]} +`}>+</button>
              </div>
            </div>
            <button
              type="button"
              data-autofocus
              onClick={() => {
                addLine(item, hasOptions(item) ? opt.size : "single", takesMilk(item) ? opt.milk : null, opt.qty);
                setItem(null);
              }}
              className="mt-6 flex min-h-14 w-full items-center justify-between rounded-full px-6 text-lg font-semibold text-white"
              style={{ background: C.red }}
            >
              <span>{T.addTo[lang]}</span>
              <span className="tabular">{formatLYD((item.price + (hasOptions(item) && opt.size === "double" ? DOUBLE : 0) + (takesMilk(item) && opt.milk === "oat" ? OAT : 0)) * opt.qty, lang)}</span>
            </button>
          </div>
        )}
      </Sheet>

      <Sheet open={orderOpen} onClose={closeOrder} label={T.order[lang]}>
        <h2 className="text-2xl italic">
          {T.order[lang]} · {T.table[lang]} {table}
        </h2>
        <OrderList lang={lang} lines={lines} setLines={setLines} note={note} setNote={setNote} onShow={() => { setOrderOpen(false); setStaff(true); }} />
      </Sheet>

      {/* Show-to-staff mode: large, high-contrast, readable across a counter */}
      {staff && (
        <div ref={staffRef} role="dialog" aria-modal="true" aria-label={T.show[lang]} className="fixed inset-0 z-[80] overflow-y-auto p-8" style={{ background: C.bean, color: C.cream }}>
          <div className="mx-auto max-w-2xl">
            <div className="flex items-start justify-between gap-6">
              <p className="text-[clamp(3rem,12vw,6rem)] italic leading-none">
                {T.table[lang]} <span className="tabular not-italic" style={{ color: C.saffron }}>{table}</span>
              </p>
              <button type="button" onClick={closeStaff} className="min-h-12 rounded-full border-2 border-white/40 px-5">{T.close[lang]}</button>
            </div>
            <ul className="mt-10 grid gap-4 text-[clamp(1.6rem,5vw,2.4rem)] leading-tight">
              {lines.map((l) => {
                const m = menu.find((x) => x.id === l.id)!;
                return (
                  <li key={l.key} className="flex gap-4">
                    <span className="tabular" style={{ color: C.saffron }}>{l.qty}×</span>
                    <span>
                      {m.name[lang]}
                      <span className="block text-[0.55em] opacity-75">{[hasOptions(m) && (l.size === "double" ? T.double[lang] : T.single[lang]), l.milk && T[l.milk][lang]].filter(Boolean).join(" · ")}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
            {note && <p className="mt-8 border-t border-white/20 pt-4 text-2xl italic">“{note}”</p>}
            <p className="tabular mt-10 text-3xl">{formatLYD(total, lang)}</p>
            <p className="mt-6 text-sm opacity-70">{T.staffNote[lang]}</p>
          </div>
        </div>
      )}
    </div>
  );
}
