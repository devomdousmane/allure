"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/lib/gsap/register";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

registerGsap();

type MediaLoaderProps = {
  /** Étiquette optionnelle sous les anneaux (ex: "Chargement de la vidéo…") */
  label?: string;
  className?: string;
  /** Anneaux sombres pour usage sur fond clair — dorés par défaut (fond sombre/média) */
  tone?: "gold" | "petrol";
  /** `sm` pour vignettes / cards, `md` pour fonds pleine largeur */
  size?: "sm" | "md";
};

/**
 * Indicateur de chargement compact pour médias —
 * anneaux orbitaux GSAP (rotation), version réduite du SiteLoader.
 */
export function MediaLoader({
  label,
  className,
  tone = "gold",
  size = "md",
}: MediaLoaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced === null) return;

      const outer = outerRef.current;
      const inner = innerRef.current;
      const dot = dotRef.current;
      if (!outer || !inner) return;

      if (reduced) {
        gsap.set([outer, inner, dot].filter(Boolean), { clearProps: "all" });
        return;
      }

      gsap.fromTo(
        [outer, inner],
        { scale: 0.85, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          duration: 0.45,
          stagger: 0.08,
          ease: "power2.out",
        }
      );

      gsap.to(outer, {
        rotation: 360,
        duration: 3.2,
        ease: "none",
        repeat: -1,
      });
      gsap.to(inner, {
        rotation: -360,
        duration: 2.3,
        ease: "none",
        repeat: -1,
      });

      if (dot) {
        gsap.to(dot, {
          scale: 1.35,
          opacity: 0.55,
          duration: 0.85,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }
    },
    { dependencies: [reduced] }
  );

  const ringColor =
    tone === "gold" ? "border-allure-gold" : "border-allure-petrol";
  const veil =
    tone === "gold"
      ? "bg-allure-petrol-deep/25"
      : "bg-allure-sand/70 dark:bg-allure-petrol-deep/40";
  const labelColor =
    tone === "gold"
      ? "text-allure-sand/80"
      : "text-allure-petrol/70 dark:text-allure-sand/70";

  const ringBox =
    size === "sm"
      ? "size-8 sm:size-9"
      : "size-14 items-center justify-center sm:size-16";
  const dotSize = size === "sm" ? "size-1" : "size-1.5";
  const gap = size === "sm" ? "gap-1.5" : "gap-3";

  return (
    <div
      ref={rootRef}
      role="status"
      aria-live="polite"
      aria-label={label ?? "Chargement du média"}
      className={cn(
        "pointer-events-none absolute inset-0 z-[5] flex flex-col items-center justify-center backdrop-blur-[2px]",
        gap,
        veil,
        className
      )}
    >
      <div className={cn("relative flex items-center justify-center", ringBox)}>
        <div
          ref={outerRef}
          className={cn(
            "absolute inset-0 rounded-full border border-dashed opacity-60 will-change-transform",
            ringColor
          )}
        />
        <div
          ref={innerRef}
          className={cn(
            "absolute inset-[18%] rounded-full border opacity-40 will-change-transform",
            ringColor
          )}
        />
        <span
          ref={dotRef}
          className={cn(
            "relative rounded-full will-change-transform",
            dotSize,
            tone === "gold" ? "bg-allure-gold" : "bg-allure-petrol"
          )}
        />
      </div>
      {label ? (
        <p
          className={cn(
            "font-sans uppercase tracking-[0.28em]",
            size === "sm" ? "text-[8px]" : "text-[10px]",
            labelColor
          )}
        >
          {label}
        </p>
      ) : null}
    </div>
  );
}
