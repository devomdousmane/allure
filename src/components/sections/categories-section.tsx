"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { MediaImage } from "@/components/ui/media-image";
import { SectionSeam, SEAM } from "@/components/ui/section-seam";
import { cn } from "@/lib/utils";
import { TEMOIN_MEDIA } from "@/lib/media";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import { DURATION, EASE, STAGGER } from "@/lib/gsap/presets";
import { HomeCtaRow } from "@/components/home-scroll/home-cta-row";

type Tile = {
  id: string;
  label: string;
  image: string;
  href: string;
  size: "sm" | "md" | "lg" | "xl";
};

/** Mosaïque — intérieurs appartements témoins. */
const COLUMNS: { offset: string; items: Tile[] }[] = [
  {
    offset: "lg:mt-10",
    items: [
      {
        id: "1",
        label: "Salon",
        image: TEMOIN_MEDIA.salon1,
        href: "/appartements-temoins/type-d",
        size: "md",
      },
      {
        id: "2",
        label: "Chambre",
        image: TEMOIN_MEDIA.chambre1,
        href: "/appartements-temoins/type-d",
        size: "lg",
      },
    ],
  },
  {
    offset: "lg:-mt-2",
    items: [
      {
        id: "3",
        label: "Séjour",
        image: TEMOIN_MEDIA.salon3,
        href: "/appartements-temoins/type-d",
        size: "lg",
      },
      {
        id: "4",
        label: "Cuisine",
        image: TEMOIN_MEDIA.cuisine1,
        href: "/appartements-temoins/type-d",
        size: "md",
      },
      {
        id: "5",
        label: "Salle de bain",
        image: TEMOIN_MEDIA.sdb1,
        href: "/appartements-temoins/type-d",
        size: "md",
      },
    ],
  },
  {
    offset: "lg:mt-16",
    items: [
      {
        id: "6",
        label: "Axonométrie",
        image: TEMOIN_MEDIA.axo1,
        href: "/appartements-temoins",
        size: "sm",
      },
      {
        id: "7",
        label: "Open space",
        image: TEMOIN_MEDIA.salon2,
        href: "/appartements-temoins/type-d",
        size: "xl",
      },
      {
        id: "8",
        label: "Salon Type A",
        image: TEMOIN_MEDIA.typeASalon,
        href: "/appartements-temoins/type-a",
        size: "lg",
      },
    ],
  },
  {
    offset: "lg:mt-4",
    items: [
      {
        id: "9",
        label: "Chambre parentale",
        image: TEMOIN_MEDIA.typeAChambre,
        href: "/appartements-temoins/type-a",
        size: "xl",
      },
      {
        id: "10",
        label: "Salle d’eau",
        image: TEMOIN_MEDIA.sdb2,
        href: "/appartements-temoins/type-d",
        size: "sm",
      },
      {
        id: "11",
        label: "Cuisine — détail",
        image: TEMOIN_MEDIA.cuisine2,
        href: "/appartements-temoins/type-d",
        size: "lg",
      },
    ],
  },
  {
    offset: "lg:mt-12",
    items: [
      {
        id: "12",
        label: "Chambre",
        image: TEMOIN_MEDIA.chambre3,
        href: "/appartements-temoins/type-d",
        size: "lg",
      },
      {
        id: "13",
        label: "Volumes",
        image: TEMOIN_MEDIA.salon5,
        href: "/appartements-temoins",
        size: "md",
      },
    ],
  },
];

const SIZE_CLASS: Record<Tile["size"], string> = {
  sm: "h-36 sm:h-40 lg:h-36",
  md: "h-44 sm:h-48 lg:h-52",
  lg: "h-56 sm:h-64 lg:h-72",
  xl: "h-64 sm:h-72 lg:h-80",
};

