"use client";

/**
 * The signature move's state: which kind of business the visitor runs.
 * Choosing one regrades the page (photos, headline, demo, package, message).
 * The choice is mirrored into ?for= so a shared link opens already tailored.
 */
import { MotionConfig } from "framer-motion";
import { createContext, useCallback, useContext, useState, useSyncExternalStore } from "react";
import { BUSINESS, businessIds, isBusiness, type BusinessId } from "@/lib/business";
import type { Dict } from "@/lib/dictionaries/ar";
import { SITE, whatsappHref } from "@/lib/site";

type Ctx = { id: BusinessId; set: (id: BusinessId) => void };

const BusinessContext = createContext<Ctx | null>(null);

const noop = () => () => {};
const fromUrl = () => {
  const q = new URLSearchParams(window.location.search).get("for");
  return isBusiness(q) ? q : null;
};

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const linked = useSyncExternalStore(noop, fromUrl, () => null);
  const [picked, setPicked] = useState<BusinessId | null>(null);
  const id = picked ?? linked ?? "cafe";

  const set = useCallback((next: BusinessId) => {
    setPicked(next);
    const url = new URL(window.location.href);
    url.searchParams.set("for", next);
    window.history.replaceState(window.history.state, "", url);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <BusinessContext.Provider value={{ id, set }}>{children}</BusinessContext.Provider>
    </MotionConfig>
  );
}

export function useBusiness() {
  const ctx = useContext(BusinessContext);
  if (!ctx) throw new Error("useBusiness outside BusinessProvider");
  return { ...ctx, ...BUSINESS[ctx.id] };
}

export const useBusinessOptional = () => useContext(BusinessContext);

/** The prefilled WhatsApp opener for the visitor's business and package. */
export function proposalMessage(t: Dict, id: BusinessId, name = "") {
  const pkg = t.packages.items[BUSINESS[id].pkg].name;
  const mine = t.biz.items[id].mine;
  const named = name.trim() ? ` (${name.trim()})` : "";
  return `${t.proposal.hi} ${t.proposal.want} «${pkg}» ${mine}${named}. ${t.proposal.ask}`;
}

export const proposalHref = (t: Dict, id: BusinessId, name = "") => whatsappHref(proposalMessage(t, id, name));

/** Header control: a native select, so it is keyboard and screen-reader friendly everywhere. */
export function BusinessSelect({ t }: { t: Dict["biz"] }) {
  const { id, set } = useBusiness();
  return (
    <label className="relative hidden items-center gap-3 lg:flex">
      <span className="text-sm text-mute">{t.label}</span>
      <span className="relative">
        <select
          value={id}
          onChange={(e) => isBusiness(e.target.value) && set(e.target.value)}
          className="min-h-11 cursor-pointer appearance-none border-b-2 border-ink bg-transparent pe-8 ps-1 text-[0.95rem] font-semibold outline-none"
        >
          {businessIds.map((b) => (
            <option key={b} value={b}>
              {t.items[b].label}
            </option>
          ))}
        </select>
        <span aria-hidden="true" className="pointer-events-none absolute end-1 top-1/2 size-2 -translate-y-1/2 bg-lime" />
      </span>
    </label>
  );
}

/** Hero control: the same choice as large radio chips. */
export function BusinessChips({ t, tone = "ink" }: { t: Dict["biz"]; tone?: "ink" | "paper" }) {
  const { id, set } = useBusiness();
  const on = tone === "ink" ? "peer-checked:bg-ink peer-checked:text-paper peer-checked:border-ink" : "peer-checked:bg-paper peer-checked:text-ink peer-checked:border-paper";
  return (
    <fieldset>
      <legend className="text-sm text-mute">{t.hint}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {businessIds.map((b) => (
          <label key={b} className="cursor-pointer">
            <input type="radio" name="business" value={b} checked={id === b} onChange={() => set(b)} className="peer sr-only" />
            <span
              className={`inline-flex min-h-11 items-center gap-2 border border-ink/25 px-4 text-[0.95rem] font-medium transition-colors duration-200 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink ${on}`}
            >
              {id === b && <span aria-hidden="true" className="size-2 bg-lime" />}
              {t.items[b].label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Header WhatsApp call to action that carries the visitor's choice. */
export function HeaderCta({ dict, label }: { dict?: Dict; label: string }) {
  const ctx = useBusinessOptional();
  const href = ctx && dict ? proposalHref(dict, ctx.id) : `https://wa.me/${SITE.whatsapp}`;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="btn btn-ink hidden !min-h-11 text-[0.95rem] md:inline-flex">
      <span className="btn-square" aria-hidden="true" />
      {label}
    </a>
  );
}
