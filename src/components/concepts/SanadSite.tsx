"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Rubik } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import { dayNames, doctors, slotTaken, slotTimes, specialties } from "@/lib/concept-data";
import { formatLYD, type Locale } from "@/lib/i18n";
import type { PhotoMap } from "@/lib/photos";

const rubik = Rubik({ subsets: ["arabic", "latin"], variable: "--f-sanad", display: "swap" });

type Props = { lang: Locale; photos: PhotoMap };
const C = { bg: "#F2F7F5", mint: "#CDE7DE", green: "#2F8F75", navy: "#14304A", deep: "#0B1A28", soft: "#4D6475", white: "#FFFFFF", warn: "#B3261E" };

const T = {
  nav: { ar: ["احجز", "قبل زيارتك", "أسئلة"], en: ["Book", "Before you visit", "Questions"] },
  title: { ar: "احجز موعدك في أقل من دقيقة.", en: "Book a doctor in under a minute." },
  sub: { ar: "اختر التخصص والطبيب والوقت المناسب. نؤكد موعدك برسالة، ونذكّرك قبله بيوم.", en: "Choose a specialty, a doctor and a time. We confirm by message and remind you the day before." },
  facts: { ar: ["4 تخصصات", "الأحد إلى الخميس", "9:00 إلى 18:00"], en: ["4 specialties", "Sunday to Thursday", "9:00 to 18:00"] },
  next: { ar: "أقرب موعد متاح", en: "Next available" },
  start: { ar: "ابدأ الحجز", en: "Start booking" },
  steps: { ar: ["التخصص", "الطبيب", "اليوم والوقت", "بياناتك", "المراجعة"], en: ["Specialty", "Doctor", "Day & time", "Your details", "Review"] },
  change: { ar: "تغيير", en: "Change" },
  fee: { ar: "رسوم الكشف", en: "Consultation" },
  speaks: { ar: "يتحدث", en: "Speaks" },
  days: { ar: "أيام العمل", en: "Clinic days" },
  choose: { ar: "اختر", en: "Choose" },
  unavailable: { ar: "غير متاح", en: "Unavailable" },
  name: { ar: "الاسم الكامل", en: "Full name" },
  phone: { ar: "رقم الهاتف", en: "Phone number" },
  reason: { ar: "سبب الزيارة", en: "Reason for visit" },
  optional: { ar: "اختياري", en: "optional" },
  continue: { ar: "متابعة", en: "Continue" },
  errName: { ar: "اكتب الاسم الكامل.", en: "Enter your full name." },
  errPhone: { ar: "اكتب رقم هاتف ليبي صحيح، مثل 091 234 5678.", en: "Enter a valid Libyan number, e.g. 091 234 5678." },
  confirm: { ar: "تأكيد الحجز", en: "Confirm booking" },
  done: { ar: "تم تسجيل الحجز التجريبي.", en: "Demo booking recorded." },
  ref: { ar: "رقم المرجع", en: "Reference" },
  ics: { ar: "أضف إلى التقويم", en: "Add to calendar" },
  again: { ar: "حجز آخر", en: "Book another" },
  demo: { ar: "هذا مفهوم تجريبي. لم يُحجز موعد حقيقي، ولن تُرسل أي رسالة.", en: "This is a demo concept. No real appointment was made and no message will be sent." },
  before: { ar: "قبل زيارتك", en: "Before you visit" },
  bring: {
    ar: ["بطاقة الهوية أو جواز السفر", "أي تقارير أو تحاليل سابقة", "قائمة بالأدوية التي تتناولها", "الحضور قبل الموعد بعشر دقائق"],
    en: ["ID card or passport", "Any previous reports or test results", "A list of medicines you take", "Arrive ten minutes early"],
  },
  faq: { ar: "أسئلة متكرّرة", en: "Questions" },
  faqs: {
    ar: [
      ["هل يمكنني إلغاء الموعد؟", "نعم، من الرابط في رسالة التأكيد حتى ساعتين قبل الموعد، بلا رسوم."],
      ["هل الدفع إلكتروني؟", "تدفع في العيادة نقدًا أو بالبطاقة. لا يُطلب الدفع عند الحجز."],
      ["هل تستقبلون الحالات الطارئة؟", "لا. في الحالات الطارئة توجّه إلى أقرب قسم طوارئ."],
    ],
    en: [
      ["Can I cancel?", "Yes, from the link in your confirmation message, up to two hours before, free of charge."],
      ["Do I pay online?", "You pay at the clinic, cash or card. No payment is taken when booking."],
      ["Do you see emergencies?", "No. For emergencies, go to the nearest emergency department."],
    ],
  },
};

