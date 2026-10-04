import Link from "next/link";
import { Mark } from "@/components/brand/Mark";
import type { Dict } from "@/lib/dictionaries/ar";
import type { Locale } from "@/lib/i18n";
import { projects } from "@/lib/projects";
import { SITE, whatsappHref } from "@/lib/site";
import { LangSwitch } from "./Nav";

type Props = { lang: Locale; t: Dict };

export function Footer({ lang, t }: Props) {
  const home = `/${lang}`;
  const year = 2026;
  return (
    <footer className="on-ink relative overflow-hidden bg-ink text-paper" data-sc-act="flow">
      <div className="wrap pt-[clamp(4rem,9vw,8rem)]">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="balance max-w-[28ch] text-[clamp(1.35rem,2.2vw,1.9rem)] font-medium leading-snug">{t.footer.line}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`${home}#contact`} className="btn btn-lime">
                {t.nav.contact}
              </Link>
            </div>
          </div>

          <nav aria-label={t.footer.explore} className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            <div>
              <h2 className="text-sm text-mute-dark">{t.footer.explore}</h2>
              <ul className="mt-4 space-y-1">
                {[
                  [`${home}#work`, t.nav.work],
                  [`${home}#capabilities`, t.nav.capabilities],
                  [`${home}#process`, t.nav.process],
                  [`${home}#services`, t.nav.services],
                ].map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className="inline-flex min-h-10 items-center">
                      <span className="link-u">{label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-sm text-mute-dark">{t.footer.concepts}</h2>
              <ul className="mt-4 space-y-1">
                {projects.map((p) => (
                  <li key={p.slug}>
                    <Link href={`${home}/work/${p.slug}`} className="inline-flex min-h-10 items-center gap-2">
                      <span className="link-u">{p.name[lang]}</span>
                      <span className="text-sm text-mute-dark">{p.kind[lang]}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h2 className="text-sm text-mute-dark">{t.footer.reach}</h2>
              <ul className="mt-4 space-y-1">
                <li>
                  <a href={`mailto:${SITE.email}`} className="inline-flex min-h-10 items-center break-all" dir="ltr">
                    <span className="link-u">{SITE.email}</span>
                  </a>
                </li>
                <li>
                  <a href={whatsappHref(t.contact.form.greeting)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center">
                    <span className="link-u tabular" dir="ltr">{SITE.whatsappDisplay}</span>
                    <span className="ms-2 text-sm text-mute-dark">{t.contact.whatsapp}</span>
                  </a>
                </li>
                <li>
                  <LangSwitch lang={lang} label={t.nav.switchLabel} text={t.nav.switchTo} className="!px-0" />
                </li>
              </ul>
            </div>
          </nav>
        </div>

        {/* The mark returns whole, the square back in its place. */}
        <div className="mt-[clamp(4rem,10vw,9rem)] border-t border-line-dark pt-8" dir="ltr">
          <Mark className="h-auto w-full max-w-[min(100%,72rem)]" inkClassName="fill-paper" title="WASMA" />
        </div>

        <div className="flex flex-col gap-3 border-t border-line-dark py-6 text-sm text-mute-dark sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} WASMA وسمة. {t.footer.rights}
          </p>
          <p>{t.footer.note}</p>
          <a href="#top" className="inline-flex min-h-10 items-center text-paper">
            <span className="link-u">{t.footer.top}</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
