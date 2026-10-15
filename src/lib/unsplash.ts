/**
 * Photographs hotlinked from Unsplash, as their licence and API guidelines ask.
 * Credits render in the footer. `src` is the CDN id, `page` the photo page.
 */
export type PhotoKey = "cafe" | "latte" | "salon" | "clinic" | "shop" | "courtyard" | "tripoli" | "arch";

export type Photo = { src: string; page: string; by: string };

export const PHOTOS: Record<PhotoKey, Photo> = {
  cafe: { src: "photo-1712730642507-d4ad0904e997", page: "6BO-DVSBtqs", by: "SOUrav EK" },
  latte: { src: "photo-1769412340828-7c7600963e71", page: "VmuHQsTUmJM", by: "engin akyurt" },
  salon: { src: "photo-1626379501846-0df4067b8bb9", page: "gI9rvJK61L8", by: "Giorgio Trovato" },
  clinic: { src: "photo-1704455306251-b4634215d98f", page: "Fdku_oMrDvk", by: "Kari Bjorn Photography" },
  shop: { src: "photo-1760863264228-fa0792a2d894", page: "n83UOvQbbcI", by: "Nguyen Tony" },
  courtyard: { src: "photo-1759250451654-72ab594ba2c9", page: "v9wzOYPmD0k", by: "Gunnar Ridderström" },
  tripoli: { src: "photo-1645189645693-3215bfd34569", page: "fWyXwlTEQew", by: "Moayad Zaghdani" },
  arch: { src: "photo-1588889802078-67ce0634a6a3", page: "edecsA5q9xM", by: "Z El Baz" },
};

export const unsplashUrl = (src: string, width: number, quality = 72) =>
  `https://images.unsplash.com/${src}?auto=format&fit=crop&w=${width}&q=${quality}`;

export const unsplashPage = (page: string) =>
  `https://unsplash.com/photos/${page}?utm_source=wasma&utm_medium=referral`;
