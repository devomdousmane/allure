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
  /** Accordion inline — nav latérale hero (évite les flyouts qui se chevauchent). */
  variant?: "flyout" | "rail";
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
  variant = "flyout",
}: NavFlyoutMenuProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpen] = useState(false);
  const reduced = usePrefersReducedMotion();
  const menuId = useId();
  const isRail = variant === "rail";

  const clearClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    clearClose();
    closeTimer.current = setTimeout(() => setOpen(false), isRail ? 280 : 220);
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

      if (isRail) {
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
          { height: h, autoAlpha: 1, duration: 0.34, ease: EASE.out }
        );
        gsap.fromTo(
          flyItems,
          { autoAlpha: 0, x: -6 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.28,
            stagger: 0.035,
            delay: 0.04,
            ease: EASE.out,
          }
        );
        return;
      }

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
    { dependencies: [open, reduced, isRail] }
  );

  if (isRail) {
    return (
      <div
        ref={wrapRef}
        className={cn("flex w-full flex-col", className)}
        onPointerEnter={openMenu}
        onPointerLeave={scheduleClose}
        onFocusCapture={openMenu}
        onBlurCapture={(e) => {
          if (!wrapRef.current?.contains(e.relatedTarget as Node)) {
            scheduleClose();
          }
        }}
      >
        <div className="flex items-center gap-1">
          <Link
            href={href}
            data-header-link=""
            aria-current={active ? "page" : undefined}
            aria-expanded={open}
            aria-controls={menuId}
            className={cn(
              "group relative inline-flex min-w-0 flex-1 items-center gap-1.5 py-0.5 font-sans font-medium uppercase tracking-[0.14em] transition-colors duration-200",
              triggerClassName
            )}
            onClick={() => setOpen(false)}
          >
            <span data-nav-label className="relative z-[1] truncate">
              {label}
            </span>
            <span
              aria-hidden
              data-nav-line
              className={cn(
                "pointer-events-none absolute -bottom-0.5 left-0 h-px w-10 origin-left bg-allure-gold/90 transition-transform duration-300",
                active || open ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              )}
            />
          </Link>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={menuAriaLabel}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center text-white/55 transition-colors hover:text-allure-gold"
          >
            <ChevronDown
              aria-hidden
              className={cn(
                "size-3.5 transition-transform duration-300",
                open && "rotate-180 text-allure-gold"
              )}
            />
          </button>
        </div>

        <div
          ref={panelRef}
          id={menuId}
          role="menu"
          aria-label={menuAriaLabel}
          className="overflow-hidden"
          style={{ height: 0, opacity: 0 }}
        >
          <ul ref={listRef} className="mt-2 mb-1 flex flex-col border-l border-white/20 pl-3">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  role="menuitem"
                  data-apt-item
                  onClick={() => setOpen(false)}
                  className="group/item flex items-baseline justify-between gap-3 py-1.5 font-sans text-[11px] uppercase tracking-[0.12em] text-white/55 transition-colors duration-200 hover:text-allure-gold"
                >
                  <span className="truncate">{item.label}</span>
                  <span className="shrink-0 text-[9px] tabular-nums tracking-[0.08em] text-white/30 group-hover/item:text-white/50">
                    {item.meta}
                  </span>
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={href}
                role="menuitem"
                data-apt-item
                onClick={() => setOpen(false)}
                className="mt-0.5 block py-1.5 font-sans text-[10px] uppercase tracking-[0.18em] text-allure-gold/90 transition-colors hover:text-allure-gold"
              >
                {overviewLabel}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }

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
          "group relative inline-flex items-center gap-1 font-sans font-medium uppercase tracking-[0.12em] transition-colors duration-200",
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
            "relative z-[1] size-3.5 opacity-55 transition-transform duration-300 ease-out",
            open && "rotate-180 opacity-90"
          )}
        />
        <span
          aria-hidden
          data-nav-line
          className={cn(
            "pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left bg-current transition-transform duration-300 ease-out",
            active || open
              ? "scale-x-100"
              : "scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100"
          )}
        />
      </Link>

      <div
        ref={panelRef}
        id={menuId}
        role="menu"
        aria-label={menuAriaLabel}
        className={cn(
          "invisible absolute z-50 w-[16rem] opacity-0",
          flyoutSide === "right"
            ? "top-0 left-full pl-2"
            : "top-full left-1/2 -translate-x-1/2 pt-2"
        )}
      >
        {/* Pont hover — évite la fermeture entre le lien et le panneau */}
        <div
          aria-hidden
          className={cn(
            "absolute bg-transparent",
            flyoutSide === "right"
              ? "inset-y-0 left-0 w-2"
              : "inset-x-0 top-0 h-2"
          )}
        />
        <div className="border border-allure-petrol/12 bg-allure-sand/97 px-1 py-2 backdrop-blur-md dark:border-allure-sand/12 dark:bg-allure-petrol-deep/97">
          <div
            aria-hidden
            data-apt-rule
            className="mx-3 mb-1 h-px origin-left scale-x-0 bg-allure-gold/70"
          />
          <ul ref={listRef} className="flex flex-col">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  role="menuitem"
                  data-apt-item
                  onClick={() => setOpen(false)}
                  className="group/item relative flex cursor-pointer items-baseline justify-between gap-4 px-3 py-2.5 transition-colors duration-200 hover:bg-allure-petrol/[0.05] focus-visible:bg-allure-petrol/[0.07] focus-visible:outline-none dark:hover:bg-allure-sand/[0.07]"
                >
                  <span
                    aria-hidden
                    className="absolute top-1/2 left-0 h-0 w-0.5 -translate-y-1/2 bg-allure-gold transition-all duration-200 ease-out group-hover/item:h-3.5 group-focus-visible/item:h-3.5"
                  />
                  <span className="font-sans text-[12px] font-medium uppercase tracking-[0.14em] text-allure-ink/80 transition-colors duration-200 group-hover/item:text-allure-petrol dark:text-allure-sand/80 dark:group-hover/item:text-allure-gold">
                    {item.label}
                  </span>
                  <span className="font-sans text-[10px] tabular-nums tracking-[0.08em] text-allure-ink/35 transition-colors duration-200 group-hover/item:text-allure-ink/55 dark:text-allure-sand/35 dark:group-hover/item:text-allure-sand/55">
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
              className="group/overview flex cursor-pointer items-center gap-2 px-0 py-2.5 font-sans text-[10px] uppercase tracking-[0.22em] text-allure-gold transition-colors duration-200 hover:text-[color-mix(in_oklab,var(--allure-gold)_80%,var(--allure-petrol))]"
            >
              <span>{overviewLabel}</span>
              <span
                aria-hidden
                className="inline-block translate-x-0 transition-transform duration-200 group-hover/overview:translate-x-0.5"
              >
                →
              </span>
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
