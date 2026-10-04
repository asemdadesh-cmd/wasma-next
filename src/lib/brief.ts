import type { Dict } from "./dictionaries/ar";
import type { Locale } from "./i18n";
import { projects, type ProjectSlug } from "./projects";

export type Brief = { name: string; reach: string; type: string; like: string; timeline: string; message: string };
export type BriefErrors = Partial<Record<"name" | "reach" | "type" | "message", string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateBrief(b: Brief, f: Dict["contact"]["form"], types: string[]): BriefErrors {
  const e: BriefErrors = {};
  if (b.name.trim().length < 2) e.name = f.errors.name;
  const digits = b.reach.replace(/[\s\-()+]/g, "");
  if (!EMAIL.test(b.reach.trim()) && !/^\d{8,15}$/.test(digits)) e.reach = f.errors.reach;
  if (!types.includes(b.type)) e.type = f.errors.type;
  if (b.message.trim().length < 20) e.message = f.errors.message;
  return e;
}

/** The plain-text message handed to email or WhatsApp. */
export function composeBrief(b: Brief, f: Dict["contact"]["form"], lang: Locale) {
  const like = projects.find((p) => p.slug === b.like);
  const rows: [string, string][] = [
    [f.labels.name, b.name.trim()],
    [f.labels.reach, b.reach.trim()],
    [f.labels.type, b.type],
  ];
  if (like) rows.push([f.labels.like, `${like.name[lang]} (${like.kind[lang]})`]);
  if (b.timeline) rows.push([f.labels.timeline, b.timeline]);
  return [f.greeting, "", ...rows.map(([k, v]) => `${k}: ${v}`), "", `${f.labels.message}:`, b.message.trim()].join("\n");
}

/** A sensible project type for each concept, by index into services.items. */
export const LIKE_TO_SERVICE: Record<ProjectSlug, number> = { sahra: 3, nura: 1, note: 2, madar: 5, sanad: 3 };
