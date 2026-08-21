"use client";

import type { MouseEvent } from "react";
import { useLenis } from "@/components/layout/smooth-scroll-provider";
import { cn } from "@/lib/utils";

/**
 * Skip link clavier — hors écran, visible au focus en haut à gauche → #main-content.
 */
export function SkipToContent({ className }: { className?: string }) {
  const lenis = useLenis();

  function goToMain(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    const el = document.getElementById("main-content");
    if (!el) return;

    if (lenis) {
      lenis.scrollTo(el, { offset: -8, duration: 0.9 });
    } else {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    el.focus?.({ preventScroll: true });
  }

  return (
    <a
      href="#main-content"
      onClick={goToMain}
      className={cn(
        "sr-only focus:not-sr-only",
        "focus:fixed focus:top-4 focus:left-4 focus:z-[100]",
        "focus:inline-flex focus:items-center focus:px-4 focus:py-2.5",
        "focus:font-sans focus:text-xs focus:font-medium focus:uppercase focus:tracking-[0.16em]",
        "focus:bg-allure-sand focus:text-allure-petrol",
        "focus:outline-none focus:ring-2 focus:ring-allure-gold/70 focus:ring-offset-2 focus:ring-offset-allure-sand",
        "dark:focus:bg-allure-petrol-deep dark:focus:text-allure-sand dark:focus:ring-offset-allure-petrol-deep",
        className
      )}
    >
      Aller au contenu
    </a>
  );
}
