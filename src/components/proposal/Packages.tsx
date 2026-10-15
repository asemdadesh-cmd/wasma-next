"use client";

/**
 * Act 4, clarity. A priced ledger, not a card grid. Rows wipe in from the
 * reading edge; the row that fits the visitor's business inverts to ink.
 */
import { motion } from "framer-motion";
import { packageIds, PRICES } from "@/lib/business";
import { useReduced } from "@/hooks/useMedia";
import type { Dict } from "@/lib/dictionaries/ar";
import { formatLYD, type Locale } from "@/lib/i18n";
import { whatsappHref } from "@/lib/site";
import { useBusiness } from "./Business";

export function Packages({ lang, t }: { lang: Locale; t: Dict }) {
  const reduce = useReduced();
  const biz = useBusiness();
  const tp = t.packages;
  const hidden = lang === "ar" ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)";

  return (
    <section id="packages" aria-labelledby="packages-title" className="bg-paper py-[var(--section)]" data-sc-act="reveal">
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-12">
          <h2 id="packages-title" className="display text-[clamp(2.3rem,4.8vw,4.6rem)] lg:col-span-8">
            {tp.title}
          </h2>
          <p className="pretty max-w-[44ch] text-lg leading-relaxed text-ink/80 lg:col-span-4 lg:self-end">{tp.lead}</p>
        </div>

        <ul className="mt-[clamp(3rem,6vw,5rem)] border-t border-ink">
          {packageIds.map((id, i) => {
            const item = tp.items[id];
            const fit = biz.pkg === id;
            const price = PRICES[id];
            const ask = whatsappHref(`${t.proposal.hi} ${t.proposal.want} «${item.name}» ${t.biz.items[biz.id].mine}. ${t.proposal.ask}`);
            return (
              <motion.li
                key={id}
                initial={reduce ? false : { clipPath: hidden }}
                whileInView={{ clipPath: "inset(0 0 0 0)" }}
                viewport={{ once: true, margin: "0px 0px -12% 0px" }}
                transition={{ duration: 0.9, delay: i * 0.08, ease: [0.76, 0, 0.24, 1] }}
                className={`grid gap-6 border-b px-[clamp(0rem,2vw,1.5rem)] py-8 transition-colors duration-500 lg:grid-cols-12 lg:items-start ${fit ? "on-ink border-ink bg-ink text-paper" : "border-line"}`}
              >
                <div className="lg:col-span-4">
                  <h3 className="text-[clamp(1.5rem,2.4vw,2.1rem)] font-semibold leading-tight">{item.name}</h3>
                  {fit && (
                    <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold">
                      <span aria-hidden="true" className="size-2.5 bg-lime" />
                      {tp.fit}
                    </p>
                  )}
                </div>
                <ul className={`grid gap-2 text-[1rem] leading-relaxed lg:col-span-5 ${fit ? "text-paper/85" : "text-ink/80"}`}>
                  {item.list.map((x) => (
                    <li key={x} className="flex gap-3">
                      <span aria-hidden="true" className={`mt-[0.7rem] h-px w-3 shrink-0 ${fit ? "bg-paper/60" : "bg-ink/50"}`} />
                      {x}
                    </li>
                  ))}
                </ul>
                <div className="lg:col-span-3 lg:text-end">
                  <p className={`text-sm ${fit ? "text-mute-dark" : "text-mute"}`}>{tp.from}</p>
                  <p className="tabular mt-1 text-[clamp(1.9rem,3vw,2.6rem)] font-semibold leading-none">{formatLYD(price.from, lang)}</p>
                  <p className={`tabular mt-2 text-sm ${fit ? "text-mute-dark" : "text-mute"}`}>
                    + {formatLYD(price.yearly, lang)} {tp.yearly}
                  </p>
                  {item.ready && (
                    <p className={`mt-1 text-sm ${fit ? "text-mute-dark" : "text-mute"}`}>
                      {tp.ready} {item.ready}
                    </p>
                  )}
                  <a href={ask} target="_blank" rel="noopener noreferrer" className={`mt-4 inline-flex min-h-11 items-center text-[0.95rem] font-semibold ${fit ? "text-paper" : "text-ink"}`}>
                    <span className="link-u">{tp.ask}</span>
                  </a>
                </div>
              </motion.li>
            );
          })}
        </ul>

        <div className="mt-10 grid gap-4 text-[1.05rem] leading-relaxed lg:grid-cols-3 lg:gap-10">
          {[tp.founding, tp.kit, tp.custom].map((line, i) => (
            <p key={line} className="flex gap-3 border-t border-line pt-4">
              <span aria-hidden="true" className={`mt-[0.55rem] size-2.5 shrink-0 ${i === 0 ? "bg-lime outline outline-1 outline-ink" : "bg-ink"}`} />
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
