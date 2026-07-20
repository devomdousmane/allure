import type { ApartmentDetail } from "@/data/apartments/types";
import { getApartmentStats } from "@/data/apartments/format";

type ApartmentStatsProps = {
  apartment: ApartmentDetail;
};

export function ApartmentStats({ apartment }: ApartmentStatsProps) {
  const stats = getApartmentStats(apartment);

  return (
    <section className="border-b border-allure-petrol/10 bg-white dark:border-allure-sand/10 dark:bg-allure-petrol-deep">
      <div className="mx-auto max-w-6xl">
        <ul className="flex gap-0 overflow-x-auto px-5 sm:grid sm:grid-cols-5 sm:overflow-visible sm:px-6 sm:divide-x sm:divide-allure-petrol/10 dark:sm:divide-allure-sand/10">
          {stats.map((stat) => (
            <li
              key={stat.label}
              className="flex min-w-[7.5rem] shrink-0 flex-col items-start border-r border-allure-petrol/10 px-4 py-6 last:border-r-0 first:pl-0 sm:min-w-0 sm:items-center sm:border-r-0 sm:px-4 sm:py-8 lg:px-6 dark:border-allure-sand/10"
            >
              <p className="font-sans text-[0.6rem] uppercase tracking-[0.22em] text-allure-ink/40 dark:text-allure-sand/40">
                {stat.label}
              </p>
              <p className="mt-2 whitespace-nowrap font-heading text-lg text-allure-petrol dark:text-allure-sand sm:text-xl lg:text-2xl">
                {stat.value}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
