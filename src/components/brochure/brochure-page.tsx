"use client";

import { forwardRef, useMemo, type CSSProperties } from "react";
import type { FlipBookPage as FlipBookPageData } from "@/data/flipbook-types";
import { cn } from "@/lib/utils";

const BLEND: Record<string, string> = {
  normal: "normal",
  multiply: "multiply",
  screen: "screen",
  overlay: "overlay",
  "soft-light": "soft-light",
};

type BrochurePageProps = {
  page: FlipBookPageData;
  index: number;
  /** Pages proches du spread courant — eager load */
  eager?: boolean;
  className?: string;
};

/**
 * Page StPageFlip — `forwardRef` obligatoire.
 * Stack de calques prête pour V2 (PNG transparents additionnels).
 */
export const BrochurePage = forwardRef<HTMLDivElement, BrochurePageProps>(
  function BrochurePage({ page, index, eager = false, className }, ref) {
    const layers = useMemo(() => page.layers, [page.layers]);
    const isCover = index === 0;

    return (
      <div
        ref={ref}
        data-brochure-page={page.id}
        data-density={isCover ? "hard" : "soft"}
        className={cn(
          "relative overflow-hidden bg-allure-sand dark:bg-allure-petrol-deep",
          className
        )}
        style={{ width: "100%", height: "100%" }}
      >
        {layers.map((layer) => (
          <div
            key={layer.id}
            data-brochure-layer={layer.id}
            data-parallax={layer.parallax ?? 0}
            className="absolute inset-0 will-change-transform"
            style={{
              mixBlendMode: (BLEND[layer.blend ?? "normal"] ??
                "normal") as CSSProperties["mixBlendMode"],
              opacity: layer.opacity ?? 1,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- page-flip needs plain img for paint */}
            <img
              src={layer.src}
              alt=""
              draggable={false}
              loading={eager ? "eager" : "lazy"}
              decoding="async"
              className="h-full w-full object-cover object-center select-none"
            />
          </div>
        ))}

        <div
          aria-hidden
          data-brochure-layer="light"
          data-parallax="0.35"
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-allure-petrol/20 mix-blend-soft-light dark:from-allure-gold/10 dark:to-allure-petrol-deep/40"
        />

        {page.title ? (
          <p
            data-brochure-title
            className="pointer-events-none absolute inset-x-0 bottom-6 z-[2] px-6 text-center font-heading text-lg text-allure-petrol opacity-0 sm:text-xl dark:text-allure-sand"
          >
            {page.title}
          </p>
        ) : null}
      </div>
    );
  }
);
