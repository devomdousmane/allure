import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageHero } from "@/components/layout/page-hero";
import { Button } from "@/components/ui/button";
import { PROGRESS_PHASES } from "@/lib/progress";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Avancement",
  description:
    "Suivez l’avancement du chantier Résidence Allure : des fondations à l’achèvement des gros œuvres, jusqu’à la livraison 2026.",
  openGraph: {
    title: `Avancement — ${SITE.name}`,
    description:
      "Timeline des phases de construction et actualités du chantier aux Almadies.",
  },
};

const STATUS_LABEL = {
  done: "Terminé",
  current: "En cours",
  upcoming: "À venir",
} as const;

export default function AvancementPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <PageHero
          eyebrow="Avancement"
          title="Suivez l’évolution du chantier"
          description="De la phase de terrassement à l’achèvement des gros œuvres — une transparence totale pour les acquéreurs résidents et diaspora."
          image="/Allure/HD_147.webp"
        />

        <section className="bg-white py-20 dark:bg-allure-petrol-deep">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-14 max-w-2xl">
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-allure-gold">
                Timeline
              </p>
              <h2 className="mt-4 font-heading text-3xl text-allure-petrol dark:text-allure-sand">
                Sept phases, une livraison {SITE.delivery}
              </h2>
            </div>

            <ol className="flex flex-col gap-12">
              {PROGRESS_PHASES.map((phase, index) => (
                <li
                  key={phase.id}
                  className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_1.2fr]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
                    <Image
                      src={phase.image}
                      alt={phase.title}
                      fill
                      sizes="(min-width: 1024px) 45vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-sans text-xs uppercase tracking-[0.2em] text-allure-ink/40 dark:text-allure-sand/40">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 font-sans text-xs ${
                          phase.status === "current"
                            ? "bg-allure-gold/20 text-allure-petrol dark:text-allure-gold"
                            : "bg-allure-petrol/10 text-allure-petrol dark:bg-allure-sand/10 dark:text-allure-sand"
                        }`}
                      >
                        {STATUS_LABEL[phase.status]}
                      </span>
                    </div>
                    <h3 className="mt-3 font-heading text-2xl text-allure-petrol dark:text-allure-sand">
                      {phase.title}
                    </h3>
                    <p className="mt-3 font-sans text-sm text-allure-ink/65 dark:text-allure-sand/65">
                      {phase.subtitle}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-16 rounded-2xl border border-allure-petrol/10 bg-allure-sand p-8 dark:border-allure-sand/10 dark:bg-allure-petrol">
              <h3 className="font-heading text-xl text-allure-petrol dark:text-allure-sand">
                Cérémonie d&rsquo;achèvement des gros œuvres
              </h3>
              <p className="mt-3 max-w-2xl font-sans text-sm text-allure-ink/70 dark:text-allure-sand/70">
                Un moment symbolique partagé avec partenaires et acteurs du
                projet, marquant le passage vers le second œuvre et la
                préparation de la livraison.
              </p>
              <Button
                asChild
                size="lg"
                className="mt-6 rounded-full bg-allure-petrol text-white dark:bg-allure-gold dark:text-allure-petrol-deep"
              >
                <Link href="/contact">Demander une visite chantier</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
