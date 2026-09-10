"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { SiteLogo } from "@/components/layout/site-logo";
import { NAV_LINKS, isNavActive, isNavBranchActive } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { registerGsap } from "@/lib/gsap/register";
import { HERO_PIN_EVENT } from "@/lib/hero-pin";
import { DURATION, EASE, STAGGER } from "@/lib/gsap/presets";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import {
  NavFlyoutMenu,
  NavMobileSubnav,
} from "@/components/layout/apartments-nav-menu";

registerGsap();

function NavLink({
  href,
  label,
  className,
  active,
  "data-header-link": dataHeaderLink,
  "data-mobile-link": dataMobileLink,
  onClick,
}: {
  href: string;
  label: string;
  className?: string;
  active?: boolean;
  "data-header-link"?: boolean;
  "data-mobile-link"?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      data-header-link={dataHeaderLink ? "" : undefined}
      data-mobile-link={dataMobileLink ? "" : undefined}
      data-nav-active={active ? "" : undefined}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      className={cn(
        "group relative inline-flex cursor-pointer items-center font-sans font-medium uppercase tracking-[0.12em] transition-colors duration-200",
        active && "text-allure-petrol dark:text-allure-gold",
        className
      )}
    >
      <span data-nav-label className="relative z-[1]">
        {label}
      </span>
      <span
        aria-hidden
        data-nav-line
        className={cn(
          "pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left bg-current transition-transform duration-300 ease-out",
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100"
        )}
      />
    </Link>
  );
}

