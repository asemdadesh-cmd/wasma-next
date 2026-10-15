"use client";

import { useEffect, useRef, useState } from "react";
import { composeBrief, LIKE_TO_TYPE, validateBrief, type Brief, type BriefErrors } from "@/lib/brief";
import type { Dict } from "@/lib/dictionaries/ar";
import type { Locale } from "@/lib/i18n";
import { projects } from "@/lib/projects";
import { mailtoHref, whatsappHref } from "@/lib/site";
import { Plate } from "@/components/proposal/Plate";
import { useSelection } from "./Selection";

type Props = { lang: Locale; dict: Dict };

const field =
  "mt-2 block w-full border-0 border-b-2 border-ink/25 bg-transparent px-0 py-3 text-lg outline-none transition-colors placeholder:text-mute/70 focus:border-ink aria-[invalid=true]:border-[#B3261E]";

export function Contact({ lang, dict }: Props) {
  const t = dict.contact;
  const tp = dict.proposal;
  const f = t.form;
  const types = f.types;
  const { liked, setLiked } = useSelection();
  const [b, setB] = useState<Brief>({ name: "", reach: "", type: "", like: "", timeline: "", message: "" });
  const [errors, setErrors] = useState<BriefErrors>({});
  const [ready, setReady] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef<HTMLHeadingElement>(null);

  // Arriving from a concept page (?like=nura) carries that choice too.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("like");
    if (q && projects.some((p) => p.slug === q)) setLiked(q as (typeof projects)[number]["slug"]);
  }, [setLiked]);

  // The concept chosen in the gallery follows the visitor into the brief.
  const [seenLiked, setSeenLiked] = useState(liked);
  if (liked !== seenLiked) {
    setSeenLiked(liked);
    if (liked) setB((cur) => ({ ...cur, like: liked, type: cur.type || types[LIKE_TO_TYPE[liked]] }));
  }

  const set = (k: keyof Brief) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setB({ ...b, [k]: e.target.value });
    if (errors[k as keyof BriefErrors]) setErrors({ ...errors, [k]: undefined });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateBrief(b, f, types);
    setErrors(errs);
    if (Object.keys(errs).length) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setReady(composeBrief(b, f, lang));
    requestAnimationFrame(() => readyRef.current?.focus());
  };

  const errorKeys = (Object.keys(errors) as (keyof BriefErrors)[]).filter((k) => errors[k]);
  const describe = (k: keyof BriefErrors) => (errors[k] ? `${k}-error` : undefined);

  return (
    <section id="contact" aria-labelledby="contact-title" className="grain bg-paper-2 py-[var(--section)]" data-sc-act="reveal">
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-12">
          <h2 id="contact-title" className="display text-[clamp(2.4rem,5vw,4.8rem)] lg:col-span-8">
            {tp.title}
          </h2>
          <p className="pretty max-w-[40ch] text-lg leading-relaxed text-ink/80 lg:col-span-4 lg:self-end">{tp.lead}</p>
        </div>
      </div>
      <div className="wrap mt-[clamp(3rem,6vw,5rem)] grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--nav-h)+1.5rem)]">
            <Plate lang={lang} t={dict} />
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <h3 className="text-[clamp(1.5rem,2.4vw,2rem)] font-semibold">{tp.brief}</h3>
          <p className="pretty mt-2 max-w-[48ch] text-ink/75">{tp.briefLead} {t.honest}</p>
          <div className="mt-8">
          {ready ? (
            <div className="bg-ink p-6 text-paper on-ink sm:p-10">
              <h3 ref={readyRef} tabIndex={-1} className="text-[clamp(1.8rem,3vw,2.6rem)] font-semibold outline-none">
                <span className="me-3 inline-block size-3 bg-lime align-middle" aria-hidden="true" />
                {f.readyTitle}
              </h3>
              <p className="mt-3 text-mute-dark">{f.readyText}</p>
              <pre dir="auto" className="mt-6 max-h-72 overflow-auto whitespace-pre-wrap border border-line-dark p-4 font-[inherit] text-[0.95rem] leading-relaxed text-paper/90">
                {ready}
              </pre>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={whatsappHref(ready)} target="_blank" rel="noopener noreferrer" className="btn btn-lime">
                  {f.sendWhatsapp}
                </a>
                <a href={mailtoHref(f.subject, ready)} className="btn btn-line">
                  {f.sendEmail}
                </a>
                <button
                  type="button"
                  className="btn btn-line"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(ready);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    } catch {
                      setCopied(false);
                    }
                  }}
                >
                  <span aria-live="polite">{copied ? f.copied : f.copy}</span>
                </button>
              </div>
              <button type="button" onClick={() => setReady(null)} className="mt-6 min-h-11 text-sm text-mute-dark underline underline-offset-4">
                {f.edit}
              </button>
            </div>
          ) : (
            <form action="/api/brief" method="post" noValidate onSubmit={onSubmit} className="grid gap-8">
              <input type="hidden" name="lang" value={lang} />
              {errorKeys.length > 0 && (
                <div ref={summaryRef} tabIndex={-1} role="alert" className="border-2 border-[#B3261E] bg-paper p-4 outline-none">
                  <p className="font-semibold">{f.errors.summary}</p>
                  <ul className="mt-2 list-inside list-disc text-[0.95rem]">
                    {errorKeys.map((k) => (
                      <li key={k}>
                        <a href={`#f-${k}`} className="underline underline-offset-4">
                          {errors[k]}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <label htmlFor="f-name" className="font-semibold">{f.name}</label>
                  <input id="f-name" name="name" autoComplete="name" value={b.name} onChange={set("name")} placeholder={f.namePh} aria-invalid={!!errors.name} aria-describedby={describe("name")} className={field} required />
                  {errors.name && <p id="name-error" className="mt-2 text-sm text-[#B3261E]">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="f-reach" className="font-semibold">{f.reach}</label>
                  <input id="f-reach" name="reach" autoComplete="tel" inputMode="text" dir="ltr" value={b.reach} onChange={set("reach")} placeholder={f.reachPh} aria-invalid={!!errors.reach} aria-describedby={describe("reach")} className={`${field} rtl:text-right`} required />
                  {errors.reach && <p id="reach-error" className="mt-2 text-sm text-[#B3261E]">{errors.reach}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="f-type" className="font-semibold">{f.type}</label>
                <select id="f-type" name="type" value={b.type} onChange={set("type")} aria-invalid={!!errors.type} aria-describedby={describe("type")} className={`${field} cursor-pointer`} required>
                  <option value="" disabled>{f.typePh}</option>
                  {types.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.type && <p id="type-error" className="mt-2 text-sm text-[#B3261E]">{errors.type}</p>}
              </div>

              <fieldset>
                <legend className="font-semibold">
                  {f.like} <span className="font-normal text-mute">({f.optional})</span>
                </legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[{ slug: "", label: f.likeNone }, ...projects.map((p) => ({ slug: p.slug, label: `${p.name[lang]} · ${p.kind[lang]}` }))].map((o) => (
                    <label key={o.slug || "none"} className="cursor-pointer">
                      <input type="radio" name="like" value={o.slug} checked={b.like === o.slug} onChange={set("like")} className="peer sr-only" />
                      <span className="inline-flex min-h-11 items-center gap-2 border border-ink/30 px-4 text-[0.95rem] transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink">
                        {o.label}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="font-semibold">
                  {f.timeline} <span className="font-normal text-mute">({f.optional})</span>
                </legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {f.timelines.map((tl) => (
                    <label key={tl} className="cursor-pointer">
                      <input type="radio" name="timeline" value={tl} checked={b.timeline === tl} onChange={set("timeline")} className="peer sr-only" />
                      <span className="inline-flex min-h-11 items-center border border-ink/30 px-4 text-[0.95rem] transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink">
                        {tl}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div>
                <label htmlFor="f-message" className="font-semibold">{f.message}</label>
                <textarea id="f-message" name="message" rows={5} value={b.message} onChange={set("message")} placeholder={f.messagePh} aria-invalid={!!errors.message} aria-describedby={describe("message")} className={`${field} resize-y`} required />
                {errors.message && <p id="message-error" className="mt-2 text-sm text-[#B3261E]">{errors.message}</p>}
              </div>

              <div>
                <button type="submit" className="btn btn-ink">
                  <span className="btn-square" aria-hidden="true" />
                  {f.submit}
                </button>
              </div>
            </form>
          )}
          </div>
        </div>
      </div>
    </section>
  );
}
