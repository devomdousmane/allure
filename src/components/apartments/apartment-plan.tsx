"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ApartmentDetail, ApartmentRoom } from "@/data/apartments/types";
import { formatSurface } from "@/data/apartments/format";
import { InteractiveSvgPlan } from "@/components/apartments/interactive-svg-plan";

type PlanView = "plan" | "coupe";

type ApartmentPlanProps = {
  apartment: ApartmentDetail;
};

const CATEGORY_LABEL: Record<ApartmentRoom["category"], string> = {
  circulation: "Circulation",
  living: "Espace de vie",
  sleeping: "Chambre",
  wet: "Sanitaire",
  service: "Service",
  outdoor: "Extérieur",
  technical: "Technique",
};

export function ApartmentPlan({ apartment }: ApartmentPlanProps) {
  const hasSvg = Boolean(apartment.interactivePlan);
  const [view, setView] = useState<PlanView>("plan");
  const [activeId, setActiveId] = useState(apartment.rooms[0]?.id ?? "");
  const itemRefs = useRef<Map<string, HTMLLIElement>>(new Map());
  const listRef = useRef<HTMLUListElement>(null);

  const activeIndex = useMemo(() => {
    const i = apartment.rooms.findIndex((r) => r.id === activeId);
    return i >= 0 ? i : 0;
  }, [apartment.rooms, activeId]);

  const activeRoom = apartment.rooms[activeIndex] ?? apartment.rooms[0];

  const selectRoom = useCallback(
    (id: string) => {
      if (!id || id === activeId) return;
      setActiveId(id);
    },
    [activeId]
  );

  const selectByIndex = useCallback(
    (index: number) => {
      const room = apartment.rooms[index];
      if (room) selectRoom(room.id);
    },
    [apartment.rooms, selectRoom]
  );

  // Garde la pièce active visible dans l’aside (liste scrollable)
  useEffect(() => {
    const el = itemRefs.current.get(activeId);
    if (!el) return;
    el.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeId]);

  return (
    <section
      id="plan"
      className="scroll-mt-28 bg-allure-sand/50 py-14 dark:bg-allure-petrol sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[88rem] px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="font-sans text-xs uppercase tracking-[0.28em] text-allure-gold">
              Plan
            </p>
            <h2 className="mt-3 font-heading text-3xl text-allure-petrol dark:text-allure-sand sm:text-4xl">
              Disposition des espaces
            </h2>
            <p className="mt-3 font-sans text-sm leading-relaxed text-allure-ink/65 dark:text-allure-sand/65">
              {hasSvg
                ? "Touchez une zone du plan ou une ligne de la légende."
                : "Sélectionnez une pièce pour afficher sa surface."}
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Vue du plan"
            className="inline-flex self-start rounded-full border border-allure-petrol/12 bg-white p-1 dark:border-allure-sand/15 dark:bg-allure-petrol-deep sm:self-auto"
          >
            {(
              [
                {
                  id: "plan" as const,
                  label: hasSvg ? "Interactif" : "Annoté",
                },
                { id: "coupe" as const, label: "Coupe" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={view === tab.id}
                onClick={() => setView(tab.id)}
                className={cn(
                  "cursor-pointer rounded-full px-4 py-2 font-sans text-[0.65rem] uppercase tracking-[0.16em] transition-colors duration-200",
                  view === tab.id
                    ? "bg-allure-petrol text-white dark:bg-allure-gold dark:text-allure-petrol-deep"
                    : "text-allure-ink/45 hover:text-allure-petrol dark:text-allure-sand/50 dark:hover:text-allure-sand"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Plan dominant (~70 %) + légende compacte sticky */}
        <div className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_minmax(16.5rem,20rem)] lg:items-start lg:gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(17.5rem,22rem)] xl:gap-10">
          <div className="min-w-0 overflow-hidden bg-transparent">
            {view === "plan" && apartment.interactivePlan ? (
              <InteractiveSvgPlan
                src={apartment.interactivePlan}
                backgroundSrc={`/apartments/${apartment.slug}/dimensions-plan-transparent.png`}
                activeIndex={activeIndex}
                label={`Plan interactif — ${apartment.name}`}
                onRoomSelect={(hit) => selectByIndex(hit.index)}
                className="w-full"
              />
            ) : (
              <div className="relative aspect-[16/9] w-full bg-transparent sm:aspect-[16/10] lg:min-h-[28rem] xl:min-h-[32rem]">
                <Image
                  src={
                    view === "plan"
                      ? apartment.dimensionsPlan
                      : apartment.planFace
                  }
                  alt={
                    view === "plan"
                      ? `Plan annoté — ${apartment.name}`
                      : `Vue coupe — ${apartment.name}`
                  }
                  fill
                  sizes="(min-width: 1280px) 70vw, (min-width: 1024px) 65vw, 100vw"
                  className="object-contain p-1 sm:p-2"
                  priority
                />
              </div>
            )}
          </div>

          <aside className="flex min-h-0 flex-col lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7rem)]">
            {activeRoom ? (
              <div className="mb-4 shrink-0 border-b border-allure-petrol/10 pb-4 dark:border-allure-sand/10">
                <div className="flex items-baseline justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-sans text-[0.6rem] uppercase tracking-[0.2em] text-allure-gold">
                      {String(activeIndex + 1).padStart(2, "0")} ·{" "}
                      {CATEGORY_LABEL[activeRoom.category]}
                    </p>
                    <h3 className="mt-1.5 truncate font-heading text-xl text-allure-petrol dark:text-allure-sand sm:text-2xl">
                      {activeRoom.label}
                    </h3>
                  </div>
                  <p className="shrink-0 font-heading text-xl tabular-nums text-allure-petrol dark:text-allure-gold sm:text-2xl">
                    {formatSurface(activeRoom.surface)}
                  </p>
                </div>
              </div>
            ) : null}

            <p className="mb-3 shrink-0 font-sans text-[0.6rem] uppercase tracking-[0.2em] text-allure-ink/40 dark:text-allure-sand/40">
              Pièces · {apartment.rooms.length}
            </p>

            <ul
              ref={listRef}
              className="relative -mx-1 min-h-0 flex-1 space-y-1.5 overflow-y-auto overscroll-contain px-1 pb-1 sm:grid sm:grid-cols-2 sm:gap-1.5 sm:space-y-0 lg:block lg:space-y-1.5"
            >
              {apartment.rooms.map((room, index) => {
                const isActive = room.id === activeRoom?.id;
                return (
                  <li
                    key={room.id}
                    ref={(node) => {
                      if (node) itemRefs.current.set(room.id, node);
                      else itemRefs.current.delete(room.id);
                    }}
                    className={cn(
                      "relative transition-transform duration-200",
                      isActive && "z-10"
                    )}
                  >
                    <button
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => selectRoom(room.id)}
                      className={cn(
                        "grid w-full min-h-11 cursor-pointer grid-cols-[1.75rem_1fr_auto] items-center gap-2 px-3 py-2.5 text-left transition-all duration-200 sm:px-3.5",
                        isActive
                          ? "bg-allure-petrol text-white shadow-[0_12px_28px_-16px_rgba(30,75,93,0.65)] ring-1 ring-allure-gold dark:bg-allure-gold dark:text-allure-petrol-deep dark:shadow-[0_12px_28px_-16px_rgba(0,0,0,0.55)]"
                          : "bg-white/70 text-allure-ink/80 hover:bg-white dark:bg-allure-petrol-deep/70 dark:text-allure-sand/80 dark:hover:bg-allure-petrol-deep"
                      )}
                    >
                      <span
                        className={cn(
                          "font-sans text-xs tabular-nums",
                          isActive
                            ? "text-white/50 dark:text-allure-petrol-deep/50"
                            : "text-allure-ink/30 dark:text-allure-sand/30"
                        )}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="truncate font-sans text-sm">
                        {room.label}
                      </span>
                      <span
                        className={cn(
                          "font-sans text-sm tabular-nums",
                          isActive
                            ? "text-white/65 dark:text-allure-petrol-deep/65"
                            : "text-allure-ink/40 dark:text-allure-sand/40"
                        )}
                      >
                        {formatSurface(room.surface)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
