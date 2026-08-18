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
   * Force la version sombre (argentée) — utile sur hero sombre
   * avant le scroll, quel que soit le thème.
   */
  inverted?: boolean;
};

/** Lockups carrés — padding interne JPEG d’origine */
const LOGO_ASPECT = 1;
/** Zoom pour densifier le monogramme dans le header */
const LOGO_CROP_SCALE = 1.35;

/**
 * Logo Allure — WebP transparent (clair / sombre), s’adapte au thème.
 */
export function SiteLogo({
  className,
  height = 56,
  priority = false,
  href = "/",
  inverted = false,
}: SiteLogoProps) {
  const width = Math.round(height * LOGO_ASPECT);
  const imgSize = Math.round(height * LOGO_CROP_SCALE);

  const image = (
    <span
      className="relative block overflow-hidden"
      style={{ height, width }}
    >
      <Image
        src={SITE.logoLight}
        alt={SITE.name}
        width={imgSize}
        height={imgSize}
        priority={priority}
        className={cn(
          "absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2 object-contain",
          inverted ? "hidden" : "dark:hidden"
        )}
        style={{ width: imgSize, height: imgSize }}
      />
      <Image
        src={SITE.logoDark}
        alt=""
        width={imgSize}
        height={imgSize}
        aria-hidden
        priority={priority}
        className={cn(
          "absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2 object-contain",
          inverted ? "block" : "hidden dark:block"
        )}
        style={{ width: imgSize, height: imgSize }}
      />
    </span>
  );

  const classes = cn("inline-flex shrink-0 items-center", className);

  if (href === null) {
    return <span className={classes}>{image}</span>;
  }

  return (
    <Link
      href={href}
      aria-label={`${SITE.name} — Accueil`}
      className={classes}
    >
      {image}
    </Link>
  );
}
