"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  FolderOpen,
} from "lucide-react";
import { MediaLightbox } from "@/components/avancement/media-lightbox";
import { Tilt3D } from "@/components/motion/tilt-3d";
import { useLenis } from "@/components/layout/smooth-scroll-provider";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useSectionReveal } from "@/hooks/use-section-reveal";
import {
  getFolderImages,
  RESIDENCE_COPY,
  RESIDENCE_FOLDERS,
  type ResidenceAptFilter,
  type ResidenceFolderId,
  type ResidenceImage,
} from "@/lib/residence";
import { cn } from "@/lib/utils";

const APT_OPTIONS: { id: ResidenceAptFilter; label: string }[] = [
  { id: "all", label: "Les deux" },
  { id: "appart-1", label: "Vue A" },
  { id: "appart-2", label: "Vue B" },
];

/**
 * Visite guidée par dossiers (pièces) — rail intuitif, animé, responsive.
 */
export function ResidenceFolderGuide() {
  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const lenis = useLenis();
  const reduced = usePrefersReducedMotion();
  useSectionReveal(sectionRef, { threshold: 0.08 });

  const [folderId, setFolderId] = useState<ResidenceFolderId>(
    RESIDENCE_FOLDERS[0].id
  );
  const [apt, setApt] = useState<ResidenceAptFilter>("all");
  const [photoIndex, setPhotoIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const folder = useMemo(
    () => RESIDENCE_FOLDERS.find((f) => f.id === folderId) ?? RESIDENCE_FOLDERS[0],
    [folderId]
  );

  const availableFolders = useMemo(() => {
    if (apt === "all") return RESIDENCE_FOLDERS;
    return RESIDENCE_FOLDERS.filter((f) => f.apts.includes(apt));
  }, [apt]);

  const images = useMemo(
    () => getFolderImages(folderId, apt),
    [folderId, apt]
  );

  const current = images[photoIndex] ?? images[0];
  const folderIndex = availableFolders.findIndex((f) => f.id === folderId);
  const safeFolderIndex = folderIndex >= 0 ? folderIndex : 0;

  // Deep-link ?piece=cuisine#visite-guidee (+ maj si l’URL change)
  useEffect(() => {
    const apply = () => {
      const params = new URLSearchParams(window.location.search);
      const piece = params.get("piece") as ResidenceFolderId | null;
      if (piece && RESIDENCE_FOLDERS.some((f) => f.id === piece)) {
        setFolderId(piece);
      }
    };
    apply();
    window.addEventListener("popstate", apply);
    return () => window.removeEventListener("popstate", apply);
  }, []);

  // Si le dossier actif n’existe pas pour le filtre apt, basculer
  useEffect(() => {
    if (!availableFolders.some((f) => f.id === folderId)) {
      const next = availableFolders[0];
      if (next) {
        setFolderId(next.id);
        setPhotoIndex(0);
      }
    }
  }, [availableFolders, folderId]);

  useEffect(() => {
    setPhotoIndex(0);
  }, [folderId, apt]);

  // Centrer le dossier actif dans le rail
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const active = rail.querySelector<HTMLElement>(`[data-folder="${folderId}"]`);
    if (!active) return;
    const left =
      active.offsetLeft - rail.clientWidth / 2 + active.clientWidth / 2;
    rail.scrollTo({
      left: Math.max(0, left),
      behavior: reduced === true ? "auto" : "smooth",
    });
  }, [folderId, reduced, availableFolders]);

  // Centrer la vignette active
  useEffect(() => {
    const strip = thumbRef.current;
    if (!strip) return;
    const active = strip.querySelector<HTMLElement>(
      `[data-thumb="${photoIndex}"]`
    );
    if (!active) return;
    const left =
      active.offsetLeft - strip.clientWidth / 2 + active.clientWidth / 2;
    strip.scrollTo({
      left: Math.max(0, left),
      behavior: reduced === true ? "auto" : "smooth",
    });
  }, [photoIndex, reduced, images]);

  const selectFolder = useCallback(
    (id: ResidenceFolderId) => {
      setFolderId(id);
      const url = new URL(window.location.href);
      url.searchParams.set("piece", id);
      url.hash = "visite-guidee";
      window.history.replaceState(null, "", url.toString());

      const el = document.getElementById("visite-stage");
      if (el && window.matchMedia("(max-width: 1023px)").matches) {
        if (lenis) lenis.scrollTo(el, { offset: -72 });
        else el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [lenis]
  );

  const goFolder = useCallback(
    (delta: number) => {
      const next =
        availableFolders[
          (safeFolderIndex + delta + availableFolders.length) %
            availableFolders.length
        ];
      if (next) selectFolder(next.id);
    },
    [availableFolders, safeFolderIndex, selectFolder]
  );

  const goPhoto = useCallback(
    (delta: number) => {
      if (images.length < 1) return;
      setPhotoIndex((i) => (i + delta + images.length) % images.length);
    },
    [images.length]
  );

  // Clavier quand la section est visible
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.85 && rect.bottom > 80;
      if (!inView || lightbox) return;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        if (e.shiftKey) goFolder(1);
        else goPhoto(1);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (e.shiftKey) goFolder(-1);
        else goPhoto(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goFolder, goPhoto, lightbox]);

  function openLightbox(img: ResidenceImage) {
    const i = images.findIndex((x) => x.src === img.src);
    setPhotoIndex(i >= 0 ? i : 0);
    setLightbox(true);
  }

  const motionOk = reduced !== true;

  return (
    <section
      ref={sectionRef}
      id="visite-guidee"
      className="relative bg-allure-sand py-14 dark:bg-allure-petrol sm:py-16 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p
              data-reveal="eyebrow"
              className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.3em] text-allure-gold"
            >
              <FolderOpen className="size-3.5" aria-hidden />
              {RESIDENCE_COPY.guideEyebrow}
            </p>
            <h2
              id={labelId}
              data-split="lines,words"
              data-split-animate="words"
              className="mt-3 font-heading text-3xl text-allure-petrol dark:text-allure-sand sm:text-4xl"
            >
              {RESIDENCE_COPY.guideTitle}
            </h2>
            <p
              data-reveal="text"
              className="mt-4 font-sans text-sm leading-relaxed text-allure-ink/65 dark:text-allure-sand/65"
            >
              {RESIDENCE_COPY.guideBody}
            </p>
          </div>

          {/* Filtre vue A / B */}
          <div
            data-reveal="item"
            className="flex shrink-0 gap-1 self-start rounded-full border border-allure-petrol/15 p-1 dark:border-allure-sand/15 lg:self-auto"
            role="group"
            aria-label="Source des photos"
          >
            {APT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setApt(opt.id)}
                className={cn(
                  "cursor-pointer rounded-full px-3.5 py-1.5 font-sans text-[0.7rem] uppercase tracking-[0.14em] transition-colors duration-200",
                  apt === opt.id
                    ? "bg-allure-petrol text-white dark:bg-allure-gold dark:text-allure-petrol-deep"
                    : "text-allure-ink/50 hover:text-allure-petrol dark:text-allure-sand/50 dark:hover:text-allure-sand"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rail dossiers — scroll-snap mobile, wrap desktop */}
        <div
          data-reveal="item"
          className="relative mt-8"
          role="tablist"
          aria-labelledby={labelId}
        >
          <div
            ref={railRef}
            className="-mx-5 flex gap-2.5 overflow-x-auto px-5 pb-2 scroll-smooth snap-x snap-mandatory sm:mx-0 sm:gap-3 sm:px-0 lg:grid lg:grid-cols-4 lg:overflow-visible xl:grid-cols-8"
          >
            {availableFolders.map((f, i) => {
              const count = getFolderImages(f.id, apt).length;
              const active = f.id === folderId;
              return (
                <Tilt3D
                  key={f.id}
                  className="w-[7.5rem] shrink-0 snap-center sm:w-[8.5rem] lg:w-auto"
                  maxDeg={active ? 4 : 9}
                >
                  <button
                    type="button"
                    role="tab"
                    data-folder={f.id}
                    aria-selected={active}
                    aria-controls="visite-stage"
                    onClick={() => selectFolder(f.id)}
                    className={cn(
                      "group relative w-full overflow-hidden text-left transition-[box-shadow] duration-300",
                      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-allure-gold",
                      active
                        ? "ring-2 ring-allure-gold ring-offset-2 ring-offset-allure-sand dark:ring-offset-allure-petrol"
                        : ""
                    )}
                  >
                    <span className="relative block aspect-[3/4] overflow-hidden bg-allure-petrol/10">
                      <Image
                        src={f.cover}
                        alt=""
                        fill
                        sizes="140px"
                        className={cn(
                          "object-cover transition-transform duration-500 ease-out",
                          active ? "scale-105" : "group-hover:scale-[1.04]"
                        )}
                      />
                      <span className="absolute inset-0 bg-gradient-to-t from-allure-petrol-deep/90 via-allure-petrol-deep/25 to-transparent" />
                      <span className="absolute left-2 top-2 font-sans text-[0.6rem] tabular-nums tracking-wider text-white/70">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="absolute inset-x-0 bottom-0 p-2.5">
                        <span className="block font-sans text-[0.65rem] uppercase tracking-[0.14em] text-white">
                          {f.shortLabel}
                        </span>
                        <span className="mt-0.5 block font-sans text-[0.6rem] text-white/55">
                          {count} photo{count > 1 ? "s" : ""}
                        </span>
                      </span>
                    </span>
                  </button>
                </Tilt3D>
              );
            })}
          </div>
        </div>

        {/* Scène principale */}
        <div
          id="visite-stage"
          data-reveal="media"
          className="mt-6 scroll-mt-24 sm:mt-8 lg:mt-10"
        >
          <div className="flex items-center justify-between gap-3 border-b border-allure-petrol/10 pb-4 dark:border-allure-sand/10">
            <div className="min-w-0">
              <p className="font-sans text-[0.65rem] uppercase tracking-[0.22em] text-allure-gold">
                Dossier {String(safeFolderIndex + 1).padStart(2, "0")}
                <span className="text-allure-ink/30 dark:text-allure-sand/30">
                  {" "}
                  / {String(availableFolders.length).padStart(2, "0")}
                </span>
              </p>
              <h3 className="mt-1 truncate font-heading text-xl text-allure-petrol dark:text-allure-sand sm:text-2xl">
                {folder.label}
              </h3>
              <p className="mt-1 hidden font-sans text-sm text-allure-ink/55 dark:text-allure-sand/55 sm:block">
                {folder.description}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={() => goFolder(-1)}
                aria-label="Pièce précédente"
                className="inline-flex size-10 cursor-pointer items-center justify-center border border-allure-petrol/20 text-allure-petrol transition-colors hover:border-allure-gold hover:text-allure-gold dark:border-allure-sand/25 dark:text-allure-sand"
              >
                <ChevronLeft className="size-4" strokeWidth={1.75} />
              </button>
              <button
                type="button"
                onClick={() => goFolder(1)}
                aria-label="Pièce suivante"
                className="inline-flex size-10 cursor-pointer items-center justify-center border border-allure-petrol/20 text-allure-petrol transition-colors hover:border-allure-gold hover:text-allure-gold dark:border-allure-sand/25 dark:text-allure-sand"
              >
                <ChevronRight className="size-4" strokeWidth={1.75} />
              </button>
            </div>
          </div>

          {/* Image principale */}
          <div className="relative mt-4 aspect-[4/3] overflow-hidden bg-allure-petrol/10 dark:bg-allure-sand/5 sm:aspect-[16/10] lg:aspect-[21/10]">
            <AnimatePresence mode="wait">
              {current ? (
                <motion.button
                  key={current.src}
                  type="button"
                  initial={motionOk ? { opacity: 0, scale: 1.03 } : false}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={motionOk ? { opacity: 0, scale: 0.985 } : undefined}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => openLightbox(current)}
                  className="absolute inset-0 cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-allure-gold"
                  aria-label={`Agrandir — ${current.alt}`}
                >
                  <Image
                    src={current.src}
                    alt={current.alt}
                    fill
                    priority
                    sizes="(min-width: 1024px) 72vw, 100vw"
                    className="object-cover"
                  />
                </motion.button>
              ) : null}
            </AnimatePresence>

            {/* Nav photos */}
            {images.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => goPhoto(-1)}
                  aria-label="Photo précédente"
                  className="absolute left-3 top-1/2 z-[2] inline-flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center border border-white/25 bg-allure-petrol-deep/45 text-white backdrop-blur-sm transition-colors hover:border-allure-gold/60 hover:text-allure-gold sm:left-4"
                >
                  <ChevronLeft className="size-4" strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  onClick={() => goPhoto(1)}
                  aria-label="Photo suivante"
                  className="absolute right-3 top-1/2 z-[2] inline-flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center border border-white/25 bg-allure-petrol-deep/45 text-white backdrop-blur-sm transition-colors hover:border-allure-gold/60 hover:text-allure-gold sm:right-4"
                >
                  <ChevronRight className="size-4" strokeWidth={1.75} />
                </button>
              </>
            ) : null}

            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-allure-petrol-deep/80 to-transparent p-4 sm:p-5">
              <p className="font-sans text-[0.65rem] uppercase tracking-[0.18em] text-white/80">
                {current?.apt === "appart-1" ? "Vue A" : current?.apt === "appart-2" ? "Vue B" : ""}
              </p>
              <p className="font-sans text-xs tabular-nums text-white/70">
                {String(photoIndex + 1).padStart(2, "0")}
                <span className="mx-1 text-white/35">/</span>
                {String(Math.max(images.length, 1)).padStart(2, "0")}
              </p>
            </div>
          </div>

          {/* Filmstrip */}
          {images.length > 1 ? (
            <div
              ref={thumbRef}
              className="mt-3 flex gap-2 overflow-x-auto pb-1 scroll-smooth sm:mt-4 sm:gap-2.5"
              role="listbox"
              aria-label="Vignettes du dossier"
            >
              {images.map((img, i) => (
                <button
                  key={img.src}
                  type="button"
                  role="option"
                  data-thumb={i}
                  aria-selected={i === photoIndex}
                  onClick={() => setPhotoIndex(i)}
                  onDoubleClick={() => openLightbox(img)}
                  className={cn(
                    "relative h-16 w-24 shrink-0 overflow-hidden bg-allure-petrol/10 transition-opacity duration-200 sm:h-20 sm:w-28",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-allure-gold",
                    i === photoIndex
                      ? "ring-2 ring-allure-gold opacity-100"
                      : "opacity-55 hover:opacity-90"
                  )}
                >
                  <Image
                    src={img.src}
                    alt=""
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          ) : null}

          <p className="mt-4 hidden font-sans text-[0.7rem] text-allure-ink/40 dark:text-allure-sand/40 sm:block">
            Flèches : photo suivante · Maj+flèches : changer de pièce
          </p>
        </div>
      </div>

      <MediaLightbox
        images={images}
        index={photoIndex}
        open={lightbox}
        onClose={() => setLightbox(false)}
        onIndexChange={setPhotoIndex}
      />
    </section>
  );
}
