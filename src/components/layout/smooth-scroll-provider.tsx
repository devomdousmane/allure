"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerGsap } from "@/lib/gsap/register";

registerGsap();

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

/**
 * Lenis smooth scroll + ScrollTrigger sync.
 * Uses Lenis' own RAF (autoRaf) for maximum reliability.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let refreshTimeout: ReturnType<typeof setTimeout>;
    const scheduleRefresh = () => {
      clearTimeout(refreshTimeout);
      refreshTimeout = setTimeout(() => ScrollTrigger.refresh(), 150);
    };

    const trackedImages = new Set<HTMLImageElement>();
    const trackImage = (img: HTMLImageElement) => {
      if (trackedImages.has(img) || img.complete) return;
      trackedImages.add(img);
      img.addEventListener("load", scheduleRefresh, { once: true });
    };
    Array.from(document.images).forEach(trackImage);

    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node instanceof HTMLImageElement) trackImage(node);
          node
            .querySelectorAll?.("img")
            .forEach((img) => trackImage(img as HTMLImageElement));
        });
      }
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("load", scheduleRefresh);
    window.addEventListener("resize", scheduleRefresh);
    document.fonts?.ready.then(scheduleRefresh);

    const boot1 = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    const boot2 = window.setTimeout(() => ScrollTrigger.refresh(), 1200);

    if (prefersReducedMotion) {
      return () => {
        clearTimeout(refreshTimeout);
        clearTimeout(boot1);
        clearTimeout(boot2);
        mutationObserver.disconnect();
        window.removeEventListener("load", scheduleRefresh);
        window.removeEventListener("resize", scheduleRefresh);
      };
    }

    const instance = new Lenis({
      autoRaf: true,
      duration: 1.05,
      touchMultiplier: 1.2,
      syncTouch: false,
    });

    instance.on("scroll", ScrollTrigger.update);
    // Keep GSAP lag smoothing off so ST stays in sync with Lenis
    gsap.ticker.lagSmoothing(0);

    setLenis(instance);

    return () => {
      clearTimeout(refreshTimeout);
      clearTimeout(boot1);
      clearTimeout(boot2);
      mutationObserver.disconnect();
      window.removeEventListener("load", scheduleRefresh);
      window.removeEventListener("resize", scheduleRefresh);
      instance.destroy();
      setLenis(null);
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}
