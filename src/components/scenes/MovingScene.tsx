"use client";

import { motion, useMotionValue, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";
import { SCENES, type Plane, type SceneName } from "./Layers";

type Props = {
  name: SceneName;
  /** 0 to 1 scroll progress that drives the planes. */
  progress: MotionValue<number>;
  photo: boolean;
  alt: string;
  /** Total vertical travel in px of a depth-1 plane (Scroll Craft keeps this under ~200). */
  travel?: number;
  position?: string;
  priority?: boolean;
  idPrefix?: string;
  className?: string;
};

function PlaneLayer({ plane, progress, travel }: { plane: Plane; progress: MotionValue<number>; travel: number }) {
  const half = (plane.depth * travel) / 2;
  const y = useTransform(progress, [0, 1], [half, -half]);
  const x = useTransform(progress, [0, 1], [-(plane.drift ?? 0) / 2, (plane.drift ?? 0) / 2]);
  const opacity = useTransform(progress, [0, 1], plane.fade ?? [1, 1]);
  const inner = useTransform(progress, (v) => {
    const t = v - 0.5;
    return `rotate(${((plane.rotate ?? 0) * t).toFixed(2)}deg) skewX(${((plane.sway ?? 0) * t).toFixed(2)}deg)`;
  });
  const animatesInner = !!(plane.rotate || plane.sway);
  return (
    <motion.svg
      viewBox="0 0 1536 1024"
      preserveAspectRatio="xMidYMid slice"
      overflow="visible"
      className="absolute inset-0 h-full w-full will-change-transform"
      style={{ y, x, opacity }}
      aria-hidden="true"
      focusable="false"
    >
      {animatesInner ? (
        <motion.g style={{ transform: inner, transformBox: "view-box", transformOrigin: plane.origin ?? "768px 512px" }}>{plane.node}</motion.g>
      ) : (
        plane.node
      )}
    </motion.svg>
  );
}

/**
 * A scene whose planes move at different rates with scroll: far planes barely,
 * foreground planes most, with per-plane rotation, cloth sway, drifting light.
 * With a supplied photograph it falls back to one gently drifting plane
 * (a single photo is never faked into layers).
 */
export function MovingScene({ name, progress, photo, alt, travel = 140, position = "50% 50%", priority, idPrefix, className = "" }: Props) {
  const reduced = useReducedMotion();
  // Reduced motion: every plane rests at its midpoint, nothing moves with scroll.
  const rest = useMotionValue(0.5);
  const prog = reduced ? rest : progress;
  const photoY = useTransform(prog, [0, 1], [travel * 0.15, -travel * 0.15]);
  const photoScale = useTransform(prog, [0, 1], [1.1, 1.02]);
  const prefix = idPrefix ?? `m-${name}`;

  if (photo) {
    return (
      <div className={`absolute inset-0 overflow-hidden ${className}`}>
        <motion.div className="absolute inset-0" style={reduced ? undefined : { y: photoY, scale: photoScale }}>
          <Image src={`/images/${name}.webp`} alt={alt} fill priority={priority} sizes="100vw" className="object-cover" style={{ objectPosition: position }} />
        </motion.div>
      </div>
    );
  }

  const planes = SCENES[name]((s) => `${prefix}-${s}`);
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} {...(alt ? { role: "img", "aria-label": alt } : { "aria-hidden": true })}>
      {planes.map((pl) => (
        <PlaneLayer key={pl.key} plane={pl} progress={prog} travel={reduced ? 0 : travel} />
      ))}
    </div>
  );
}
