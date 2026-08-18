import { MediaImage } from "@/components/ui/media-image";
import type { ReactNode } from "react";
import { PageHeroMedia } from "@/components/layout/page-hero-media";
import { HeroExitFade } from "@/components/ui/section-seam";
import { SectionSharp, SHARP } from "@/components/ui/section-sharp";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
  image?: string;
  /** Si fourni, remplace l’image par une vidéo de fond */
  videoSrc?: string;
  className?: string;
  actions?: ReactNode;
  /** Couleur de la section suivante (fill du sharp bas) — clair */
  sharpTo?: string;
  /** Couleur de la section suivante — sombre */
  sharpToDark?: string;
  sharpVariant?: "chevron" | "angle" | "fold";
  /** @deprecated utiliser sharpTo */
  seamTo?: string;
  /** @deprecated utiliser sharpToDark */
  seamToDark?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  image = "/media/hero-cinematic/opening.webp",
  videoSrc,
  className,
  actions,
  sharpTo,
  sharpToDark,
  sharpVariant = "fold",
  seamTo,
  seamToDark,
}: PageHeroProps) {
  const fill = sharpTo ?? seamTo ?? SHARP.white;
  const fillDark = sharpToDark ?? seamToDark ?? SHARP.petrolDeep;

  return (
    <section
      className={cn(
        "relative flex min-h-[88dvh] items-end overflow-hidden pb-20 pt-32 lg:min-h-[92dvh] lg:pb-24",
        videoSrc && "min-h-[92dvh] lg:min-h-[100dvh]",
        className
      )}
    >
      {videoSrc ? (
        <PageHeroMedia videoSrc={videoSrc} poster={image} />
      ) : (
        <MediaImage
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          loaderTone="gold"
          loaderSize="md"
          className="object-cover object-center"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-allure-petrol-deep via-allure-petrol-deep/55 to-allure-petrol/20" />
        </MediaImage>
      )}
      {videoSrc ? (
        <>
          {/* Lisibilité du texte — bas sombre, haut plus ouvert */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-allure-petrol-deep/95 via-allure-petrol-deep/50 to-allure-petrol/15 dark:from-allure-petrol-deep dark:via-allure-petrol-deep/55 dark:to-allure-petrol/20"
          />
          {/* Clair : amorce blanche très basse pour croiser le HeroExitFade sans voile */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-16 bg-gradient-to-t from-white/50 to-transparent dark:hidden sm:h-20"
          />
        </>
      ) : null}
      <HeroExitFade
        to={fill}
        toDark={fillDark}
        className={
          videoSrc
            ? "h-16 min-h-0 sm:h-24 sm:min-h-0"
            : undefined
        }
      />
      <SectionSharp
        edge="bottom"
        fill={fill}
        fillDark={fillDark}
        variant={sharpVariant}
      />
      <div className="relative z-[2] mx-auto w-full max-w-6xl px-6">
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-allure-gold">
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl font-heading text-4xl leading-[1.1] text-white sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-5 max-w-xl font-sans text-sm text-white/75 sm:text-base">
            {description}
          </p>
        ) : null}
        {actions ? (
          <div className="mt-8 flex flex-wrap gap-3">{actions}</div>
        ) : null}
      </div>
    </section>
  );
}
