"use client";

import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerGsap } from "@/lib/gsap/register";
import { useLenis } from "@/components/layout/smooth-scroll-provider";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

registerGsap();

/** “Défiler” hint under the hero — fades after first scroll. */
export function ScrollHint() {
  const rootRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = rootRef.current;
    if (!el || reduced !== false) return;

    const tween = gsap.to(el, {
      opacity: 0,
      y: -12,
      ease: "power2.out",
      scrollTrigger: {
        start: 80,
        end: 220,
        scrub: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [reduced]);

  function goNext() {
    const next = document.getElementById("qui-sommes-nous");
    if (!next) return;
    if (lenis) {
      lenis.scrollTo("#qui-sommes-nous", { offset: -16, duration: 1.15 });
    } else {
      next.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div
      ref={rootRef}
      className="pointer-events-none absolute inset-x-0 bottom-8 z-20 flex justify-center sm:bottom-10"
    >
      <button
        type="button"
        onClick={goNext}
        className="pointer-events-auto flex cursor-pointer flex-col items-center gap-2 text-allure-sand/80 transition-colors hover:text-allure-gold"
      >
        <span className="font-sans text-[10px] uppercase tracking-[0.35em]">
          Défiler
        </span>
        <ChevronDown className="size-4 animate-bounce" strokeWidth={1.5} />
      </button>
    </div>
  );
}
