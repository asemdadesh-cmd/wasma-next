"use client";

/**
 * Act 2, mild unease. Authored silence before the peak: no image, no control,
 * three plain lines from the visitor's own week, the last one landing hardest.
 */
import { motion } from "framer-motion";
import { useReduced } from "@/hooks/useMedia";
import type { Dict } from "@/lib/dictionaries/ar";
import { useBusiness } from "./Business";

export function Friction({ t }: { t: Dict }) {
  const reduce = useReduced();
  const { id } = useBusiness();
  const lines = t.biz.items[id].scene;
  return (
    <section aria-labelledby="friction-title" className="bg-paper py-[clamp(6rem,16vw,13rem)]" data-sc-act="flow">
      <div className="wrap grid gap-10 lg:grid-cols-12">
        <h2 id="friction-title" className="text-sm font-semibold text-mute lg:col-span-3">
          {t.friction.title}
        </h2>
        <div className="lg:col-span-8 lg:col-start-5">
          <ul key={id} className="grid gap-[clamp(1.25rem,3vw,2.5rem)]">
            {lines.map((line, i) => (
              <motion.li
                key={line}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -15% 0px" }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.23, 1, 0.32, 1] }}
                className={`balance text-[clamp(1.7rem,3.6vw,3.2rem)] font-medium leading-[1.2] ${i === lines.length - 1 ? "text-ink" : "text-ink/55"}`}
              >
                {line}
              </motion.li>
            ))}
          </ul>
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-[clamp(3rem,7vw,6rem)] flex items-center gap-3 border-t border-line pt-6 text-lg font-semibold"
          >
            <span aria-hidden="true" className="size-3 shrink-0 bg-lime" />
            {t.friction.after}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
