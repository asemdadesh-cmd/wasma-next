import Image from "next/image";
import { NoteScene, NuraScene, SahraScene, StudioSurface } from "./Scenes";

export type SceneName = "studio-surface" | "sahra-retreat" | "nura-objects" | "note-cafe";

const ART = {
  "studio-surface": StudioSurface,
  "sahra-retreat": SahraScene,
  "nura-objects": NuraScene,
  "note-cafe": NoteScene,
};

type Props = {
  name: SceneName;
  /** True when public/images/<name>.webp exists (from lib/photos). */
  photo: boolean;
  alt: string;
  className?: string;
  /** object-position for the photograph, e.g. "56% 50%". */
  position?: string;
  priority?: boolean;
  sizes?: string;
  idPrefix?: string;
};

/**
 * A photograph slot. Renders the supplied WebP when it exists, otherwise the
 * matching art-directed SVG scene. Both fill their container (object-cover).
 */
export function Scene({ name, photo, alt, className = "", position = "50% 50%", priority, sizes = "100vw", idPrefix }: Props) {
  if (photo) {
    return (
      <Image
        src={`/images/${name}.webp`}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={`object-cover ${className}`}
        style={{ objectPosition: position }}
      />
    );
  }
  const Art = ART[name];
  return (
    <span {...(alt ? { role: "img", "aria-label": alt } : { "aria-hidden": true })} className={`absolute inset-0 block ${className}`}>
      <Art className="h-full w-full" idPrefix={idPrefix ?? name} />
    </span>
  );
}
