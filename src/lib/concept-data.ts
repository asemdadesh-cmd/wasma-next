/**
 * Illustrative sample data for the five fictional concepts. Every value here
 * is invented for demonstration and labelled as such on the pages.
 */
import type { L } from "./i18n";

/* SAHRA: coastal retreat */
export type Room = { id: string; name: L; size: number; view: L; rate: number; sleeps: number; text: L };
export const rooms: Room[] = [
  {
    id: "courtyard",
    name: { ar: "غرفة الفناء", en: "Courtyard Room" },
    size: 32,
    view: { ar: "على الفناء والزيتونة", en: "Over the courtyard olive" },
    rate: 420,
    sleeps: 2,
    text: { ar: "جدران حجرية باردة، سرير منخفض، وضوء صباحي يدخل من الفناء.", en: "Cool stone walls, a low bed, and morning light from the courtyard." },
  },
  {
    id: "sea",
    name: { ar: "جناح البحر", en: "Sea Suite" },
    size: 48,
    view: { ar: "على البحر مباشرة", en: "Facing the open sea" },
    rate: 690,
    sleeps: 3,
    text: { ar: "شرفة بستارة كتّان، وحوض استحمام حجري، والبحر في كل نافذة.", en: "A linen-curtained terrace, a stone bath, and sea in every window." },
  },
  {
    id: "pool",
    name: { ar: "بيت المسبح", en: "Pool House" },
    size: 64,
    view: { ar: "مسبح خاص", en: "Private pool" },
    rate: 980,
    sleeps: 4,
    text: { ar: "بيت مستقل بمسبح أزرق صغير، وفناء للعشاء تحت السماء.", en: "A standalone house with a small cobalt pool and a courtyard for dinner outdoors." },
  },
];
export const SAHRA_GUEST_SUPPLEMENT = 60; // per extra guest per night beyond two

/* NURA: objects shop */
export type Finish = { id: string; name: L; hex: string };
export type Product = { id: string; name: L; kind: L; text: L; sizes: { id: string; label: string; price: number }[]; finishes: Finish[] };
export const products: Product[] = [
  {
    id: "vessel",
    name: { ar: "قارورة نورا", en: "NURA Vessel" },
    kind: { ar: "قارورة زجاج", en: "Glass bottle" },
    text: { ar: "زجاج منفوخ يدويًا بعنق ضيّق، لزيت الزيتون أو لغصن واحد.", en: "Hand-blown glass with a narrow neck, for olive oil or a single stem." },
    sizes: [
      { id: "s", label: "350 ml", price: 85 },
      { id: "m", label: "500 ml", price: 110 },
      { id: "l", label: "750 ml", price: 140 },
    ],
    finishes: [
      { id: "forest", name: { ar: "غابة", en: "Forest" }, hex: "#1F4D3A" },
      { id: "amber", name: { ar: "كهرمان", en: "Amber" }, hex: "#9A5B1E" },
      { id: "smoke", name: { ar: "دخان", en: "Smoke" }, hex: "#3A3F44" },
    ],
  },
  {
    id: "jar",
    name: { ar: "برطمان الحجر", en: "Stone Jar" },
    kind: { ar: "خزف مزجّج", en: "Glazed ceramic" },
    text: { ar: "خزف عاجيّ بغطاء محكم، للتمر والتوابل وما تحب أن تراه كل يوم.", en: "Ivory ceramic with a tight lid, for dates, spices, and everyday things." },
    sizes: [
      { id: "s", label: "Ø 9 cm", price: 70 },
      { id: "m", label: "Ø 12 cm", price: 95 },
      { id: "l", label: "Ø 16 cm", price: 125 },
    ],
    finishes: [
      { id: "ivory", name: { ar: "عاجي", en: "Ivory" }, hex: "#EFE9DC" },
      { id: "sand", name: { ar: "رملي", en: "Sand" }, hex: "#CDB892" },
      { id: "cobalt", name: { ar: "كوبالت", en: "Cobalt" }, hex: "#2F5BFF" },
    ],
  },
  {
    id: "carton",
    name: { ar: "علبة الورق", en: "Paper Carton" },
    kind: { ar: "صندوق تخزين", en: "Storage box" },
    text: { ar: "ورق مقوّى معاد تدويره بزوايا مدعّمة، يُطوى ويُرتّب بلا أدوات.", en: "Recycled board with reinforced corners. Folds flat, assembles without tools." },
    sizes: [
      { id: "s", label: "A5", price: 35 },
      { id: "m", label: "A4", price: 48 },
      { id: "l", label: "A3", price: 62 },
    ],
    finishes: [
      { id: "kraft", name: { ar: "كرافت", en: "Kraft" }, hex: "#C9B48C" },
      { id: "chalk", name: { ar: "طباشيري", en: "Chalk" }, hex: "#E7E3D8" },
      { id: "char", name: { ar: "فحمي", en: "Charcoal" }, hex: "#2B2F33" },
    ],
  },
];

