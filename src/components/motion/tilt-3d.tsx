"use client";

import {
  useCallback,
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { TILT_3D } from "@/lib/gsap/presets";
import { cn } from "@/lib/utils";

type Tilt3DProps = {
  children: ReactNode;
  className?: string;
  /** Amplitude max en degrés */
  maxDeg?: number;
  /** Reflet lumineux qui suit le pointeur */
  glare?: boolean;
};

/**
 * Carte / dossier en perspective 3D au pointeur.
 * Désactivé si prefers-reduced-motion ou pointeur grossier (touch).
 */
export function Tilt3D({
  children,
  className,
  maxDeg = TILT_3D.maxDeg,
  glare = false,
}: Tilt3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const rotateX = useSpring(useMotionValue(0), TILT_3D.spring);
  const rotateY = useSpring(useMotionValue(0), TILT_3D.spring);
  const scale = useSpring(1, TILT_3D.spring);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareOpacity = useSpring(0, { stiffness: 200, damping: 28 });

  const transform = useMotionTemplate`perspective(${TILT_3D.perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
  const glareBg = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.08) 32%, transparent 62%)`;

  const reset = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
    glareOpacity.set(0);
  }, [glareOpacity, rotateX, rotateY, scale]);

  const onMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (reduced === true) return;
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(pointer: coarse)").matches) return;

      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      rotateY.set((px - 0.5) * maxDeg * 2);
      rotateX.set((0.5 - py) * maxDeg * 2);
      scale.set(TILT_3D.scale);
      glareX.set(px * 100);
      glareY.set(py * 100);
      if (glare) glareOpacity.set(1);
    },
    [glare, glareOpacity, glareX, glareY, maxDeg, reduced, rotateX, rotateY, scale]
  );

  if (reduced === true) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={cn("relative will-change-transform", className)}
      style={{ transform, transformStyle: "preserve-3d" }}
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      {children}
      {glare ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 mix-blend-soft-light"
          style={{
            background: glareBg,
            opacity: glareOpacity,
            transform: "translateZ(28px)",
            borderRadius: "inherit",
          }}
        />
      ) : null}
    </motion.div>
  );
}
