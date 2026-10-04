// Automated accessibility audit (axe-core) on every route, AR and EN.
import { chromium } from "playwright-core";
import fs from "node:fs";
const BASE = process.argv[2] ?? "http://localhost:3200";
const axe = fs.readFileSync("node_modules/axe-core/axe.min.js", "utf8");
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
let total = 0;
for (const lang of ["ar", "en"]) {
  for (const p of ["", "/work/sahra", "/work/nura", "/work/note", "/work/madar", "/work/sanad", "/missing"]) {
    await page.goto(`${BASE}/${lang}${p}`, { waitUntil: "networkidle" });
    await page.addScriptTag({ content: axe });
    const res = await page.evaluate(async () => (await window.axe.run(document, { resultTypes: ["violations"] })).violations.map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length, sample: v.nodes.slice(0, 2).map((n) => n.target.join(" ") + " :: " + (n.failureSummary || "").split("\n")[1]) })));
    total += res.length;
    console.log(`/${lang}${p}: ${res.length ? "" : "clean"}`);
    res.forEach((v) => console.log(`  ${v.impact} ${v.id} x${v.n}\n    ${v.sample.join("\n    ")}`));
  }
}
console.log(`violations: ${total}`);
await browser.close();
