import type { JourneyPanelConfig } from "./journey-data";
import { PanelShell } from "./panel-shell";

const MILESTONES = [
  "Fondations",
  "RDC",
  "Élévation",
  "Gros œuvre",
] as const;

const SPECS = [
  { label: "Niveaux", value: "R+11" },
  { label: "Typologies", value: "5" },
  { label: "Lots", value: "70+" },
] as const;

type Props = { panel: JourneyPanelConfig };

/** Panel 01 — Chantier : jalons + chiffres programme. */
export function PanelChantier({ panel }: Props) {
  return (
    <PanelShell panel={panel}>
      <div className="absolute bottom-28 left-6 z-20 sm:bottom-[20%] sm:left-10 lg:left-14">
        <p className="font-sans text-[9px] uppercase tracking-[0.28em] text-allure-gold/80">
          Jalons
        </p>
        <ol className="mt-3 flex flex-col gap-2.5">
          {MILESTONES.map((label, i) => (
            <li key={label} className="flex items-center gap-3">
              <span
                className={
                  i === 0
                    ? "h-1.5 w-1.5 rounded-full bg-allure-gold"
                    : "h-1.5 w-1.5 rounded-full bg-allure-petrol/25 dark:bg-allure-sand/25"
                }
              />
              <span
                className={
                  i === 0
                    ? "font-sans text-[11px] uppercase tracking-[0.18em] text-allure-petrol sm:text-xs dark:text-allure-sand"
                    : "font-sans text-[11px] uppercase tracking-[0.18em] text-allure-petrol/40 sm:text-xs dark:text-allure-sand/35"
                }
              >
                {label}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <dl className="absolute top-[48%] right-6 z-20 hidden flex-col gap-5 sm:top-[24%] sm:right-10 sm:flex lg:right-14">
        {SPECS.map((s) => (
          <div key={s.label}>
            <dt className="font-sans text-[9px] uppercase tracking-[0.28em] text-allure-petrol/45 dark:text-allure-sand/40">
              {s.label}
            </dt>
            <dd className="mt-0.5 font-heading text-2xl text-allure-petrol sm:text-3xl dark:text-allure-sand">
              {s.value}
            </dd>
          </div>
        ))}
      </dl>
    </PanelShell>
  );
}
