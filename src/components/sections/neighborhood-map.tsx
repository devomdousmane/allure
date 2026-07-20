"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plane, School, ShoppingBag, Waves, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Point = {
  icon: LucideIcon;
  label: string;
  distance: string;
  // Position en pourcentage dans le cadre de la carte (0-100)
  x: number;
  y: number;
};

const POINTS: Point[] = [
  { icon: Waves, label: "Plage des Almadies", distance: "300 m", x: 50, y: 8 },
  { icon: School, label: "Écoles internationales", distance: "5 min", x: 10, y: 55 },
  { icon: ShoppingBag, label: "Commerces & restaurants", distance: "3 min", x: 90, y: 55 },
  { icon: Plane, label: "Aéroport AIBD à proximité", distance: "35 min", x: 50, y: 95 },
];

export function NeighborhoodMap() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-md sm:max-w-lg">
      {/* Fond de carte — grille radiale discrète façon plan stylisé */}
      <div
        className="absolute inset-0 rounded-full border border-allure-petrol/10 dark:border-white/10"
        style={{
          backgroundImage:
            "radial-gradient(circle, transparent 0%, transparent 55%, color-mix(in oklch, var(--allure-petrol) 6%, transparent) 56%, transparent 57%, transparent 78%, color-mix(in oklch, var(--allure-petrol) 6%, transparent) 79%, transparent 80%)",
        }}
      />
      <div className="absolute inset-6 rounded-full border border-dashed border-allure-petrol/15 dark:border-white/15" />

      {/* Lignes de connexion — du centre vers chaque point */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {POINTS.map((point, i) => (
          <motion.line
            key={point.label}
            x1={50}
            y1={50}
            x2={point.x}
            y2={point.y}
            stroke="var(--allure-gold)"
            strokeWidth={active === i ? 0.6 : 0.3}
            strokeDasharray="2 2"
            initial={{ opacity: 0, pathLength: 0 }}
            whileInView={{ opacity: active === i ? 0.9 : 0.35, pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
          />
        ))}
      </svg>

      {/* Résidence — point central */}
      <div
        className="absolute flex flex-col items-center gap-1.5"
        style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-allure-petrol shadow-lg ring-4 ring-allure-sand dark:bg-allure-gold dark:ring-allure-petrol-deep sm:h-20 sm:w-20">
          <span className="font-heading text-[10px] uppercase tracking-[0.15em] text-white dark:text-allure-petrol-deep sm:text-xs">
            Allure
          </span>
        </div>
      </div>

      {/* Pins des points d'intérêt */}
      {POINTS.map((point, i) => {
        const Icon = point.icon;
        const isActive = active === i;
        return (
          <button
            key={point.label}
            type="button"
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive((cur) => (cur === i ? null : cur))}
            onClick={() => setActive((cur) => (cur === i ? null : i))}
            aria-label={`${point.label}, ${point.distance}`}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              animate={{ scale: isActive ? 1.15 : 1 }}
              className={cn(
                "relative flex h-11 w-11 items-center justify-center rounded-full border-2 shadow-md transition-colors sm:h-12 sm:w-12",
                isActive
                  ? "border-allure-gold bg-allure-gold text-allure-petrol-deep"
                  : "border-allure-petrol/15 bg-white text-allure-petrol dark:border-white/15 dark:bg-allure-petrol dark:text-allure-sand"
              )}
            >
              {isActive && (
                <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-allure-gold/40" />
              )}
              <Icon className="h-4.5 w-4.5 sm:h-5 sm:w-5" strokeWidth={1.75} />
            </motion.span>

            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "absolute left-1/2 z-20 w-40 -translate-x-1/2 rounded-xl border border-allure-petrol/10 bg-white p-3 text-center shadow-xl dark:border-white/10 dark:bg-allure-petrol-deep",
                    point.y > 60 ? "bottom-full mb-3" : "top-full mt-3"
                  )}
                >
                  <p className="font-heading text-base text-allure-petrol dark:text-allure-gold">
                    {point.distance}
                  </p>
                  <p className="mt-0.5 font-sans text-[11px] leading-tight text-allure-ink/60 dark:text-white/60">
                    {point.label}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        );
      })}
    </div>
  );
}