/* NŌTE: café menu */
export type Diet = "vegan" | "nutfree" | "gf";
export type MenuItem = { id: string; cat: string; name: L; text: L; price: number; diet: Diet[]; hot?: boolean };
export const menuCats: { id: string; name: L }[] = [
  { id: "coffee", name: { ar: "قهوة", en: "Coffee" } },
  { id: "tea", name: { ar: "شاي ومشروبات", en: "Tea & more" } },
  { id: "pastry", name: { ar: "مخبوزات", en: "Pastry" } },
  { id: "breakfast", name: { ar: "فطور", en: "Breakfast" } },
];
export const dietNames: Record<Diet, L> = {
  vegan: { ar: "نباتي", en: "Vegan" },
  nutfree: { ar: "بدون مكسّرات", en: "Nut-free" },
  gf: { ar: "بدون غلوتين", en: "Gluten-free" },
};
export const menu: MenuItem[] = [
  { id: "esp", cat: "coffee", name: { ar: "إسبريسو", en: "Espresso" }, text: { ar: "جرعة مزدوجة، تحميص متوسط.", en: "Double shot, medium roast." }, price: 6, diet: ["vegan", "nutfree", "gf"], hot: true },
  { id: "mac", cat: "coffee", name: { ar: "ماكياتو", en: "Macchiato" }, text: { ar: "إسبريسو ولمسة حليب مخفوق.", en: "Espresso marked with foam." }, price: 7, diet: ["nutfree", "gf"], hot: true },
  { id: "flat", cat: "coffee", name: { ar: "فلات وايت", en: "Flat white" }, text: { ar: "حليب ناعم وقهوة واضحة.", en: "Silky milk, clear coffee." }, price: 9, diet: ["nutfree", "gf"], hot: true },
  { id: "oat", cat: "coffee", name: { ar: "لاتيه الشوفان", en: "Oat latte" }, text: { ar: "بحليب الشوفان، دون سكر مضاف.", en: "Oat milk, no added sugar." }, price: 10, diet: ["vegan", "nutfree"], hot: true },
  { id: "cold", cat: "coffee", name: { ar: "قهوة باردة", en: "Cold brew" }, text: { ar: "منقوعة 18 ساعة، على الثلج.", en: "Steeped 18 hours, over ice." }, price: 9, diet: ["vegan", "nutfree", "gf"] },
  { id: "mint", cat: "tea", name: { ar: "شاي أخضر بالنعناع", en: "Mint green tea" }, text: { ar: "نعناع طازج من السوق.", en: "Fresh market mint." }, price: 5, diet: ["vegan", "nutfree", "gf"], hot: true },
  { id: "red", cat: "tea", name: { ar: "شاي أحمر بالحبق", en: "Red tea with basil" }, text: { ar: "على الطريقة الليبية، بالرغوة.", en: "Libyan style, with foam." }, price: 5, diet: ["vegan", "nutfree", "gf"], hot: true },
  { id: "lemon", cat: "tea", name: { ar: "ليمون ونعناع", en: "Lemon & mint" }, text: { ar: "مثلّج ومنعش.", en: "Iced and sharp." }, price: 7, diet: ["vegan", "nutfree", "gf"] },
  { id: "crois", cat: "pastry", name: { ar: "كرواسون بالزبدة", en: "Butter croissant" }, text: { ar: "يُخبز كل صباح.", en: "Baked every morning." }, price: 8, diet: ["nutfree"] },
  { id: "glaze", cat: "pastry", name: { ar: "دونات بالعسل", en: "Honey-glazed bun" }, text: { ar: "عجينة مخمّرة وطبقة عسل.", en: "Brioche dough, honey glaze." }, price: 9, diet: ["nutfree"] },
  { id: "pist", cat: "pastry", name: { ar: "حلزون الفستق", en: "Pistachio swirl" }, text: { ar: "فستق محمّص وقشر برتقال.", en: "Roasted pistachio, orange zest." }, price: 11, diet: [] },
  { id: "date", cat: "pastry", name: { ar: "كعكة التمر", en: "Date cake" }, text: { ar: "بدون غلوتين، بتمر الجفرة.", en: "Gluten-free, with Jufra dates." }, price: 9, diet: ["gf", "nutfree"] },
  { id: "shak", cat: "breakfast", name: { ar: "شكشوكة", en: "Shakshuka" }, text: { ar: "طماطم وفلفل وبيض، مع خبز.", en: "Tomato, pepper, eggs, bread." }, price: 18, diet: ["nutfree"], hot: true },
  { id: "bowl", cat: "breakfast", name: { ar: "وعاء الشوفان", en: "Oat bowl" }, text: { ar: "شوفان، تين، وطحينة.", en: "Oats, fig, tahini." }, price: 15, diet: ["vegan", "nutfree"] },
  { id: "toast", cat: "breakfast", name: { ar: "توست الجبن والزعتر", en: "Cheese & za'atar toast" }, text: { ar: "خبز محمّص وزيت زيتون.", en: "Toasted bread, olive oil." }, price: 14, diet: ["nutfree"], hot: true },
];

