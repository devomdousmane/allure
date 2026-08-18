"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

type ScrollParallaxProps = {
  children: ReactNode;
  className?: string;
  /** Déplacement Y total en px (divisé /2 de chaque côté) */
  distance?: number;
  fade?: boolean;
};

/**
 * Parallax scrub léger (Motion). Compatible Lenis (scroll document).
 * Amplitude volontairement modérée pour mobile / ergonomie.
 */
export function ScrollParallax({
  children,
  className,
  distance = 56,
  fade = false,
}: ScrollParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Amplitude douce : ~60 % pour limiter le motion sickness (skill UX)
  const amp = distance * 0.6;
  const y = useTransform(scrollYProgress, [0, 1], [-amp, amp]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    fade ? [0.7, 1, 1, 0.7] : [1, 1, 1, 1]
  );

  if (reduced === true) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div style={{ y, opacity }} className="h-full will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}
