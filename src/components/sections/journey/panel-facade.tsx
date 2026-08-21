import { Waves, Shield, ConciergeBell } from "lucide-react";
import type { JourneyPanelConfig } from "./journey-data";
import { PanelShell } from "./panel-shell";

const MATERIALS = [
  { label: "Béton", swatch: "#8a9a9e" },
  { label: "Verre", swatch: "#c5d4d8" },
  { label: "Pétrole", swatch: "#1E4B5D" },
  { label: "Or", swatch: "#E0BF89" },
] as const;

const AMENITIES = [
  { label: "Piscine à débordement", Icon: Waves },
  { label: "Sécurité 24h/24", Icon: Shield },
  { label: "Conciergerie", Icon: ConciergeBell },
] as const;

type Props = { panel: JourneyPanelConfig };

/** Panel 02 — Façade : matériaux + aperçu prestations. */
export function PanelFacade({ panel }: Props) {
  return (
    <PanelShell panel={panel}>
      <div className="absolute bottom-28 left-6 z-20 rounded-2xl bg-allure-sand/75 px-4 py-3 backdrop-blur-sm sm:bottom-[18%] sm:left-10 sm:px-5 sm:py-4 lg:left-14 dark:bg-allure-petrol-deep/70">
        <p className="font-sans text-xs font-medium uppercase tracking-[0.24em] text-allure-gold">
          Matériaux
        </p>
        <ul className="mt-3 flex flex-col gap-2.5">
          {MATERIALS.map((m, i) => (
            <li key={m.label} className="flex items-center gap-3">
              <span
                className={
                  i === 0
                    ? "h-3.5 w-3.5 rounded-sm ring-1 ring-allure-gold/50"
                    : "h-3.5 w-3.5 rounded-sm ring-1 ring-allure-petrol/25 dark:ring-allure-sand/25"
                }
                style={{ backgroundColor: m.swatch }}
              />
              <span
                className={
                  i === 0
                    ? "font-sans text-sm font-medium uppercase tracking-[0.14em] text-allure-petrol dark:text-allure-sand"
                    : "font-sans text-sm uppercase tracking-[0.14em] text-allure-petrol/70 dark:text-allure-sand/70"
                }
              >
                {m.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <ul className="absolute top-[48%] right-6 z-20 hidden flex-col gap-3 rounded-2xl bg-allure-sand/75 px-4 py-4 backdrop-blur-sm sm:top-[24%] sm:right-10 sm:flex lg:right-14 dark:bg-allure-petrol-deep/70">
        <li className="font-sans text-xs font-medium uppercase tracking-[0.24em] text-allure-gold">
          Prestations
        </li>
        {AMENITIES.map(({ label, Icon }) => (
          <li key={label} className="flex items-center gap-3">
            <Icon className="h-4 w-4 shrink-0 text-allure-gold" aria-hidden />
            <span className="font-sans text-sm text-allure-petrol/85 dark:text-allure-sand/90">
              {label}
            </span>
          </li>
        ))}
      </ul>
    </PanelShell>
  );
}
