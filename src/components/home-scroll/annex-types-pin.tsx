"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/lib/gsap/register";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import {
  HOME_PIN_FLOW,
  HOME_PIN_SECTION_IDS,
  getChapterById,
} from "@/components/home-scroll/home-chapters";
import { APARTMENTS } from "@/lib/apartments";
import { HERO_PIN_EVENT } from "@/lib/hero-pin";
import { cn } from "@/lib/utils";

registerGsap();

type PinSide = "left" | "right";

type PinState = {
  eyebrow: string;
  index: string;
  title: string;
  side: PinSide;
};

type FlowNode = {
  id: string;
  kind: "chapter" | "bridge";
  el: HTMLElement;
  /** Index dans HOME_PIN_SECTION_IDS (chapitres seulement). */
  chapterIndex: number;
  /** Chapitre suivant (pour traversée sur un pont). */
  nextChapterIndex: number;
};

const ORBIT_DOTS = [
  { top: "12%", edge: "8%", size: "size-2", opacity: "opacity-40" },
  { top: "28%", edge: "4%", size: "size-1.5", opacity: "opacity-30" },
  { top: "48%", edge: "10%", size: "size-2.5", opacity: "opacity-35" },
  { top: "62%", edge: "6%", size: "size-1", opacity: "opacity-25" },
  { top: "78%", edge: "12%", size: "size-1.5", opacity: "opacity-30" },
  { top: "88%", edge: "5%", size: "size-2", opacity: "opacity-20" },
] as const;

/** Dernière portion d’un chapitre où la pin traverse vers le suivant. */
const TRAVEL_WINDOW = 0.28;

function sideForStation(i: number): PinSide {
  return i % 2 === 0 ? "left" : "right";
}

function viewportWidth() {
  if (typeof window === "undefined") return 1280;
  return document.documentElement.clientWidth || window.innerWidth;
}

function dockInset(side: PinSide = "left") {
  const w = viewportWidth();
  /** Laisse la place au serpent de chapitres (xl+). */
  const rail = w >= 1280 ? 44 : 0;
  if (side === "right") {
    if (w >= 1536) return 72 + rail;
    if (w >= 1280) return 56 + rail;
    return 28;
  }
  if (w >= 1536) return 72;
  if (w >= 1280) return 56;
  return 28;
}

function dockX(side: PinSide, cardWidth: number) {
  const vw = viewportWidth();
  const inset = dockInset(side);
  const w = Math.min(Math.max(cardWidth, 1), Math.max(1, vw - inset * 2));
  const left = side === "left" ? dockInset("left") : vw - w - inset;
  return gsap.utils.clamp(dockInset("left"), Math.max(dockInset("left"), vw - w - inset), left);
}

function octagonClip(chamfer: number) {
  const c = `${Math.round(chamfer)}px`;
  return `polygon(${c} 0%, calc(100% - ${c}) 0%, 100% ${c}, 100% calc(100% - ${c}), calc(100% - ${c}) 100%, ${c} 100%, 0% calc(100% - ${c}), 0% ${c})`;
}

function buildFlowNodes(): FlowNode[] {
  let lastChapter = 0;
  const chapterIds = HOME_PIN_SECTION_IDS as readonly string[];

  const raw = HOME_PIN_FLOW.flatMap((entry) => {
    const el = document.getElementById(entry.id);
    if (!el) return [];
    // `stats` (et tout id hors stations) = pont, même si kind dit chapter
    const kind = chapterIds.includes(entry.id)
      ? ("chapter" as const)
      : ("bridge" as const);
    return [{ id: entry.id, kind, el }];
  });

  return raw.map((entry, i) => {
    if (entry.kind === "chapter") {
      const chapterIndex = chapterIds.indexOf(entry.id);
      lastChapter = chapterIndex >= 0 ? chapterIndex : lastChapter;
      let nextChapterIndex = lastChapter;
      for (let j = i + 1; j < raw.length; j++) {
        if (raw[j].kind === "chapter") {
          const ni = chapterIds.indexOf(raw[j].id);
          if (ni >= 0) nextChapterIndex = ni;
          break;
        }
      }
      return {
        id: entry.id,
        kind: "chapter" as const,
        el: entry.el,
        chapterIndex: lastChapter,
        nextChapterIndex,
      };
    }

    let nextChapterIndex = lastChapter;
    for (let j = i + 1; j < raw.length; j++) {
      if (raw[j].kind === "chapter") {
        const ni = chapterIds.indexOf(raw[j].id);
        if (ni >= 0) nextChapterIndex = ni;
        break;
      }
    }
    return {
      id: entry.id,
      kind: "bridge" as const,
      el: entry.el,
      chapterIndex: lastChapter,
      nextChapterIndex,
    };
  });
}

