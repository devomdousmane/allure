"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { SectionSeam, SEAM } from "@/components/ui/section-seam";
import { cn } from "@/lib/utils";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { HomeCtaRow } from "@/components/home-scroll/home-cta-row";

const TESTIMONIALS = [
  {
    quote:
      "Investir dans Allure a été une évidence dès la première visite du showroom. L'équipe commerciale a été transparente sur le calendrier de livraison et les finitions promises se retrouvent exactement dans les plans. Un vrai gage de confiance pour un achat depuis l'étranger.",
    name: "Moussa Diagne",
    role: "Investisseur, diaspora France",
    initials: "MD",
  },
  {
    quote:
      "Ce qui nous a convaincus, c'est l'emplacement — à deux pas de la plage, dans un quartier calme mais proche de tout. Le suivi de chantier régulier par photos nous rassure sur l'avancement, et l'équipe répond toujours rapidement à nos questions.",
    name: "Aïssatou Ndiaye",
    role: "Future résidente, Almadies",
    initials: "AN",
  },
  {
    quote:
      "Nous cherchions un appartement pour notre retraite à Dakar. Les plans du Type C correspondaient exactement à nos besoins — vue dégagée, prestations premium. Le processus d'acquisition a été accompagné de bout en bout, sans mauvaise surprise.",
    name: "Cheikh Fall",
    role: "Acquéreur, Type C",
    initials: "CF",
  },
];

const COUNT = TESTIMONIALS.length;
const AUTOPLAY_MS = 6500;

function ringOffset(i: number, active: number) {
  let d = i - active;
  if (d > COUNT / 2) d -= COUNT;
  if (d < -COUNT / 2) d += COUNT;
  return d;
}

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const reduced = usePrefersReducedMotion();
  useSectionReveal(sectionRef, { debugId: "testimonials" });

  const go = useCallback((delta: number) => {
    setActive((prev) => (prev + delta + COUNT) % COUNT);
  }, []);

  const goTo = useCallback((index: number) => {
    setActive(((index % COUNT) + COUNT) % COUNT);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 }
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduced !== false || paused || !inView) return;
    const id = window.setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [go, paused, inView, reduced]);

  return (
    <section
      ref={sectionRef}
      id="temoignages"
      className="relative overflow-hidden bg-allure-sand py-24 lg:py-32 dark:bg-allure-petrol"
      aria-roledescription="carousel"
      aria-label="Témoignages clients"
    >
      {/* from = couleur d’arrivée du HeroExitFade quartier (pas petrolDeep) */}
      <SectionSeam
        edges="top"
        from={SEAM.sand}
        fromDark={SEAM.petrol}
        className="h-28 sm:h-36"
      />

      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span
            data-reveal="eyebrow"
            className="mx-auto mb-4 inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.3em] text-allure-gold"
          >
            <span className="h-1 w-1 rounded-full bg-allure-gold" />
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

        <div
          data-reveal="media"
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
              setPaused(false);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              go(-1);
            }
            if (e.key === "ArrowRight") {
              e.preventDefault();
              go(1);
            }
          }}
        >
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Témoignage précédent"
            className="absolute top-1/2 left-0 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-allure-petrol/15 bg-white text-allure-petrol shadow-sm transition-colors duration-200 hover:bg-allure-sand sm:left-4 dark:border-allure-sand/15 dark:bg-allure-petrol-deep dark:text-allure-sand dark:hover:bg-allure-petrol-deep/70"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Témoignage suivant"
            className="absolute top-1/2 right-0 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-allure-petrol/15 bg-white text-allure-petrol shadow-sm transition-colors duration-200 hover:bg-allure-sand sm:right-4 dark:border-allure-sand/15 dark:bg-allure-petrol-deep dark:text-allure-sand dark:hover:bg-allure-petrol-deep/70"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div
            className="relative mx-auto h-[420px] sm:h-[340px]"
            style={
              reduced === false ? { perspective: "1600px" } : undefined
            }
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
                  animate={
                    reduced === false
                      ? {
                          x: `${offset * 88}%`,
                          rotateY: offset * -32,
                          scale: isActive ? 1 : 0.84,
                          y: isActive ? -6 : 10,
                          opacity: visible ? (isActive ? 1 : 0.4) : 0,
                          zIndex: 10 - Math.abs(offset),
                        }
                      : {
                          x: 0,
                          opacity: isActive ? 1 : 0,
                          scale: 1,
                          zIndex: isActive ? 2 : 0,
                        }
                  }
                  transition={{
                    duration: reduced === false ? 0.55 : 0.25,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  aria-hidden={!isActive}
                >
                  <article
                    className={cn(
                      "grid w-full grid-cols-1 overflow-hidden rounded-3xl border bg-white sm:grid-cols-[220px_1fr] dark:bg-allure-petrol-deep",
                      isActive
                        ? "border-allure-petrol/10 shadow-[0_28px_56px_-16px_rgba(30,75,93,0.32)] dark:border-allure-sand/10"
                        : "border-allure-petrol/5 shadow-md dark:border-allure-sand/5"
                    )}
                    aria-roledescription="slide"
                    aria-label={`${i + 1} sur ${COUNT}`}
                  >
                    <div className="relative flex h-56 items-center justify-center bg-allure-petrol-deep sm:h-full">
                      <span
                        aria-hidden
                        className="font-heading text-6xl text-allure-gold/90 sm:text-7xl"
                      >
                        {t.initials}
                      </span>
                    </div>

                    <div className="relative flex flex-col justify-center gap-4 p-8">
                      <Quote
                        className="absolute right-6 bottom-4 h-16 w-16 text-allure-petrol/[0.06] dark:text-allure-sand/[0.08]"
                        aria-hidden
                      />
                      <p
                        className="relative font-sans text-[15px] leading-relaxed text-allure-ink/80 dark:text-allure-sand/80"
                        aria-live={isActive ? "polite" : "off"}
                      >
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
                  </article>
                </motion.div>
              );
            })}
          </div>

          <div
            className="mt-6 flex justify-center gap-2"
            role="tablist"
            aria-label="Sélecteur de témoignages"
          >
            {TESTIMONIALS.map((t, i) => (
              <button
                key={t.name}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => goTo(i)}
                aria-label={`Témoignage ${i + 1} — ${t.name}`}
                className={cn(
                  "h-1.5 cursor-pointer rounded-full transition-all duration-200",
                  i === active
                    ? "w-8 bg-allure-petrol dark:bg-allure-gold"
                    : "w-1.5 bg-allure-petrol/20 hover:bg-allure-petrol/40 dark:bg-allure-sand/20 dark:hover:bg-allure-sand/40"
                )}
              />
            ))}
          </div>

          <div data-reveal="item" className="mt-10">
            <HomeCtaRow
              primary={{
                label: "Planifier une visite",
                href: "/rendez-vous",
              }}
              secondary={{
                label: "Appartements témoins",
                href: "/appartements-temoins",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
