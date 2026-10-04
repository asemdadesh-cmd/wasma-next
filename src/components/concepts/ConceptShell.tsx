import Link from "next/link";
import { Mark } from "@/components/brand/Mark";
import { LangSwitch } from "@/components/site/Nav";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { projects, type ProjectSlug } from "@/lib/projects";

type Props = { lang: Locale; slug: ProjectSlug; children: React.ReactNode };

/**
 * WASMA's frame around a concept: a thin studio bar that says plainly the
 * concept is fictional, and a closing band that leads to the next concept or
 * into the brief with this concept pre-selected.
 */
export function ConceptShell({ lang, slug, children }: Props) {
  const t = getDictionary(lang);
  const i = projects.findIndex((p) => p.slug === slug);
  const p = projects[i];
  const next = projects[(i + 1) % projects.length];
  return (
    <>
      <a href="#concept" className="skip-link">{t.skip}</a>
      <div className="on-ink relative z-[60] bg-ink text-paper">
        <div className="wrap flex min-h-11 items-center justify-between gap-4 py-1.5 text-[0.8rem]">
          <Link href={`/${lang}#chapter-${slug}`} className="flex min-h-9 items-center gap-2 font-semibold" aria-label={`${t.concept.back}, WASMA`}>
            <span dir="ltr"><Mark className="h-3.5 w-auto" inkClassName="fill-paper" /></span>
            <span className="hidden sm:inline">{t.concept.back}</span>
          </Link>
          <p className="truncate text-center text-paper/80">
            <span className="me-2 inline-block size-1.5 bg-lime align-middle" aria-hidden="true" />
            {t.concept.banner}
          </p>
          <LangSwitch lang={lang} label={t.nav.switchLabel} text={t.nav.switchTo} className="!min-h-9 !text-[0.8rem]" />
        </div>
      </div>
      <div id="concept">{children}</div>
      <aside aria-label={t.concept.next} className="on-ink bg-ink text-paper" data-sc-act="flow">
        <div className="wrap grid gap-8 py-16 md:grid-cols-2 md:items-end">
          <div>
            <p className="text-sm text-mute-dark">{t.work.fictional} · {p.kind[lang]}</p>
            <p className="display mt-3 text-[clamp(2rem,4vw,3.4rem)]">{t.concept.want}</p>
            <Link href={`/${lang}?like=${slug}#contact`} className="btn btn-lime mt-8">
              {t.nav.contact}
            </Link>
          </div>
          <Link href={`/${lang}/work/${next.slug}`} className="group block border-t border-line-dark pt-6 md:text-end">
            <span className="text-sm text-mute-dark">{t.concept.next}</span>
            <span className="mt-2 block text-[clamp(2.4rem,6vw,5rem)] font-semibold leading-none">
              <span className="link-u">{next.name[lang]}</span>
            </span>
            <span className="mt-2 block text-mute-dark">{next.kind[lang]}</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
