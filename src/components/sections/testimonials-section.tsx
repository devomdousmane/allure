"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { SectionSeam, SEAM } from "@/components/ui/section-seam";
import { cn } from "@/lib/utils";
import { useSectionReveal } from "@/hooks/use-section-reveal";

const TESTIMONIALS = [
  {
    quote:
      "Investir dans Allure a été une évidence dès la première visite du showroom. L'équipe commerciale a été transparente sur le calendrier de livraison et les finitions promises se retrouvent exactement dans les plans. Un vrai gage de confiance pour un achat depuis l'étranger.",
    name: "Moussa Diagne",
    role: "Investisseur, diaspora France",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
  },
  {
    quote:
      "Ce qui nous a convaincus, c'est l'emplacement — à deux pas de la plage, dans un quartier calme mais proche de tout. Le suivi de chantier régulier par photos nous rassure sur l'avancement, et l'équipe répond toujours rapidement à nos questions.",
    name: "Aïssatou Ndiaye",
    role: "Future résidente, Almadies",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
  },
  {
    quote:
      "Nous cherchions un appartement pour notre retraite à Dakar. Les plans du Type C correspondaient exactement à nos besoins — vue dégagée, prestations premium. Le processus d'acquisition a été accompagné de bout en bout, sans mauvaise surprise.",
    name: "Cheikh Fall",
    role: "Acquéreur, Type C",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80",
  },
];

const COUNT = TESTIMONIALS.length;

// Décalage circulaire le plus court entre deux index sur un anneau de
// taille COUNT — donne -1/0/+1 pour les voisins immédiats quel que soit
// le sens de parcours, y compris en bouclant du dernier au premier.
function ringOffset(i: number, active: number) {
  let d = i - active;
  if (d > COUNT / 2) d -= COUNT;
  if (d < -COUNT / 2) d += COUNT;
  return d;
}

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  useSectionReveal(sectionRef);

  const go = (delta: number) => {
    setActive((prev) => (prev + delta + COUNT) % COUNT);
  };

  return (
    <section
      ref={sectionRef}
      id="temoignages"
      className="relative overflow-hidden bg-allure-sand py-24 lg:py-32 dark:bg-allure-petrol"
    >
      <SectionSeam from={SEAM.white} fromDark={SEAM.petrolDeep} />

      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span
            data-reveal="eyebrow"
            className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-allure-petrol/10 bg-allure-sand px-4 py-1.5 font-sans text-xs uppercase tracking-[0.15em] text-allure-petrol dark:border-allure-sand/10 dark:bg-white/5 dark:text-allure-sand"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-allure-gold" />
            Témoignages
          </span>
          <h2
            data-split="lines,words"
            data-split-animate="words"
            className="font-heading text-3xl text-allure-petrol sm:text-4xl dark:text-allure-sand"
          >
            Ce qu&rsquo;ils en disent
          </h2>
          <p
            data-split="lines,words"
            data-split-animate="words"
            className="mt-5 font-sans text-sm text-allure-ink/60 dark:text-allure-sand/60"
          >
            Des histoires vraies, portées par la confiance de nos futurs
            résidents et investisseurs.
          </p>
        </div>

        <div data-reveal="media" className="relative">
          {/* Flèches — détachées de la carte, ancrées sur toute la largeur de la section */}
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Témoignage précédent"
            className="absolute left-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-allure-petrol/15 bg-white text-allure-petrol shadow-sm transition-colors hover:bg-allure-sand sm:left-4 dark:border-allure-sand/15 dark:bg-allure-petrol-deep dark:text-allure-sand dark:hover:bg-allure-petrol-deep/70"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Témoignage suivant"
            className="absolute right-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-allure-petrol/15 bg-white text-allure-petrol shadow-sm transition-colors hover:bg-allure-sand sm:right-4 dark:border-allure-sand/15 dark:bg-allure-petrol-deep dark:text-allure-sand dark:hover:bg-allure-petrol-deep/70"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Scène 3D — perspective sur tout le conteneur, chaque carte se
              positionne en absolu selon son décalage circulaire par rapport
              à la carte active (coverflow : rotation + recul + retrait sur
              les côtés pour les voisines). */}
          <div
            className="relative mx-auto h-[420px] sm:h-[340px]"
            style={{ perspective: "1600px" }}
          >
            {TESTIMONIALS.map((t, i) => {
              const offset = ringOffset(i, active);
              const isActive = offset === 0;
              const visible = Math.abs(offset) <= 1;

              return (
                <motion.div
                  key={t.name}
                  className="absolute inset-0 mx-auto flex w-full max-w-2xl items-center justify-center px-4"
                  style={{ transformStyle: "preserve-3d" }}
                  initial={false}
                  animate={{
                    x: `${offset * 88}%`,
                    rotateY: offset * -35,
                    scale: isActive ? 1 : 0.82,
                    y: isActive ? -8 : 12,
                    opacity: visible ? (isActive ? 1 : 0.45) : 0,
                    zIndex: 10 - Math.abs(offset),
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div
                    className={cn(
                      "grid w-full grid-cols-1 overflow-hidden rounded-3xl border bg-white sm:grid-cols-[220px_1fr] dark:bg-allure-petrol-deep",
                      isActive
                        ? "border-allure-petrol/10 shadow-[0_30px_60px_-15px_rgba(30,75,93,0.35)] dark:border-allure-sand/10 dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]"
                        : "border-allure-petrol/5 shadow-md dark:border-allure-sand/5"
                    )}
                  >
                    <div className="relative h-56 sm:h-full">
                      <Image
                        src={t.image}
                        alt={t.name}
                        fill
                        sizes="220px"
                        className="object-cover"
                      />
                    </div>

                    <div className="relative flex flex-col justify-center gap-4 p-8">
                      <Quote className="absolute right-6 bottom-4 h-16 w-16 text-allure-petrol/[0.06] dark:text-allure-sand/[0.08]" />
                      <p className="relative font-sans text-[15px] leading-relaxed text-allure-ink/80 dark:text-allure-sand/80">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                      <div>
                        <p className="font-heading text-base text-allure-petrol dark:text-allure-sand">
                          {t.name}
                        </p>
                        <p className="font-sans text-xs text-allure-ink/50 dark:text-allure-sand/50">
                          {t.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-center gap-2">
            {TESTIMONIALS.map((t, i) => (
              <button
                key={t.name}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Aller au témoignage ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === active
                    ? "w-8 bg-allure-petrol dark:bg-allure-gold"
                    : "w-1.5 bg-allure-petrol/20 dark:bg-allure-sand/20"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
