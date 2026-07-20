"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type SvgRoomHit = {
  /** Numéro sur le plan ("01" … "22") */
  number: string;
  index: number;
  name: string;
  area: number;
};

type InteractiveSvgPlanProps = {
  src: string;
  /** Index 0-based de la pièce active (sync légende ↔ SVG) */
  activeIndex: number;
  onRoomSelect: (hit: SvgRoomHit) => void;
  className?: string;
  label?: string;
};

function parseRoomNumber(raw: string | undefined): number {
  const n = Number.parseInt(raw ?? "", 10);
  return Number.isFinite(n) ? n : 0;
}

export function InteractiveSvgPlan({
  src,
  activeIndex,
  onRoomSelect,
  className,
  label = "Plan interactif de l'appartement",
}: InteractiveSvgPlanProps) {
  const objectRef = useRef<HTMLObjectElement>(null);
  const [ready, setReady] = useState(false);
  const onSelectRef = useRef(onRoomSelect);
  onSelectRef.current = onRoomSelect;

  const syncActiveClass = useCallback((doc: Document, index: number) => {
    const rooms = Array.from(doc.querySelectorAll<SVGGElement>(".room"));
    const target = index + 1;
    rooms.forEach((el) => {
      const n = parseRoomNumber(el.dataset.room);
      el.classList.toggle("is-active", n === target);
    });
  }, []);

  useEffect(() => {
    const object = objectRef.current;
    if (!object) return;

    const bindRooms = () => {
      const svgDoc = object.contentDocument;
      if (!svgDoc) return;

      setReady(true);
      syncActiveClass(svgDoc, activeIndex);

      const elements = Array.from(
        svgDoc.querySelectorAll<SVGGElement>(".room")
      );
      const cleanups: Array<() => void> = [];

      elements.forEach((element) => {
        const activate = () => {
          const number = element.dataset.room ?? "";
          const index = parseRoomNumber(number) - 1;
          if (index < 0) return;

          syncActiveClass(svgDoc, index);
          onSelectRef.current({
            number: number.padStart(2, "0"),
            index,
            name: element.dataset.name ?? "",
            area: Number(element.dataset.area ?? 0),
          });
        };

        const onKeyDown = (event: KeyboardEvent) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            activate();
          }
        };

        element.addEventListener("click", activate);
        element.addEventListener("keydown", onKeyDown);
        cleanups.push(() => {
          element.removeEventListener("click", activate);
          element.removeEventListener("keydown", onKeyDown);
        });
      });

      return () => cleanups.forEach((fn) => fn());
    };

    let cleanup: (() => void) | undefined;
    const onLoad = () => {
      cleanup?.();
      cleanup = bindRooms();
    };

    object.addEventListener("load", onLoad);
    if (object.contentDocument?.querySelector(".room")) onLoad();

    return () => {
      object.removeEventListener("load", onLoad);
      cleanup?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- rebind on src only
  }, [src, syncActiveClass]);

  useEffect(() => {
    const doc = objectRef.current?.contentDocument;
    if (!doc || !ready) return;
    syncActiveClass(doc, activeIndex);
  }, [activeIndex, ready, syncActiveClass]);

  return (
    <div className={cn("relative w-full", className)}>
      <object
        ref={objectRef}
        data={src}
        type="image/svg+xml"
        aria-label={label}
        className="block h-auto min-h-[220px] w-full bg-transparent sm:min-h-[360px] lg:min-h-[440px]"
      />
      {!ready ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-allure-ink/35 dark:text-allure-sand/35">
            Chargement du plan…
          </p>
        </div>
      ) : null}
    </div>
  );
}
