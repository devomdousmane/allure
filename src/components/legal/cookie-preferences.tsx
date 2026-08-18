"use client";

import { Button } from "@/components/ui/button";
import { useCookieConsent } from "@/components/legal/cookie-consent-provider";

export function CookiePreferences() {
  const { consent, ready, acceptAll, acceptEssential, reopen } =
    useCookieConsent();

  const status = !ready
    ? "Chargement…"
    : consent?.mapbox
      ? "Carte Mapbox activée"
      : consent
        ? "Cookies essentiels uniquement"
        : "Aucun choix enregistré";

  return (
    <section
      id="gerer-cookies"
      className="scroll-mt-28 rounded-2xl border border-allure-petrol/10 bg-allure-sand/60 p-6 dark:border-allure-sand/10 dark:bg-allure-petrol/40"
    >
      <h2 className="font-heading text-xl text-allure-petrol sm:text-2xl dark:text-allure-sand">
        Gérer vos préférences
      </h2>
      <p className="mt-3 font-sans text-sm leading-relaxed text-allure-ink/70 dark:text-allure-sand/70">
        Choix actuel : {status}. Vous pouvez modifier ce paramètre à tout moment.
      </p>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Button type="button" size="sm" className="min-h-11" onClick={acceptAll}>
          Accepter la carte
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="min-h-11"
          onClick={acceptEssential}
        >
          Essentiels seulement
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="min-h-11"
          onClick={reopen}
        >
          Réafficher le bandeau
        </Button>
      </div>
    </section>
  );
}
