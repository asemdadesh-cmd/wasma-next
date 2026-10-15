"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Mark";
import { BusinessSelect, HeaderCta } from "@/components/proposal/Business";
import type { Dict } from "@/lib/dictionaries/ar";
import { type Locale, otherLocale, switchLocalePath } from "@/lib/i18n";

/** Passing `dict` tailors the bar: business switch and a prefilled WhatsApp. Needs the home page's BusinessProvider. */
type Props = { lang: Locale; t: Dict["nav"]; dict?: Dict };

export function rememberLocale(lang: Locale) {
  document.cookie = `wasma-lang=${lang}; path=/; max-age=31536000; samesite=lax`;
}

export function LangSwitch({ lang, label, text, className = "" }: { lang: Locale; label: string; text: string; className?: string }) {
  const pathname = usePathname() || `/${lang}`;
  const to = otherLocale(lang);
  return (
    <Link
      href={switchLocalePath(pathname, to)}
      hrefLang={to}
      lang={to}
      aria-label={label}
      onClick={() => rememberLocale(to)}
      className={`inline-flex min-h-11 items-center px-2 text-sm font-semibold ${className}`}
    >
      {text}
    </Link>
  );
}

export function Nav({ lang, t, dict }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const home = `/${lang}`;

  const links = [
    { href: `${home}#scan`, label: t.scan },
    { href: `${home}#packages`, label: t.packages },
    { href: `${home}#samples`, label: t.samples },
    { href: `${home}#process`, label: t.process },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Modal menu: lock scroll, trap focus, close on Escape, restore focus.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const button = buttonRef.current;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusables = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>("a, button") ?? []).filter((el) => !el.hasAttribute("disabled"));
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab") {
        const els = focusables();
        if (!els.length) return;
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      button?.focus();
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-200 ${
        scrolled || open ? "bg-paper/95 shadow-[0_1px_0_var(--color-line)]" : "bg-transparent"
      }`}
    >
      <div className="wrap flex h-[var(--nav-h)] items-center justify-between gap-6">
        <Link href={home} aria-label={lang === "ar" ? "وسمة، الرئيسية" : "WASMA, home"} className="-m-1 p-1">
          <Logo lang={lang} />
        </Link>

        {dict && <BusinessSelect t={dict.biz} />}

        <div className="flex items-center gap-2 sm:gap-3">
          <LangSwitch lang={lang} label={t.switchLabel} text={t.switchTo} />
          <HeaderCta dict={dict} label={t.whatsapp} />
          <button
            ref={buttonRef}
            type="button"
            className="inline-flex min-h-11 items-center justify-center gap-3 px-1"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only lg:not-sr-only lg:text-[0.95rem] lg:font-semibold">{open ? t.close : t.menu}</span>
            <span aria-hidden="true" className="relative block h-3 w-7">
              <span className={`absolute inset-x-0 top-0 h-[2px] bg-ink transition-transform duration-200 ${open ? "translate-y-[5px] rotate-45" : ""}`} />
              <span className={`absolute inset-x-0 bottom-0 h-[2px] bg-ink transition-transform duration-200 ${open ? "-translate-y-[5px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>

      <div
        ref={panelRef}
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label={t.menu}
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-[var(--nav-h)] overflow-y-auto bg-paper"
      >
        <nav aria-label={t.label} className="wrap flex min-h-full flex-col justify-between pb-10 pt-6">
          <ul className="border-t border-line">
            {[...links, { href: `${home}#contact`, label: t.contact }].map((l, i) => (
              <li key={l.href} className="border-b border-line">
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-16 items-center justify-between py-3 text-[clamp(1.6rem,7vw,2.4rem)] font-semibold"
                >
                  {l.label}
                  {i === links.length && <span className="size-4 bg-lime" aria-hidden="true" />}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-sm text-mute">{lang === "ar" ? "استوديو ويب وحلول رقمية · ليبيا" : "Web & digital studio · Libya"}</p>
        </nav>
      </div>
    </header>
  );
}
