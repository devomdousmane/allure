import { cn } from "@/lib/utils";

type SectionSeamProps = {
  /** Couleur de la section précédente — thème clair */
  from?: string;
  /** Couleur de la section précédente — thème sombre */
  fromDark?: string;
  /** Couleur de la section suivante — thème clair (fondu du bas) */
  to?: string;
  /** Couleur de la section suivante — thème sombre */
  toDark?: string;
  /** Quels bords dessiner */
  edges?: "top" | "bottom" | "both";
  className?: string;
};

/**
 * Fondu en haut / bas d’une section pour adoucir la jointure avec ses voisines.
 * z-[3] pour rester AU-DESSUS des fonds photo / overlays (z-0).
 * Deux calques par bord (clair / sombre) car les couleurs inline ne suivent pas `dark:`.
 */
export function SectionSeam({
  from,
  fromDark,
  to,
  toDark,
  edges = "both",
  className,
}: SectionSeamProps) {
  const showTop = edges !== "bottom" && Boolean(from && fromDark);
  const showBottom = edges !== "top" && Boolean(to);

  return (
    <>
      {showTop ? (
        <>
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-x-0 top-0 z-[3] h-20 sm:h-28 dark:hidden",
              className
            )}
            style={{
              background: `linear-gradient(to bottom, ${from} 0%, color-mix(in oklab, ${from} 55%, transparent) 48%, transparent 100%)`,
            }}
          />
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-x-0 top-0 z-[3] hidden h-20 sm:h-28 dark:block",
              className
            )}
            style={{
              background: `linear-gradient(to bottom, ${fromDark} 0%, color-mix(in oklab, ${fromDark} 55%, transparent) 48%, transparent 100%)`,
            }}
          />
        </>
      ) : null}

      {showBottom && to ? (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-24 sm:h-32 dark:hidden",
            className
          )}
          style={{
            background: `linear-gradient(to top, ${to} 0%, color-mix(in oklab, ${to} 65%, transparent) 40%, color-mix(in oklab, ${to} 20%, transparent) 75%, transparent 100%)`,
          }}
        />
      ) : null}
      {showBottom && toDark ? (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 z-[3] hidden h-24 sm:h-32 dark:block",
            className
          )}
          style={{
            background: `linear-gradient(to top, ${toDark} 0%, color-mix(in oklab, ${toDark} 65%, transparent) 40%, color-mix(in oklab, ${toDark} 20%, transparent) 75%, transparent 100%)`,
          }}
        />
      ) : null}
    </>
  );
}

type HeroExitFadeProps = {
  /** Couleur de la section suivante — clair */
  to: string;
  /** Couleur de la section suivante — sombre */
  toDark: string;
  className?: string;
  /** Plus court — hero cinématique, pour laisser voir le bâtiment. */
  compact?: boolean;
};

/**
 * Fondu bas des heroes / sections photo — calques clair/sombre séparés.
 * Clair : courbe plus courte et opaque seulement près du bord (évite le voile laiteux).
 */
export function HeroExitFade({
  to,
  toDark,
  className,
  compact = false,
}: HeroExitFadeProps) {
  const lightH = compact
    ? "h-[12%] min-h-14 sm:min-h-16"
    : "h-[18%] min-h-20 sm:min-h-24";
  const darkH = compact
    ? "h-[14%] min-h-16 sm:min-h-20"
    : "h-[22%] min-h-24 sm:min-h-32";

  return (
    <>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 z-[3] dark:hidden",
          lightH,
          className
        )}
        style={{
          background: `linear-gradient(to top, ${to} 0%, color-mix(in oklab, ${to} 78%, transparent) 28%, color-mix(in oklab, ${to} 22%, transparent) 58%, transparent 100%)`,
        }}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 z-[3] hidden dark:block",
          darkH,
          className
        )}
        style={{
          background: `linear-gradient(to top, ${toDark} 0%, color-mix(in oklab, ${toDark} 72%, transparent) 38%, color-mix(in oklab, ${toDark} 28%, transparent) 72%, transparent 100%)`,
        }}
      />
    </>
  );
}

/** Tokens fréquents pour les jonctions */
export const SEAM = {
  white: "#ffffff",
  sand: "var(--allure-sand)",
  petrol: "var(--allure-petrol)",
  petrolDeep: "var(--allure-petrol-deep)",
} as const;
