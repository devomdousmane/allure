"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { MediaImage } from "@/components/ui/media-image";
import { Button } from "@/components/ui/button";
import type { TemoinDetail } from "@/data/temoins";

type TemoinCtaProps = {
  temoin: TemoinDetail;
};

export function TemoinCta({ temoin }: TemoinCtaProps) {
  return (
    <section className="relative overflow-hidden bg-allure-petrol-deep py-20 text-allure-sand sm:py-28">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <MediaImage
          src={temoin.heroImage}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-30"
          showLoader={false}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-allure-petrol-deep via-allure-petrol-deep/90 to-allure-petrol-deep/75" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,color-mix(in_oklab,var(--allure-gold)_16%,transparent),transparent_55%)]" />
      </div>

      <div className="relative z-[1] mx-auto max-w-3xl px-5 text-center sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-sans text-xs uppercase tracking-[0.28em] text-allure-gold">
            Prochaine étape
          </p>
          <h2 className="mt-4 font-heading text-3xl text-white sm:text-4xl lg:text-5xl">
            Visiter le témoin en vrai
          </h2>
          <p className="mx-auto mt-5 max-w-md font-sans text-sm leading-relaxed text-white/65">
            Showroom, présentation sur place ou visioconférence — un conseiller
            Allure vous accompagne pour {temoin.typologyLabel}.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="btn-cta">
              <Link
                href={`/rendez-vous?type=showroom&interest=${temoin.interest}`}
              >
                Planifier un rendez-vous
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-white/25 bg-transparent text-white hover:bg-white/10"
            >
              <Link href="/les-appartements">Voir les typologies</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
