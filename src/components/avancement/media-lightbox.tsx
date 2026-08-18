"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import type { AvancementImage } from "@/lib/avancement";
import { cn } from "@/lib/utils";

type MediaLightboxProps = {
  images: AvancementImage[];
  index: number;
  open: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

export function MediaLightbox({
  images,
  index,
  open,
  onClose,
  onIndexChange,
}: MediaLightboxProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const stripRef = useRef<HTMLUListElement>(null);
  const reduced = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const count = images.length;
  const current = images[index];

  const go = useCallback(
    (delta: number) => {
      if (count < 1) return;
      onIndexChange((index + delta + count) % count);
    },
    [count, index, onIndexChange]
  );

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);

      if (e.key === "Tab" && dialogRef.current) {
        const focusables = [
          ...dialogRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], iframe, [tabindex]:not([tabindex="-1"])'
          ),
        ];
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, go]);

  useEffect(() => {
    if (!open || !stripRef.current) return;
    const active = stripRef.current.querySelector<HTMLElement>(
      '[aria-current="true"]'
    );
    active?.scrollIntoView({
      behavior: reduced === true ? "auto" : "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [index, open, reduced]);

  if (!mounted || !open || !current) return null;

  const soft = reduced === true;

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className={cn(
        "fixed inset-0 z-[80] flex flex-col bg-allure-petrol-deep/94",
        !soft && "transition-opacity duration-200"
      )}
      onClick={onClose}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-8">
        <p
          id={titleId}
          className="min-w-0 truncate font-sans text-xs tracking-[0.08em] text-white/80 sm:text-sm"
        >
          {current.alt}
        </p>
        <div className="flex shrink-0 items-center gap-3">
          <p className="hidden font-sans text-[10px] tabular-nums tracking-[0.22em] text-white/55 sm:block">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(count).padStart(2, "0")}
          </p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-allure-gold"
            aria-label="Fermer"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-16">
        {count > 1 ? (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              className="absolute left-2 z-10 inline-flex size-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-allure-gold sm:left-6"
              aria-label="Image précédente"
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              className="absolute right-2 z-10 inline-flex size-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-allure-gold sm:right-6"
              aria-label="Image suivante"
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
          </>
        ) : null}

        <div
          className="relative h-full max-h-[min(68vh,720px)] w-full max-w-5xl"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e: ReactKeyboardEvent) => e.stopPropagation()}
        >
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt}
            fill
            sizes="(min-width: 1024px) 64vw, 100vw"
            className={cn(
              "object-contain",
              !soft && "animate-in fade-in duration-300"
            )}
            priority
          />
        </div>
      </div>

      {count > 1 ? (
        <div
          className="border-t border-white/10 px-4 py-4 sm:px-8"
          onClick={(e) => e.stopPropagation()}
        >
          <ul
            ref={stripRef}
            className="mx-auto flex max-w-5xl gap-2 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {images.map((img, i) => (
              <li key={img.src} className="shrink-0">
                <button
                  type="button"
                  aria-label={img.alt}
                  aria-current={i === index ? "true" : undefined}
                  onClick={() => onIndexChange(i)}
                  className={cn(
                    "relative block aspect-[4/3] w-[4.5rem] cursor-pointer overflow-hidden transition-opacity duration-200 sm:w-24",
                    i === index
                      ? "opacity-100 ring-1 ring-allure-gold ring-offset-2 ring-offset-allure-petrol-deep"
                      : "opacity-45 hover:opacity-85"
                  )}
                >
                  <Image
                    src={img.src}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="pb-6 text-center font-sans text-xs tabular-nums tracking-[0.2em] text-white/55 sm:hidden">
          {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </p>
      )}
    </div>,
    document.body
  );
}
