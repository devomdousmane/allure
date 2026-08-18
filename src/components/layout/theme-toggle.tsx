"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { registerGsap } from "@/lib/gsap/register";
import { EASE } from "@/lib/gsap/presets";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

registerGsap();

function supportsViewTransition() {
  return (
    typeof document !== "undefined" &&
    "startViewTransition" in document &&
    typeof (
      document as Document & {
        startViewTransition?: (cb: () => void) => unknown;
      }
    ).startViewTransition === "function"
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const sunRef = useRef<SVGSVGElement>(null);
  const moonRef = useRef<SVGSVGElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  useEffect(() => {
    if (!mounted || reduced === null) return;
    const sun = sunRef.current;
    const moon = moonRef.current;
    if (!sun || !moon) return;

    if (reduced === true) {
      gsap.set(sun, {
        autoAlpha: isDark ? 0 : 1,
        scale: isDark ? 0 : 1,
        rotate: 0,
      });
      gsap.set(moon, {
        autoAlpha: isDark ? 1 : 0,
        scale: isDark ? 1 : 0,
        rotate: 0,
      });
      return;
    }

    if (isDark) {
      gsap.to(sun, {
        autoAlpha: 0,
        scale: 0.4,
        rotate: -90,
        duration: 0.35,
        ease: EASE.soft,
      });
      gsap.fromTo(
        moon,
        { autoAlpha: 0, scale: 0.4, rotate: 90 },
        {
          autoAlpha: 1,
          scale: 1,
          rotate: 0,
          duration: 0.45,
          ease: EASE.out,
        }
      );
    } else {
      gsap.to(moon, {
        autoAlpha: 0,
        scale: 0.4,
        rotate: 90,
        duration: 0.35,
        ease: EASE.soft,
      });
      gsap.fromTo(
        sun,
        { autoAlpha: 0, scale: 0.4, rotate: -90 },
        {
          autoAlpha: 1,
          scale: 1,
          rotate: 0,
          duration: 0.45,
          ease: EASE.out,
        }
      );
    }
  }, [isDark, mounted, reduced]);

  function applyTheme(next: "light" | "dark") {
    flushSync(() => {
      setTheme(next);
    });
  }

  function onToggle(e: MouseEvent<HTMLButtonElement>) {
    const next = isDark ? "light" : "dark";
    const soft = reduced === true;

    if (soft || !supportsViewTransition()) {
      applyTheme(next);
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    const root = document.documentElement;
    root.style.setProperty("--theme-vt-x", `${x}px`);
    root.style.setProperty("--theme-vt-y", `${y}px`);

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );
    root.style.setProperty("--theme-vt-r", `${Math.ceil(endRadius)}px`);

    (
      document as Document & {
        startViewTransition: (cb: () => void) => void;
      }
    ).startViewTransition(() => {
      applyTheme(next);
    });
  }

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={onToggle}
      aria-label={isDark ? "Passer au thème clair" : "Passer au thème sombre"}
      className={cn(
        "relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-allure-petrol transition-colors duration-300 hover:bg-allure-petrol/10 dark:text-allure-sand dark:hover:bg-allure-sand/10",
        className
      )}
    >
      {mounted ? (
        <>
          <Sun
            ref={sunRef}
            className="absolute h-[18px] w-[18px]"
            strokeWidth={1.75}
            aria-hidden
          />
          <Moon
            ref={moonRef}
            className="absolute h-[18px] w-[18px] opacity-0"
            strokeWidth={1.75}
            aria-hidden
          />
        </>
      ) : (
        <span className="size-[18px]" aria-hidden />
      )}
    </button>
  );
}
