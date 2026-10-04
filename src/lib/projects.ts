import type { L } from "./i18n";

export const projectSlugs = ["sahra", "nura", "note", "madar", "sanad"] as const;
export type ProjectSlug = (typeof projectSlugs)[number];

export type Project = {
  slug: ProjectSlug;
  name: L;
  /** Short category label, e.g. "Coastal retreat". */
  kind: L;
  /** What the visitor can do in the concept. */
  pitch: L;
  /** What kind of client this concept speaks to (used in the brief form). */
  forWho: L;
  /** Features exercised by the concept. */
  features: L<string[]>;
  /** The concept's own palette, shown as a swatch strip. */
  palette: string[];
  /** Scroll device used inside the concept. */
  motion: L;
  photo?: "sahra-retreat" | "nura-objects" | "note-cafe";
};

export const projects: Project[] = [
  {
    slug: "sahra",
    name: { ar: "صحرا", en: "SAHRA" },
    kind: { ar: "منتجع ساحلي", en: "Coastal retreat" },
    pitch: {
      ar: "موقع ضيافة يُقرأ كمجلّة. خطّط إقامتك: اختر التواريخ والغرفة وشاهد التقدير يتغيّر فورًا.",
      en: "A hospitality site that reads like a magazine. Plan a stay: choose dates and a room and watch the estimate update.",
    },
    forWho: { ar: "فنادق، منتجعات، بيوت ضيافة", en: "Hotels, retreats, guesthouses" },
    features: {
      ar: ["مخطّط إقامة", "معرض غرف أفقي", "طلب حجز عبر واتساب"],
      en: ["Stay planner", "Horizontal room gallery", "WhatsApp booking request"],
    },
    palette: ["#E9E1D1", "#C9B79A", "#5F6B3A", "#1F4FA0", "#1B1A17"],
    motion: { ar: "نافذة الفناء تتّسع مع التمرير", en: "The courtyard window widens as you scroll" },
    photo: "sahra-retreat",
  },
  {
    slug: "nura",
    name: { ar: "نورا", en: "NURA" },
    kind: { ar: "متجر أدوات منزلية", en: "Objects shop" },
    pitch: {
      ar: "متجر إلكتروني بمسرح منتج ثابت. اختر الحجم واللون، أضِف إلى الحقيبة، وعدّل الكميات.",
      en: "A shop built around a pinned product stage. Choose size and finish, add to the bag, adjust quantities.",
    },
    forWho: { ar: "علامات تجارية، متاجر، منتجات محلية", en: "Brands, retailers, local makers" },
    features: {
      ar: ["منتقي الخيارات", "حقيبة تسوّق جانبية", "إجمالي محسوب"],
      en: ["Variant picker", "Bag drawer", "Calculated totals"],
    },
    palette: ["#16181A", "#2B2F33", "#1F4D3A", "#2F5BFF", "#EDEBE4"],
    motion: { ar: "المنتج يثبت وتتبدّل تفاصيله", en: "The product holds while its details change" },
    photo: "nura-objects",
  },
  {
    slug: "note",
    name: { ar: "نوتة", en: "NŌTE" },
    kind: { ar: "قائمة مقهى رقمية", en: "Café digital menu" },
    pitch: {
      ar: "قائمة طعام رقمية للهاتف أولًا. تصفّح الأقسام، صفِّ حسب النظام الغذائي، وكوّن طلبك لتعرضه على النادل.",
      en: "A phone-first digital menu. Browse sections, filter by diet, and build an order to show your server.",
    },
    forWho: { ar: "مقاهٍ، مطاعم، مخابز", en: "Cafés, restaurants, bakeries" },
    features: {
      ar: ["أقسام بتتبّع التمرير", "فلاتر غذائية", "قائمة طلب"],
      en: ["Scroll-tracked sections", "Diet filters", "Order list"],
    },
    palette: ["#B4432C", "#E7D6C1", "#3A2219", "#F2B33D", "#FBF4EA"],
    motion: { ar: "شريط الأقسام يتبع القراءة", en: "The section bar follows your reading" },
    photo: "note-cafe",
  },
  {
    slug: "madar",
    name: { ar: "مدار", en: "MADAR" },
    kind: { ar: "منصّة عقارات", en: "Property search" },
    pitch: {
      ar: "بحث عقاري حيّ في طرابلس. صفِّ حسب الحيّ والغرف والميزانية، والخريطة والقائمة تتحرّكان معًا.",
      en: "Live property search in Tripoli. Filter by district, bedrooms and budget while the map and list move together.",
    },
    forWho: { ar: "مكاتب عقارية، مطوّرون، إدارة أملاك", en: "Agencies, developers, property managers" },
    features: {
      ar: ["خريطة تفاعلية", "فلاتر مترابطة", "مقارنة العقارات"],
      en: ["Interactive map", "Linked filters", "Compare tray"],
    },
    palette: ["#E8ECEE", "#C7D0D5", "#2E3A42", "#B5523B", "#0F1417"],
    motion: { ar: "الخريطة تقترب من الحيّ المختار", en: "The map closes in on the chosen district" },
  },
  {
    slug: "sanad",
    name: { ar: "سند", en: "SANAD" },
    kind: { ar: "حجز مواعيد عيادة", en: "Clinic booking" },
    pitch: {
      ar: "حجز موعد طبي بخطوات واضحة: التخصص، الطبيب، الموعد، ثم ملخّص جاهز للتأكيد.",
      en: "Medical booking in clear steps: specialty, doctor, time, then a summary ready to confirm.",
    },
    forWho: { ar: "عيادات، مراكز طبية، مختبرات", en: "Clinics, medical centres, labs" },
    features: {
      ar: ["مسار حجز متدرّج", "مواعيد متاحة", "ملخّص قابل للمشاركة"],
      en: ["Stepped booking flow", "Available slots", "Shareable summary"],
    },
    palette: ["#F2F7F5", "#CDE7DE", "#2F8F75", "#14304A", "#0B1A28"],
    motion: { ar: "الخطوات تتراكم كأوراق", en: "Steps stack like sheets" },
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
