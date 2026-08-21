"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useMotionValue, useTransform, type MotionValue } from "motion/react";
import { SectionSharp, SHARP } from "@/components/ui/section-sharp";
import { HeroExitFade } from "@/components/ui/section-seam";
import { registerGsap } from "@/lib/gsap/register";
import { DURATION, EASE } from "@/lib/gsap/presets";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";
import { useLenis } from "@/components/layout/smooth-scroll-provider";
import { emitHeroPinActive, getHeroPinEnd, getHeroPinMetrics } from "@/lib/hero-pin";

registerGsap();

const OPENING_STILL = "/media/hero-cinematic/opening.webp";
/** MP4 en premier : plus léger que le WebM actuel, seek H.264 plus fiable pour le scrub. */
const HERO_MP4 = "/media/hero-cinematic/hero.mp4";
/** Séquence WebP — iOS / mobile : seek vidéo `currentTime` trop irrégulier. */
const FRAME_COUNT = 60;
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

function findHeroPinTrigger() {
  return ScrollTrigger.getAll().find((trigger) => {
    const el = trigger.trigger;
    return el instanceof HTMLElement && el.hasAttribute("data-cinematic-hero");
  });
}

function HeroSceneRail({
  progress,
  beatIndex,
}: {
  progress: MotionValue<number>;
  beatIndex: number;
}) {
  const lenis = useLenis();
  const fillHeight = useTransform(progress, (p) => `${8 + p * 92}%`);
  const railOpacity = useTransform(progress, [0, 0.92, 1], [1, 1, 0.4]);

  function goToBeat(from: number) {
    const st = findHeroPinTrigger();
    if (!st) return;
    const { animRatio } = getHeroPinMetrics();
    const y = st.start + from * animRatio * (st.end - st.start);
    if (lenis) lenis.scrollTo(y, { duration: 1.15 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  }

  return (
    <motion.nav
      style={{ opacity: railOpacity }}
      aria-label="Scènes de l'introduction"
      className="pointer-events-none absolute inset-y-0 right-0 z-20 hidden md:block"
    >
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 w-36 bg-gradient-to-l from-black/50 via-black/20 to-transparent lg:w-44"
      />

      <div className="absolute top-1/2 right-4 flex -translate-y-1/2 flex-col items-end gap-0 lg:right-6">
        <ol className="relative flex flex-col gap-7 py-2 pr-4">
          <span
            aria-hidden
            className="absolute top-3 right-[7px] bottom-3 w-px bg-white/20"
          >
            <motion.span
              className="absolute inset-x-0 top-0 origin-top bg-allure-gold"
              style={{ height: fillHeight }}
            />
          </span>

          {BEATS.map((scene, index) => {
            const active = beatIndex === index;
            const passed = beatIndex > index;
            return (
              <li key={scene.id} className="relative z-[1] flex justify-end">
                <button
                  type="button"
                  onClick={() => goToBeat(scene.from)}
                  aria-current={active ? "true" : undefined}
                  aria-label={`Scène ${index + 1} — ${scene.label}`}
                  className="group pointer-events-auto flex cursor-pointer items-center gap-3"
                >
                  <span className="flex flex-col items-end gap-0.5">
                    <span
                      className={cn(
                        "font-heading text-[10px] tabular-nums tracking-[0.16em] transition-colors duration-300",
                        active
                          ? "text-allure-gold"
                          : "text-white/35 group-hover:text-white/70"
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "max-w-[6.5rem] text-right font-sans text-[10px] uppercase tracking-[0.18em] transition-colors duration-300",
                        active
                          ? "text-white"
                          : passed
                            ? "text-white/55 group-hover:text-allure-gold/90"
                            : "text-white/40 group-hover:text-white/75"
                      )}
                    >
                      {scene.label}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "relative block h-2.5 w-2.5 shrink-0 rounded-full border transition-all duration-300",
                      active
                        ? "scale-110 border-allure-gold bg-allure-gold"
                        : passed
                          ? "border-allure-gold/70 bg-allure-gold/80"
                          : "border-white/40 bg-transparent group-hover:border-allure-gold/80"
                    )}
                  />
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </motion.nav>
  );
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

  const beat = BEATS[beatIndex];
  const hasHeadline = beat.headline.length > 0;
  /** Poster visible tant que le média scrub n’est pas prêt — pas de spinner bloquant. */
  const showStaticFallback = reduced === true || !ready;

  useEffect(() => {
    if (isMobile !== false || reduced === true) return;
    const video = videoRef.current;
    if (!video) return;

    let settled = false;
    const markReady = () => {
      if (settled) return;
      settled = true;
      setReady(true);
    };

    const onReady = () => {
      if (video.readyState >= 2) markReady();
    };

    if (video.readyState >= 2) onReady();
    video.addEventListener("loadeddata", onReady);
    video.addEventListener("canplay", onReady);
    video.addEventListener("error", markReady);
    // Ne pas bloquer l’UI : le poster reste jusqu’à la 1re frame vidéo.
    const timeout = window.setTimeout(markReady, 1800);

    return () => {
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("canplay", onReady);
      video.removeEventListener("error", markReady);
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
        if (i < 3) {
          try {
            img.fetchPriority = "high";
          } catch {
            /* older browsers */
          }
        }
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = frameSrc(i);
        frames[i] = img;
      });

    const run = async () => {
      // Afficher dès la 1re frame — le reste en arrière-plan sans bloquer.
      await loadOne(0);
      if (cancelled) return;
      setReady(true);

      const warm = [1, 2, 3, 4, 5].filter((i) => i < FRAME_COUNT);
      await Promise.all(warm.map((i) => loadOne(i)));
      if (cancelled) return;

      const batch = 4;
      for (let i = warm.length + 1; i < FRAME_COUNT && !cancelled; i += batch) {
        const end = Math.min(FRAME_COUNT, i + batch);
        await Promise.all(
          Array.from({ length: end - i }, (_, k) => loadOne(i + k))
        );
        // Laisse le main thread respirer entre lots.
        await new Promise<void>((r) =>
          window.setTimeout(r, 0)
        );
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [isMobile, reduced]);

  useEffect(() => {
    if (isMobile !== true || !ready) return;
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    const img = framesRef.current[0];
    if (!canvas || !section || !img?.naturalWidth) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
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
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
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

      const revealAll = () => {
        gsap.set(nodes, { autoAlpha: 1, clearProps: "transform" });
        introDoneRef.current = true;
      };

      if (reduced) {
        revealAll();
        return;
      }

      // Contenu déjà visible en HTML — intro = léger from, pas un masquage dur.
      introDoneRef.current = false;
      gsap.set(nodes, { autoAlpha: 1 });

      let cancelled = false;
      const failsafe = window.setTimeout(() => {
        if (!cancelled && !introDoneRef.current) revealAll();
      }, 1200);

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
          { autoAlpha: 0.55, y: 14, scale: 0.98 },
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
            { autoAlpha: 0.55, y: -6 },
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
          { autoAlpha: 0.55, y: 12 },
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
            { autoAlpha: 0.55, y: 10 },
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
            { autoAlpha: 0.55, y: 10 },
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
            { autoAlpha: 0.4 },
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
        window.clearTimeout(failsafe);
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
      {/* Canvas toujours là (pin GSAP). Vidéo desktop — MP4 seul (WebM plus lourd). */}
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
            <source src={HERO_MP4} type="video/mp4" />
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
          fetchPriority="high"
          decoding="async"
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
            showStaticFallback ? "opacity-100" : "opacity-0"
          )}
        />
      </div>

      <motion.div
        style={{ opacity: bandOpacity }}
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-24 bg-gradient-to-b from-black/55 via-black/20 to-transparent sm:h-28"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-[1] hidden w-56 bg-gradient-to-r from-black/60 via-black/25 to-transparent lg:block lg:w-72"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[46%] bg-gradient-to-t from-black/75 via-black/40 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-[1] hidden w-32 bg-gradient-to-l from-black/40 to-transparent md:block lg:w-40"
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
          className="font-sans text-[10px] uppercase tracking-[0.5em] text-allure-gold [text-shadow:0_1px_12px_rgba(0,0,0,0.45)] sm:text-xs"
        >
          {beat.label}
        </p>

        <p
          ref={brandRef}
          className={cn(
            "font-heading font-medium leading-none tracking-[0.22em] text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.55)] transition-[font-size] duration-500",
            hasHeadline
              ? "text-[clamp(1.6rem,4.2vw,2.6rem)] opacity-90"
              : "text-[clamp(2.4rem,7vw,4.6rem)]"
          )}
        >
          ALLURE
        </p>

        <h1
          ref={titleRef}
          className="max-w-md font-heading text-xl leading-snug text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.5)] sm:text-2xl lg:text-3xl"
        >
          {beat.headline || "Résidence Allure"}
        </h1>

        <p
          ref={leadRef}
          className="max-w-sm font-sans text-sm leading-relaxed text-white/85 [text-shadow:0_1px_16px_rgba(0,0,0,0.55)]"
        >
          {beat.lead}
        </p>

        <div
          ref={ctaRef}
          className="pointer-events-auto mt-2 flex items-center justify-center"
        >
          <a
            href={beat.id === "habiter" ? "/appartements-temoins" : "/rendez-vous"}
            className="group relative border border-white/55 bg-black/25 px-9 py-3.5 font-sans text-xs font-medium uppercase tracking-[0.32em] text-white backdrop-blur-sm transition-colors duration-300 hover:border-allure-gold/80 hover:bg-black/35"
          >
            {beat.id === "habiter" ? "Appartements témoins" : "Planifier une visite"}
            <span
              className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-allure-gold transition-transform duration-300 ease-out group-hover:scale-x-100"
              aria-hidden
            />
          </a>
        </div>
      </motion.div>

      <HeroSceneRail progress={progress} beatIndex={beatIndex} />

      <motion.div
        ref={hintRef}
        style={{ opacity: hintOpacity }}
        className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex justify-center sm:bottom-10"
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
