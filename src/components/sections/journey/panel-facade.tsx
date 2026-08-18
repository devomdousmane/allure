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
      <div className="absolute bottom-28 left-6 z-20 sm:bottom-[20%] sm:left-10 lg:left-14">
        <p className="font-sans text-[9px] uppercase tracking-[0.28em] text-allure-gold/80">
          Matériaux
        </p>
        <ul className="mt-3 flex flex-col gap-2.5">
          {MATERIALS.map((m, i) => (
            <li key={m.label} className="flex items-center gap-3">
              <span
                className={
                  i === 0
                    ? "h-3 w-3 rounded-sm ring-1 ring-allure-gold/50"
                    : "h-3 w-3 rounded-sm ring-1 ring-allure-petrol/15 dark:ring-allure-sand/15"
                }
                style={{ backgroundColor: m.swatch }}
              />
              <span
                className={
                  i === 0
                    ? "font-sans text-[11px] uppercase tracking-[0.18em] text-allure-petrol sm:text-xs dark:text-allure-sand"
                    : "font-sans text-[11px] uppercase tracking-[0.18em] text-allure-petrol/40 sm:text-xs dark:text-allure-sand/35"
                }
              >
                {m.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <ul className="absolute top-[48%] right-6 z-20 hidden flex-col gap-3 sm:top-[26%] sm:right-10 sm:flex lg:right-14">
        <li className="font-sans text-[9px] uppercase tracking-[0.28em] text-allure-gold/80">
          Prestations
        </li>
        {AMENITIES.map(({ label, Icon }) => (
          <li key={label} className="flex items-center gap-3">
            <Icon className="h-3.5 w-3.5 shrink-0 text-allure-gold/70" aria-hidden />
            <span className="font-sans text-[11px] text-allure-petrol/70 sm:text-xs dark:text-allure-sand/70">
              {label}
            </span>
          </li>
        ))}
      </ul>
    </PanelShell>
  );
}
