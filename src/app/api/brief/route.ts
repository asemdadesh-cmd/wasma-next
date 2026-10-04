import { composeBrief, validateBrief, type Brief } from "@/lib/brief";
import { getDictionary } from "@/lib/dictionaries";
import { dirOf, hasLocale } from "@/lib/i18n";
import { mailtoHref, whatsappHref } from "@/lib/site";

/**
 * No-JavaScript fallback for the brief form. Validates the POST body and
 * returns a small page with the composed message and the two hand-off links.
 * Nothing is stored or sent from the server.
 */
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(request: Request) {
  const form = await request.formData();
  const rawLang = String(form.get("lang") ?? "ar");
  const lang = hasLocale(rawLang) ? rawLang : "ar";
  const t = getDictionary(lang);
  const f = t.contact.form;
  const get = (k: string) => String(form.get(k) ?? "").slice(0, 4000);
  const b: Brief = { name: get("name"), reach: get("reach"), type: get("type"), like: get("like"), timeline: get("timeline"), message: get("message") };
  const errors = validateBrief(b, f, t.services.items.map((s) => s.name));
  const ok = Object.keys(errors).length === 0;
  const message = ok ? composeBrief(b, f, lang) : "";

  const body = ok
    ? `<h1>${esc(f.readyTitle)}</h1><p>${esc(f.readyText)}</p><pre>${esc(message)}</pre>
       <p><a class="b l" href="${esc(whatsappHref(message))}">${esc(f.sendWhatsapp)}</a>
       <a class="b" href="${esc(mailtoHref(f.subject, message))}">${esc(f.sendEmail)}</a></p>`
    : `<h1>${esc(f.errors.summary)}</h1><ul>${Object.values(errors).map((e) => `<li>${esc(e!)}</li>`).join("")}</ul>`;

  const html = `<!doctype html><html lang="${lang}" dir="${dirOf(lang)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>WASMA</title>
<style>body{margin:0;background:#F4F1E8;color:#0B0D0C;font:18px/1.6 system-ui,sans-serif}main{max-width:40rem;margin:0 auto;padding:4rem 1.25rem}h1{font-size:2rem;line-height:1.2}pre{white-space:pre-wrap;background:#0B0D0C;color:#F4F1E8;padding:1rem;font:inherit}.b{display:inline-block;margin:.25rem;padding:.8rem 1.2rem;border:2px solid #0B0D0C;color:#0B0D0C;text-decoration:none;font-weight:600}.l{background:#BFFF38}a{color:inherit}</style></head>
<body><main>${body}<p><a href="/${lang}#contact">${esc(f.edit)}</a></p></main></body></html>`;

  return new Response(html, { status: ok ? 200 : 422, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
}
