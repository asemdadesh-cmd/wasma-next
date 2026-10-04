"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { Cormorant_Garamond, Noto_Naskh_Arabic } from "next/font/google";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Scene } from "@/components/scenes/Scene";
import { useIsDesktop } from "@/hooks/useMedia";
import { rooms, SAHRA_GUEST_SUPPLEMENT } from "@/lib/concept-data";
import { formatLYD, type L, type Locale } from "@/lib/i18n";
import type { PhotoMap } from "@/lib/photos";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--f-sahra", display: "swap" });
const naskh = Noto_Naskh_Arabic({ subsets: ["arabic"], weight: ["400", "500", "600"], variable: "--f-sahra-ar", display: "swap" });

type Props = { lang: Locale; photos: PhotoMap };

const C = { stone: "#ECE5D6", stone2: "#E2D8C4", ink: "#1B1A17", soft: "#5A5346", olive: "#5F6B3A", cobalt: "#1F4FA0" };

const copy = {
  nav: { ar: ["الفناء", "الغرف", "المائدة", "خطّط إقامتك"], en: ["Courtyard", "Rooms", "Table", "Plan a stay"] },
  title: { ar: "بيت من حجر على البحر.", en: "A house of stone by the sea." },
  sub: {
    ar: "صحرا منتجع صغير من اثنتي عشرة غرفة على الساحل الغربي. فناء وزيتونة ومسبح، والبحر في نهاية كل ممرّ.",
    en: "SAHRA is a small retreat of twelve rooms on the western coast. A courtyard, an olive tree, a pool, and the sea at the end of every corridor.",
  },
  meta: { ar: ["12 غرفة", "مسبح من حجر", "مائدة يومية"], en: ["12 rooms", "Stone pool", "A daily table"] },
  chapters: {
    ar: ["الفناء", "الغرف", "المائدة", "خطّط إقامتك"],
    en: ["The courtyard", "The rooms", "The table", "Plan your stay"],
  },
  courtyard: {
    ar: "كل شيء في صحرا يبدأ من الفناء. الجدران سميكة لتبقى باردة، والضوء يدخل من الأعلى، والستائر تتحرّك مع هواء البحر.",
    en: "Everything at SAHRA begins in the courtyard. Walls thick enough to stay cool, light from above, and curtains that move with the sea air.",
  },
  caption: { ar: "الفناء عند الخامسة مساءً. مشهد توضيحي لمفهوم خيالي.", en: "The courtyard at five in the afternoon. Illustration of a fictional concept." },
  roomsLead: { ar: "ثلاثة أنواع من الغرف، كلّها من الحجر نفسه. اسحب أو استخدم الأسهم.", en: "Three kinds of room, all of the same stone. Swipe, or use the arrows." },
  perNight: { ar: "لليلة", en: "per night" },
  sleeps: { ar: "يتّسع لـ", en: "Sleeps" },
  planThis: { ar: "خطّط بهذه الغرفة", en: "Plan with this room" },
  prev: { ar: "الغرفة السابقة", en: "Previous room" },
  next: { ar: "الغرفة التالية", en: "Next room" },
  table: {
    quote: { ar: "«نطبخ ما جاء به البحر والسوق هذا الصباح، ولا شيء غيره.»", en: "“We cook what the sea and the market brought this morning, and nothing else.”" },
    text: {
      ar: "تُقدَّم المائدة كل مساء في الفناء، لضيوف البيت فقط. قائمة قصيرة تتغيّر يوميًا: سمك اليوم على الحطب، خضار من مزارع قريبة، وخبز يُخبز في فرن الحجر. أخبرنا مسبقًا بما لا تأكله، ونطبخ لك على مهل.",
      en: "The table is set each evening in the courtyard, for guests of the house only. A short menu that changes daily: the day's fish over wood, vegetables from nearby farms, and bread from the stone oven. Tell us what you don't eat, and we'll cook for you slowly.",
    },
    tonight: { ar: "هذا المساء", en: "Tonight" },
    dishes: {
      ar: ["سلطة طماطم وزيت زيتون أول عصرة", "سمك القاروص على الحطب", "كسكسي بالخضار والحمّص", "تمر الجفرة ولبن بارد"],
      en: ["Tomatoes with first-press olive oil", "Sea bass over wood", "Couscous with vegetables and chickpeas", "Jufra dates and cold laban"],
    },
  },
  plan: {
    lead: { ar: "اختر التواريخ والغرفة. نحسب لك تقديرًا الآن، ونجهّز طلبًا ترسله للبيت.", en: "Choose dates and a room. We estimate it now and prepare a request you can send to the house." },
    checkin: { ar: "الوصول", en: "Check-in" },
    checkout: { ar: "المغادرة", en: "Check-out" },
    adults: { ar: "البالغون", en: "Adults" },
    children: { ar: "الأطفال", en: "Children" },
    room: { ar: "الغرفة", en: "Room" },
    extras: { ar: "إضافات", en: "Extras" },
    transfer: { ar: "توصيل من المطار", en: "Airport transfer" },
    dinner: { ar: "المائدة كل مساء", en: "The table every evening" },
    late: { ar: "مغادرة متأخرة", en: "Late check-out" },
    nights: { ar: "ليالٍ", en: "nights" },
    supplement: { ar: "ضيوف إضافيون", en: "Extra guests" },
    total: { ar: "التقدير الإجمالي", en: "Estimated total" },
    tooMany: { ar: "هذه الغرفة لا تتّسع لهذا العدد. اختر غرفة أكبر.", en: "This room doesn't sleep that many. Choose a larger room." },
    badDates: { ar: "اختر تاريخ مغادرة بعد تاريخ الوصول.", en: "Choose a check-out date after check-in." },
    name: { ar: "اسمك", en: "Your name" },
    prepare: { ar: "جهّز طلب الحجز", en: "Prepare the request" },
    ready: { ar: "طلبك جاهز", en: "Your request is ready" },
    honest: {
      ar: "في نسخة حقيقية يُرسل هذا الطلب مباشرة إلى واتساب الفندق. هنا لا يُرسل شيء، فهذا مفهوم توضيحي.",
      en: "In a live build this goes straight to the hotel's WhatsApp. Here nothing is sent: this is a demonstration concept.",
    },
    copy: { ar: "انسخ الطلب", en: "Copy request" },
    copied: { ar: "تم النسخ", en: "Copied" },
  },
  colophon: {
    ar: "صحرا مفهوم خيالي صمّمه استوديو وسمة لعرض موقع ضيافة تحريري. لا يوجد فندق بهذا الاسم، والأسعار للتوضيح.",
    en: "SAHRA is a fictional concept designed by WASMA to show an editorial hospitality site. There is no hotel by this name, and prices are illustrative.",
  },
} satisfies Record<string, unknown>;

