import "server-only";
import type { Locale } from "../i18n";
import ar from "./ar";
import en from "./en";

export type { Dict } from "./ar";
export const getDictionary = (lang: Locale) => (lang === "ar" ? ar : en);
