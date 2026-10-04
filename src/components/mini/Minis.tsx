"use client";

/**
 * Miniature working versions of the five concepts, sized for the hero
 * viewfinder and the work gallery stage. Each uses the concept's own palette
 * and type voice, and every control changes real state.
 */
import { useMemo, useState } from "react";
import {
  dayNames,
  districts,
  doctors,
  listings,
  menu,
  menuCats,
  products,
  rooms,
  SAHRA_GUEST_SUPPLEMENT,
  slotTaken,
  slotTimes,
  specialties,
  type Diet,
} from "@/lib/concept-data";
import { formatLYD, type Locale } from "@/lib/i18n";
import type { ProjectSlug } from "@/lib/projects";
import { NuraObject } from "./NuraObject";
import { SahraScene } from "@/components/scenes/Scenes";

type MiniProps = { lang: Locale; compact?: boolean };

const SERIF = 'ui-serif, "Iowan Old Style", "Noto Naskh Arabic", Georgia, serif';
const WIDE = "var(--font-archivo), var(--font-readex), sans-serif";

function Stepper({ value, min, max, onChange, label, dec, inc, className = "" }: { value: number; min: number; max: number; onChange: (v: number) => void; label: string; dec: string; inc: string; className?: string }) {
  return (
    <div className={`flex items-center ${className}`} role="group" aria-label={label}>
      <button type="button" aria-label={dec} disabled={value <= min} onClick={() => onChange(value - 1)} className="size-9 text-lg disabled:opacity-35">
        −
      </button>
      <output aria-live="polite" className="tabular w-8 text-center font-semibold">
        {value}
      </output>
      <button type="button" aria-label={inc} disabled={value >= max} onClick={() => onChange(value + 1)} className="size-9 text-lg disabled:opacity-35">
        +
      </button>
    </div>
  );
}

