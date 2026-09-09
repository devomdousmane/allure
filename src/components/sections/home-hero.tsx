"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { MediaImage } from "@/components/ui/media-image";
import { Button } from "@/components/ui/button";
import { APPS_TEMOINS_MEDIA } from "@/lib/apps-temoins-media";
import { SITE } from "@/lib/site";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Hero accueil — image témoin Almadies (sans scrub cinématique).
 * `cinematic-hero.tsx` est conservé mais non branché via HeroModeSwitch.
 */
export function HomeHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "12%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.35]);

  return (
    <section
      ref={sectionRef}
      id="accueil"
      data-home-hero
      aria-label={`${SITE.name} — introduction`}
      className="relative flex min-h-[100dvh] items-end overflow-hidden pb-16 pt-28 sm:pb-20 sm:pt-32 lg:pb-24"
    >
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <MediaImage
          src={APPS_TEMOINS_MEDIA.hero}
          alt=""
          fill
          priority
          sizes="100vw"
          quality={85}
          loaderTone="gold"
          loaderSize="md"
          className="object-cover object-center"
        />
      </motion.div>

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/20"
      />
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-[min(42%,28rem)] bg-gradient-to-r from-black/55 to-transparent"
      />

      <div className="relative z-[2] mx-auto w-full max-w-[90rem] px-5 sm:px-8 lg:px-10">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <p className="font-sans text-xs font-medium uppercase tracking-[0.32em] text-allure-gold sm:text-sm">
            {SITE.name}
          </p>
          <h1 className="mt-4 font-heading text-4xl leading-[1.05] text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            {SITE.tagline}
          </h1>
          <p className="mt-5 max-w-md font-sans text-base leading-relaxed text-white/85 sm:text-lg">
            Architecture R+11 aux Almadies — appartements de standing, prestations
            premium, livraison {SITE.delivery}.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="btn-cta">
              <Link href="/appartements-temoins">
                Voir nos appartements témoins
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-white/40 bg-black/25 text-white backdrop-blur-sm hover:bg-black/40 hover:text-white"
            >
              <Link href="/rendez-vous">Planifier une visite</Link>
            </Button>
          </div>
        </motion.div>
      </div>

      <a
        href="#qui-sommes-nous"
        className={cn(
          "absolute bottom-6 left-1/2 z-[3] flex -translate-x-1/2 flex-col items-center gap-2 text-white/70 transition-colors hover:text-allure-gold",
          "font-sans text-[10px] uppercase tracking-[0.28em]"
        )}
      >
        Découvrir
        <ArrowDown className="size-4 animate-bounce" aria-hidden />
      </a>
    </section>
  );
}
