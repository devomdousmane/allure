"use client";

import type { ReactNode } from "react";
import { FloatingVisitCta } from "@/components/home-scroll/floating-visit-cta";
import { ScrollProgress } from "@/components/home-scroll/scroll-progress";
import { SectionRail } from "@/components/home-scroll/section-rail";

/**
 * Home-only chrome: progress, section rail, floating CTA.
 * ScrollHint is mounted inside the hero wrapper from page.tsx
 * (absolute over hero without editing cinematic-hero).
 */
export function HomeScrollShell({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollProgress />
      <SectionRail />
      <FloatingVisitCta />
      {children}
    </>
  );
}