export function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // false par défaut : le pin hero (cinematic) active le rail ; HomeHero n'en a pas
  const [heroOverlay, setHeroOverlay] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closingRef = useRef(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (pathname !== "/") {
      setHeroOverlay(false);
      return;
    }

    const onPin = (event: Event) => {
      const active = (event as CustomEvent<{ active: boolean }>).detail?.active;
      setHeroOverlay(Boolean(active));
    };
    window.addEventListener(HERO_PIN_EVENT, onPin);
    return () => window.removeEventListener(HERO_PIN_EVENT, onPin);
  }, [pathname]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  useGSAP(
    () => {
      const root = headerRef.current;
      if (!root || reduced === null) return;

      const logo = root.querySelector<HTMLElement>("[data-header-logo]");
      const links = root.querySelectorAll<HTMLElement>(
        "nav[data-desktop-nav] [data-header-link]"
      );
      const icons = root.querySelectorAll<HTMLElement>("[data-header-icon]");
      const cta = root.querySelector<HTMLElement>("[data-header-cta]");
      const targets = [logo, ...links, ...icons, cta].filter(
        Boolean
      ) as HTMLElement[];

      if (reduced === true) {
        gsap.set(targets, { autoAlpha: 1, clearProps: "transform" });
        return;
      }

      gsap.set(targets, { autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: EASE.out },
        delay: 0.18,
      });

      if (logo) {
        tl.fromTo(
          logo,
          { autoAlpha: 0, y: -14, scale: 0.94 },
          { autoAlpha: 1, y: 0, scale: 1, duration: DURATION.fast },
          0
        );
      }

      if (links.length) {
        tl.fromTo(
          links,
          { autoAlpha: 0, y: -12 },
          {
            autoAlpha: 1,
            y: 0,
            duration: DURATION.fast,
            stagger: STAGGER.items * 0.65,
          },
          0.1
        );
      }

      if (icons.length) {
        tl.fromTo(
          icons,
          { autoAlpha: 0, scale: 0.65, rotate: -18 },
          {
            autoAlpha: 1,
            scale: 1,
            rotate: 0,
            duration: DURATION.fast,
            stagger: 0.07,
          },
          0.18
        );
      }

      if (cta) {
        tl.fromTo(
          cta,
          { autoAlpha: 0, y: -10, scale: 0.92 },
          { autoAlpha: 1, y: 0, scale: 1, duration: DURATION.fast },
          0.26
        );
      }
    },
    { scope: headerRef, dependencies: [reduced] }
  );

  useGSAP(
    () => {
      const root = headerRef.current;
      if (!root || reduced !== false) return;

      const cleanups: Array<() => void> = [];

      root
        .querySelectorAll<HTMLElement>("nav[data-desktop-nav] [data-header-link]")
        .forEach((link) => {
          const line = link.querySelector<HTMLElement>("[data-nav-line]");
          const label = link.querySelector<HTMLElement>("[data-nav-label]");
          if (!line) return;

          const isActive =
            link.hasAttribute("data-nav-active") ||
            link.getAttribute("aria-current") === "page";

          gsap.set(line, {
            scaleX: isActive ? 1 : 0,
            transformOrigin: "left center",
          });

          const enter = () => {
            gsap.to(line, {
              scaleX: 1,
              duration: 0.35,
              ease: EASE.out,
            });
            if (label) {
              gsap.to(label, { y: -1, duration: 0.25, ease: EASE.soft });
            }
          };
          const leave = () => {
            gsap.to(line, {
              scaleX: isActive ? 1 : 0,
              transformOrigin: isActive ? "left center" : "right center",
              duration: 0.3,
              ease: EASE.soft,
              onComplete: () => {
                if (!isActive) {
                  gsap.set(line, { transformOrigin: "left center" });
                }
              },
            });
            if (label) {
              gsap.to(label, { y: 0, duration: 0.25, ease: EASE.soft });
            }
          };

          link.addEventListener("pointerenter", enter);
          link.addEventListener("pointerleave", leave);
          cleanups.push(() => {
            link.removeEventListener("pointerenter", enter);
            link.removeEventListener("pointerleave", leave);
          });
        });

      root.querySelectorAll<HTMLElement>("[data-header-icon]").forEach((el) => {
        const enter = () =>
          gsap.to(el, { scale: 1.08, duration: 0.25, ease: EASE.out });
        const leave = () =>
          gsap.to(el, { scale: 1, duration: 0.3, ease: EASE.soft });
        const down = () =>
          gsap.to(el, { scale: 0.92, duration: 0.12, ease: EASE.soft });
        const up = () =>
          gsap.to(el, { scale: 1.08, duration: 0.2, ease: EASE.out });

        el.addEventListener("pointerenter", enter);
        el.addEventListener("pointerleave", leave);
        el.addEventListener("pointerdown", down);
        el.addEventListener("pointerup", up);
        cleanups.push(() => {
          el.removeEventListener("pointerenter", enter);
          el.removeEventListener("pointerleave", leave);
          el.removeEventListener("pointerdown", down);
          el.removeEventListener("pointerup", up);
        });
      });

      const cta = root.querySelector<HTMLElement>("[data-header-cta]");
      if (cta) {
        const enter = () =>
          gsap.to(cta, { y: -2, duration: 0.25, ease: EASE.out });
        const leave = () =>
          gsap.to(cta, { y: 0, duration: 0.3, ease: EASE.soft });
        cta.addEventListener("pointerenter", enter);
        cta.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          cta.removeEventListener("pointerenter", enter);
          cta.removeEventListener("pointerleave", leave);
        });
      }

      const logo = root.querySelector<HTMLElement>("[data-header-logo]");
      if (logo) {
        const enter = () =>
          gsap.to(logo, { scale: 1.04, duration: 0.3, ease: EASE.out });
        const leave = () =>
          gsap.to(logo, { scale: 1, duration: 0.35, ease: EASE.soft });
        logo.addEventListener("pointerenter", enter);
        logo.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          logo.removeEventListener("pointerenter", enter);
          logo.removeEventListener("pointerleave", leave);
        });
      }

      return () => cleanups.forEach((fn) => fn());
    },
    { scope: headerRef, dependencies: [reduced, pathname] }
  );

  useGSAP(
    () => {
      const btn = menuBtnRef.current;
      if (!btn || reduced === null) return;
      const icon = btn.querySelector<HTMLElement>("[data-menu-icon]");
      if (!icon) return;

      if (reduced === true) return;

      gsap.fromTo(
        icon,
        { rotate: menuOpen ? -90 : 90, autoAlpha: 0, scale: 0.7 },
        {
          rotate: 0,
          autoAlpha: 1,
          scale: 1,
          duration: 0.35,
          ease: EASE.out,
        }
      );
    },
    { dependencies: [menuOpen, reduced] }
  );

  useGSAP(
    () => {
      const panel = mobilePanelRef.current;
      if (!panel || reduced === null) return;

      const links = panel.querySelectorAll<HTMLElement>("[data-mobile-link]");
      const lines = panel.querySelectorAll<HTMLElement>("[data-nav-line]");
      const cta = panel.querySelector<HTMLElement>("[data-mobile-cta]");

      if (!menuOpen) {
        if (!closingRef.current) {
          gsap.set(panel, { autoAlpha: 0, height: 0 });
        }
        return;
      }

      closingRef.current = false;

      if (reduced === true) {
        gsap.set(panel, { autoAlpha: 1, height: "auto", clearProps: "opacity" });
        gsap.set(lines, { scaleX: 0 });
        return;
      }

      gsap.set(panel, { autoAlpha: 1, height: "auto", overflow: "hidden" });
      const targetHeight = panel.scrollHeight;
      gsap.set(lines, { scaleX: 0, transformOrigin: "left center" });

      const tl = gsap.timeline({ defaults: { ease: EASE.out } });

      tl.fromTo(
        panel,
        { height: 0, autoAlpha: 0 },
        {
          height: targetHeight,
          autoAlpha: 1,
          duration: 0.45,
          onComplete: () => {
            gsap.set(panel, { height: "auto" });
          },
        },
        0
      );

      tl.fromTo(
        links,
        { autoAlpha: 0, x: -16 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.4,
          stagger: 0.055,
        },
        0.12
      );

      tl.to(
        lines,
        {
          scaleX: 1,
          duration: 0.4,
          stagger: 0.05,
          ease: EASE.soft,
        },
        0.22
      );

      if (cta) {
        tl.fromTo(
          cta,
          { autoAlpha: 0, y: 14, scale: 0.96 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.4 },
          0.28
        );
      }
    },
    { dependencies: [menuOpen, reduced] }
  );

  useGSAP(
    () => {
      const panel = mobilePanelRef.current;
      if (!panel || reduced !== false || !menuOpen) return;

      const cleanups: Array<() => void> = [];

      panel.querySelectorAll<HTMLElement>("[data-mobile-link]").forEach((link) => {
        const line = link.querySelector<HTMLElement>("[data-nav-line]");
        const enter = () => {
          gsap.to(link, { x: 4, duration: 0.25, ease: EASE.out });
          if (line) {
            gsap.to(line, { scaleX: 1, duration: 0.3, ease: EASE.out });
          }
        };
        const leave = () => {
          gsap.to(link, { x: 0, duration: 0.3, ease: EASE.soft });
          if (line) {
            gsap.to(line, { scaleX: 0.35, duration: 0.3, ease: EASE.soft });
          }
        };

        link.addEventListener("pointerenter", enter);
        link.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          link.removeEventListener("pointerenter", enter);
          link.removeEventListener("pointerleave", leave);
        });
      });

      return () => cleanups.forEach((fn) => fn());
    },
    { dependencies: [menuOpen, reduced] }
  );

  function closeMobileMenu() {
    const panel = mobilePanelRef.current;
    if (!panel || reduced === true) {
      setMenuOpen(false);
      return;
    }

    closingRef.current = true;
    const links = panel.querySelectorAll<HTMLElement>("[data-mobile-link]");
    const cta = panel.querySelector<HTMLElement>("[data-mobile-cta]");

    const tl = gsap.timeline({
      defaults: { ease: EASE.soft },
      onComplete: () => {
        setMenuOpen(false);
        closingRef.current = false;
      },
    });

    tl.to([links, cta].filter(Boolean), {
      autoAlpha: 0,
      y: -6,
      duration: 0.2,
      stagger: 0.03,
    });
    tl.to(panel, { height: 0, autoAlpha: 0, duration: 0.35 }, "-=0.05");
  }

  function toggleMenu() {
    if (menuOpen) closeMobileMenu();
    else setMenuOpen(true);
  }

  const overlayNav = pathname === "/" && heroOverlay && !menuOpen;
  const prevOverlay = useRef(overlayNav);

  const linkTone = overlayNav
    ? "text-[11px] tracking-[0.16em] text-white/80 transition-colors duration-200 hover:text-allure-gold xl:text-xs"
    : "text-[12px] tracking-[0.14em] text-allure-ink/75 transition-colors duration-200 hover:text-allure-petrol xl:text-[13px] dark:text-allure-sand/75 dark:hover:text-allure-gold";

  useGSAP(
    () => {
      const root = headerRef.current;
      const bar = root?.querySelector<HTMLElement>("[data-header-bar]");
      if (!root || !bar || reduced !== false) {
        prevOverlay.current = overlayNav;
        return;
      }

      const links = root.querySelectorAll<HTMLElement>(
        "nav[data-desktop-nav] [data-header-link]"
      );
      const changed = prevOverlay.current !== overlayNav;
      prevOverlay.current = overlayNav;
      if (!changed) return;

      if (overlayNav) {
        gsap.fromTo(
          bar,
          { x: -36, autoAlpha: 0.35 },
          { x: 0, autoAlpha: 1, duration: 0.85, ease: EASE.out }
        );
        if (links.length) {
          gsap.fromTo(
            links,
            { autoAlpha: 0, x: -12 },
            {
              autoAlpha: 1,
              x: 0,
              duration: DURATION.fast,
              stagger: 0.055,
              delay: 0.12,
              ease: EASE.out,
            }
          );
        }
        return;
      }

      gsap.fromTo(
        bar,
        { y: -28, autoAlpha: 0.4 },
        { y: 0, autoAlpha: 1, duration: 0.8, ease: EASE.out }
      );
      if (links.length) {
        gsap.fromTo(
          links,
          { autoAlpha: 0, y: -14 },
          {
            autoAlpha: 1,
            y: 0,
            duration: DURATION.fast,
            stagger: 0.05,
            delay: 0.1,
            ease: EASE.out,
          }
        );
      }
    },
    { scope: headerRef, dependencies: [overlayNav, reduced] }
  );

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "fixed z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500",
          overlayNav
            ? "pointer-events-none inset-x-0 top-0 bg-transparent lg:inset-x-auto lg:inset-y-0 lg:left-0 lg:w-[13.5rem] xl:w-60"
            : scrolled || menuOpen
              ? "inset-x-0 top-0 w-full bg-allure-sand/92 shadow-[0_1px_0_0_rgba(30,75,93,0.08)] backdrop-blur-md dark:bg-allure-petrol-deep/92 dark:shadow-[0_1px_0_0_rgba(224,191,137,0.08)]"
              : "inset-x-0 top-0 w-full bg-transparent"
        )}
      >
        <div
          data-header-bar
          className={cn(
            "flex w-full px-5 sm:px-6 lg:px-10 xl:px-14",
            overlayNav
              ? "pointer-events-none relative items-center justify-between py-3 lg:h-full lg:flex-col lg:items-stretch lg:justify-between lg:px-5 lg:py-9 lg:pb-12"
              : "items-center gap-4 py-3.5 lg:gap-8"
          )}
        >
          {overlayNav ? (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 hidden bg-gradient-to-r from-black/55 via-black/30 to-transparent lg:block"
            />
          ) : null}
          <div
            data-header-logo
            className="pointer-events-auto shrink-0 will-change-transform"
          >
            <SiteLogo
              height={overlayNav ? 48 : 64}
              priority
              inverted={overlayNav || (!scrolled && !menuOpen)}
            />
          </div>

          <nav
            data-desktop-nav
            aria-label="Navigation principale"
            className={cn(
              "min-w-0",
              overlayNav
                ? "pointer-events-auto hidden w-full flex-col items-stretch gap-3 lg:flex"
                : "hidden flex-1 items-center justify-center gap-6 lg:flex xl:gap-8 2xl:gap-10"
            )}
          >
            {NAV_LINKS.map((link) => {
              if ("hasChildren" in link && link.hasChildren) {
                const active = isNavBranchActive(
                  pathname,
                  link.href,
                  link.children
                );
                return (
                  <NavFlyoutMenu
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    items={link.children}
                    overviewLabel={link.overviewLabel}
                    menuAriaLabel={link.menuAriaLabel}
                    active={active}
                    variant={overlayNav ? "rail" : "flyout"}
                    flyoutSide={overlayNav ? "right" : "bottom"}
                    triggerClassName={cn(
                      linkTone,
                      active &&
                        (overlayNav
                          ? "text-allure-gold"
                          : "text-allure-petrol dark:text-allure-gold")
                    )}
                  />
                );
              }
              const active = isNavActive(pathname, link.href);
              return (
                <NavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  active={active}
                  data-header-link
                  className={cn(linkTone, overlayNav && "py-0.5")}
                />
              );
            })}
          </nav>

          <div
            className={cn(
              "hidden shrink-0 items-center gap-3 lg:flex",
              overlayNav
                ? "pointer-events-auto mt-auto flex-col items-start gap-3"
                : "ml-auto"
            )}
          >
            <div data-header-icon className="will-change-transform">
              <ThemeToggle
                className={
                  overlayNav
                    ? "text-white hover:bg-white/10 dark:text-white dark:hover:bg-white/10"
                    : undefined
                }
              />
            </div>
            <div
              data-header-cta
              className={cn(
                "will-change-transform",
                overlayNav && "hidden"
              )}
            >
              <Button
                asChild
                size="lg"
                className="btn-cta cursor-pointer font-sans text-xs uppercase tracking-[0.12em]"
              >
                <Link href="/rendez-vous">Planifier une visite</Link>
              </Button>
            </div>
          </div>

          <div
            className={cn(
              "ml-auto flex shrink-0 items-center gap-1 lg:hidden",
              overlayNav && "pointer-events-auto"
            )}
          >
            <div data-header-icon className="will-change-transform">
              <ThemeToggle
                className={
                  overlayNav
                    ? "text-white hover:bg-white/10 dark:text-white dark:hover:bg-white/10"
                    : undefined
                }
              />
            </div>
            <button
              ref={menuBtnRef}
              data-header-icon
              type="button"
              className={cn(
                "site-icon flex h-9 w-9 cursor-pointer items-center justify-center will-change-transform",
                overlayNav
                  ? "text-white"
                  : "text-allure-petrol dark:text-allure-sand"
              )}
              onClick={toggleMenu}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              <span data-menu-icon className="inline-flex">
                {menuOpen ? <X size={26} /> : <Menu size={26} />}
              </span>
            </button>
          </div>
        </div>

        <div
          id="mobile-nav"
          ref={mobilePanelRef}
          className={cn(
            "overflow-hidden border-allure-petrol/10 bg-allure-sand/95 backdrop-blur-md lg:hidden dark:border-allure-sand/10 dark:bg-allure-petrol-deep/95",
            menuOpen
              ? "border-t"
              : "pointer-events-none h-0 border-t-0 opacity-0"
          )}
          aria-hidden={!menuOpen}
        >
          <nav
            aria-label="Navigation mobile"
            className="flex flex-col gap-1 px-5 py-5 sm:px-6"
          >
            {NAV_LINKS.map((link) => {
              if ("hasChildren" in link && link.hasChildren) {
                return (
                  <NavMobileSubnav
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    items={link.children}
                    onNavigate={closeMobileMenu}
                  />
                );
              }
              const active = isNavActive(pathname, link.href);
              return (
                <NavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  active={active}
                  data-mobile-link
                  onClick={closeMobileMenu}
                  className="py-3 text-sm text-allure-ink/85 transition-colors duration-200 hover:text-allure-petrol dark:text-allure-sand/85 dark:hover:text-allure-gold"
                />
              );
            })}
            <div data-mobile-cta className="pt-3">
              <Button
                asChild
                size="lg"
                className="btn-cta w-full cursor-pointer font-sans text-xs uppercase tracking-[0.12em]"
              >
                <Link href="/rendez-vous" onClick={closeMobileMenu}>
                  Planifier une visite
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
