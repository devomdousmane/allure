"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { registerGsap } from "@/lib/gsap/register";
import { cn } from "@/lib/utils";

registerGsap();

const HOVER_SEL =
  "a, button, [role='button'], input, textarea, select, label, summary, [data-cursor='hover'], .cursor-pointer";

/**
 * Curseur Allure — point or + anneau.
 * Desktop fine pointer uniquement ; off si reduced-motion / tactile.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);
  const hoverRef = useRef(false);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => setEnabled(fine.matches && !reduced.matches);
    sync();
    fine.addEventListener("change", sync);
    reduced.addEventListener("change", sync);
    return () => {
      fine.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove("has-custom-cursor");
      return;
    }

    document.documentElement.classList.add("has-custom-cursor");

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const xDot = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
    const yDot = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
    const xRing = gsap.quickTo(ring, "x", {
      duration: 0.45,
      ease: "power3.out",
    });
    const yRing = gsap.quickTo(ring, "y", {
      duration: 0.45,
      ease: "power3.out",
    });

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

    const onMove = (e: PointerEvent) => {
      setVisible(true);
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);
    };

    const onOver = (e: PointerEvent) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const next = Boolean(t.closest(HOVER_SEL));
      if (next === hoverRef.current) return;
      hoverRef.current = next;
      setHover(next);
      gsap.to(ring, {
        scale: next ? 1.55 : 1,
        duration: 0.35,
        ease: "power2.out",
      });
    };

    const onDown = () => {
      gsap.to(ring, { scale: 0.82, duration: 0.15, ease: "power2.out" });
      gsap.to(dot, { scale: 0.7, duration: 0.15, ease: "power2.out" });
    };

    const onUp = () => {
      gsap.to(ring, {
        scale: hoverRef.current ? 1.55 : 1,
        duration: 0.35,
        ease: "power2.out",
      });
      gsap.to(dot, { scale: 1, duration: 0.35, ease: "power2.out" });
    };

    const onEnter = () => setVisible(true);
    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("mouseenter", onEnter);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 z-[200] hidden lg:block",
        visible ? "opacity-100" : "opacity-0"
      )}
    >
      <span
        ref={ringRef}
        className={cn(
          "absolute top-0 left-0 size-8 rounded-full border will-change-transform",
          hover
            ? "border-allure-petrol dark:border-allure-sand"
            : "border-allure-gold/70 dark:border-allure-gold"
        )}
      />
      <span
        ref={dotRef}
        className="absolute top-0 left-0 size-1.5 rounded-full bg-allure-gold will-change-transform shadow-[0_0_12px_color-mix(in_oklab,var(--allure-gold)_55%,transparent)]"
      />
    </div>
  );
}
