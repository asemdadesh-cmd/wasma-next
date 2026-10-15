// Functional verification of real controls and hand-offs.
// Usage: node scripts/verify.mjs [baseUrl]
import { chromium } from "playwright-core";

const BASE = process.argv[2] ?? "http://localhost:3200";
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok: !!ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
};
const newPage = async (opts = {}) => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...opts });
  const page = await ctx.newPage();
  page.errors = [];
  page.on("pageerror", (e) => page.errors.push(String(e)));
  // Unsplash photos are hotlinked; the build container cannot reach their CDN.
  page.on("console", (m) => m.type() === "error" && !/ERR_TUNNEL_CONNECTION_FAILED|images\.unsplash\.com/.test(m.text() + (m.location()?.url ?? "")) && page.errors.push(m.text()));
  return page;
};

/* Routing, language, direction */
{
  const page = await newPage();
  const r = await page.goto(`${BASE}/`);
  check("/ redirects to Arabic", page.url().endsWith("/ar"), page.url());
  check("Arabic is server-rendered RTL", (await page.getAttribute("html", "dir")) === "rtl" && (await page.getAttribute("html", "lang")) === "ar");
  const raw = await (await fetch(`${BASE}/ar`)).text();
  check("SSR HTML carries lang=ar dir=rtl", /<html[^>]*lang="ar"[^>]*dir="rtl"/.test(raw));
  const rawEn = await (await fetch(`${BASE}/en`)).text();
  check("SSR HTML carries lang=en dir=ltr", /<html[^>]*lang="en"[^>]*dir="ltr"/.test(rawEn));
  await page.click('header a[hreflang="en"]');
  await page.waitForURL(/\/en/);
  check("Language switch goes to /en", page.url().endsWith("/en"));
  const cookies = await page.context().cookies();
  check("Language choice remembered in cookie", cookies.some((c) => c.name === "wasma-lang" && c.value === "en"));
  await page.goto(`${BASE}/`);
  check("Bare URL honours remembered English", page.url().endsWith("/en"), page.url());
  check("No console errors on routing", page.errors.length === 0, page.errors.join(" | "));
  void r;
}

/* 404 */
{
  const r1 = await fetch(`${BASE}/ar/does-not-exist`);
  check("Unknown Arabic path returns 404", r1.status === 404, String(r1.status));
  const t1 = await r1.text();
  check("Arabic 404 copy rendered", t1.includes("هذه الصفحة خارج الإطار"));
  const r2 = await fetch(`${BASE}/en/work/unknown`);
  const t2 = await r2.text();
  check("Unknown English concept returns 404 in English", r2.status === 404 && t2.includes("outside the frame"), String(r2.status));
  const r3 = await fetch(`${BASE}/fr`, { redirect: "manual" });
  check("Unsupported locale redirects into Arabic", r3.status === 307 && (r3.headers.get("location") ?? "").includes("/ar/fr"));
}

/* Signature move: the business switch regrades the page */
{
  const page = await newPage();
  await page.goto(`${BASE}/ar`, { waitUntil: "networkidle" });
  check("Defaults to café", (await page.textContent("h1")).includes("منيو رقمي"));
  await page.click('#top label:has-text("صالون أو عيادة")');
  await page.waitForTimeout(500);
  check("Hero headline regrades to salon", (await page.textContent("h1")).includes("حجوزات"));
  check("Choice mirrored into ?for=", page.url().includes("for=salon"), page.url());
  check("Header switch follows the hero", (await page.inputValue("header select")) === "salon");
  check("Matching package row inverts (bookings)", (await page.textContent("#packages li.bg-ink h3")).includes("نظام حجز"));
  check("Scan act links the salon demo", (await page.getAttribute('#scan a:has-text("افتح المثال")', "href")) === "/ar/work/sanad");
  check("Scan act carries a real QR code", (await page.locator('#scan svg[role="img"][aria-label*="سند"] path').count()) === 1);
  await page.selectOption("header select", "shop");
  await page.waitForTimeout(500);
  check("Header switch regrades too", (await page.textContent("h1")).includes("محلّك"));
  check("Samples rail leads with the visitor's kind", (await page.locator("#samples li").first().getAttribute("id")) === "sample-nura");
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.fill("[data-plate] input", "دكان الزهراء");
  const plate = await page.getAttribute("[data-plate] a", "href");
  const msg = decodeURIComponent(plate ?? "");
  check("Proposal plate sends to +218 91 330 9237", plate?.startsWith("https://wa.me/218913309237?text="));
  check("Proposal message carries package and business name", msg.includes("موقع لمحلّك أو شركتك") && msg.includes("دكان الزهراء"), msg);
  check("Plate shows the starting price", (await page.textContent("[data-plate]")).includes("1,500"));
  check("No console errors on regrade", page.errors.length === 0, page.errors.join(" | "));
}

