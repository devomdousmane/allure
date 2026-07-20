import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageHero } from "@/components/layout/page-hero";
import { ContactForm } from "@/components/forms/contact-form";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez l’équipe Résidence Allure pour une visite, un plan ou un accompagnement diaspora. Réponse sous 24h.",
  openGraph: {
    title: `Contact — ${SITE.name}`,
    description: `Appelez le ${SITE.phone} ou écrivez à ${SITE.email}.`,
  },
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <PageHero
          eyebrow="Contact"
          title="Nous serons heureux de vous accompagner"
          description="Visite, plans, financement ou achat depuis la diaspora — notre équipe commerciale vous répond sous 24h."
          image="/hero-sequence/frame_020.webp"
        />

        <section className="bg-allure-sand py-20 dark:bg-allure-petrol">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 lg:grid-cols-2">
            <div>
              <h2 className="font-heading text-3xl text-allure-petrol dark:text-allure-sand">
                Parlons de votre projet
              </h2>
              <p className="mt-4 font-sans text-sm text-allure-ink/65 dark:text-allure-sand/65">
                Indiquez vos coordonnées et le motif de votre demande. Un
                conseiller Allure vous recontacte rapidement.
              </p>

              <ul className="mt-10 flex flex-col gap-5">
                <li>
                  <a
                    href={SITE.phoneHref}
                    className="flex items-center gap-4 font-sans text-sm text-allure-ink transition-colors hover:text-allure-petrol dark:text-allure-sand dark:hover:text-allure-gold"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-allure-petrol dark:bg-allure-petrol-deep dark:text-allure-gold">
                      <Phone className="h-4 w-4" />
                    </span>
                    {SITE.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={SITE.emailHref}
                    className="flex items-center gap-4 font-sans text-sm text-allure-ink transition-colors hover:text-allure-petrol dark:text-allure-sand dark:hover:text-allure-gold"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-allure-petrol dark:bg-allure-petrol-deep dark:text-allure-gold">
                      <Mail className="h-4 w-4" />
                    </span>
                    {SITE.email}
                  </a>
                </li>
                <li className="flex items-center gap-4 font-sans text-sm text-allure-ink dark:text-allure-sand">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-allure-petrol dark:bg-allure-petrol-deep dark:text-allure-gold">
                    <MapPin className="h-4 w-4" />
                  </span>
                  {SITE.address}
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-allure-petrol/10 bg-white p-8 shadow-sm dark:border-allure-sand/10 dark:bg-allure-petrol-deep">
              <h3 className="font-heading text-xl text-allure-petrol dark:text-allure-sand">
                Envoyer un message
              </h3>
              <ContactForm className="mt-6" source="contact-page" />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
