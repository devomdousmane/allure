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
      <div className="absolute bottom-28 left-6 z-20 rounded-2xl bg-allure-sand/75 px-4 py-3 backdrop-blur-sm sm:bottom-[18%] sm:left-10 sm:px-5 sm:py-4 lg:left-14 dark:bg-allure-petrol-deep/70">
        <p className="font-sans text-xs font-medium uppercase tracking-[0.24em] text-allure-gold">
          Jalons
        </p>
        <ol className="mt-3 flex flex-col gap-2.5">
          {MILESTONES.map((label, i) => (
            <li key={label} className="flex items-center gap-3">
              <span
                className={
                  i === 0
                    ? "h-2 w-2 rounded-full bg-allure-gold"
                    : "h-2 w-2 rounded-full bg-allure-petrol/40 dark:bg-allure-sand/45"
                }
              />
              <span
                className={
                  i === 0
                    ? "font-sans text-sm font-medium uppercase tracking-[0.14em] text-allure-petrol dark:text-allure-sand"
                    : "font-sans text-sm uppercase tracking-[0.14em] text-allure-petrol/70 dark:text-allure-sand/70"
                }
              >
                {label}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <dl className="absolute top-[48%] right-6 z-20 hidden flex-col gap-4 rounded-2xl bg-allure-sand/75 px-4 py-4 backdrop-blur-sm sm:top-[22%] sm:right-10 sm:flex lg:right-14 dark:bg-allure-petrol-deep/70">
        {SPECS.map((s) => (
          <div key={s.label}>
            <dt className="font-sans text-xs font-medium uppercase tracking-[0.22em] text-allure-petrol/70 dark:text-allure-sand/75">
              {s.label}
            </dt>
            <dd className="mt-1 font-heading text-3xl text-allure-petrol sm:text-4xl dark:text-allure-sand">
              {s.value}
            </dd>
          </div>
        ))}
      </dl>
    </PanelShell>
  );
}
