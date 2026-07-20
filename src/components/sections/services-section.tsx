"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bookmark,
  Calendar,
  Camera,
  MapPin,
  MessageCircle,
  Phone,
  User,
} from "lucide-react";
import { SITE } from "@/lib/site";
import { useSectionReveal } from "@/hooks/use-section-reveal";

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative overflow-hidden bg-white py-24 lg:py-32 dark:bg-allure-petrol-deep"
    >
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/Allure/HD_139.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/55 to-white dark:from-allure-petrol-deep dark:via-allure-petrol-deep/80 dark:to-allure-petrol-deep" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] mx-auto flex h-72 max-w-6xl justify-between px-6">
        <span className="h-full w-px bg-gradient-to-b from-allure-petrol/25 to-transparent dark:from-white/20" />
        <span className="h-full w-px bg-gradient-to-b from-allure-petrol/25 to-transparent dark:from-white/20" />
      </div>

      <div className="relative z-[2] mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p
            data-reveal="eyebrow"
            className="font-sans text-xs uppercase tracking-[0.3em] text-allure-petrol/60 dark:text-allure-sand/60"
          >
            Devenez propriétaire à partir de
          </p>
          <p className="mt-2 font-heading text-6xl text-allure-petrol sm:text-7xl lg:text-8xl dark:text-allure-sand">
            <span
              data-split="chars"
              data-split-animate="chars"
              className="inline-block"
            >
              165M
            </span>
            <span className="text-3xl sm:text-4xl lg:text-5xl">FCFA</span>
          </p>
          <p
            data-split="lines,words"
            data-split-animate="words"
            className="mt-2 font-sans text-sm text-allure-ink/60 dark:text-allure-sand/60"
          >
            Financement adapté aux résidents comme à la diaspora.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div
            data-reveal="item"
            className="relative flex flex-col justify-between gap-6 rounded-2xl border border-allure-petrol/10 bg-white p-6 shadow-sm md:col-span-2 dark:border-allure-sand/10 dark:bg-allure-petrol-deep"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full border border-allure-petrol/10 bg-allure-sand px-3 py-1.5 font-sans text-xs text-allure-petrol dark:border-allure-sand/10 dark:bg-white/5 dark:text-allure-sand">
                <MapPin className="h-3.5 w-3.5" />
                Route des Almadies
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-allure-petrol/10 text-allure-petrol dark:border-allure-sand/10 dark:text-allure-sand">
                <Bookmark className="h-3.5 w-3.5" />
              </span>
            </div>
            <Link
              href="/contact"
              className="btn-3d relative flex items-center justify-center rounded-xl bg-allure-petrol py-4 hover:bg-allure-petrol-deep dark:btn-3d-gold dark:bg-allure-gold dark:hover:bg-allure-gold/90"
            >
              <span className="inline-flex items-center gap-2 font-sans text-sm font-medium text-white dark:text-allure-petrol-deep">
                <Calendar className="h-4 w-4" />
                Planifier une visite
              </span>
            </Link>
            <div className="relative">
              <h3
                data-split="words"
                data-split-animate="words"
                className="font-heading text-lg text-allure-petrol dark:text-allure-sand"
              >
                Visitez le showroom
              </h3>
              <p className="mt-1 font-sans text-sm text-allure-ink/60 dark:text-allure-sand/60">
                Sur rendez-vous, notre équipe vous présente les plans, les
                finitions et l&rsquo;avancement réel du chantier.
              </p>
            </div>
          </div>

          <div
            data-reveal="item"
            className="relative flex flex-col justify-between gap-6 overflow-hidden rounded-2xl border border-allure-petrol/10 bg-white p-6 shadow-sm md:row-span-2 dark:border-allure-sand/10 dark:bg-allure-petrol-deep"
          >
            <div className="relative overflow-hidden rounded-xl">
              <Image
                src="/hero-sequence/frame_012.webp"
                alt=""
                fill
                sizes="400px"
                className="object-cover blur-md"
              />
              <div className="absolute inset-0 bg-allure-petrol-deep/75" />
              <div className="relative p-4">
                <p className="flex items-center gap-2 font-sans text-xs font-medium text-allure-gold">
                  <Phone className="h-3.5 w-3.5" />
                  Depuis la diaspora
                </p>
                <div className="mt-3 flex items-start gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
                    <MessageCircle className="h-3.5 w-3.5" />
                  </span>
                  <p className="rounded-lg rounded-tl-none bg-white/10 px-3 py-2 font-sans text-xs text-white/90">
                    Bonjour, je vis à Paris — puis-je acheter et suivre le
                    chantier à distance ?
                  </p>
                </div>
                <p className="mt-2 ml-9 rounded-lg rounded-tr-none bg-allure-gold px-3 py-2 font-sans text-xs text-allure-petrol-deep">
                  Oui, un conseiller dédié vous accompagne de bout en bout,
                  jusqu&rsquo;à la remise des clés.
                </p>
              </div>
            </div>
            <div>
              <h3
                data-split="words"
                data-split-animate="words"
                className="font-heading text-lg text-allure-petrol dark:text-allure-sand"
              >
                Un accompagnement dédié
              </h3>
              <p className="mt-1 font-sans text-sm text-allure-ink/60 dark:text-allure-sand/60">
                Achat à distance, procurations, modalités de paiement —
                notre équipe s&rsquo;adapte aux acquéreurs de la diaspora.
              </p>
            </div>
          </div>

          <Link
            data-reveal="item"
            href="/avancement"
            className="relative flex min-h-[220px] flex-col justify-between gap-6 overflow-hidden rounded-2xl p-6 shadow-sm transition-opacity hover:opacity-95"
          >
            <Image
              src="/hero-sequence/frame_024.webp"
              alt=""
              fill
              sizes="400px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-allure-petrol/80 to-allure-petrol-deep/90" />
            <div className="relative rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white">
                  <Camera className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-sans text-xs font-medium text-white">
                    Suivi de chantier
                  </p>
                  <p className="font-sans text-[11px] text-white/60">
                    Voir l&rsquo;avancement
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <h3
                data-split="words"
                data-split-animate="words"
                className="font-heading text-lg text-white"
              >
                Chantier suivi en photos
              </h3>
              <p className="mt-1 font-sans text-sm text-white/70">
                Un état d&rsquo;avancement régulier, partagé avec chaque
                acquéreur, pour suivre le projet en toute transparence.
              </p>
            </div>
          </Link>

          <Link
            data-reveal="item"
            href="/contact"
            className="relative flex flex-col justify-between gap-6 rounded-2xl border border-allure-petrol/10 bg-white p-6 shadow-sm transition-colors hover:border-allure-gold/40 dark:border-allure-sand/10 dark:bg-allure-petrol-deep"
          >
            <div className="flex items-center gap-3 rounded-xl border border-allure-petrol/10 bg-allure-sand p-3 dark:border-allure-sand/10 dark:bg-white/5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-allure-petrol text-white dark:bg-allure-gold dark:text-allure-petrol-deep">
                <User className="h-4 w-4" />
              </span>
              <div>
                <p className="font-sans text-xs font-medium text-allure-petrol dark:text-allure-sand">
                  Équipe commerciale Allure
                </p>
                <p className="font-sans text-[11px] text-allure-ink/50 dark:text-allure-sand/50">
                  Répond sous 24h · {SITE.phone}
                </p>
              </div>
            </div>
            <div className="relative">
              <h3
                data-split="words"
                data-split-animate="words"
                className="font-heading text-lg text-allure-petrol dark:text-allure-sand"
              >
                Une équipe à votre écoute
              </h3>
              <p className="mt-1 font-sans text-sm text-allure-ink/60 dark:text-allure-sand/60">
                Conseils personnalisés, réponses rapides — nos conseillers
                vous guident du premier contact à la remise des clés.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
