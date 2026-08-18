import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type HomeCtaLink = {
  label: string;
  href: string;
};

type HomeCtaRowProps = {
  primary: HomeCtaLink;
  secondary?: HomeCtaLink;
  tertiary?: HomeCtaLink;
  className?: string;
  align?: "center" | "start";
};

/**
 * Rangée CTA home — capsule 3D, conversion visite / témoins / parcours.
 */
export function HomeCtaRow({
  primary,
  secondary,
  tertiary,
  className,
  align = "center",
}: HomeCtaRowProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:flex-wrap",
        align === "center" && "items-center justify-center",
        align === "start" && "items-stretch sm:items-center sm:justify-start",
        className
      )}
    >
      <Button asChild size="lg" className="btn-cta">
        <Link href={primary.href}>{primary.label}</Link>
      </Button>
      {secondary ? (
        <Button asChild size="lg" className="btn-cta-outline">
          <Link href={secondary.href}>{secondary.label}</Link>
        </Button>
      ) : null}
      {tertiary ? (
        <Button
          asChild
          variant="ghost"
          size="lg"
          className="rounded-full text-allure-petrol dark:text-allure-sand"
        >
          <Link href={tertiary.href}>{tertiary.label}</Link>
        </Button>
      ) : null}
    </div>
  );
}
