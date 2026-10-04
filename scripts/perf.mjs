// Scroll smoothness under CPU throttling. Scrolls the page at a steady speed
// and records frame intervals with requestAnimationFrame.
// node scripts/perf.mjs <url> <width> <height> <cpuSlowdown> [pxPerSecond]
import { chromium } from "playwright-core";
const [url, w = "390", h = "844", rate = "4", speed = "1400"] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--enable-gpu-rasterization"] });
const ctx = await browser.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: 2, isMobile: +w < 800, hasTouch: +w < 800 });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
const cdp = await ctx.newCDPSession(page);
await cdp.send("Emulation.setCPUThrottlingRate", { rate: +rate });
const res = await page.evaluate(async (speed) => {
  const max = document.documentElement.scrollHeight - innerHeight;
  const frames = [];
  let long = 0;
  try { new PerformanceObserver((l) => (long += l.getEntries().length)).observe({ type: "longtask", buffered: false }); } catch {}
  await new Promise((resolve) => {
    let last = performance.now();
    const start = last;
    const step = (now) => {
      frames.push(now - last);
      last = now;
      const y = ((now - start) / 1000) * speed;
      window.scrollTo(0, y);
      if (y < max) requestAnimationFrame(step); else resolve();
    };
    requestAnimationFrame(step);
  });
  frames.shift();
  const sorted = [...frames].sort((a, b) => a - b);
  const pct = (q) => sorted[Math.floor(q * (sorted.length - 1))];
  const dropped = frames.filter((f) => f > 25).length;
  return { frames: frames.length, avgFps: +(1000 / (frames.reduce((a, b) => a + b, 0) / frames.length)).toFixed(1), p50: +pct(0.5).toFixed(1), p95: +pct(0.95).toFixed(1), p99: +pct(0.99).toFixed(1), over25ms: dropped, pctSmooth: +(100 * (1 - dropped / frames.length)).toFixed(1), longTasks: long };
}, +speed);
console.log(JSON.stringify({ url, viewport: `${w}x${h}`, cpuSlowdown: +rate, ...res }));
await browser.close();
