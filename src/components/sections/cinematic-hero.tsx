"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useMotionValue, useTransform } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 24;
const frameUrl = (i: number) =>
  `/hero-sequence/frame_${String(i).padStart(3, "0")}.webp`;

// Respiration douce de la caméra sur tout le scrub : légère avancée puis
// recul, jamais un simple zoom monotone (donne l'impression d'une caméra
// qui suit la construction plutôt que d'un slider mécanique).
const ZOOM_KEYFRAMES: [number, number][] = [
  [0, 1],
  [0.5, 1.08],
  [1, 1.02],
];

function zoomForProgress(p: number) {
  for (let i = 0; i < ZOOM_KEYFRAMES.length - 1; i++) {
    const [p0, z0] = ZOOM_KEYFRAMES[i];
    const [p1, z1] = ZOOM_KEYFRAMES[i + 1];
    if (p >= p0 && p <= p1) {
      const t = p1 === p0 ? 0 : (p - p0) / (p1 - p0);
      return z0 + (z1 - z0) * t;
    }
  }
  return ZOOM_KEYFRAMES[ZOOM_KEYFRAMES.length - 1][1];
}

export function CinematicHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const progress = useMotionValue(0);
  const textY = useTransform(progress, [0, 1], [0, -40]);
  const textOpacity = useTransform(progress, [0, 0.35, 0.55], [1, 1, 0]);
  const vignetteOpacity = useTransform(progress, [0, 0.7, 1], [0.5, 0.1, 0]);

  useEffect(() => {
    let cancelled = false;
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = frameUrl(i);
      img.onload = () => {
        loadedCount += 1;
        if (loadedCount === FRAME_COUNT && !cancelled) {
          setImagesLoaded(true);
        }
      };
      images.push(img);
    }
    imagesRef.current = images;

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!imagesLoaded || !canvasRef.current || !sectionRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const drawFrame = (img: HTMLImageElement, zoom: number, alpha: number) => {
      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.width / img.height;
      let drawWidth = canvas.width;
      let drawHeight = canvas.height;

      if (imgRatio > canvasRatio) {
        drawHeight = canvas.height;
        drawWidth = drawHeight * imgRatio;
      } else {
        drawWidth = canvas.width;
        drawHeight = drawWidth / imgRatio;
      }
      drawWidth *= zoom;
      drawHeight *= zoom;
      const offsetX = (canvas.width - drawWidth) / 2;
      const offsetY = (canvas.height - drawHeight) / 2;

      ctx.globalAlpha = alpha;
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      ctx.globalAlpha = 1;
    };

    // scrollProgress: position continue dans la séquence (0 = frame 0,
    // FRAME_COUNT-1 = dernière frame). Le cross-fade entre les deux frames
    // encadrantes lisse le scrub — sans ça chaque pas de scroll "saute" à
    // la frame suivante au lieu de sembler continu.
    const render = (scrollProgress: number) => {
      const clamped = Math.min(FRAME_COUNT - 1, Math.max(0, scrollProgress));
      const lower = Math.floor(clamped);
      const upper = Math.min(FRAME_COUNT - 1, lower + 1);
      const blend = clamped - lower;
      const zoom = zoomForProgress(clamped / (FRAME_COUNT - 1));

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const imgLower = imagesRef.current[lower];
      const imgUpper = imagesRef.current[upper];
      if (imgLower) drawFrame(imgLower, zoom, 1);
      if (imgUpper && blend > 0) drawFrame(imgUpper, zoom, blend);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      render(frameHolder.scrollProgress);
    };

    const frameHolder = { scrollProgress: 0 };
    resize();
    window.addEventListener("resize", resize);

    if (prefersReducedMotion) {
      render(FRAME_COUNT - 1);
      return () => window.removeEventListener("resize", resize);
    }

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "+=220%",
      pin: true,
      // Avoid flex-parent pinSpacing bugs: hero sits in a block wrapper.
      pinSpacing: true,
      scrub: 0.4,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const scrollProgress = self.progress * (FRAME_COUNT - 1);
        frameHolder.scrollProgress = scrollProgress;
        render(scrollProgress);
        progress.set(self.progress);
      },
    });

    // Recompute all page triggers once the hero pin spacer exists
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      st.kill();
      window.removeEventListener("resize", resize);
    };
  }, [imagesLoaded]);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-allure-sand dark:bg-allure-petrol-deep"
    >
      {/* Bâtiment — plein cadre, en arrière-plan */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Vignette — assombrit légèrement les bords sur le chantier brut,
          s'efface au fur et à mesure que la résidence se révèle finie */}
      <motion.div
        style={{
          opacity: vignetteOpacity,
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(20,20,20,0.9) 100%)",
        }}
        className="pointer-events-none absolute inset-0"
      />

      {/* Dégradés de lisibilité — texte toujours lisible par-dessus l'image */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-allure-sand via-allure-sand/70 to-transparent dark:from-allure-petrol-deep dark:via-allure-petrol-deep/70" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-allure-sand/80 via-allure-sand/20 to-transparent dark:from-allure-petrol-deep/80 dark:via-allure-petrol-deep/20" />

      {/* Zone texte — superposée au bâtiment, recule et s'efface légèrement
          au scrub pour donner de la profondeur à la caméra */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 flex h-full flex-col items-center gap-5 px-6 pt-28 text-center lg:pt-32"
      >
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-sans text-xs uppercase tracking-[0.35em] text-allure-petrol/70 dark:text-allure-sand/70"
        >
          Route des Almadies · Dakar
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading text-4xl leading-tight text-allure-petrol sm:text-5xl lg:text-6xl dark:text-allure-sand"
        >
          Résidence Allure — L&rsquo;élégance,
          <br className="hidden sm:block" /> même dans les détails
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="max-w-lg font-sans text-sm text-allure-ink/60 dark:text-allure-sand/60"
        >
          Un programme immobilier de standing au cœur des Almadies, pensé
          pour ceux qui exigent l&rsquo;excellence à chaque détail.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.95 }}
          className="mt-2 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="/contact"
            className="btn-3d inline-flex h-12 items-center justify-center rounded-full bg-allure-petrol px-7 font-sans text-sm font-medium text-white hover:bg-allure-petrol-deep dark:btn-3d-gold dark:bg-allure-gold dark:text-allure-petrol-deep dark:hover:bg-allure-gold/90"
          >
            Planifier une visite
          </a>
          <a
            href="#appartements"
            className="btn-3d btn-3d-outline inline-flex h-12 items-center justify-center rounded-full border border-allure-petrol/25 bg-white/70 px-7 font-sans text-sm font-medium text-allure-petrol backdrop-blur-sm hover:bg-white dark:border-allure-sand/30 dark:bg-allure-petrol-deep/50 dark:text-allure-sand dark:hover:bg-allure-petrol-deep/80"
          >
            Voir les appartements
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="pointer-events-none absolute inset-x-0 bottom-6 z-10 text-center font-sans text-[11px] uppercase tracking-[0.3em] text-allure-ink/40 dark:text-allure-sand/40"
      >
        Faites défiler pour découvrir
      </motion.div>
    </section>
  );
}
