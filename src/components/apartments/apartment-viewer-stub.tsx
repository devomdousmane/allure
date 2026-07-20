import Link from "next/link";
import { Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ApartmentDetail } from "@/data/apartments/types";

type ApartmentViewerStubProps = {
  apartment: ApartmentDetail;
};

export function ApartmentViewerStub({ apartment }: ApartmentViewerStubProps) {
  const shortName = apartment.name.replace(/^Appartement\s+/i, "");

  return (
    <section className="bg-allure-sand py-20 dark:bg-allure-petrol lg:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-2xl border border-allure-petrol/10 bg-white px-8 py-16 text-center dark:border-allure-sand/10 dark:bg-allure-petrol-deep sm:px-12">
          <div className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-30">
            <div className="absolute -left-20 top-0 size-64 rounded-full bg-allure-gold/25 blur-3xl" />
            <div className="absolute -right-16 bottom-0 size-72 rounded-full bg-allure-petrol/10 blur-3xl dark:bg-white/10" />
          </div>

          <div className="relative mx-auto flex max-w-xl flex-col items-center">
            <span className="flex size-14 items-center justify-center rounded-full border border-allure-gold/40 bg-allure-gold/10 text-allure-gold">
              <Box className="size-6" strokeWidth={1.5} />
            </span>
            <p className="mt-6 font-sans text-xs uppercase tracking-[0.3em] text-allure-gold">
              Visite immersive
            </p>
            <h2 className="mt-3 font-heading text-3xl text-allure-petrol dark:text-allure-sand sm:text-4xl">
              Configurateur 3D
            </h2>
            <p className="mt-4 font-sans text-sm leading-relaxed text-allure-ink/65 dark:text-allure-sand/65">
              La visite 3D du {shortName} arrive bientôt. En attendant, demandez
              une présentation privée ou téléchargez la brochure.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-allure-petrol text-white hover:bg-allure-petrol-deep dark:bg-allure-gold dark:text-allure-petrol-deep dark:hover:bg-allure-gold/90"
              >
                <Link href="/contact">Demander une démo</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-allure-petrol/25 bg-transparent text-allure-petrol hover:bg-allure-petrol/5 dark:border-allure-sand/30 dark:text-allure-sand dark:hover:bg-allure-sand/10 dark:hover:text-allure-sand"
              >
                <a
                  href={apartment.brochure}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Brochure PDF
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