const tx = (v: L, lang: Locale) => v[lang];
const ROMAN = ["I", "II", "III", "IV"];
const IDS = ["courtyard", "rooms", "table", "stay"];
const EXTRA = { transfer: 120, dinner: 95, late: 80 };
const ROOM_CROP = [
  { transform: "scale(1.9)", transformOrigin: "8% 18%" },
  { transform: "scale(1.7)", transformOrigin: "56% 42%" },
  { transform: "scale(1.8)", transformOrigin: "60% 96%" },
];

function addDays(iso: string, n: number) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
const nightsBetween = (a: string, b: string) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000);

function Folio({ lang, active }: { lang: Locale; active: number }) {
  if (active < 0) return null;
  return (
    <p className="text-[0.95rem] italic" style={{ color: C.soft }}>
      <span className="not-italic tracking-[0.2em]" style={{ color: C.ink }}>
        {ROMAN[active]}
      </span>{" "}
      · {copy.chapters[lang][active]}
    </p>
  );
}

function Courtyard({ lang, photos }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const desktop = useIsDesktop();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 200, damping: 40, mass: 0.4 });
  const clip = useTransform(p, [0, 0.6], desktop ? ["inset(6% 39% 6% 39%)", "inset(0% 0% 0% 0%)"] : ["inset(8% 26% 8% 26%)", "inset(0% 0% 0% 0%)"]);
  const scale = useTransform(p, [0, 0.7], [1.25, 1]);
  const textO = useTransform(p, [0.55, 0.8], [0, 1]);

  const scene = (
    <Scene
      name="sahra-retreat"
      photo={photos["sahra-retreat"]}
      alt={lang === "ar" ? "فناء حجري ومسبح أزرق والبحر خلف ستارة بيضاء" : "A limestone courtyard, a cobalt pool, and the sea beyond a white curtain"}
      position="56% 50%"
      idPrefix="sahra-court"
    />
  );

  if (reduced) {
    return (
      <section ref={ref} id="courtyard" data-chapter="0" aria-labelledby="ch-courtyard" className="px-[var(--gutter)] py-20">
        <ChapterHead lang={lang} i={0} />
        <figure className="mt-10">
          <div className="relative aspect-[3/2] overflow-hidden">{scene}</div>
          <figcaption className="mt-3 text-sm italic" style={{ color: C.soft }}>{tx(copy.caption, lang)}</figcaption>
        </figure>
        <p className="mt-8 max-w-[40ch] text-2xl leading-relaxed">{tx(copy.courtyard, lang)}</p>
      </section>
    );
  }

  return (
    <section ref={ref} id="courtyard" data-chapter="0" aria-labelledby="ch-courtyard" className="relative h-[240vh]" data-sc-act="reveal">
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden">
        <div className="px-[var(--gutter)] pt-8">
          <ChapterHead lang={lang} i={0} />
        </div>
        <figure className="relative mx-[var(--gutter)] mb-6 mt-6 flex-1">
          <motion.div className="absolute inset-0 overflow-hidden" style={{ clipPath: clip }}>
            <motion.div className="absolute inset-0" style={{ scale }}>
              {scene}
            </motion.div>
          </motion.div>
          <motion.div style={{ opacity: textO }} className="absolute bottom-6 start-6 max-w-[30rem] p-6 sm:p-8" >
            <div className="absolute inset-0 -z-10" style={{ background: C.stone }} />
            <p className="text-[clamp(1.25rem,2vw,1.7rem)] leading-relaxed">{tx(copy.courtyard, lang)}</p>
            <figcaption className="mt-3 text-sm italic" style={{ color: C.soft }}>{tx(copy.caption, lang)}</figcaption>
          </motion.div>
        </figure>
      </div>
    </section>
  );
}

