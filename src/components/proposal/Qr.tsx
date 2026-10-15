"use client";

import QRCode from "qrcode";
import { useMemo, useSyncExternalStore } from "react";
import { SITE } from "@/lib/site";

const noop = () => () => {};

/** The page's own origin, so the code works on previews too. */
export const useOrigin = () => useSyncExternalStore(noop, () => window.location.origin, () => SITE.url);

/** A real, scannable QR code drawn as one SVG path. */
export function Qr({ path, label, className = "" }: { path: string; label: string; className?: string }) {
  const origin = useOrigin();
  const url = `${origin}${path}`;
  const d = useMemo(() => {
    const { modules } = QRCode.create(url, { errorCorrectionLevel: "M" });
    const n = modules.size;
    let out = "";
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (modules.get(x, y)) out += `M${x} ${y}h1v1h-1z`;
    return { d: out, n };
  }, [url]);
  return (
    <svg viewBox={`-2 -2 ${d.n + 4} ${d.n + 4}`} role="img" aria-label={label} className={className} shapeRendering="crispEdges">
      <rect x="-2" y="-2" width={d.n + 4} height={d.n + 4} fill="#F4F1E8" />
      <path d={d.d} fill="#0B0D0C" />
    </svg>
  );
}
