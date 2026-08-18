"use client";

import { useEffect, useRef, useState } from "react";
import { MediaImage } from "@/components/ui/media-image";
import { MediaLoader } from "@/components/ui/media-loader";
import { Pause, Play } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

type PageHeroMediaProps = {
  /** Vidéo de fond (mp4) */
  videoSrc: string;
  /** Poster / fallback image */
  poster: string;
  className?: string;
};

/**
 * Fond vidéo plein cadre pour PageHero — autoplay muet, pause manuelle,
 * poster seul si prefers-reduced-motion.
 */
export function PageHeroMedia({
  videoSrc,
  poster,
  className,
}: PageHeroMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduced === true) return;

    video
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, [reduced, videoSrc]);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setPlaying(true)).catch(() => undefined);
    } else {
      video.pause();
      setPlaying(false);
    }
  }

  return (
    <div className={cn("absolute inset-0", className)}>
      <MediaImage
        src={poster}
        alt=""
        fill
        priority
        sizes="100vw"
        loaderTone="gold"
        loaderSize="md"
        className="object-cover"
      />

      {reduced !== true ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover object-center"
          src={videoSrc}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          poster={poster}
          aria-label="Vidéo du chantier Résidence Allure"
          onCanPlay={() => setVideoReady(true)}
        />
      ) : null}

      {reduced !== true && !videoReady ? (
        <MediaLoader tone="gold" label="Chargement" />
      ) : null}

      {reduced !== true ? (
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? "Mettre en pause" : "Lire la vidéo"}
          className="absolute right-4 bottom-16 z-[3] inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-allure-petrol-deep/50 text-white backdrop-blur-sm transition-colors duration-200 hover:border-allure-gold/50 hover:text-allure-gold sm:right-6 sm:bottom-20"
        >
          {playing ? (
            <Pause className="size-3.5" strokeWidth={1.75} aria-hidden />
          ) : (
            <Play className="size-3.5" strokeWidth={1.75} aria-hidden />
          )}
        </button>
      ) : null}
    </div>
  );
}