/* MADAR: property search */
export type District = { id: string; name: L; path: string; cx: number; cy: number };
export const districts: District[] = [
  { id: "gargaresh", name: { ar: "قرقارش", en: "Gargaresh" }, path: "M20 60 L120 40 L150 120 L60 150 Z", cx: 85, cy: 95 },
  { id: "andalus", name: { ar: "حي الأندلس", en: "Hay Al-Andalus" }, path: "M120 40 L220 30 L240 110 L150 120 Z", cx: 182, cy: 78 },
  { id: "benashour", name: { ar: "بن عاشور", en: "Ben Ashour" }, path: "M220 30 L320 40 L330 120 L240 110 Z", cx: 278, cy: 75 },
  { id: "souq", name: { ar: "سوق الجمعة", en: "Souq Al-Juma" }, path: "M320 40 L420 60 L410 140 L330 120 Z", cx: 372, cy: 92 },
  { id: "ainzara", name: { ar: "عين زارة", en: "Ain Zara" }, path: "M150 120 L330 120 L310 210 L170 215 Z", cx: 240, cy: 168 },
  { id: "tajoura", name: { ar: "تاجوراء", en: "Tajoura" }, path: "M410 140 L330 120 L310 210 L440 200 Z", cx: 378, cy: 170 },
];
export type Listing = { id: string; district: string; title: L; beds: number; area: number; price: number; kind: "rent" | "sale"; x: number; y: number };
export const listings: Listing[] = [
  { id: "m1", district: "andalus", title: { ar: "شقة بإطلالة على الحديقة", en: "Garden-view apartment" }, beds: 2, area: 120, price: 2400, kind: "rent", x: 170, y: 70 },
  { id: "m2", district: "andalus", title: { ar: "شقة عائلية بطابق علوي", en: "Upper-floor family flat" }, beds: 3, area: 165, price: 3200, kind: "rent", x: 205, y: 92 },
  { id: "m3", district: "gargaresh", title: { ar: "استوديو قرب البحر", en: "Studio near the sea" }, beds: 1, area: 60, price: 1300, kind: "rent", x: 70, y: 85 },
  { id: "m4", district: "gargaresh", title: { ar: "فيلا بحديقة صغيرة", en: "Villa with small garden" }, beds: 4, area: 320, price: 5800, kind: "rent", x: 105, y: 120 },
  { id: "m5", district: "benashour", title: { ar: "شقة مجدّدة بالكامل", en: "Fully renovated flat" }, beds: 2, area: 110, price: 2100, kind: "rent", x: 265, y: 62 },
  { id: "m6", district: "benashour", title: { ar: "مكتب في مبنى حديث", en: "Office in a modern block" }, beds: 0, area: 90, price: 2600, kind: "rent", x: 295, y: 95 },
  { id: "m7", district: "souq", title: { ar: "شقة واسعة بثلاث غرف", en: "Spacious three-bedroom" }, beds: 3, area: 150, price: 2300, kind: "rent", x: 365, y: 80 },
  { id: "m8", district: "ainzara", title: { ar: "منزل بفناء داخلي", en: "House with inner courtyard" }, beds: 4, area: 280, price: 3900, kind: "rent", x: 220, y: 175 },
  { id: "m9", district: "ainzara", title: { ar: "شقة أرضية بموقف خاص", en: "Ground flat with parking" }, beds: 2, area: 115, price: 1700, kind: "rent", x: 268, y: 160 },
  { id: "m10", district: "tajoura", title: { ar: "شاليه على الشاطئ", en: "Beach chalet" }, beds: 2, area: 95, price: 2000, kind: "rent", x: 390, y: 175 },
  { id: "m11", district: "tajoura", title: { ar: "فيلا بمسبح", en: "Villa with pool" }, beds: 5, area: 420, price: 7200, kind: "rent", x: 360, y: 150 },
  { id: "m12", district: "souq", title: { ar: "استوديو للطلاب", en: "Student studio" }, beds: 1, area: 48, price: 950, kind: "rent", x: 395, y: 110 },
];

