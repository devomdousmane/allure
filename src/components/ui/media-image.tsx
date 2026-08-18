"use client";

import { useCallback, useState, type ReactNode } from "react";
import Image, { type ImageProps } from "next/image";
import { MediaLoader } from "@/components/ui/media-loader";
import { cn } from "@/lib/utils";

type MediaImageProps = Omit<ImageProps, "onLoad"> & {
  /** Voile + anneaux pendant le chargement */
  showLoader?: boolean;
  loaderTone?: "gold" | "petrol";
  loaderLabel?: string;
  loaderSize?: "sm" | "md";
  /**
   * Conteneur autour de l’image.
   * En `fill`, défaut `absolute inset-0` pour coller au parent `relative`.
   */
  wrapperClassName?: string;
  /**
   * Overlays (wash, gradient) rendus AU-DESSUS de l’image
   * et EN-DESSOUS du loader — pour que le loader reste visible.
   */
  children?: ReactNode;
  onLoad?: ImageProps["onLoad"];
};

/**
 * `next/image` + `MediaLoader` — évite le vide pendant le fetch,
 * puis fondu d’apparition une fois le média prêt.
 */
export function MediaImage({
  alt,
  className,
  fill,
  quality = 85,
  showLoader = true,
  loaderTone = "petrol",
  loaderLabel,
  loaderSize = "md",
  wrapperClassName,
  children,
  onLoad,
  ...props
}: MediaImageProps) {
  const [loaded, setLoaded] = useState(false);

  const handleLoad = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      setLoaded(true);
      onLoad?.(event);
    },
    [onLoad]
  );

  const loader =
    showLoader && !loaded ? (
      <MediaLoader
        tone={loaderTone}
        label={loaderLabel}
        size={loaderSize}
        className="z-[2]"
      />
    ) : null;

  if (fill) {
    return (
      <div
        className={cn(
          "absolute inset-0 overflow-hidden bg-allure-sand/50 dark:bg-allure-petrol-deep/55",
          wrapperClassName
        )}
      >
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-500 ease-out",
            loaded ? "opacity-100" : "opacity-0"
          )}
        >
          <Image
            alt={alt}
            fill
            quality={quality}
            onLoad={handleLoad}
            className={className}
            {...props}
          />
        </div>
        {children}
        {loader}
      </div>
    );
  }

  return (
    <span
      className={cn(
        "relative inline-block overflow-hidden bg-allure-sand/50 dark:bg-allure-petrol-deep/55",
        wrapperClassName
      )}
    >
      <span
        className={cn(
          "block transition-opacity duration-500 ease-out",
          loaded ? "opacity-100" : "opacity-0"
        )}
      >
        <Image
          alt={alt}
          quality={quality}
          onLoad={handleLoad}
          className={className}
          {...props}
        />
      </span>
      {children}
      {loader}
    </span>
  );
}
