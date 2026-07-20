"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import type { ApartmentDetail } from "@/data/apartments/types";
import { formatSurface, shortApartmentName } from "@/data/apartments/format";

type ApartmentStickyCtaProps = {
  apartment: ApartmentDetail;
};

// Apparaît une fois le hero (et son propre CTA) sorti de l'écran — sur une
// page aussi longue, sans elle "Planifier une visite" n'est visible qu'au
// tout début ou en tout bas.
export function ApartmentStickyCta({ apartment }: ApartmentStickyCtaProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector("section");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: "-10% 0px 0px 0px" }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const shortName = shortApartmentName(apartment.name);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-allure-petrol/10 bg-white/95 px-5 py-3 backdrop-blur-md dark:border-allure-sand/10 dark:bg-allure-petrol-deep/95 sm:px-6"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate font-heading text-sm text-allure-petrol dark:text-allure-sand sm:text-base">
                {shortName}
                <span className="mx-2 text-allure-ink/30 dark:text-allure-sand/30">
                  ·
                </span>
                <span className="text-allure-gold">
                  {formatSurface(apartment.surfaceTotal)}
                </span>
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="h-11 shrink-0 rounded-full bg-allure-petrol text-white hover:bg-allure-petrol-deep dark:bg-allure-gold dark:text-allure-petrol-deep dark:hover:bg-allure-gold/90"
            >
              <Link href="/contact">Planifier une visite</Link>
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
