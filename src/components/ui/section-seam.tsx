import { cn } from "@/lib/utils";

type SectionSeamProps = {
  /** Couleur de la section précédente — thème clair */
  from: string;
  /** Couleur de la section précédente — thème sombre */
  fromDark: string;
  className?: string;
};

/**
 * Fondu en haut d’une section pour adoucir la jointure avec la précédente.
 * Deux calques (clair / sombre) car les couleurs inline ne suivent pas `dark:`.
 */
export function SectionSeam({ from, fromDark, className }: SectionSeamProps) {
  return (
    <>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 z-[1] h-16 sm:h-20 dark:hidden",
          className
        )}
        style={{
          background: `linear-gradient(to bottom, ${from} 0%, color-mix(in oklab, ${from} 55%, transparent) 45%, transparent 100%)`,
        }}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 z-[1] hidden h-16 sm:h-20 dark:block",
          className
        )}
        style={{
          background: `linear-gradient(to bottom, ${fromDark} 0%, color-mix(in oklab, ${fromDark} 55%, transparent) 45%, transparent 100%)`,
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