/**
 * Scrollspy : le dernier nœud dont le top a passé le milieu du viewport.
 * (Un #temoignages très haut ne peut plus masquer partenaires / contact / FAQ.)
 */
function measureFlow(nodes: FlowNode[]): {
  chapterIndex: number;
  nextChapterIndex: number;
  travel: number;
  contentIndex: number;
} {
  const n = nodes.length;
  if (n === 0) {
    return { chapterIndex: 0, nextChapterIndex: 0, travel: 0, contentIndex: 0 };
  }

  const mid = window.innerHeight * 0.48;
  const lastChapter = HOME_PIN_SECTION_IDS.length - 1;

  const fromNode = (
    node: FlowNode,
    local: number
  ): {
    chapterIndex: number;
    nextChapterIndex: number;
    travel: number;
    contentIndex: number;
  } => {
    if (node.kind === "bridge") {
      const travel = local;
      return {
        chapterIndex: node.chapterIndex,
        nextChapterIndex: node.nextChapterIndex,
        travel,
        contentIndex:
          travel >= 0.5 ? node.nextChapterIndex : node.chapterIndex,
      };
    }

    const hasNext = node.chapterIndex < lastChapter;
    let travel = 0;
    if (hasNext && local > 1 - TRAVEL_WINDOW) {
      travel = (local - (1 - TRAVEL_WINDOW)) / TRAVEL_WINDOW;
    }
    const nextChapterIndex = hasNext
      ? node.nextChapterIndex
      : node.chapterIndex;
    return {
      chapterIndex: node.chapterIndex,
      nextChapterIndex,
      travel: gsap.utils.clamp(0, 1, travel),
      contentIndex: travel >= 0.5 ? nextChapterIndex : node.chapterIndex,
    };
  };

  let active = 0;
  for (let i = 0; i < n; i++) {
    if (nodes[i].el.getBoundingClientRect().top <= mid) active = i;
  }

  const node = nodes[active];
  const r = node.el.getBoundingClientRect();
  const span = Math.max(1, r.height);
  const local = gsap.utils.clamp(0, 1, (mid - r.top) / span);
  return fromNode(node, local);
}

function pinFromStation(
  stationIndex: number,
  sectionId: string,
  aptIndex: number
): PinState {
  const side = sideForStation(stationIndex);
  const chapter = getChapterById(sectionId);
  if (!chapter) {
    return { eyebrow: "Allure", index: "00", title: "Résidence", side };
  }

  if (chapter.id === "appartements") {
    const apt = APARTMENTS[aptIndex] ?? APARTMENTS[0];
    return {
      eyebrow: chapter.label,
      index: chapter.index,
      title: apt.type,
      side,
    };
  }

  return {
    eyebrow: chapter.label,
    index: chapter.index,
    title: chapter.pinTitle,
    side,
  };
}

/**
 * Pin octogonale — flux chapitres + ponts (statement / dakar / finale…).
 */
