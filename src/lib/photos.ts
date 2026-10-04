import "server-only";
import fs from "node:fs";
import path from "node:path";

export const PHOTO_NAMES = ["studio-surface", "sahra-retreat", "nura-objects", "note-cafe"] as const;
export type PhotoName = (typeof PHOTO_NAMES)[number];
export type PhotoMap = Record<PhotoName, boolean>;

/**
 * Which supplied photographs are present in public/images. Checked at build
 * time, so dropping a WebP into public/images and rebuilding swaps the
 * art-directed SVG scene for the photograph with no code change.
 */
export function getPhotos(): PhotoMap {
  const dir = path.join(process.cwd(), "public", "images");
  return Object.fromEntries(
    PHOTO_NAMES.map((n) => [n, fs.existsSync(path.join(dir, `${n}.webp`))]),
  ) as PhotoMap;
}
