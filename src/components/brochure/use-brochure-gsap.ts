"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { registerGsap } from "@/lib/gsap/register";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

registerGsap();

type UseBrochureGsapArgs = {
  rootRef: React.RefObject<HTMLElement | null>;
  pageIndex: number;
};

/**
 * FX à chaque changement de page : parallaxe calques, halo, titre.
 */
export function useBrochureGsap({ rootRef, pageIndex }: UseBrochureGsapArgs) {
  const reduced = usePrefersReducedMotion();
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced === null) return;

    tlRef.current?.kill();

    if (reduced) {
      gsap.set(root.querySelectorAll("[data-brochure-layer]"), {
        clearProps: "transform",
      });
      gsap.set(root.querySelectorAll("[data-brochure-title]"), {
        opacity: 0.85,
        y: 0,
      });
      return;
    }

    const layers = root.querySelectorAll<HTMLElement>("[data-brochure-layer]");
    const titles = root.querySelectorAll<HTMLElement>("[data-brochure-title]");

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    tlRef.current = tl;

    layers.forEach((el) => {
      const parallax = Number(el.dataset.parallax ?? 0);
      const y = parallax * 10;
      const scale = 1 + parallax * 0.02;
      gsap.set(el, { y: y + 8, scale: scale * 1.01 });
      tl.to(
        el,
        { y, scale, duration: 0.85, ease: "power3.out" },
        0
      );
    });

    if (titles.length) {
      gsap.set(titles, { opacity: 0, y: 12 });
      tl.to(
        titles,
        { opacity: 0.9, y: 0, duration: 0.7, stagger: 0.05 },
        0.15
      );
    }

    // Soft zoom du stage livre
    const stage = root.querySelector<HTMLElement>("[data-brochure-stage]");
    if (stage) {
      tl.fromTo(
        stage,
        { scale: 1.012 },
        { scale: 1, duration: 0.9, ease: "power2.out" },
        0
      );
    }

    return () => {
      tl.kill();
    };
  }, [pageIndex, reduced, rootRef]);
}
