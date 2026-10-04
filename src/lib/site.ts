export const SITE = {
  name: "WASMA",
  nameAr: "وسمة",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://wasma.studio",
  email: "asemdadesh@gmail.com",
  whatsapp: "218913309237",
  whatsappDisplay: "+218 91 330 9237",
};

export const mailtoHref = (subject: string, body: string) =>
  `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

export const whatsappHref = (text: string) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
