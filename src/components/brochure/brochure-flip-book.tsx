"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { BrochurePage } from "@/components/brochure/brochure-page";
import { BrochureLight } from "@/components/brochure/brochure-light";
import { BrochureParticles } from "@/components/brochure/brochure-particles";
import { useBrochureGsap } from "@/components/brochure/use-brochure-gsap";
import { MediaLoader } from "@/components/ui/media-loader";
import { useLenis } from "@/components/layout/smooth-scroll-provider";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import {
  BROCHURE,
  BROCHURE_PDF,
} from "@/data/apartments/brochure-manifest";
import type { FlipBookData } from "@/data/flipbook-types";
import { cn } from "@/lib/utils";

const HTMLFlipBook = dynamic(
  () => import("react-pageflip").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="relative mx-auto aspect-[2200/1588] w-full max-w-[min(92vw,920px)] overflow-hidden rounded-sm bg-allure-sand/60 dark:bg-allure-petrol-deep/60">
        <MediaLoader tone="petrol" label="Chargement du livre" />
      </div>
    ),
  }
);

const MOBILE_BREAKPOINT = 768;

type BrochureFlipBookProps = {
  className?: string;
  book?: FlipBookData;
  pdfHref?: string;
};

export function BrochureFlipBook({
  className,
  book = BROCHURE,
  pdfHref = BROCHURE_PDF,
}: BrochureFlipBookProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<{
    pageFlip: () => {
      flipNext: () => void;
      flipPrev: () => void;
      turnToPage: (page: number) => void;
      getCurrentPageIndex: () => number;
      getPageCount: () => number;
    };
  } | null>(null);

  const lenis = useLenis();
  const reduced = usePrefersReducedMotion();
  const [pageIndex, setPageIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [dims, setDims] = useState({ width: 460, height: 332 });
  const [isMobile, setIsMobile] = useState(false);

  const aspect = book.pageWidth / book.pageHeight;
  const pageCount = book.pages.length;

  useBrochureGsap({ rootRef, pageIndex });

  const measure = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const maxW = Math.min(root.clientWidth, 920);
    const mobile = window.innerWidth < MOBILE_BREAKPOINT;
    setIsMobile(mobile);

    if (mobile) {
      const width = Math.max(280, Math.floor(maxW * 0.96));
      const height = Math.floor(width / aspect);
      setDims({ width, height });
    } else {
      const spreadW = Math.max(480, Math.floor(maxW));
      const pageW = Math.floor(spreadW / 2);
      const height = Math.floor(pageW / aspect);
      setDims({ width: pageW, height });
    }
  }, [aspect]);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (rootRef.current) ro.observe(rootRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !lenis) return;

    const stop = () => lenis.stop();
    const start = () => lenis.start();

    root.addEventListener("pointerdown", stop);
    root.addEventListener("pointerup", start);
    root.addEventListener("pointerleave", start);
    root.addEventListener("pointercancel", start);

    return () => {
      root.removeEventListener("pointerdown", stop);
      root.removeEventListener("pointerup", start);
      root.removeEventListener("pointerleave", start);
      root.removeEventListener("pointercancel", start);
      lenis.start();
    };
  }, [lenis]);

  const onFlip = useCallback((e: { data: number }) => {
    setPageIndex(typeof e.data === "number" ? e.data : 0);
  }, []);

  const onInit = useCallback(() => {
    setReady(true);
  }, []);

  const flipPrev = () => {
    try {
      bookRef.current?.pageFlip()?.flipPrev();
    } catch {
      /* ignore */
    }
  };

  const flipNext = () => {
    try {
      bookRef.current?.pageFlip()?.flipNext();
    } catch {
      /* ignore */
    }
  };

  const displayPage = useMemo(() => {
    return Math.min(pageIndex + 1, pageCount);
  }, [pageIndex, pageCount]);

  const eagerSet = useMemo(() => {
    const set = new Set<number>();
    for (
      let i = Math.max(0, pageIndex - 1);
      i <= Math.min(pageCount - 1, pageIndex + 2);
      i++
    ) {
      set.add(i);
    }
    return set;
  }, [pageIndex, pageCount]);

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      <BrochureLight />
      <BrochureParticles active={ready && reduced === false} density={0.85} />

      <div
        data-brochure-stage
        className="relative z-[2] mx-auto flex w-full max-w-[960px] flex-col items-center"
      >
        <div
          className="relative w-full overflow-hidden rounded-sm shadow-[0_24px_60px_-28px_rgba(30,75,93,0.45)] dark:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.55)]"
          style={{ minHeight: dims.height }}
        >
          {!ready ? (
            <div
              className="absolute inset-0 z-[4]"
              style={{ minHeight: dims.height }}
            >
              <MediaLoader tone="petrol" label="Chargement du livre" />
            </div>
          ) : null}

          <HTMLFlipBook
            ref={bookRef}
            className="brochure-flipbook mx-auto"
            style={{ margin: "0 auto" }}
            width={dims.width}
            height={dims.height}
            size="stretch"
            minWidth={280}
            maxWidth={isMobile ? 520 : 520}
            minHeight={200}
            maxHeight={720}
            drawShadow
            flippingTime={reduced ? 0 : 900}
            usePortrait={isMobile}
            startZIndex={2}
            autoSize
            maxShadowOpacity={0.45}
            showCover={false}
            mobileScrollSupport
            clickEventForward
            useMouseEvents={reduced !== true}
            swipeDistance={40}
            showPageCorners={reduced !== true}
            disableFlipByClick={false}
            startPage={0}
            onFlip={onFlip}
            onInit={onInit}
          >
            {book.pages.map((page, i) => (
              <BrochurePage
                key={page.id}
                page={page}
                index={i}
                eager={eagerSet.has(i)}
              />
            ))}
          </HTMLFlipBook>
        </div>

        <div className="relative z-[3] mt-8 flex w-full max-w-lg flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={flipPrev}
              disabled={pageIndex <= 0}
              aria-label="Page précédente"
              className="inline-flex size-10 items-center justify-center rounded-full border border-allure-petrol/15 text-allure-petrol transition hover:border-allure-gold/50 hover:text-allure-gold disabled:opacity-30 dark:border-allure-sand/20 dark:text-allure-sand"
            >
              <ChevronLeft className="size-4" />
            </button>
            <p
              aria-live="polite"
              className="min-w-[7rem] text-center font-sans text-xs uppercase tracking-[0.2em] text-allure-ink/50 dark:text-allure-sand/50"
            >
              {displayPage} / {pageCount}
            </p>
            <button
              type="button"
              onClick={flipNext}
              disabled={pageIndex >= pageCount - 1}
              aria-label="Page suivante"
              className="inline-flex size-10 items-center justify-center rounded-full border border-allure-petrol/15 text-allure-petrol transition hover:border-allure-gold/50 hover:text-allure-gold disabled:opacity-30 dark:border-allure-sand/20 dark:text-allure-sand"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          <Link
            href={pdfHref}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.18em] text-allure-petrol/70 transition hover:text-allure-gold dark:text-allure-sand/70"
          >
            <Download className="size-3.5" />
            Télécharger le PDF
          </Link>
        </div>
      </div>
    </div>
  );
}
