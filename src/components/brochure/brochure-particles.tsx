"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

type BrochureParticlesProps = {
  className?: string;
  /** Densité relative (défaut bas) */
  density?: number;
  active?: boolean;
};

type Particle = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  a: number;
  kind: "dust" | "pollen" | "glint";
};

/**
 * Poussière / pollen / reflets discrets — canvas léger, pause hors activité.
 */
export function BrochureParticles({
  className,
  density = 1,
  active = true,
}: BrochureParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced !== false || !active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let particles: Particle[] = [];

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(12, Math.floor((w * h) / 28000 * density));
      particles = Array.from({ length: count }, () => spawn(w, h));
    };

    const spawn = (width: number, height: number): Particle => {
      const roll = Math.random();
      const kind: Particle["kind"] =
        roll > 0.92 ? "glint" : roll > 0.65 ? "pollen" : "dust";
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        r: kind === "glint" ? 0.6 + Math.random() * 0.8 : 0.4 + Math.random() * 1.4,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -0.05 - Math.random() * 0.18,
        a: kind === "glint" ? 0.15 + Math.random() * 0.35 : 0.08 + Math.random() * 0.22,
        kind,
      };
    };

    const isDark = () =>
      document.documentElement.classList.contains("dark");

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      const dark = isDark();
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -4 || p.x < -4 || p.x > w + 4) {
          Object.assign(p, spawn(w, h), { y: h + 2 });
        }
        const color =
          p.kind === "glint"
            ? dark
              ? `rgba(212, 175, 55, ${p.a})`
              : `rgba(184, 148, 48, ${p.a})`
            : p.kind === "pollen"
              ? dark
                ? `rgba(232, 220, 190, ${p.a * 0.7})`
                : `rgba(180, 150, 90, ${p.a})`
              : dark
                ? `rgba(245, 240, 232, ${p.a * 0.55})`
                : `rgba(30, 75, 93, ${p.a * 0.45})`;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [active, density, reduced]);

  if (reduced !== false || !active) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 z-[1]", className)}
    />
  );
}
