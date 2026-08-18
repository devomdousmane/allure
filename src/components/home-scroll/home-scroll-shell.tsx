"use client";

import type { ReactNode } from "react";
import { FloatingVisitCta } from "@/components/home-scroll/floating-visit-cta";
import { ScrollProgress } from "@/components/home-scroll/scroll-progress";
import { SectionRail } from "@/components/home-scroll/section-rail";
import { isShellArmed } from "@/lib/home-motion-debug";

/**
 * Home-only chrome: progress, section rail, floating CTA.
 */
export function HomeScrollShell({ children }: { children: ReactNode }) {
  return (
    <>
      {isShellArmed("floatingCta") ? (
        <>
          <ScrollProgress />
          <SectionRail />
          <FloatingVisitCta />
        </>
      ) : null}
      {children}
    </>
  );
}
