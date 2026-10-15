import type { ProjectSlug } from "./projects";
import type { PhotoKey } from "./unsplash";

/** The business types the whole home page regrades around. Copy lives in the dictionaries. */
export const businessIds = ["cafe", "salon", "shop", "stay", "property"] as const;
export type BusinessId = (typeof businessIds)[number];

export const packageIds = ["qrBasic", "qrPro", "website", "bookings"] as const;
export type PackageId = (typeof packageIds)[number];

export const BUSINESS: Record<BusinessId, { demo: ProjectSlug; photo: PhotoKey; pkg: PackageId }> = {
  cafe: { demo: "note", photo: "cafe", pkg: "qrBasic" },
  salon: { demo: "sanad", photo: "salon", pkg: "bookings" },
  shop: { demo: "nura", photo: "shop", pkg: "website" },
  stay: { demo: "sahra", photo: "courtyard", pkg: "website" },
  property: { demo: "madar", photo: "tripoli", pkg: "website" },
};

/** "From" prices in LYD, from the launch plan. Suggestions under test, not market research. */
export const PRICES: Record<PackageId, { from: number; yearly: number }> = {
  qrBasic: { from: 350, yearly: 150 },
  qrPro: { from: 700, yearly: 250 },
  website: { from: 1500, yearly: 300 },
  bookings: { from: 2500, yearly: 400 },
};

export const isBusiness = (v: string | null): v is BusinessId => !!v && (businessIds as readonly string[]).includes(v);
