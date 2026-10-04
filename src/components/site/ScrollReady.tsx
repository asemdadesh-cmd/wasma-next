"use client";

import { useEffect } from "react";

/**
 * Marks the document ready for the Scroll Craft verification harness
 * (.claude/skills/scroll-craft/scripts/shoot.mjs waits for html.sc-ready).
 */
export function ScrollReady() {
  useEffect(() => {
    document.documentElement.classList.add("sc-ready");
  }, []);
  return null;
}
