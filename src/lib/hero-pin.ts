/** Durée du pin hero — partagée navbar / vidéo pour docket au bon moment. */
export const HERO_PIN_ANIM_MOBILE = 2.2;
export const HERO_PIN_ANIM_DESKTOP = 3;
/** Petit buffer après la dernière image — sans freeze Lenis. */
export const HERO_PIN_HOLD_VH = 0.15;

export const HERO_PIN_END_MOBILE = `+=${(HERO_PIN_ANIM_MOBILE + HERO_PIN_HOLD_VH) * 100}%`;
export const HERO_PIN_END_DESKTOP = `+=${(HERO_PIN_ANIM_DESKTOP + HERO_PIN_HOLD_VH) * 100}%`;

export const HERO_PIN_EVENT = "allure-hero-pin";

export function getHeroPinMetrics() {
  const mobile =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 768px)").matches;
  const anim = mobile ? HERO_PIN_ANIM_MOBILE : HERO_PIN_ANIM_DESKTOP;
  const hold = HERO_PIN_HOLD_VH;
  const total = anim + hold;
  return { anim, hold, total, animRatio: anim / total };
}

export function getHeroPinEnd() {
  if (typeof window === "undefined") return HERO_PIN_END_DESKTOP;
  return `+=${getHeroPinMetrics().total * 100}%`;
}

/** Source de vérité : le pin du hero, pas un 2e ScrollTrigger sur 100vh. */
let lastHeroPin: boolean | null = null;

export function emitHeroPinActive(active: boolean) {
  if (typeof window === "undefined") return;
  if (lastHeroPin === active) return;
  lastHeroPin = active;
  window.dispatchEvent(
    new CustomEvent(HERO_PIN_EVENT, { detail: { active } })
  );
}
