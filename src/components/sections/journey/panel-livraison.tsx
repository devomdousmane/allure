import Link from "next/link";
import { APARTMENTS } from "@/lib/apartments";
import type { JourneyPanelConfig } from "./journey-data";
import { PanelShell } from "./panel-shell";

type Props = { panel: JourneyPanelConfig };

/** Panel 03 — Livraison : typologies + CTA visite. */
export function PanelLivraison({ panel }: Props) {
  return (
    <PanelShell panel={panel}>
      <div className="absolute inset-x-0 bottom-36 z-20 flex flex-col items-center gap-5 px-6 sm:bottom-[22%]">
        <div className="flex flex-col items-center gap-3">
          <p className="font-sans text-[9px] uppercase tracking-[0.28em] text-allure-gold/80">
            Typologies
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-2">
            {APARTMENTS.map((apt) => (
              <li key={apt.id}>
                <Link
                  href="#appartements"
                  className="pointer-events-auto inline-flex items-center rounded-full border border-allure-petrol/20 bg-white/70 px-3 py-1.5 font-sans text-[10px] uppercase tracking-[0.16em] text-allure-petrol/80 transition-colors hover:border-allure-gold/40 hover:text-allure-gold sm:text-[11px] dark:border-allure-sand/20 dark:bg-black/10 dark:text-allure-sand/75"
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
          className="btn-cta pointer-events-auto inline-flex h-11 items-center justify-center px-6 font-sans text-xs uppercase tracking-[0.14em]"
        >
          Réserver une visite
        </Link>
      </div>
    </PanelShell>
  );
}
