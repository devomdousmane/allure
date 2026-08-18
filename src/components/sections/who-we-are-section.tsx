"use client";

import { useRef } from "react";
import { MediaImage } from "@/components/ui/media-image";
import { SectionSharp } from "@/components/ui/section-sharp";
import { HomeCtaRow } from "@/components/home-scroll/home-cta-row";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import { TEMOIN_MEDIA } from "@/lib/media";

const GALLERY = [
  {
    src: TEMOIN_MEDIA.salon1,
    alt: "Salon — appartement témoin Allure",
  },
  {
    src: TEMOIN_MEDIA.chambre1,
    alt: "Chambre — appartement témoin Allure",
  },
  {
    src: TEMOIN_MEDIA.sdb1,
    alt: "Salle de bain — appartement témoin Allure",
  },
] as const;

/**
 * Étape debug 1 — reveal standard via `useSectionReveal` uniquement
 * (pas de skipDefaults / timeline custom).
 */
export function WhoWeAreSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useSectionReveal(sectionRef, {
    debugId: "whoWeAre",
    start: "top 70%",
  });

  return (
    <section
      ref={sectionRef}
      id="qui-sommes-nous"
      className="relative bg-white pb-6 pt-20 lg:pb-8 lg:pt-28 dark:bg-allure-petrol-deep"
    >
      <SectionSharp
        edge="top"
        mode="line"
        variant="fold"
        className="h-8 sm:h-9 lg:h-10"
      />
      <div className="relative z-[2] mx-auto max-w-4xl px-6 pt-4 text-center sm:pt-5">
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
          <strong className="font-semibold text-allure-petrol dark:text-allure-sand">
            pensés, durables
          </strong>{" "}
          et{" "}
          <strong className="font-semibold text-allure-petrol dark:text-allure-sand">
            inspirants
          </strong>
          . De la visite à la remise des clés, nous agissons avec{" "}
          <strong className="font-semibold text-allure-petrol dark:text-allure-sand">
            exigence
          </strong>{" "}
          et{" "}
          <strong className="font-semibold text-allure-petrol dark:text-allure-sand">
            précision
          </strong>{" "}
          pour donner vie à{" "}
          <strong className="font-semibold text-allure-petrol dark:text-allure-sand">
            votre projet aux Almadies.
          </strong>
        </p>

        <div className="mt-12 flex justify-center gap-3 sm:gap-5 lg:mt-14">
          {GALLERY.map((img, i) => (
            <div
              key={img.src}
              data-reveal="media"
              className="relative h-28 w-[30%] max-w-[200px] overflow-hidden rounded-2xl sm:h-36 lg:h-40"
              style={{ transform: i === 1 ? "translateY(8px)" : undefined }}
            >
              <MediaImage
                src={img.src}
                alt={img.alt}
                fill
                sizes="180px"
                loaderSize="sm"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div data-reveal="item" className="mt-10 lg:mt-12">
          <HomeCtaRow
            primary={{ label: "Planifier une visite", href: "/rendez-vous" }}
            secondary={{
              label: "Voir les appartements témoins",
              href: "/appartements-temoins",
            }}
          />
        </div>
      </div>

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
