"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
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
 * Pages avec Lenis smooth scroll (immersives).
 * Les autres pages gardent le scroll natif + ScrollTrigger.
 */
const SMOOTH_SCROLL_PATHS = ["/", "/residence"] as const;

function isSmoothScrollPath(pathname: string | null) {
  if (!pathname) return false;
  return SMOOTH_SCROLL_PATHS.some(
    (path) => pathname === path || (path !== "/" && pathname.startsWith(`${path}/`))
  );
}

/**
 * Lenis smooth scroll + ScrollTrigger sync — activé sur Accueil & Résidence.
 * Uses Lenis' own RAF (autoRaf) for maximum reliability.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const smoothEnabled = isSmoothScrollPath(pathname);

  useEffect(() => {
    document.documentElement.classList.add("hide-native-scrollbar");

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let refreshTimeout: ReturnType<typeof setTimeout>;
    const scheduleRefresh = () => {
      clearTimeout(refreshTimeout);
      refreshTimeout = setTimeout(() => ScrollTrigger.refresh(), 150);
    };

    // ResizeObserver on <body> looked right but silently misses the exact
    // failure this fixes: <body> here has min-h-full (see layout.tsx), so
    // once its content already exceeds one viewport height, its observed
    // content box stops changing even as document height keeps growing
    // underneath (ResizeObserver reports the box's own size, not
    // scrollHeight) — a late-loading image further down the page grew the
    // document by ~2200px with zero resize notifications, leaving every
    // ScrollTrigger's cached `start` offset computed from the stale
    // pre-growth layout and firing reveals ~2000px early. Polling
    // scrollHeight directly is the only reliable signal for this case.
    let lastHeight = document.documentElement.scrollHeight;
    const heightPoll = window.setInterval(() => {
      const h = document.documentElement.scrollHeight;
      if (h !== lastHeight) {
        lastHeight = h;
        scheduleRefresh();
      }
    }, 400);

    window.addEventListener("load", scheduleRefresh);
    window.addEventListener("resize", scheduleRefresh);
    document.fonts?.ready.then(scheduleRefresh);

    const boot1 = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    const boot2 = window.setTimeout(() => ScrollTrigger.refresh(), 1200);

    const cleanupShared = () => {
      document.documentElement.classList.remove("hide-native-scrollbar");
      clearTimeout(refreshTimeout);
      clearTimeout(boot1);
      clearTimeout(boot2);
      clearInterval(heightPoll);
      window.removeEventListener("load", scheduleRefresh);
      window.removeEventListener("resize", scheduleRefresh);
    };

    if (prefersReducedMotion || !smoothEnabled) {
      document.documentElement.classList.remove("lenis", "lenis-smooth");
      return cleanupShared;
    }

    const instance = new Lenis({
      autoRaf: true,
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.15,
      syncTouch: false,
      smoothWheel: true,
    });

    instance.on("scroll", ScrollTrigger.update);
    // Keep GSAP lag smoothing off so ST stays in sync with Lenis
    gsap.ticker.lagSmoothing(0);

    setLenis(instance);
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cleanupShared();
      instance.destroy();
      setLenis(null);
      document.documentElement.classList.remove("lenis", "lenis-smooth");
      ScrollTrigger.refresh();
    };
  }, [pathname, smoothEnabled]);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}
