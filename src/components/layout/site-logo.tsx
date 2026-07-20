import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";

type SiteLogoProps = {
  className?: string;
  /** Hauteur visuelle du logo (px CSS) */
  height?: number;
  priority?: boolean;
  href?: string | null;
  /**
   * Force la version claire (argentée) — utile sur hero sombre
   * avant le scroll, quel que soit le thème.
   */
  inverted?: boolean;
};

const LOGO_ASPECT = 890 / 827;

/**
 * Logo Allure — assombri en thème clair, argenté en thème sombre.
 */
export function SiteLogo({
  className,
  height = 40,
  priority = false,
  href = "/",
  inverted = false,
}: SiteLogoProps) {
  const width = Math.round(height * LOGO_ASPECT);

  const image = (
    <>
      {/* Version sombre : thèmes clairs (sauf inverted) */}
      <Image
        src={SITE.logo}
        alt={SITE.name}
        width={width}
        height={height}
        priority={priority}
        className={cn(
          "h-full w-auto",
          inverted ? "hidden" : "dark:hidden"
        )}
        style={{
          filter: "brightness(0) saturate(100%)",
          opacity: 0.9,
        }}
      />
      {/* Version claire / argentée */}
      <Image
        src={SITE.logo}
        alt=""
        width={width}
        height={height}
        aria-hidden
        priority={priority}
        className={cn(
          "h-full w-auto",
          inverted ? "block" : "hidden dark:block"
        )}
      />
    </>
  );

  const classes = cn("inline-flex shrink-0 items-center", className);

  if (href === null) {
    return (
      <span className={classes} style={{ height }}>
        {image}
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-label={`${SITE.name} — Accueil`}
      className={classes}
      style={{ height }}
    >
      {image}
    </Link>
  );
}
