"use client";

import { useMotionValueEvent, type MotionValue } from "framer-motion";
import type { RefObject } from "react";

/**
 * Publish the rendered value of a scroll-driven stage on data-sc-verify-state
 * so the Scroll Craft harness can detect dead scroll on custom stages. Values
 * are rounded so only visible changes register.
 */
export function useVerifyState(ref: RefObject<HTMLElement | null>, value: MotionValue<number>, digits = 2) {
  useMotionValueEvent(value, "change", (v) => {
    ref.current?.setAttribute("data-sc-verify-state", v.toFixed(digits));
  });
}
