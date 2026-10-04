import Image from "next/image";
import { SCENES, type SceneName } from "./Layers";

export type { SceneName };

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

/** The planes of a scene flattened into one SVG, for still placements. */
export function SceneArt({ name, idPrefix, className = "h-full w-full" }: { name: SceneName; idPrefix: string; className?: string }) {
  const planes = SCENES[name]((s) => `${idPrefix}-${s}`);
  return (
    <svg viewBox="0 0 1536 1024" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true" focusable="false">
      {planes.map((pl) => (
        <g key={pl.key} opacity={pl.fade ? pl.fade[0] : undefined}>
          {pl.node}
        </g>
      ))}
    </svg>
  );
}

/**
 * A still image slot: the supplied WebP when it exists, otherwise the
 * illustrated scene. Fills its container.
 */
export function Scene({ name, photo, alt, className = "", position = "50% 50%", priority, sizes = "100vw", idPrefix }: Props) {
  if (photo) {
    return (
      <Image src={`/images/${name}.webp`} alt={alt} fill priority={priority} sizes={sizes} className={`object-cover ${className}`} style={{ objectPosition: position }} />
    );
  }
  return (
    <span {...(alt ? { role: "img", "aria-label": alt } : { "aria-hidden": true })} className={`absolute inset-0 block ${className}`}>
      <SceneArt name={name} idPrefix={idPrefix ?? name} />
    </span>
  );
}
