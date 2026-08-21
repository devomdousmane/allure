"use client";

import { useRef } from "react";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import type { AvancementEvent } from "@/lib/avancement";
import { PhaseGallery } from "@/components/avancement/phase-gallery";
import { cn } from "@/lib/utils";

type EventBandProps = {
  event: AvancementEvent;
  tone?: "sand" | "white";
};

export function EventBand({ event, tone = "sand" }: EventBandProps) {
  const ref = useRef<HTMLElement>(null);
  useSectionReveal(ref);

  return (
    <section
      ref={ref}
      id={event.id}
      aria-labelledby={`${event.id}-title`}
      className={cn(
        "py-16 sm:py-20 lg:py-24",
        tone === "sand"
          ? "bg-allure-sand dark:bg-allure-petrol"
          : "bg-white dark:bg-allure-petrol-deep"
      )}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p
            data-reveal="eyebrow"
            className="font-sans text-xs uppercase tracking-[0.3em] text-allure-gold"
          >
            {event.eyebrow}
          </p>
          <h2
            id={`${event.id}-title`}
            data-split="lines,words"
            data-split-animate="words"
            className="mt-4 font-heading text-2xl text-allure-petrol dark:text-allure-sand sm:text-3xl"
          >
            {event.title}
          </h2>
          <p
            data-reveal="text"
            className="mt-4 font-sans text-sm leading-relaxed text-allure-ink/65 dark:text-allure-sand/65"
          >
            {event.body}
          </p>
        </div>

        <div className="mt-12">
          <PhaseGallery images={event.images} fit="faces" />
        </div>
      </div>
    </section>
  );
}
