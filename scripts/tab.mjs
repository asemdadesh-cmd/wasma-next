// Walk the first N tab stops and report what receives focus.
import { chromium } from "playwright-core";
const [url, n = "16", w = "1440"] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: +w, height: 900 } });
await p.goto(url, { waitUntil: "networkidle" });
for (let i = 0; i < +n; i++) {
  await p.keyboard.press("Tab");
  const d = await p.evaluate(() => { const e = document.activeElement; const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return `${e.tagName.toLowerCase()} "${(e.getAttribute("aria-label") || e.textContent || "").trim().slice(0, 40)}" visible=${r.width > 0 && r.bottom > 0 && r.top < innerHeight} outline=${cs.outlineStyle}`; });
  console.log(String(i + 1).padStart(2), d);
}
await b.close();