function GalleryTile({ tile }: { tile: Tile }) {
  return (
    <div data-gallery-tile>
      <Link
        href={tile.href}
        aria-label={tile.label}
        className={cn(
          "group relative block overflow-hidden rounded-[1.75rem] ring-1 ring-allure-petrol/5 transition-transform duration-500 hover:-translate-y-1 dark:ring-allure-sand/10",
          SIZE_CLASS[tile.size]
        )}
      >
        <MediaImage
          src={tile.image}
          alt={tile.label}
          fill
          sizes="(min-width: 1024px) 18vw, (min-width: 640px) 40vw, 80vw"
          loading="lazy"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-allure-petrol-deep/0 transition-colors duration-300 group-hover:bg-allure-petrol-deep/35" />
        <span className="absolute bottom-4 left-4 translate-y-2 font-sans text-sm font-medium text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          {tile.label}
        </span>
      </Link>
    </div>
  );
}

export function CategoriesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useSectionReveal(sectionRef, {
    debugId: "categories",
    onEnter: (root) => {
      const isLg = window.matchMedia("(min-width: 1024px)").matches;
      const tiles = root.querySelectorAll(
        isLg
          ? "[data-gallery-desktop] [data-gallery-tile]"
          : "[data-gallery-mobile] [data-gallery-tile]"
      );
      if (!tiles.length) return;
      gsap.fromTo(
        tiles,
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: DURATION.base,
          ease: EASE.out,
          stagger: STAGGER.items,
        }
      );
    },
  });

  const mobileItems = COLUMNS.flatMap((col) => col.items);

  return (
    <section
      ref={sectionRef}
      id="categories"
      className="relative overflow-hidden bg-white py-24 lg:py-32 dark:bg-allure-petrol-deep"
    >
      <SectionSeam from={SEAM.sand} fromDark={SEAM.petrol} />

      <div className="relative z-[2] mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-14 max-w-2xl text-center lg:mb-20">
          <span
            data-reveal="eyebrow"
            className="inline-flex items-center gap-2 rounded-full border border-allure-petrol/10 bg-allure-sand px-4 py-1.5 font-sans text-xs text-allure-petrol/70 dark:border-allure-sand/15 dark:bg-white/5 dark:text-allure-sand/70"
          >
            <span className="h-1 w-1 rounded-full bg-allure-gold" />
            Galerie
          </span>
          <h2
            data-split="lines,words"
            data-split-animate="words"
            className="mt-6 font-heading text-3xl text-allure-petrol sm:text-4xl lg:text-5xl dark:text-allure-sand"
          >
            Habiter Allure
          </h2>
          <p
            data-split="lines,words"
            data-split-animate="words"
            className="mt-4 font-sans text-base leading-relaxed text-allure-ink/75 dark:text-allure-sand/80 sm:text-lg"
          >
            Une mosaïque des appartements témoins — salons, chambres, cuisines et
            salles de bain, tels qu’ils se vivent.
          </p>
        </div>

        <div
          data-gallery-mobile
          className="grid grid-cols-2 gap-3 sm:gap-4 lg:hidden"
        >
          {mobileItems.map((tile) => (
            <GalleryTile key={tile.id} tile={tile} />
          ))}
        </div>

        <div
          data-gallery-desktop
          className="hidden gap-4 lg:flex lg:items-start lg:justify-center"
        >
          {COLUMNS.map((column) => (
            <div
              key={column.items.map((i) => i.id).join("-")}
              className={cn(
                "flex w-full max-w-[200px] flex-col gap-4 xl:max-w-[220px]",
                column.offset
              )}
            >
              {column.items.map((tile) => (
                <GalleryTile key={tile.id} tile={tile} />
              ))}
            </div>
          ))}
        </div>

        <div
          data-reveal="item"
          className="mx-auto mt-14 max-w-xl text-center lg:mt-20"
        >
          <p className="font-sans text-base leading-relaxed text-allure-ink/75 dark:text-allure-sand/80">
            Ces vues sont celles de nos appartements témoins — visitez-les en
            images, puis sur place.
          </p>
          <HomeCtaRow
            className="mt-6"
            primary={{
              label: "Voir nos appartements témoins",
              href: "/appartements-temoins",
            }}
            secondary={{
              label: "Planifier une visite",
              href: "/rendez-vous",
            }}
            tertiary={{
              label: "Voir les typologies",
              href: "/#appartements",
            }}
          />
        </div>
      </div>
    </section>
  );
}
