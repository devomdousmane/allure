"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { SiteLogo } from "@/components/layout/site-logo";
import { NAV_LINKS } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-allure-sand/90 backdrop-blur-md shadow-[0_1px_0_0_rgba(30,75,93,0.08)] dark:bg-allure-petrol-deep/90 dark:shadow-[0_1px_0_0_rgba(224,191,137,0.08)]"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-10">
        <SiteLogo height={44} priority inverted={!scrolled} />

        <nav className="hidden items-center gap-9 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-sans text-[13px] font-medium uppercase tracking-[0.12em] text-allure-ink/80 transition-colors hover:text-allure-petrol dark:text-allure-sand/80 dark:hover:text-allure-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <Button
            asChild
            size="lg"
            className="btn-3d rounded-full bg-allure-petrol text-white hover:bg-allure-petrol-deep dark:btn-3d-gold dark:bg-allure-gold dark:text-allure-petrol-deep dark:hover:bg-allure-gold/90"
          >
            <Link href="/contact">Planifier une visite</Link>
          </Button>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <button
            className="text-allure-petrol dark:text-allure-sand"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-allure-petrol/10 bg-allure-sand px-6 py-6 lg:hidden dark:border-allure-sand/10 dark:bg-allure-petrol-deep">
          <nav className="flex flex-col gap-5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-sans text-sm font-medium uppercase tracking-[0.12em] text-allure-ink/80 dark:text-allure-sand/80"
              >
                {link.label}
              </Link>
            ))}
            <Button
              asChild
              size="lg"
              className="mt-2 rounded-full bg-allure-petrol text-white hover:bg-allure-petrol-deep dark:bg-allure-gold dark:text-allure-petrol-deep dark:hover:bg-allure-gold/90"
            >
              <Link href="/contact" onClick={() => setMenuOpen(false)}>
                Planifier une visite
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