/* SANAD: clinic booking */
export type Specialty = { id: string; name: L; text: L };
export const specialties: Specialty[] = [
  { id: "family", name: { ar: "طب الأسرة", en: "Family medicine" }, text: { ar: "فحص عام ومتابعة", en: "Check-ups and follow-up" } },
  { id: "dental", name: { ar: "الأسنان", en: "Dentistry" }, text: { ar: "تنظيف وعلاج", en: "Cleaning and treatment" } },
  { id: "derma", name: { ar: "الجلدية", en: "Dermatology" }, text: { ar: "بشرة وشعر", en: "Skin and hair" } },
  { id: "peds", name: { ar: "الأطفال", en: "Paediatrics" }, text: { ar: "من الولادة حتى 14 سنة", en: "Newborn to 14 years" } },
];
export type Doctor = { id: string; spec: string; name: L; langs: L; fee: number; days: number[] };
export const doctors: Doctor[] = [
  { id: "d1", spec: "family", name: { ar: "د. سلمى الورفلي", en: "Dr. Salma Alwarfalli" }, langs: { ar: "العربية، الإنجليزية", en: "Arabic, English" }, fee: 60, days: [0, 1, 3, 4] },
  { id: "d2", spec: "family", name: { ar: "د. خالد المصراتي", en: "Dr. Khaled Almisrati" }, langs: { ar: "العربية", en: "Arabic" }, fee: 50, days: [1, 2, 4] },
  { id: "d3", spec: "dental", name: { ar: "د. ريم الزنتاني", en: "Dr. Reem Alzintani" }, langs: { ar: "العربية، الإيطالية", en: "Arabic, Italian" }, fee: 80, days: [0, 2, 3] },
  { id: "d4", spec: "derma", name: { ar: "د. منى بن حليم", en: "Dr. Mona Ben Halim" }, langs: { ar: "العربية، الفرنسية", en: "Arabic, French" }, fee: 90, days: [1, 3, 4] },
  { id: "d5", spec: "peds", name: { ar: "د. أنس التاجوري", en: "Dr. Anas Altajouri" }, langs: { ar: "العربية، الإنجليزية", en: "Arabic, English" }, fee: 70, days: [0, 1, 2, 3, 4] },
];
export const slotTimes = ["09:00", "09:30", "10:30", "11:00", "12:30", "16:00", "16:30", "17:30"];
/** Deterministic availability so server and client render the same slots. */
export const slotTaken = (doctorId: string, day: number, i: number) => (doctorId.charCodeAt(1) * 7 + day * 3 + i * 5) % 4 === 0;

export const dayNames: L<string[]> = {
  ar: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"],
  en: ["Sun", "Mon", "Tue", "Wed", "Thu"],
};
