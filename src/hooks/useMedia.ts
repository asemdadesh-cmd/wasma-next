"use client";
import { useSyncExternalStore } from "react";

/** Subscribe to a media query. Server snapshot is `fallback`. */
export function useMedia(query: string, fallback = false) {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => fallback,
  );
}

export const useIsDesktop = () => useMedia("(min-width: 1024px)", true);
export const useReduced = () => useMedia("(prefers-reduced-motion: reduce)", false);