/* Shared link opens tailored */
{
  const page = await newPage();
  await page.goto(`${BASE}/en?for=property`, { waitUntil: "networkidle" });
  check("?for=property opens tailored", (await page.textContent("h1")).includes("listings on a map"));
  check("No hydration errors on a tailored link", page.errors.length === 0, page.errors.join(" | "));
}

/* Peak: the scan act pins and the phone becomes operable */
{
  const page = await newPage();
  await page.goto(`${BASE}/ar`, { waitUntil: "networkidle" });
  const h = await page.evaluate(() => document.getElementById("scan").offsetHeight / innerHeight);
  check("Scan act is the longest pinned span", h > 3, h.toFixed(2));
  const pan = await page.evaluate(() => document.getElementById("samples").offsetHeight / innerHeight);
  check("Pan act shorter than the peak", pan < h, pan.toFixed(2));
  check("Phone is inert before the scan", await page.evaluate(() => !!document.querySelector("#scan [inert]")));
  await page.evaluate(() => { const s = document.getElementById("scan"); window.scrollTo(0, s.offsetTop + (s.offsetHeight - innerHeight) * 0.8); });
  await page.waitForTimeout(900);
  check("Phone operable after the scan", await page.evaluate(() => !document.querySelector("#scan [inert]")));
  await page.click('#scan button[aria-label="إضافة إسبريسو"]');
  check("Scanned demo works (order total updates)", (await page.textContent("#scan")).includes("طلبك: 1 أصناف"));

  // Concept page CTA carries a concept into the brief
  await page.goto(`${BASE}/ar?like=madar#contact`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const likeChecked = await page.isChecked('input[name="like"][value="madar"]');
  const typeVal = await page.inputValue("#f-type");
  check("Chosen concept is pre-selected in the brief", likeChecked, typeVal);
  check("Project type inferred from concept", typeVal.length > 0, typeVal);

  // Validation
  await page.fill("#f-type", "").catch(() => {});
  await page.click('button:has-text("جهّز رسالتي")');
  await page.waitForTimeout(200);
  const alert = await page.isVisible('[role="alert"]');
  const focusedAlert = await page.evaluate(() => document.activeElement?.getAttribute("role"));
  check("Empty brief shows an error summary", alert);
  check("Error summary receives focus", focusedAlert === "alert", String(focusedAlert));
  check("Invalid fields marked aria-invalid", (await page.getAttribute("#f-name", "aria-invalid")) === "true");
  await page.fill("#f-name", "سالم الترهوني");
  await page.fill("#f-reach", "0913309237");
  await page.fill("#f-message", "نريد منصة عقارية لمكتبنا في طرابلس مع خريطة وفلاتر.");
  await page.click('button:has-text("جهّز رسالتي")');
  await page.waitForTimeout(300);
  const wa = await page.getAttribute('a:has-text("أرسل عبر واتساب")', "href");
  const mail = await page.getAttribute('a:has-text("أرسل عبر البريد")', "href");
  check("WhatsApp hand-off goes to +218 91 330 9237 with the message", wa?.startsWith("https://wa.me/218913309237?text=") && decodeURIComponent(wa).includes("سالم الترهوني") && decodeURIComponent(wa).includes("مدار"));
  check("Email hand-off goes to asemdadesh@gmail.com with subject and body", mail?.startsWith("mailto:asemdadesh@gmail.com?subject=") && decodeURIComponent(mail).includes("طرابلس"));
  check("Ready panel heading receives focus", (await page.evaluate(() => document.activeElement?.tagName)) === "H3");
  check("No console errors on home interactions", page.errors.length === 0, page.errors.join(" | "));
}

/* Concept page ?like= carries into brief */
{
  const page = await newPage();
  await page.goto(`${BASE}/en/work/nura`, { waitUntil: "networkidle" });
  await page.click('a:has-text("Start a project") >> nth=-1');
  await page.waitForURL(/like=nura/);
  await page.waitForTimeout(800);
  check("Concept CTA pre-selects that concept in the English brief", await page.isChecked('input[name="like"][value="nura"]'));
}

/* No-JS brief fallback posts, never GETs personal data */
{
  const page = await newPage({ javaScriptEnabled: false });
  await page.goto(`${BASE}/en#contact`);
  check("Brief form uses POST", (await page.getAttribute('form[action="/api/brief"]', "method")) === "post");
  await page.fill("#f-name", "Test Person");
  await page.fill("#f-reach", "test@example.com");
  await page.selectOption("#f-type", { index: 1 });
  await page.fill("#f-message", "A small company website with Arabic and English.");
  await page.click('button[type="submit"]');
  await page.waitForLoadState();
  const body = await page.textContent("body");
  check("No-JS submission returns the composed message", body.includes("Your message is ready") && body.includes("Test Person"));
  check("Personal data not placed in URL", !page.url().includes("Test"), page.url());
}

/* SAHRA planner */
{
  const page = await newPage();
  await page.goto(`${BASE}/en/work/sahra`, { waitUntil: "networkidle" });
  await page.locator("#stay").scrollIntoViewIfNeeded();
  const est1 = await page.textContent("#stay aside output");
  await page.click('#stay label:has-text("Pool House")');
  const est2 = await page.textContent("#stay aside output");
  check("SAHRA estimate changes with room", est1 !== est2, `${est1} -> ${est2}`);
  await page.click('#stay button[aria-label="Adults +"]');
  await page.click('#stay button[aria-label="Adults +"]');
  await page.click('#stay label:has-text("Courtyard Room")');
  check("SAHRA warns when a room is over capacity", await page.isVisible('#stay [role="alert"]'));
  await page.click('#stay label:has-text("Sea Suite")');
  await page.click('#stay button[aria-label="Adults −"]');
  await page.fill('#stay aside input', "Mariam");
  await page.click('#stay button:has-text("Prepare the request")');
  check("SAHRA prepares a booking request", (await page.textContent('#stay [role="status"]'))?.includes("Mariam"));
  check("SAHRA states nothing is sent", (await page.textContent("#stay")).includes("nothing is sent"));
}

/* NURA bag */
{
  const page = await newPage();
  await page.goto(`${BASE}/ar/work/nura`, { waitUntil: "networkidle" });
  await page.click('#p-jar label:has(input[name="size-jar"]) >> nth=2');
  await page.click('#p-jar button:has-text("أضف إلى الحقيبة")');
  await page.click('#p-jar button:has-text("أضف إلى الحقيبة")');
  await page.click('header button[aria-haspopup="dialog"]');
  await page.waitForTimeout(400);
  const dlg = page.locator('[role="dialog"]');
  check("NURA bag drawer opens as a dialog", await dlg.isVisible());
  const txt = await dlg.textContent();
  check("NURA merges identical lines (qty 2)", /2/.test(await dlg.locator("output").first().textContent()));
  check("NURA total includes delivery", txt.includes("265") || txt.includes("205"), txt.slice(0, 200));
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  check("NURA drawer closes with Escape and restores focus", !(await dlg.isVisible()) && (await page.evaluate(() => document.activeElement?.getAttribute("aria-haspopup"))) === "dialog");
}

/* NŌTE menu */
{
  const page = await newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await page.goto(`${BASE}/en/work/note`, { waitUntil: "networkidle" });
  await page.click('button[aria-label="Add Butter croissant"]');
  await page.click('button[aria-label="Add Flat white"]');
  await page.click('[role="dialog"] label:has-text("Oat")');
  await page.click('[role="dialog"] button:has-text("Add to order")');
  await page.waitForTimeout(400);
  const bar = await page.textContent('button[aria-haspopup="dialog"]');
  check("NŌTE order bar counts items with options", bar.includes("2 items"), bar);
  await page.click('button[aria-pressed="false"]:has-text("Vegan")');
  check("NŌTE diet filter hides non-vegan items", !(await page.isVisible('text="Butter croissant"')));
  await page.click('button[aria-haspopup="dialog"]');
  await page.click('[role="dialog"] button:has-text("Show to staff")');
  await page.waitForTimeout(300);
  check("NŌTE show-to-staff mode opens", await page.isVisible('[aria-label="Show to staff"]'));
}

/* MADAR search */
{
  const page = await newPage();
  await page.goto(`${BASE}/en/work/madar`, { waitUntil: "networkidle" });
  const count0 = await page.locator("[data-listing]").count();
  await page.selectOption("header select >> nth=0", "tajoura");
  const count1 = await page.locator("[data-listing]").count();
  check("MADAR district filter narrows results", count1 < count0 && count1 > 0, `${count0} -> ${count1}`);
  await page.selectOption("header select >> nth=0", "");
  const checks = page.locator('[data-listing] input[type="checkbox"]');
  await checks.nth(0).check();
  await checks.nth(1).check();
  await page.click('button:has-text("Compare") >> nth=-1');
  check("MADAR compare dialog shows a table", await page.isVisible('[role="dialog"] table'));
  await page.keyboard.press("Escape");
  await page.fill('input[type="search"]', "zzzz");
  check("MADAR empty state offers a reset", await page.isVisible('button:has-text("Reset filters")'));
}

/* SANAD booking */
{
  const page = await newPage();
  await page.goto(`${BASE}/en/work/sanad`, { waitUntil: "networkidle" });
  await page.click('button:has-text("Paediatrics")');
  await page.click('button:has-text("Dr. Anas Altajouri")');
  await page.click('#step-2 button:has-text("Mon")');
  await page.click('#step-2 button:not([disabled])[dir="ltr"] >> nth=0');
  await page.click('button:has-text("Continue")');
  check("SANAD validates details", (await page.getAttribute("#s-name", "aria-invalid")) === "true");
  await page.fill("#s-name", "Huda Ali");
  await page.fill("#s-phone", "091 234 5678");
  await page.click('button:has-text("Continue")');
  await page.click('button:has-text("Confirm booking")');
  const ics = await page.getAttribute('a[download="sanad-demo-appointment.ics"]', "href");
  check("SANAD confirmation offers a real .ics file", ics?.startsWith("data:text/calendar") && decodeURIComponent(ics).includes("BEGIN:VEVENT"));
}

/* Reduced motion */
{
  const page = await newPage({ reducedMotion: "reduce" });
  await page.goto(`${BASE}/ar`, { waitUntil: "networkidle" });
  const scanH = await page.evaluate(() => document.getElementById("scan").offsetHeight / innerHeight);
  check("Reduced motion: scan act has no pinned travel", scanH < 1.8, scanH.toFixed(2));
  check("Reduced motion: scan phone operable", await page.evaluate(() => !document.querySelector("#scan [inert]")));
  const panH = await page.evaluate(() => document.getElementById("samples").offsetHeight / innerHeight);
  check("Reduced motion: samples become a swipe rail", panH < 1.8, panH.toFixed(2));
  check("Reduced motion: no hydration errors", page.errors.length === 0, page.errors.join(" | "));
}

/* Mobile menu */
{
  const page = await newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await page.goto(`${BASE}/ar`, { waitUntil: "networkidle" });
  const btn = page.locator('button[aria-controls="site-menu"]');
  check("Mobile menu button visible", await btn.isVisible());
  check("Desktop CTA hidden on phones", !(await page.isVisible('header a.btn-ink')));
  await btn.click();
  check("Mobile menu opens as modal dialog", await page.isVisible("#site-menu"));
  await page.keyboard.press("Escape");
  check("Mobile menu closes on Escape", !(await page.isVisible("#site-menu")));
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  check("No horizontal overflow at 390px", overflow <= 0, String(overflow));
}

/* Phone composition */
{
  const page = await newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await page.goto(`${BASE}/ar`, { waitUntil: "networkidle" });
  check("Phone: scan act is not pinned", (await page.evaluate(() => document.getElementById("scan").offsetHeight / innerHeight)) < 1.8);
  check("Phone: open-the-demo button visible", await page.isVisible('#scan a:has-text("افتح المثال على هذا الهاتف")'));
  check("Phone: samples rail swipes", await page.evaluate(() => { const r = document.querySelector("#samples ul"); return r.scrollWidth > r.clientWidth; }));
  check("No console errors on phone home", page.errors.length === 0, page.errors.join(" | "));
}

{
  const page = await newPage({ viewport: { width: 360, height: 640 } });
  for (const p of ["/ar", "/en", "/ar/work/sahra", "/ar/work/nura", "/ar/work/note", "/ar/work/madar", "/ar/work/sanad"]) {
    await page.goto(`${BASE}${p}`, { waitUntil: "networkidle" });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    check(`No horizontal overflow at 360px: ${p}`, overflow <= 0, String(overflow));
  }
}

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
await browser.close();
process.exit(failed.length ? 1 : 0);