const NEXT_AVAILABLE = (() => {
  for (let dd = 0; dd < 5; dd++)
    for (const x of doctors)
      if (x.days.includes(dd)) {
        const i = slotTimes.findIndex((_, k) => !slotTaken(x.id, dd, k));
        if (i >= 0) return { doc: x, day: dd, time: slotTimes[i] };
      }
  return null;
})();

const PHONE = /^(\+?218|0)?9[1-5]\d{7}$/;

function nextDate(dayIndex: number) {
  // dayIndex 0 = Sunday. Returns the next such weekday (never today).
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  const delta = ((dayIndex - d.getDay() + 7) % 7) || 7;
  d.setDate(d.getDate() + delta);
  return d;
}

function icsFile(title: string, date: Date, time: string, desc: string) {
  const [h, m] = time.split(":").map(Number);
  const start = new Date(date);
  start.setHours(h, m, 0, 0);
  const end = new Date(start.getTime() + 30 * 60000);
  const f = (x: Date) => x.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//WASMA//SANAD concept//EN",
    "BEGIN:VEVENT",
    `UID:${f(start)}-sanad@wasma.example`,
    `DTSTAMP:${f(new Date())}`,
    `DTSTART:${f(start)}`,
    `DTEND:${f(end)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${desc}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function Sheet({ i, title, summary, active, done, onChange, children, lang }: { i: number; title: string; summary?: string; active: boolean; done: boolean; onChange: () => void; children: React.ReactNode; lang: Locale }) {
  const reduced = useReducedMotion();
  return (
    <li
      id={`step-${i}`}
      className={`scroll-mt-6 rounded-[1.5rem] bg-white shadow-[0_1px_2px_rgba(20,48,74,.08),0_12px_32px_-18px_rgba(20,48,74,.35)] ${done && !active ? "sticky" : ""}`}
      style={done && !active ? { top: `${1 + i * 4.25}rem`, zIndex: i } : undefined}
      aria-current={active ? "step" : undefined}
    >
      <div className="flex min-h-16 items-center gap-4 px-5 py-3 sm:px-6">
        <span
          className="tabular flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
          style={{ background: done ? C.green : active ? C.navy : C.mint, color: done || active ? "#fff" : C.navy }}
          aria-hidden="true"
        >
          {done ? "✓" : i + 1}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold">{title}</h3>
          {done && !active && summary && <p className="truncate text-sm" style={{ color: C.soft }}>{summary}</p>}
        </div>
        {done && !active && (
          <button type="button" onClick={onChange} className="min-h-11 rounded-full px-4 text-sm font-semibold" style={{ color: C.green }}>
            {T.change[lang]} <span className="sr-only">{title}</span>
          </button>
        )}
      </div>
      <AnimatePresence initial={false}>
        {active && (
          <motion.div
            initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduced ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0.01 : 0.35, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-6 sm:px-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export function SanadSite({ lang }: Props) {
  const ar = lang === "ar";
  const [step, setStep] = useState(0);
  const [spec, setSpec] = useState<string | null>(null);
  const [doc, setDoc] = useState<string | null>(null);
  const [day, setDay] = useState<number | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", reason: "" });
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [confirmed, setConfirmed] = useState<{ ref: string; ics: string } | null>(null);
  const reduced = useReducedMotion();
  const first = useRef(true);

  const d = doctors.find((x) => x.id === doc);
  const s = specialties.find((x) => x.id === spec);
  const nextAvail = NEXT_AVAILABLE;

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const el = document.getElementById(`step-${step}`);
    const t = setTimeout(() => el?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" }), 60);
    return () => clearTimeout(t);
  }, [step, reduced]);

  const done = (i: number) => (i === 0 ? !!spec : i === 1 ? !!doc : i === 2 ? !!slot : i === 3 ? step > 3 : false);

  const submitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (form.name.trim().split(/\s+/).length < 2) errs.name = T.errName[lang];
    if (!PHONE.test(form.phone.replace(/[\s-]/g, ""))) errs.phone = T.errPhone[lang];
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.getElementById(errs.name ? "s-name" : "s-phone")?.focus();
      return;
    }
    setStep(4);
  };

  const confirm = () => {
    if (!d || day === null || !slot) return;
    const ref = `SND-${(d.id.charCodeAt(1) * 131 + day * 17 + slotTimes.indexOf(slot) * 7 + form.name.length * 3).toString(36).toUpperCase().padStart(4, "0")}`;
    const ics = icsFile(`${d.name[lang]} · SANAD (demo)`, nextDate(day), slot, `${s?.name[lang]} · ${ref} · ${T.demo[lang]}`);
    setConfirmed({ ref, ics });
  };

  const reset = () => {
    setStep(0);
    setSpec(null);
    setDoc(null);
    setDay(null);
    setSlot(null);
    setForm({ name: "", phone: "", reason: "" });
    setConfirmed(null);
  };

  const field = "mt-1 block w-full rounded-xl border-2 bg-white px-4 py-3 text-lg outline-none focus:border-[#2F8F75]";

  return (
    <div className={`${rubik.variable} min-h-screen`} style={{ background: C.bg, color: C.navy, fontFamily: "var(--f-sanad), sans-serif" }}>
      <header className="flex items-center justify-between gap-6 px-[var(--gutter)] py-5">
        <a href="#" className="text-2xl font-semibold">
          {ar ? "سند" : "SANAD"} <span style={{ color: C.green }}>+</span>
        </a>
        <nav aria-label="SANAD" className="hidden gap-6 sm:flex">
          {T.nav[lang].map((n, i) => (
            <a key={n} href={["#book", "#before", "#faq"][i]} className="min-h-11 content-center" style={{ color: C.soft }}>{n}</a>
          ))}
        </nav>
      </header>

      <main>
        <section className="grid gap-10 px-[var(--gutter)] pb-16 pt-8 lg:grid-cols-12 lg:items-end" aria-labelledby="sanad-title">
          <div className="lg:col-span-7">
            <h1 id="sanad-title" className="text-[clamp(2.6rem,6.4vw,5.4rem)] font-semibold leading-[1.05]">{T.title[lang]}</h1>
            <p className="mt-6 max-w-[42ch] text-xl leading-relaxed" style={{ color: C.soft }}>{T.sub[lang]}</p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {T.facts[lang].map((f) => (
                <li key={f} className="rounded-full px-4 py-2 text-sm font-medium" style={{ background: C.mint }}>{f}</li>
              ))}
            </ul>
          </div>
          {nextAvail && (
            <div className="rounded-[1.75rem] p-6 text-white lg:col-span-5" style={{ background: C.navy }}>
              <p className="text-sm opacity-80">{T.next[lang]}</p>
              <p className="mt-3 text-2xl font-semibold">{nextAvail.doc.name[lang]}</p>
              <p className="mt-1 opacity-85">{specialties.find((x) => x.id === nextAvail.doc.spec)!.name[lang]}</p>
              <p className="tabular mt-4 text-[2.4rem] font-semibold leading-none">
                {dayNames[lang][nextAvail.day]} · <span dir="ltr">{nextAvail.time}</span>
              </p>
              <a href="#book" className="mt-6 inline-flex min-h-12 items-center rounded-full px-6 font-semibold" style={{ background: C.mint, color: C.navy }}>
                {T.start[lang]}
              </a>
            </div>
          )}
        </section>

        <section id="book" aria-labelledby="book-title" className="px-[var(--gutter)] pb-24" data-sc-act="pin">
          <div className="mx-auto max-w-3xl">
            <h2 id="book-title" className="sr-only">{T.nav[lang][0]}</h2>
            {confirmed ? (
              <div className="rounded-[1.75rem] bg-white p-8 shadow-[0_12px_32px_-18px_rgba(20,48,74,.35)]" role="status">
                <span className="flex size-12 items-center justify-center rounded-full text-2xl text-white" style={{ background: C.green }} aria-hidden="true">✓</span>
                <p className="mt-5 text-3xl font-semibold">{T.done[lang]}</p>
                <dl className="mt-6 grid gap-3 text-lg sm:grid-cols-2">
                  <div><dt className="text-sm" style={{ color: C.soft }}>{T.ref[lang]}</dt><dd className="tabular font-semibold" dir="ltr">{confirmed.ref}</dd></div>
                  <div><dt className="text-sm" style={{ color: C.soft }}>{T.steps[lang][1]}</dt><dd>{d?.name[lang]}</dd></div>
                  <div><dt className="text-sm" style={{ color: C.soft }}>{T.steps[lang][2]}</dt><dd className="tabular">{day !== null && dayNames[lang][day]} · <span dir="ltr">{slot}</span></dd></div>
                  <div><dt className="text-sm" style={{ color: C.soft }}>{T.fee[lang]}</dt><dd className="tabular">{d && formatLYD(d.fee, lang)}</dd></div>
                </dl>
                <p className="mt-6 rounded-xl p-4 text-sm" style={{ background: C.bg, color: C.soft }}>{T.demo[lang]}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href={`data:text/calendar;charset=utf-8,${encodeURIComponent(confirmed.ics)}`} download="sanad-demo-appointment.ics" className="inline-flex min-h-12 items-center rounded-full px-6 font-semibold text-white" style={{ background: C.green }}>
                    {T.ics[lang]}
                  </a>
                  <button type="button" onClick={reset} className="min-h-12 rounded-full border-2 px-6 font-semibold" style={{ borderColor: C.mint }}>{T.again[lang]}</button>
                </div>
              </div>
            ) : (
              <ol className="grid gap-3">
                <Sheet i={0} lang={lang} title={T.steps[lang][0]} summary={s?.name[lang]} active={step === 0} done={done(0)} onChange={() => setStep(0)}>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {specialties.map((x) => (
                      <button key={x.id} type="button" aria-pressed={spec === x.id} onClick={() => { setSpec(x.id); if (doctors.find((dd) => dd.id === doc)?.spec !== x.id) { setDoc(null); setDay(null); setSlot(null); } setStep(1); }} className="min-h-20 rounded-2xl border-2 p-4 text-start transition-colors" style={{ borderColor: spec === x.id ? C.green : C.mint, background: spec === x.id ? "#EAF6F1" : "#fff" }}>
                        <span className="block text-lg font-semibold">{x.name[lang]}</span>
                        <span className="text-sm" style={{ color: C.soft }}>{x.text[lang]}</span>
                      </button>
                    ))}
                  </div>
                </Sheet>
                <Sheet i={1} lang={lang} title={T.steps[lang][1]} summary={d ? `${d.name[lang]} · ${formatLYD(d.fee, lang)}` : undefined} active={step === 1} done={done(1)} onChange={() => setStep(1)}>
                  <ul className="grid gap-2">
                    {doctors.filter((x) => x.spec === spec).map((x) => (
                      <li key={x.id}>
                        <button type="button" aria-pressed={doc === x.id} onClick={() => { setDoc(x.id); setDay(null); setSlot(null); setStep(2); }} className="grid w-full gap-1 rounded-2xl border-2 p-4 text-start sm:grid-cols-[1fr_auto] sm:items-center" style={{ borderColor: doc === x.id ? C.green : C.mint }}>
                          <span>
                            <span className="block text-lg font-semibold">{x.name[lang]}</span>
                            <span className="text-sm" style={{ color: C.soft }}>
                              {T.speaks[lang]}: {x.langs[lang]} · {T.days[lang]}: {x.days.map((k) => dayNames[lang][k]).join(ar ? "، " : ", ")}
                            </span>
                          </span>
                          <span className="tabular font-semibold">{formatLYD(x.fee, lang)}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </Sheet>
                <Sheet i={2} lang={lang} title={T.steps[lang][2]} summary={day !== null && slot ? `${dayNames[lang][day]} · ${slot}` : undefined} active={step === 2} done={done(2)} onChange={() => setStep(2)}>
                  {d && (
                    <div>
                      <div className="grid grid-cols-5 gap-1.5" role="group" aria-label={T.steps[lang][2]}>
                        {dayNames[lang].map((n, k) => {
                          const open = d.days.includes(k);
                          return (
                            <button key={n} type="button" disabled={!open} aria-pressed={day === k} onClick={() => { setDay(k); setSlot(null); }} className="min-h-14 rounded-xl border-2 text-sm font-semibold disabled:border-transparent disabled:opacity-35" style={{ borderColor: day === k ? C.navy : C.mint, background: day === k ? C.navy : "#fff", color: day === k ? "#fff" : C.navy }}>
                              {n}
                              {!open && <span className="sr-only"> · {T.unavailable[lang]}</span>}
                            </button>
                          );
                        })}
                      </div>
                      {day !== null && (
                        <div className="mt-4 grid grid-cols-4 gap-1.5 sm:grid-cols-8">
                          {slotTimes.map((tm, k) => {
                            const taken = slotTaken(d.id, day, k);
                            return (
                              <button key={tm} type="button" disabled={taken} onClick={() => { setSlot(tm); setStep(3); }} className="tabular min-h-12 rounded-xl border-2 text-sm disabled:line-through disabled:opacity-35" style={{ borderColor: slot === tm ? C.green : C.mint }} dir="ltr" aria-label={taken ? `${tm} ${T.unavailable[lang]}` : tm}>
                                {tm}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </Sheet>
                <Sheet i={3} lang={lang} title={T.steps[lang][3]} summary={form.name || undefined} active={step === 3} done={done(3)} onChange={() => setStep(3)}>
                  <form noValidate onSubmit={submitDetails} className="grid gap-5">
                    <label>
                      <span className="text-sm font-medium">{T.name[lang]}</span>
                      <input id="s-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "s-name-e" : undefined} className={field} style={{ borderColor: errors.name ? C.warn : C.mint }} />
                      {errors.name && <span id="s-name-e" className="mt-1 block text-sm" style={{ color: C.warn }}>{errors.name}</span>}
                    </label>
                    <label>
                      <span className="text-sm font-medium">{T.phone[lang]}</span>
                      <input id="s-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} inputMode="tel" autoComplete="tel" dir="ltr" placeholder="091 234 5678" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "s-phone-e" : undefined} className={`${field} rtl:text-right`} style={{ borderColor: errors.phone ? C.warn : C.mint }} />
                      {errors.phone && <span id="s-phone-e" className="mt-1 block text-sm" style={{ color: C.warn }}>{errors.phone}</span>}
                    </label>
                    <label>
                      <span className="text-sm font-medium">{T.reason[lang]} <span style={{ color: C.soft }}>({T.optional[lang]})</span></span>
                      <textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} rows={2} className={field} style={{ borderColor: C.mint }} />
                    </label>
                    <button type="submit" className="min-h-12 justify-self-start rounded-full px-8 font-semibold text-white" style={{ background: C.navy }}>{T.continue[lang]}</button>
                  </form>
                </Sheet>
                <Sheet i={4} lang={lang} title={T.steps[lang][4]} active={step === 4} done={false} onChange={() => setStep(4)}>
                  <dl className="grid gap-3 rounded-2xl p-4 sm:grid-cols-2" style={{ background: C.bg }}>
                    {[
                      [T.steps[lang][0], s?.name[lang]],
                      [T.steps[lang][1], d?.name[lang]],
                      [T.steps[lang][2], day !== null ? `${dayNames[lang][day]} · ${slot}` : ""],
                      [T.fee[lang], d ? formatLYD(d.fee, lang) : ""],
                      [T.name[lang], form.name],
                      [T.phone[lang], form.phone],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-sm" style={{ color: C.soft }}>{k}</dt>
                        <dd className="font-semibold" dir="auto">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-4 text-sm" style={{ color: C.soft }}>{T.demo[lang]}</p>
                  <button type="button" onClick={confirm} className="mt-5 min-h-14 rounded-full px-8 text-lg font-semibold text-white" style={{ background: C.green }}>{T.confirm[lang]}</button>
                </Sheet>
              </ol>
            )}
          </div>
        </section>

        <section id="before" aria-labelledby="before-title" className="px-[var(--gutter)] py-20" style={{ background: C.white }} data-sc-act="flow">
          <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2">
            <div>
              <h2 id="before-title" className="text-3xl font-semibold">{T.before[lang]}</h2>
              <ul className="mt-6 grid gap-3">
                {T.bring[lang].map((b) => (
                  <li key={b} className="flex items-start gap-3 text-lg">
                    <span className="mt-1.5 size-4 shrink-0 rounded-full" style={{ background: C.mint, boxShadow: `inset 0 0 0 4px ${C.green}` }} aria-hidden="true" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div id="faq">
              <h2 className="text-3xl font-semibold">{T.faq[lang]}</h2>
              <div className="mt-6 grid gap-2">
                {T.faqs[lang].map(([qq, a]) => (
                  <details key={qq} className="group rounded-2xl p-4" style={{ background: C.bg }}>
                    <summary className="flex min-h-8 items-center justify-between gap-4 font-semibold">
                      {qq}
                      <span className="text-xl transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                    </summary>
                    <p className="mt-2 leading-relaxed" style={{ color: C.soft }}>{a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