/* SAHRA ─ stay planner */
export function SahraMini({ lang, compact }: MiniProps) {
  const ar = lang === "ar";
  const [room, setRoom] = useState(rooms[1].id);
  const [nights, setNights] = useState(3);
  const [guests, setGuests] = useState(2);
  const r = rooms.find((x) => x.id === room)!;
  const extra = Math.max(0, guests - 2) * SAHRA_GUEST_SUPPLEMENT;
  const total = (r.rate + extra) * nights;
  return (
    <div className="flex h-full flex-col bg-[#EFE8DA] text-[#1B1A17]" style={{ fontFamily: SERIF }}>
      <div className="flex items-baseline justify-between border-b border-[#1B1A17]/15 px-5 py-3">
        <span className="text-xl tracking-[0.3em]" style={{ fontFamily: SERIF }}>SAHRA</span>
        <span className="text-xs italic opacity-70">{ar ? "خطّط إقامتك" : "Plan your stay"}</span>
      </div>
      <div className="relative h-20 shrink-0 overflow-hidden sm:h-24" aria-hidden="true">
        <SahraScene className="absolute inset-0 h-full w-full" idPrefix={`mini-sahra-${compact ? "c" : "f"}`} />
      </div>
      <div className="grid flex-1 content-start gap-4 p-5">
        <fieldset>
          <legend className="mb-2 text-xs uppercase tracking-widest opacity-70">{ar ? "الغرفة" : "Room"}</legend>
          <div className="grid grid-cols-3 gap-1.5">
            {rooms.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={room === x.id}
                onClick={() => setRoom(x.id)}
                className={`min-h-11 border px-2 py-2 text-start text-sm leading-tight transition-colors ${
                  room === x.id ? "border-[#1B1A17] bg-[#1B1A17] text-[#EFE8DA]" : "border-[#1B1A17]/25"
                }`}
              >
                {x.name[lang]}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="grid grid-cols-2 gap-3">
          <div className="border-t border-[#1B1A17]/20 pt-2">
            <span className="text-xs uppercase tracking-widest opacity-70">{ar ? "الليالي" : "Nights"}</span>
            <Stepper value={nights} min={1} max={14} onChange={setNights} label={ar ? "عدد الليالي" : "Nights"} dec={ar ? "ليلة أقل" : "One fewer night"} inc={ar ? "ليلة أكثر" : "One more night"} />
          </div>
          <div className="border-t border-[#1B1A17]/20 pt-2">
            <span className="text-xs uppercase tracking-widest opacity-70">{ar ? "الضيوف" : "Guests"}</span>
            <Stepper value={guests} min={1} max={r.sleeps} onChange={setGuests} label={ar ? "عدد الضيوف" : "Guests"} dec={ar ? "ضيف أقل" : "One fewer guest"} inc={ar ? "ضيف أكثر" : "One more guest"} />
          </div>
        </div>
        {!compact && <p className="text-sm italic leading-relaxed opacity-80">{r.text[lang]}</p>}
      </div>
      <div className="flex items-end justify-between bg-[#1F4FA0] px-5 py-4 text-[#F4EFE4]">
        <span className="text-xs uppercase tracking-widest opacity-80">{ar ? "تقدير الإقامة" : "Stay estimate"}</span>
        <output aria-live="polite" className="tabular text-2xl">{formatLYD(total, lang)}</output>
      </div>
    </div>
  );
}

/* NURA ─ variant picker and bag */
export function NuraMini({ lang }: MiniProps) {
  const ar = lang === "ar";
  const [pid, setPid] = useState(products[0].id);
  const p = products.find((x) => x.id === pid)!;
  const [finish, setFinish] = useState<Record<string, string>>({});
  const [size, setSize] = useState<Record<string, string>>({});
  const [bag, setBag] = useState(0);
  const [sum, setSum] = useState(0);
  const f = p.finishes.find((x) => x.id === finish[p.id]) ?? p.finishes[0];
  const s = p.sizes.find((x) => x.id === size[p.id]) ?? p.sizes[1];
  return (
    <div className="flex h-full flex-col bg-[#16181A] text-[#EDEBE4]" style={{ fontFamily: WIDE }}>
      <div className="flex items-center justify-between px-5 py-3 text-xs uppercase" style={{ fontStretch: "125%", letterSpacing: ar ? 0 : "0.2em" }}>
        <span className="font-bold">NURA</span>
        <span aria-live="polite" className="tabular">
          {ar ? "الحقيبة" : "Bag"} ({bag}) · {formatLYD(sum, lang)}
        </span>
      </div>
      <div className="flex gap-1 px-5" role="group" aria-label={ar ? "المنتج" : "Product"}>
        {products.map((x) => (
          <button key={x.id} type="button" aria-pressed={pid === x.id} onClick={() => setPid(x.id)} className={`min-h-10 flex-1 border-b-2 text-sm ${pid === x.id ? "border-[#2F5BFF]" : "border-white/15 opacity-70"}`}>
            {x.name[lang]}
          </button>
        ))}
      </div>
      <div className="relative flex flex-1 items-center justify-center overflow-hidden">
        <div aria-hidden="true" className="absolute inset-y-0 end-0 w-1/3 bg-gradient-to-l from-[#2F5BFF]/30 to-transparent rtl:bg-gradient-to-r" />
        <NuraObject kind={p.id} color={f.hex} scale={s.id === "s" ? 0.8 : s.id === "l" ? 1.12 : 0.95} className="relative aspect-square h-[min(78%,20rem)] min-h-28 w-auto transition-transform duration-300" />
      </div>
      <div className="grid gap-3 px-5 pb-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-2" role="group" aria-label={ar ? "اللون" : "Finish"}>
            {p.finishes.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={f.id === x.id}
                aria-label={x.name[lang]}
                onClick={() => setFinish({ ...finish, [p.id]: x.id })}
                className={`size-8 ring-offset-2 ring-offset-[#16181A] ${f.id === x.id ? "ring-2 ring-[#EDEBE4]" : ""}`}
                style={{ background: x.hex }}
              />
            ))}
          </div>
          <div className="flex" role="group" aria-label={ar ? "الحجم" : "Size"}>
            {p.sizes.map((x) => (
              <button key={x.id} type="button" aria-pressed={s.id === x.id} onClick={() => setSize({ ...size, [p.id]: x.id })} className={`tabular min-h-9 px-2 text-xs ${s.id === x.id ? "bg-[#EDEBE4] text-[#16181A]" : "opacity-70"}`} dir="ltr">
                {x.label}
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setBag((b) => b + 1);
            setSum((v) => v + s.price);
          }}
          className="flex min-h-11 items-center justify-between bg-[#2F5BFF] px-4 text-sm font-semibold text-white active:translate-y-px"
        >
          <span>{ar ? "أضف إلى الحقيبة" : "Add to bag"}</span>
          <span className="tabular">{formatLYD(s.price, lang)}</span>
        </button>
      </div>
    </div>
  );
}

