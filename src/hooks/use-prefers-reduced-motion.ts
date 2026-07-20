"use client";

import { useEffect, useState } from "react";

/**
 * null = not yet measured (SSR / first paint).
 * Avoids creating then immediately killing ScrollTriggers when
 * Windows "Animation effects" flips prefers-reduced-motion on mount.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return reduced;
}
