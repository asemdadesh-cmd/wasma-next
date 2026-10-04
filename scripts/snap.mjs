// Quick screenshots at scroll positions: node scripts/snap.mjs <url> <out-prefix> <width> <height> [reduced] [positions...]
import { chromium } from "playwright-core";
const [url, out, w = "1440", h = "900", reduced = "no", ...pos] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1, reducedMotion: reduced === "reduce" ? "reduce" : "no-preference" });
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
const total = await page.evaluate(() => document.documentElement.scrollHeight);
const list = pos.length ? pos.map(Number) : [0];
for (const y of list) {
  const yy = y <= 1 && y > 0 ? Math.round(y * (total - +h)) : y;
  await page.evaluate((v) => window.scrollTo(0, v), yy);
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${out}-${String(yy).padStart(6, "0")}.png` });
}
console.log(JSON.stringify({ total, errors: errors.slice(0, 10), overflow: await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth) }));
await browser.close();
