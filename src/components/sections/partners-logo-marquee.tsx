"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { PARTNERS, type Partner } from "@/lib/partners";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

function LogoCell({ partner }: { partner: Partner }) {
  return (
    <figure className="group flex w-[9.5rem] shrink-0 flex-col items-center justify-center sm:w-[11rem]">
      <div className="relative flex h-14 w-full items-center justify-center sm:h-16">
        <Image
          src={partner.logo}
          alt=""
          width={120}
          height={120}
          sizes="120px"
          className="h-12 w-auto max-w-[7.5rem] object-contain opacity-55 grayscale transition duration-300 ease-out group-hover:scale-[1.04] group-hover:opacity-100 group-hover:grayscale-0 group-focus-within:opacity-100 group-focus-within:grayscale-0 sm:h-14 dark:opacity-70 dark:brightness-110 dark:group-hover:brightness-100"
        />
      </div>
      <figcaption className="mt-3 text-center">
        <p className="font-sans text-[0.65rem] uppercase tracking-[0.16em] text-allure-ink/40 transition-colors duration-200 group-hover:text-allure-gold dark:text-allure-sand/40">
          {partner.role}
        </p>
        <p className="mt-0.5 font-heading text-sm text-allure-petrol dark:text-allure-sand">
          {partner.name}
        </p>
      </figcaption>
    </figure>
  );
}

/**
 * Bande logos partenaires — CSS transform GPU, pause hover/focus/hors écran.
 * Reduced-motion → grille statique.
 */
export function PartnersLogoMarquee() {
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced !== false) return;

    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.12 }
    );
    io.observe(root);
    return () => io.disconnect();
  }, [reduced]);

  if (reduced === true) {
    return (
      <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:mt-14 sm:grid-cols-4 sm:gap-x-8">
        {PARTNERS.map((partner) => (
          <li key={partner.id} className="flex justify-center">
            <LogoCell partner={partner} />
          </li>
        ))}
      </ul>
    );
  }

  // 2 copies pour boucle seamless (translate -50%)
  const loop = [...PARTNERS, ...PARTNERS];
  const running = inView && !paused;

  return (
    <div
      ref={rootRef}
      className="relative mt-12 sm:mt-14"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div
        className="overflow-hidden py-2"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div
          className={cn(
            "partners-marquee-track flex w-max gap-10 sm:gap-14",
            running && "partners-marquee-track--run"
          )}
          aria-hidden
        >
          {loop.map((partner, i) => (
            <LogoCell key={`${partner.id}-${i}`} partner={partner} />
          ))}
        </div>
      </div>

      {/* Liste accessible hors flux animé */}
      <ul className="sr-only">
        {PARTNERS.map((p) => (
          <li key={p.id}>
            {p.name} — {p.role}
          </li>
        ))}
      </ul>

      <p className="mt-4 text-center font-sans text-[10px] uppercase tracking-[0.22em] text-allure-ink/35 dark:text-allure-sand/35">
        Survolez pour mettre en pause
      </p>
    </div>
  );
}
