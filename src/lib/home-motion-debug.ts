/**
 * Home motion feature flags.
 * `active: false` → tout est armé (prod).
 * `active: true` → seuls les flags à `true` s’animent / s’affichent (debug).
 */
export const HOME_MOTION_DEBUG = {
  active: false,

  shell: {
    chapters: true,
    orchestrator: true,
    scrollHint: true,
    floatingCta: true,
  },

  annexes: {
    presenceLine: true,
    statsRibbon: true,
    statement: true,
    aboutOrbit: true,
    offeringsPin: true,
    servicesPulse: true,
    videoOverlay: true,
    amenitiesBloom: true,
    galleryBridge: true,
    galleryDrift: true,
    typesPin: true,
    voicesMark: true,
    partnersDrift: true,
    finale: true,
    contactAura: true,
    faqRail: true,
  },

  reveals: {
    whoWeAre: true,
    stats: true,
    annexStatement: true,
    about: true,
    orbitVideo: true,
    offerings: true,
    services: true,
    constructionVideo: true,
    amenities: true,
    categories: true,
    apartments: true,
    neighborhood: true,
    testimonials: true,
    partners: true,
    contact: true,
    faq: true,
  } satisfies Record<string, boolean>,
};

export type HomeRevealId = keyof typeof HOME_MOTION_DEBUG.reveals;

export function isHomeMotionDebug() {
  return HOME_MOTION_DEBUG.active === true;
}

export function isRevealArmed(id: HomeRevealId | undefined) {
  if (!HOME_MOTION_DEBUG.active) return true;
  if (!id) return false;
  return HOME_MOTION_DEBUG.reveals[id] === true;
}

export function isAnnexArmed(key: keyof typeof HOME_MOTION_DEBUG.annexes) {
  if (!HOME_MOTION_DEBUG.active) return true;
  return HOME_MOTION_DEBUG.annexes[key] === true;
}

export function isShellArmed(key: keyof typeof HOME_MOTION_DEBUG.shell) {
  if (!HOME_MOTION_DEBUG.active) return true;
  return HOME_MOTION_DEBUG.shell[key] === true;
}
