import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageHero } from "@/components/layout/page-hero";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "À propos du projet Résidence Allure : immobilier de haute qualité aux Almadies, conception locale et innovation constructive.",
  openGraph: {
    title: `À propos — ${SITE.name}`,
    description:
      "Développement immobilier de haute qualité au cœur des Almadies, Dakar.",
  },
};

const PILLARS = [
  {
    title: "Immobilier de haute qualité",
    text: "Répondre au besoin de confort et de valorisation patrimoniale avec des biens durables et soignés.",
  },
  {
    title: "Conception locale",
    text: "Un agencement pensé pour Dakar : style digne, normes élevées, adaptation au climat et au mode de vie.",
  },
  {
    title: "Innovation constructive",
    text: "Technologies modernes — structure renforcée, interphonie visuelle, équipements de sécurité avancés.",
  },
];

export default function AProposPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <PageHero
          eyebrow="À propos d’Allure"
          title="Le projet Allure"
          description="Un programme résidentiel de standing aux Almadies, conçu pour le confort, la sécurité et la valeur à long terme."
          image="/Allure/HD_172.webp"
        />

        <section className="bg-white py-20 dark:bg-allure-petrol-deep">
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-allure-gold">
                Aperçu général
              </p>
              <h2 className="mt-4 font-heading text-3xl text-allure-petrol dark:text-allure-sand">
                Une expérience de vie à Dakar, pas comme les autres
              </h2>
              <p className="mt-5 font-sans text-sm leading-relaxed text-allure-ink/70 dark:text-allure-sand/70">
                Nichée au cœur de l&rsquo;espace résidentiel des Almadies, la
                Résidence Allure se distingue par ses formes harmonieuses —
                classiques dans l&rsquo;esprit, résolument modernes dans
                l&rsquo;exécution. Le projet vise un habitat exigeant, proche de
                la mer, pensé pour les familles comme pour la diaspora.
              </p>
              <Button
                asChild
                size="lg"
                className="mt-8 rounded-full bg-allure-petrol text-white dark:bg-allure-gold dark:text-allure-petrol-deep"
              >
                <Link href="/contact">Parler à un conseiller</Link>
              </Button>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/Allure/HD.webp"
                alt="Résidence Allure"
                fill
                sizes="50vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section className="bg-allure-sand py-20 dark:bg-allure-petrol">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="font-heading text-3xl text-allure-petrol dark:text-allure-sand">
              Nos engagements
            </h2>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              {PILLARS.map((pillar) => (
                <div
                  key={pillar.title}
                  className="rounded-2xl border border-allure-petrol/10 bg-white p-6 dark:border-allure-sand/10 dark:bg-allure-petrol-deep"
                >
                  <h3 className="font-heading text-lg text-allure-petrol dark:text-allure-sand">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 font-sans text-sm text-allure-ink/65 dark:text-allure-sand/65">
                    {pillar.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
