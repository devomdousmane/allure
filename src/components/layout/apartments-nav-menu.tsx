"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { NavChild } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { registerGsap } from "@/lib/gsap/register";
import { DURATION, EASE } from "@/lib/gsap/presets";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

registerGsap();

type NavFlyoutMenuProps = {
  href: string;
  label: string;
  items: readonly NavChild[];
  overviewLabel: string;
  menuAriaLabel: string;
  className?: string;
  triggerClassName?: string;
  active?: boolean;
  flyoutSide?: "bottom" | "right";
};

/**
 * Sous-menu desktop hover/focus — panel GSAP (Résidence, Appartements…).
 */
export function NavFlyoutMenu({
  href,
  label,
  items,
  overviewLabel,
  menuAriaLabel,
  className,
  triggerClassName,
  active = false,
  flyoutSide = "bottom",
}: NavFlyoutMenuProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpen] = useState(false);
  const reduced = usePrefersReducedMotion();
  const menuId = useId();

  const clearClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    clearClose();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  const openMenu = () => {
    clearClose();
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => () => clearClose(), []);

  useGSAP(
    () => {
      const panel = panelRef.current;
      const list = listRef.current;
      if (!panel || !list || reduced === null) return;

      const flyItems = list.querySelectorAll<HTMLElement>("[data-apt-item]");
      const rule = panel.querySelector<HTMLElement>("[data-apt-rule]");

      if (reduced === true) {
        gsap.set(panel, {
          autoAlpha: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        });
        gsap.set(flyItems, { autoAlpha: 1, y: 0 });
        if (rule) gsap.set(rule, { scaleX: open ? 1 : 0 });
        return;
      }

      if (!open) {
        gsap.to(panel, {
          autoAlpha: 0,
          y: -6,
          duration: 0.22,
          ease: EASE.soft,
          pointerEvents: "none",
        });
        return;
      }

      gsap.set(panel, { pointerEvents: "auto" });
      gsap.set(flyItems, { autoAlpha: 0, y: 8 });
      if (rule) gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });

      const tl = gsap.timeline({ defaults: { ease: EASE.out } });
      tl.fromTo(
        panel,
        { autoAlpha: 0, y: -8 },
        { autoAlpha: 1, y: 0, duration: DURATION.fast }
      );
      if (rule) {
        tl.to(rule, { scaleX: 1, duration: 0.35 }, 0.06);
      }
      tl.to(
        flyItems,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.32,
          stagger: 0.045,
        },
        0.08
      );
    },
    { dependencies: [open, reduced] }
  );

  return (
    <div
      ref={wrapRef}
      className={cn("relative", className)}
      onPointerEnter={openMenu}
      onPointerLeave={scheduleClose}
      onFocusCapture={openMenu}
      onBlurCapture={(e) => {
        if (!wrapRef.current?.contains(e.relatedTarget as Node)) {
          scheduleClose();
        }
      }}
    >
      <Link
        href={href}
        data-header-link=""
        aria-current={active ? "page" : undefined}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        className={cn(
          "group relative inline-flex items-center gap-1 font-sans font-medium uppercase tracking-[0.12em]",
          active && "text-allure-petrol dark:text-allure-gold",
          triggerClassName
        )}
        onClick={() => setOpen(false)}
      >
        <span data-nav-label className="relative z-[1]">
          {label}
        </span>
        <ChevronDown
          aria-hidden
          className={cn(
            "relative z-[1] size-3.5 opacity-70 transition-transform duration-300",
            open && "rotate-180"
          )}
        />
        <span
          aria-hidden
          data-nav-line
          className={cn(
            "pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left bg-current",
            active ? "scale-x-100" : "scale-x-0"
          )}
        />
      </Link>

      <div
        ref={panelRef}
        id={menuId}
        role="menu"
        aria-label={menuAriaLabel}
        className={cn(
          "invisible absolute z-50 w-[15.5rem] pt-3 opacity-0",
          flyoutSide === "right"
            ? "top-0 left-full translate-x-0 pl-3"
            : "top-full left-1/2 -translate-x-1/2"
        )}
      >
        <div className="border border-allure-petrol/10 bg-allure-sand/95 px-1 py-2 shadow-[0_18px_40px_-28px_rgba(30,75,93,0.45)] backdrop-blur-md dark:border-allure-sand/10 dark:bg-allure-petrol-deep/95 dark:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.55)]">
          <div
            aria-hidden
            data-apt-rule
            className="mx-3 mb-1 h-px origin-left scale-x-0 bg-gradient-to-r from-allure-gold/80 via-allure-gold/30 to-transparent"
          />
          <ul ref={listRef} className="flex flex-col">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  role="menuitem"
                  data-apt-item
                  onClick={() => setOpen(false)}
                  className="group/item flex cursor-pointer items-baseline justify-between gap-4 px-3 py-2.5 transition-colors duration-200 hover:bg-allure-petrol/[0.04] focus-visible:bg-allure-petrol/[0.06] focus-visible:outline-none dark:hover:bg-allure-sand/[0.06]"
                >
                  <span className="font-sans text-[12px] font-medium uppercase tracking-[0.14em] text-allure-ink/80 transition-colors duration-200 group-hover/item:text-allure-petrol dark:text-allure-sand/80 dark:group-hover/item:text-allure-gold">
                    {item.label}
                  </span>
                  <span className="font-sans text-[10px] tabular-nums tracking-[0.08em] text-allure-ink/35 dark:text-allure-sand/35">
                    {item.meta}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mx-3 mt-1 border-t border-allure-petrol/10 pt-1 dark:border-allure-sand/10">
            <Link
              href={href}
              role="menuitem"
              data-apt-item
              onClick={() => setOpen(false)}
              className="flex cursor-pointer px-0 py-2.5 font-sans text-[10px] uppercase tracking-[0.22em] text-allure-gold transition-opacity duration-200 hover:opacity-80"
            >
              {overviewLabel}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

type NavMobileSubnavProps = {
  href: string;
  label: string;
  items: readonly NavChild[];
  onNavigate?: () => void;
};

/**
 * Accordion mobile — enfants sous un lien parent.
 */
export function NavMobileSubnav({
  href,
  label,
  items,
  onNavigate,
}: NavMobileSubnavProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const panelId = useId();

  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel || reduced === null) return;

      const mobileItems = panel.querySelectorAll<HTMLElement>(
        "[data-apt-mobile-item]"
      );

      if (reduced === true) {
        gsap.set(panel, {
          height: open ? "auto" : 0,
          autoAlpha: open ? 1 : 0,
        });
        return;
      }

      if (!open) {
        gsap.to(panel, {
          height: 0,
          autoAlpha: 0,
          duration: 0.28,
          ease: EASE.soft,
        });
        return;
      }

      gsap.set(panel, { height: "auto", autoAlpha: 1, overflow: "hidden" });
      const h = panel.scrollHeight;
      gsap.fromTo(
        panel,
        { height: 0, autoAlpha: 0 },
        { height: h, autoAlpha: 1, duration: 0.35, ease: EASE.out }
      );
      gsap.fromTo(
        mobileItems,
        { autoAlpha: 0, x: -10 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.3,
          stagger: 0.04,
          delay: 0.06,
          ease: EASE.out,
        }
      );
    },
    { dependencies: [open, reduced] }
  );

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between gap-2">
        <Link
          href={href}
          data-mobile-link=""
          onClick={onNavigate}
          className="group relative flex-1 py-3 font-sans text-sm font-medium uppercase tracking-[0.12em] text-allure-ink/85 transition-colors duration-300 hover:text-allure-petrol dark:text-allure-sand/85 dark:hover:text-allure-gold"
        >
          <span data-nav-label>{label}</span>
          <span
            aria-hidden
            data-nav-line
            className="pointer-events-none absolute bottom-2 left-0 h-px w-16 origin-left scale-x-0 bg-current"
          />
        </Link>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? `Masquer ${label}` : `Afficher ${label}`}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex size-9 cursor-pointer items-center justify-center text-allure-petrol/70 transition-colors hover:text-allure-petrol dark:text-allure-sand/70 dark:hover:text-allure-gold"
        >
          <ChevronDown
            className={cn(
              "size-4 transition-transform duration-300",
              open && "rotate-180"
            )}
            aria-hidden
          />
        </button>
      </div>

      <div
        ref={panelRef}
        id={panelId}
        className="overflow-hidden"
        hidden={!open && reduced === true}
      >
        <ul className="mb-2 ml-1 border-l border-allure-petrol/15 pl-4 dark:border-allure-sand/15">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                data-apt-mobile-item
                data-mobile-link=""
                onClick={onNavigate}
                className="flex items-baseline justify-between gap-4 py-2.5 font-sans text-[13px] tracking-[0.04em] text-allure-ink/70 transition-colors duration-200 hover:text-allure-petrol dark:text-allure-sand/70 dark:hover:text-allure-gold"
              >
                <span>{item.label}</span>
                <span className="text-[10px] tabular-nums tracking-[0.08em] text-allure-ink/35 dark:text-allure-sand/35">
                  {item.meta}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** @deprecated utiliser NavFlyoutMenu */
export const ApartmentsNavMenu = NavFlyoutMenu;
/** @deprecated utiliser NavMobileSubnav */
export const ApartmentsMobileSubnav = NavMobileSubnav;
