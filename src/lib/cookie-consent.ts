export const COOKIE_CONSENT_KEY = "allure-cookie-consent-v1";

export type CookieConsent = {
  version: 1;
  /** Carte Mapbox et cookies / traces associés */
  mapbox: boolean;
  decidedAt: string;
};

export function parseCookieConsent(raw: string | null): CookieConsent | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as Partial<CookieConsent>;
    if (data.version !== 1 || typeof data.mapbox !== "boolean") return null;
    return {
      version: 1,
      mapbox: data.mapbox,
      decidedAt:
        typeof data.decidedAt === "string" ? data.decidedAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function readCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  return parseCookieConsent(window.localStorage.getItem(COOKIE_CONSENT_KEY));
}

export function writeCookieConsent(consent: CookieConsent) {
  window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
}

export function clearCookieConsent() {
  window.localStorage.removeItem(COOKIE_CONSENT_KEY);
}

export function makeConsent(mapbox: boolean): CookieConsent {
  return {
    version: 1,
    mapbox,
    decidedAt: new Date().toISOString(),
  };
}
