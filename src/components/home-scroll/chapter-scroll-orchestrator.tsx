"use client";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/lib/gsap/register";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { HOME_CHAPTERS } from "@/components/home-scroll/home-chapters";

registerGsap();

/**
 * Marks each home chapter with `data-chapter-active` while in the viewport
 * and `data-chapter-entered` on first enter (CSS hooks for annex polish).
 */
export function ChapterScrollOrchestrator() {
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced !== false) return;

      const triggers: ScrollTrigger[] = [];

      HOME_CHAPTERS.forEach((chapter) => {
        const el = document.getElementById(chapter.id);
        if (!el) return;

        triggers.push(
          ScrollTrigger.create({
            trigger: el,
            start: "top 70%",
            end: "bottom 30%",
            onToggle: (self) => {
              el.toggleAttribute("data-chapter-active", self.isActive);
            },
            onEnter: () => {
              el.setAttribute("data-chapter-entered", "");
            },
          })
        );
      });

      return () => triggers.forEach((t) => t.kill());
    },
    { dependencies: [reduced] }
  );

  return null;
}
