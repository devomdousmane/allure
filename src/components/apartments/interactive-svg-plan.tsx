"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
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
  /** Plan annoté sous le SVG (le fond n’est plus dans le fichier SVG) */
  backgroundSrc?: string;
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

function roomFromElement(element: Element): SvgRoomHit | null {
  const roomEl = element.closest(".room") as SVGGElement | null;
  if (!roomEl) return null;
  const number = roomEl.dataset.room ?? "";
  const index = parseRoomNumber(number) - 1;
  if (index < 0) return null;
  return {
    number: number.padStart(2, "0"),
    index,
    name: roomEl.dataset.name ?? "",
    area: Number(roomEl.dataset.area ?? 0),
  };
}

export function InteractiveSvgPlan({
  src,
  backgroundSrc,
  activeIndex,
  onRoomSelect,
  className,
  label = "Plan interactif de l'appartement",
}: InteractiveSvgPlanProps) {
  const objectRef = useRef<HTMLObjectElement>(null);
  const [ready, setReady] = useState(false);
  const onSelectRef = useRef(onRoomSelect);
  const activeIndexRef = useRef(activeIndex);
  onSelectRef.current = onRoomSelect;
  activeIndexRef.current = activeIndex;

  const syncActiveClass = useCallback((doc: Document, index: number) => {
    const rooms = Array.from(doc.querySelectorAll<SVGGElement>(".room"));
    const target = index + 1;
    let activeEl: SVGGElement | null = null;

    for (const el of rooms) {
      const n = parseRoomNumber(el.dataset.room);
      const active = n === target;
      el.classList.toggle("is-active", active);
      if (active) activeEl = el;
    }

    activeEl?.parentElement?.appendChild(activeEl);
  }, []);

  useEffect(() => {
    const object = objectRef.current;
    if (!object) return;

    const bind = () => {
      const svgDoc = object.contentDocument;
      const svgRoot = svgDoc?.documentElement;
      if (!svgDoc || !svgRoot) return;

      svgRoot.style.background = "transparent";
      svgRoot.style.width = "100%";
      svgRoot.style.height = "100%";
      svgRoot.setAttribute("preserveAspectRatio", "xMidYMid meet");
      if (svgDoc.body) svgDoc.body.style.background = "transparent";
      let styleEl = svgDoc.getElementById("allure-plan-transparent-bg");
      if (!styleEl) {
        styleEl = svgDoc.createElement("style");
        styleEl.id = "allure-plan-transparent-bg";
        styleEl.textContent = [
          "html,body,svg{background:transparent!important;width:100%;height:100%;margin:0;}",
          "svg{display:block;}",
        ].join("");
        svgRoot.appendChild(styleEl);
      }

      setReady(true);
      syncActiveClass(svgDoc, activeIndexRef.current);

      const onClick = (event: MouseEvent) => {
        const hit = roomFromElement(event.target as Element);
        if (!hit) return;
        syncActiveClass(svgDoc, hit.index);
        onSelectRef.current(hit);
      };

      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        const hit = roomFromElement(event.target as Element);
        if (!hit) return;
        event.preventDefault();
        syncActiveClass(svgDoc, hit.index);
        onSelectRef.current(hit);
      };

      svgRoot.addEventListener("click", onClick);
      svgRoot.addEventListener("keydown", onKeyDown);

      return () => {
        svgRoot.removeEventListener("click", onClick);
        svgRoot.removeEventListener("keydown", onKeyDown);
      };
    };

    let cleanup: (() => void) | undefined;
    const onLoad = () => {
      cleanup?.();
      cleanup = bind();
    };

    object.addEventListener("load", onLoad);
    if (object.contentDocument?.querySelector(".room")) onLoad();

    return () => {
      object.removeEventListener("load", onLoad);
      cleanup?.();
    };
  }, [src, syncActiveClass]);

  useEffect(() => {
    const doc = objectRef.current?.contentDocument;
    if (!doc || !ready) return;
    syncActiveClass(doc, activeIndex);
  }, [activeIndex, ready, syncActiveClass]);

  return (
    <div
      className={cn(
        "relative aspect-[16/9] w-full bg-transparent sm:aspect-[16/10] lg:min-h-[28rem] xl:min-h-[34rem]",
        className
      )}
    >
      {backgroundSrc ? (
        <div className="pointer-events-none absolute inset-0 z-0 p-1 sm:p-2">
          <div className="relative h-full w-full">
            <Image
              src={backgroundSrc}
              alt=""
              fill
              sizes="(min-width: 1280px) 70vw, (min-width: 1024px) 65vw, 100vw"
              className="object-contain"
              priority
            />
          </div>
        </div>
      ) : null}
      <object
        ref={objectRef}
        data={src}
        type="image/svg+xml"
        aria-label={label}
        className="absolute inset-0 z-[1] h-full w-full bg-transparent [color-scheme:only_light]"
      />
      {!ready ? (
        <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center">
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-allure-ink/35 dark:text-allure-sand/35">
            Chargement du plan…
          </p>
        </div>
      ) : null}
    </div>
  );
}
