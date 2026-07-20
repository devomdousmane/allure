"use client";

import { useRef } from "react";
import Image from "next/image";
import { SectionSeam, SEAM } from "@/components/ui/section-seam";
import { useSectionReveal } from "@/hooks/use-section-reveal";

const GALLERY = [
  {
    src: "/Allure/HD_172.webp",
    alt: "Résidence Allure — ambiance soir",
  },
  {
    src: "/Allure/HD.webp",
    alt: "Résidence Allure — vue d’ensemble",
  },
  {
    src: "/Allure/HD_137.webp",
    alt: "Résidence Allure — architecture",
  },
] as const;

export function WhoWeAreSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="qui-sommes-nous"
      className="relative bg-white pb-6 pt-20 lg:pb-8 lg:pt-28 dark:bg-allure-petrol-deep"
    >
      {/* Hero → blanc / petrol-deep */}
      <SectionSeam from={SEAM.sand} fromDark={SEAM.petrolDeep} />

      <div className="relative z-[2] mx-auto max-w-4xl px-6 text-center">
        <span
          data-reveal="eyebrow"
          className="inline-flex items-center gap-2 rounded-full border border-allure-petrol/10 bg-allure-sand px-4 py-1.5 font-sans text-xs text-allure-petrol/70 dark:border-allure-sand/15 dark:bg-white/5 dark:text-allure-sand/70"
        >
          <span className="h-1 w-1 rounded-full bg-allure-gold" />
          Qui sommes-nous&nbsp;?
        </span>

        <p
          data-split="lines,words"
          data-split-animate="words"
          className="mt-8 font-heading text-2xl leading-[1.45] text-allure-ink/40 sm:text-3xl lg:text-[2.15rem] lg:leading-[1.4] dark:text-allure-sand/40"
        >
          Nous sommes une équipe passionnée qui crée des espaces{" "}
          <span className="font-semibold text-allure-petrol dark:text-allure-sand">
            pensés, durables
          </span>{" "}
          et{" "}
          <span className="font-semibold text-allure-petrol dark:text-allure-sand">
            inspirants
          </span>
          . De la visite à la remise des clés, nous agissons avec{" "}
          <span className="font-semibold text-allure-petrol dark:text-allure-sand">
            exigence
          </span>{" "}
          et{" "}
          <span className="font-semibold text-allure-petrol dark:text-allure-sand">
            précision
          </span>{" "}
          pour donner vie à{" "}
          <span className="font-semibold text-allure-petrol dark:text-allure-sand">
            votre projet aux Almadies.
          </span>
        </p>

        <div className="mt-12 flex justify-center gap-3 sm:gap-5 lg:mt-14">
          {GALLERY.map((img, i) => (
            <div
              key={img.src}
              data-reveal="media"
              className="relative h-28 w-[30%] max-w-[200px] overflow-hidden rounded-2xl sm:h-36 lg:h-40"
              style={{
                transform: i === 1 ? "translateY(8px)" : undefined,
              }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="180px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Transition vers Nos atouts */}
      <div
        data-reveal="item"
        className="mx-auto mt-16 flex max-w-6xl items-center gap-3 px-6 lg:mt-20"
      >
        <span className="h-1.5 w-1.5 shrink-0 rounded-[2px] bg-allure-petrol/30 dark:bg-allure-sand/30" />
        <span className="h-px flex-1 bg-allure-petrol/15 dark:bg-allure-sand/15" />
        <span className="shrink-0 px-2 font-heading text-sm text-allure-petrol dark:text-allure-sand">
          Nos atouts
        </span>
        <span className="h-px flex-1 bg-allure-petrol/15 dark:bg-allure-sand/15" />
        <span className="h-1.5 w-1.5 shrink-0 rounded-[2px] bg-allure-petrol/30 dark:bg-allure-sand/30" />
      </div>
    </section>
  );
}
