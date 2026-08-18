"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ComponentProps,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MediaImage } from "@/components/ui/media-image";
import { cn } from "@/lib/utils";
import type { TemoinDetail, TemoinRoomId } from "@/data/temoins";

type TemoinGalleryProps = {
  temoin: TemoinDetail;
};

export function TemoinGallery({ temoin }: TemoinGalleryProps) {
  const [room, setRoom] = useState<TemoinRoomId | "all">("all");
  const [active, setActive] = useState(0);

  const filtered = useMemo(() => {
    if (room === "all") return temoin.gallery;
    return temoin.gallery.filter((img) => img.room === room);
  }, [room, temoin.gallery]);

  const current = filtered[active] ?? filtered[0];
  const count = filtered.length;

  function selectRoom(next: TemoinRoomId | "all") {
    setRoom(next);
    setActive(0);
  }

  const go = useCallback(
    (delta: number) => {
      if (!count) return;
      setActive((i) => (i + delta + count) % count);
    },
    [count]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  if (!temoin.gallery.length) return null;

  const roomCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const img of temoin.gallery) {
      map.set(img.room, (map.get(img.room) ?? 0) + 1);
    }
    return map;
  }, [temoin.gallery]);

  return (
    <section
      id="galerie"
      className="bg-white py-16 dark:bg-allure-petrol-deep sm:py-24"
    >
      <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="font-sans text-xs uppercase tracking-[0.28em] text-allure-gold">
              Galerie
            </p>
            <h2 className="mt-3 font-heading text-3xl text-allure-petrol dark:text-allure-sand sm:text-4xl">
              Pièce par pièce
            </h2>
            <p className="mt-3 font-sans text-sm text-allure-ink/55 dark:text-allure-sand/55">
              Filtrez par pièce, naviguez au clavier ← →
            </p>
          </div>
          {current ? (
            <p className="font-sans text-xs uppercase tracking-[0.16em] text-allure-ink/40 dark:text-allure-sand/40">
              {String(active + 1).padStart(2, "0")} /{" "}
              {String(count).padStart(2, "0")}
              <span className="mx-2 text-allure-gold">·</span>
              {current.alt}
            </p>
          ) : null}
        </div>

        <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Pièces">
          <FilterChip
            active={room === "all"}
            onClick={() => selectRoom("all")}
            label="Toutes"
            count={temoin.gallery.length}
          />
          {temoin.rooms.map((r) => (
            <FilterChip
              key={r.id}
              active={room === r.id}
              onClick={() => selectRoom(r.id)}
              label={r.label}
              count={roomCounts.get(r.id) ?? 0}
            />
          ))}
        </div>

        {current ? (
          <div className="relative mt-8 overflow-hidden rounded-[1.75rem] bg-allure-petrol/5 dark:bg-allure-sand/5">
            <div className="relative aspect-[16/10] min-h-[16rem]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.src}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.99 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <MediaImage
                    src={current.src}
                    alt={current.alt}
                    fill
                    sizes="(min-width: 1024px) 80vw, 100vw"
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-allure-petrol-deep/25 via-transparent to-transparent" />
            </div>

            {count > 1 ? (
              <>
                <NavBtn
                  aria-label="Vue précédente"
                  className="left-3 sm:left-5"
                  onClick={() => go(-1)}
                >
                  <ChevronLeft className="size-5" />
                </NavBtn>
                <NavBtn
                  aria-label="Vue suivante"
                  className="right-3 sm:right-5"
                  onClick={() => go(1)}
                >
                  <ChevronRight className="size-5" />
                </NavBtn>
              </>
            ) : null}
          </div>
        ) : null}

        <div className="mt-5 flex gap-2.5 overflow-x-auto pb-1">
          {filtered.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={img.alt}
              aria-current={i === active}
              className={cn(
                "relative h-20 w-28 shrink-0 overflow-hidden rounded-xl transition duration-300 sm:h-24 sm:w-36",
                i === active
                  ? "ring-2 ring-allure-gold ring-offset-2 ring-offset-white dark:ring-offset-allure-petrol-deep"
                  : "opacity-65 ring-1 ring-allure-petrol/10 hover:opacity-100 dark:ring-allure-sand/15"
              )}
            >
              <MediaImage
                src={img.src}
                alt=""
                fill
                sizes="144px"
                loaderSize="sm"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-sans text-xs uppercase tracking-[0.1em] transition-colors",
        active
          ? "bg-allure-petrol text-white dark:bg-[color-mix(in_oklab,var(--allure-gold)_72%,var(--allure-petrol-deep))] dark:text-allure-petrol-deep"
          : "bg-allure-sand text-allure-ink/55 hover:text-allure-petrol dark:bg-allure-petrol dark:text-allure-sand/55 dark:hover:text-allure-sand"
      )}
    >
      {label}
      <span
        className={cn(
          "rounded-full px-1.5 py-0.5 text-[10px] tabular-nums",
          active ? "bg-white/20" : "bg-allure-petrol/10 dark:bg-white/10"
        )}
      >
        {count}
      </span>
    </button>
  );
}

function NavBtn({
  children,
  className,
  onClick,
  ...props
}: ComponentProps<"button"> & { className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "absolute top-1/2 z-[2] flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-allure-petrol-deep/55 text-white backdrop-blur-md transition hover:border-allure-gold/50 hover:text-allure-gold",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
