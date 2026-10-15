"use client";

import Image from "next/image";
import { PHOTOS, unsplashUrl, type PhotoKey } from "@/lib/unsplash";

/** Unsplash's CDN does the resizing, so next/image only builds the srcset. */
const loader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => unsplashUrl(src, width, quality ?? 72);

type Props = { photo: PhotoKey; alt: string; sizes: string; preload?: boolean; className?: string };

export function Photo({ photo, alt, sizes, preload, className = "" }: Props) {
  return (
    <Image
      loader={loader}
      src={PHOTOS[photo].src}
      alt={alt}
      fill
      sizes={sizes}
      preload={preload}
      loading={preload ? "eager" : "lazy"}
      className={`object-cover ${className}`}
    />
  );
}
