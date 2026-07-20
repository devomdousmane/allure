import Image from "next/image";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
  image?: string;
  className?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  image = "/hero-sequence/frame_024.webp",
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative flex min-h-[52vh] items-end overflow-hidden pb-16 pt-32 lg:min-h-[58vh] lg:pb-20",
        className
      )}
    >
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-allure-petrol-deep via-allure-petrol-deep/55 to-allure-petrol/20" />
      <div className="relative mx-auto w-full max-w-6xl px-6">
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-allure-gold">
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl font-heading text-4xl leading-[1.1] text-white sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-5 max-w-xl font-sans text-sm text-white/75 sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
