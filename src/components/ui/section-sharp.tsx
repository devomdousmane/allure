import { cn } from "@/lib/utils";

export type SharpEdge = "top" | "bottom";
export type SharpVariant = "chevron" | "angle" | "fold";

type SectionSharpProps = {
  /** `bottom` = sharp bas (section du haut) ; `top` = sharp haut (section du bas) */
  edge: SharpEdge;
  /**
   * Remplissage = couleur de la section VOISINE
   * (bas → section suivante ; haut → section précédente).
   * Passer `transparent` pour un filet or seul (idéal sharp haut en thème clair).
   */
  fill?: string;
  fillDark?: string;
  variant?: SharpVariant;
  /** Fine ligne or le long de la coupe */
  accent?: boolean;
  /**
   * `fill` = forme pleine (défaut, sharp bas).
   * `line` = filet or seul, sans fill opaque (sharp haut thème clair).
   */
  mode?: "fill" | "line";
  className?: string;
};

/**
 * Chemins SVG (viewBox 0 0 100 12).
 * Bottom : la couleur voisine remonte en pointe dans la section du haut.
 * Top : coupe miroir — en mode `line`, seul le filet or est dessiné.
 */
const PATHS: Record<
  SharpVariant,
  { top: string; bottom: string; accentTop: string; accentBottom: string }
> = {
  chevron: {
    bottom: "M0,12 L0,7 L50,0 L100,7 L100,12 Z",
    top: "M0,0 L50,8 L100,0 L100,2.2 L50,10 L0,2.2 Z",
    accentBottom: "M0,7 L50,0 L100,7",
    accentTop: "M0,0 L50,8 L100,0",
  },
  angle: {
    bottom: "M0,12 L0,4 L100,0 L100,12 Z",
    top: "M0,0 L100,0 L0,12 Z",
    accentBottom: "M0,4 L100,0",
    accentTop: "M0,0 L0,12 L100,0",
  },
  fold: {
    bottom: "M0,12 L0,3 L32,8 L68,0 L100,5 L100,12 Z",
    top: "M0,0 L32,9 L68,1 L100,8 L100,0 Z",
    accentBottom: "M0,3 L32,8 L68,0 L100,5",
    accentTop: "M0,0 L32,9 L68,1 L100,8",
  },
};

/**
 * Découpe géométrique de jonction entre deux sections.
 * Clair / sombre : deux calques SVG (les fills inline ne suivent pas `dark:`).
 */
export function SectionSharp({
  edge,
  fill = SHARP.white,
  fillDark = SHARP.petrolDeep,
  variant = "chevron",
  accent = true,
  mode = "fill",
  className,
}: SectionSharpProps) {
  const paths = PATHS[variant];
  const d = edge === "bottom" ? paths.bottom : paths.top;
  const accentD = edge === "bottom" ? paths.accentBottom : paths.accentTop;
  const showFill = mode === "fill";
  const showAccent = accent || mode === "line";

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 z-[3] h-10 w-full sm:h-12 lg:h-[3.25rem]",
        edge === "bottom" ? "bottom-0" : "top-0",
        className
      )}
    >
      {/* Thème clair */}
      <svg
        className="absolute inset-0 h-full w-full dark:hidden"
        viewBox="0 0 100 12"
        preserveAspectRatio="none"
      >
        {showFill ? <path d={d} style={{ fill }} /> : null}
        {showAccent ? (
          <path
            d={accentD}
            fill="none"
            stroke="var(--allure-gold)"
            strokeWidth={mode === "line" ? "0.55" : "0.4"}
            strokeOpacity={mode === "line" ? "0.7" : "0.45"}
            vectorEffect="non-scaling-stroke"
          />
        ) : null}
      </svg>

      {/* Thème sombre */}
      <svg
        className="absolute inset-0 hidden h-full w-full dark:block"
        viewBox="0 0 100 12"
        preserveAspectRatio="none"
      >
        {showFill ? <path d={d} style={{ fill: fillDark }} /> : null}
        {showAccent ? (
          <path
            d={accentD}
            fill="none"
            stroke="var(--allure-gold)"
            strokeWidth={mode === "line" ? "0.55" : "0.4"}
            strokeOpacity={mode === "line" ? "0.55" : "0.35"}
            vectorEffect="non-scaling-stroke"
          />
        ) : null}
      </svg>
    </div>
  );
}

/** Tokens de fill fréquents */
export const SHARP = {
  white: "#ffffff",
  sand: "var(--allure-sand)",
  petrol: "var(--allure-petrol)",
  petrolDeep: "var(--allure-petrol-deep)",
} as const;
