"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

type BrochureLightProps = {
  className?: string;
};

/**
 * Dégradés de lumière cohérents autour du livre (clair / sombre).
 */
export function BrochureLight({ className }: BrochureLightProps) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      style={
        {
          "--brochure-glow-a": "color-mix(in oklab, var(--allure-gold) 22%, transparent)",
          "--brochure-glow-b": "color-mix(in oklab, var(--allure-sand) 35%, transparent)",
          "--brochure-glow-c": "color-mix(in oklab, var(--allure-petrol) 28%, transparent)",
        } as CSSProperties
      }
    >
      <div className="absolute -left-1/4 top-0 h-[55%] w-[70%] rounded-full bg-[radial-gradient(ellipse_at_center,var(--brochure-glow-a),transparent_68%)] opacity-70 dark:opacity-40" />
      <div className="absolute -right-1/5 bottom-0 h-[50%] w-[60%] rounded-full bg-[radial-gradient(ellipse_at_center,var(--brochure-glow-b),transparent_70%)] opacity-60 dark:hidden" />
      <div className="absolute -right-1/5 bottom-0 hidden h-[50%] w-[60%] rounded-full bg-[radial-gradient(ellipse_at_center,var(--brochure-glow-c),transparent_70%)] opacity-50 dark:block" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-allure-sand/80 to-transparent dark:from-allure-petrol-deep/80" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-allure-sand to-transparent dark:from-allure-petrol-deep" />
    </div>
  );
}
