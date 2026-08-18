"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/lib/gsap/register";
import { DURATION, EASE } from "@/lib/gsap/presets";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { SiteLogo } from "@/components/layout/site-logo";

registerGsap();

const MIN_VISIBLE_MS = 900;
const MAX_WAIT_MS = 2200;
const STORAGE_KEY = "allure-loader-shown";

/**
 * Écran de chargement plein page — logo Allure + anneaux orbitaux GSAP.
 * Entrée / spin / sortie ; respect prefers-reduced-motion.
 */
export function SiteLoader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const reducedRef = useRef<boolean | null>(null);
  const [mounted, setMounted] = useState(true);
  const reduced = usePrefersReducedMotion();
  reducedRef.current = reduced;

  useEffect(() => {
    if (window.sessionStorage.getItem(STORAGE_KEY)) {
      setMounted(false);
      return;
    }

    const start = Date.now();
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      const wait = Math.max(0, MIN_VISIBLE_MS - (Date.now() - start));
      window.setTimeout(() => {
        window.sessionStorage.setItem(STORAGE_KEY, "1");
        hide();
      }, wait);
    };

    // Attendre que reduced soit connu (évite un hide trop tôt).
    // Ne pas bloquer sur window.load : preload vidéo peut empêcher "complete".
    const ready = () => {
      if (reducedRef.current === null) {
        window.requestAnimationFrame(ready);
        return;
      }
      if (document.readyState === "complete") finish();
      else window.addEventListener("load", finish, { once: true });
    };
    ready();
    const maxWait = window.setTimeout(finish, MAX_WAIT_MS);

    return () => {
      window.clearTimeout(maxWait);
      window.removeEventListener("load", finish);
    };
  }, []);

  function hide() {
    const root = rootRef.current;
    if (!root) {
      setMounted(false);
      return;
    }

    if (reducedRef.current !== false) {
      setMounted(false);
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => setMounted(false),
    });
    tl.to(
      [logoRef.current, labelRef.current].filter(Boolean),
      {
        autoAlpha: 0,
        y: -12,
        scale: 0.92,
        duration: DURATION.fast,
        ease: EASE.soft,
        stagger: 0.04,
      },
      0
    );
    tl.to(
      [outerRef.current, midRef.current, innerRef.current].filter(Boolean),
      {
        scale: 1.35,
        autoAlpha: 0,
        duration: DURATION.base,
        ease: EASE.out,
        stagger: 0.05,
      },
      0.05
    );
    tl.to(
      root,
      {
        autoAlpha: 0,
        duration: DURATION.fast,
        ease: EASE.soft,
      },
      0.2
    );
  }

  useGSAP(
    () => {
      if (!mounted || reduced === null) return;

      const root = rootRef.current;
      const mark = markRef.current;
      const outer = outerRef.current;
      const mid = midRef.current;
      const inner = innerRef.current;
      const logo = logoRef.current;
      const label = labelRef.current;
      if (!root || !outer || !inner || !logo) return;

      if (reduced) {
        gsap.set([root, mark, outer, mid, inner, logo, label].filter(Boolean), {
          clearProps: "all",
          autoAlpha: 1,
        });
        return;
      }

      gsap.set(root, { autoAlpha: 1 });
      gsap.set([outer, mid, inner].filter(Boolean), {
        scale: 0.72,
        autoAlpha: 0,
        rotation: 0,
      });
      gsap.set(logo, { autoAlpha: 0, scale: 0.85, y: 10 });
      if (label) gsap.set(label, { autoAlpha: 0, y: 8 });

      const intro = gsap.timeline({ defaults: { ease: EASE.out } });

      intro
        .to([outer, mid, inner].filter(Boolean), {
          scale: 1,
          autoAlpha: 1,
          duration: DURATION.base,
          stagger: 0.08,
        })
        .to(
          logo,
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: DURATION.base,
          },
          "-=0.45"
        );

      if (label) {
        intro.to(
          label,
          { autoAlpha: 1, y: 0, duration: DURATION.fast },
          "-=0.35"
        );
      }

      // Orbites continues (alias GSAP : rotation, pas rotate)
      gsap.to(outer, {
        rotation: 360,
        duration: 5.2,
        ease: "none",
        repeat: -1,
      });
      if (mid) {
        gsap.to(mid, {
          rotation: -360,
          duration: 7.5,
          ease: "none",
          repeat: -1,
        });
      }
      gsap.to(inner, {
        rotation: -360,
        duration: 3.6,
        ease: "none",
        repeat: -1,
      });

      // Pulse doux du point central / logo
      gsap.to(logo, {
        scale: 1.04,
        duration: 1.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    },
    { dependencies: [mounted, reduced], scope: rootRef }
  );

  if (!mounted) return null;

  return (
    <div
      ref={rootRef}
      role="status"
      aria-live="polite"
      aria-label="Chargement de la page"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-allure-sand dark:bg-allure-petrol-deep"
    >
      <div
        ref={markRef}
        className="relative flex size-28 items-center justify-center sm:size-36"
      >
        <div
          ref={outerRef}
          className="absolute inset-0 rounded-full border border-dashed border-allure-gold/45 will-change-transform"
        />
        <div
          ref={midRef}
          className="absolute inset-[10%] rounded-full border border-allure-gold/20 will-change-transform"
        />
        <div
          ref={innerRef}
          className="absolute inset-[22%] rounded-full border border-allure-gold/35 will-change-transform"
        />
        <div ref={logoRef} className="relative z-[1] will-change-transform">
          <SiteLogo href={null} height={72} />
        </div>
      </div>
      <p
        ref={labelRef}
        className="font-sans text-[10px] uppercase tracking-[0.32em] text-allure-petrol/50 dark:text-allure-sand/45"
      >
        Allure
      </p>
    </div>
  );
}
