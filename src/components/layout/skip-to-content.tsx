"use client";

import { ChevronsDown } from "lucide-react";
import { useLenis } from "@/components/layout/smooth-scroll-provider";
import { cn } from "@/lib/utils";

/**
 * Lien d’évitement — icône fixe bas-droite vers #main-content.
 */
export function SkipToContent({ className }: { className?: string }) {
  const lenis = useLenis();

  function goToMain() {
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
    <button
      type="button"
      onClick={goToMain}
      aria-label="Aller au contenu"
      className={cn(
        "fixed z-[55] inline-flex size-11 cursor-pointer items-center justify-center rounded-full",
        "border border-allure-petrol/15 bg-allure-sand/95 text-allure-petrol shadow-lg backdrop-blur-md",
        "transition-colors duration-200 hover:border-allure-gold/50 hover:text-allure-gold",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-allure-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-allure-sand",
        "dark:border-allure-sand/20 dark:bg-allure-petrol-deep/95 dark:text-allure-sand dark:focus-visible:ring-offset-allure-petrol-deep",
        "right-4 bottom-6 sm:right-6 sm:bottom-8",
        className
      )}
      style={{
        marginBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <ChevronsDown className="size-5" strokeWidth={1.75} aria-hidden />
    </button>
  );
}
