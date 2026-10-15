"use client";

/**
 * Act 7, resolve. The proposal plate: everything the page has learned about the
 * visitor, set as a short document, and one button that sends it on WhatsApp.
 */
import { motion } from "framer-motion";
import { useId, useState } from "react";
import { PRICES } from "@/lib/business";
import { useReduced } from "@/hooks/useMedia";
import type { Dict } from "@/lib/dictionaries/ar";
import { formatLYD, type Locale } from "@/lib/i18n";
import { proposalHref, useBusiness } from "./Business";

export function Plate({ lang, t }: { lang: Locale; t: Dict }) {
  const reduce = useReduced();
  const biz = useBusiness();
  const [name, setName] = useState("");
  const nameId = useId();
  const tp = t.proposal;
  const item = t.packages.items[biz.pkg];
  const label = t.biz.items[biz.id].label;

  const rows: [string, string][] = [
    [tp.for, name.trim() ? `${name.trim()} · ${label}` : label],
    [tp.pkg, item.name],
    [tp.from, formatLYD(PRICES[biz.pkg].from, lang)],
    ...(item.ready ? ([[tp.ready, item.ready]] as [string, string][]) : []),
    [tp.next, tp.nextText],
  ];

  return (
    <motion.div
      initial={reduce ? false : { clipPath: "inset(0 0 100% 0)" }}
      whileInView={{ clipPath: "inset(0 0 0% 0)" }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
      className="on-ink bg-ink p-[clamp(1.5rem,3vw,2.5rem)] text-paper"
      data-plate
    >
      <div className="flex items-center justify-between gap-4 border-b border-line-dark pb-4">
        <p className="text-sm font-semibold">{tp.plate}</p>
        <span aria-hidden="true" className="size-3 bg-lime" />
      </div>
      <dl className="divide-y divide-line-dark" aria-live="polite">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[7rem_1fr] gap-4 py-4 sm:grid-cols-[9rem_1fr]">
            <dt className="text-sm text-mute-dark">{k}</dt>
            <dd className="tabular text-[1.1rem] font-semibold leading-snug">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-2 border-t border-line-dark pt-5">
        <label htmlFor={nameId} className="text-sm text-mute-dark">
          {tp.name} <span className="text-mute-dark/80">({tp.namePh})</span>
        </label>
        <input
          id={nameId}
          value={name}
          maxLength={60}
          autoComplete="organization"
          onChange={(e) => setName(e.target.value)}
          className="mt-2 block w-full border-0 border-b-2 border-paper/30 bg-transparent px-0 py-2 text-lg text-paper outline-none transition-colors focus:border-lime"
        />
      </div>
      <a href={proposalHref(t, biz.id, name)} target="_blank" rel="noopener noreferrer" className="btn btn-lime mt-8 w-full justify-center">
        {tp.send}
      </a>
      <p className="mt-4 text-sm leading-relaxed text-mute-dark">{tp.note}</p>
    </motion.div>
  );
}
