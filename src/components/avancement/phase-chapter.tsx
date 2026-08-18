"use client";

import { useRef } from "react";
import Image from "next/image";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import {
  AVANCEMENT_STATUS_LABEL,
  type AvancementPhase,
} from "@/lib/avancement";
import { PhaseGallery } from "@/components/avancement/phase-gallery";
import { cn } from "@/lib/utils";

type PhaseChapterProps = {
  phase: AvancementPhase;
  reverse?: boolean;
  priorityCover?: boolean;
  priorityGallery?: boolean;
};

export function PhaseChapter({
  phase,
  reverse = false,
  priorityCover = false,
  priorityGallery = false,
}: PhaseChapterProps) {
  const ref = useRef<HTMLElement>(null);
  useSectionReveal(ref);

  return (
    <section
      ref={ref}
      id={phase.id}
      aria-labelledby={`${phase.id}-title`}
      className="scroll-mt-36 border-b border-allure-petrol/8 py-16 last:border-b-0 dark:border-allure-sand/8 sm:py-20 lg:py-24"
    >
      <div
        className={cn(
          "grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16",
          reverse && "lg:[&>*:first-child]:order-2"
        )}
      >
        <div>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <span
              data-reveal="eyebrow"
              className="font-heading text-4xl text-allure-petrol/20 tabular-nums dark:text-allure-sand/20 sm:text-5xl"
            >
              {phase.index}
            </span>
            <span
              data-reveal="eyebrow"
              className="font-sans text-[11px] uppercase tracking-[0.28em] text-allure-gold"
            >
              {AVANCEMENT_STATUS_LABEL[phase.status]}
            </span>
          </div>
          <h2
            id={`${phase.id}-title`}
            data-split="lines,words"
            data-split-animate="words"
            className="mt-4 font-heading text-2xl text-allure-petrol dark:text-allure-sand sm:text-3xl"
          >
            {phase.title}
          </h2>
          <p
            data-reveal="text"
            className="mt-3 max-w-md font-sans text-sm leading-relaxed text-allure-ink/60 dark:text-allure-sand/60"
          >
            {phase.subtitle}
          </p>
        </div>

        <div data-reveal-media className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={phase.cover}
            alt={phase.title}
            fill
            priority={priorityCover}
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="mt-10">
        <PhaseGallery
          images={phase.images}
          priorityFirst={priorityGallery}
        />
      </div>
    </section>
  );
}
