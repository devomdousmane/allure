"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  clearCookieConsent,
  makeConsent,
  readCookieConsent,
  writeCookieConsent,
  type CookieConsent,
} from "@/lib/cookie-consent";
import { cn } from "@/lib/utils";

type CookieConsentContextValue = {
  ready: boolean;
  consent: CookieConsent | null;
  bannerVisible: boolean;
  acceptAll: () => void;
  acceptEssential: () => void;
  enableMapbox: () => void;
  reopen: () => void;
};

const CookieConsentContext = createContext<CookieConsentContextValue | null>(
  null
);

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error("useCookieConsent must be used within CookieConsentProvider");
  }
  return ctx;
}

export function useCookieConsentOptional() {
  return useContext(CookieConsentContext);
}

function persist(mapbox: boolean) {
  const next = makeConsent(mapbox);
  writeCookieConsent(next);
  return next;
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [bannerForced, setBannerForced] = useState(false);

  useEffect(() => {
    setConsent(readCookieConsent());
    setReady(true);
  }, []);

  const acceptAll = useCallback(() => {
    setConsent(persist(true));
    setBannerForced(false);
  }, []);

  const acceptEssential = useCallback(() => {
    setConsent(persist(false));
    setBannerForced(false);
  }, []);

  const enableMapbox = useCallback(() => {
    setConsent(persist(true));
    setBannerForced(false);
  }, []);

  const reopen = useCallback(() => {
    clearCookieConsent();
    setConsent(null);
    setBannerForced(true);
  }, []);

  const bannerVisible = ready && (consent === null || bannerForced);

  const value = useMemo(
    () => ({
      ready,
      consent,
      bannerVisible,
      acceptAll,
      acceptEssential,
      enableMapbox,
      reopen,
    }),
    [
      ready,
      consent,
      bannerVisible,
      acceptAll,
      acceptEssential,
      enableMapbox,
      reopen,
    ]
  );

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
      {bannerVisible ? (
        <CookieBanner
          onAcceptAll={acceptAll}
          onEssential={acceptEssential}
        />
      ) : null}
    </CookieConsentContext.Provider>
  );
}

function CookieBanner({
  onAcceptAll,
  onEssential,
}: {
  onAcceptAll: () => void;
  onEssential: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
      className={cn(
        "fixed bottom-4 left-4 right-4 z-[70] sm:right-auto sm:max-w-md",
        "rounded-2xl border border-allure-petrol/12 bg-white/95 p-5 shadow-[0_18px_50px_-24px_rgba(30,75,93,0.55)] backdrop-blur-md",
        "dark:border-allure-sand/12 dark:bg-allure-petrol-deep/95"
      )}
    >
      <p
        id="cookie-banner-title"
        className="font-heading text-base text-allure-petrol dark:text-allure-sand"
      >
        Cookies & carte
      </p>
      <p
        id="cookie-banner-desc"
        className="mt-2 font-sans text-sm leading-relaxed text-allure-ink/65 dark:text-allure-sand/65"
      >
        Nous utilisons un stockage local pour le thème et votre choix. La carte
        du quartier (Mapbox) n’est chargée que si vous l’acceptez.{" "}
        <Link
          href="/cookies"
          className="underline decoration-allure-gold/70 underline-offset-4 hover:text-allure-petrol dark:hover:text-allure-gold"
        >
          Politique cookies
        </Link>
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Button type="button" size="sm" className="min-h-11" onClick={onAcceptAll}>
          Tout accepter
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="min-h-11"
          onClick={onEssential}
        >
          Essentiels seulement
        </Button>
      </div>
    </div>
  );
}
