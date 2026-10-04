export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ar";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

export const dirOf = (lang: Locale) => (lang === "ar" ? "rtl" : "ltr");

export const otherLocale = (lang: Locale): Locale => (lang === "ar" ? "en" : "ar");

/** A value authored in both languages. */
export type L<T = string> = Record<Locale, T>;

export const pick = <T,>(value: L<T>, lang: Locale): T => value[lang];

/** Swap the locale prefix of a pathname. */
export const switchLocalePath = (pathname: string, to: Locale) => {
  const parts = pathname.split("/");
  if (parts[1] && hasLocale(parts[1])) parts[1] = to;
  else parts.splice(1, 0, to);
  return parts.join("/") || `/${to}`;
};

const arDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

/** Numbers stay Western in both languages (common in Libyan digital usage) unless asked. */
export const num = (n: number | string, lang: Locale, eastern = false) =>
  eastern && lang === "ar" ? String(n).replace(/\d/g, (d) => arDigits[Number(d)]) : String(n);

export const formatLYD = (value: number, lang: Locale) =>
  lang === "ar" ? `${value.toLocaleString("en-US")} د.ل` : `LYD ${value.toLocaleString("en-US")}`;
