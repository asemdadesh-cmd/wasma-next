"use client";

import { useReducedMotion } from "framer-motion";
import { IBM_Plex_Sans, IBM_Plex_Sans_Arabic } from "next/font/google";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { districts, listings, type Listing } from "@/lib/concept-data";
import { formatLYD, type Locale } from "@/lib/i18n";
import type { PhotoMap } from "@/lib/photos";

const plex = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--f-madar", display: "swap" });
const plexAr = IBM_Plex_Sans_Arabic({ subsets: ["arabic"], weight: ["400", "500", "600"], variable: "--f-madar-ar", display: "swap" });

type Props = { lang: Locale; photos: PhotoMap };
const C = { bg: "#EEF1F2", panel: "#FFFFFF", line: "#D3DADE", ink: "#0F1417", soft: "#56636B", slate: "#2E3A42", brick: "#B5523B", water: "#9FB4C2" };

const T = {
  search: { ar: "ابحث بالاسم أو الحيّ", en: "Search by name or district" },
  district: { ar: "الحيّ", en: "District" },
  all: { ar: "كل الأحياء", en: "All districts" },
  beds: { ar: "الغرف", en: "Bedrooms" },
  any: { ar: "الكل", en: "Any" },
  budget: { ar: "أقصى إيجار شهري", en: "Max monthly rent" },
  sort: { ar: "الترتيب", en: "Sort" },
  sorts: { ar: { low: "الأقل سعرًا", high: "الأعلى سعرًا", area: "الأكبر مساحة" }, en: { low: "Lowest price", high: "Highest price", area: "Largest area" } },
  results: { ar: "عقارًا", en: "homes" },
  month: { ar: "شهريًا", en: "/ month" },
  studio: { ar: "مكتب", en: "Office" },
  bedsN: { ar: "غرف", en: "bd" },
  compare: { ar: "قارن", en: "Compare" },
  compareN: { ar: "المقارنة", en: "Compare" },
  clear: { ar: "مسح", en: "Clear" },
  max3: { ar: "حتى 3 عقارات", en: "Up to 3 homes" },
  reset: { ar: "إعادة ضبط الفلاتر", en: "Reset filters" },
  none: { ar: "لا عقارات تطابق بحثك.", en: "No homes match your search." },
  list: { ar: "القائمة", en: "List" },
  map: { ar: "الخريطة", en: "Map" },
  close: { ar: "إغلاق", en: "Close" },
  perM: { ar: "السعر لكل م²", en: "Price per m²" },
  area: { ar: "المساحة", en: "Area" },
  price: { ar: "الإيجار", en: "Rent" },
  sample: { ar: "بيانات تجريبية لمفهوم خيالي. لا توجد عقارات حقيقية.", en: "Sample data for a fictional concept. No real listings." },
  mapLabel: { ar: "خريطة طرابلس التوضيحية", en: "Illustrative map of Tripoli" },
  sea: { ar: "البحر المتوسط", en: "Mediterranean Sea" },
};

const MIN = 500;
const MAX = 8000;

function Floorplan({ beds, className }: { beds: number; className?: string }) {
  const rooms = Math.max(1, beds);
  return (
    <svg viewBox="0 0 120 80" className={className} aria-hidden="true">
      <rect x="4" y="4" width="112" height="72" fill="#F6F8F9" stroke={C.slate} strokeWidth="2" />
      {Array.from({ length: rooms }, (_, i) => (
        <rect key={i} x={4 + (i * 112) / rooms} y="4" width={112 / rooms} height="36" fill="none" stroke={C.slate} strokeWidth="1.2" />
      ))}
      <line x1="4" y1="56" x2="70" y2="56" stroke={C.slate} strokeWidth="1.2" />
      <rect x="84" y="50" width="20" height="18" fill={C.water} opacity=".5" />
      <path d={`M${30} 40 q8 8 16 0`} fill="none" stroke={C.brick} strokeWidth="1.2" />
    </svg>
  );
}

