"use client";

import { useRef } from "react";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { SectionSeam, SEAM } from "@/components/ui/section-seam";
import { SITE } from "@/lib/site";
import { useSectionReveal } from "@/hooks/use-section-reveal";

const TAGS = ["Vie de standing", "Une approche à l'écoute", "Confiance"];

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative overflow-hidden py-24 lg:py-32"
    >
      <Image
        src="/hero-sequence/frame_024.webp"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-allure-sand/65 dark:bg-allure-petrol/70" />
      <SectionSeam from={SEAM.white} fromDark={SEAM.petrolDeep} />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-16 flex flex-wrap items-center justify-between gap-4 font-sans text-xs uppercase tracking-[0.25em] text-allure-petrol/60 dark:text-allure-sand/60">
          {TAGS.map((tag) => (
            <span key={tag} data-reveal="eyebrow">
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-end">
          <div>
            <p
              data-reveal="eyebrow"
              className="font-sans text-xs uppercase tracking-[0.3em] text-allure-gold"
            >
              Contact
            </p>
            <h2
              data-split="lines,words"
              data-split-animate="words"
              className="mt-4 font-heading text-4xl leading-[1.1] text-allure-petrol sm:text-5xl lg:text-6xl dark:text-white"
            >
              Excellence
              <br />
              <span className="ml-8 sm:ml-14">— Professionnalisme</span>
              <br />
              Votre satisfaction
            </h2>

            <div
              data-reveal="item"
              className="mt-10 flex flex-col gap-4 rounded-2xl border border-allure-petrol/10 bg-white/90 p-6 shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-allure-petrol-deep/80"
            >
              <a
                href={SITE.phoneHref}
                className="flex items-center gap-4 font-sans text-sm text-allure-ink transition-colors hover:text-allure-gold dark:text-white"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-allure-sand text-allure-petrol dark:bg-white/10 dark:text-allure-gold">
                  <Phone className="h-4 w-4" />
                </span>
                {SITE.phone}
              </a>
              <div className="flex items-center gap-4 font-sans text-sm text-allure-ink dark:text-white">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-allure-sand text-allure-petrol dark:bg-white/10 dark:text-allure-gold">
                  <MapPin className="h-4 w-4" />
                </span>
                {SITE.address}
              </div>
              <a
                href={SITE.emailHref}
                className="flex items-center gap-4 font-sans text-sm text-allure-ink transition-colors hover:text-allure-gold dark:text-white"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-allure-sand text-allure-petrol dark:bg-white/10 dark:text-allure-gold">
                  <Mail className="h-4 w-4" />
                </span>
                {SITE.email}
              </a>
            </div>
          </div>

          <div
            data-reveal="media"
            className="rounded-2xl border border-allure-petrol/10 bg-white/95 p-8 shadow-xl backdrop-blur-sm dark:border-white/10 dark:bg-allure-petrol-deep/90"
          >
            <h3
              data-split="words"
              data-split-animate="words"
              className="font-heading text-xl text-allure-petrol dark:text-white"
            >
              Discutons de votre projet
            </h3>
            <p
              data-split="lines,words"
              data-split-animate="words"
              className="mt-1 font-sans text-sm text-allure-ink/50 dark:text-white/50"
            >
              Notre équipe vous répond sous 24h.
            </p>
            <ContactForm className="mt-6" source="home-contact" />
          </div>
        </div>
      </div>
    </section>
  );
}