export function AnnexChapterPin() {
  const [pin, setPin] = useState<PinState>(() =>
    pinFromStation(0, HOME_PIN_SECTION_IDS[0], 0)
  );
  const [visible, setVisible] = useState(false);
  const heroPinnedRef = useRef(true);

  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const aptIndexRef = useRef(0);
  const lastContentRef = useRef(-1);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced === null) return;

      const wrap = wrapRef.current;
      const card = cardRef.current;
      const inner = innerRef.current;
      if (!wrap || !card) return;

      let nodes = buildFlowNodes();
      if (nodes.length < 1) return;

      const width = () => card.offsetWidth || 136;
      // Plage fixe jusqu’à FAQ/footer — ne pas lier endTrigger au dernier
      // nœud du mount (sinon sync s’arrête à Témoignages si la suite manque).
      const rangeStart =
        document.getElementById("qui-sommes-nous") ?? nodes[0].el;
      const rangeEnd =
        document.getElementById("faq") ??
        document.querySelector("footer") ??
        document.body;

      const dakarBlocked = () => {
        const journey = ScrollTrigger.getById("horizon-journey");
        if (!journey?.isActive) return false;
        // Garde-fou : un pin-spacer trop long ne doit pas masquer la pin
        // jusqu’à Voix / Contact — on ne bloque que si #dakar est vraiment à l’écran.
        const dakar = document.getElementById("dakar");
        if (!dakar) return true;
        const r = dakar.getBoundingClientRect();
        const vh = window.innerHeight;
        return r.top < vh * 0.9 && r.bottom > vh * 0.1;
      };

      const inPinRange = (list: FlowNode[]) => {
        const mid = window.innerHeight * 0.48;
        return list.some((node) => {
          if (node.id === "dakar") return false;
          const r = node.el.getBoundingClientRect();
          return r.top < mid + 80 && r.bottom > mid - 80;
        });
      };

      const applyClip = (chamfer: number) => {
        const clip = octagonClip(chamfer);
        gsap.set(card, { clipPath: clip });
        if (inner) gsap.set(inner, { clipPath: clip });
      };

      const sync = () => {
        nodes = buildFlowNodes();
        if (nodes.length < 1) return;

        const blocked = dakarBlocked();
        const show =
          !blocked && !heroPinnedRef.current && inPinRange(nodes);
        setVisible(show);

        if (blocked) return;

        const { chapterIndex, nextChapterIndex, travel, contentIndex } =
          measureFlow(nodes);

        const side0 = sideForStation(chapterIndex);
        const side1 = sideForStation(nextChapterIndex);
        const x0 = dockX(side0, width());
        const x1 = dockX(side1, width());

        gsap.set(wrap, {
          left: gsap.utils.interpolate(x0, x1, travel),
          x: 0,
          right: "auto",
        });

        const spin = Math.sin(travel * Math.PI);
        const dir = side0 === "left" ? 1 : -1;
        gsap.set(card, {
          rotate: dir * spin * 10,
          transformOrigin: "50% 50%",
        });
        applyClip(14 + spin * 8);

        if (contentIndex !== lastContentRef.current) {
          lastContentRef.current = contentIndex;
          const id =
            HOME_PIN_SECTION_IDS[contentIndex] ?? HOME_PIN_SECTION_IDS[0];
          setPin(pinFromStation(contentIndex, id, aptIndexRef.current));
        }
      };

      applyClip(14);
      gsap.set(wrap, {
        left: dockX("left", width()),
        right: "auto",
        x: 0,
      });
      sync();

      const main = ScrollTrigger.create({
        trigger: rangeStart,
        endTrigger: rangeEnd,
        start: "top bottom",
        end: "bottom top",
        invalidateOnRefresh: true,
        onUpdate: sync,
        onRefresh: sync,
      });

      const journeyWatch = ScrollTrigger.create({
        id: "chapter-pin-journey-watch",
        trigger: document.getElementById("dakar") ?? rangeStart,
        start: "top bottom",
        end: "bottom top",
        onUpdate: sync,
        onToggle: () => {
          requestAnimationFrame(sync);
        },
      });

      const appartements = document.getElementById("appartements");
      const aptTriggers: ScrollTrigger[] = [];
      if (appartements) {
        appartements.querySelectorAll("article").forEach((article, i) => {
          aptTriggers.push(
            ScrollTrigger.create({
              trigger: article,
              start: "top 55%",
              end: "bottom 45%",
              onToggle: (self) => {
                if (!self.isActive) return;
                aptIndexRef.current = i;
                const lastIdx = lastContentRef.current;
                const lastId =
                  lastIdx >= 0 ? HOME_PIN_SECTION_IDS[lastIdx] : undefined;
                if (lastId === "appartements") {
                  setPin(pinFromStation(lastIdx, lastId, i));
                }
              },
            })
          );
        });
      }

      const onResize = () => {
        ScrollTrigger.refresh();
        sync();
      };
      window.addEventListener("resize", onResize);

      const t1 = window.setTimeout(() => {
        ScrollTrigger.refresh();
        sync();
      }, 200);
      const t2 = window.setTimeout(() => {
        ScrollTrigger.refresh();
        sync();
      }, 800);

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        sync();
      });

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        window.removeEventListener("resize", onResize);
        main.kill();
        journeyWatch.kill();
        aptTriggers.forEach((st) => st.kill());
      };
    },
    { dependencies: [reduced] }
  );

  useEffect(() => {
    const onHero = (event: Event) => {
      const active = Boolean(
        (event as CustomEvent<{ active: boolean }>).detail?.active
      );
      heroPinnedRef.current = active;
      if (active) setVisible(false);
    };
    window.addEventListener(HERO_PIN_EVENT, onHero);
    return () => window.removeEventListener(HERO_PIN_EVENT, onHero);
  }, []);

  useEffect(() => {
    const orbit = orbitRef.current;
    if (!orbit || reduced !== false) return;

    const dots = orbit.querySelectorAll<HTMLElement>("[data-pin-dot]");
    const tween = gsap.to(dots, {
      y: (i) => (i % 2 === 0 ? -5 : 4),
      x: (i) => (i % 3 === 0 ? 2 : -2),
      duration: 2.6,
      stagger: { each: 0.12, yoyo: true, repeat: -1 },
      ease: "sine.inOut",
    });

    return () => {
      tween.kill();
    };
  }, [reduced]);

  const onLeft = pin.side === "left";

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={cn(
        "pointer-events-none fixed top-[36%] z-40 hidden w-36 max-w-[min(9rem,calc(100vw-3.5rem))] will-change-[left] lg:block [view-transition-name:none]",
        visible ? "opacity-100" : "opacity-0"
      )}
      style={{ left: 28 }}
    >
      <div
        ref={cardRef}
        className="relative max-w-[8.5rem] bg-allure-petrol/15 p-px transition-colors duration-300 will-change-transform dark:bg-allure-sand/20"
        style={{ clipPath: octagonClip(14) }}
      >
        <div
          ref={innerRef}
          className="relative bg-allure-sand px-3 py-5 backdrop-blur-sm transition-colors duration-300 dark:bg-allure-petrol-deep"
          style={{ clipPath: octagonClip(14) }}
        >
          <div ref={orbitRef} className="pointer-events-none absolute inset-0">
            {ORBIT_DOTS.map((dot, i) => (
              <span
                key={i}
                data-pin-dot
                className={cn(
                  "absolute rounded-full bg-allure-petrol/35 will-change-transform dark:bg-allure-sand/30",
                  dot.size,
                  dot.opacity
                )}
                style={{
                  top: dot.top,
                  ...(onLeft
                    ? { right: dot.edge, left: "auto" }
                    : { left: dot.edge, right: "auto" }),
                }}
              />
            ))}
          </div>

          <p className="relative font-sans text-[10px] uppercase tracking-[0.28em] text-allure-gold">
            {pin.eyebrow}
          </p>
          <p className="relative mt-2 font-heading text-3xl text-allure-petrol tabular-nums dark:text-allure-sand">
            {pin.index}
          </p>
          <p className="relative mt-1 font-heading text-sm leading-tight text-allure-petrol/80 uppercase dark:text-allure-sand/80">
            {pin.title}
          </p>
        </div>
      </div>
    </div>
  );
}

/** @deprecated alias */
export const AnnexTypesPin = AnnexChapterPin;
