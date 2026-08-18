import { MediaImage } from "@/components/ui/media-image";
import { OrbitAnnulus } from "@/components/motion/orbit-annulus";
import type { JourneyPanelConfig, ThemeJoin } from "./journey-data";
import { JOURNEY_COLORS } from "./journey-data";

type PanelShellProps = {
  panel: JourneyPanelConfig;
  children?: React.ReactNode;
};

function ThemeFill({ color }: { color: ThemeJoin }) {
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-0 z-0 dark:hidden"
        style={{ backgroundColor: color.light }}
      />
      <div
        aria-hidden
        className="absolute inset-0 z-0 hidden dark:block"
        style={{ backgroundColor: color.dark }}
      />
    </>
  );
}

/**
 * Fondu latéral — soft, ~12 %.
 * Jointures sable / blanc en clair, pétrole en sombre.
 */
function JoinFade({
  side,
  color,
}: {
  side: "left" | "right";
  color: ThemeJoin;
}) {
  const isLeft = side === "left";
  const gradient = (c: string) =>
    isLeft
      ? `linear-gradient(90deg, color-mix(in oklab, ${c} 55%, transparent) 0%, color-mix(in oklab, ${c} 22%, transparent) 48%, transparent 100%)`
      : `linear-gradient(270deg, color-mix(in oklab, ${c} 55%, transparent) 0%, color-mix(in oklab, ${c} 22%, transparent) 48%, transparent 100%)`;

  return (
    <>
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 z-[2] w-[12%] dark:hidden ${isLeft ? "left-0" : "right-0"}`}
        style={{ background: gradient(color.light) }}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 z-[2] hidden w-[12%] dark:block ${isLeft ? "left-0" : "right-0"}`}
        style={{ background: gradient(color.dark) }}
      />
    </>
  );
}

/** Sortie bas — dernier panel uniquement, douce. */
function ExitFade({ color }: { color: ThemeJoin }) {
  const gradient = (c: string) =>
    `linear-gradient(to top, ${c} 0%, color-mix(in oklab, ${c} 55%, transparent) 32%, color-mix(in oklab, ${c} 18%, transparent) 68%, transparent 100%)`;

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-28 sm:h-36 dark:hidden"
        style={{ background: gradient(color.light) }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] hidden h-28 sm:h-36 dark:block"
        style={{ background: gradient(color.dark) }}
      />
    </>
  );
}

/** Coquille : image + wash thème + jointures cinéma + titre. */
export function PanelShell({ panel, children }: PanelShellProps) {
  const reveal =
    panel.id === "facade" ? "wipe-y" : panel.id === "livraison" ? "iris" : "none";

  return (
    <article
      data-journey-panel
      data-journey-id={panel.id}
      data-reveal={reveal}
      className="relative h-full min-h-0 w-full shrink-0 overflow-hidden"
    >
      <ThemeFill color={panel.bg} />
      {/* Média clipé (wipe / iris scrubbés) — joins & copy restent hors clip */}
      <div
        data-journey-media
        className="absolute inset-0 z-0 overflow-hidden will-change-[clip-path]"
        style={
          reveal === "wipe-y"
            ? { clipPath: "inset(0% 0% 100% 0%)" }
            : reveal === "iris"
              ? { clipPath: "circle(0% at 50% 50%)" }
              : undefined
        }
      >
        <MediaImage
          src={panel.image}
          alt={panel.imageAlt}
          fill
          sizes="100vw"
          quality={85}
          loaderTone="gold"
          loaderSize="md"
          priority={panel.id === "chantier"}
          className="object-cover"
          style={{ objectPosition: panel.objectPosition }}
        />

        {/* Wash thème — teinte sans blanchir les jointures */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] dark:hidden"
          style={{
            backgroundColor: JOURNEY_COLORS.wash.light,
            opacity: JOURNEY_COLORS.wash.opacityLight,
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] hidden dark:block"
          style={{
            backgroundColor: JOURNEY_COLORS.wash.dark,
            opacity: JOURNEY_COLORS.wash.opacityDark,
          }}
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] dark:hidden"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklab, var(--allure-sand) 58%, transparent) 0%, transparent 34%, transparent 56%, color-mix(in oklab, var(--allure-sand) 52%, transparent) 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] hidden dark:block"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklab, var(--allure-petrol-deep) 40%, transparent) 0%, transparent 32%, transparent 58%, color-mix(in oklab, var(--allure-petrol-deep) 38%, transparent) 100%)",
          }}
        />
      </div>

      <JoinFade side="left" color={panel.joinLeft} />
      <JoinFade side="right" color={panel.joinRight} />

      {/* Anneaux stratégiques — scrub via useHorizonScroll */}
      {panel.orbits.map((orbit, i) => (
        <div
          key={`${panel.id}-orbit-${i}`}
          data-journey-orbit
          data-orbit-variant={orbit.variant}
          className={`pointer-events-none absolute z-[3] ${orbit.position} ${
            orbit.variant === "ghost" ? "opacity-70" : ""
          }`}
        >
          <OrbitAnnulus label={orbit.label} sizeClass={orbit.size} />
        </div>
      ))}

      {panel.id === "livraison" ? (
        <ExitFade color={JOURNEY_COLORS.exit} />
      ) : null}

      <div
        data-journey-copy
        className="absolute inset-x-0 top-[22%] z-10 px-6 text-center sm:top-[26%]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-44 w-[min(100%,38rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-allure-sand/80 blur-3xl dark:hidden"
        />
        <p className="relative font-sans text-[10px] uppercase tracking-[0.4em] text-allure-gold sm:text-xs">
          {panel.phase}
        </p>
        <h2 className="relative mt-3 font-heading text-3xl text-allure-petrol sm:text-4xl lg:text-5xl dark:text-allure-sand">
          {panel.headline}
        </h2>
        <p className="relative mx-auto mt-3 max-w-md font-sans text-sm text-allure-ink/65 dark:text-allure-sand/65">
          {panel.sub}
        </p>
      </div>
      {children}
    </article>
  );
}