/* NŌTE ─ menu with filters and an order */
export function NoteMini({ lang, compact }: MiniProps) {
  const ar = lang === "ar";
  const [cat, setCat] = useState("coffee");
  const [diet, setDiet] = useState<Diet | null>(null);
  const [order, setOrder] = useState<Record<string, number>>({});
  const items = menu.filter((m) => m.cat === cat && (!diet || m.diet.includes(diet))).slice(0, compact ? 3 : 6);
  const count = Object.values(order).reduce((a, b) => a + b, 0);
  const total = Object.entries(order).reduce((a, [id, q]) => a + (menu.find((m) => m.id === id)?.price ?? 0) * q, 0);
  return (
    <div className="flex h-full flex-col bg-[#FBF4EA] text-[#3A2219]" style={{ fontFamily: SERIF }}>
      <div className="flex items-center justify-between bg-[#B4432C] px-5 py-3 text-[#FBF4EA]">
        <span className="text-xl italic">{ar ? "نوتة" : "nōte"}</span>
        <span className="text-xs">{ar ? "طاولة 4" : "Table 4"}</span>
      </div>
      <div className="flex gap-1 overflow-x-auto px-4 pt-3" role="group" aria-label={ar ? "الأقسام" : "Sections"}>
        {menuCats.map((c) => (
          <button key={c.id} type="button" aria-pressed={cat === c.id} onClick={() => setCat(c.id)} className={`min-h-9 shrink-0 rounded-full px-3 text-sm ${cat === c.id ? "bg-[#3A2219] text-[#FBF4EA]" : "bg-[#E7D6C1]"}`}>
            {c.name[lang]}
          </button>
        ))}
      </div>
      <div className="flex gap-2 px-4 pt-2 text-xs" role="group" aria-label={ar ? "فلتر غذائي" : "Diet filter"}>
        {(["vegan", "nutfree"] as Diet[]).map((d) => (
          <button key={d} type="button" aria-pressed={diet === d} onClick={() => setDiet(diet === d ? null : d)} className={`min-h-8 border px-2 ${diet === d ? "border-[#B4432C] bg-[#B4432C] text-white" : "border-[#3A2219]/25"}`}>
            {d === "vegan" ? (ar ? "نباتي" : "Vegan") : ar ? "بدون مكسّرات" : "Nut-free"}
          </button>
        ))}
      </div>
      <ul className="flex-1 divide-y divide-[#3A2219]/10 px-4 pt-1">
        {items.length === 0 && <li className="py-4 text-sm italic opacity-70">{ar ? "لا أصناف بهذا الفلتر هنا." : "Nothing here with that filter."}</li>}
        {items.map((m) => (
          <li key={m.id} className="flex items-center justify-between gap-3 py-2">
            <div className="min-w-0">
              <p className="truncate font-semibold">{m.name[lang]}</p>
              <p className="tabular text-xs opacity-70">{formatLYD(m.price, lang)}</p>
            </div>
            <Stepper
              value={order[m.id] ?? 0}
              min={0}
              max={9}
              onChange={(v) => setOrder({ ...order, [m.id]: v })}
              label={m.name[lang]}
              dec={ar ? `إزالة ${m.name.ar}` : `Remove ${m.name.en}`}
              inc={ar ? `إضافة ${m.name.ar}` : `Add ${m.name.en}`}
            />
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between bg-[#3A2219] px-5 py-3 text-[#FBF4EA]">
        <span aria-live="polite" className="text-sm">{ar ? `طلبك: ${count} أصناف` : `Your order: ${count} items`}</span>
        <output className="tabular text-lg">{formatLYD(total, lang)}</output>
      </div>
    </div>
  );
}

/* MADAR ─ map and list in sync */
export function MadarMini({ lang }: MiniProps) {
  const ar = lang === "ar";
  const [district, setDistrict] = useState<string | null>("andalus");
  const [beds, setBeds] = useState(0);
  const results = useMemo(() => listings.filter((l) => (!district || l.district === district) && l.beds >= beds), [district, beds]);
  return (
    <div className="flex h-full flex-col bg-[#E8ECEE] text-[#0F1417]" style={{ fontFamily: WIDE, fontStretch: "80%" }}>
      <div className="flex items-center justify-between border-b border-[#0F1417]/15 px-5 py-3">
        <span className="font-bold tracking-wide">MADAR</span>
        <span aria-live="polite" className="tabular text-sm">
          {ar ? `${results.length} عقارات` : `${results.length} homes`}
        </span>
      </div>
      <svg viewBox="0 0 460 230" className="w-full bg-[#C7D0D5]" role="group" aria-label={ar ? "خريطة الأحياء" : "District map"}>
        <rect width="460" height="34" fill="#9FB4C2" />
        {districts.map((d) => (
          <g key={d.id}>
            <path
              d={d.path}
              role="button"
              tabIndex={0}
              aria-pressed={district === d.id}
              aria-label={d.name[lang]}
              onClick={() => setDistrict(district === d.id ? null : d.id)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setDistrict(district === d.id ? null : d.id))}
              className="cursor-pointer outline-none transition-colors focus-visible:stroke-[#0F1417] focus-visible:stroke-[3]"
              fill={district === d.id ? "#2E3A42" : "#E8ECEE"}
              stroke="#8C9AA3"
              strokeWidth="1.5"
            />
            <text x={d.cx} y={d.cy} textAnchor="middle" className="pointer-events-none text-[11px]" fill={district === d.id ? "#E8ECEE" : "#2E3A42"}>
              {d.name[lang]}
            </text>
          </g>
        ))}
        {results.map((l) => (
          <rect key={l.id} x={l.x - 5} y={l.y - 5} width="10" height="10" fill="#B5523B" />
        ))}
      </svg>
      <div className="flex gap-1 px-4 py-2 text-sm" role="group" aria-label={ar ? "عدد الغرف" : "Bedrooms"}>
        {[0, 1, 2, 3].map((b) => (
          <button key={b} type="button" aria-pressed={beds === b} onClick={() => setBeds(b)} className={`tabular min-h-9 flex-1 ${beds === b ? "bg-[#2E3A42] text-white" : "bg-white/70"}`}>
            {b === 0 ? (ar ? "الكل" : "Any") : `${b}+`}
          </button>
        ))}
      </div>
      <ul className="flex-1 overflow-hidden px-4 text-sm">
        {results.slice(0, 6).map((l) => (
          <li key={l.id} className="flex items-center justify-between border-t border-[#0F1417]/10 py-2">
            <span className="truncate">{l.title[lang]}</span>
            <span className="tabular shrink-0 font-semibold">{formatLYD(l.price, lang)}</span>
          </li>
        ))}
        {results.length === 0 && <li className="py-3 opacity-70">{ar ? "لا نتائج. وسّع البحث." : "No results. Widen the search."}</li>}
      </ul>
    </div>
  );
}

/* SANAD ─ three-step booking */
export function SanadMini({ lang, compact }: MiniProps) {
  const ar = lang === "ar";
  const [spec, setSpec] = useState<string | null>(null);
  const [day, setDay] = useState<number | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const doc = doctors.find((d) => d.spec === spec);
  const step = !spec ? 0 : day === null ? 1 : !slot ? 2 : 3;
  const reset = () => {
    setSpec(null);
    setDay(null);
    setSlot(null);
  };
  const labels = ar ? ["التخصص", "اليوم", "الموعد", "تم"] : ["Specialty", "Day", "Time", "Done"];
  return (
    <div className="flex h-full flex-col bg-[#F2F7F5] text-[#14304A]" style={{ fontFamily: "var(--font-readex), var(--font-archivo), sans-serif" }}>
      <div className="flex items-center justify-between px-5 py-3">
        <span className="font-semibold">{ar ? "سند" : "SANAD"} <span className="text-[#2F8F75]">+</span></span>
        <ol className="flex gap-1" aria-label={ar ? "خطوات الحجز" : "Booking steps"}>
          {labels.map((l, i) => (
            <li key={l} aria-current={i === step ? "step" : undefined} className={`h-1.5 w-6 rounded-full ${i <= step ? "bg-[#2F8F75]" : "bg-[#CDE7DE]"}`}>
              <span className="sr-only">{l}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="flex-1 px-5" aria-live="polite">
        {!compact && step === 0 && (
          <p className="mb-5 mt-2 max-w-[18ch] text-[clamp(1.6rem,2.6vw,2.4rem)] font-semibold leading-tight">
            {ar ? "احجز موعدك في أقل من دقيقة." : "Book a doctor in under a minute."}
          </p>
        )}
        <p className="mb-3 text-sm text-[#2F8F75]">{labels[step]}</p>
        {step === 0 && (
          <div className="grid grid-cols-2 gap-2">
            {specialties.map((s) => (
              <button key={s.id} type="button" onClick={() => setSpec(s.id)} className="min-h-16 rounded-xl bg-white p-3 text-start shadow-[0_1px_2px_rgba(20,48,74,.12)] active:translate-y-px">
                <span className="block font-semibold">{s.name[lang]}</span>
                <span className="text-xs opacity-70">{s.text[lang]}</span>
              </button>
            ))}
          </div>
        )}
        {step === 1 && doc && (
          <div>
            <p className="mb-2 font-semibold">{doc.name[lang]}</p>
            <div className="grid grid-cols-5 gap-1.5">
              {dayNames[lang].map((d, i) => (
                <button key={d} type="button" disabled={!doc.days.includes(i)} onClick={() => setDay(i)} className="min-h-12 rounded-lg bg-white text-sm disabled:bg-transparent disabled:opacity-35">
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}
        {step === 2 && doc && day !== null && (
          <div className="grid grid-cols-4 gap-1.5">
            {slotTimes.map((t, i) => (
              <button key={t} type="button" disabled={slotTaken(doc.id, day, i)} onClick={() => setSlot(t)} className="tabular min-h-10 rounded-lg bg-white text-sm disabled:bg-transparent disabled:line-through disabled:opacity-35" dir="ltr">
                {t}
              </button>
            ))}
          </div>
        )}
        {step === 3 && doc && day !== null && (
          <div className="rounded-xl bg-white p-4 shadow-[0_1px_2px_rgba(20,48,74,.12)]">
            <p className="font-semibold">{doc.name[lang]}</p>
            <p className="tabular mt-1 text-sm">
              {dayNames[lang][day]} · <span dir="ltr">{slot}</span> · {formatLYD(doc.fee, lang)}
            </p>
            <p className="mt-2 text-xs opacity-70">{ar ? "ملخّص تجريبي. لم يُحجز موعد حقيقي." : "Demo summary. No real appointment was booked."}</p>
          </div>
        )}
      </div>
      <div className="flex justify-between px-5 py-4 text-sm">
        <button type="button" onClick={reset} disabled={step === 0} className="min-h-10 underline underline-offset-4 disabled:opacity-0">
          {ar ? "ابدأ من جديد" : "Start over"}
        </button>
        {step === 3 && <span className="rounded-full bg-[#2F8F75] px-3 py-2 text-white">{ar ? "جاهز للتأكيد" : "Ready to confirm"}</span>}
      </div>
    </div>
  );
}

export const MINIS: Record<ProjectSlug, (p: MiniProps) => React.ReactElement> = {
  sahra: SahraMini,
  nura: NuraMini,
  note: NoteMini,
  madar: MadarMini,
  sanad: SanadMini,
};
