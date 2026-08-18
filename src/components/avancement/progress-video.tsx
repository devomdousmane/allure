"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { AVANCEMENT_YOUTUBE } from "@/lib/avancement";
import { cn } from "@/lib/utils";

type ProgressVideoProps = {
  className?: string;
};

export function ProgressVideo({ className }: ProgressVideoProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <div
      className={cn(
        "relative aspect-video w-full overflow-hidden bg-allure-petrol-deep",
        className
      )}
    >
      {playing ? (
        <iframe
          title="Avancement du chantier — Résidence Allure"
          src={`https://www.youtube-nocookie.com/embed/${AVANCEMENT_YOUTUBE.id}?autoplay=1&rel=0`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-allure-gold"
          aria-label="Lire la vidéo du chantier"
        >
          <Image
            src={AVANCEMENT_YOUTUBE.poster}
            alt=""
            fill
            sizes="(min-width: 1024px) 64vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />
          <span className="absolute inset-0 bg-allure-petrol-deep/35" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="inline-flex size-16 items-center justify-center rounded-full bg-white/95 text-allure-petrol shadow-sm transition-transform duration-300 group-hover:scale-105 sm:size-20">
              <Play className="size-6 fill-current sm:size-7" aria-hidden />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