function MapView({ lang, results, district, setDistrict, focus, setFocus }: { lang: Locale; results: Listing[]; district: string; setDistrict: (d: string) => void; focus: string | null; setFocus: (id: string) => void }) {
  const reduced = useReducedMotion();
  const d = districts.find((x) => x.id === district);
  // Close in on the chosen district.
  const s = d ? 1.9 : 1;
  const tx = d ? 230 - s * d.cx : 0;
  const ty = d ? 130 - s * d.cy : 0;
  return (
    <div className="relative h-full overflow-hidden" style={{ background: C.water }}>
      <svg viewBox="0 0 460 240" className="h-full w-full" role="group" aria-label={T.mapLabel[lang]}>
        <g
          style={{
            transform: `translate(${tx}px, ${ty}px) scale(${s})`,
            transformOrigin: "0 0",
            transformBox: "view-box",
            transition: reduced ? "none" : "transform 700ms cubic-bezier(0.23, 1, 0.32, 1)",
          }}
        >
          <text x="230" y="20" textAnchor="middle" fill="#ffffff" opacity=".85" fontSize="10" letterSpacing="2">
            {T.sea[lang]}
          </text>
          <path d="M0 40 C80 30 160 22 230 24 C320 26 400 40 460 52 V240 H0 Z" fill="#DCE3E6" />
          {districts.map((x) => (
            <g key={x.id}>
              <path
                d={x.path}
                role="button"
                tabIndex={0}
                aria-pressed={district === x.id}
                aria-label={x.name[lang]}
                onClick={() => setDistrict(district === x.id ? "" : x.id)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setDistrict(district === x.id ? "" : x.id))}
                fill={district === x.id ? "#FFFFFF" : "#E8ECEE"}
                stroke={district === x.id ? C.slate : "#A9B6BD"}
                strokeWidth={district === x.id ? 2 : 1}
                className="cursor-pointer outline-none focus-visible:stroke-[#0F1417] focus-visible:stroke-[3]"
              />
              <text x={x.cx} y={x.cy - 14} textAnchor="middle" fontSize="9" fill={C.soft} className="pointer-events-none">
                {x.name[lang]}
              </text>
            </g>
          ))}
          {results.map((l) => {
            const on = focus === l.id;
            return (
              <g key={l.id} transform={`translate(${l.x} ${l.y})`} className="cursor-pointer" onClick={() => setFocus(l.id)}>
                <rect x={on ? -9 : -6} y={on ? -9 : -6} width={on ? 18 : 12} height={on ? 18 : 12} fill={on ? C.ink : C.brick} />
                {on && (
                  <text y="-14" textAnchor="middle" fontSize="9" fontWeight="600" fill={C.ink}>
                    {formatLYD(l.price, lang)}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>
      <p className="absolute bottom-2 start-2 bg-white/85 px-2 py-1 text-[0.7rem]" style={{ color: C.soft }}>{T.sample[lang]}</p>
    </div>
  );
}

export function MadarSite({ lang }: Props) {
  const [q, setQ] = useState("");
  const [district, setDistrict] = useState("");
  const [beds, setBeds] = useState(0);
  const [budget, setBudget] = useState(MAX);
  const [sort, setSort] = useState<"low" | "high" | "area">("low");
  const [focus, setFocus] = useState<string | null>(null);
  const [compare, setCompare] = useState<string[]>([]);
  const [view, setView] = useState<"list" | "map">("list");
  const [dialog, setDialog] = useState(false);
  const dlg = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    return listings
      .filter((l) => (!district || l.district === district) && l.beds >= beds && l.price <= budget)
      .filter((l) => {
        if (!term) return true;
        const dn = districts.find((d) => d.id === l.district)!.name;
        return [l.title.ar, l.title.en, dn.ar, dn.en].some((s) => s.toLowerCase().includes(term));
      })
      .sort((a, b) => (sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : b.area - a.area));
  }, [q, district, beds, budget, sort]);

  // The map follows your reading: the card in the middle of the list is highlighted.
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setFocus((e.target as HTMLElement).dataset.listing!)),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    document.querySelectorAll("[data-listing]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [results]);

  const focusFromMap = (id: string) => {
    setFocus(id);
    setView("list");
    requestAnimationFrame(() => document.getElementById(`l-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" }));
  };

  const closeDialog = useCallback(() => setDialog(false), []);
  useEffect(() => {
    if (!dialog) return;
    const prev = document.activeElement as HTMLElement | null;
    dlg.current?.querySelector<HTMLElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDialog();
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      prev?.focus();
    };
  }, [dialog, closeDialog]);

  const reset = () => {
    setQ("");
    setDistrict("");
    setBeds(0);
    setBudget(MAX);
  };
  const toggleCompare = (id: string) => setCompare((c) => (c.includes(id) ? c.filter((x) => x !== id) : c.length >= 3 ? c : [...c, id]));
  const compared = compare.map((id) => listings.find((l) => l.id === id)!);
  const dname = (id: string) => districts.find((d) => d.id === id)!.name[lang];

  const control = "min-h-11 w-full border bg-white px-3 text-[0.95rem] outline-none focus:border-[#0F1417]";
  return (
    <div className={`${plex.variable} ${plexAr.variable} min-h-screen`} style={{ background: C.bg, color: C.ink, fontFamily: "var(--f-madar), var(--f-madar-ar), sans-serif" }}>
      {/* App chrome replaces marketing navigation */}
      <header className="sticky top-0 z-40 border-b bg-white" style={{ borderColor: C.line }}>
        <div className="flex h-14 items-center gap-4 px-[var(--gutter)]">
          <span className="flex items-center gap-2 font-semibold tracking-wide">
            <span className="size-3" style={{ background: C.brick }} aria-hidden="true" /> MADAR
          </span>
          <label className="relative flex-1">
            <span className="sr-only">{T.search[lang]}</span>
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={T.search[lang]} className={`${control} max-w-md`} style={{ borderColor: C.line }} />
          </label>
          <span aria-live="polite" className="tabular hidden text-sm sm:block" style={{ color: C.soft }}>
            {results.length} {T.results[lang]}
          </span>
        </div>
        <div className="grid gap-3 border-t px-[var(--gutter)] py-3 sm:grid-cols-2 lg:grid-cols-4" style={{ borderColor: C.line }}>
          <label className="text-xs" style={{ color: C.soft }}>
            {T.district[lang]}
            <select value={district} onChange={(e) => setDistrict(e.target.value)} className={`${control} mt-1`} style={{ borderColor: C.line, color: C.ink }}>
              <option value="">{T.all[lang]}</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>{d.name[lang]}</option>
              ))}
            </select>
          </label>
          <fieldset className="text-xs" style={{ color: C.soft }}>
            <legend>{T.beds[lang]}</legend>
            <div className="mt-1 flex">
              {[0, 1, 2, 3, 4].map((b) => (
                <button key={b} type="button" aria-pressed={beds === b} onClick={() => setBeds(b)} className="tabular min-h-11 flex-1 border text-[0.95rem]" style={{ borderColor: C.line, background: beds === b ? C.slate : "#fff", color: beds === b ? "#fff" : C.ink }}>
                  {b === 0 ? T.any[lang] : `${b}+`}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="text-xs" style={{ color: C.soft }}>
            <span className="flex justify-between">
              {T.budget[lang]} <output className="tabular font-semibold" style={{ color: C.ink }}>{formatLYD(budget, lang)}</output>
            </span>
            <input type="range" min={MIN} max={MAX} step={100} value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="mt-3 w-full accent-[#B5523B]" />
          </label>
          <label className="text-xs" style={{ color: C.soft }}>
            {T.sort[lang]}
            <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className={`${control} mt-1`} style={{ borderColor: C.line, color: C.ink }}>
              {(Object.keys(T.sorts.en) as (keyof typeof T.sorts.en)[]).map((k) => (
                <option key={k} value={k}>{T.sorts[lang][k]}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex border-t lg:hidden" style={{ borderColor: C.line }} role="tablist" aria-label={`${T.list[lang]} / ${T.map[lang]}`}>
          {(["list", "map"] as const).map((v) => (
            <button key={v} type="button" role="tab" aria-selected={view === v} onClick={() => setView(v)} className="min-h-11 flex-1 text-sm font-semibold" style={{ boxShadow: view === v ? `inset 0 -3px 0 ${C.brick}` : "none" }}>
              {T[v][lang]}
            </button>
          ))}
        </div>
      </header>

      <main className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]" data-sc-act="pin">
        <h1 className="sr-only">MADAR · {lang === "ar" ? "بحث عقاري" : "Property search"}</h1>
        <section aria-label={T.list[lang]} className={`${view === "map" ? "hidden" : ""} px-[var(--gutter)] py-6 pb-32 lg:block`}>
          {results.length === 0 && (
            <div className="border bg-white p-8 text-center" style={{ borderColor: C.line }}>
              <p className="text-lg">{T.none[lang]}</p>
              <button type="button" onClick={reset} className="mt-4 min-h-11 px-5 font-semibold text-white" style={{ background: C.slate }}>{T.reset[lang]}</button>
            </div>
          )}
          <ul className="grid gap-3">
            {results.map((l) => {
              const on = focus === l.id;
              const inCompare = compare.includes(l.id);
              return (
                <li
                  key={l.id}
                  id={`l-${l.id}`}
                  data-listing={l.id}
                  onMouseEnter={() => setFocus(l.id)}
                  className="grid grid-cols-[7rem_1fr] gap-4 border bg-white p-3 transition-shadow sm:grid-cols-[9rem_1fr]"
                  style={{ borderColor: on ? C.ink : C.line, boxShadow: on ? `0 0 0 1px ${C.ink}` : "none" }}
                >
                  <Floorplan beds={l.beds} className="h-full w-full" />
                  <div className="min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="font-semibold leading-snug">{l.title[lang]}</h2>
                      <p className="tabular shrink-0 font-semibold">
                        {formatLYD(l.price, lang)} <span className="text-xs font-normal" style={{ color: C.soft }}>{T.month[lang]}</span>
                      </p>
                    </div>
                    <p className="mt-1 text-sm" style={{ color: C.soft }}>{dname(l.district)}</p>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                      <span className="tabular">
                        {l.beds === 0 ? T.studio[lang] : `${l.beds} ${T.bedsN[lang]}`} · {l.area} m²
                      </span>
                      <label className="flex min-h-10 cursor-pointer items-center gap-2">
                        <input type="checkbox" checked={inCompare} disabled={!inCompare && compare.length >= 3} onChange={() => toggleCompare(l.id)} className="size-4 accent-[#2E3A42]" />
                        {T.compare[lang]}
                      </label>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-6 text-xs" style={{ color: C.soft }}>{T.sample[lang]}</p>
        </section>
        <section aria-label={T.map[lang]} className={`${view === "list" ? "hidden" : ""} lg:block`}>
          <div className="sticky top-[13.5rem] h-[calc(100svh-14rem)] min-h-[22rem] lg:top-[9.5rem] lg:h-[calc(100svh-9.5rem)]">
            <MapView lang={lang} results={results} district={district} setDistrict={setDistrict} focus={focus} setFocus={focusFromMap} />
          </div>
        </section>
      </main>

      {compare.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white" style={{ borderColor: C.line }}>
          <div className="flex flex-wrap items-center gap-3 px-[var(--gutter)] py-3">
            <span className="text-sm font-semibold">{T.compareN[lang]} ({compare.length}/3)</span>
            <ul className="flex flex-1 flex-wrap gap-2 text-sm">
              {compared.map((l) => (
                <li key={l.id} className="flex items-center gap-1 border px-2 py-1" style={{ borderColor: C.line }}>
                  {l.title[lang]}
                  <button type="button" onClick={() => toggleCompare(l.id)} aria-label={`${T.clear[lang]} ${l.title[lang]}`} className="size-7">×</button>
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => setCompare([])} className="min-h-11 px-3 text-sm underline underline-offset-4">{T.clear[lang]}</button>
            <button type="button" disabled={compare.length < 2} onClick={() => setDialog(true)} className="min-h-11 px-5 font-semibold text-white disabled:opacity-40" style={{ background: C.brick }} title={T.max3[lang]}>
              {T.compare[lang]}
            </button>
          </div>
        </div>
      )}

      {dialog && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4" onClick={closeDialog}>
          <div ref={dlg} role="dialog" aria-modal="true" aria-labelledby="cmp-title" className="max-h-[90svh] w-full max-w-3xl overflow-auto bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 id="cmp-title" className="text-xl font-semibold">{T.compareN[lang]}</h2>
              <button type="button" onClick={closeDialog} className="min-h-11 px-3 underline underline-offset-4">{T.close[lang]}</button>
            </div>
            <table className="mt-6 w-full text-start text-[0.95rem]">
              <thead>
                <tr>
                  <th className="w-36" />
                  {compared.map((l) => (
                    <th key={l.id} scope="col" className="border-b p-2 text-start align-bottom font-semibold" style={{ borderColor: C.line }}>{l.title[lang]}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="tabular">
                {[
                  [T.district[lang], (l: Listing) => dname(l.district)],
                  [T.price[lang], (l: Listing) => formatLYD(l.price, lang)],
                  [T.area[lang], (l: Listing) => `${l.area} m²`],
                  [T.beds[lang], (l: Listing) => (l.beds === 0 ? T.studio[lang] : String(l.beds))],
                  [T.perM[lang], (l: Listing) => formatLYD(Math.round(l.price / l.area), lang)],
                ].map(([label, fn]) => {
                  const f = fn as (l: Listing) => string;
                  return (
                    <tr key={label as string}>
                      <th scope="row" className="border-b p-2 text-start font-normal" style={{ borderColor: C.line, color: C.soft }}>{label as string}</th>
                      {compared.map((l) => (
                        <td key={l.id} className="border-b p-2" style={{ borderColor: C.line }}>{f(l)}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
