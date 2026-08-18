"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, Images, Play } from "lucide-react";
import { MediaImage } from "@/components/ui/media-image";
import { Button } from "@/components/ui/button";
import { Tilt3D } from "@/components/motion/tilt-3d";
import type { TemoinDetail } from "@/data/temoins";
import { cn } from "@/lib/utils";

type TemoinCardProps = {
  temoin: TemoinDetail;
  className?: string;
  /** Décale légèrement la 2ᵉ carte (hub) */
  offset?: boolean;
};

export function TemoinCard({ temoin, className, offset }: TemoinCardProps) {
  const photoCount = temoin.gallery.length;

  return (
    <Tilt3D maxDeg={8} glare className={cn("h-full", offset && "md:mt-8", className)}>
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-8%" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-[0_24px_50px_-32px_rgba(30,75,93,0.45)] dark:bg-allure-petrol-deep dark:shadow-[0_24px_50px_-28px_rgba(0,0,0,0.55)]"
      >
        <Link
          href={`/appartements-temoins/${temoin.slug}`}
          className="relative block aspect-[5/4] overflow-hidden sm:aspect-[4/3]"
        >
          <MediaImage
            src={temoin.heroImage}
            alt={temoin.name}
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-allure-petrol-deep/85 via-allure-petrol-deep/25 to-transparent" />

          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/20 bg-black/35 px-3 py-1.5 font-sans text-[10px] uppercase tracking-[0.14em] text-white backdrop-blur-md">
              {temoin.typologyLabel}
            </span>
            {temoin.video ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-allure-gold/40 bg-allure-gold/20 px-2.5 py-1.5 font-sans text-[10px] uppercase tracking-[0.12em] text-allure-gold backdrop-blur-md">
                <Play className="size-2.5 fill-current" aria-hidden />
                Visite 3D
              </span>
            ) : temoin.mediaFinal ? null : (
              <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1.5 font-sans text-[10px] uppercase tracking-[0.12em] text-white/75 backdrop-blur-md">
                Médias bientôt
              </span>
            )}
          </div>

          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
            <p className="font-heading text-2xl text-white sm:text-[1.65rem]">
              {temoin.typologyLabel}
            </p>
            <p className="mt-1 flex items-center gap-3 font-sans text-[11px] uppercase tracking-[0.14em] text-white/65">
              <span className="inline-flex items-center gap-1">
                <Images className="size-3" aria-hidden />
                {photoCount} vues
              </span>
              <span aria-hidden>·</span>
              <span>Show flat</span>
            </p>
          </div>
        </Link>

        <div className="flex flex-1 flex-col gap-5 p-6 sm:p-7">
          <p className="font-sans text-sm leading-relaxed text-allure-ink/65 dark:text-allure-sand/65">
            {temoin.description}
          </p>
          <div className="mt-auto flex flex-col gap-2.5 sm:flex-row">
            <Button asChild size="lg" className="btn-cta flex-1">
              <Link href={`/appartements-temoins/${temoin.slug}`}>
                Explorer
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="flex-1 rounded-full border-allure-petrol/20 dark:border-allure-sand/25"
            >
              <Link
                href={`/rendez-vous?type=showroom&interest=${temoin.interest}`}
              >
                Visiter
              </Link>
            </Button>
          </div>
        </div>
      </motion.article>
    </Tilt3D>
  );
}
