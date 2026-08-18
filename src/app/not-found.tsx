import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main
        id="main-content"
        className="relative flex min-h-[min(78vh,720px)] flex-1 flex-col items-center justify-center overflow-hidden bg-allure-sand px-6 py-28 text-center dark:bg-allure-petrol-deep"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,color-mix(in_oklab,var(--allure-gold)_18%,transparent),transparent_55%)]"
        />
        <p
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none font-heading font-bold leading-none text-allure-petrol/[0.07] dark:text-allure-sand/[0.07]"
          style={{ fontSize: "clamp(8rem, 32vw, 22rem)" }}
        >
          404
        </p>

        <div className="relative z-[1] flex max-w-lg flex-col items-center">
          <p className="font-sans text-xs uppercase tracking-[0.35em] text-allure-gold">
            Introuvable
          </p>
          <h1 className="mt-4 font-heading text-3xl text-allure-petrol sm:text-4xl dark:text-allure-sand">
            Cette page a quitté les Almadies
          </h1>
          <p className="mt-5 font-sans text-sm leading-relaxed text-allure-ink/65 dark:text-allure-sand/65">
            Le lien est incorrect ou la page n&rsquo;existe plus. Revenez à
            l&rsquo;accueil pour continuer votre visite de {SITE.name}.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="btn-cta">
              <Link href="/">Retour à l&rsquo;accueil</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-allure-petrol/20 bg-transparent dark:border-allure-sand/20"
            >
              <Link href="/contact">Nous contacter</Link>
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
