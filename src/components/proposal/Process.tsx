"use client";

/** Act 6, calm. Four plain steps on paper, settling in as they arrive. */
import { motion } from "framer-motion";
import { useReduced } from "@/hooks/useMedia";
import type { Dict } from "@/lib/dictionaries/ar";

export function Process({ t }: { t: Dict["process"] }) {
  const reduce = useReduced();
  return (
    <section id="process" aria-labelledby="process-title" className="grain bg-paper py-[var(--section)]" data-sc-act="flow">
      <div className="wrap">
        <h2 id="process-title" className="display max-w-[16ch] text-[clamp(2.3rem,4.6vw,4.4rem)]">
          {t.title}
        </h2>
        <ol className="mt-[clamp(3rem,6vw,5rem)] grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {t.steps.map((s, i) => (
            <motion.li
              key={s.name}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
              className="border-t-2 border-ink pt-6"
            >
              <span aria-hidden="true" className={`block size-3 ${i === 0 ? "bg-lime outline outline-1 outline-ink" : "bg-ink"}`} />
              <h3 className="mt-6 text-[1.35rem] font-semibold leading-snug">{s.name}</h3>
              <p className="pretty mt-3 text-[1rem] leading-relaxed text-ink/75">{s.text}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
