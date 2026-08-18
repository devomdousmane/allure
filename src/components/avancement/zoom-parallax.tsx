"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

export type ZoomParallaxImage = {
  src: string;
  alt?: string;
};

type ZoomParallaxProps = {
  /** Jusqu’à 7 images */
  images: ZoomParallaxImage[];
  className?: string;
};

/** Positions relatives au centre (index 0 = tuile centrale). */
const SLOT_CLASS = [
  "h-[25vh] w-[25vw]",
  "-top-[30vh] left-[5vw] h-[30vh] w-[35vw]",
  "-top-[10vh] -left-[25vw] h-[45vh] w-[20vw]",
  "left-[27.5vw] h-[25vh] w-[25vw]",
  "top-[27.5vh] left-[5vw] h-[25vh] w-[20vw]",
  "top-[27.5vh] -left-[22.5vw] h-[25vh] w-[30vw]",
  "top-[22.5vh] left-[25vw] h-[15vh] w-[15vw]",
] as const;

/**
 * Zoom parallax sticky — collage d’images qui zooment au scroll.
 * Adapté Allure (motion/react + Next Image + reduced-motion).
 */
export function ZoomParallax({ images, className }: ZoomParallaxProps) {
  const container = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const slots = images.slice(0, 7);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

  const scales: MotionValue<number>[] = [
    scale4,
    scale5,
    scale6,
    scale5,
    scale6,
    scale8,
    scale9,
  ];

  if (reduced === true) {
    return (
      <div
        className={cn(
          "relative bg-allure-petrol-deep px-5 py-14 sm:px-6 sm:py-16",
          className
        )}
      >
        <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
          {slots.map((img, i) => (
            <li
              key={`${img.src}-${i}`}
              className={cn(
                "relative overflow-hidden bg-allure-sand/5",
                i === 0 ? "col-span-2 aspect-[21/9] sm:col-span-3" : "aspect-[4/3]"
              )}
            >
              <Image
                src={img.src}
                alt={img.alt ?? `Vue chantier ${i + 1}`}
                fill
                sizes="(min-width: 640px) 33vw, 50vw"
                className="object-cover"
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div
      ref={container}
      className={cn("relative h-[300vh] bg-allure-petrol-deep", className)}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {slots.map((img, index) => {
          const scale = scales[index % scales.length];

          return (
            <motion.div
              key={`${img.src}-${index}`}
              style={{ scale }}
              className="absolute top-0 flex h-full w-full items-center justify-center"
            >
              <div
                className={cn(
                  "relative overflow-hidden bg-allure-sand/5",
                  SLOT_CLASS[index] ?? SLOT_CLASS[0]
                )}
              >
                <Image
                  src={img.src}
                  alt={img.alt ?? `Vue chantier ${index + 1}`}
                  fill
                  sizes="(min-width: 768px) 40vw, 70vw"
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            </motion.div>
          );
        })}

        <div className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex justify-center">
          <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-allure-sand/50">
            Zoom — scroller
          </p>
        </div>
      </div>
    </div>
  );
}
