"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/lib/gsap/register";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

registerGsap();

type PinnedStoryProps = {
  children: ReactNode;
  className?: string;
  /** Extra scroll distance while pinned (desktop only). Keep short to avoid Lenis jumps. */
  pinEnd?: string;
  /** When false, only runs onTimeline without pin (safer with Lenis). */
  pin?: boolean;
  onTimeline?: (tl: gsap.core.Timeline, root: HTMLElement) => void;
};

/**
 * Optional pin + scrub. Default pin is off — annexes animate on scroll
 * without locking layout (avoids Lenis / ScrollTrigger offset jumps).
 */
export function PinnedStory({
  children,
  className,
  pinEnd = "+=40%",
  pin = false,
  onTimeline,
}: PinnedStoryProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || reduced) return;

      const isLg = window.matchMedia("(min-width: 1024px)").matches;
      if (!isLg || !pin) {
        onTimeline?.(gsap.timeline(), root);
        return;
      }

      const pinTarget =
        root.querySelector<HTMLElement>("[data-pin-target]") ?? root;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: pinEnd,
          pin: pinTarget,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      onTimeline?.(tl, root);
    },
    { scope: rootRef, dependencies: [reduced, pinEnd, pin] }
  );

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      {children}
    </div>
  );
}