function ChapterHead({ lang, i }: { lang: Locale; i: number }) {
  return (
    <div className="flex items-baseline gap-5 border-t pt-4" style={{ borderColor: `${C.ink}33` }}>
      <span className="text-sm tracking-[0.3em]" style={{ color: C.soft }}>{ROMAN[i]}</span>
      <h2 id={`ch-${IDS[i]}`} className="text-[clamp(2.2rem,5vw,4.2rem)] font-medium leading-none">
        {copy.chapters[lang][i]}
      </h2>
    </div>
  );
}

function Rooms({ lang, photos, onPlan }: Props & { onPlan: (id: string) => void }) {
  const rail = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    const root = rail.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setIdx(Number((e.target as HTMLElement).dataset.i))),
      { root, threshold: 0.6 },
    );
    root.querySelectorAll("[data-i]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  const go = (to: number) => {
    const el = rail.current?.querySelector<HTMLElement>(`[data-i="${to}"]`);
    el?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", inline: "start", block: "nearest" });
  };
  return (
    <section id="rooms" data-chapter="1" aria-labelledby="ch-rooms" className="py-24" data-sc-act="pan">
      <div className="px-[var(--gutter)]">
        <ChapterHead lang={lang} i={1} />
        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <p className="max-w-[40ch] text-xl italic" style={{ color: C.soft }}>{tx(copy.roomsLead, lang)}</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => go(Math.max(0, idx - 1))} disabled={idx === 0} aria-label={tx(copy.prev, lang)} className="size-12 border text-xl disabled:opacity-30" style={{ borderColor: C.ink }}>
              <span aria-hidden="true" className="inline-block rtl:rotate-180">←</span>
            </button>
            <button type="button" onClick={() => go(Math.min(rooms.length - 1, idx + 1))} disabled={idx === rooms.length - 1} aria-label={tx(copy.next, lang)} className="size-12 border text-xl disabled:opacity-30" style={{ borderColor: C.ink }}>
              <span aria-hidden="true" className="inline-block rtl:rotate-180">→</span>
            </button>
          </div>
        </div>
      </div>
      <div ref={rail} className="rail mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto px-[var(--gutter)] pb-6" tabIndex={0} aria-label={copy.chapters[lang][1]} role="region">
        {rooms.map((r, i) => (
          <article key={r.id} data-i={i} className="w-[84vw] shrink-0 snap-start sm:w-[60vw] lg:w-[42vw]" aria-labelledby={`room-${r.id}`}>
            <div className="relative aspect-[4/3] overflow-hidden">
              <div className="absolute inset-0" style={ROOM_CROP[i]}>
                <Scene name="sahra-retreat" photo={photos["sahra-retreat"]} alt="" idPrefix={`sahra-room-${i}`} sizes="(min-width:1024px) 42vw, 84vw" />
              </div>
              <span className="absolute start-4 top-4 px-3 py-1 text-sm" style={{ background: C.stone }}>
                {r.view[lang]}
              </span>
            </div>
            <div className="mt-5 flex items-baseline justify-between gap-4">
              <h3 id={`room-${r.id}`} className="text-[2rem] font-medium leading-none">{r.name[lang]}</h3>
              <p className="tabular text-lg">
                {formatLYD(r.rate, lang)} <span className="text-sm italic" style={{ color: C.soft }}>{tx(copy.perNight, lang)}</span>
              </p>
            </div>
            <p className="mt-3 max-w-[44ch] text-lg leading-relaxed" style={{ color: C.soft }}>{r.text[lang]}</p>
            <div className="mt-4 flex items-center justify-between border-t pt-3 text-sm" style={{ borderColor: `${C.ink}26` }}>
              <span className="tabular">
                {r.size} m² · {tx(copy.sleeps, lang)} {r.sleeps}
              </span>
              <button type="button" onClick={() => onPlan(r.id)} className="min-h-11 underline decoration-1 underline-offset-4">
                {tx(copy.planThis, lang)}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Planner({ lang, room, setRoom }: { lang: Locale; room: string; setRoom: (id: string) => void }) {
  const P = copy.plan;
  // "Today" exists only on the client, so the server renders empty dates.
  const today = useSyncExternalStore(
    () => () => {},
    () => new Date().toISOString().slice(0, 10),
    () => "",
  );
  const [pickedIn, setIn] = useState<string | null>(null);
  const [pickedOut, setOut] = useState<string | null>(null);
  const inDate = pickedIn ?? (today ? addDays(today, 14) : "");
  const outDate = pickedOut ?? (today ? addDays(today, 17) : "");
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(0);
  const [extras, setExtras] = useState({ transfer: false, dinner: true, late: false });
  const [name, setName] = useState("");
  const [request, setRequest] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const r = rooms.find((x) => x.id === room)!;
  const nights = inDate && outDate ? nightsBetween(inDate, outDate) : 0;
  const guests = adults + kids;
  const over = guests > r.sleeps;
  const badDates = !!inDate && !!outDate && nights < 1;
  const lines = useMemo(() => {
    const n = Math.max(0, nights);
    const out: { label: string; value: number }[] = [{ label: `${r.name[lang]} × ${n} ${P.nights[lang]}`, value: r.rate * n }];
    const extraGuests = Math.max(0, guests - 2);
    if (extraGuests) out.push({ label: `${P.supplement[lang]} × ${extraGuests}`, value: extraGuests * SAHRA_GUEST_SUPPLEMENT * n });
    if (extras.transfer) out.push({ label: P.transfer[lang], value: EXTRA.transfer });
    if (extras.dinner) out.push({ label: `${P.dinner[lang]} (${guests} × ${n})`, value: EXTRA.dinner * guests * n });
    if (extras.late) out.push({ label: P.late[lang], value: EXTRA.late });
    return out;
  }, [nights, r, guests, extras, lang, P]);
  const total = lines.reduce((a, l) => a + l.value, 0);
  const canRequest = !over && !badDates && nights > 0 && name.trim().length > 1;

  const prepare = () => {
    const txt = [
      lang === "ar" ? "مرحبًا صحرا،" : "Hello SAHRA,",
      lang === "ar" ? `أودّ حجز ${r.name.ar} من ${inDate} إلى ${outDate} (${nights} ليالٍ).` : `I'd like to book the ${r.name.en} from ${inDate} to ${outDate} (${nights} nights).`,
      lang === "ar" ? `الضيوف: ${adults} بالغ، ${kids} طفل.` : `Guests: ${adults} adults, ${kids} children.`,
      ...lines.slice(1).map((l) => `· ${l.label}`),
      `${P.total[lang]}: ${formatLYD(total, lang)}`,
      name.trim(),
    ].join("\n");
    setRequest(txt);
  };

  const inputCls = "mt-2 block w-full border-b bg-transparent py-2 text-xl outline-none focus:border-b-2";
  return (
    <section id="stay" data-chapter="3" aria-labelledby="ch-stay" className="px-[var(--gutter)] py-24" data-sc-act="flow">
      <ChapterHead lang={lang} i={3} />
      <p className="mt-6 max-w-[44ch] text-xl italic" style={{ color: C.soft }}>{P.lead[lang]}</p>
      <div className="mt-12 grid gap-12 lg:grid-cols-12">
        <div className="grid gap-10 lg:col-span-7">
          <div className="grid gap-8 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm tracking-[0.15em]" style={{ color: C.soft }}>{P.checkin[lang]}</span>
              <input type="date" value={inDate} min={today} onChange={(e) => { setIn(e.target.value); if (e.target.value >= outDate) setOut(addDays(e.target.value, 1)); }} className={inputCls} style={{ borderColor: C.ink }} />
            </label>
            <label className="block">
              <span className="text-sm tracking-[0.15em]" style={{ color: C.soft }}>{P.checkout[lang]}</span>
              <input type="date" value={outDate} min={inDate ? addDays(inDate, 1) : today} onChange={(e) => setOut(e.target.value)} className={inputCls} style={{ borderColor: C.ink }} aria-invalid={badDates} />
            </label>
          </div>
          {badDates && <p role="alert" className="-mt-6 text-[#9B2C1F]">{P.badDates[lang]}</p>}
          <div className="grid grid-cols-2 gap-8">
            {[
              { label: P.adults[lang], v: adults, set: setAdults, min: 1, max: 4 },
              { label: P.children[lang], v: kids, set: setKids, min: 0, max: 3 },
            ].map((g) => (
              <div key={g.label}>
                <span className="text-sm tracking-[0.15em]" style={{ color: C.soft }}>{g.label}</span>
                <div className="mt-2 flex items-center gap-4 border-b py-1" style={{ borderColor: C.ink }} role="group" aria-label={g.label}>
                  <button type="button" className="size-11 text-2xl disabled:opacity-30" disabled={g.v <= g.min} onClick={() => g.set(g.v - 1)} aria-label={`${g.label} −`}>−</button>
                  <output aria-live="polite" className="tabular w-8 text-center text-2xl">{g.v}</output>
                  <button type="button" className="size-11 text-2xl disabled:opacity-30" disabled={g.v >= g.max} onClick={() => g.set(g.v + 1)} aria-label={`${g.label} +`}>+</button>
                </div>
              </div>
            ))}
          </div>
          <fieldset>
            <legend className="text-sm tracking-[0.15em]" style={{ color: C.soft }}>{P.room[lang]}</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {rooms.map((x) => (
                <label key={x.id} className="cursor-pointer">
                  <input type="radio" name="sahra-room" value={x.id} checked={room === x.id} onChange={() => setRoom(x.id)} className="peer sr-only" />
                  <span className="block border p-4 transition-colors peer-checked:text-[#ECE5D6] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2" style={{ borderColor: C.ink, background: room === x.id ? C.ink : "transparent" }}>
                    <span className="block text-xl">{x.name[lang]}</span>
                    <span className="tabular text-sm opacity-80">{formatLYD(x.rate, lang)} · {tx(copy.sleeps, lang)} {x.sleeps}</span>
                  </span>
                </label>
              ))}
            </div>
            {over && <p role="alert" className="mt-3 text-[#9B2C1F]">{P.tooMany[lang]}</p>}
          </fieldset>
          <fieldset>
            <legend className="text-sm tracking-[0.15em]" style={{ color: C.soft }}>{P.extras[lang]}</legend>
            <div className="mt-3 grid gap-1">
              {(["transfer", "dinner", "late"] as const).map((k) => (
                <label key={k} className="flex min-h-12 cursor-pointer items-center gap-4 border-b" style={{ borderColor: `${C.ink}26` }}>
                  <input type="checkbox" checked={extras[k]} onChange={(e) => setExtras({ ...extras, [k]: e.target.checked })} className="size-5 accent-[#1F4FA0]" />
                  <span className="flex-1 text-lg">{P[k][lang]}</span>
                  <span className="tabular text-sm" style={{ color: C.soft }}>{formatLYD(EXTRA[k], lang)}{k === "dinner" ? (lang === "ar" ? " للضيف/ليلة" : " / guest / night") : ""}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <aside className="lg:col-span-5">
          <div className="lg:sticky lg:top-8" style={{ background: C.cobalt, color: "#F4EFE4" }}>
            <div className="p-6 sm:p-8">
              <p className="text-sm tracking-[0.2em] opacity-80">{P.total[lang]}</p>
              <output aria-live="polite" className="tabular mt-2 block text-[clamp(2.6rem,5vw,3.6rem)] leading-none">{formatLYD(total, lang)}</output>
              <ul className="mt-6 grid gap-2 border-t border-white/25 pt-4 text-[1.05rem]">
                {lines.map((l) => (
                  <li key={l.label} className="flex justify-between gap-4">
                    <span>{l.label}</span>
                    <span className="tabular">{formatLYD(l.value, lang)}</span>
                  </li>
                ))}
              </ul>
              <label className="mt-8 block">
                <span className="text-sm tracking-[0.15em] opacity-80">{P.name[lang]}</span>
                <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className="mt-2 block w-full border-b border-white/60 bg-transparent py-2 text-xl outline-none placeholder:text-white/50 focus:border-white" />
              </label>
              <button type="button" disabled={!canRequest} onClick={prepare} className="mt-6 min-h-12 w-full bg-[#ECE5D6] px-5 text-lg text-[#1B1A17] transition-opacity disabled:opacity-40">
                {P.prepare[lang]}
              </button>
              <p className="mt-4 text-sm leading-relaxed opacity-85">{P.honest[lang]}</p>
            </div>
            {request && (
              <div className="border-t border-white/25 p-6 sm:p-8" role="status">
                <p className="text-xl">{P.ready[lang]}</p>
                <pre dir="auto" className="mt-3 whitespace-pre-wrap bg-black/20 p-4 font-[inherit] text-[1.02rem] leading-relaxed">{request}</pre>
                <button
                  type="button"
                  className="mt-4 min-h-11 underline underline-offset-4"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(request);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1800);
                    } catch {
                      setCopied(false);
                    }
                  }}
                >
                  {copied ? P.copied[lang] : P.copy[lang]}
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}

export function SahraSite({ lang, photos }: Props) {
  const [active, setActive] = useState(-1);
  const [room, setRoom] = useState("sea");

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.chapter))),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    document.querySelectorAll("[data-chapter]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const plan = (id: string) => {
    setRoom(id);
    document.getElementById("stay")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className={`${serif.variable} ${naskh.variable} min-h-screen`}
      style={{ background: C.stone, color: C.ink, fontFamily: "var(--f-sahra), var(--f-sahra-ar), Georgia, serif" }}
    >
      <header className="flex items-center justify-between gap-6 px-[var(--gutter)] py-6">
        <a href="#" className="text-[1.6rem] tracking-[0.42em]" aria-label="SAHRA">SAHRA</a>
        <nav aria-label="SAHRA" className="hidden gap-8 text-lg md:flex">
          {copy.nav[lang].slice(0, 3).map((n, i) => (
            <a key={n} href={`#${IDS[i]}`} className="underline-offset-4 hover:underline">{n}</a>
          ))}
        </nav>
        <a href="#stay" className="border px-4 py-2 text-lg" style={{ borderColor: C.ink }}>{copy.nav[lang][3]}</a>
      </header>

      {/* Running folio: the chapter you are in */}
      <div className="sticky top-0 z-20 border-y px-[var(--gutter)] py-2 lg:hidden" style={{ background: C.stone, borderColor: `${C.ink}1f` }} aria-hidden={active < 0}>
        <Folio lang={lang} active={active} />
      </div>
      <div className="pointer-events-none fixed bottom-8 start-[var(--gutter)] z-20 hidden lg:block" aria-hidden="true">
        <Folio lang={lang} active={active} />
      </div>

      <main>
        {/* Title page: type only, media begins in chapter one */}
        <section className="flex min-h-[86svh] flex-col justify-end px-[var(--gutter)] pb-16 pt-10" aria-labelledby="sahra-title">
          <h1 id="sahra-title" className="max-w-[14ch] text-[clamp(3.6rem,10.5vw,10rem)] font-medium leading-[0.95]">
            {copy.title[lang]}
          </h1>
          <div className="mt-12 grid gap-8 border-t pt-6 md:grid-cols-12" style={{ borderColor: `${C.ink}33` }}>
            <p className="max-w-[42ch] text-[clamp(1.25rem,1.8vw,1.6rem)] leading-relaxed md:col-span-6">{copy.sub[lang]}</p>
            <ul className="flex flex-wrap gap-x-8 gap-y-2 text-lg italic md:col-span-6 md:justify-end" style={{ color: C.soft }}>
              {copy.meta[lang].map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
        </section>

        <Courtyard lang={lang} photos={photos} />
        <Rooms lang={lang} photos={photos} onPlan={plan} />

        <section id="table" data-chapter="2" aria-labelledby="ch-table" className="px-[var(--gutter)] py-24" style={{ background: C.stone2 }} data-sc-act="flow">
          <ChapterHead lang={lang} i={2} />
          <div className="mt-12 grid gap-12 lg:grid-cols-12">
            <blockquote className="text-[clamp(2rem,4vw,3.4rem)] italic leading-tight lg:col-span-6">{copy.table.quote[lang]}</blockquote>
            <div className="lg:col-span-6">
              <p className="text-xl leading-[1.8] first-letter:float-start first-letter:me-3 first-letter:text-[4.2rem] first-letter:leading-[0.8]">{copy.table.text[lang]}</p>
              <h3 className="mt-10 text-sm tracking-[0.3em]" style={{ color: C.olive }}>{copy.table.tonight[lang]}</h3>
              <ol className="mt-4">
                {copy.table.dishes[lang].map((d, i) => (
                  <li key={d} className="flex gap-6 border-b py-3 text-xl" style={{ borderColor: `${C.ink}26` }}>
                    <span className="tabular text-sm" style={{ color: C.soft }}>{ROMAN[i]}</span>
                    {d}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <Planner lang={lang} room={room} setRoom={setRoom} />

        <footer className="border-t px-[var(--gutter)] py-12 text-[0.95rem] italic" style={{ borderColor: `${C.ink}33`, color: C.soft }}>
          <p className="max-w-[60ch]">
            <span className="not-italic tracking-[0.3em]" style={{ color: C.ink }}>SAHRA</span> · {copy.colophon[lang]}{" "}
            <a href="#stay" className="underline underline-offset-4" style={{ color: C.ink }}>{copy.nav[lang][3]}</a>.
          </p>
        </footer>
      </main>
    </div>
  );
}
