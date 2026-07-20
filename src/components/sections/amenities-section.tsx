"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Waves,
  Dumbbell,
  ShieldCheck,
  Car,
  Wifi,
  Trees,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionSeam, SEAM } from "@/components/ui/section-seam";
import { useSectionReveal } from "@/hooks/use-section-reveal";

const REASONS = [
  {
    icon: Waves,
    title: "Cadre Almadies",
    text: "À ~300 m de la plage, dans l’un des quartiers les plus recherchés de Dakar.",
  },
  {
    icon: ShieldCheck,
    title: "Sécurité 24h/24",
    text: "Gardiennage, vidéosurveillance et accès contrôlé pour une sérénité quotidienne.",
  },
  {
    icon: Dumbbell,
    title: "Prestations premium",
    text: "Piscine, salle de sport, lounge et espaces verts réunis dans la résidence.",
  },
  {
    icon: Car,
    title: "Confort technique",
    text: "Parking privé, groupe électrogène, fibre et climatisation.",
  },
  {
    icon: Wifi,
    title: "Accompagnement diaspora",
    text: "Achat à distance, suivi chantier et conseils jusqu’à la remise des clés.",
  },
  {
    icon: Trees,
    title: "Valeur durable",
    text: "Architecture soignée et emplacement stratégique pour un patrimoine pérenne.",
  },
];

export function AmenitiesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useSectionReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="residence"
      className="relative bg-allure-sand py-24 lg:py-32 dark:bg-allure-petrol"
    >
      <SectionSeam from={SEAM.petrolDeep} fromDark={SEAM.petrolDeep} />
      <div className="relative z-[2] mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
        <div>
          <p
            data-reveal="eyebrow"
            className="font-sans text-xs uppercase tracking-[0.3em] text-allure-gold"
          >
            Pourquoi Allure
          </p>
          <h2
            data-split="lines,words"
            data-split-animate="words"
            className="mt-4 font-heading text-3xl text-allure-petrol sm:text-4xl dark:text-allure-sand"
          >
            Des choix clairs pour un art de vivre exigeant
          </h2>
          <ul className="mt-10 flex flex-col gap-5">
            {REASONS.map((item) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.title}
                  data-reveal="item"
                  className="flex gap-4"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-allure-petrol dark:bg-allure-petrol-deep dark:text-allure-gold">
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                  <div>
                    <p className="font-heading text-base text-allure-petrol dark:text-allure-sand">
                      {item.title}
                    </p>
                    <p className="mt-1 font-sans text-sm text-allure-ink/60 dark:text-allure-sand/60">
                      {item.text}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
          <div data-reveal="item">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="mt-10 rounded-full border-allure-petrol/20 bg-white dark:border-allure-sand/20 dark:bg-transparent"
            >
              <Link href="/residence">
                Découvrir la résidence
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div
          data-reveal="media"
          className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] lg:max-w-none"
        >
          <Image
            src="/Allure/HD_172.webp"
            alt="Prestations Résidence Allure"
            fill
            sizes="(min-width: 1024px) 45vw, 90vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-allure-petrol-deep/40 to-transparent" />
        </div>
      </div>
    </section>
  );
}
