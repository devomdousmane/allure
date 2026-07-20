"use client";

import { useState, type FormEvent, type SVGProps } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SectionSeam, SEAM } from "@/components/ui/section-seam";
import { NAV_LINKS } from "@/lib/nav";
import { SITE } from "@/lib/site";

/** Ciel / nuages — ton doux aligné pétrole & or Allure */
const FOOTER_BG =
  "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1920&q=80";

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TwitterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.4 3H23l-6.8 7.77L24 21h-6.68l-5.23-6.63L5.9 21H3.3l7.3-8.35L2.7 3h6.85l4.73 6.06L20.4 3Zm-1.16 16.17h1.44L7.83 4.75H6.28l12.96 14.42Z" />
    </svg>
  );
}

const SOCIAL_ICONS = {
  Facebook: FacebookIcon,
  Instagram: InstagramIcon,
  Twitter: TwitterIcon,
} as const;

export function SiteFooter() {
  const [status, setStatus] = useState<"idle" | "ok">("idle");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("ok");
    e.currentTarget.reset();
  }

  return (
    <footer className="relative overflow-hidden">
      <Image
        src={FOOTER_BG}
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center"
        priority={false}
      />

      {/* Clair : voile sable translucide — sombre : pétrole profond */}
      <div className="absolute inset-0 bg-allure-sand/88 dark:hidden" />
      <div className="absolute inset-0 hidden bg-allure-petrol-deep/90 dark:block" />
      <div className="absolute inset-0 bg-gradient-to-b from-allure-sand/50 via-transparent to-allure-sand dark:from-allure-petrol-deep/60 dark:via-transparent dark:to-black/50" />

      <SectionSeam from={SEAM.white} fromDark={SEAM.petrolDeep} />

      <div className="relative z-[2]">
        {/* Newsletter */}
        <div className="mx-auto max-w-2xl px-6 pb-16 pt-20 text-center lg:pb-20 lg:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
          >
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-allure-gold">
              Rester informé
            </p>
            <h2 className="mt-4 font-heading text-3xl text-allure-petrol sm:text-4xl dark:text-allure-sand">
              Recevez l&rsquo;avancement & les disponibilités
            </h2>
            <p className="mt-3 font-sans text-sm text-allure-ink/60 dark:text-allure-sand/65">
              Une newsletter discrète pour le chantier, les visites et les
              nouveautés Allure.
            </p>

            <form
              onSubmit={onSubmit}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <Input
                type="email"
                name="email"
                required
                placeholder="Votre email"
                className="h-12 border-allure-petrol/15 bg-white text-allure-ink placeholder:text-allure-ink/40 dark:border-allure-sand/20 dark:bg-white/10 dark:text-allure-sand dark:placeholder:text-allure-sand/40"
              />
              <Button
                type="submit"
                size="lg"
                className="h-12 shrink-0 rounded-full bg-allure-petrol text-white hover:bg-allure-petrol-deep dark:bg-allure-gold dark:text-allure-petrol-deep dark:hover:bg-allure-gold/90"
              >
                S&rsquo;inscrire
              </Button>
            </form>
            {status === "ok" && (
              <p className="mt-3 font-sans text-xs text-allure-petrol dark:text-allure-gold">
                Merci — nous vous tiendrons informé.
              </p>
            )}
          </motion.div>
        </div>

        {/* Liens & contact */}
        <div className="mx-auto max-w-6xl border-t border-allure-petrol/10 px-6 py-14 dark:border-allure-sand/10">
          <div className="grid grid-cols-1 gap-12 text-center sm:grid-cols-3 sm:text-left">
            <div className="flex flex-col items-center sm:items-start">
              <p className="font-heading text-lg tracking-[0.15em] text-allure-petrol dark:text-allure-sand">
                ALLURE
              </p>
              <p className="mt-4 max-w-xs font-sans text-sm text-allure-ink/60 dark:text-allure-sand/60 sm:mx-0 mx-auto">
                {SITE.address} — un programme immobilier de standing signé
                Allure.
              </p>
            </div>

            <div className="flex flex-col items-center sm:items-start">
              <p className="font-sans text-xs uppercase tracking-[0.2em] text-allure-ink/40 dark:text-allure-sand/40">
                Navigation
              </p>
              <ul className="mt-4 flex flex-col items-center gap-3 sm:items-start">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-sans text-sm text-allure-ink/70 transition-colors hover:text-allure-petrol dark:text-allure-sand/70 dark:hover:text-allure-gold"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col items-center sm:items-start">
              <p className="font-sans text-xs uppercase tracking-[0.2em] text-allure-ink/40 dark:text-allure-sand/40">
                Contact
              </p>
              <ul className="mt-4 flex flex-col items-center gap-3 font-sans text-sm text-allure-ink/70 sm:items-start dark:text-allure-sand/70">
                <li>
                  <a
                    href={SITE.phoneHref}
                    className="transition-colors hover:text-allure-petrol dark:hover:text-allure-gold"
                  >
                    {SITE.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={SITE.emailHref}
                    className="transition-colors hover:text-allure-petrol dark:hover:text-allure-gold"
                  >
                    {SITE.email}
                  </a>
                </li>
              </ul>
              <div className="mt-5 flex justify-center gap-4 sm:justify-start">
                {SITE.socials.map((social) => {
                  const Icon =
                    SOCIAL_ICONS[social.label as keyof typeof SOCIAL_ICONS];
                  if (!Icon) return null;
                  return (
                    <Link
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="text-allure-ink/45 transition-colors hover:text-allure-petrol dark:text-allure-sand/45 dark:hover:text-allure-gold"
                    >
                      <Icon className="h-4 w-4" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-14 border-t border-allure-petrol/10 pt-6 text-center font-sans text-xs text-allure-ink/40 dark:border-allure-sand/10 dark:text-allure-sand/40 sm:text-left">
            © {new Date().getFullYear()} {SITE.name}. Tous droits réservés.
          </div>
        </div>

        <div className="overflow-hidden">
          <p
            aria-hidden
            className="select-none whitespace-nowrap pb-2 text-center font-heading font-bold leading-none tracking-tight text-allure-petrol/15 dark:text-allure-sand/12"
            style={{ fontSize: "clamp(5rem, 20vw, 16rem)" }}
          >
            ALLURE
          </p>
        </div>
      </div>
    </footer>
  );
}
