"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useMotionValue, useTransform } from "motion/react";
import { SectionSharp, SHARP } from "@/components/ui/section-sharp";
import { HeroExitFade } from "@/components/ui/section-seam";
import { MediaLoader } from "@/components/ui/media-loader";
import { registerGsap } from "@/lib/gsap/register";
import { DURATION, EASE } from "@/lib/gsap/presets";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";
import { emitHeroPinActive, getHeroPinEnd, getHeroPinMetrics } from "@/lib/hero-pin";

registerGsap();

const OPENING_STILL = "/media/hero-cinematic/opening.webp";
/** MP4 en premier : plus léger que le WebM actuel, seek H.264 plus fiable pour le scrub. */
const HERO_MP4 = "/media/hero-cinematic/hero.mp4";
const HERO_WEBM = "/media/hero-cinematic/hero.webm";
/** Séquence WebP — iOS / mobile : seek vidéo `currentTime` trop irrégulier. */
const FRAME_COUNT = 120;
const frameSrc = (index: number) =>
  `/media/hero-cinematic/frame_${String(index + 1).padStart(3, "0")}.webp`;

function drawCoverFrame(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cw: number,
  ch: number
) {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (!iw || !ih) return;
  const scale = Math.max(cw / iw, ch / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
}

/** Phase 1 = orbite 360° (arc), phase 2 = pénétration intérieure (ligne). */
const ORBIT_END = 0.33;

const BEATS = [
  {
    id: "silhouette",
    from: 0,
    label: "Almadies",
    headline: "L’élégance aux Almadies",
    lead: "Programme de standing à Dakar — livraison 2026.",
  },
  {
    id: "rotation",
    from: ORBIT_END,
    label: "Rotation",
    headline: "La silhouette se lit d’un regard",
    lead: "Verticale, lumineuse, ouverte sur le ciel des Almadies.",
  },
  {
    id: "habiter",
    from: 0.67,
    label: "Habiter",
    headline: "L’élégance, même dans les détails",
    lead: "Visitez les appartements témoins, puis réservez une rencontre pour vous projeter sur place.",
  },
] as const;

function beatIndexForProgress(p: number) {
  for (let i = BEATS.length - 1; i >= 0; i--) {
    if (p >= BEATS[i].from) return i;
  }
  return 0;
}

export function CinematicHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<(HTMLImageElement | undefined)[]>([]);
  const textBlockRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLParagraphElement>(null);
  const beatRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const beatIndexRef = useRef(0);
  const introDoneRef = useRef(false);
  const pendingTimeRef = useRef(0);
  const seekingRef = useRef(false);

  const [ready, setReady] = useState(false);
  const [waiting, setWaiting] = useState(true);
  const [beatIndex, setBeatIndex] = useState(0);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const reduced = usePrefersReducedMotion();
  const progress = useMotionValue(0);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const textY = useTransform(progress, [0, 1], [0, -56]);
  const textOpacity = useTransform(progress, [0, 0.42, 0.62], [1, 1, 0]);
  const bandOpacity = useTransform(progress, [0, 0.55, 1], [1, 0.7, 0.45]);
  const hintOpacity = useTransform(progress, [0, 0.04, 0.12], [1, 1, 0]);
  const arcOpacity = useTransform(
    progress,
    [0, ORBIT_END - 0.04, ORBIT_END + 0.02],
    [1, 1, 0]
  );
  const lineOpacity = useTransform(
    progress,
    [ORBIT_END - 0.02, ORBIT_END + 0.04],
    [0, 1]
  );
  const arcDegrees = useTransform(progress, [0, ORBIT_END], [0, 340]);
  const linePct = useTransform(progress, [ORBIT_END, 1], [0, 100]);
  const arcLength = useTransform(arcDegrees, (deg) => (deg / 360) * 351.86);

  const beat = BEATS[beatIndex];
  const textReadyClass = reduced === true ? "opacity-100" : "opacity-0";
  const hasHeadline = beat.headline.length > 0;
  const showStaticFallback = reduced === true || !ready;

  useEffect(() => {
    if (isMobile !== false || reduced === true) return;
    const video = videoRef.current;
    if (!video) return;

    let settled = false;
    const stopWaiting = () => setWaiting(false);
    const markReady = () => {
      if (settled) return;
      settled = true;
      setReady(true);
      setWaiting(false);
    };

    const onReady = () => {
      if (video.readyState >= 2) markReady();
    };

    if (video.readyState >= 2) onReady();
    video.addEventListener("loadeddata", onReady);
    video.addEventListener("canplay", onReady);
    video.addEventListener("error", stopWaiting);
    const timeout = window.setTimeout(stopWaiting, 3500);

    return () => {
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("canplay", onReady);
      video.removeEventListener("error", stopWaiting);
      window.clearTimeout(timeout);
    };
  }, [isMobile, reduced]);

  useEffect(() => {
    if (isMobile !== true || reduced === true) return;

    let cancelled = false;
    const frames: (HTMLImageElement | undefined)[] = [];
    framesRef.current = frames;

    const loadOne = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = frameSrc(i);
        frames[i] = img;
      });

    const run = async () => {
      await loadOne(0);
      if (cancelled) return;
      setReady(true);
      setWaiting(false);
      const batch = 8;
      for (let i = 1; i < FRAME_COUNT && !cancelled; i += batch) {
        const end = Math.min(FRAME_COUNT, i + batch);
        await Promise.all(
          Array.from({ length: end - i }, (_, k) => loadOne(i + k))
        );
      }
    };

    void run();
    const timeout = window.setTimeout(() => setWaiting(false), 2800);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [isMobile, reduced]);

  useEffect(() => {
    if (isMobile !== true || !ready) return;
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    const img = framesRef.current[0];
    if (!canvas || !section || !img?.naturalWidth) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(section.clientWidth * dpr));
    canvas.height = Math.max(1, Math.round(section.clientHeight * dpr));
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawCoverFrame(ctx, img, canvas.width, canvas.height);
  }, [isMobile, ready]);

  useEffect(() => {
    if (!introDoneRef.current || reduced === true) return;
    const targets = [beatRef.current, titleRef.current, leadRef.current].filter(
      Boolean
    ) as HTMLElement[];
    if (!targets.length) return;

    gsap.killTweensOf(targets);
    gsap.fromTo(
      targets,
      { autoAlpha: 0.35, y: 6 },
      { autoAlpha: 1, y: 0, duration: 0.45, ease: EASE.out, stagger: 0.04 }
    );
  }, [beatIndex, reduced]);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      // Attendre reduced + viewport connus — sinon le pin est créé, tué, recréé
      // et le spacer (~3 vh) pousse le hero hors écran (page crème vide).
      if (!section || reduced === null || isMobile === null) return;

      const prefersReduced = reduced === true;
      const mobile = isMobile;

      const rewindIfJumped = (trigger: ScrollTrigger) => {
        if (trigger.progress === 0) return;
        window.scrollTo(0, 0);
        trigger.scroll(trigger.start);
        ScrollTrigger.refresh();
      };

      if (prefersReduced) {
        progress.set(0);
        const reducedSt = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom top",
          onToggle: (self) => emitHeroPinActive(self.isActive),
        });
        emitHeroPinActive(reducedSt.isActive);
        return () => {
          reducedSt.kill();
          emitHeroPinActive(false);
        };
      }

      const applyVideoTime = (t: number) => {
        if (!video) return;
        const duration = video.duration;
        if (!Number.isFinite(duration) || duration <= 0) return;
        const next = Math.min(duration - 0.04, Math.max(0, t));
        pendingTimeRef.current = next;
        if (seekingRef.current) return;
        if (Math.abs(video.currentTime - next) < 0.04) return;
        seekingRef.current = true;
        video.currentTime = next;
      };

      const fitCanvas = () => {
        if (!canvas) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = section.clientWidth;
        const h = section.clientHeight;
        canvas.width = Math.max(1, Math.round(w * dpr));
        canvas.height = Math.max(1, Math.round(h * dpr));
      };

      const drawFrameAt = (p: number) => {
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const frames = framesRef.current;
        const idx = Math.min(
          FRAME_COUNT - 1,
          Math.max(0, Math.round(p * (FRAME_COUNT - 1)))
        );
        let img = frames[idx];
        if (!img?.complete || !img.naturalWidth) {
          for (let i = idx; i >= 0; i--) {
            const prev = frames[i];
            if (prev?.complete && prev.naturalWidth) {
              img = prev;
              break;
            }
          }
        }
        if (!img?.naturalWidth) return;
        drawCoverFrame(ctx, img, canvas.width, canvas.height);
      };

      const onSeeked = () => {
        seekingRef.current = false;
        applyVideoTime(pendingTimeRef.current);
      };

      if (!mobile && video) {
        video.pause();
        video.addEventListener("seeked", onSeeked);
      }

      if (mobile) {
        fitCanvas();
        drawFrameAt(0);
      }

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => getHeroPinEnd(),
        pin: true,
        pinSpacing: true,
        scrub: mobile ? 0.55 : 0.35,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onToggle: (self) => emitHeroPinActive(self.isActive),
        onUpdate: (self) => {
          const { animRatio } = getHeroPinMetrics();
          const animProgress = Math.min(1, self.progress / animRatio);
          progress.set(animProgress);

          if (mobile) {
            drawFrameAt(animProgress);
          } else if (video) {
            const duration = video.duration;
            if (Number.isFinite(duration) && duration > 0) {
              applyVideoTime(animProgress * Math.max(0, duration - 0.04));
            }
          }

          const nextBeat = beatIndexForProgress(animProgress);
          if (nextBeat !== beatIndexRef.current) {
            beatIndexRef.current = nextBeat;
            setBeatIndex(nextBeat);
          }
        },
      });

      emitHeroPinActive(st.isActive);
      rewindIfJumped(st);
      const onResize = () => {
        if (!mobile) return;
        fitCanvas();
        drawFrameAt(progress.get());
      };
      window.addEventListener("resize", onResize);
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        rewindIfJumped(st);
        if (mobile) {
          fitCanvas();
          drawFrameAt(0);
        }
      });

      return () => {
        window.removeEventListener("resize", onResize);
        if (video) video.removeEventListener("seeked", onSeeked);
        st.kill();
        emitHeroPinActive(false);
      };
    },
    { dependencies: [reduced, isMobile] }
  );

  useGSAP(
    () => {
      if (reduced === null) return;

      const brand = brandRef.current;
      const beatEl = beatRef.current;
      const title = titleRef.current;
      const lead = leadRef.current;
      const cta = ctaRef.current;
      const hint = hintRef.current;
      if (!title || !brand) return;

      const nodes = [brand, beatEl, title, lead, cta, hint].filter(
        Boolean
      ) as HTMLElement[];

      if (reduced) {
        gsap.set(nodes, { autoAlpha: 1, clearProps: "transform" });
        introDoneRef.current = true;
        return;
      }

      gsap.set(nodes, { autoAlpha: 0 });
      introDoneRef.current = false;

      let cancelled = false;
      const tl = gsap.timeline({
        paused: true,
        delay: 0.08,
        onComplete: () => {
          introDoneRef.current = true;
        },
      });

      const runSplits = () => {
        if (cancelled || !titleRef.current) return;

        tl.fromTo(
          brand,
          { autoAlpha: 0, y: 18, scale: 0.96 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: DURATION.slow,
            ease: EASE.out,
          },
          0
        );

        if (beatEl) {
          tl.fromTo(
            beatEl,
            { autoAlpha: 0, y: -8 },
            {
              autoAlpha: 1,
              y: 0,
              duration: DURATION.fast,
              ease: EASE.out,
            },
            0.2
          );
        }

        tl.fromTo(
          title,
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: DURATION.slow,
            ease: EASE.out,
          },
          0.28
        );

        if (lead) {
          tl.fromTo(
            lead,
            { autoAlpha: 0, y: 12 },
            {
              autoAlpha: 1,
              y: 0,
              duration: DURATION.base,
              ease: EASE.out,
            },
            "-=0.4"
          );
        }

        if (cta) {
          tl.fromTo(
            cta,
            { autoAlpha: 0, y: 14 },
            {
              autoAlpha: 1,
              y: 0,
              duration: DURATION.base,
              ease: EASE.out,
            },
            "-=0.22"
          );
        }

        if (hint) {
          tl.fromTo(
            hint,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: DURATION.base, ease: EASE.soft },
            "-=0.05"
          );
        }

        tl.play(0);
      };

      if (document.fonts?.ready) {
        Promise.race([
          document.fonts.ready,
          new Promise((resolve) => window.setTimeout(resolve, 800)),
        ]).then(runSplits);
      } else {
        runSplits();
      }

      return () => {
        cancelled = true;
        tl.kill();
      };
    },
    { dependencies: [reduced, isMobile] }
  );

  return (
    <section
      ref={sectionRef}
      data-cinematic-hero
      className="relative h-dvh w-full overflow-hidden bg-allure-petrol-deep"
      id="accueil"
      aria-label="Résidence Allure — introduction cinématographique"
    >
      {/* Canvas toujours là (pin GSAP). Vidéo desktop seulement — pas de MP4/WebM sur mobile. */}
      {isMobile !== true ? (
        <video
          ref={videoRef}
          className={cn(
            "absolute inset-0 z-0 h-full w-full object-cover transition-opacity duration-300",
            showStaticFallback || isMobile !== false
              ? "opacity-0"
              : "opacity-100"
          )}
          muted
          playsInline
          preload={isMobile === false ? "auto" : "none"}
          poster={OPENING_STILL}
          aria-hidden
        >
          {isMobile === false ? (
            <>
              <source src={HERO_MP4} type="video/mp4" />
              <source src={HERO_WEBM} type="video/webm" />
            </>
          ) : null}
        </video>
      ) : null}

      <canvas
        ref={canvasRef}
        className={cn(
          "absolute inset-0 z-0 h-full w-full transition-opacity duration-300",
          isMobile === true && !showStaticFallback ? "opacity-100" : "opacity-0"
        )}
        aria-hidden
      />

      <div className="pointer-events-none absolute inset-0 z-[5]">
        {/* eslint-disable-next-line @next/next/no-img-element -- poster LCP / reduced-motion */}
        <img
          src={OPENING_STILL}
          alt=""
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
            showStaticFallback ? "opacity-100" : "opacity-0"
          )}
        />
        <div className={cn(waiting && reduced !== true ? "contents" : "hidden")}>
          <MediaLoader tone="petrol" label="Chargement" />
        </div>
      </div>

      <motion.div
        style={{ opacity: bandOpacity }}
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-16 bg-gradient-to-b from-black/30 to-transparent sm:h-20"
      />
      <motion.div
        style={{ opacity: bandOpacity }}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-20 bg-gradient-to-t from-black/35 to-transparent sm:h-24"
      />

      <HeroExitFade compact to={SHARP.white} toDark={SHARP.petrolDeep} />
      <SectionSharp
        edge="bottom"
        mode="line"
        fill="transparent"
        fillDark="transparent"
        variant="fold"
      />

      <motion.div
        ref={textBlockRef}
        style={{ y: textY, opacity: textOpacity }}
        className="absolute inset-x-0 bottom-[14%] z-10 flex flex-col items-center gap-4 px-6 text-center sm:bottom-[16%] sm:gap-5"
      >
        <p
          ref={beatRef}
          className={cn(
            "font-sans text-[10px] uppercase tracking-[0.5em] text-allure-gold sm:text-xs",
            textReadyClass
          )}
        >
          {beat.label}
        </p>

        <p
          ref={brandRef}
          className={cn(
            "font-heading font-medium leading-none tracking-[0.22em] text-white transition-[font-size] duration-500",
            hasHeadline
              ? "text-[clamp(1.6rem,4.2vw,2.6rem)] opacity-85"
              : "text-[clamp(2.4rem,7vw,4.6rem)]",
            textReadyClass
          )}
        >
          ALLURE
        </p>

        <h1
          ref={titleRef}
          className={cn(
            "max-w-md font-heading text-xl leading-snug text-white/95 sm:text-2xl lg:text-3xl",
            textReadyClass
          )}
        >
          {beat.headline || "Résidence Allure"}
        </h1>

        <p
          ref={leadRef}
          className={cn(
            "max-w-sm font-sans text-sm leading-relaxed text-white/65",
            textReadyClass
          )}
        >
          {beat.lead}
        </p>

        <div
          ref={ctaRef}
          className={cn(
            "pointer-events-auto mt-2 flex items-center justify-center",
            textReadyClass
          )}
        >
          <a
            href={beat.id === "habiter" ? "/appartements-temoins" : "/rendez-vous"}
            className="group relative border border-white/40 px-9 py-3.5 font-sans text-xs font-medium uppercase tracking-[0.32em] text-white transition-colors duration-300 hover:border-allure-gold/70"
          >
            {beat.id === "habiter" ? "Appartements témoins" : "Planifier une visite"}
            <span
              className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-allure-gold transition-transform duration-300 ease-out group-hover:scale-x-100"
              aria-hidden
            />
          </a>
        </div>
      </motion.div>

      <div className="pointer-events-none absolute right-5 top-1/2 z-10 hidden -translate-y-1/2 sm:block lg:right-9">
        <motion.svg
          width="34"
          height="120"
          viewBox="0 0 34 120"
          style={{ opacity: arcOpacity }}
          className="absolute inset-0"
          aria-hidden
        >
          <path
            d="M17,4 A56,56 0 0 1 17,116"
            fill="none"
            stroke="rgba(246,241,231,0.16)"
            strokeWidth="1.4"
          />
          <motion.path
            d="M17,4 A56,56 0 0 1 17,116"
            fill="none"
            stroke="var(--allure-gold)"
            strokeWidth="1.4"
            strokeLinecap="round"
            style={{
              strokeDasharray: 351.86,
              strokeDashoffset: useTransform(arcLength, (len) => 351.86 - len),
            }}
          />
        </motion.svg>

        <motion.div
          style={{ opacity: lineOpacity }}
          className="absolute inset-0 h-[120px] w-px bg-white/16"
          aria-hidden
        >
          <motion.div
            style={{ height: useTransform(linePct, (v) => `${v}%`) }}
            className="absolute inset-x-0 top-0 bg-allure-gold"
          />
        </motion.div>
      </div>

      <motion.div
        ref={hintRef}
        style={{ opacity: hintOpacity }}
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-8 z-10 flex justify-center sm:bottom-10",
          textReadyClass
        )}
      >
        <span
          className={cn(
            "h-9 w-px origin-top bg-gradient-to-b from-allure-gold/80 to-transparent",
            reduced !== true && ready && "animate-pulse"
          )}
          aria-hidden
        />
      </motion.div>
    </section>
  );
}
