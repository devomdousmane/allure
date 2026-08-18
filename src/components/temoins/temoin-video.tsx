"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { MediaImage } from "@/components/ui/media-image";
import { Play } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import type { TemoinDetail } from "@/data/temoins";
import { cn } from "@/lib/utils";

type TemoinVideoProps = {
  temoin: TemoinDetail;
  className?: string;
};

/**
 * Visite 3D — poster + démarrage manuel (évite de télécharger 20–50 Mo d’emblée).
 */
export function TemoinVideo({ temoin, className }: TemoinVideoProps) {
  const video = temoin.video;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const reduced = usePrefersReducedMotion();

  if (!video) return null;

  const src720 = video.src720;
  const src1080 = video.src1080;
  const poster = video.poster;

  function start() {
    if (reduced === true) return;
    setStarted(true);
    requestAnimationFrame(() => {
      const v = videoRef.current;
      if (!v) return;
      const prefer720 =
        typeof window !== "undefined" &&
        window.matchMedia("(max-width: 900px)").matches;
      v.src = prefer720 ? src720 : src1080;
      v.load();
      v.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    });
  }

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-allure-sand py-16 dark:bg-allure-petrol sm:py-24",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] dark:opacity-[0.12]"
        aria-hidden
      >
        <div className="absolute -left-1/4 top-0 size-[50%] rounded-full bg-allure-gold blur-3xl" />
        <div className="absolute -right-1/4 bottom-0 size-[40%] rounded-full bg-allure-petrol blur-3xl dark:bg-allure-sand" />
      </div>

      <div className="relative z-[1] mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-10">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
          <div className="max-w-md">
            <p className="font-sans text-xs uppercase tracking-[0.28em] text-allure-gold">
              Visite 3D
            </p>
            <h2 className="mt-3 font-heading text-3xl text-allure-petrol dark:text-allure-sand sm:text-4xl">
              Parcourir l’appartement en immersion
            </h2>
            <p className="mt-4 font-sans text-sm leading-relaxed text-allure-ink/65 dark:text-allure-sand/65">
              Une visite virtuelle du témoin — lancez la lecture quand vous êtes
              prêt. Qualité adaptée à votre appareil.
            </p>
          </div>

          <div className="relative aspect-video overflow-hidden rounded-[1.75rem] bg-allure-petrol-deep shadow-[0_32px_64px_-36px_rgba(30,75,93,0.55)] ring-1 ring-allure-petrol/10 dark:ring-white/10">
            {!started || reduced === true ? (
              <>
                <MediaImage
                  src={poster}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-allure-petrol-deep/70 via-allure-petrol-deep/30 to-allure-petrol-deep/20" />
                {reduced !== true ? (
                  <button
                    type="button"
                    onClick={start}
                    className="absolute inset-0 z-[2] flex cursor-pointer flex-col items-center justify-center gap-4 text-white"
                  >
                    <span className="relative inline-flex size-20 items-center justify-center">
                      <motion.span
                        className="absolute inset-0 rounded-full border border-allure-gold/40"
                        animate={{ scale: [1, 1.35], opacity: [0.55, 0] }}
                        transition={{
                          duration: 2.2,
                          repeat: Infinity,
                          ease: "easeOut",
                        }}
                        aria-hidden
                      />
                      <motion.span
                        className="absolute inset-2 rounded-full border border-white/25"
                        animate={{ scale: [1, 1.2], opacity: [0.4, 0] }}
                        transition={{
                          duration: 2.2,
                          repeat: Infinity,
                          ease: "easeOut",
                          delay: 0.35,
                        }}
                        aria-hidden
                      />
                      <span className="relative inline-flex size-16 items-center justify-center rounded-full border border-white/35 bg-allure-petrol-deep/70 text-white backdrop-blur-md transition hover:border-allure-gold/70 hover:text-allure-gold">
                        <Play
                          className="size-6 translate-x-0.5 fill-current"
                          strokeWidth={1.5}
                        />
                      </span>
                    </span>
                    <span className="font-sans text-xs uppercase tracking-[0.22em]">
                      Lancer la visite 3D
                    </span>
                  </button>
                ) : (
                  <p className="absolute inset-x-0 bottom-6 z-[2] text-center font-sans text-xs text-white/70">
                    Lecture désactivée (mouvement réduit)
                  </p>
                )}
              </>
            ) : (
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover"
                controls
                playsInline
                preload="none"
                poster={poster}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
              />
            )}
          </div>
        </div>
        {started && playing === false ? (
          <p className="mt-4 font-sans text-xs text-allure-ink/45 dark:text-allure-sand/45 lg:text-right">
            Astuce : la version 720p se charge en priorité sur mobile.
          </p>
        ) : null}
      </div>
    </section>
  );
}
