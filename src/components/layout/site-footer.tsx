"use client";

import { useState, type FormEvent, type SVGProps } from "react";
import { MediaImage } from "@/components/ui/media-image";
import Link from "next/link";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SectionSeam, SEAM } from "@/components/ui/section-seam";
import { NAV_LINKS, BOOK_LINKS, HOME_ANCHORS } from "@/lib/nav";
import { LEGAL_LINKS } from "@/lib/legal";
import { SITE } from "@/lib/site";
import { useCookieConsentOptional } from "@/components/legal/cookie-consent-provider";

/** Ciel / nuages — ton doux aligné pétrole & or Allure */
const FOOTER_BG = "/Allure/DJI_0250.webp";

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
  const cookies = useCookieConsentOptional();
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();
    const company = String(data.get("company") ?? "").trim();

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company }),
      });
      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { error?: string };
        setStatus("error");
        setErrorMessage(
          json.error ?? "Impossible d’enregistrer votre email. Réessayez."
        );
        return;
      }
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMessage("Vérifiez votre connexion, puis réessayez.");
    }
  }

  return (
    <footer className="relative overflow-hidden">
      <MediaImage
        src={FOOTER_BG}
        alt=""
        fill
        sizes="100vw"
        loaderSize="md"
        className="object-cover object-center"
        priority={false}
      >
        {/* Clair : voile sable translucide — sombre : pétrole profond */}
        <div className="absolute inset-0 bg-allure-sand/88 dark:hidden" />
        <div className="absolute inset-0 hidden bg-allure-petrol-deep/90 dark:block" />
        <div className="absolute inset-0 bg-gradient-to-b from-allure-sand/50 via-transparent to-allure-sand dark:from-allure-petrol-deep/60 dark:via-transparent dark:to-black/50" />
      </MediaImage>

      <SectionSeam
        edges="top"
        from={SEAM.white}
        fromDark={SEAM.petrolDeep}
      />

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
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
                aria-hidden
              />
              <Input
                type="email"
                name="email"
                required
                placeholder="Votre email"
                disabled={status === "loading"}
                className="border-allure-petrol/15 bg-white text-allure-ink placeholder:text-allure-ink/40 dark:border-allure-sand/20 dark:bg-white/10 dark:text-allure-sand dark:placeholder:text-allure-sand/40"
              />
              <Button
                type="submit"
                size="lg"
                disabled={status === "loading"}
                className="btn-cta shrink-0"
              >
                {status === "loading" ? "Envoi…" : "S’inscrire"}
              </Button>
            </form>
            {status === "ok" && (
              <p className="mt-3 font-sans text-xs text-allure-petrol dark:text-allure-gold">
                Merci — nous vous tiendrons informé.
              </p>
            )}
            {status === "error" && (
              <p className="mt-3 font-sans text-xs text-red-700 dark:text-red-300">
                {errorMessage}
              </p>
            )}
          </motion.div>
        </div>

        {/* Liens & contact */}
        <div className="mx-auto max-w-6xl border-t border-allure-petrol/10 px-6 py-14 dark:border-allure-sand/10">
          <div className="grid grid-cols-1 gap-12 text-center sm:grid-cols-2 lg:grid-cols-4 sm:text-left">
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
                Accueil
              </p>
              <ul className="mt-4 flex flex-col items-center gap-3 sm:items-start">
                {HOME_ANCHORS.map((link) => (
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
              <div className="mt-5 flex justify-center gap-3 sm:justify-start">
                {SITE.socials.map((social, i) => {
                  const Icon =
                    SOCIAL_ICONS[social.label as keyof typeof SOCIAL_ICONS];
                  if (!Icon) return null;
                  return (
                    <motion.div
                      key={social.label}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{
                        duration: 0.4,
                        delay: 0.05 * i,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <motion.a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="site-icon inline-flex size-9 items-center justify-center rounded-full text-allure-ink/45 hover:text-allure-petrol dark:text-allure-sand/45 dark:hover:text-allure-gold"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.92 }}
                        transition={{ duration: 0.25 }}
                      >
                        <Icon className="h-4 w-4" />
                      </motion.a>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-14 flex flex-col gap-6 border-t border-allure-petrol/10 pt-6 dark:border-allure-sand/10 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-center font-sans text-xs text-allure-ink/40 dark:text-allure-sand/40 sm:text-left">
              © {new Date().getFullYear()} {SITE.name}. Tous droits réservés.
            </p>
            <div className="flex flex-col items-center gap-3 sm:items-end">
              <nav
                aria-label="Documents"
                className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:justify-end"
              >
                {BOOK_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-sans text-xs font-medium text-allure-petrol/70 transition-colors hover:text-allure-gold dark:text-allure-sand/70 dark:hover:text-allure-gold"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <nav
                aria-label="Informations légales"
                className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:justify-end"
              >
                {LEGAL_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-sans text-xs text-allure-ink/45 transition-colors hover:text-allure-petrol dark:text-allure-sand/45 dark:hover:text-allure-gold"
                  >
                    {link.label}
                  </Link>
                ))}
                {cookies ? (
                  <button
                    type="button"
                    onClick={cookies.reopen}
                    className="font-sans text-xs text-allure-ink/45 transition-colors hover:text-allure-petrol dark:text-allure-sand/45 dark:hover:text-allure-gold"
                  >
                    Gérer les cookies
                  </button>
                ) : null}
              </nav>
            </div>
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
