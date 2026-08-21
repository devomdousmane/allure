import Link from "next/link";
import { APARTMENTS } from "@/lib/apartments";
import type { JourneyPanelConfig } from "./journey-data";
import { PanelShell } from "./panel-shell";

type Props = { panel: JourneyPanelConfig };

/** Panel 03 — Livraison : typologies + CTA visite. */
export function PanelLivraison({ panel }: Props) {
  return (
    <PanelShell panel={panel}>
      <div className="absolute inset-x-0 bottom-36 z-20 flex flex-col items-center gap-5 px-6 sm:bottom-[20%]">
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-allure-sand/75 px-5 py-4 backdrop-blur-sm dark:bg-allure-petrol-deep/70">
          <p className="font-sans text-xs font-medium uppercase tracking-[0.24em] text-allure-gold">
            Typologies
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-2">
            {APARTMENTS.map((apt) => (
              <li key={apt.id}>
                <Link
                  href="#appartements"
                  className="pointer-events-auto inline-flex items-center rounded-full border border-allure-petrol/25 bg-white/85 px-3.5 py-2 font-sans text-xs uppercase tracking-[0.14em] text-allure-petrol transition-colors hover:border-allure-gold/50 hover:text-allure-gold dark:border-allure-sand/25 dark:bg-black/25 dark:text-allure-sand"
                >
                  {apt.slug === "studio"
                    ? "Studio"
                    : apt.type.replace("Type ", "")}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <Link
          href="/rendez-vous"
          className="btn-cta pointer-events-auto inline-flex h-12 items-center justify-center px-7 font-sans text-sm uppercase tracking-[0.14em]"
        >
          Réserver une visite
        </Link>
      </div>
    </PanelShell>
  );
}
